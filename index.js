var glob = require("glob");
var path = require("path");

module.exports = function(source) {
  this.cacheable();
  var regex = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  var resourceDir = path.dirname(this.resourcePath);
  function replacer(match, obj, quote, filename) {
    var modules = [];
    if (!glob.hasMagic(filename)) return match;
    var result = glob.sync(filename, {
      cwd: resourceDir
    })
    .map(function(file, index) {
      var moduleName = obj + index;
      modules.push(moduleName);
      return 'import * as ' + moduleName + ' from ' + quote + file + quote;
    })
    .join(';\n');
    if (result) {
      result += '\nlet ' + obj + ' = Object.assign(' + modules.join(', ') + ')';
    }
    return result;
  }
  var res = source.replace(regex, replacer);
  return res;
};
