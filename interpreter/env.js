var environment = {
    make: function (parentEnv) {
        var lookup = {};
        return {
            isEnvironment: true,
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
            },
            debug: function () {
                return [lookup].concat(parentEnv.debug ? parentEnv.debug() : []);
            }
        };
    },
    makeFromFunc: function (f) {
        return {
            isEnvironment: true,
            get: f
        };
    },
    empty: {
        isEnvironment: true,
        get: function (s) {
            throw "Not found in environment: "+s;
        }
    }
};