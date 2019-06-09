// @RobertDaleSmith
'use-strict';

// dependencies
const fs = require('fs');
const path = require('path');
const dust = require('dustjs-linkedin');
const loaderUtils = require('loader-utils');


// Main loader function
async function loader(source) {

  const options = loaderUtils.getOptions(this) || {};

  //If root is configured then omit it from the template name
  const root = options['root'] ? `${path.normalize(options['root'])}${path.sep}` : '';

  if (this.cacheable) {
    this.cacheable();
  }

  if (typeof options === "string" && options.indexOf('preserveWhitespace') > -1) {
    dust.config.whitespace = true;
  }

  if (options['preserveWhitespace']) {
    dust.config.whitespace = true;
  }

  // Get the path
  const template_path = path.relative(options.root, this.resourcePath);

  // Find regular dust partials, updating the source as needed for relatively-pathed partials
  source = findPartials(source, template_path + '/../', options);

  const context = this.rootContext || this.options.context; 

  const name = this.resourcePath
    .replace(context + path.sep + root, '')
    .replace('.dust', '')
    .split(path.sep)
    .join('/');

  // Compile the template
  const compiled = dust.compile(source, name);

  const returnedString = await new Promise(function(resolve, reject) {
    dust.loadSource(compiled);
    dust.renderSource(source, {}, function(err, result) {
      if(err) console.log(err);
      resolve(result);
    });
  });

  if (options.html === 'string') return htmlString;

  return "module.exports = \"" + htmlString.replace(/\"/g, "\\\"") + "\"";
}

// Find and Compile DustJS partials
function findPartials(source, source_path, options) {
  var reg = /({>\s?")([^"{}]+)("[\s\S]*?\/})/g, // matches dust partial syntax
    result = null, partial;

  // search source & add a dependency for each match
  while ((result = reg.exec(source)) !== null) {
    partial = {
      name: result[2],
    };

    // grab partial source
    partial.path = options.root+"/"+partial.name+".dust";
    partial.source = fs.readFileSync(partial.path, 'utf8');

    // compile and cache partial
    var compiled = dust.compile(partial.source, partial.name);
    dust.loadSource(compiled);
  }

  return source;
}

// Export actual loader method
module.exports = loader;
