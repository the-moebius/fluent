
import { FluentBundle } from '@fluent/bundle';
import { Pattern } from '@fluent/bundle/esm/ast';
import { FluentVariable } from '@fluent/bundle/esm/bundle';


export type TranslationContext = (
  Record<string, FluentVariable>
);


export class Translator {

  constructor(
    private readonly bundle: FluentBundle
  ) {
  }


  public translate(
    path: string,
    context?: TranslationContext

  ): string {

    const [messageId, attributeName] = path.split('.', 2);

    const message = this.bundle.getMessage(messageId);
    if (!message) {
      console.warn(
        `Translation message (${messageId}) is not found ` +
        `for locale(s): ${this.bundle.locales.join(', ')}`
      );

      // Returning translation placeholder in case when
      // message is not found
      return `{${path}}`;

    }

    let pattern: Pattern;

    if (attributeName) {
      pattern = message.attributes?.[attributeName];
      if (!pattern) {
        console.warn(
          `Missing attribute (${attributeName}) from ` +
          `message (${messageId}) for locale(s): ` +
          this.bundle.locales.join(', ')
        );

        // Returning translation placeholder in case when
        // message is not found
        return `{${path}}`;

      }

    } else {
      pattern = message.value;

    }

    return this.bundle.formatPattern(pattern, context);

  }

}
