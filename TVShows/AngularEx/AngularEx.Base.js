'use strict'; 
(function (angular, undefined) {
    var moduleFn = angular.module,
        originalModules = {},
        appModule = undefined,
        requires = [],
        plugins = [],
        isString = angular.isString,
        isArray = angular.isArray,
        isFunction = angular.isFunction,

    ngEx = {
        plugins: plugins,
        addRequiretongApp: addRequiretongApp,

        isString: angular.isString,
        isArray: angular.isArray,
        isFunction: angular.isFunction,
        forEach:forEach
    };
    window.angularEx = ngEx;
    //DEFER_BOOTSTRAP!
    window.name = 'NG_DEFER_BOOTSTRAP!';

    function addRequiretongApp(name) {
        requires.push(name);
    }
    /////////////////////////////////////////
    //  AngularJS override module function
    ////////////////////////////////////////
    angular.module = function (moduleName, req, config) {
        var mi = moduleFn(moduleName, req, config);
        originalModules[mi.name] = mi;
        return mi;
    };

    /////////////////////////////////////////
    //   Document Ready
    ////////////////////////////////////////
    angular.element(document).ready(function () {
        ngEx.modules = originalModules;

        findNgAppElement(window.document);

        forEach(plugins, function (plg) {
            plg();
        });
        angular.resumeBootstrap([]);
    });

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
                appModule.requires = appModule.requires.concat(requires);
                ngEx.appModule = appModule;
            }
            ngEx.rootElement = angular.element(appElement);
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