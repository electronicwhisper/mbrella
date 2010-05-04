load("support/ometa-js/lib.js");
load("support/ometa-js/ometa-base.js");
load("support/ometa-js/parser.js");
load("support/ometa-js/bs-js-compiler.js");
load("support/ometa-js/bs-ometa-compiler.js");
load("support/ometa-js/bs-ometa-optimizer.js");
load("support/ometa-js/bs-ometa-js-compiler.js");


var translateCode = function(s) {
  var translationError = function(m, i) { alert("Translation error - please tell Alex about this!"); throw fail },
      tree             = BSOMetaJSParser.matchAll(s, "topLevel", undefined, function(m, i) { throw fail.delegated({errorPos: i}) })
  return BSOMetaJSTranslator.match(tree, "trans", undefined, translationError)
};



var langdef = read("language/mbrella.txt");

var code = translateCode(langdef);

write("language/mbrella.js", code);