



/*

expr        = template | function | state | action | element | jsExpr,
template    = "template" "(" args:as ")" "{" lets:ls spaces expr:e "}"              -> [`template, as, ls, e],
function    = "function" jsFuncRest:f                                               -> [`function, f],
state       = "state" "(" jsExpr:j ")"                                              -> [`state, j],
action      = "action" jsFuncRest:f                                                 -> [`action, f],


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

var TEST;

function evalExpr(expr, env) {
    if (!env.isEnvironment) {
        console.log("not an env?", expr);
    }
    var head = expr[0];
    if (head === "template") {
        return evalTemplate(expr, env);
    } else if (head === "state") {
        var initialState = evalJS(expr[1], env);
        if (initialState.isReactive) {
            // throw error TODO
        }
        return TEST = makeReactive(initialState);
    } else if (head === "element") {
        return {xml: expr, env: env, isXML: true};
    } else if (head === "function" || head === "action") {
        // TODO: get rid of this redundancy (function vs action) in compilation?
        return evalExpr(expr[1], env);
    } else if (head === "js") {
        return evalJS(expr, env);
    }
}

function evalTemplate(template, env) {
    return function () {
        var paramValues = arguments;
        
        // extend the environment
        var newEnv = environment.make(env);
        
        // populate it with the arguments
        forEach(template[1], function (argName, i) {
            newEnv.set(argName, paramValues[i]);
        });
        
        // populate it with the let's
        forEach(template[2], function (let) {
            newEnv.set(let[1], evalExpr(let[2], newEnv));
        });
        
        // return the last line
        return evalExpr(template[3], newEnv);
    };
}

function evalJS(js, env) {
    var freeVariables = map(js[1], function (varName) {
        return env.get(varName);
    });
    
    return applyReactive(js[2], freeVariables);
}