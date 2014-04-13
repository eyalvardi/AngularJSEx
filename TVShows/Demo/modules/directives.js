(function (angular) {
    var app = angular.module('tvDirectives', []);
    console.log('Module tvDirectives created.');

    // version 1
    app.directive('searchToolbar', function () {
        return {
            templateUrl: 'templates/searchToolbar.html'
        };
    });
    
    // version 2
    app.directive('searchToolbar2', function () {
        console.log('tvDirectives --> create searchToolbar2 directive');
        return {
            scope: {
                filterText:   '=',
                genreFilter:  '=',
                orderField:   '=',
                orderReverse: '=',
                
                availableGenres: '@',
                orderFields:     '@'
            },
            templateUrl: 'templates/searchToolbar.html'
        };
    });

    // tvShow
    app.directive('tvShow', function () {
        console.log('tvDirectives --> create tvShow directive');
        function linkFn(scope, elm, attr) {
            console.log('tvDirectives --> linkFn tvShow directive');
            elm.bind('mouseover', function () {
                elm.css('background-color', 'red');
            });
            elm.bind('mouseout', function () {
                elm.css('background-color', 'white');
            });
        };
        return {
            replace: true,
            templateUrl: 'templates/tvShow.html',
            link: linkFn
        };
    });

    app.directive('tvGenres', function () {
        
        return {
            templateUrl: 'templates/genreToolbar.html',
            scope: {
                genres : '='
            }    
        };
    });
})(angular);