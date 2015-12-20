var glob = require("glob");
var path = require("path");

module.exports = function(source) {
  this.cacheable();
  var regex = /import+ ?(\w+ from)? +([\'\"])(.*?)\2/gm
  var importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  var importFiles = /import +([\'\"])(.*?)\1/gm;
  var module =true;
  var resourceDir = path.dirname(this.resourcePath);
  function replacer(match, obj, quote, filename) {
    var modules = [];
    if (!glob.hasMagic(filename)) return match;
    var result = glob.sync(filename, {
      cwd: resourceDir
    })
    result=result.map(function(file, index) {
      var fileName = quote + file + quote;
      if (match.match(importModules)){
        var moduleName = obj + index;
        modules.push(moduleName);
        return 'import * as ' + moduleName + ' from ' + fileName;
      }else if(match.match(importFiles)){
        module = false;
        return 'import '+ fileName
      }
    })
    .join(';\n');
    if (result && module) {
      result += '\nlet ' + obj + ' = [' + modules.join(', ') + ']';
    }
    return result;
  }
  var res = source.replace(regex, replacer);
  return res;
};
