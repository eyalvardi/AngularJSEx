(function (angular) {
    var app = angular.module('tvFilters', []);
    console.log('Module tvFilters created.');
    app.filter('isGenre', function () {
        console.log('filters module --> filter create.');
        return function (input, genre) {
            if (typeof genre == 'undefined' || genre == null) {
                return input;
            } else {
                var out = [];
                for (var a = 0; a < input.length; a++) {
                    for (var b = 0; b < input[a].show.genres.length; b++) {
                        if (input[a].show.genres[b] == genre) {
                            out.push(input[a]);
                        }
                    }
                }
                return out;
            }
        };
    });
})(angular);