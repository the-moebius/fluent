import { Fluent } from "@moebius/fluent";

void (async () => {
  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: "en-GB",
    source: "",
  });

  // {welcome}
  console.debug(fluent.translate("en", "welcome"));
})();
