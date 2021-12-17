
import { Fluent, TranslationContext } from '@moebius/fluent';


void (async () => {

  // Instantiate a Fluent class
  const fluent = new Fluent();

  // Add as many translations as you need fo your Fluent instance
  await fluent.addTranslation({
    locales: 'en',
    filePath: `${__dirname}/en.ftl`,
    bundleOptions: {
      useIsolating: false,
    },
  });

  await fluent.addTranslation({
    locales: 'ru',
    filePath: [
      `${__dirname}/ru-1.ftl`,
      `${__dirname}/ru-2.ftl`,

      // We could overwrite previous messages
      `${__dirname}/ru-3.ftl`,
    ],
    bundleOptions: {
      useIsolating: false,
    },
  });

  const context: TranslationContext = {
    name: 'Slava',
    value: 100.12345,
    applesCount: 5,
  };

  console.log(
    fluent.translate('en', 'welcome', context) + `\n\n`
  );

  console.log(
    fluent.translate('ru', 'welcome', context)
  );

})();
