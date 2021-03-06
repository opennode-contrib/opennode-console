Ext.define('Onc.core.Backend', {
    extend: 'Ext.util.Observable',
    requires: ['Onc.core.util.Deferred'],
    singleton: true,

    constructor: function() {
        this.callParent(arguments);
        this.addEvents('loginrequired');
    },

    url: function(url) {
        return BACKEND_PREFIX + url.replace(/^\//,'');
    },

    request: function(method, url, options, request) {
        options = options || {};
        var successCodes = options.successCodes || [];
        delete options.successCodes;

        // This is (primarily) to support Onc.core.backend.Proxy:
        var callbackFn;
        if (request && request.callback) {
            callbackFn = request.callback;
            delete request.callback;
        } else {
            callbackFn = options.callback || Ext.emptyFn;
            delete options.callback;
        }

        var opts = {
            url: this.url(url),
            method: method,
            withCredentials: true,

            callback: function(_, success, response) {
                if (!success && (
                    (response.status === 403 && !(403 in successCodes)) ||
                    (response.status === 0 && response.responseText.length === 0)
                )) {
                    this.fireEvent('loginrequired');
                } else {
                    var result;
                    try {
                        result = Ext.decode(response.responseText);
                    } catch (ex) {
                        console.error("Error parsing JSON response:");
                        console.error(response.responseText);
                    }
                    if (!success) {
                        d.errback(result, response);
                    } else {
                        d.callback(result, response);
                    }
                    callbackFn.apply(window, arguments);
                }
            }.bind(this)
        };

        var keys = Ext.Object.getKeys(opts);
        console.assert(keys.every(function(k) { return !(k in options); }),
                       "Request options shouldn't specify any of {0}".format(keys.join(', ')));
        Ext.apply(options, opts);

        if (request) {
            for (var key in options) {
                if (request.hasOwnProperty(key))
                    console.warn("'%s' property of request will be overwritten", key);
            }
            Ext.apply(request, options);
            Ext.Ajax.request(request);
        } else {
            Ext.Ajax.request(options);
        }

        var d = new Onc.core.util.Deferred();
        return d;
    }
});