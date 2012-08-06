Ext.define('Onc.controller.LoginController', {
    extend: 'Ext.app.Controller',

    views: ['LoginWindow', 'Viewport'],

    refs: [{ref: 'searchResults', selector: '#search-results'},
           {ref: 'tabs', selector: '#mainTabs'}],

    _viewport: null,


    busListeners: {
        doLogout: function(){
            this._logout();
        }
    },


    init: function() {
        Onc.core.Backend.on('loginrequired', this._login.bind(this));

        Onc.core.Backend.request('GET', 'auth')
            .success(this._onAuth.bind(this))
            .failure(function(response) {
                console.assert(response.status === 403);
            });

        this.control({
            'loginwindow': {
                login: function(token) {
                    this._onAuth();
                }.bind(this)
            }
        });
    },

    _logout: function() {
        Onc.core.Backend.request('GET', 'logout');
        this._login();
    },

    _login: function() {
        if (this._viewport)
            this._viewport.destroy();
        this._viewport = this.getView('LoginWindow').create();
    },

    _onAuth: function() {
        Onc.core.hub.Hub.run();
        var cstore = Ext.getStore('SearchResultsStore');
        cstore.getProxy().extraParams['q'] = 'virt:no';
        cstore.load();
        if (this._viewport)
            this._viewport.destroy();
        this._viewport = this.getView('Viewport').create();
    }
});
