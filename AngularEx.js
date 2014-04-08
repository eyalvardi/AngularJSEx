(function(angular) {
    var moduleFn = angular.module,
        requires = [],
        mi = null;
    
    angular.module = function (moduleName, req, isApp) {
        var reqArray = null;
        switch (arguments.length) {
            case 1:
                reqArray = req || [];
                break;
            case 2:
                if (typeof req == "boolean") {
                    isApp = true;
                    reqArray = [];
                } else {
                    reqArray = req || [];
                }
                break;
        default:
        }
       
        try {
            mi = moduleFn(moduleName);
        } catch (e) {
            if (isApp) {
                requires.concat(reqArray);
                mi = moduleFn(moduleName, requires);
            } else {
                mi = moduleFn(moduleName, reqArray);
                requires.push(mi.name);
            }
            
            //console.log('module name: %s, requires: %s', mi.name, mi.requires.toString());
            //console.log(requires);
        }
        return mi;
    };
})(angular);
