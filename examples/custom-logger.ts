
import { Fluent } from '@moebius/fluent';

import { LoggingWarningHandler } from '../src/warnings/logging-warning-handler';


void (async () => {

  // Instructing Fluent to use custom logging function
  const fluent = new Fluent({
    warningHandler: new LoggingWarningHandler({
      logFunction: (...args) => console.log(
        args.join('').toUpperCase()
      ),
    })
  });

  await fluent.addTranslation({
    locales: 'en-GB',
    source: '',
  });

  // {welcome}
  console.debug(fluent.translate('en', 'welcome'));

})();
