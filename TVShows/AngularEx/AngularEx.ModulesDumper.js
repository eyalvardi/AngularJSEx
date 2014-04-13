'use strict';
(function (angular) {
    var ngEx = window.angularEx;

    ngEx.printModuleTree = printModuleTree;
    ngEx.getModulesTree = getModulesTree;

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
   
    function printModuleTree(module) {
        var tree = getModulesTree(module);

        printModule(tree, 0);

        function printModule(m, level) {
            var space = '';
            for (var i = 0; i < level; i++) {
                space += ' ';
            }
            if (!m || typeof m === 'string') {
                console.log(space + m);
                return;
            }

            console.log(space + m.name);
            space += '  ';
            printItem('controllers', m.controllers, space);
            printItem('directive', m.directive, space);
            printItem('filter', m.filter, space);

            printItem('provider', m.provider, space);
            printItem('factory', m.factory, space);
            printItem('service', m.service, space);
            printItem('value', m.value, space);
            printItem('constant', m.constant, space);

            printItem('animation', m.animation, space);


            level += 4;
            if (m.requires && m.requires.length != 0) {
                console.log(space + 'requires');
                m.requires.forEach(function (mi) {
                    printModule(mi, level);
                });
            }
        }
    }
    function printItem(name, items, space) {
        if (!items) return;
        console.log(space + name);
        items.forEach(function (item) {
            console.log(space + '  ' + item);
        });
    }

    function getModulesTree(module) {
        module = module || ngEx.appModule;
        var m = {
            name: module.name,

            provider: getInvokeQueueItems('$provide', 'provider', module),
            factory: getInvokeQueueItems('$provide', 'factory', module),
            service: getInvokeQueueItems('$provide', 'service', module),
            value: getInvokeQueueItems('$provide', 'value', module),
            constant: getInvokeQueueItems('$provide', 'constant', module),

            controllers: getInvokeQueueItems('$controllerProvider', 'register', module),
            animation: getInvokeQueueItems('$animateProvider', 'register', module),
            filter: getInvokeQueueItems('$filterProvider', 'register', module),
            directive: getInvokeQueueItems('$compileProvider', 'directive', module),
            //config:'',
            //run: '',
            requires: buildRequires(module.requires)

        }
        for (var p in m) {
            if (!m[p]) {
                delete m[p];
            }
        }
        return m;
    }
    function buildRequires(requires) {
        var modules = [];
        if (requires) {
            requires.forEach(function (m) {
                if (ngEx.modules[m]) {
                    modules.push(getModulesTree(ngEx.modules[m]));
                }
            });
        }
        return modules;
    }
    function getInvokeQueueItems(provider, method, module) {
        var items = [];

        if (!module._invokeQueue || module._invokeQueue.length == 0) return;

        module._invokeQueue.forEach(function (item) {
            if (item[0] == provider && item[1] == method) {
                items.push((item[2][0]));
            }
        });

        if (items.length === 0) return;

        return items;
    }

})(angular);