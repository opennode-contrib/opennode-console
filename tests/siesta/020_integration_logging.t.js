StartTest(function(t) {
    t.diag("Integration Login test");

    var async = t.beginAsync();
    t.waitForAjaxRequest(function() {
        t.endAsync(async);
    });

    Onc.core.Backend.request('POST', 'auth', {
        successCodes: [403],
        jsonData: {
            'username': 'wrong',
            'password': 'wrong'
        },
        callback: function(options, success, response){
            t.ok(!success, 'Negative case');
        },
        scope: this
    });

    Onc.core.Backend.request('POST', 'auth', {
        successCodes: [403],
        jsonData: {
            'username': 'dev',
            'password': 'dev'
        },
        callback: function(options, success, response){
            t.ok(success, 'Positive case');
        },
        scope: this
    });

});
