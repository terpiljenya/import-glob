import allModules from './foo/**/*.js';
import testModules from './foo/**/test.js';

import './foo/**/*.scss';

console.log(allModules);
console.log(testModules);

console.log(allModulesByPath);
console.log(testModulesByPath);
