
import { FluentBundle } from '@fluent/bundle';
import { Pattern } from '@fluent/bundle/esm/ast';
import { FluentVariable } from '@fluent/bundle/esm/bundle';

import { GetPatternOptions, PatternStore } from './pattern-store';


export type TranslationContext = (
  Record<string, FluentVariable>
);


export class Translator implements PatternStore {

  private parentPatternStore: PatternStore;

  private readonly locales = this.bundle.locales;


  constructor(
    private readonly bundle: FluentBundle
  ) {
  }


  public setParentStore(store: PatternStore): void {
    this.parentPatternStore = store;
  }

  public getPattern(
    options: GetPatternOptions

  ): Pattern | undefined {

    const {
      messageId,
      attributeName,
      skipParent,

    } = options;

    /**
     * Calls parent to get pattern from it,
     * if parent exists and if it's not forbidden.
     */
    const getFromParent = () => {
      return (!skipParent
        ? this.parentPatternStore
          ?.getPattern({
            callee: this,
            messageId,
            attributeName,
          })
        : undefined
      );
    };

    let message = this.bundle.getMessage(messageId);
    if (!message) {
      console.warn(
        `Translation message (${messageId}) is not found ` +
        `for locale(s): ${this.locales.join(', ')}`
      );
      return getFromParent();

    }

    if (attributeName) {
      const pattern = message.attributes?.[attributeName];
      if (!pattern) {
        console.warn(
          `Missing attribute (${attributeName}) from ` +
          `message (${messageId}) for locale(s): ` +
          this.bundle.locales.join(', ')
        );
        return getFromParent();

      } else {
        return pattern;

      }

    } else {
      return message.value;

    }

  }

  public translate(
    path: string,
    context?: TranslationContext

  ): string {

    const [messageId, attributeName] = path.split('.', 2);

    const pattern = this.getPattern({
      messageId,
      attributeName,
    });

    if (pattern) {
      return this.bundle
        .formatPattern(pattern, context)
      ;

    } else {
      // Returning a translation placeholder
      return `{${path}}`;

    }

  }

}
