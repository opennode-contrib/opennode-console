Ext.define('Onc.model.Compute', {
    extend: 'Onc.model.Base',
    fields: [
        {name: 'id', type: 'string', persist: false},
        {name: 'url', type: 'string', persist: false},
        {name: 'tags'},

        {name: 'architecture'},
        {name: 'cpu_info', type: 'string'},
        {name: 'os_release', type: 'string'},
        {name: 'kernel', type: 'string'},
        {name: 'template', type: 'string'},

        {name: 'hostname', type: 'string'},
        {name: 'ipv4_address', type: 'string', sortType: 'asIpv4'},
        {name: 'ipv6_address', type: 'string', sortType: 'asIpv6'},

        {name: 'state', type: 'string'},
        {name: 'effective_state', type: 'string', persist: false},

        {name: 'num_cores', type: 'integer'},
        {name: 'memory', type: 'float'},
        {name: 'diskspace', convert: function(value) {
            for (var key in value)
                value[key] = Math.round(value[key]);
            return value;
        }},
        {name: 'network', type: 'float'},
        {name: 'swap_size', type: 'float'},

        {name: 'cpu_usage', type: 'float', persist: false},
        {name: 'memory_usage', type: 'float', persist: false},
        {name: 'diskspace_usage', persist: false},
        {name: 'network_usage', type: 'float', persist: false},

        {name: 'uptime', type: 'string', persist: false},

        {name: 'features'}
    ],

    proxy: {
        type: 'onc',
        reader: {
            type: 'json',
            root: 'children'
        },
        extraParams: {
            'depth': 3
        },
        limitParam: null, pageParam: null, startParam: null,
        url: 'computes'
    },

    getMaxCpuLoad: function() {
        return this.get('num_cores') * 1.0;
    },

    getUptime: function() {
        if (this.get('state') === 'inactive')
            return null;

        var s = Math.round(this.get('uptime'));

        var days = Math.floor(s / 86400);
        s -= days * 86400;

        var hours = Math.floor(s / 3600);
        s -= hours * 3600;

        var mins = Math.floor(s / 60);
        s -= mins * 60;

        return '' + days + 'd ' + hours + 'h ' + mins + 'm ' + s + 's';
    },

    getChild: function(name) {
        return this.children().findRecord('id', name);
    },

    getList: function(name) {
        var child = this.getChild(name);
        return child ? child.children() : null;
    },

    associations: [
        {
            type: 'polymorphic',
            model: 'Onc.model.Base',
            name: 'children',
            getTypeDiscriminator: function(node) {
                return'Onc.model.' + node['__type__'];
            }
        }
    ],
    hasMany: [
        {
            model: 'Onc.model.VirtualBridge',
            name: 'bridgeInterfaces',
            associationKey: 'bridge_interfaces'
        },
        {
            model: 'Onc.model.IpRoute',
            name: 'routes'
        },
        {
            model: 'Onc.model.Storage',
            name: 'storages'
        }
    ],

    getRepr: function() {
        return this.get('hostname');
    },

    toString: function() {
        return '<Compute {0}>'.format(this.getRepr());
    }
});
