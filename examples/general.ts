import { Fluent } from "@moebius/fluent";

void (async () => {
  // Instantiate a Fluent class
  const fluent = new Fluent();

  // Add as many translations as you need fo your Fluent instance
  await fluent.addTranslation({
    locales: "en",
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

  const output = fluent.translate("en", "welcome", {
    name: "Slava",
    value: 100.12345,
    applesCount: 5,
  });

  console.log(output);
})();
