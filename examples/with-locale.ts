import { Fluent } from "@moebius/fluent";

void (async () => {
  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: "en",
    source: (`welcome = Welcome!`),
  });

  // Use `withLocale()` method to create
  // translation function bound
  // to the specified locale:
  const translate = fluent.withLocale("en");

  console.log(
    translate("welcome"),
  );
})();
