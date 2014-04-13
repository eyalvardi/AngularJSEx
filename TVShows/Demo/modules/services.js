(function (angular) {
    var app = angular.module('tvServices', []);
    console.log('Module tvServices created.');
    app.factory('tvDal', function (tvService, localStorageService) {
        
        var results = localStorageService.get('shows') || [];
        var availableGenres = localStorageService.get('genres') || [];

        function setResult(result, genre) {
            localStorageService.clearAll();
            
            result.forEach(function (item) {
                results.push(item);
            });
            genre.forEach(function (item) {
                availableGenres.push(item);
            });

            localStorageService.add('shows', results);
            localStorageService.add('genres', availableGenres);
        }
        
        if (results.length == 0 || availableGenres.length == 0) {
             tvService.load(setResult);
        }

        return {
            shows: results,
            genres: availableGenres
        };
    });
    app.factory('tvService', function ($http) {
        // private fields
        var apiKey  = "c18295e11a0927b9b740fab094753b83",
            baseUrl = 'http://api.trakt.tv/calendar/premieres.json/';

        // private methods
        function buildUrl(apiKey, baseUrl) {
            var today = new Date();
            var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
            var url = baseUrl + apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK';
            return url;
        }
        function addGenres(tvShow, availableGenres) {
            angular.forEach(tvShow.show.genres, function (genre, index) {
                var exists = false;
                angular.forEach(availableGenres, function (avGenre, index) {
                    if (avGenre == genre) { exists = true; }
                });
                
                if (exists === false) {
                    availableGenres.push(genre);
                }
            });
            return availableGenres;
        }

        // public methods
        function loadTv(callback) {
            var results = [],
             availableGenres = [];
            
            $http.jsonp(buildUrl(apiKey, baseUrl))
                  .success(function (data) {
                      //For each day get all the episodes.
                      angular.forEach(data, function (value, index) {
                        var date = value.date;
                          //For each episodes add it to the results array.  
                        angular.forEach(value.episodes, function (tvshow, index) {
                            tvshow.date = date; 
                            results.push(tvshow);
                            //Only add to the availableGenres array if it doesn't already exist.
                            addGenres(tvshow, availableGenres);
                        });
                      });
                      callback(results, availableGenres);
                  })
                .error(function (error) { console.log(error.message); });
        };

        return {            
            load: loadTv
        };
    });
    
})(angular);