# import-glob-keyed

A small fork of `import-glob` to provide the modules keyed against their filenames.

Standard import-glob returns:
```
import * as allModules0 from './foo/1.js';
import * as allModules1 from './foo/bar/2.js';
let allModules = [allModules0, allModules1];
```

This fork returns:
```
import * as allModules0 from './foo/1.js';
import * as allModules1 from './foo/bar/2.js';
let allModules = { 
  "./foo/1.js": allModules0, 
  "./foo/bar/2.js": allModules1
};
```


---
```js
import modules from "./foo/**/*.js";
```
Expands into
```js
import * as module0 from "./foo/1.js";
import * as module1 from "./foo/bar/2.js";
import * as module2 from "./foo/bar/3.js";

modules: {
  "./foo/1.js": module0,
  "./foo/bar/2.js": module1,
  "./foo/bar/3.js": module2
}
```
---
__For side effects:__

```js
import "./foo/**/*.scss";
```
Expands into
```js
import "./foo/1.scss";
import "./foo/bar/2.scss";
```
---
__For sass:__

```scss
@import "./foo/**/*.scss";
```
Expands into
```scss
@import "./foo/1.scss";
@import "./foo/bar/2.scss";
```

---

## Install
```sh
npm install import-glob-keyed --save-dev
```

## Usage
You can use it one of two ways, the recommended way is to use it as a preloader

```js
{
  module: {
    preloaders: [{
      test: /\.js/,
      loader: 'import-glob-keyed'
    },
    {
      test: /\.scss/,
      loader: 'import-glob-keyed'
    }
    ]
  }
}
```

Alternatively you can use it as a chained loader
```js
require('!import-glob-keyed!foo/bar.js')
```
