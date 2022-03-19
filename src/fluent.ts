
import { FluentBundle, FluentResource, FluentVariable } from '@fluent/bundle';
import { Pattern } from '@fluent/bundle/esm/ast';
import { negotiateLanguages } from '@fluent/langneg';

import { readFile } from './read-file';
import { LoggingWarningHandler } from './warnings/logging-warning-handler';
import { WarningHandler } from './warnings/warnings';


export interface FluentOptions {
  warningHandler?: WarningHandler;
}

export type LocaleId = string;

export type FluentBundleOptions = (
  ConstructorParameters<typeof FluentBundle>[1]
);

export interface AddTranslationOptions {
  locales: (LocaleId | LocaleId[]);
  source?: (string | string[]);
  filePath?: (string | string[]);
  bundleOptions?: FluentBundleOptions;
  isDefault?: boolean;
}

export interface GetTranslatorOptions {
  locales: (LocaleId | LocaleId[]);
}

export type TranslationContext = (
  Record<string, FluentVariable>
);


export class Fluent {

  private readonly bundles = (
    new Set<FluentBundle>()
  );

  private defaultBundle?: FluentBundle;

  private readonly warningHandler: WarningHandler;


  constructor(private readonly options: FluentOptions = {}) {

    this.warningHandler = (
      options.warningHandler ||
      new LoggingWarningHandler()
    );

  }


  public async addTranslation(
    options: AddTranslationOptions

  ): Promise<void> {

    const locales = (Array.isArray(options.locales)
      ? options.locales
      : [options.locales]
    );

    const sources = await this.handleSources({
      source: options.source,
      filePath: options.filePath,
    });

    const bundle = this.createBundle({
      locales,
      sources,
      bundleOptions: options.bundleOptions,
    });

    this.bundles.add(bundle);

    // Saving reference to the default bundle
    if (!this.defaultBundle || options.isDefault) {
      this.defaultBundle = bundle;
    }

  }

  public translate(
    localeOrLocales: (LocaleId | LocaleId[]),
    path: string,
    context?: TranslationContext

  ): string {

    const locales = (Array.isArray(localeOrLocales)
      ? localeOrLocales
      : [localeOrLocales]
    );

    const bundles = this.matchBundles(locales);

    for (const bundle of bundles) {

      const [messageId, attributeName] = path.split('.', 2);

      const message = bundle.getMessage(messageId);
      if (!message) {
        this.warningHandler.handleWarning({
          type: 'translate.bundle.missing-message',
          locales,
          path,
          matchedBundles: bundles,
          context,
          messageId,
          bundle,
        });
        continue;
      }

      let pattern: Pattern;

      if (attributeName) {
        pattern = message.attributes?.[attributeName];
        if (!pattern) {
          this.warningHandler.handleWarning({
            type: 'translate.message.missing-attribute',
            locales,
            path,
            matchedBundles: bundles,
            context,
            messageId,
            attributeName,
            bundle,
          });
          continue;
        }

      } else {
        pattern = (message.value || '');

      }

      return bundle.formatPattern(pattern, context);

    }

    this.warningHandler.handleWarning({
      type: 'translate.missing-translation',
      locales,
      path,
      matchedBundles: bundles,
      context,
    });

    // Returning translation placeholder in case when
    // message is not found
    return `{${path}}`;

  }

  /**
   * Returns translation function bound
   * to the specified locale(s).
   */
  public withLocale(
    localeOrLocales: (LocaleId | LocaleId[])
  ): (
    path: string,
    context?: TranslationContext

  ) => string {

    return this.translate.bind(this, localeOrLocales);

  }


  private async handleSources(options: {
    source?: (string | string[]);
    filePath?: (string | string[]);

  }): Promise<string[]> {

    if (options.filePath && options.source) {
      throw new Error(
        `You should specify either "filePath" or "source" ` +
        `option, not both`
      );
    }

    if (options.source || options.source === '') {
      return (
        Array.isArray(options.source)
          ? options.source.map($source => String($source))
          : [String(options.source)]
      );

    } else if (options.filePath) {

      const filePaths = Array.isArray(options.filePath)
        ? options.filePath
        : [options.filePath]
      ;

      const sources: string[] = [];

      for (const filePath of filePaths) {
        sources.push(await readFile(filePath));
      }

      return sources;

    } else {
      throw new Error(
        `You should specify "filePath" or "source" option`
      );

    }

  }

  private createBundle(options: {
    locales: LocaleId[];
    sources: string[];
    bundleOptions?: FluentBundleOptions;

  }): FluentBundle {

    const {
      locales,
      sources,
      bundleOptions = {},

    } = options;

    const bundle = new FluentBundle(locales, bundleOptions);

    for (const source of sources) {
      const errors = bundle.addResource(
        new FluentResource(source), {
          allowOverrides: true,
        }
      );

      if (errors?.length > 0) {
        for (const error of errors) {
          console.error(error);
        }
        throw new Error(
          `Failed to parse Fluent resource, please check and ` +
          `correct the errors printed above`
        );
      }

    }

    return bundle;

  }

  /**
   * Finds the most suitable bundles
   * for the specified locales.
   */
  private matchBundles(
    locales: LocaleId[]

  ): Set<FluentBundle> {

    // Building a list of all the registered locales
    const availableLocales = new Set(
      Array.from(this.bundles)
        .reduce<string[]>(($locales, bundle) => [
            ...$locales,
            ...bundle.locales
          ], []
        )
    );

    // Finding the best match
    const matchedLocales = negotiateLanguages(
      locales,
      Array.from(availableLocales)
    );

    // For each matched locale, finding the first bundle
    // that includes it
    const matchedBundles = <FluentBundle[]> (
      matchedLocales
        .map(
          locale => (Array.from(this.bundles)
            .find(bundle => bundle.locales.includes(locale))
          )
        )
        .filter(Boolean)
    );

    // Always adding the default bundle
    // to the end of the list
    if (this.defaultBundle) {
      matchedBundles.push(this.defaultBundle);
    }

    return new Set(matchedBundles);

  }

}
