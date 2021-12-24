
import { Fluent } from '@moebius/fluent';


void (async () => {

  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: 'ru',
    source: (`
messages=
  .welcome = Добро пожаловать!
    `),
    bundleOptions: {
      useIsolating: false,
    },
  });

  await fluent.addTranslation({
    locales: 'en',
    source: (`
messages=
  .welcome = Welcome!
  .hello = Hello!
    `),

    // Marking this translator as the default one
    isDefault: true,

    bundleOptions: {
      useIsolating: false,
    },
  });

  console.log(
    // This will return translation from the default translator
    fluent.translate('ru', 'messages.hello')
  );

})();
