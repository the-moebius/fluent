
import { BaseWarning, Warning, WarningHandler } from './warnings';


export interface LoggingWarningHandlerOptions {

  logFunction?: (...args: any) => void;

}


/**
 * A default implementation of logging warning handler
 * for Fluent. Logging function could be customized, while
 * `console.warn` is used by default.
 */
export class LoggingWarningHandler implements WarningHandler {

  private readonly writeLog: (...args: any) => void;


  constructor(private readonly options: LoggingWarningHandlerOptions = {}) {

    this.writeLog = (
      options?.logFunction ||
      console.warn
    );

  }


  public handleWarning(warning: Warning): void {

    switch (warning.type) {

      //============================//
      // TRANSLATE: MISSING MESSAGE //
      //============================//

      case 'translate.bundle.missing-message': {
        const { messageId, bundle } = warning;
        this.writeLog(
          `Translation message (${messageId}) is not found ` +
          `for locale(s): ${bundle.locales.join(', ')}`
        );
        break;
      }


      //==============================//
      // TRANSLATE: MISSING ATTRIBUTE //
      //==============================//

      case 'translate.message.missing-attribute': {
        const { attributeName, messageId, bundle } = warning;
        this.writeLog(
          `Missing attribute (${attributeName}) from ` +
          `message (${messageId}) for locale(s): ` +
          bundle.locales.join(', ')
        );
        break;
      }


      //================================//
      // TRANSLATE: MISSING TRANSLATION //
      //================================//

      case 'translate.missing-translation': {
        const { path, locales } = warning;
        this.writeLog(
          `Translation (${path}) was not found ` +
          `for requested locale(s): ${locales.join(', ')}`
        );
        break;
      }

      //==================//
      // UNKNOWN WARNINGS //
      //==================//

      default: {
        this.writeLog(
          `Unknown warning raised: ${(warning as BaseWarning).type}, ` +
          `please tell "@moebius/fluent" library author ` +
          `to fix this`
        );
        break;
      }

    }

  }

}
