(function (angular) {
    var app = angular.module('TVPremieresApp', //[]);
        [
            //'ngAnimate',
            //'ngRoute',
            //'tvFilters',
            //'tvServices',
            //'tvDirectives',
            'ui.bootstrap',
            'LocalStorageModule'
            
        ]);
    
    app.config(function ($routeProvider) {
        console.log('$routeProvider configed');
        $routeProvider
            .when('/',{templateUrl: 'templates/default.html'})
            .when('/genres/:genreid',
                {
                    templateUrl: 'templates/genreItem2.html',
                    controller : 'genreController',
                    resolve: {
                        tvShows: function (tvDal, $route, $filter) {
                            var genreId = $route.current.params.genreid;
                            var filter  = $filter('isGenre');
                            var result  = filter(tvDal.shows, genreId);
                            return result;
                        }
                    }
                })
            .otherwise({ redirectTo: '/' });
    });
})(angular);

