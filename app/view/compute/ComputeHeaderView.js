Ext.define('Onc.view.compute.ComputeHeaderView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.computeheader',

    frame: true,
    height: 50,
    bodyPadding: 5,

    layout: {type: 'hbox', align: 'middle'},

    initComponent: function() {
        var rec = this.record;

        this.defaults = {
            xtype: 'gauge',
            margin: '0 5px',
            width: 200
        };
        this.items = [
            {label: 'CPU', itemId: 'cpu-gauge', iconCls: 'icon-cpu',
             value: 0, max: rec.getMaxCpuLoad(), display: ['fixed', 2]},
            {label: 'MEM', itemId: 'memory-gauge', iconCls: 'icon-memory',
             value: 0, max: rec.get('memory'), unit: 'MB'},
            {label: 'NET', itemId: 'network-gauge', iconCls: 'icon-network',
             value: 0, max: rec.get('network'), unit: 'Mbs', display: ['fixed', 2],
             convert: function(v) { return v * 8 / Math.pow(10, 6); }},
            {label: 'DISK (/)', itemId: 'diskspace-gauge', iconCls: 'icon-hd',
             value: 0, max: rec.get('diskspace')['/'], unit: 'GB', display: ['fixed', 2],
             convert: function(v) { return v / 1024; }}
        ];

        this.callParent(arguments);
    },

    onRender: function() {
        this.callParent(arguments);
        this._streamSubscribe();
    },

    _streamSubscribe: function() {
        var baseUrl= this.record.get('url');
        this.subscription = Onc.hub.Hub.subscribe(this._onDataFromHub.bind(this), {
            'cpu': baseUrl + 'metrics/{0}_usage'.format('cpu'),
            'memory': baseUrl + 'metrics/{0}_usage'.format('memory'),
            'network': baseUrl + 'metrics/{0}_usage'.format('network'),
            'diskspace': baseUrl + 'metrics/{0}_usage'.format('diskspace'),
        }, 'gauge');
    },

    _onDataFromHub: function(values) {
        Ext.Object.each(values, function(name, value) {
            this.child('#{0}-gauge'.format(name)).setValue(value);
        }.bind(this));
    },

    onDestroy: function() {
        this.callParent(arguments);
        this.subscription.unsubscribe();
    }
});
