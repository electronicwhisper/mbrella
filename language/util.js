// http://javascript.crockford.com/remedial.html
function typeOf(value){
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        }
        else {
            s = 'null';
        }
    }
    return s;
}

function arrayLike(o) {
    return (typeOf(o.length) === "number" && typeof o !== "string");
}
function objectLike(o) {
    return (typeOf(o) === "object");
}
function forEach(o, f) {
    if (arrayLike(o)) {
        for (var i = 0, len = o.length; i < len; i++) {
            f(o[i], i);
        }
    } else if (objectLike(o)) {
        for (var i in o) if (o.hasOwnProperty(i)) {
            f(o[i], i);
        }
    }
}



var environment = {
    make: function (parentEnv) {
        var lookup = {};
        return {
            set: function (k, v) {
                lookup[k] = v;
            },
            unset: function (k) {
                delete lookup[k];
            },
            get: function (k) {
                var ret = lookup[k];
                if (ret !== undefined) {
                    return ret;
                } else if (parentEnv) {
                    return parentEnv.get(k);
                } else {
                    return undefined;
                }
            }
        };
    },
    makeFromFunc: function (f) {
        return {
            get: f
        };
    },
    empty: {
        get: function (s) {
            throw "Not found in environment: "+s;
        }
    }
};





function getFreeVariables(code, env) {
    if (!env) env = environment.make();
    
    if (typeOf(code) === "string") {
        return [];
    } else {
        if (code[0] === "get") {
            var varName = code[1];
            if (!env.get(varName)) {
                return [varName];
            }
        } else if (code[0] === "var") {
            var varName = code[1];
            env.set(varName, true);
        } else if (code[0] === "func") {
            var childEnv = environment.make(env);
            forEach(code[1], function (p) {
                childEnv.set(p, true);
            });
            return getFreeVariables(code[2], childEnv);
        }
        
        var ret = [];
        forEach(code, function (moreCode) {
            ret = ret.concat(getFreeVariables(moreCode, env));
        });
        return ret;
    }
}

function processJS(code) {
    return [
        "js",
        getFreeVariables(code),
        JSTranslator.match(code, "trans")
    ];
}





function stringifyCode(code) {
    if (arrayLike(code)) {
        if (code[0] === "js") {
            return "[" + stringifyCode(code[0]) + "," + stringifyCode(code[1]) + "," + "function (" + code[1].join(",") + ") {return " + code[2] + ";}"+ "]";
        } else {
            var ret = [];
            forEach(code, function (c) {
                ret.push(stringifyCode(c));
            });
            return "[" + ret.join(",") + "]";
        }
    } else {
        return JSON.stringify(code);
    }
}

function compileMbrella(mbr) {
    var compiled = Mbrella.matchAll(mbr, "expr");
    return "mbrellaCode=" + stringifyCode(compiled) + ";";
}
