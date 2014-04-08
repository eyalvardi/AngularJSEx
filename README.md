AngularJSEx
===========

AngularEx.js overvide the angular module function. The Goal is:
1. To save the maintenance of the modules requires.
2. The create module and the get module now the same. if thre no module it create it, if not he will return it.


Sample:
////////   file index.html  /////
<div ng-app="myApp" ng-controller="Ctrl as vm">
  <!-- HTML Code -->
</div>
        

<script src="/Scripts/angular.js"></script>
<script src="/Demos/AngularEx/AngularEx.js"></script>

<!-- No need to add the requires to the main module -->
<script src="/Scripts/angular-route.js"></script>
<script src="/Scripts/angular-animate.js"></script>

<script src="app.js"></script>
<script src="bl.js"></script>


////////   file app.js  /////
(function (angular) {

    /////////   AngularJS Code ///////////
    var mi = angular.module('myApp', true); // No need to give the requires.

   mi.controller('Ctrl', Ctrl);


    /////////   JavaScript Code ///////////
    
    function Ctrl($scope, proxy) { /* code */  }

})(angular);


////////   file bl.js  /////
(function (angular) {

    /////////   AngularJS Code ///////////
    var mi = angular.module('bl'); // No need to give the requires.

   mi.factory('proxy', proxyFactory);


    /////////   JavaScript Code ///////////
    
    function proxyFactory($log, $http) { /* code */  }

})(angular);
