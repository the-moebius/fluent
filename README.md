
# @moebius/fluent

<!-- NPM Badge -->
<a href="https://badge.fury.io/js/@moebius%2Ffluent">
  <img src="https://badge.fury.io/js/@moebius%2Ffluent.svg" alt="npm version" height="18">
</a>

<!-- MIT License Badge -->
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
</a>

Better [Fluent][fluent-js] integration for JavaScript.


## Features

- Simplifies usage of [Fluent][fluent-js],

- Allows you to specify translations as text or load them
  from the filesystem,

- Supports automatic
  [language negotiation and fallback](#language-negotiation-and-fallback)
  based on the registered locales and the locales supported
  by the client,

- Supports
  [attributes](https://projectfluent.org/fluent/guide/attributes.html)
  out of the box,

- **All LTS Node.js versions are supported**
  (starting from Node 12),

- **Written completely in TypeScript** from scratch
  in a very strict manner with 100% type coverage
  (and no *any*'s), ensuring that the library code
  is correct (type safe) by itself and also
  **provides high quality typing declarations** to make
  sure that your code is also correct and type safe,

- **Enables amazing type completion** for your IDE
  (even if you are not using TypeScript) thanks to the
  provided typing declarations,

- **Minimal possible dependencies**
  (all are high quality ones) updated to the latest versions,

- **Source maps** for the library is generated
  and provided to you for easier debugging,

- warning handling and logging are fully customizable
  to suit your individual needs.


## Install

Install the library:

```shell
npm install --save @moebius/fluent
```


## Usage

### Add translations

```typescript
import { Fluent } from '@moebius/fluent';

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
});
```


### Use the Fluent instance directly

```typescript
const output = fluent.translate('ru', 'welcome', {
  name: 'Slava',
  value: 100.12345,
  applesCount: 5,
});

console.log(output);
```


### Bind the locale

You can use a helper-method to bind the specified locale
for you:

```typescript

// Use `withLocale()` method to create
// translation function bound
// to the specified locale:
const translate = fluent.withLocale('ru');

// You can also use a shorthand syntax:
const t = fluent.withLocale('ru');

output = translate('welcome', {
  name: 'Slava',
  value: 100.12345,
  applesCount: 5,
});

output = t('hello');
```


### Load translations from file system

```typescript
await fluent.addTranslation({
  locales: 'ru',
  filePath: `${__dirname}/translation.ru.ftl`,
});
```

You can specify multiple files via an array.

If later files would contain messages with the previously used IDs
they will overwrite previous messages:

```typescript
await fluent.addTranslation({
  locales: 'ru',
  filePath: [
    `${__dirname}/feature-1/translation.ru.ftl`,
    `${__dirname}/feature-2/translation.ru.ftl`
  ],
});
```


### Specify bundle options

```typescript
await fluent.addTranslation({
  locales: 'ru',
  source: `…`,
  bundleOptions: {
    // This will disable appearance of "space"
    // characters around placeables
    useIsolating: false,
  }
});
```

## Language negotiation and fallback

This library implements smart language negotiation and
a fallback logic. It works the following way:

1. You add translations and specify supported locale(s)
   for each translation.

2. When calling `translate()` you specify locale(s)
   supported by your user.

3. The library will automatically match requested locale(s)
   with the registered translations and will build a
   prioritized list of translations that could be used.

4. The library will then try to find requested message in
   the best possible translation and if it's not available
   it will try another translation in set.

5. If all matched translations doesn't have the specified
   message, then the generic placeholder will be returned
   instead (e.g. `{message-id}`). The library will also
   generate warning messages in the console to let you
   know when any specific translation doesn't have the
   specified message (so you can fix it). Warning handling
   and logging [could be easily customized](#warning-handling).


## Warning handling

By default, Fluent will log all the warnings using `console.warn`.
However, this could easily be customized.


### Using custom logging function

```typescript
import { Fluent, LoggingWarningHandler } from '@moebius/fluent';

// Instructing Fluent to use custom logging function
const fluent = new Fluent({
  warningHandler: new LoggingWarningHandler({
    logFunction: (...args) => {
      // @todo: implement your custom logging function
    },
  })
});
```

See the [custom-logger](./examples/custom-logger.ts) example.


### Using custom warning handler

```typescript
import { Fluent, WarningHandler, Warning } from '@moebius/fluent';

class MyWarningHandler implements WarningHandler {

  public handleWarning(warning: Warning): void {
    // @todo: implement your custom warning handling,
    //        the `warning` object contains useful exception details
  }

}

const fluent = new Fluent({
  warningHandler: new MyWarningHandler(),
});
```

See the [warning-handler](./examples/warning-handler.ts) example.


## Examples

You can find various usage examples in the
[examples](./examples) directory of the library.


### Running examples

In order to run any example on your machine, do the following:

1. **Clone the repository:**

   ```shell
   git clone https://github.com/moebius/fluent.git
   cd ./fluent
   ```

2. **Install all the dependencies:**

   ```shell
   npm install
   ```

3. **Run the following command:**

   ```shell
   npx ts-node \
     -P ./tsconfig.examples.json \
     -r tsconfig-paths/register \
     {PATH TO EXAMPLE}
   ```

   **Example:**

   ```shell
   npx ts-node \
     -P ./tsconfig.examples.json \
     -r tsconfig-paths/register \
     ./examples/general.ts
   ```

   Output of the executed requests will be logged
   to the terminal.


## License (MIT)

Copyright © 2021 Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


  [fluent-js]: https://github.com/projectfluent/fluent.js
