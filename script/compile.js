load("support/ometa-js/lib.js");
load("support/ometa-js/ometa-base.js");
load("support/ometa-js/parser.js");

load("support/js-beautify/beautify.js");

load("language/mbrella.js");
load("language/util.js");


var app = read("app/app.mbr");

var compiledJS = (js_beautify(compileMbrella(app)));

write("app/app.js", compiledJS);