(function (angular) {
    var moduleFn = angular.module,
        originalModules = {},
        appModule = undefined,
        rootElement = {},
        requires = [],
       
        isString = angular.isString,
        isArray = angular.isArray,
        isFunction = angular.isFunction;

   

    //DEFER_BOOTSTRAP!
    window.name = 'NG_DEFER_BOOTSTRAP!';

    /////////////////////////////////////////
    //  AngularJS override module function
    ////////////////////////////////////////
    angular.module = function (moduleName, req,config) {
        var mi = moduleFn(moduleName, req, config);
        originalModules[mi.name] = mi;
        return mi;
    };
    

    /////////////////////////////////////////
    //   Document Ready
    ////////////////////////////////////////
    angular.element(document).ready(function () {

        findNgAppElement(window.document);

        window.angularEx = {
            appModule: appModule,
            modules: originalModules,
            printModuleTree: printModuleTree,
            getModulesTree: getModulesTree
        };

        angular.resumeBootstrap([]);
    });

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
    
    function deleteModuleInTree(module, originalmodules) {
        if (!module || !module.requires || module.requires.length == 0) return;
        forEach(module.requires, function (name) {
            deleteModuleInTree(originalmodules[name], originalmodules);
            delete originalmodules[name];
        });
    }
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
        module = module || appModule;

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
        for (p in m) {
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
                if (originalModules[m]) {
                    modules.push(getModulesTree(originalModules[m]));
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
    
    /////////////////////////////////////////
    //   AngularJS Methods (Copy)
    ////////////////////////////////////////
    function findNgAppElement(element) {
        var elements = [element],
        appElement,
        module,
        names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
        NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;

        function append(element) {
            element && elements.push(element);
        }

        forEach(names, function (name) {
            names[name] = true;
            append(document.getElementById(name));
            name = name.replace(':', '\\:');
            if (element.querySelectorAll) {
                forEach(element.querySelectorAll('.' + name), append);
                forEach(element.querySelectorAll('.' + name + '\\:'), append);
                forEach(element.querySelectorAll('[' + name + ']'), append);
            }
        });

        forEach(elements, function (element) {
            if (!appElement) {
                var className = ' ' + element.className + ' ';
                var match = NG_APP_CLASS_REGEXP.exec(className);
                if (match) {
                    appElement = element;
                    module = (match[2] || '').replace(/\s+/g, ',');
                } else {
                    forEach(element.attributes, function (attr) {
                        if (!appElement && names[attr.name]) {
                            appElement = element;
                            module = attr.value;
                        }
                    });
                }
            }
        });

        if (appElement) {
            if (!appModule) {
                appModule = originalModules[module];
            }
            rootElement = angular.element(appElement);
        }
    }
    function forEach(obj, iterator, context) {
        var key;
        if (obj) {
            if (isFunction(obj)) {
                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            } else if (obj.forEach && obj.forEach !== forEach) {
                obj.forEach(iterator, context);
            } else if (isArrayLike(obj)) {
                for (key = 0; key < obj.length; key++)
                    iterator.call(context, obj[key], key);
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            }
        }
        return obj;
    }
    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return isString(obj) || isArray(obj) || length === 0 ||
               typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
    function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }

})(angular);
