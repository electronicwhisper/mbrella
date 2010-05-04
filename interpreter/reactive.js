function makeReactive(state) {
    var listeners = [];
    
    return {
        isReactive: true,
        get: function () {
            return state;
        },
        set: function (newValue) {
            state = newValue;
            forEach(listeners, function (callback) {
                callback(state);
            });
        },
        addListener: function (callback) {
            listeners.push(callback);
            callback(state);
        },
        removeListener: function (callback) {
            var found;
            forEach(listeners, function (listener, i) {
                if (listener === callback) found = i;
            });
            if (found !== undefined) {
                listeners.splice(found, 1); // remove callback from the listeners array
            }
        }
    };
}

/*
    Applies the function f to a list of arguments args.
    Additionally, if any argument is reactive, this function returns a reactive value itself
        this value will update whenever one of the arguments updates,
        that is, it will apply f again whenever one of its inputs changes
        so that the output value is always "up-to-date"
    If none of the arguments are reactive, then this function just returns f applied to args
*/
function applyReactive(f, args) {
    
    function applyFunc() {
        var staticArgs = map(args, function (arg) {
            if (arg.isReactive) return arg.get();
            else return arg;
        });
        return f.apply(null, staticArgs);
    }
    
    var reactiveArgs = filter(args, function (arg) {
        return arg.isReactive;
    });
    
    if (reactiveArgs.length === 0) {
        return applyFunc();
    } else {
        var ret = makeReactive(applyFunc());
        
        function update() {
            ret.set(applyFunc());
        }
        
        forEach(reactiveArgs, function (arg) {
            // TODO: make this not fire each time initially
            // TODO: do garbage collection correctly with this
            arg.addListener(update);
        });
        
        return ret;
    }
}