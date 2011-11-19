Ext.BLANK_IMAGE_URL = 'ext-4.0/resources/themes/images/default/tree/s.gif';

Ext.Loader.setConfig('paths', {
    'Ext': 'ext-4.0/src',
    'opennodeconsole': './app/opennodeconsole'
});

Ext.Loader.setConfig({enabled: true, disableCaching: false})

Ext.syncRequire([
    'Ext.window.MessageBox',
    'Ext.XTemplate',
    'opennodeconsole.widgets.Gauge',
    'opennodeconsole.widgets.ComputeInfo',
    'opennodeconsole.widgets.ComputeListFilter',
    'opennodeconsole.widgets.Shell',
    'opennodeconsole.widgets.Vnc',
    'opennodeconsole.tabs.Tab',
    'opennodeconsole.tabs.StatusTab',
    'opennodeconsole.tabs.SystemTab',
    'opennodeconsole.tabs.NetworkTab',
    'opennodeconsole.tabs.StorageTab',
    'opennodeconsole.tabs.TemplatesTab',
    'opennodeconsole.tabs.ShellTab',
    'opennodeconsole.tabs.VncTab',
    'opennodeconsole.components.NewVmWindow',
    'opennodeconsole.polymorphic.Reader',
    'opennodeconsole.polymorphic.Association'
]);

Ext.application({
    name: 'opennodeconsole',

    appFolder: 'app',
    controllers: ['Computes'],
    autoCreateViewport: true
});


if (typeof console === 'undefined') {
    var c = console = {};
    c.debug = c.log = c.error = c.warn = c.assert = Ext.emptyFn;
}


// These are essentially IP address normalisers.
Ext.apply(Ext.data.SortTypes, {
    asIpv4: function(value) {
        return IPAddress.normalizeIpv4(value).addr;
    },

    asIpv6: function(value) {
        return IPAddress.normalizeIpv6(value).addr;
    }
});


IPAddress = {
    normalizeIpv4: function(value) {
        var addrAndPrefixLen = value.split('/');
        var address = addrAndPrefixLen[0];
        var prefixLen = parseInt(addrAndPrefixLen[1]);
        console.assert(Ext.isNumber(prefixLen));

        var normalizedAddr = value.split('.').map(function(part) {
            return part.lpad(3, '0');
        }).join('.');

        var netmask = [0, 8, 16, 24].map(function(i) {
            var numBitsInGroup = (prefixLen - i).constrain(0, 8);
            var groupInBin = '1'.repeat(numBitsInGroup).rpad(8, '0');
            return parseInt(groupInBin, 2);
        });

        return {
            addr: normalizedAddr,
            prefixLen: prefixLen,
            netmask: netmask.join('.')
        };
    },

    normalizeIpv6: function(value) {
        var addrAndPrefixLen = value.split('/');
        var address = addrAndPrefixLen[0];
        var prefixLen = parseInt(addrAndPrefixLen[1]);
        console.assert(Ext.isNumber(prefixLen));
        var groups = address.split(':');

        if (/[^0-9a-f:]/i.test(address) ||  // Chars other than HEX or :
            /[^:]{5,}/.test(address) ||  // More than 4 digits in a group
            /:{3,}/.test(address) ||  // :::, ::::, etc
            /:{2}/.test(address) && groups.length === 8 ||  // Extraneous ::
            groups.length > 8 ||
            groups.length < 8 && !/:{2}/.test(address))  // Missing ::
        {
            throw new Error('Invalid IPv6 address format');
        }

        if (groups.length < 8) {
            var extraZeroGroups = ['0000'].repeat(8 - groups.length + 1);
            var i = groups.indexOf('');
            console.assert(i !== -1);
            groups.splice.apply(groups, [i, 1].concat(extraZeroGroups));
            console.assert(groups.length === 8);
        }

        var normalizedAddr = groups.map(function(part) {
            return part.lpad(4, '0');
        }).join(':');
        return {addr: normalizedAddr,
                prefixLen: prefixLen};
    }
};


String.prototype.repeat = function(n) {
    var ret = '';
    for (var i = n; i > 0; i -= 1)
        ret += this;
    return ret;
};


String.prototype.reverse = function() {
    return this.split(new RegExp('')).reverse().join('');
};


String.prototype.lpad = function(n, c) {
    return Ext.String.leftPad(this, n, c);
};


String.prototype.rpad = function(n, c) {
    return this.reverse().lpad(n, c).reverse();
};


String.prototype.startswith = function(substr) {
    return this.substr(0, substr.length) === substr;
};


Array.prototype.repeat = function(n) {
    ret = [];
    for (var i = n; i > 0; i -= 1)
        ret = ret.concat(this);
    return ret;
};


Number.prototype.constrain = function(a, b) {
    return Math.min(b, Math.max(a, this));
};

/**
 * Amends existing methods to print out their name, arguments and return value.
 *
 * Useful for peeking into existing framework methods. Ignores
 * non-existing names, so changing 'methodName' to e.g. '#methodName'
 * will effectively comment out that item.
 */
function inspectMethods(methodNames) {
    methodNames.forEach(function iterator(name) {
        if (name in opennodeconsole.components.ContainerReader.prototype) {
            var stuff = {};
            stuff[name] = function() {
                var ret = this.callParent(arguments);
                if (ret !== undefined)
                    console.debug(name, "(", (arguments.length ? arguments : ''), ") => ", ret)
                else
                    console.debug(name, "(", (arguments.length ? arguments : ''), ")")
                return ret;
            };
            Ext.override(opennodeconsole.components.ContainerReader, stuff);
        }
    });
}

Ext.data.Association.create = function(association){
    if (!association.isAssociation) {
        if (Ext.isString(association)) {
            association = {
                type: association
            };
        }

        switch (association.type) {
        case 'belongsTo':
            return Ext.create('Ext.data.BelongsToAssociation', association);
        case 'hasMany':
            return Ext.create('Ext.data.HasManyAssociation', association);
        case 'polymorphic':
            return Ext.create('association.polymorphic', association);
        default:
            //<debug>
            Ext.Error.raise('Unknown Association type: "' + association.type + '"');
            //</debug>
        }
    }
    return association;
};
