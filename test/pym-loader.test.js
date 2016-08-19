describe('pym-loader', function() {
    var loadViaEmbedding = function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            // Remove the script tag once pym it has been loaded
            if (head && script.parentNode) {
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    };

    var manualMessagelisteners = [];

    function registerAndAddMessageListener(f) {
        // Once we implement custom events we could use it to fire the test
        //document.body.addEventListener('loaded',f,false);
        window.addEventListener('message',f,false);
        manualMessagelisteners.push(f);
    };

    function removeManualMessageListeners() {
        for (var i=0; i < manualMessagelisteners.length; i++){
            // Once we implement custom events we could use it to fire the test
            // document.body.removeEventListener("loaded", manualMessagelisteners[i]);
            window.removeEventListener("message", manualMessagelisteners[i]);
        }
        manualMessagelisteners = [];
    };

    beforeEach(function() {
        document.body.innerHTML = __html__['test/html-fixtures/loader_single_template.html'];
    });

    afterEach(function() {
        document.body.innerHTML = '';
        // Clear manual event listeners
        removeManualMessageListeners();
    });

    describe('test setup', function() {
        it('should expose the templates to __html__', function() {
            window.requirejs
            expect(document.getElementById('auto-init-test1')).not.toBeNull();
        });
    });

    describe('load with requirejs', function() {
        beforeEach(function(done) {
            var handler = function(e) {
                done();
            };
            registerAndAddMessageListener(handler);
            loadViaEmbedding("http://localhost:9876/base/dist/pl.v1.m.js");
        });
        it('should load pym to the page and autoinit the parent', function(done) {
            setTimeout(function() {
                var not_init = document.querySelectorAll('[data-pym-src]:not([data-pym-auto-initialized])').length;
                var inited = document.querySelectorAll('[data-pym-src]').length;
                expect(not_init).toEqual(0);
                expect(inited).toEqual(1);
                done();
            }, 3000)
        });
    });

    describe('load with jquery', function() {
        var requirejs = null;
        beforeEach(function(done) {
            var handler = function(e) {
                if (e.data && e.data.lastIndexOf('pymxPYMxauto-init-test1xPYMxheightxPYMx', 0) === 0) done();
            };

            requirejs = window.requirejs;
            window.requirejs = undefined;
            registerAndAddMessageListener(handler);
            loadViaEmbedding("http://localhost:9876/base/dist/pl.v1.m.js");
        });

        afterEach(function() {
            window.requirejs = requirejs;
        });

        it('should load pym to the page and autoinit the parent', function() {
            var not_init = document.querySelectorAll('[data-pym-src]:not([data-pym-auto-initialized])').length;
            var inited = document.querySelectorAll('[data-pym-src]').length;
            expect(not_init).toEqual(0);
            expect(inited).toEqual(1);
        });
    });

    describe('append pym to head', function() {
        var requirejs = null;
        var jQuery = null;
        beforeEach(function(done) {
            var handler = function(e) {
                if (e.data && e.data.lastIndexOf('pymxPYMxauto-init-test1xPYMxheightxPYMx', 0) === 0) done();
            };

            requirejs = window.requirejs;
            jquery = window.jQuery;
            window.requirejs = undefined;
            window.jQuery = undefined;
            registerAndAddMessageListener(handler);
            loadViaEmbedding("http://localhost:9876/base/dist/pl.v1.m.js");
        });

        afterEach(function() {
            window.requirejs = requirejs;
            window.jQuery = jQuery;
        });
        it('should load pym to the page and autoinit the parent', function() {
            var not_init = document.querySelectorAll('[data-pym-src]:not([data-pym-auto-initialized])').length;
            var inited = document.querySelectorAll('[data-pym-src]').length;
            expect(not_init).toEqual(0);
            expect(inited).toEqual(1);
        });
    });
});
