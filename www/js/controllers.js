angular.module('starter.controllers', ['ionic'])
    .controller('CityCtrl', function ($scope, Cities, $ionicPopup, all_cities) {
        $scope.cities = Cities.all();
        $scope.city_search = "null";
        $scope.my_ref = "";
        $scope.curr_city = "";
        $scope.show = false;
        $scope.showPopup = function (text) {
            $scope.city_search = all_cities.get(text);
            if ($scope.city_search === "null") {
                $ionicPopup.alert({
                    title: "Ошибка!",
                    template: "Не верное название либо такого города нет в каталоге."
                });
            } else {
                $scope.my_ref = "#/tab/city/" + $scope.city_search;
                $scope.curr_city = text;
                $scope.show = true;
            }
        };
    })

    .controller('CityDetailCtrl', function ($scope, $http, $stateParams, $ionicPopup) {
        $scope.data = {};
        $scope.id = $stateParams.id;
        $scope.showAlert = function (title, text) {
            $ionicPopup.alert({
                title: title,
                template: text
            });
        };
        $scope.refresh = function () {
            $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?id=' + $scope.id)
                .success(function (data, status, headers, config) {
                    $scope.data = data;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data, status, headers, config) {
                    $scope.showAlert(status, data);
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        $scope.refresh();
    })

    .controller('City_30Ctrl', function ($scope, $http, $ionicPopup, Cities) {

    })

    .controller('City_30DetailCtrl', function ($scope, $http, $stateParams, Common_weather) {
        $scope.data = {};
        $scope.forecast = [];
        $scope.id = $stateParams.id;
        $scope.refresh = function () {
            $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?id=' + $scope.id)
                .success(function (data, status, headers, config) {
                    $scope.data = data;
                    var prev_date = new Date($scope.data.list[6].dt*1000);
                    var next_date = Common_weather.get(prev_date);
                    var parts;
                    if (Math.abs(($scope.data.list[6].temp.day - 273.15).toFixed(0) - next_date.temp)>2){
                        if (($scope.data.list[6].temp.day - 273.15).toFixed(0) < next_date.temp){
                            $scope.forecast.push(get_next(next_date, ($scope.data.list[6].temp.day - 273.15).toFixed(0)+2));
                            parts = next_date.date.split('.');
                            prev_date = new Date('2015',parts[1]-1,parts[0]);
                            next_date = Common_weather.get(prev_date);
                            if (Math.abs($scope.forecast[0].temp - next_date.temp)>1){
                                if ($scope.forecast[0].temp < next_date.temp) {
                                    $scope.forecast.push(get_next(next_date, $scope.forecast[0].temp + 1));
                                    parts = next_date.date.split('.');
                                    prev_date = new Date('2015',parts[1]-1,parts[0]);
                                } else {
                                    $scope.forecast.push(get_next(next_date, $scope.forecast[0].temp - 1));
                                    parts = next_date.date.split('.');
                                    prev_date = new Date('2015',parts[1]-1,parts[0]);
                                }
                            } else {
                                $scope.forecast.push(get_next(next_date, next_date.temp));
                                parts = next_date.date.split('.');
                                prev_date = new Date('2015',parts[1]-1,parts[0]);
                            }
                        } else {
                            $scope.forecast.push(get_next(next_date, ($scope.data.list[6].temp.day - 273.15).toFixed(0)-2));
                            parts = next_date.date.split('.');
                            prev_date = new Date('2015',parts[1]-1,parts[0]);
                            next_date = Common_weather.get(prev_date);
                            if (Math.abs($scope.forecast[0].temp - next_date.temp)>1){
                                if ($scope.forecast[0].temp < next_date.temp) {
                                    $scope.forecast.push(get_next(next_date, $scope.forecast[0].temp + 1));
                                    parts = next_date.date.split('.');
                                    prev_date = new Date('2015',parts[1]-1,parts[0]);
                                } else {
                                    $scope.forecast.push(get_next(next_date, $scope.forecast[0].temp - 1));
                                    parts = next_date.date.split('.');
                                    prev_date = new Date('2015',parts[1]-1,parts[0]);
                                }
                            } else {
                                $scope.forecast.push(get_next(next_date, next_date.temp));
                                parts = next_date.date.split('.');
                                prev_date = new Date('2015',parts[1]-1,parts[0]);
                            }
                        }
                    } else {
                        $scope.forecast.push(get_next(next_date, next_date.temp));
                        parts = next_date.date.split('.');
                        prev_date = new Date('2015',parts[1]-1,parts[0]);
                        next_date = Common_weather.get(prev_date);
                        $scope.forecast.push(get_next(next_date, next_date.temp));
                        parts = next_date.date.split('.');
                        prev_date = new Date('2015',parts[1]-1,parts[0]);
                    }


                    for (var i = 0; i<21; i++){
                        next_date = Common_weather.get(prev_date);
                        $scope.forecast.push(get_next(next_date, next_date.temp));
                        parts = next_date.date.split('.');
                        prev_date = new Date('2015',parts[1]-1,parts[0]);
                    }


                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data, status, headers, config) {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        $scope.refresh();
    });

    function get_next (next_date, temp){
        var cloud = '01d.png';
        if (next_date.precip < 17) {
            if ((next_date.cloud>=38) && (next_date.cloud<60)){
                cloud = '02d.png';
            }
            if ((next_date.cloud>=60) && (next_date.cloud<70)){
                cloud = '03d.png';
            }
            if (next_date.cloud>=70){
                cloud = '04d.png';
            }
        } else {
            if ((next_date.precip>=17) && (next_date.precip<33)){
                cloud = '10d.png';
            }
            if (next_date.precip>=33){
                cloud = '09d.png';
            }
        }
        var date = {};
        angular.extend(date, {'icon' : cloud} );
        angular.extend(date, {'date' : next_date.date +'.2015'} );
        angular.extend(date, {'temp' : temp} );
        return date;
    }