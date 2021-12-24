
import { Fluent } from '@moebius/fluent';


void (async () => {

  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: 'en',
    source: (`
messages=
    `),
  });

  await fluent.addTranslation({
    locales: 'en-AU',
    source: (`
messages=
    `),
  });

  await fluent.addTranslation({
    locales: 'en-GB',
    source: (`
messages=
    `),
  });

  await fluent.addTranslation({
    locales: 'ru',
    source: (`
messages=
  .hello = Привет!
    `),
    isDefault: true,
  });

  // Привет
  console.debug(fluent.translate('en-AU', 'messages.hello'));

})();
