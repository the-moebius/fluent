
import { Fluent, TranslationContext } from '@moebius/fluent';


void (async () => {

  // Instantiate a Fluent class
  const fluent = new Fluent();

  // Add as many translations as you need fo your Fluent instance
  await fluent.addTranslation({
    locales: 'en',
    source: (`
-brand-name = Super Project

welcome =
  Welcome, {$name}, to the {-brand-name}!
  Your balance is: {
    NUMBER($value, maximumFractionDigits: 2)
  }
  You have { NUMBER($applesCount) ->
    [0] no apples
    [one] {$applesCount} apple
    *[other] {$applesCount} apples
  }

  `),
    bundleOptions: {
      useIsolating: false,
    },
  });

  await fluent.addTranslation({
    locales: 'ru',
    source: (`
-brand-name = Супер Проект

welcome =
  Добро пожаловать, {$name}, в {-brand-name}!
  У Вас на счету: {
    NUMBER($value, maximumFractionDigits: 2)
  }
  У вас { NUMBER($applesCount) ->
    [0] нет яблок
    [one] {$applesCount} яблоко
    [few] {$applesCount} яблока
    *[other] {$applesCount} яблок
  }
  `),
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
    fluent.translate('en', 'welcome', context) + `\n`
  );

  console.log(
    fluent.translate('ru', 'welcome', context)
  );

})();
