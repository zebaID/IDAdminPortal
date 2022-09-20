App.controller('searchedJobRequestCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'DriverJobDetails', 'DriverJobRequest', 'ConUsers', 'CustomerDetails', 'DriverDetails', 'UserRoles', 'orderByFilter', '$modal', '$http', '$window',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, DriverJobDetails, DriverJobRequest, ConUsers, CustomerDetails, DriverDetails, UserRoles, orderByFilter, $modal, $http, $window) {
        'use strict';
        
    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
   $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
            console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $rootScope.getJobRequestDetails();
            reloadFunc(); 
             
        }
        $scope.backToSearchReport = function() {
            $localStorage.put('searchRequestFromDate', undefined);
            $localStorage.put('searchRequestToDate', undefined);
            $state.go('app.searchJob');

        };

        $rootScope.getJobRequestDetails = function() {

            $rootScope.loader = 1;
            $rootScope.searchedJobRequestData = [];
            var allJobRequestData = [];
            var fromDate = $localStorage.get('searchRequestFromDate');
            var toDate = $localStorage.get('searchRequestToDate');
            var customerId = $localStorage.get('customerId');

            fromDate = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
            toDate = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
            toDate = moment(toDate).add(1, 'days');
            if(angular.isDefined(customerId)){
$scope.sendDataHere(customerId);
}else{
  if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        DriverJobRequest.find({

                    filter: {
                        where: { 


                            and: [{
                                createdDate: {
                                    gte: fromDate
                                }
                            }, {
                                createdDate: {
                                    lt: toDate
                                }
                            }]
                             
                        },
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                               
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                   // console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                        if(angular.isDefined(jobRequestData[i].driverJobDetails)){
                         var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                        }

                        


                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $rootScope.data = allJobRequestData;
                    console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                      DriverJobRequest.find({

                    filter: {
                        where: { 
                             


                            and: [{
                                createdDate: {
                                    gte: fromDate
                                }
                            }, {
                                createdDate: {
                                    lt: toDate
                                }
                            }]
                            
                        },
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                                where:{
                                    area:{
                        like: '%' + $rootScope.operationCitySelect + '%'
                                 }
                                },
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                   // console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                        if(angular.isDefined(jobRequestData[i].driverJobDetails)){
                         var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                        }

                        


                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $rootScope.data = allJobRequestData;
                    console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                    
                }
            }else{
                DriverJobRequest.find({

                    filter: {
                        where: { 


                            and: [{
                                createdDate: {
                                    gte: fromDate
                                }
                            }, {
                                createdDate: {
                                    lt: toDate
                                }
                            }]
                            
                        },
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                                 where:{
                                    area:{
                        like: '%' + $rootScope.operationCity + '%'
                                 }
                                },
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                    //console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                            if(angular.isDefined(jobRequestData[i].driverJobDetails)){

                       var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                    }

                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $scope.data = allJobRequestData;
                    //console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }  
}
            
            
        };

         $scope.sendDataHere = function(customerId){
            $rootScope.loader = 1;
            $rootScope.searchedJobRequestData = [];
            var allJobRequestData = [];
             if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        DriverJobRequest.find({

                    filter: {
                        
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                                where: {
                                            customerId: customerId
                                        },
                               
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                        
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                   // console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                        if(angular.isDefined(jobRequestData[i].driverJobDetails)){
                            if(jobRequestData[i].driverJobDetails.customerDetails.id === customerId){
                         var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                        }
                    }

                        


                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $rootScope.data = allJobRequestData;
                    //console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                      DriverJobRequest.find({

                    filter: {
                        
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                                where:{
                                    customerId: customerId,
                                    location: $rootScope.operationCitySelect 
                                   
                                },
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                        
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                   // console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                        if(angular.isDefined(jobRequestData[i].driverJobDetails)){
                            if(jobRequestData[i].driverJobDetails.customerDetails.id === customerId){
                         var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                        }

                       } 


                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $rootScope.data = allJobRequestData;
                   // console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                    
                }
            }else{
                DriverJobRequest.find({

                    filter: {
                        
                        order: ['createdDate DESC'],
                        include: [{
                            relation: 'driverJobDetails',
                            scope: {
                                 where:{
                                    customerId: customerId,
                                    location: $rootScope.operationCity 
                                 
                                      
                                },
                                include: {
                                    relation: 'customerDetails',
                                    scope: {
                                         
                                        include: {
                                            relation: 'conUsers'

                                        }
                                    }
                                }
                            }

                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'

                                }
                            }
                        }]
                    }

                }, function(jobRequestData) {
                    //console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                            if(angular.isDefined(jobRequestData[i].driverJobDetails)){
                                if(jobRequestData[i].driverJobDetails.customerDetails.id === customerId){
                       var orderStatus;
                if (!angular.isUndefined(jobRequestData[i].status) || jobRequestData[i].status !== null || jobRequestData[i].status !== '') {
                    if (jobRequestData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if (jobRequestData[i].status === 'Closed') {
                        orderStatus = 'B';
                    }  
                }


                        var createdDate = moment(jobRequestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driverJobId,
                            driverId: jobRequestData[i].driverId,
                            drvName: jobRequestData[i].driverDetails.conUsers.firstName + ' ' + jobRequestData[i].driverDetails.conUsers.lastName,
                            date: createdDate,
                            drvFirstName: jobRequestData[i].driverDetails.conUsers.firstName,
                            drvLastName: jobRequestData[i].driverDetails.conUsers.lastName,
                            drvContactNo: jobRequestData[i].driverDetails.conUsers.mobileNumber,
                            customerId: jobRequestData[i].driverJobDetails.customerDetails.id,
                            custName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName + ' ' + jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custFirstName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.firstName,
                            custLastName: jobRequestData[i].driverJobDetails.customerDetails.conUsers.lastName,
                            custContactNo: jobRequestData[i].driverJobDetails.customerDetails.conUsers.mobileNumber,
                            custArea: jobRequestData[i].driverJobDetails.area,
                            remark: jobRequestData[i].remark,
                            freeAddress: jobRequestData[i].driverDetails.freeAddress, 
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            orderStatus: orderStatus


                        });

                    }
                }

                    }
                    $rootScope.searchedJobRequestData = allJobRequestData;
                    $scope.data = allJobRequestData;
                    //console.log('All Driver' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }
        }

        $scope.updateRequest = function(reqId) {
            $rootScope.searchedRequestId = reqId;
            //console.log('request Id: ' + $rootScope.searchedRequestId);
            var modalInstance = $modal.open({
                templateUrl: '/updateRequest.html',
                controller: updateRequestCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

        var updateRequestCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
             $scope.statusArray = [{
                'desc': 'Appointed'
            }, {
                'desc': 'Rejected'
            }, {
                'desc': 'Hold'
            }, {
                'desc': 'Left'
            }, {
                'desc': 'Interview'
            }, {
                'desc': 'Applied'
            }, {
                'desc': 'Not Interested'
            }];
            $scope.getSearchResult = function(searchText) {
                var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=' + ENV.googlePlacesAPIKey;
                $http.get(url)
                    .then(function successCallback(response) {
                        if (angular.isDefined(response.data.predictions))
                            console.log('search results : ' + JSON.stringify(response.data.predictions));
                        $scope.searchResult = response.data.predictions;
                    }, function errorCallback(response) {
                        console.log('search place error : ' + JSON.stringify(response));
                    });
            };
            $scope.toggleMin = function() {
                var maximumDate = new Date();
                var currentYear = maximumDate.getFullYear();
                var currentMonth = maximumDate.getMonth();
                var currentDate = maximumDate.getDate();
                $scope.maxDate = $scope.maxDate ? null : new Date(currentYear, currentMonth, currentDate + 15);
            };
            $scope.toggleMin();
            $scope.openToDate = false;
            $scope.openedStart = false;
            $scope.openStart = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
                $scope.openToDate = false;

            };

            $scope.openedToDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openToDate = true;
                $scope.openedStart = false;

            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };

            $scope.updateRequestDetails = function(job) {

                 
                $rootScope.loader = 1;
                //console.log('request data to update' + JSON.stringify(job));
                var remark = null;
                if (!angular.isUndefined(job.remark) || job.remark !== null || job.remark !== '') {
                    remark = job.remark;
                }
                    DriverJobRequest.DriverJobRequestCheck({
                        driverId:job.driverId,
                        jobId:job.jobId,
                        status:job.status
                    },
                    function(sssss) {
                            if(sssss[0].check_driver_job_request_status === 'Sccess'){
                                     ConUsers.findById({
                        id: $rootScope.userId
                    },
                    function(ConUsers) {

                        var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                        DriverJobRequest.findById({
                                id: job.id
                            },
                            function(DriverJobRequest) {
                                var driverJobId = DriverJobRequest.driverJobId;
                                
                                var remarkUpdatedDate = new Date(); 
                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                                DriverJobRequest.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                DriverJobRequest.status = job.status;
                                DriverJobRequest.updatedBy = $rootScope.userId;
                                DriverJobRequest.updatedDate = new Date();
                                DriverJobRequest.$save();
                                //console.log('Driver request updated : ' + JSON.stringify(DriverRequestData));

                                $.notify('Request updated successfully.', {
                                    status: 'success'
                                });

                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getJobRequestDetails();
                                $rootScope.loader = 0;


                            },
                            function(error) {
                                console.log('Error updating request details : ' + JSON.stringify(error));
                                $modalInstance.dismiss('cancel');
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $rootScope.loader = 0;
                            });

                    },
                    function(error) {
                        console.log('error ' + JSON.stringify(error));
                        $rootScope.loader = 0;
                    });
                            }else{
                                     $.notify(sssss[0].check_driver_job_request_status, {
                                    status: 'danger'
                                });

                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            }
                    },function(errrr){

                    });
               
                


            };
            $scope.fetchRequestDetails = function() {
                var resultData = $rootScope.searchedJobRequestData;

                for (var i = 0; i < resultData.length; i++) {


                    if (resultData[i].id == $rootScope.searchedRequestId) {
                        $scope.job = {
                            id: resultData[i].id,
                            jobId: resultData[i].jobId,
                            driverId: resultData[i].driverId,
                            drvName: resultData[i].drvName,
                            date: resultData[i].date,
                            drvFirstName: resultData[i].drvFirstName,
                            drvLastName: resultData[i].drvLastName,
                            drvContactNo: resultData[i].drvContactNo,
                            customerId: resultData[i].customerId,
                            custName: resultData[i].custName,
                            custFirstName: resultData[i].custFirstName,
                            custLastName: resultData[i].custLastName,
                            custContactNo: resultData[i].custContactNo,
                            custArea: resultData[i].custArea,
                            remark: resultData[i].remark,
                            drvAddress: resultData[i].drvAddress,
                            createdDate: resultData[i].createdDate,
                            createdBy: resultData[i].createdBy,
                            createdByName: resultData[i].createdByName,
                            status: resultData[i].status
                        };
                    }
                }
            };


            $scope.closeModal = function() {
                //$rootScope.customerDetails = undefined;
                //$rootScope.customerCellNo = undefined;
                $rootScope.searchedRequestId = undefined;
                $modalInstance.dismiss('cancel');
                $rootScope.getJobRequestDetails();
            };

        };

        $scope.toggleMin = function() {
            var maximumDate = new Date();
            var currentYear = maximumDate.getFullYear();
            var currentMonth = maximumDate.getMonth();
            var currentDate = maximumDate.getDate();
            $scope.maxDate = $scope.maxDate ? null : new Date(currentYear, currentMonth, currentDate + 15);
        };
        $scope.toggleMin();
        $scope.openToDate = false;
        $scope.openedStart = false;
        $scope.openStart = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStart = true;
            $scope.openToDate = false;

        };

        $scope.openedToDate = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openToDate = true;
            $scope.openedStart = false;

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };
        $scope.user = {};
        $scope.submitUserBtn = false;
        $scope.count = 0;

        function getCurrentDateTime(end_date) {
            var d = new Date(end_date);

            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();
            var hh = 11;
            var min = 59;
            var sec = d.getSeconds();

            var datetime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + sec;

            return datetime;
        }

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
                //page: 1, // show first page
                count: $scope.data.length // count per page

            }, {
                total: $scope.data.length, // length of data
                counts:[],
                getData: function($defer, params) {
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
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

    }
]);
