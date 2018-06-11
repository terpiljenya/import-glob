var glob = require("glob");
var path = require("path");
var getOptions = require("loader-utils").getOptions;

module.exports = function(source) {
  this.cacheable();

  // Loader Options
  var options = getOptions(this) || {};
  var excludeExt = Boolean(options.excludeExt);

  var regex = /.?import + ?((\w+) +from )?([\'\"])(.*?)\3/gm;
  var importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  var importFiles = /import +([\'\"])(.*?)\1/gm;
  var importSass = /@import +([\'\"])(.*?)\1/gm;
  var resourceDir = path.dirname(this.resourcePath);

  function replacer(match, fromStatement, obj, quote, filename) {
    var modules = [];
    var withModules = false;
    if (!glob.hasMagic(filename)) return match;
    var result = glob
      .sync(filename, {
        cwd: resourceDir
      })
      .map(function(file, index) {
        var fileName;

        if(excludeExt) {
          const { dir, name } = path.parse(file);
          fileName = path.format({ dir, name });
        } else {
          fileName = file;
        }

        var quotedFileName = quote + fileName + quote;

        if (match.match(importSass)) {
          return '@import ' + quotedFileName;
        } else if (match.match(importModules)) {
          var moduleName = obj + index;
          modules.push(moduleName);
          withModules = true;
          return 'import * as ' + moduleName + ' from ' + quotedFileName;
        } else if (match.match(importFiles)) {
          return 'import ' + quotedFileName;
        }
      })
      .join('; ');
    if (result && withModules) {
      result += '; let ' + obj + ' = [' + modules.join(', ') + ']';
    }
    return result;
  }
  var res = source.replace(regex, replacer);
  return res;
};
