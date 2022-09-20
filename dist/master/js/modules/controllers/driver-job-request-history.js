App.controller('driverJobRequestHistoryCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'DriverJobDetails', 'DriverJobRequest', 'ConUsers', 'CustomerDetails', 'DriverDetails', 'UserRoles', 'orderByFilter', '$modal', '$http', '$window',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, DriverJobDetails, DriverJobRequest, ConUsers, CustomerDetails, DriverDetails, UserRoles, orderByFilter, $modal, $http, $window) {
        'use strict';
        $rootScope.userId = $localStorage.get('userId');

        $scope.backToDriverReport = function() {
            $localStorage.put('jobRequestDrvId', undefined);
            $state.go('app.manageDriver');

        };

        $rootScope.getDriverJobRequestDetails = function() {

            $rootScope.loader = 1;
            //$rootScope.searchedJobRequestData = [];
            var allJobRequestData = [];
            var drvId = $localStorage.get('jobRequestDrvId');
            
            DriverJobRequest.find({

                    filter: {
                        where: {
                            driverId: drvId
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
                    console.log('search job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {

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
                            drvAddress: jobRequestData[i].driverDetails.conUsers.address,
                            createdDate: jobRequestData[i].createdDate,
                            createdBy: jobRequestData[i].createdBy,
                            createdByName: jobRequestData[i].createdByName,
                            status: jobRequestData[i].status,
                            location:jobRequestData[i].location


                        });


                    }
                    //$rootScope.searchedJobRequestData = allJobRequestData;
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
