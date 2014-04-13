(function (angular) {
    var mi = angular.module('angularEx.directives', ['angularTreeview']);

    angularEx.addRequiretongApp('angularEx.directives');

    mi.directive('angularex', angularExFactory);

    function angularExFactory() {
        var module = angularEx.getModulesTree(),
            tv = [convertToTreeview(module)];

        function convertToTreeview(module) {
            var tv = {
                    "label": module.name,
                    "id": module.name,
                    "children": []
                },
                requires = { "label": 'requires', "id": 'requires', "children": [] };

            getItems('controllers', module, tv);
            getItems('directives', module, tv);
            getItems('filter', module, tv);
            getItems('animation', module, tv);
            getItems('provider', module, tv);
            getItems('factory', module, tv);
            getItems('service', module, tv);
            getItems('constant', module, tv);

            if (module.requires) {
                tv.children.push(requires);
                module.requires.forEach(function(r) {
                    requires.children.push(convertToTreeview(r));
                });
            }
            return tv;
        }

        function getItems(name, amodule, treeitem) {
            var children = [],
                item = {
                    "label": name,
                    "id": name,
                    "children": children
                }
            if (amodule[name] && Array.isArray(amodule[name])) {
                amodule[name].forEach(function(item) {
                    children.push({ "label": item, "id": item, "children": [] });
                });
            }
            if (children.length > 0) {
                treeitem.children.push(item);
            }
        }

        return {
            repelace: true,
            template: '<div ng-click="open()"  class="btn navbar-fixed-top" style="width:50px;"> + </div><div ng-if="isOpen" angular-treeview="true" tree-id="abc" tree-model="treedata" node-id="id" node-label="label" node-children="children" ></div>',
            link: function (scope, element, attr) {
                scope.isOpen = false;
                scope.treedata = tv;
                scope.open = function() {
                    scope.isOpen = !scope.isOpen;
                    return scope.isOpen;
                };
            }
        };
    }


})(angular);