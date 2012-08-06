StartTest(function(t) {
    t.diag("UI Login test");

    Onc.core.EventBus.fireEvent('doLogout');

    t.waitForCQ('loginwindow', function(components) {
        frm = components[0];
        var usr = frm.down('#username');
        var psw = frm.down('#password');

        t.chain({
            action      : 'wait',   // or "delay"
            delay       : 1000      // 1 second
        }, {
            action      : 'type',
            target      : usr,
            text        : "Some text"
        }, {
            action      : 'wait',   // or "delay"
            delay       : 1000      // 1 second
        }, {
            action      : 'type',
            target      : psw,
            text        : "Password"
        });
    });
});
