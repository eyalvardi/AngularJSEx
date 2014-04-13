'use strict';
(function (angular) {
    var moduleFn = angular.module,
        //configModule = angular.module('angularEx.Config', []),
        requires = [],
         //mainModule = angular.module('angularEx.main', requires),
        ngEx = window.angularEx;


    ngEx.plugins.push(function() {
        var unConectedModules = deleteModuleInTree(ngEx.appModule, angular.copy(ngEx.modules));
        delete unConectedModules[ngEx.appModule.name];

        ngEx.forEach(unConectedModules, function (m) {
            ngEx.appModule.requires.push(m.name);
        });
    });
    /////////////////////////////////////////
    //  AngularJS override module function
    ////////////////////////////////////////
    angular.module = function (moduleName, req, config) {
        var mi = null;
        if (req) {
            mi = moduleFn(moduleName, req, config);
        } else {
            try {
                mi = moduleFn(moduleName);
            } catch (e) {
                mi = moduleFn(moduleName, req || [], config);
            }
        }

        //mi.config = configAngularEx(mi);

        return mi;
    };
    function configAngularEx(module) {
        var originalConfig = module.config;
        return function (config) {
            originalConfig(config);
            configModule.config(config);
        }
    }
    
    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
    function deleteModuleInTree(module, originalmodules) {
        if (!module || !module.requires || module.requires.length == 0) return;

        ngEx.forEach(module.requires, function (name) {
            deleteModuleInTree(originalmodules[name], originalmodules);
            delete originalmodules[name];
        });
        return originalmodules;
    }
    
})(angular);