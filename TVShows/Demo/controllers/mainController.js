(function (angular) {
    var app = angular.module('TVPremieresApp');
    app.controller("mainController", function ($scope, tvDal) {

        $scope.$id = 'MainCtrl';
        //$scope.$watch(function() { console.log('digest listener fired'); });

        $scope.results = [];
        $scope.availableGenres = [];

        // filters
        $scope.filterText = null;
        $scope.genreFilter = null;
        $scope.setGenreFilter = function (genre) {
            $scope.genreFilter = genre;
        };

        // orders by
        $scope.customOrder = function (tvshow) {
            switch ($scope.orderField) {
                case "Air Date":
                    return tvshow.episode.first_aired;
                    break;
                case "Rating":
                    return tvshow.episode.ratings.percentage;
                    break;
            }
        };
        $scope.orderFields = ["Air Date", "Rating"];
        $scope.orderDirections = ["Descending", "Ascending"];
        $scope.orderField = "Air Date"; //Default order field
        $scope.orderReverse = false;

        $scope.init = function () {
            $scope.results = tvDal.shows;
            $scope.availableGenres = tvDal.genres;
        };
    });
})(angular);
