
import { Fluent } from '@moebius/fluent';

import { Warning, WarningHandler } from '../src/warnings/warnings';


void (async () => {

  class MyWarningHandler implements WarningHandler {

    public handleWarning(warning: Warning): void {
      console.warn(
        `Houston, we got a problem!`,
        JSON.stringify(warning, null, 4)
      );
    }

  }

  const fluent = new Fluent({
    warningHandler: new MyWarningHandler(),
  });

  await fluent.addTranslation({
    locales: 'en-GB',
    source: '',
  });

  // {welcome}
  console.debug(fluent.translate('en', 'welcome'));

})();
