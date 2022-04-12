export {
  FluentBundle,
  FluentResource,
} from "https://deno.land/x/fluent@v0.0.0/bundle/mod.ts";

export type { FluentVariable } from "https://deno.land/x/fluent@v0.0.0/bundle/mod.ts";

export type { Pattern } from "https://deno.land/x/fluent@v0.0.0/bundle/ast.ts";

export { negotiateLanguages } from "https://deno.land/x/fluent@v0.0.0/langneg/mod.ts";

export const readFile = Deno.readTextFile;
