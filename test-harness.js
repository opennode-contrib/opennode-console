var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title: 'ONC Test Suite',

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
        'tests/010_sanity.t.js'
    ]
});
