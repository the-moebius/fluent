
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { negotiateLanguages } from '@fluent/langneg';

import { readFile } from './read-file';
import { TranslationContext, Translator } from './translator';


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


export class Fluent {

  private readonly bundles = (
    new Set<FluentBundle>()
  );

  private readonly translators = (
    new Map<string, Translator>()
  );

  private defaultBundle: FluentBundle;


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

    // Invalidating translators cache
    this.translators.clear();

    // Saving reference to the default bundle
    if (!this.defaultBundle || options.isDefault) {
      this.defaultBundle = bundle;
    }

  }

  public getTranslator(
    options: GetTranslatorOptions

  ): Translator {

    const locales = (Array.isArray(options.locales)
      ? options.locales
      : [options.locales]
    );

    const cacheId = locales.join(',');

    if (this.translators.has(cacheId)) {
      return this.translators.get(cacheId);
    }

    const bundle = this.findBundle(locales);

    if (!bundle) {
      throw new Error(
        `Failed to find suitable translation for locales: ` +
        locales.join(', ') + `. ` +
        `Make sure to add translations for all required locales ` +
        `before actually using the translator`
      );
    }

    const translator = new Translator(bundle);

    // Saving translator to the RAM-cache
    this.translators.set(cacheId, translator);

    return translator;

  }

  public translate(
    locales: (LocaleId | LocaleId[]),
    messageId: string,
    context?: TranslationContext

  ): string {

    const translator = this.getTranslator({
      locales,
    });

    return translator.translate(messageId, context);

  }


  private async handleSources(options: {
    source: (string | string[]);
    filePath: (string | string[]);

  }): Promise<string[]> {

    if (options.filePath && options.source) {
      throw new Error(
        `You should specify either "filePath" or "source" ` +
        `option, not both`
      );
    }

    if (options.source) {
      return (
        Array.isArray(options.source)
          ? options.source
          : [options.source]
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
   * Finds the most suitable bundle
   * for the specified locales.
   */
  private findBundle(
    locales: LocaleId[]

  ): FluentBundle | undefined {

    // Building a list of all the registered locales
    const availableLocales = Array.from(this.bundles)
      .reduce(($locales, bundle) => [
          ...$locales,
          ...bundle.locales
        ], []
      )
    ;

    // Finding the best match
    const [locale] = negotiateLanguages(
      locales,
      availableLocales, {
        defaultLocale: 'not-found',
        strategy: 'lookup',
      }
    );

    // Using default translation if negotiation fails
    if (locale === 'not-found') {
      return this.defaultBundle;
    }

    // Returning the first bundle that
    // supports the negotiated locale
    return Array.from(this.bundles)
      .find(bundle => bundle.locales.includes(locale))
    ;

  }

}
