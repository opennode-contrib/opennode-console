Ext.define('Onc.core.ui.widgets.Gauge', {
    extend: 'Ext.Component',
    alias: 'widget.gauge',

    cls: 'gauge',
    iconCls: null,

    width: 125,

    value: 0.0,
    max: 1.0,
    unit: null,
    criticalLevel: 0.00,
    criticalCurve: 0.05,

    // This must be either ['fixed', _] or ['precision', _] where _ is
    // an integer between 1 and 21 incl:
    display: null,
    defaultDisplay: ['fixed', 0],

    convert: function(v) { return v; },

    tpl: new Ext.XTemplate(
        '<span>',
        '    <tpl if="label"><label>{label}</label></tpl> ',
        '    <tpl if="max"><span class="percentage"></span>% /</tpl>',
        '    <span class="value"></span><tpl if="max"> of {[values._formatValue(values.max)]}</tpl><tpl if="unit"><b>{unit}</b></tpl>',
        '</span>',
        '<div class="bar"><div></div></div>'
    ),

    onRender: function() {
        this.callParent(arguments);
        this.tpl.overwrite(this.el, this);
        if (this.iconCls) {
            this.el.addCls(this.iconCls);
            this.el.addCls('with-icon');
        }
        if (this.border !== false)
            this.el.addCls('with-border');
    },

    listeners: {
        'afterrender': function(cmp, eOpts ){
            this.refresh();
        },
    },

    setValue: function(value) {
        this.value = value;
        this.refresh();
    },

    refresh: function() {
        if (this.rendered) {
            var ratio = (this.value / this.max).round(2);
            ratio = (isNaN(ratio) ? 0 : ratio);

            if (ratio > 1.0) {
                ratio = 1.0;
                this.el.down('.bar').addCls('overload');
            } else {
                this.el.down('.bar').removeCls('overload');
            }

            var ratioPercentage = (ratio * 100).round();
            this.el.down('.value').update(this._formatValue(this.value));
            if (this.el.down('.percentage'))
                this.el.down('.percentage').update('' + ratioPercentage);
            this.el.down('.bar div').setWidth('' + ratioPercentage + '%');

            this._doBgColor(ratio);
        }
    },

    _doBgColor: function(ratio) {
        var redMax = 1.0 - this.criticalLevel;
        var redLevel = ratio - this.criticalLevel;
        if (redLevel > 0) {
            var redFactor = Math.pow(redLevel / redMax, 100 * this.criticalCurve) * 255;
            var color = new Ext.draw.Color(redFactor, 0, 255 - redFactor);
            this.el.down('.bar div').applyStyles({'background-color': color});
        }
    },

    _formatValue: function(value) {
        if (value === undefined) return value;
        value = this.convert(value);
        var display = this.display || this.defaultDisplay;
        return value['to' + display[0].capitalize()](display[1]);
    }
});
