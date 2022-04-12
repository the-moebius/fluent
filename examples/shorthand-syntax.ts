
import { Fluent } from '@moebius/fluent';


void (async () => {

  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: 'en',
    source: (`welcome = Welcome!`),
  });

  // Creating a shorthand alias
  const t = fluent.withLocale('en');

  console.log(t('welcome'));

})();
