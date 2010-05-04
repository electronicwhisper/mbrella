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


function map(list, f) {
    var ret;
    if (arrayLike(list)) ret = [];
    else ret = {};
    
    forEach(list, function (val, key) {
        ret[key] = f(val, key);
    });
    return ret;
}

function filter(list, pred) {
    var ret = [];
    forEach(list, function (val, key) {
        if (pred(val, key)) {
            ret.push(val);
        }
    });
    return ret;
}

