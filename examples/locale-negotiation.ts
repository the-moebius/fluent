import { Fluent } from "@moebius/fluent";

/**
 * This example demonstrates a locale negotiation
 * mechanism, that allows to automatically select
 * the best possible locale for user.
 */
void (async () => {
  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: "en",
    source: (`welcome = Welcome!`),
  });

  await fluent.addTranslation({
    locales: "en-GB",
    source: (`welcome = Welcome! *British accent*`),
  });

  await fluent.addTranslation({
    locales: "ru",
    source: (`welcome = Добро пожаловать!`),

    // You can mark translation to be used by default
    // in case when negotiation fails
    isDefault: true,
  });

  // This will use the "en" locale as the best candidate
  const output = fluent.translate("en-AU", "welcome");

  console.log(output);
})();
