
import { Fluent } from '@moebius/fluent';


void (async () => {

  // Instantiate a Fluent class
  const fluent = new Fluent();

  // Add as many translations as you need fo your Fluent instance
  await fluent.addTranslation({
    locales: 'en',
    source: (`
foo = FOO
  .bar = BAR
  .baz = BAZ
  `),
    bundleOptions: {
      useIsolating: false,
    },
  });

  console.log(
    fluent.translate('en', 'foo'),
    fluent.translate('en', 'foo.bar'),
    fluent.translate('en', 'foo.baz'),
    fluent.translate('en', 'bar'), // not found
    fluent.translate('en', 'bar.baz'), // not found
  );

})();
