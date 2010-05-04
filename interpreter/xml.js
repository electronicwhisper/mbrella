goog.require('goog.dom');
goog.require('goog.events');


/*

node        = element | text,
element     = "<" name:n attributes:as "/>"                                         -> [`element, n, as, []]
            | "<" name:n attributes:as ">" node*:ns "</" name:n2 ">" ?(n==n2)       -> [`element, n, as, ns],
text        = (~"<" ~"{" char)+:cs                                                  -> [`text, [`strvalue, cs.join('')]]
            | insert:i                                                              -> [`text, i],
attribute   = name:n spaces "=" spaces value:v                                      -> [`att, n, v],
attributes  = (spaces attribute)*,

value       = insert | strvalue,
insert      = "{" jsExpr:j "}"                                                      -> [`insert, j],
strvalue    = str:s                                                                 -> [`strvalue, s]

*/

function writeXML(xml, env) {
    var head = xml[0];
    if (head === "element") {
        var el = goog.dom.createDom(xml[1]);
        
        // add attributes
        forEach(xml[2], function (attribute) {
            processInsert(attribute[2], env, function (val) {
                var props = {};
                props[attribute[1]] = val;
                goog.dom.setProperties(el, props);
            });
        });
        
        // add children
        forEach(xml[3], function (child) {
            var childDom = writeXML(child, env).dom;
            goog.dom.appendChild(el, childDom);
        });
        
        return {dom: el, cleanup: null};
    } else if (head === "text") {
        var el = goog.dom.createTextNode();
        processInsert(xml[1], env, function (val) {
            goog.dom.setTextContent(el, val);
        });
        
        return {dom: el, cleanup: null};
    } else if (head === "xmlcall") {
        var xmlenv = evalExpr(xml[1], env);
        if (!xmlenv.isXML) {
            console.error("Result of the f:call was not xml", xml[1]);
        }
        return writeXML(xmlenv.xml, xmlenv.env);
    } else if (head === "xmleach") {
        
    } else if (head === "xmlon") {
        /*
        goog.events.listen(domNode, eventName, callbackFunction)
        */
    }
}

function processInsert(ins, env, callback) {
    var head = ins[0];
    if (head === "insert") {
        var v = evalExpr(ins[1], env);
        if (v.isReactive) {
            v.addListener(callback);
            // TODO: make sure we pass back a cleanup function
        } else {
            callback(v);     
        }
    } else if (head === "strvalue") {
        // just a static string
        callback(ins[1]);
    }
}