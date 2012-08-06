var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title: 'ONC Test Suite',
    overrideSetTimeout: false,

    preload: [
        "lib/ext-4.1/resources/css/ext-all.css",
        "lib/ext-4.1/ext-all.js",
        {
            text: "Ext.Loader.setConfig('paths', {" +
                  "'Ext': 'lib/ext-4.1/src'," +
                  "'Onc': './app'," +
                  "'Ext.ux': 'lib/ext-4.1/examples/ux' }); " +
                  "Ext.Loader.setConfig({ enabled : true})"
        },
        "lib/log4js/sm/log/log4js-ext-all.js",
        "support.js",
        "util.js",
        "conf-default.js",
        "config.js",
        "app.js",

        "lib/term/ShellInABox.js",
        "lib/term/jquery.min.js",
//        "lib/term/knockout-1.2.1.js",
//        "lib/novnc/vnc.js"

    ]
});


Harness.start({
    group: 'Sanity',
    items: [
        'tests/siesta/010_sanity.t.js',
    ]
}, {
    group: 'Integration',
    items: [
        'tests/siesta/020_integration_logging.t.js'
    ]
}, {
    group: 'UI',
    items: [
        'tests/siesta/030_ui_logging.t.js'
    ]
});
