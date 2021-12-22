
import { FluentBundle } from '@fluent/bundle';
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
    messageId: string,
    context?: TranslationContext

  ): string {

    const message = this.bundle.getMessage(messageId);

    if (message?.value) {
      return this.bundle.formatPattern(
        message.value,
        context
      );

    } else {
      console.warn(
        `Translation message (${messageId}) is not found ` +
        `for locale(s): ${this.bundle.locales.join(', ')}`
      );

      // Returning translation placeholder in case when
      // message is not found
      return `{${messageId}}`;

    }

  }

}
