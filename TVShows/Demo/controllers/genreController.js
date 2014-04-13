(function (angular) {
    var app = angular.module('TVPremieresApp');
    app.controller("genreController", function ($scope, tvShows, $modal, $log) {
        console.log('genreController create');
        $scope.results = tvShows;

        $scope.open = function (show) {
            var modalInstance = $modal.open({
                templateUrl: 'templates/modalShow.html',
                controller: function ($scope, tvshow) {
                    $scope.$id = "Modal Scope";
                    $scope.tvshow = tvshow;
                },
                resolve: { tvshow: function () { return show; } }
                });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });
})(angular);
