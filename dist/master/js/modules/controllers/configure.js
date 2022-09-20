
App.controller('configureCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'ExceptionOutstationCity', 'orderByFilter', '$modal', '$http', '$window', 'Cities',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, ExceptionOutstationCity, orderByFilter, $modal, $http, $window, Cities) {
        'use strict';

         $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
        $rootScope.operationCityId = $localStorage.get('cityId');
  $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
            $rootScope.getCities();
            reloadFunc(); 
             
        }
           
        
        $rootScope.getCities = function() {

            $rootScope.loader = 1;
            $rootScope.cityData = [];
            var allCityName = [];
            if($rootScope.roleId === '1'){
               if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                    $rootScope.loader = 0;
               } else{
                if($rootScope.operationCitySelect === 'All'){

                            ExceptionOutstationCity.find({
                     
                },
                function(cityName) {
                    for (var i = 0; i < cityName.length; i++) {
                        allCityName.push({
                            id: cityName[i].id,
                            name: cityName[i].exceptionCity

                        });

                    }
                    $rootScope.cityData = allCityName;
                    $rootScope.data = allCityName;
                    
                    createTable();
                    $rootScope.loader = 0;
                },
                function(customerErr) {

                    console.log('customer error ' + JSON.stringify(customerErr));
                    if (customerErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                         
                }else{
                    Cities.findOne({
                            filter:{
                                where:{
                                   cityName:$rootScope.operationCitySelect 
                                }
                            }
                        },function(city){
                          //  console.log('cityName: '+JSON.stringify(city));
                            var cityId = city.id;
                            ExceptionOutstationCity.find({
                    filter:{
                        where:{
                            cityId:cityId
                        }
                    }
                },
                function(cityName) {
                    for (var i = 0; i < cityName.length; i++) {
                        allCityName.push({
                            id: cityName[i].id,
                            name: cityName[i].exceptionCity

                        });

                    }
                    $rootScope.cityData = allCityName;
                    $rootScope.data = allCityName;
                    
                    createTable();
                    $rootScope.loader = 0;
                },
                function(customerErr) {

                   // console.log('customer error ' + JSON.stringify(customerErr));
                    if (customerErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                        },function(error){
                            console.log('error: '+JSON.stringify(error));
                        });
                }
                
               }
            }else{
            ExceptionOutstationCity.find({
                    filter:{
                        where:{
                            cityId:$rootScope.operationCityId
                        }
                    }
                },
                function(cityName) {
                    for (var i = 0; i < cityName.length; i++) {
                        allCityName.push({
                            id: cityName[i].id,
                            name: cityName[i].exceptionCity

                        });

                    }
                    $rootScope.cityData = allCityName;
                    $rootScope.data = allCityName;
                    
                    createTable();
                    $rootScope.loader = 0;
                },
                function(customerErr) {

                    console.log('customer error ' + JSON.stringify(customerErr));
                    if (customerErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        }
        };

        $scope.newCity = function() {
            
            var modalInstance = $modal.open({
                templateUrl: '/addExceptionCity.html',
                controller: ModalCityCtrl
            });

            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

        function reloadFunc() {
            $scope.count = 0;
            $scope.timers = setInterval(reloadData, 5);


        }

        function reloadData() {
            $scope.count = $scope.count + 1;
            if ($scope.count >= 2) {
                clearInterval($scope.timers);
            } else {
                $state.go($state.current, {}, {
                    reload: true
                });
            }
        }

        function createTable() {

            $scope.tableParams3 = new ngTableParams({
                page: 1, // show first page
                count: 50 // count per page

            }, {
                total: $rootScope.data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')($rootScope.data, params.filter()) :
                        data;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;

                    params.total(orderedData.length); // set total for recalc pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $rootScope.loader = 0;


        }

        var ModalCityCtrl = function($scope, $rootScope, $modalInstance, $state) {

            $scope.addCity = function(cityName) {
                
                $scope.submitUserBtn = true;
                $rootScope.loader = 1;

                var count = 0;
                
                if (angular.isUndefined(cityName) || cityName === '') {
                    document.getElementById("cityName").style.borderColor = "red";
                    document.getElementById("cityName1").innerHTML = '*required';
                     $scope.submitUserBtn = false;

                    count++;
                } else {
                    document.getElementById("cityName").style.borderColor = "#dde6e9";
                    document.getElementById("cityName1").innerHTML = '';
                     
                }
                if (count > 0) {

                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;

                } else {

                    $scope.countfor = 0;
                    if($rootScope.roleId ==='1'){
                        if($rootScope.operationCitySelect === 'All'){
                            document.getElementById("cityName").style.borderColor = "red";
                    document.getElementById("cityName1").innerHTML = '*Please select operation city except All to add city';
                   // cityName1 = 'Please select operation cit except All to add city';
                   $scope.submitUserBtn = false;
                    $scope.countfor++;
                        }else{
                          Cities.findOne({
                            filter:{
                                where:{
                                   cityName:$rootScope.operationCitySelect 
                                }
                            }
                        },function(cityIdDetails){
                           // console.log('cityName: '+JSON.stringify(cityIdDetails));
                            var cityId = cityIdDetails.id;
                            if($scope.countfor === 0){
                             ExceptionOutstationCity.create({
                        exceptionCity: cityName,
                        cityId:cityId

                    }, function(cityData) {
                        //console.log('ExceptionCity outstation Data :' + JSON.stringify(cityData));
                        $.notify('ExceptionCity outstation city inserted successfully.', {
                            status: 'success'
                        });

                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getCities();

                        $rootScope.loader = 0;
                    }, function(cityErr) {
                        console.log('cityErr ' + JSON.stringify(cityErr));
                        if (cityErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });   
                            }
                        
                     },function(error){
                            console.log('error: '+JSON.stringify(error));
                        });  
                        }
                           

                    }else{
                       ExceptionOutstationCity.create({
                        exceptionCity: cityName,
                        cityId:$rootScope.operationCityId

                    }, function(cityData) {
                        //console.log('ExceptionCity outstation Data :' + JSON.stringify(cityData));
                        $.notify('ExceptionCity outstation city inserted successfully.', {
                            status: 'success'
                        });

                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getCities();

                        $rootScope.loader = 0;
                    }, function(cityErr) {
                        console.log('cityErr ' + JSON.stringify(cityErr));
                        if (cityErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });
 
                    }
                    
                }

            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.getCities();

            }
        };


        $scope.updateCity = function(id) {
          
            $rootScope.cityId = id;

            var modalInstance = $modal.open({
                templateUrl: '/updateExceptionCity.html',
                controller: ModalUpdateCityCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

        var ModalUpdateCityCtrl = function($scope, $rootScope, $modalInstance, $state) {

            $scope.UpdateCity = function(city) {

                $scope.submitUserBtn = true;
                $rootScope.loader = 1;

                var count = 0;
                if (angular.isUndefined(city.name) || city.name === '') {
                    document.getElementById("Name").style.borderColor = "red";
                    document.getElementById("Name1").innerHTML = '*required';
                    city.Name1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("Name").style.borderColor = "#dde6e9";
                    document.getElementById("Name1").innerHTML = '';
                    city.Name1 = null;
                }
                if (count > 0) {

                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;

                } else {

                    $scope.count = 0;

                    ExceptionOutstationCity.findById({
                            id: $rootScope.cityId
                        }, function(ExceptionOutstationCity) {
                            //console.log('fetch city for update' + JSON.stringify(ExceptionOutstationCity));
                            
                            ExceptionOutstationCity.exceptionCity = city.name;
                            ExceptionOutstationCity.$save();
                            $modalInstance.dismiss('cancel');

                            $.notify('City updated successfully.', {
                                status: 'success'
                            });

                            reloadFunc();
                            $rootScope.getCities();
                            $rootScope.loader = 0;


                        },
                        function(error) {
                            console.log('Error updating City : ' + JSON.stringify(error));
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });


                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

            $scope.fetchCityDetails = function() {
                //console.log('city :' + JSON.stringify($rootScope.cityData))
                var resultData = $rootScope.cityData;
                for (var i = 0; i < resultData.length; i++) {
                    if (resultData[i].id == $rootScope.cityId) {
                        $scope.city = {

                            name: resultData[i].name

                        };
                    }
                }

            };

            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };
        };

        $scope.deleteCity = function(id) {
            $scope.cityId = id;
            $rootScope.loader = 1;
            ExceptionOutstationCity.deleteById({
                id: $scope.cityId

            }, function(ExceptionOutstationCity) {
                //console.log('fetch city for delete' + JSON.stringify(ExceptionOutstationCity));
                $.notify('City deleted successfully.', {
                    status: 'success'
                });

                reloadFunc();
                $rootScope.getCities();
                $rootScope.loader = 0;

            }, function(error) {
                console.log('Error deleted City : ' + JSON.stringify(error));
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });


        }



    }
]);
