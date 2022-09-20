App.controller('manageDriverCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout',
    '$cookieStore', 'orderByFilter', '$modal', '$state', 'DriverDetails', 'ConUsers', '$localStorage', '$http', '$window', 'Bookings', 'UserRoles', 'DriverAccountTransactions', 'DriverAccount', 'Cities','Company2DriverDetails',

    function manageDriverCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, orderByFilter, $modal, $state, DriverDetails, ConUsers, $localStorage, $http, $window, Bookings, UserRoles, DriverAccountTransactions, DriverAccount, Cities,Company2DriverDetails) {
        'use strict';

        $scope.searchDrvFlag = true;
        $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');

        //console.log('user id: ' + $rootScope.userId);
        /*if ($rootScope.userId === 3289) {
            $rootScope.activeFlag = true;
        } else {
            $rootScope.activeFlag = false;
        }*/


       
 $rootScope.cityAt = [];
        for(var i = 0; i<$rootScope.cities.length; i++){
            
            if($rootScope.cities[i] !== 'All'){
                $rootScope.cityAt.push($rootScope.cities[i]);
            }
        }
        if (!angular.isUndefined($rootScope.roleId) || $rootScope.roleId !== null || $rootScope.roleId !== '') {
                if ($rootScope.roleId === '1') {
                    $rootScope.deleteDriverFlag = true;
                } else {
                    $rootScope.deleteDriverFlag = false;
                }
            }
        $rootScope.getUserforSelectedCity = function(city){////for admin if we change location in top drp down change operation city
            $rootScope.operationCitySelect = city;
            console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
            $state.go('app.searchDriver');
            reloadFunc(); 
             
        }
        $scope.driverEmploymentHistory = function(){
                 var modalInstance = $modal.open({
                            templateUrl: '/employmentHostoryPopUp.html',
                            controller:  ModalDriverAccountCtrl



                        
                        }); var state = $('#modal-state');
                        modalInstance.result.then(function() {
                            state.text('Modal dismissed with OK status');
                        }, function() {
                            state.text('Modal dismissed with Cancel status');
                        });
            };
        $scope.drvSearchStatusArray = [{//status array of drivers for drop down
            'desc': 'All'
        }, {
            'desc': 'Active'
        }, {
            'desc': 'Inactive'
        }, {
            'desc': 'Blocked'
        }];
        $scope.vehicleArray = [{
                'desc': 'Car Driver'
            }, {
                'desc': 'Bus Driver'
            }, {
                'desc': 'Truck Driver'
            }, {
                'desc': 'JCB Driver'
            }, {
                'desc': 'Forklift Driver'
            }];
            $scope.interviewStatusArray = [{
                'desc': 'Sheduled'
            }, {
                'desc': 'Done'
            }];

        $scope.toggleMin = function() {//date selection throgh date picker methods
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.openToDate = false;
            $scope.openedStart = false;
             $scope.openedStartOthers = false;
                $scope.openToDateOthers = false;
                $scope.openedStart1 = false;
                $scope.openToDate1 = false;
            $scope.openStart = function($event) {//for pv expiry date

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
                $scope.openToDate = false;

            };

            $scope.openedToDate = function($event) {//for pv expiry date


                $event.preventDefault();
                $event.stopPropagation();
                $scope.openToDate = true;
                $scope.openedStart = false;

            };
             $scope.openStartOthers = function($event) {//for download driver date


                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStartOthers = true;
                $scope.openToDateOthers = false;
                  

            };
            $scope.openedToDateOthers = function($event) {//for download driver date

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStartOthers = false;
                $scope.openToDateOthers = true;

            };
            $scope.experienceDate= function($event) { //license expiry date

                $event.preventDefault();
                $event.stopPropagation();
                
                $scope.openToDate1 = false;
                $scope.openedStart1 = true;
                  
            };
            $scope.experienceDate1= function($event) {//license expiry date


                $event.preventDefault();
                $event.stopPropagation();
                
                $scope.openToDate1 = true;
                $scope.openedStart1 = false;
                  
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };


        $scope.searchByNameAndNumber = function() {//search driver by name and number
            if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchDriver');
                      
                }else{
                    $scope.searchDrvFlag = false;

               $timeout(function() {
     var searchInput = document.getElementById('mobileNumber_value');
     searchInput.focus();
   }, 0);   
                }

                
            }else{
                $scope.searchDrvFlag = false;

               $timeout(function() {
     var searchInput = document.getElementById('mobileNumber_value');
     searchInput.focus();
   }, 0);  
            
            }
            
            //$scope.shouldBeOpen = true;


        };
        $scope.backToSearch = function(id) {


            $scope.searchDrvFlag = true;
            $rootScope.searchDrvId = undefined;
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            } else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }

        };
        $scope.backToSearchCriteria = function() {
            $localStorage.put('drvSearchData', undefined);
            $localStorage.put('drvSearchId', undefined);
            $localStorage.put('sData', undefined);
            $localStorage.put('dlData', undefined);
            $localStorage.put('srData', undefined);

            $rootScope.searchDrvId = undefined;
            $rootScope.setFlag1 = false;
            $rootScope.setFlag2 = false;
            $state.go('app.searchDriver');

        }
        $scope.status = {
            isopen: false
        };

        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
        $rootScope.getDriverAgain = function() {//search driver by location and status
             if($rootScope.roleId === '1'){
if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchDriver');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        $rootScope.loader = 1;

            var driverStoredData = $localStorage.get('drvSearchData');
            var drvId = null;
            var drvStatus = null;
            var drvAddress = '';
            if (!angular.isUndefined(driverStoredData)) {

                //console.log('driver location: ' + JSON.stringify(driverStoredData.drvLocation));
                if (driverStoredData.driverStatus !== null && driverStoredData.driverStatus !== '' && !angular.isUndefined(driverStoredData.driverStatus)) {

                    drvStatus = driverStoredData.driverStatus;

                }
                if (driverStoredData.drvLocation !== null && driverStoredData.drvLocation !== '' && !angular.isUndefined(driverStoredData.drvLocation)) {
                    drvAddress = driverStoredData.drvLocation;

                }
            }
            if ($rootScope.searchDrvId !== null && $rootScope.searchDrvId !== '' && !angular.isUndefined($rootScope.searchDrvId)) {
                drvId = $rootScope.searchDrvId;
            } else {
                drvId = 0;
            }

            $rootScope.driverData = [];
            var allDriverData = [];

            DriverDetails.getDriverDetail({
                address: drvAddress,
                status: drvStatus,
                operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }
                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }


                    allDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        address: driverData[i].address,
                        contactNo: driverData[i].contact_no,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        driverCurrentStatus: driverData[i].driver_status
                    });


                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

                    }else{
                        //operationcityselect
                        $rootScope.loader = 1;

            var driverStoredData = $localStorage.get('drvSearchData');
            var drvId = null;
            var drvStatus = null;
            var drvAddress = '';
            if (!angular.isUndefined(driverStoredData)) {

                //console.log('driver location: ' + JSON.stringify(driverStoredData.drvLocation));
                if (driverStoredData.driverStatus !== null && driverStoredData.driverStatus !== '' && !angular.isUndefined(driverStoredData.driverStatus)) {

                    drvStatus = driverStoredData.driverStatus;

                }
                if (driverStoredData.drvLocation !== null && driverStoredData.drvLocation !== '' && !angular.isUndefined(driverStoredData.drvLocation)) {
                    drvAddress = driverStoredData.drvLocation;

                }
            }
            if ($rootScope.searchDrvId !== null && $rootScope.searchDrvId !== '' && !angular.isUndefined($rootScope.searchDrvId)) {
                drvId = $rootScope.searchDrvId;
            } else {
                drvId = 0;
            }

            $rootScope.driverData = [];
            var allDriverData = [];

            DriverDetails.getDriverDetail({
                address: drvAddress,
                status: drvStatus,
                operationCity: $rootScope.operationCitySelect
            }, function(driverData) {
                console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                     var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }


                    allDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        address: driverData[i].address,
                        contactNo: driverData[i].contact_no,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        driverCurrentStatus: driverData[i].driver_status
                    });


                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                    }
                }
                }else{
                    //operationcity
                    $rootScope.loader = 1;

            var driverStoredData = $localStorage.get('drvSearchData');
            var drvId = null;
            var drvStatus = null;
            var drvAddress = '';
            if (!angular.isUndefined(driverStoredData)) {

                //console.log('driver location: ' + JSON.stringify(driverStoredData.drvLocation));
                if (driverStoredData.driverStatus !== null && driverStoredData.driverStatus !== '' && !angular.isUndefined(driverStoredData.driverStatus)) {

                    drvStatus = driverStoredData.driverStatus;

                }
                if (driverStoredData.drvLocation !== null && driverStoredData.drvLocation !== '' && !angular.isUndefined(driverStoredData.drvLocation)) {
                    drvAddress = driverStoredData.drvLocation;

                }
            }
            if ($rootScope.searchDrvId !== null && $rootScope.searchDrvId !== '' && !angular.isUndefined($rootScope.searchDrvId)) {
                drvId = $rootScope.searchDrvId;
            } else {
                drvId = 0;
            }

            $rootScope.driverData = [];
            var allDriverData = [];

            DriverDetails.getDriverDetail({
                address: drvAddress,
                status: drvStatus,
                operationCity: $rootScope.operationCity
            }, function(driverData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }


                    allDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        driverCurrentStatus: driverData[i].driver_status
                         
                    });


                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                }
            


            


        };
        $scope.searchDriverDetailsExp = function(){//search driver for dl expiry
            var pvData = $localStorage.get('dlData');
            var pvfromDate = moment(pvData.DLFromDate).format('YYYY-MM-DD');
           var pvToDate = moment(pvData.DLToDate).format('YYYY-MM-DD');
            $rootScope.loader = 1;
            $rootScope.pvExpiredDriverData = [];
            var allPvExpiredDriverData = [];

            if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchDriver');
                     $rootScope.loader = 0;
                }else{

                    if($rootScope.operationCitySelect === 'All'){
                        
                        //select
                        DriverDetails.getDLExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCitySelect
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            });
                    }else{
                         DriverDetails.getDLExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCitySelect
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            });
                            //onlycity
                    }
                }
            }else{
                     DriverDetails.getDLExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCity
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            }); //onlycity
                }

        };
        $scope.searchDriverDetailsOther = function(){// search driver by city to down load drivers
        var pvData = $localStorage.get('srData');
            var pvfromDate = moment(pvData.pvfromDate1).format('YYYY-MM-DD');
           var pvToDate = moment(pvData.pvToDate1).format('YYYY-MM-DD');
            $rootScope.loader = 1;
                $rootScope.pvExpiredDriverData = [];
            var allPvExpiredDriverData = [];
            if((!angular.isUndefined(pvData.pvfromDate1)) && (!angular.isUndefined(pvData.pvToDate1))){
                if(angular.isUndefined(pvData.vehicle) && angular.isUndefined(pvData.drvLocation)){
                    DriverDetails.getOtherCityDrivers({//only date selection
      fromDate : pvfromDate,
      ToDate : pvToDate,
      operationCity : $rootScope.operationCitySelect
    },function(driverData){
        console.log('driver scope Data ' + JSON.stringify(driverData));
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }
                    var createdDate = moment(driverData[i].created_date).format('DD-MM-YYYY');

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        status:driverData[i].status,
                        createdDate:createdDate
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                    $rootScope.loader = 0;
            },function(error){
                    $rootScope.loader = 0;
            });  
                }else if(!angular.isUndefined(pvData.vehicle) && angular.isUndefined(pvData.drvLocation)){
                    DriverDetails.getOtherCityDriversVehicle({//date with vehicle
      fromDate : pvfromDate,
      ToDate : pvToDate,
      operationCity : $rootScope.operationCitySelect,
      vehicle:pvData.vehicle
    },function(driverData){
        console.log('driver scope Data ' + JSON.stringify(driverData));
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }
                    var createdDate = moment(driverData[i].created_date).format('DD-MM-YYYY');

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        status:driverData[i].status,
                        createdDate:createdDate
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(error){
                    $rootScope.loader = 0;
            });  
                }else if(angular.isUndefined(pvData.vehicle) && !angular.isUndefined(pvData.drvLocation)){
                    DriverDetails.getOtherCityDriversLocation({//date with location
      fromDate : pvfromDate,
      ToDate : pvToDate,
      operationCity : $rootScope.operationCitySelect,
      location:pvData.drvLocation
    },function(driverData){
        console.log('driver scope Data ' + JSON.stringify(driverData));
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }
                    var createdDate = moment(driverData[i].created_date).format('DD-MM-YYYY');

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        status:driverData[i].status,
                        createdDate:createdDate
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(error){
                    $rootScope.loader = 0;
            });  
                }else if(!angular.isUndefined(pvData.vehicle) && !angular.isUndefined(pvData.drvLocation)){
                    DriverDetails.getOtherCityDriversVehivleLocation({//date with location and vehicle
      fromDate : pvfromDate,
      ToDate : pvToDate,
      operationCity : $rootScope.operationCitySelect,
      vehicle:pvData.vehicle,
      location:pvData.drvLocation
    },function(driverData){
        console.log('driver scope Data ' + JSON.stringify(driverData));
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }
                    var createdDate = moment(driverData[i].created_date).format('DD-MM-YYYY');

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus,
                        status:driverData[i].status,
                        createdDate:createdDate
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(error){
                    $rootScope.loader = 0;
            });  
                }else{

                }
              
            }
   
};


        $scope.searchDriverDetailsofPv = function(){// search drivers by pv expiry details
            var pvData = $localStorage.get('sData');
            var pvfromDate = moment(pvData.pvfromDate).format('YYYY-MM-DD');
           var pvToDate = moment(pvData.pvToDate).format('YYYY-MM-DD');
            $rootScope.loader = 1;
                $rootScope.pvExpiredDriverData = [];
            var allPvExpiredDriverData = [];
            if($rootScope.roleId === '1'){
if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchDriver');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        
                        //select
                        DriverDetails.getPvExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCitySelect
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            });
                    }else{
                         DriverDetails.getPvExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCitySelect
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            });
                            //onlycity
                    }
                }
            }else{
                     DriverDetails.getPvExpiryDrivers({
                fromDate:pvfromDate,
                ToDate:pvToDate,
                operationCity:$rootScope.operationCity
            },function(driverData){
                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].tr_date !== null) {
                        licenseTrDate = new Date(driverData[i].tr_date);
                    }
                    if (driverData[i].nt_date !== null) {
                        licenseNtDate = new Date(driverData[i].nt_date);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }

                    var name;
                     
                     
                    if (!angular.isUndefined(driverData[i].name) || driverData[i].name !== null || driverData[i].name !== '') {
                        name = driverData[i].name;
                    }
                    var luxuryType;
                    if (driverData[i].is_luxury == 'Automatic') {
                        luxuryType = 'A';
                    } else if (driverData[i].is_luxury == 'Luxury') {
                        luxuryType = 'L';
                    } else {
                        luxuryType = 'M';
                    }

                     
                    
                    var drvStatus;
                    if (!angular.isUndefined(driverData[i].status) || driverData[i].status !== null || driverData[i].status !== '') {
                         
                            drvStatus = driverData[i].status;
                         

                    }
                    var balance = 'Rs.00';

                    if (!angular.isUndefined(driverData[i].balance) || driverData[i].balance !== null || driverData[i].balance !== '') {
                        balance = 'Rs.' + driverData[i].balance.toFixed(2);

                    }

                        allPvExpiredDriverData.push({
                        name: name,
                        id:driverData[i].id,
                        contactNo: driverData[i].contact_no,
                        address: driverData[i].address,
                        isLuxury: luxuryType,
                        status: drvStatus,
                        trDate: driverData[i].tr_date,
                        ntDate: driverData[i].nt_date,
                        drvBalance: balance,
                        drvLicenseStatus: licenseStatus
                         
                    });

                }
                $rootScope.pvExpiredDriverData = allPvExpiredDriverData;
                $scope.data = allPvExpiredDriverData;
                $scope.orginalData = allPvExpiredDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();
                    $rootScope.loader = 0;
            },function(err){
                    $rootScope.loader = 0;
            }); //onlycity
                }

        };

        $scope.getNumber = function(num) {
            return new Array(num);
        }
//blockDriverHistoryCtrl

          $scope.blockDriverHistory = function(driverId) {//block driver history for customer

        $rootScope.driverIdForBlock = driverId;
        var modalInstance = $modal.open({
            templateUrl: '/blockDriverHistory.html',
            controller:  blockDriverHistoryCtrl



        
        }); var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
        
        var blockDriverHistoryCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings, CustomerDetails,DriverBlockReport)
        {

              $scope.closeModal = function() {
            
            $modalInstance.dismiss('cancel');
             
        };



 $rootScope.blockDriverData = function() {//block list with customer details
    

var customerData = [];

            DriverBlockReport.find({

                 filter:
                 {
                    where:{
                        driverId:  $rootScope.driverIdForBlock
                    },
                    include: [{
                        relation:'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    },{
                        relation: 'driverDetails'
                    }]

                 }

            },
            function(success){
                $scope.tempData = success;

                for (var i = 0; i < success.length; i++) {
                    $rootScope.driverBlockId = success[i].id;
                }



for (var i = 0; i<  $scope.tempData.length ;  i++) {
   if (angular.isDefined($scope.tempData[i].customerDetails.conUsers)) {

customerData.push({
    customerId :   $scope.tempData[i].customerDetails.id, 
    customerName :    $scope.tempData[i].customerDetails.conUsers.firstName + ' ' +  $scope.tempData[i].customerDetails.conUsers.lastName+'( ' +  $scope.tempData[i].customerDetails.conUsers.mobileNumber +')',
 
});
 

   }
}
$scope.customerArray = customerData;
               // console.log(success);
            },
            function(error){
                 console.log('error', +JSON.stringify(error));

            });
}

        

         $scope.unblockDriverForCustomer = function() {//unblock driver with customer




             DriverBlockReport.driverUnblockForCustomer({
           id:  $rootScope.driverBlockId
       
    }, function(success){

        

            $modalInstance.dismiss('cancel');

        $.notify('Driver Unblocked successfully.', {
                            status: 'success'
                        });
        console.log('successfully');


    }, function(error){


        console.log('error' +JSON.stringify(error));



    });




         }



          };//blockDriverHistoryCtrl

        

         $scope.blockDriver = function(driverId) {
            $rootScope.driverIdForBlock = driverId;
        var modalInstance = $modal.open({
            templateUrl: '/blockDriver.html',
            controller:  blockDriverCtrl

        
        }); 

        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }

     var blockDriverCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings, CustomerDetails,DriverBlockReport) {
      //block driver controller start 
       

      
        $scope.mobileSelected = function() {// for mobile number of cutomer  to block selected

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                // console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.cellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

            }
        };

        $scope.getCustomerMobileDetails = function(customerMobile) {//list of customer to block customer for drivers

            $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    CustomerDetails.getCustomers({
                    operationCity: $rootScope.operationCitySelect
                }, function(customerData) {
                    //console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: customerData[i].mobile_number,
                            customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                            custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


                        });
                    }

                    //console.log('customer List = ' + JSON.stringify($scope.customerList));

                    $rootScope.loader = 0;

                },
                function(custErr) {
                    console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                    $rootScope.loader = 0;
                });
            }else{
               CustomerDetails.getCustomers({
                    operationCity: $rootScope.operationCitySelect
                }, function(customerData) {
                    //console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: customerData[i].mobile_number,
                            customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                            custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


                        });
                    }

                    //console.log('customer List = ' + JSON.stringify($scope.customerList));

                    $rootScope.loader = 0;

                },
                function(custErr) {
                    console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                    $rootScope.loader = 0;
                });
            }
            }else{
              CustomerDetails.getCustomers({
                    operationCity: $rootScope.operationCity
                }, function(customerData) {
                   // console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: customerData[i].mobile_number,
                            customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                            custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


                        });
                    }

                    //console.log('customer List = ' + JSON.stringify($scope.customerList));

                    $rootScope.loader = 0;

                },
                function(custErr) {
                    console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                    $rootScope.loader = 0;
                });
            }
            
        };


        
         
        
$scope.driverBlockForCustomers = function(remark){//block driver function

    console.log('mobileId', + JSON.stringify($scope.mobileId));
    console.log('mobileId', + JSON.stringify($rootScope.driverIdForBlock));
     console.log('remark', + JSON.stringify(remark));

     var usrId =  $rootScope.userId;

    var rmrk = remark;

          if (angular.isUndefined(rmrk)){

             rmrk = '';
          }




    DriverBlockReport.driverBlockForCustomer({
        customerId: $scope.mobileId,
        driverId: $rootScope.driverIdForBlock,
        userId: usrId,
        remark: rmrk
    }, function(success){

        if(success[0].driver_block_for_customer === '0'){
            $modalInstance.dismiss('cancel');
        $.notify('Driver blocked successfully.', {
                            status: 'success'
                        });
} else
{ $modalInstance.dismiss('cancel');
     $.notify('Driver is already blocked for this customer.', {
                            status: 'danger'
                        });
}

    }, function(error){


        console.log('error' +JSON.stringify(error));



    });


 



};
      



        $scope.closeModal = function() {
            
            $modalInstance.dismiss('cancel');
             
        };

    };//block driver controller end
    
        $rootScope.getDriverById = function() {// to search driver by name and number will come here
           //its in main controller
            $rootScope.loader = 1;

            var driverStoredId = $localStorage.get('drvSearchId');

            $rootScope.driverData = [];
            var allDriverData = [];
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    DriverDetails.find({
                filter: {
                    fields: ['id', 'conuserId', 'isLuxury', 'permanentAddress', 'accountNumber', 'ifscCode', 'micrCode', 'createdDate', 'bankName', 'pv', 'cpv', 'emergencyNumber', 'trDate', 'ntDate', 'driverBatch', 'freeAddress', 'driverCode', 'remark', 'pvExpiryDate','cpvDate','BDate', 'licenseDate','vehicle','driverTraining','testScore','InterviewStatus','fitnessCertificate','DOF','InterviewLink'],
                    where: {
                        id: driverStoredId
                    },
                    include: [{
                        relation: 'conUsers',
                        scope: {
                              
                            fields: ['id', 'firstName', 'middleName', 'lastName', 'email', 'otp', 'mobileNumber', 'address', 'status', 'operationCity']
                        }

                    }, {
                        relation: 'driverAccount',
                        scope: {
                            fields: ['id', 'driverId', 'balance']
                        }
                    },{
                                relation: 'bookings',
                                scope: {
                                    fields: ['id', 'driverId', 'rateCount'],
                                    where: {
                                        rateCount: {
                                            neq: null
                                        }
                                    }
                                }
                            }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].trDate !== null) {
                        licenseTrDate = new Date(driverData[i].trDate);
                    }
                    if (driverData[i].ntDate !== null) {
                        licenseNtDate = new Date(driverData[i].ntDate);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }
                    var rateSum = 0;
                            var rateAvg = 0;
                            var rateLength = driverData[i].bookings.length;
                            if(driverData[i].bookings.length > 0){
                                for(var j = 0; j < driverData[i].bookings.length; j++){
                                    rateSum = rateSum + driverData[i].bookings[j].rateCount;
                                }
                                rateAvg = (rateSum / rateLength);
                                rateAvg = Math.round(rateAvg);
                                
                            }
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }
                            var remark =driverData[i].remark

                            if(remark===null){
                                var remark1 ="";
    
                             }else{
                                    var n = remark.indexOf(".");
                                    var remark1 = remark.slice(0, n);
                             }
                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                pvDate:driverData[i].pvExpiryDate,
                                cpvDate:driverData[i].cpvDate,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                bdate: driverData[i].BDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                drvLicenseStatus: licenseStatus,
                                remark: remark1,
                                remarkdes:driverData[i].remark,
                                rateAverage: rateAvg,
                                licenseIssueDate: driverData[i].licenseDate,
                                vehicle: driverData[i].vehicle,
                                operationCity:driverData[i].conUsers.operationCity,
                                driverTraining: driverData[i].driverTraining,
                                testScore: driverData.testScore,
                                InterviewStatus:driverData[i].InterviewStatus,
                                fitnessCertificate:driverData[i].fitnessCertificate,
                                DOF:driverData[i].DOF,
                                InterviewLink: driverData[i].InterviewLink
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();


                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                }else{
                   DriverDetails.find({
                filter: {
                    fields: ['id', 'conuserId', 'isLuxury', 'permanentAddress', 'accountNumber', 'ifscCode', 'micrCode', 'createdDate', 'bankName', 'pv', 'cpv', 'emergencyNumber', 'trDate', 'ntDate', 'driverBatch', 'freeAddress', 'driverCode', 'remark' , 'pvExpiryDate','cpvDate','BDate', 'licenseDate','vehicle','driverTraining','testScore','InterviewStatus','fitnessCertificate','DOF','InterviewLink'],
                    where: {
                        id: driverStoredId
                    },
                    include: [{
                        relation: 'conUsers',
                        scope: {
                             where:{
                                operationCity: $rootScope.operationCitySelect
                            },
                            fields: ['id', 'firstName', 'middleName', 'lastName', 'email', 'otp', 'mobileNumber', 'address', 'status', 'operationCity']
                        }

                    }, {
                        relation: 'driverAccount',
                        scope: {
                            fields: ['id', 'driverId', 'balance']
                        }
                    },{
                                relation: 'bookings',
                                scope: {
                                    fields: ['id', 'driverId', 'rateCount'],
                                    where: {
                                        rateCount: {
                                            neq: null
                                        }
                                    }
                                }
                            }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].trDate !== null) {
                        licenseTrDate = new Date(driverData[i].trDate);
                    }
                    if (driverData[i].ntDate !== null) {
                        licenseNtDate = new Date(driverData[i].ntDate);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }
                    var rateSum = 0;
                            var rateAvg = 0;
                            var rateLength = driverData[i].bookings.length;
                            if(driverData[i].bookings.length > 0){
                                for(var j = 0; j < driverData[i].bookings.length; j++){
                                    rateSum = rateSum + driverData[i].bookings[j].rateCount;
                                }
                                rateAvg = (rateSum / rateLength);
                                rateAvg = Math.round(rateAvg);
                                
                            }
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }
                            var remark =driverData[i].remark

                            if(remark===null){
                                var remark1 ="";
    
                             }else{
                                    var n = remark.indexOf(".");
                                    var remark1 = remark.slice(0, n);
                             }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                pvDate:driverData[i].pvExpiryDate,
                                cpvDate:driverData[i].cpvDate,
                                bdate:driverData[i].BDate,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                drvLicenseStatus: licenseStatus,
                                remark: remark1,
                                remarkdes:driverData[i].remark,
                                rateAverage: rateAvg,
                                licenseIssueDate: driverData[i].licenseDate,
                                vehicle: driverData[i].vehicle,
                                operationCity:driverData[i].conUsers.operationCity,
                                driverTraining: driverData[i].driverTraining,
                                testScore:driverData[i].testScore,
                                InterviewStatus:driverData[i].InterviewStatus,
                                fitnessCertificate:driverData[i].fitnessCertificate,
                                DOF:driverData[i].DOF,
                                InterviewLink: driverData[i].InterviewLink
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();


                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            }); 
                }
                

            }else{
                DriverDetails.find({
                filter: {
                    fields: ['id', 'conuserId', 'isLuxury', 'permanentAddress', 'accountNumber', 'ifscCode', 'micrCode', 'createdDate', 'bankName', 'pv', 'cpv', 'emergencyNumber', 'trDate', 'ntDate', 'driverBatch', 'freeAddress', 'driverCode', 'remark', 'pvExpiryDate','cpvDate','BDate', 'licenseDate','vehicle','driverTraining','testScore','InterviewStatus','fitnessCertificate','DOF','InterviewLink'],
                    where: {
                        id: driverStoredId
                    },
                    include: [{
                        relation: 'conUsers',
                        scope: {
                            where:{
                                operationCity: $rootScope.operationCity
                            },
                            fields: ['id', 'firstName', 'middleName', 'lastName', 'email', 'otp', 'mobileNumber', 'address', 'status', 'operationCity']
                        }

                    }, {
                        relation: 'driverAccount',
                        scope: {
                            fields: ['id', 'driverId', 'balance']
                        }
                    },{
                                relation: 'bookings',
                                scope: {
                                    fields: ['id', 'driverId', 'rateCount'],
                                    where: {
                                        rateCount: {
                                            neq: null
                                        }
                                    }
                                }
                            }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    var currDate = new Date();
                    var licenseStatus = null;
                    var licenseTrDate = null;
                    var licenseNtDate = null;
                    if (driverData[i].trDate !== null) {
                        licenseTrDate = new Date(driverData[i].trDate);
                    }
                    if (driverData[i].ntDate !== null) {
                        licenseNtDate = new Date(driverData[i].ntDate);
                    }
                    if (licenseTrDate !== null && licenseNtDate !== null) {
                        if (licenseTrDate < licenseNtDate) {
                            if (licenseTrDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }


                        } else {
                            if (licenseNtDate < currDate) {
                                licenseStatus = 'Expired';
                            } else {
                                licenseStatus = 'Renewed';
                            }

                        }

                    } else if (licenseTrDate !== null) {

                        if (licenseTrDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else if (licenseNtDate !== null) {

                        if (licenseNtDate < currDate) {
                            licenseStatus = 'Expired';
                        } else {
                            licenseStatus = 'Renewed';
                        }
                    } else {
                        licenseStatus = null;
                    }
                    var rateSum = 0;
                            var rateAvg = 0;
                            var rateLength = driverData[i].bookings.length;
                            if(driverData[i].bookings.length > 0){
                                for(var j = 0; j < driverData[i].bookings.length; j++){
                                    rateSum = rateSum + driverData[i].bookings[j].rateCount;
                                }
                                rateAvg = (rateSum / rateLength);
                                rateAvg = Math.round(rateAvg);
                                
                            }
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }
                            var remark =driverData[i].remark;

                            if(remark===null){
                                var remark1 ="";
    
                             }else{
                                    var n = remark.indexOf(".");
                                    var remark1 = remark.slice(0, n);
                             }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                pvDate:driverData[i].pvExpiryDate,
                                cpvDate:driverData[i].cpvDate,
                                trDate: driverData[i].trDate,
                                bdate: driverData[i].BDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                drvLicenseStatus: licenseStatus,
                                remark: remark1,
                                remarkdes:driverData[i].remark,
                                rateAverage: rateAvg,
                                licenseIssueDate: driverData[i].licenseDate,
                                vehicle: driverData[i].vehicle,
                                operationCity:driverData[i].conUsers.operationCity,
                                driverTraining: driverData[i].driverTraining,
                                testScore:driverData[i].testScore,
                                InterviewStatus:driverData[i].InterviewStatus,
                                fitnessCertificate:driverData[i].fitnessCertificate,
                                DOF:driverData[i].DOF,
                                InterviewLink: driverData[i].InterviewLink
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();


                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

            }
            

        };
        $rootScope.searchDriverDetailsById = function() {//search driver by id
            if (!angular.isUndefined($rootScope.searchDrvId)) {

                $localStorage.put('drvSearchData', undefined);
                $localStorage.put('drvSearchId', $rootScope.searchDrvId);
                //console.log('search driver Id ' + JSON.stringify($localStorage.get('drvSearchId')));
                $rootScope.setFlag1 = false;

                $state.go('app.manageDriver');

            }


        }
        $rootScope.fetchDriverDataFunction = function() {//fetch driver data based on id or address

            if (!angular.isUndefined($localStorage.get('drvSearchId'))) {

                $rootScope.getDriverById();

            } else if (!angular.isUndefined($localStorage.get('drvSearchData'))) {

                $rootScope.getDriverAgain();

            } else {

            }
        }
        $rootScope.searchDriverDetails = function(searchData) {
            if (angular.isUndefined(searchData)) {

                document.getElementById("driverData1").innerHTML = 'Please select at least one criteria';

            } else {

                if(searchData.driverStatus === 'All' && angular.isUndefined(searchData.drvLocation)){
                     document.getElementById("driverData1").innerHTML = 'Please select Location';   
                }else if(angular.isUndefined(searchData.driverStatus)){
                       document.getElementById("driverDataStatus").innerHTML = 'Please select status';  
             }else if(angular.isUndefined(searchData.drvLocation)){
                       document.getElementById("driverData1").innerHTML = 'Please select Location';  
            } else{
                document.getElementById("driverData1").innerHTML = '';
                $localStorage.put('drvSearchId', undefined);
                $localStorage.put('drvSearchData', searchData);
                $rootScope.setFlag2 = false;
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchDriverAgain');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }


        }
        $rootScope.searchPvDriverDetails = function(sData) { //search pv driver details 
            if (angular.isUndefined(sData)) {

                document.getElementById("fromDate").innerHTML = 'Please select date';

            } else {

                 if(angular.isUndefined(sData.pvfromDate) && !angular.isUndefined(sData.pvToDate)){
                       document.getElementById("ToDate").innerHTML = 'Please select To Date';  
             }else if(!angular.isUndefined(sData.pvfromDate) && angular.isUndefined(sData.pvToDate)){
                       document.getElementById("fromDate").innerHTML = 'Please select From Date';  
            } else{
                document.getElementById("ToDate").innerHTML = '';
                 
                $localStorage.put('sData', sData);
                 
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchDriverWithPv');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }


        }
        $rootScope.searchDLExpiryDriverDetails = function(dlData) {//search dl expiry details
            if (angular.isUndefined(dlData)) {

                document.getElementById("fromDateEx").innerHTML = 'Please select date';

            } else {

                 if(angular.isUndefined(dlData.DLFromDate) && !angular.isUndefined(dlData.DLToDate)){
                       document.getElementById("ToDateEx").innerHTML = 'Please select To Date';  
             }else if(!angular.isUndefined(dlData.DLFromDate) && angular.isUndefined(dlData.DLToDate)){
                       document.getElementById("fromDateEx").innerHTML = 'Please select From Date';  
            } else{
                document.getElementById("ToDateEx").innerHTML = '';
                 
                $localStorage.put('dlData', dlData);
                 
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchDriverDetailsEx');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }


        }
        $rootScope.searchDriverDetailsOthers = function(srData) {//search all drivers download data
            if (angular.isUndefined(srData)) {

                document.getElementById("fromDateOther").innerHTML = 'Please select date';

            } else {

                 if(angular.isUndefined(srData.pvfromDate1) && !angular.isUndefined(srData.pvToDate1)){
                       document.getElementById("ToDateOther").innerHTML = 'Please select To Date';  
             }else if(!angular.isUndefined(srData.pvfromDate1) && angular.isUndefined(srData.pvToDate1)){
                       document.getElementById("fromDateOther").innerHTML = 'Please select From Date';  
            } else{
                document.getElementById("ToDateOther").innerHTML = '';
                 
                $localStorage.put('srData', srData);
                 
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchDriverCityOther');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }


        }
         $scope.confirmRecharge = function(account) {//driver recharge confirmation
                $scope.isDisabled = true;
                console.log('account data' + JSON.stringify($rootScope.searchDrvId));
                $scope.rechargeBtn = true;
                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }



                if (count > 0) {
                    $scope.count = count;
                    $scope.rechargeBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    if ($window.confirm("Are you sure? Rs. " + account.amount + " will be added to the account of driver Account.")) {
                        $scope.result = "Yes";
                        $rootScope.driverRechargeAccount(account);
                        $rootScope.loader = 0;
                    } else {
                        $scope.result = "No";
                        $rootScope.loader = 0;
                        $scope.isDisabled = false;
                        $scope.rechargeBtn = false;
                    }
                }
            }
            $rootScope.driverRechargeAccount = function(account) {//after confirmation call comes here

                //console.log('account data' + JSON.stringify(account));

                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }



                if (count > 0) {
                    $scope.count = count;
                    $scope.rechargeBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    DriverAccount.driverAmountDeposit({
                        driverId: $rootScope.searchDrvId,
                        amount: account.amount,
                        userId: $rootScope.userId,
                        description: account.description
                    }, function(depositSuccess) {
                        //console.log('depositSuccess ' + JSON.stringify(depositSuccess));
                       // $modalInstance.dismiss('cancel');
                        //$rootScope.getAllDriver();
                        //reloadFunc();
                        $rootScope.searchDrvId = undefined;
                        $scope.account = null;
                        $.notify('Driver Account Successfully Recharged.', {
                                    status: 'success'
                                });
                        $rootScope.loader = 0;
                            $state.go('app.recharge');

                    }, function(depositErr) {
                        console.log('depositErr ' + JSON.stringify(depositErr));

                        $scope.rechargeBtn = false;
                       // $modalInstance.dismiss('cancel');
                        if (depositErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
                }
            }


          $scope.fetchsearchDrvList = function() {// fetch all drivers list


            $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect ==='All'){
                    DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver Data*' + JSON.stringify(driverData));
                $scope.searchDrvList = [];
                if (!angular.isUndefined(driverData)) {
                    for (var i = 0; i < driverData.length; i++) {
                          $scope.searchDrvList.push({
                            id: driverData[i].id,
                            mobileNumber: driverData[i].mobile_number,
                            driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                            driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

                        });
                        //console.log('driver list' + JSON.stringify($scope.searchDrvList));
                    }
                }



                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
                }else{
                   DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver Data*' + JSON.stringify(driverData));
                $scope.searchDrvList = [];
                if (!angular.isUndefined(driverData)) {
                    for (var i = 0; i < driverData.length; i++) {
                          $scope.searchDrvList.push({
                            id: driverData[i].id,
                            mobileNumber: driverData[i].mobile_number,
                            driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                            driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

                        });
                        //console.log('driver list' + JSON.stringify($scope.searchDrvList));
                    }
                }



                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
                }
                

            }else{
                 DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver Data*' + JSON.stringify(driverData));
                $scope.searchDrvList = [];
                if (!angular.isUndefined(driverData)) {
                    for (var i = 0; i < driverData.length; i++) {
                          $scope.searchDrvList.push({
                            id: driverData[i].id,
                            mobileNumber: driverData[i].mobile_number,
                            driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                            driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

                        });
                        //console.log('driver list' + JSON.stringify($scope.searchDrvList));
                    }
                }



                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
            }
            
        };


        $scope.drvSearchMobileSelected = function() {//mobile number selected

            if ($scope.search !== undefined && $scope.search.mobileNumber2 !== undefined && $scope.search.mobileNumber2 !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));

                $rootScope.searchDrvId = $scope.search.mobileNumber2.originalObject.id;

            }
        };


        $scope.searchStatusArray = [{
            'desc': 'All'
        }, {
            'desc': 'Active'
        }, {
            'desc': 'Inactive'
        }];

        $rootScope.searchByDriverStatusFunction = function(searchStatus) {//search driver by status
            //console.log('searchStatus' + searchStatus);
            $localStorage.put('searchDriverStatus', searchStatus);
            if (searchStatus === 'Active' || searchStatus === 'Inactive') {
                //console.log('paid or Done :' + searchStatus);
                $scope.searchDriversByStatus(searchStatus);
            }

            if (searchStatus === 'All') {
                //console.log('all :' + searchStatus);
                $scope.searchAllDrivers(searchStatus);
            }

        }

        $scope.searchDriversByStatus = function(searchStatus) {//seach status for active r inactive
            //console.log('Called get driver');
            $rootScope.loader = 1;

            $rootScope.driverData = [];
            var allDriverData = [];

            var drvStatus = '';
            if (searchStatus === 'Active') {
                drvStatus = 'Active';
            } else {
                drvStatus = 'Inactive';
            }
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers',
                        scope: {
                            where: {
                                status: drvStatus 
                            }
                        }
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                }else{
                   DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers',
                        scope: {
                            where: {
                                status: drvStatus,
                                operationCity:$rootScope.operationCitySelect 
                            }
                        }
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            }); 
                }
                

            }else{
                DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers',
                        scope: {
                            where: {
                                status: drvStatus,
                                operationCity:$rootScope.operationCity
                            }
                        }
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

            }
            

        };

        $scope.searchAllDrivers = function(searchStatus) {
            //console.log('Called get driver');
            $rootScope.loader = 1;

            $rootScope.driverData = [];
            var allDriverData = [];

            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers'
                          
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

            }else{
                DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers',
                         scope:{
                            where:{
                                operationCity:operationCitySelect
                            }
                         }
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

            }
                

            }else{
                DriverDetails.find({
                filter: {
                    include: [{
                        relation: 'conUsers',
                        scope:{
                            where:{
                                operationCity:$rootScope.operationCity
                            }
                        }
                    }, {
                        relation: 'driverAccount'
                    }]
                }
            }, function(driverData) {
                //console.log('driver all Data ' + JSON.stringify(driverData));

                for (var i = 0; i < driverData.length; i++) {
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conuserId)) {
                            var name;
                            if (driverData[i].conUsers.middleName == null) {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                            } else {
                                name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                            }
                            var drvBatch;
                            if (!angular.isUndefined(driverData[i].driverBatch) || driverData[i].driverBatch !== null || driverData[i].driverBatch !== '') {
                                drvBatch = driverData[i].driverBatch;
                            }
                            var luxuryType;
                            if (driverData[i].isLuxury == 'Automatic') {
                                luxuryType = 'A';
                            } else if (driverData[i].isLuxury == 'Luxury') {
                                luxuryType = 'L';
                            } else {
                                luxuryType = 'M';
                            }

                            var registerType;
                            if (driverData[i].conUsers.otp == null) {
                                registerType = 'No';
                            } else {
                                registerType = 'Yes';
                            }
                            var driverCode = '0';
                            if (!angular.isUndefined(driverData[i].driverCode) || driverData[i].driverCode !== null || driverData[i].driverCode !== '') {
                                driverCode = driverData[i].driverCode;
                            }
                            var drvStatus;
                            if (!angular.isUndefined(driverData[i].conUsers.status) || driverData[i].conUsers.status !== null || driverData[i].conUsers.status !== '') {
                                if (driverData[i].conUsers.status === 'Inactive') {
                                    drvStatus = 'Inactive';
                                } else {
                                    drvStatus = driverData[i].conUsers.status;
                                }

                            }
                            var balance = 'Rs.00';
                            if (driverData[i].driverAccount.length > 0) {
                                if (!angular.isUndefined(driverData[i].driverAccount[0].balance) || driverData[i].driverAccount[0].balance !== null || driverData[i].driverAccount[0].balance !== '') {
                                    balance = 'Rs.' + driverData[i].driverAccount[0].balance.toFixed(2);

                                }
                            }

                            allDriverData.push({
                                id: driverData[i].id,
                                conuserId: driverData[i].conUsers.id,
                                name: name,
                                firstName: driverData[i].conUsers.firstName,
                                middleName: driverData[i].conUsers.middleName,
                                lastName: driverData[i].conUsers.lastName,
                                email: driverData[i].conUsers.email,
                                address: driverData[i].conUsers.address,
                                contactNo: driverData[i].conUsers.mobileNumber,
                                isLuxury: luxuryType,
                                status: drvStatus,
                                accountNumber: driverData[i].accountNumber,
                                bankName: driverData[i].bankName,
                                ifscCode: driverData[i].ifscCode,
                                permanentAddress: driverData[i].permanentAddress,
                                createdDate: driverData[i].createdDate,
                                otp: driverData[i].conUsers.otp,
                                emergencyNumber: driverData[i].emergencyNumber,
                                registrationType: registerType,
                                pv: driverData[i].pv,
                                cpv: driverData[i].cpv,
                                trDate: driverData[i].trDate,
                                ntDate: driverData[i].ntDate,
                                driverBatch: drvBatch,
                                freeAddress: driverData[i].freeAddress,
                                driverCode: driverCode,
                                drvBalance: balance,
                                operationCity:driverData[i].conUsers.operationCity
                            });
                        }
                    }
                }

                $rootScope.driverData = allDriverData;
                $scope.data = allDriverData;
                $scope.orginalData = allDriverData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));

                $scope.doSearch();
                $rootScope.loader = 0;


            }, function(driverErr) {
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });


            }
            
        };

        $scope.doSearch = function() {

            $scope.tableParams3.reload();
        }


        $scope.DriverAccountPopup = function(driverId) {
            $localStorage.put('driverId', driverId);
            //$state.go('app.driverAccount');

            var modalInstance = $modal.open({
                templateUrl: '/driverAccountPopup.html',
                controller: ModalDriverAccountCtrl,
                windowClass: 'app-modal-window'
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });

        };

        $scope.rechargeAccountPopup = function(driverId) {
            $scope.isDisabled = false;
            //console.log('driver id for recharge' + driverId);

            $rootScope.drvIdForRecharge = driverId;

            var modalInstance = $modal.open({
                templateUrl: '/driverRechargeAccountPopup.html',
                controller: ModalDriverRechargeAccountCtrl,
                windowClass: 'app-modal-window-new'

            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });

        };

        $scope.deductAccountPopup = function(driverId) {
            $scope.isDisabled = false;
            //console.log('driver id for deduct' + driverId);

            $rootScope.drvIdForDeduct = driverId;

            var modalInstance = $modal.open({
                templateUrl: '/driverDeductAccountPopup.html',
                controller: ModalDriverDeductAccountCtrl,
                windowClass: 'app-modal-window-new'

            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });

        };


        var ModalDriverAccountCtrl = function($scope, $rootScope, $modalInstance, Bookings) {
            

            $rootScope.appintedCustomerDetails = [];
            $scope.getEmploymentHistory = function(){

                var driverId = $localStorage.get('drvSearchId');
                Company2DriverDetails.getAppointedCustomerDetails({
                                 
                                        driverId:driverId
                                 
                            },function(success){
                                
                                 if(success.length == 0){
                                            $modalInstance.dismiss('cancel');
                                            window.alert('Driver Employment History Not available to retrieve is Empty');
                                    }
                                     else{

                                               $rootScope.appintedCustomerDetails = success;
                                     }
                    
                            },function(error){
                                console.log("error");

                            });

            };

            //start ModalDriverAccountCtrl sub controller to get account details and load transactons
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.accountExist = undefined;
                $rootScope.driverAccountDetails = undefined;
                $rootScope.transactionDetails = undefined;
                $rootScope.cruise = undefined;
            };

            $rootScope.getAccountDetails = function() {
                $rootScope.loader = 1;
                $rootScope.noBalance = false;
                var driverId = $localStorage.get('driverId');
                var driverAccDataArray = [];

                DriverDetails.find({
                        filter: {
                            where: {
                                id: driverId
                            },
                            include: [{
                                relation: 'conUsers'
                                

                            }, {
                                relation: 'driverAccount',
                                scope: {


                                    include: {

                                        relation: 'driverAccountTransactions',
                                        scope: {
                                            order: ['id DESC'],

                                            limit: 1
                                        }

                                    }
                                }

                            }]
                        }
                    },
                    function(driverData) {
                        //console.log('driver account details:' + JSON.stringify(driverData));

                        var drvName = null;
                        var drvFirstName = null;
                        var drvLastName = null;
                        if (angular.isDefined(driverData) && driverData.length > 0) {
                            if (angular.isDefined(driverData[0].conUsers)) {
                                if (!angular.isUndefined(driverData[0].conUsers.firstName) || driverData[0].conUsers.firstName !== null || driverData[0].conUsers.firstName !== '') {
                                    drvFirstName = driverData[0].conUsers.firstName;
                                }

                                if (!angular.isUndefined(driverData[0].conUsers.lastName) || driverData[0].conUsers.lastName !== null || driverData[0].conUsers.lastName !== '') {
                                    drvLastName = driverData[0].conUsers.lastName;
                                }


                            }
                            if (driverData[0].driverAccount.length > 0) {
                                $rootScope.accountExist = true;
                                var accId = driverData[0].driverAccount[0].id;
                                var balance = driverData[0].driverAccount[0].balance;
                                if (driverData[0].driverAccount[0].driverAccountTransactions.length > 0) {
                                    var amount = driverData[0].driverAccount[0].driverAccountTransactions[0].amount;
                                }

                            } else {
                                $rootScope.accountExist = false;
                            }
                            driverAccDataArray.push({
                                driverId: driverData[0].id,
                                drvName: drvFirstName + ' ' + drvLastName,
                                accountId: accId,
                                totalBalance: balance,
                                lastTransaction: amount
                            });
                            $rootScope.driverAccountDetails = driverAccDataArray;
                            //console.log('driver account data:' + JSON.stringify($rootScope.driverAccountDetails));
                            if ($rootScope.accountExist === true) {
                                $rootScope.loadTransactionDetails();
                            }


                        }

                        $rootScope.loader = 0;
                    },
                    function(err) {
                        $rootScope.loader = 0;
                        console.log('driver all Data ' + JSON.stringify(err));
                    });
            };

            $rootScope.loadTransactionDetails = function() {
                $rootScope.limit = 10;
                $rootScope.getTransactionDetails();
            }

            $rootScope.loadMore = function() {
                $rootScope.limit = $rootScope.limit + 10;
                //$rootScope.limit = increamented > $rootScope.cruise.length ? $rootScope.cruise.length : increamented;
                $rootScope.getTransactionDetails();
            };

            $rootScope.getTransactionDetails = function() {

                var allTransactionData = [];
                var driverId1 = $localStorage.get('driverId');
                $rootScope.loader = 1;
                DriverAccountTransactions.find({

                    filter: {

                        where: {

                            accountId: $rootScope.driverAccountDetails[0].accountId
                        },
                        limit: $rootScope.limit,
                        order: ['id DESC']

                    }
                }, function(transactionData) {
                    //console.log('transactionData' + JSON.stringify(transactionData));

                    for (var i = 0; i < transactionData.length; i++) {
                        var desc;
                        if (transactionData[i].description === 'undefined' || transactionData[i].description === '' || transactionData[i].description === null) {
                            desc = '-';
                        } else {
                            desc = transactionData[i].description;
                        }
                        allTransactionData.push({
                            transactionDate: transactionData[i].createdDate,
                            description: desc,
                            amount: transactionData[i].amount,
                            balance: transactionData[i].Balance
                        });



                    }
                    $rootScope.transactionDetails = allTransactionData;
                    $scope.data = allTransactionData;
                    $rootScope.cruise = allTransactionData;
                    //console.log('driver transaction details:' + JSON.stringify(allTransactionData));
                    //createTable();
                    $rootScope.loader = 0;
                }, function(err) {
                    $rootScope.loader = 0;
                    console.log('driver all Data ' + JSON.stringify(err));
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

            $scope.tableParams2 = new ngTableParams({

                count: [] // count per page

            }, {
                total: [] // length of data

            });

        }//start ModalDriverAccountCtrl sub controller

        var ModalDriverRechargeAccountCtrl = function($scope, $rootScope, $modalInstance, Bookings) {
            //start ModalDriverRechargeAccountCtrl sub controller for recharge 
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.drvIdForRecharge = undefined;
                $rootScope.rechargeAccountDetails = undefined;

            };

            $rootScope.getRechargeAccountDetails = function() {
                $rootScope.loader = 1;

                var driverRechargeAccData = [];

                DriverDetails.find({
                        filter: {
                            where: {
                                id: $rootScope.drvIdForRecharge
                            },
                            include: [{
                                relation: 'conUsers'
                                 

                            }, {
                                relation: 'driverAccount',
                                scope: {


                                    include: {

                                        relation: 'driverAccountTransactions',
                                        scope: {
                                            order: ['createdDate DESC'],

                                            limit: 1
                                        }

                                    }
                                }

                            }]
                        }
                    },
                    function(driverData) {
                        //console.log('driver account details:' + JSON.stringify(driverData));

                        var drvName = null;
                        var drvFirstName = null;
                        var drvLastName = null;
                        if (angular.isDefined(driverData) && driverData.length > 0) {
                            if (angular.isDefined(driverData[0].conUsers)) {
                                if (!angular.isUndefined(driverData[0].conUsers.firstName) || driverData[0].conUsers.firstName !== null || driverData[0].conUsers.firstName !== '') {
                                    drvFirstName = driverData[0].conUsers.firstName;
                                }

                                if (!angular.isUndefined(driverData[0].conUsers.lastName) || driverData[0].conUsers.lastName !== null || driverData[0].conUsers.lastName !== '') {
                                    drvLastName = driverData[0].conUsers.lastName;
                                }


                            }
                            if (driverData[0].driverAccount.length > 0) {
                                $rootScope.rechargeAccountExist = true;
                                var accId = driverData[0].driverAccount[0].id;
                                var balance = driverData[0].driverAccount[0].balance;
                                if (driverData[0].driverAccount[0].driverAccountTransactions.length > 0) {
                                    var amount = driverData[0].driverAccount[0].driverAccountTransactions[0].amount;
                                }

                            } else {
                                $rootScope.rechargeAccountExist = false;
                            }
                            driverRechargeAccData.push({
                                driverId: driverData[0].id,
                                drvName: drvFirstName + ' ' + drvLastName,
                                accountId: accId,
                                totalBalance: balance,
                                lastTransaction: amount
                            });
                            $rootScope.rechargeAccountDetails = driverRechargeAccData;
                            //console.log('driver account data:' + JSON.stringify($rootScope.rechargeAccountDetails));

                        }

                        $rootScope.loader = 0;
                    },
                    function(err) {
                        $rootScope.loader = 0;
                        console.log('driver all Data ' + JSON.stringify(err));
                    });
            };


            $scope.confirm = function(account) { // confirm recharge account
                $scope.isDisabled = true;
                //console.log('account data' + JSON.stringify(account));
                $scope.rechargeBtn = true;
                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }


                if (count > 0) {
                    $scope.count = count;
                    $scope.rechargeBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    if ($window.confirm("Are you sure? Rs. " + account.amount + " will be added to the account of driver " + $rootScope.rechargeAccountDetails[0].drvName + "(Account number: " + $rootScope.rechargeAccountDetails[0].accountId + ").")) {
                        $scope.result = "Yes";
                        $rootScope.rechargeAccount(account);
                        $rootScope.loader = 0;
                    } else {
                        $scope.result = "No";
                        $rootScope.loader = 0;
                        $scope.isDisabled = false;
                        $scope.rechargeBtn = false;
                    }
                }
            }
            $rootScope.rechargeAccount = function(account) {//recharge 

                //console.log('account data' + JSON.stringify(account));

                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }


                if (count > 0) {
                    $scope.count = count;
                    $scope.rechargeBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    DriverAccount.driverAmountDeposit({
                        driverId: $rootScope.drvIdForRecharge,
                        amount: account.amount,
                        userId: $rootScope.userId,
                        description: account.description
                    }, function(depositSuccess) {
                        //console.log('depositSuccess ' + JSON.stringify(depositSuccess));
                        $modalInstance.dismiss('cancel');
                        $rootScope.getAllDriver();
                        //reloadFunc();
                        $rootScope.loader = 0;


                    }, function(depositErr) {
                        console.log('depositErr ' + JSON.stringify(depositErr));

                        $scope.rechargeBtn = false;
                        $modalInstance.dismiss('cancel');
                        if (depositErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
                }
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

        }//ModalDriverRechargeAccountCtrl end sub controller

        var ModalDriverDeductAccountCtrl = function($scope, $rootScope, $modalInstance, Bookings) {
            //ModalDriverDeductAccountCtrl start sub controller
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.drvIdForRecharge = undefined;
                $rootScope.rechargeAccountDetails = undefined;

            };

            $rootScope.getDeductAccountDetails = function() {//get details of account to deduct
                $rootScope.loader = 1;

                var driverDeductAccData = [];

                DriverDetails.find({
                        filter: {
                            where: {
                                id: $rootScope.drvIdForDeduct
                            },
                            include: [{
                                relation: 'conUsers'
                                 

                            }, {
                                relation: 'driverAccount',
                                scope: {


                                    include: {

                                        relation: 'driverAccountTransactions',
                                        scope: {
                                            order: ['createdDate DESC'],

                                            limit: 1
                                        }

                                    }
                                }

                            }]
                        }
                    },
                    function(driverData) {
                        //console.log('driver account details:' + JSON.stringify(driverData));

                        var drvName = null;
                        var drvFirstName = null;
                        var drvLastName = null;
                        if (angular.isDefined(driverData) && driverData.length > 0) {
                            if (angular.isDefined(driverData[0].conUsers)) {
                                if (!angular.isUndefined(driverData[0].conUsers.firstName) || driverData[0].conUsers.firstName !== null || driverData[0].conUsers.firstName !== '') {
                                    drvFirstName = driverData[0].conUsers.firstName;
                                }

                                if (!angular.isUndefined(driverData[0].conUsers.lastName) || driverData[0].conUsers.lastName !== null || driverData[0].conUsers.lastName !== '') {
                                    drvLastName = driverData[0].conUsers.lastName;
                                }


                            }
                            if (driverData[0].driverAccount.length > 0) {
                                $rootScope.deductAccountExist = true;
                                var accId = driverData[0].driverAccount[0].id;
                                var balance = driverData[0].driverAccount[0].balance;
                                if (driverData[0].driverAccount[0].driverAccountTransactions.length > 0) {
                                    var amount = driverData[0].driverAccount[0].driverAccountTransactions[0].amount;
                                }

                            } else {
                                $rootScope.deductAccountExist = false;
                            }
                            driverDeductAccData.push({
                                driverId: driverData[0].id,
                                drvName: drvFirstName + ' ' + drvLastName,
                                accountId: accId,
                                totalBalance: balance,
                                lastTransaction: amount
                            });
                            $rootScope.deductAccountDetails = driverDeductAccData;
                            //console.log('driver account data:' + JSON.stringify($rootScope.deductAccountDetails));

                        }

                        $rootScope.loader = 0;
                    },
                    function(err) {
                        $rootScope.loader = 0;
                        console.log('driver all Data ' + JSON.stringify(err));
                    });
            };


            $scope.confirm = function(account) {//confirm deduction
                $scope.isDisabled = true;
                //console.log('account data' + JSON.stringify(account));
                $scope.deductBtn = true;
                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }


                if (count > 0) {
                    $scope.count = count;
                    $scope.deductBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    if ($window.confirm("Are you sure? Rs. " + account.amount + " will be deducted from the account of driver " + $rootScope.deductAccountDetails[0].drvName + "(Account number: " + $rootScope.deductAccountDetails[0].accountId + ").")) {
                        $scope.result = "Yes";
                        $rootScope.deductAccount(account);
                        $rootScope.loader = 0;
                    } else {
                        $scope.result = "No";
                        $rootScope.loader = 0;
                        $scope.isDisabled = false;
                        $scope.deductBtn = false;
                    }
                }
            }
            $rootScope.deductAccount = function(account) {


                //console.log('account data' + JSON.stringify(account));

                $rootScope.loader = 1;
                var count = 0;
                if (angular.isDefined(account)) {
                    if (angular.isUndefined(account.amount) || account.amount === '' || account.amount === null) {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';

                    }
                } else {
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                }


                if (count > 0) {
                    $scope.count = count;
                    $scope.deductBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    DriverAccount.driverAmountDeduct({
                        driverId: $rootScope.drvIdForDeduct,
                        amount: account.amount,
                        userId: $rootScope.userId,
                        description: account.description
                    }, function(deductSuccess) {
                        //console.log('deductSuccess ' + JSON.stringify(deductSuccess));
                        
                        $modalInstance.dismiss('cancel');
                        $rootScope.getAllDriver();
                        //reloadFunc();
                        $rootScope.loader = 0;


                    }, function(deductErr) {
                        console.log('deductErr ' + JSON.stringify(deductErr));

                        $scope.deductBtn = false;
                        $modalInstance.dismiss('cancel');
                        if (depositErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
                }
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

        }//ModalDriverDeductAccountCtrl end sub controller


        $rootScope.getAllDriver = function() {
            $scope.count = 0;
            loadFunc();

        };

        function loadFunc() {

            $scope.timers = setInterval(loadData, 5);


        }

        function loadData() {
            $scope.count = $scope.count + 1;
            if ($scope.count >= 2) {
                clearInterval($scope.timers);
            } else {
                $state.go($state.current, {}, {
                    reload: true
                });

            }
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
        $scope.sendMessage =  0;
         $scope.sendMessageButton = function() {
            $scope.sendMessage =  1;
         }
        $scope.Message = function() {
            // console.log('create popup called.' + modelAssetId);

            var modalInstance = $modal.open({
                templateUrl: '/sendMessage.html',
                controller: ModalDriverCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });

        };
        $scope.pushNotification = function() {
            // console.log('create popup called.' + modelAssetId);

            var modalInstance = $modal.open({
                templateUrl: '/sendPushNotification.html',
                controller: ModalDriverCtrl 
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });

        };

        $scope.count = 0;
        $scope.select = [];
        $scope.selectN = [];

        $rootScope.checksAll = function() {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
                //console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
            } else {
                $scope.selectedAll = false;
                //console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
            }
            angular.forEach($rootScope.driverData, function(driver) {
                driver.Selected = $scope.selectedAll;
            });

        }
        $rootScope.selectDriver = function(contactNo, name) {
            if ($scope.selct.length !== null) {
                $scope.select = $scope.selct;
                $scope.selectN = $scope.selctn;
            }


            if ($scope.select.indexOf(contactNo) == -1 && $scope.selectN.indexOf(name) == -1) {
                $scope.selectN.push(name);
                $scope.select.push(contactNo);
                $scope.count++;

            } else {
                for (var i = $scope.select.length - 1; i >= 0; i--) {

                    if ($scope.select[i] == contactNo && $scope.selectN[i] == name) {
                        $scope.select.splice(i, 1);
                        $scope.selectN.splice(i, 1);
                        $scope.count--;

                    }

                }


            }
            $rootScope.number = $scope.select;
            $rootScope.cname = $scope.selectN;
        };

        var cnt = 0;
        $scope.count = 0;
        $scope.selct = [];
        $scope.selctn = [];
        $rootScope.selectAllDriver = function() {

            if (cnt == 0) {
                $scope.selct = [];
                $scope.selctn = [];
                var num = $rootScope.driverData.length;

                for (var i = 0; i < num; i++) {

                    /*$rootScope.selectCustomer($rootScope.driverData[i].contactNo);*/
                    if ($scope.selct.indexOf($rootScope.driverData[i].contactNo) == -1 && $scope.selctn.indexOf($rootScope.driverData[i].name) == -1) {
                        $scope.selct.push($rootScope.driverData[i].contactNo);
                        $scope.selctn.push($rootScope.driverData[i].name);
                        $scope.count++;
                        //console.log('count:' + JSON.stringify($scope.cont));
                    } else {
                        for (var j = $scope.selct.length - 1; j >= 0; j--) {

                            if ($scope.selct[j] == $rootScope.driverData[i].contactNo && $scope.selctn[j] == $rootScope.driverData[i].name) {
                                $scope.selct.splice(j, 1);
                                $scope.selctn.splice(j, 1);
                                $scope.count--;

                            }

                        }


                    }
                    $rootScope.number = $scope.selct;
                    $rootScope.cname = $scope.selctn;
                    cnt = 1;
                }
            } else {

                $rootScope.number = [];
                $rootScope.cname = [];
                $scope.selct = [];
                $scope.selctn = [];
                $scope.count = 0;
                cnt = 0;

            }

        }

        $scope.settlementPopup = function(driverId) {
            $localStorage.put('driverId', driverId);
            $state.go('app.driverSettlement');

        };

        $scope.jobRequestPopup = function(driverId){
            $localStorage.put('jobRequestDrvId', driverId);
            $state.go('app.driverJobRequestHistory');
        }

        $scope.changePV = function(drvId) {
            $rootScope.loader = 1;
            if (angular.isDefined(drvId) && drvId !== null) {
                DriverDetails.findById({
                    id: drvId
                }, function(DriverDetails) {
                    //console.log('' + JSON.stringify(DriverDetails));
                    if (DriverDetails.pv == true) {
                        DriverDetails.pv = false;
                        DriverDetails.updatedBy = $localStorage.get('userId');
                        DriverDetails.updatedDate = new Date();
                        DriverDetails.$save();
                    } else {
                        DriverDetails.pv = true;
                        DriverDetails.updatedBy = $localStorage.get('userId');
                        DriverDetails.updatedDate = new Date();
                        DriverDetails.$save();
                    }
                    $rootScope.getAllDriver();
                    //reloadFunc();
                    $rootScope.loader = 0;


                }, function(error) {
                    console.log('Error updating Driver : ' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });
            }

        };

        $scope.changeCPV = function(drvId) {
            $rootScope.loader = 1;
            if (angular.isDefined(drvId) && drvId !== null) {
                DriverDetails.findById({
                    id: drvId
                }, function(DriverDetails) {
                    //console.log('' + JSON.stringify(DriverDetails));
                    if (DriverDetails.cpv == true) {
                        DriverDetails.cpv = false;
                        DriverDetails.updatedBy = $localStorage.get('userId');
                        DriverDetails.updatedDate = new Date();
                        DriverDetails.$save();
                    } else {
                        DriverDetails.cpv = true;
                        DriverDetails.updatedBy = $localStorage.get('userId');
                        DriverDetails.updatedDate = new Date();
                        DriverDetails.$save();
                    }
                    $rootScope.getAllDriver();
                    //reloadFunc();
                    $rootScope.loader = 0;

                }, function(error) {
                    console.log('Error updating Driver : ' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });
            }

        };

        $scope.showconfirmbox = function(drvId) {
            //console.log('driverID**' + drvId);
            if ($window.confirm("Do you want to deactivate this driver?")) {
                $scope.result = "Yes";
                $scope.deactivate(drvId);
            } else {
                $scope.result = "No";
            }
        }
        $scope.deactivate = function(drvId) {
            //console.log('driverID*****' + drvId);
            $rootScope.loader = 1;
            if (angular.isDefined(drvId) && drvId !== null) {

                var updatedById = $localStorage.get('userId');

                ConUsers.inactivateDriver({
                    driverId: drvId,
                    updatedBy: updatedById

                }, function(driverSuccess) {
                    //console.log('driverSuccess' + JSON.stringify(driverSuccess));
                    $rootScope.getAllDriver();
                    //reloadFunc();
                    $rootScope.loader = 0;
                }, function(driverError) {
                    console.log('driverError' + JSON.stringify(driverError));
                    if (driverError.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });

            }
        };

        $scope.blockJob= function(conUserId, driverId) {
            $rootScope.loader = 1;
            var updatedById = $localStorage.get('userId');
            ConUsers.blockDriver({
                    driverId: driverId,
                    updatedBy: updatedById

                }, function(driverSuccess) {
                    //console.log('driverSuccess' + JSON.stringify(driverSuccess));
                    $rootScope.getAllDriver();
                    //reloadFunc();
                    $rootScope.loader = 0;
                }, function(driverError) {
                    console.log('driverError' + JSON.stringify(driverError));
                    if (driverError.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });
        }

        $scope.activate = function(conUserId, driverId) {
            $rootScope.loader = 1;
            if (angular.isDefined(conUserId) && conUserId !== null) {
                ConUsers.findOne({
                        filter: {
                            where: {
                                id: conUserId
                            },
                            include: {
                                relation: 'driverDetails'

                            }
                        }
                    },
                    function(conSuccess) {
                        //console.log('activate data' + JSON.stringify(ConUsers));
                        if (conSuccess.address == null || conSuccess.driverDetails[0].bankName == null || conSuccess.driverDetails[0].accountNumber == null || conSuccess.driverDetails[0].ifscCode == null) {
                            $window.alert('Driver location, Bank name, Account number, IFS code, Driver batch are required fields, Please update these fields to activate driver.');
                        } else {

                            ConUsers.activateDriverFunction({
                                driverId: driverId,
                                userId: $localStorage.get('userId')
                            }, function(activesuccess) {
                                //console.log('success : ' + JSON.stringify(activesuccess));
                                if (activesuccess[0].activate_driver === '0') {
                                    var driverActivationData = conSuccess;
                                    //activateDriverSMS(driverActivationData);
                                    var cellNumber = driverActivationData.mobileNumber;
                                    var message = ' Dear Driver ' + driverActivationData.firstName + ' ' + driverActivationData.lastName + ', You are now a approved driver with Indian Drivers.';
                                } else {
                                    $.notify('Driver already activated.', {
                                        status: 'danger'
                                    });
                                }

                                $rootScope.getAllDriver();
                                //reloadFunc();
                                $rootScope.loader = 0;
                            }, function(activeerror) {
                                console.log('activeerror : ' + JSON.stringify(activeerror));
                                if (activeerror.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $rootScope.loader = 0;
                            });



                        }
                    },
                    function(error) {
                        console.log('Error updating User : ' + JSON.stringify(error));
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $rootScope.loader = 0;
                    });
            }
        };

        $scope.deleteDriverConfirm = function(drvId) {
            //console.log('driverID**' + drvId);
            if ($window.confirm("Are you sure you want to delete this driver?")) {
                $scope.result = "Yes";
                $scope.deleteDriverFunction(drvId);
            } else {
                $scope.result = "No";
            }
        }

        $scope.deleteDriverFunction = function(drvId) {
            //console.log('driverID*****' + drvId);
            $rootScope.loader = 1;
            if (angular.isDefined(drvId) && drvId !== null) {

                ConUsers.deleteDriver({
                    driverId: drvId

                }, function(driverSuccess) {
                    //console.log('driverSuccess' + JSON.stringify(driverSuccess));
                    if (driverSuccess[0].delete_driver_permanentaly === '0') {
                        $.notify('Driver deleted successfully.', {
                            status: 'success'
                        });
                    } else {
                        window.alert('Not able to delete this driver. This Driver is related to bookings.');
                    }
                    $rootScope.getAllDriver();
                    //reloadFunc();
                    $rootScope.loader = 0;
                }, function(driverError) {
                    console.log('driverError' + JSON.stringify(driverError));
                    if (driverError.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });

            }
        }

        function createTable() {
            $rootScope.loader = 1;
            $scope.tableParams3 = new ngTableParams({
                page: 1, // show first page
                count: 50 // count per page

            }, {
                total: $scope.data.length, // length of data
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
        };

        function activateDriverSMS(driverActivationData) {
            var msg = ' Dear Driver ' + driverActivationData.firstName + ' ' + driverActivationData.lastName + ', You are now a approved driver with Indian Drivers.';
            ConUsers.sendSMS({
                    mobileNumber: driverActivationData.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

                 };

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



        $scope.searchRecords = function(searchData) {

            if (searchData !== '') {
                var users = $scope.orginalData;
                var searchList = $filter('filter')(users, {
                    name: searchData
                });

                console.log('Search data : ' + JSON.stringify(searchList));
                if (searchList.length > 0) {
                    $scope.recordFlag = true;
                } else {
                    $scope.recordFlag = false;
                }
                $scope.data = searchList;

            } else {

                $scope.data = $scope.orginalData;

            }


            $scope.tableParams3.reload();
        };
        $scope.driverNewCar = function() {
            
            //console.log('create popup called.' + modelAssetId);
        if (!angular.isUndefined($rootScope.searchDrvId)) { 
           

                     var modalInstanceCar = $modal.open({
                            templateUrl: '/carType.html',
                            controller: ModalDriverWithCarCtrl
                        });


                        var state = $('#modal-state');
                        modalInstanceCar.result.then(function() {
                            state.text('Modal dismissed with OK status');
                        }, function() {
                            state.text('Modal dismissed with Cancel status');
                        });

                 }
                    
          else{  

                document.getElementById("mobileNumber").style.borderColor = "red";
               
                document.getElementById("mobile1").innerHTML = '*required';

                 }   
        };


        var ModalDriverWithCarCtrl = function($scope, $rootScope, CarDetails, $modalInstance,CarType) {
           //ModalDriverWithCarCtrl start sub controller
            $scope.driverBatchArray = [{
                'desc': 'Monday'
            }, {
                'desc': 'Tuesday'
            }, {
                'desc': 'Wednesday'
            }, {
                'desc': 'Thursday'
            }, {
                'desc': 'Friday'
            }, {
                'desc': 'Saturday'
            }, {
                'desc': 'Sunday'
            }];
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }, {
                'desc': 'Blocked'
            }];
            $scope.selectedStatus = $scope.statusArray[1].desc;
            $scope.basicType = [{
                'desc': 'Manual'
            }, {
                'desc': 'Automatic'
            }];
            $scope.caetegory = [{
                'desc': 'Hatchback'
            }, {
                'desc': 'Sedan'
            },
            {
                'desc': 'Luxury'
            }];
            $scope.rc = [{
                'desc': 'TRUE'
            }, {
                'desc': 'FALSE'
            }];
            $scope.carname = [{
                'desc': 'Nissan Micra'
            }, {
                'desc': 'Maruti suzuki Dezire'
            },
            {
                'desc': 'Hyundai Xcent'
            },
            {
                'desc': 'Nissan Sunny'
            },
            {
                'desc': 'Toyoto Etios'
            },
            {
                'desc': 'Maruti Suzuki Ciaz'
            },
            {
                'desc': 'Mahindra Scorpio'
            },
            {
                'desc': 'Renault Lodgy'
            },
            {
                'desc': 'Toyoto Innova'
            },
            {
                'desc': 'Toyoto Innova Crysta'
            },
            {
                'desc': 'Tata Indica'
            },
            {
                'desc': 'Mahindra Xylo'
            },
            {
                'desc': 'Toyoto Tavera'
            },
            {
                'desc': 'Maruti Ertiga'
            },
            {
                'desc': 'Honda City'
            },
            {
                'desc': 'Maruti Wagon R'
            }];

            $scope.carManDate1 = false;
            $scope.pvDate1=false;
            $scope.PermitExDate1=false;
            $scope.vehPassDate1=false;
             $scope.mindate = new Date();
                 $scope.dtmax= new Date();
            $scope.carManDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.carManDate1 = true;
                $scope.pvDate1=false;
                $scope.PermitExDate1=false;
                 $scope.vehPassDate1=false;
                

            };
            $scope.vehPassDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                 $scope.vehPassDate1=true;
                $scope.carManDate1 = false;
                $scope.pvDate1=false;
                $scope.PermitExDate1=false;
                

            };
            $scope.pvDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
               $scope.carManDate1 = false;
                $scope.vehPassDate1=false;
                $scope.pvDate1=true;
                $scope.PermitExDate1=false;
                

            };
            $scope.PermitExDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                 $scope.carManDate1 = false;
                 $scope.vehPassDate1=false; 
                $scope.pvDate1=false;
                $scope.PermitExDate1=true;
                

            };


            $scope.verifyCarRegNo = function(regNumber) {
                var CarRegistNum = regNumber;
                CarDetails.find({
                      filter:{
                              fields:['carRegistrationNo']
                          }
                    },function(registrationNumbers){

                      $rootScope.carRegNumber = registrationNumbers;
                      for (var i = 0; i < $rootScope.carRegNumber.length; i++) {
                          if($rootScope.carRegNumber[i].carRegistrationNo === CarRegistNum){
                            document.getElementById("carregistrationnumber").style.borderColor = "red";
                              document.getElementById("carregistrationnumber1").innerHTML = 'This car is Already Registered';
                               
                                
                              }
                         }

                    },function(error){
                              window.alert('Oops! You are disconnected from server.');
    
                        });
            };


            $scope.driverCarDetails = function(cardetails) {
                console.log(cardetails);
                var count =0;
                $rootScope.cardetails = cardetails;
            if(angular.isUndefined(cardetails))
            {
                     document.getElementById("carname").style.borderColor = "red";
                     document.getElementById("carname1").innerHTML = '*required';
                     document.getElementById("carvarient").style.borderColor = "red";
                     document.getElementById("carvarient1").innerHTML = '*required';
                     document.getElementById("insurancecompanyname").style.borderColor = "red";
                     document.getElementById("insurancecompanyname1").innerHTML = '*required';
                     document.getElementById("enginenumber").style.borderColor = "red";
                     document.getElementById("enginenumber1").innerHTML = '*required';
                     document.getElementById("chassisnumber").style.borderColor = "red";
                     document.getElementById("chassisnumber1").innerHTML = '*required';
                     document.getElementById("carregistrationnumber").style.borderColor = "red";
                     document.getElementById("carregistrationnumber1").innerHTML = '*required';
                     document.getElementById("carManDate").style.borderColor = "red";
                     document.getElementById("carManDate1").innerHTML = '*required';
                     document.getElementById("vehPassDate").style.borderColor = "red";
                document.getElementById("vehPassDate2").innerHTML = '*required';
                     document.getElementById("rcinsurance").style.borderColor = "red";
                     document.getElementById("rcinsurance1").innerHTML = '*required';
                     document.getElementById("pvDate").style.borderColor = "red";
                     document.getElementById("pvDate1").innerHTML = '*required';
                     document.getElementById("permitExDate").style.borderColor = "red";
                     document.getElementById("permitExDate2").innerHTML = '*required';
                     document.getElementById("kmcovered").style.borderColor = "red";
                     document.getElementById("kmcovered1").innerHTML = '*required';
                      
                     count++;
                
                                   
             }
             else{
                if(angular.isUndefined(cardetails.carname))
                {
                 document.getElementById("carname").style.borderColor = "red";
                 document.getElementById("carname1").innerHTML = '*required';
                  count++;
               }
                else{
                document.getElementById("carname").style.borderColor = "white";
                 document.getElementById("carname1").innerHTML = ' ';
                }

                if(angular.isUndefined(cardetails.carvarient)){
                 document.getElementById("carvarient").style.borderColor = "red";
                document.getElementById("carvarient1").innerHTML = '*required';
                 count++;
                }else{
                 document.getElementById("carvarient").style.borderColor = "white";
                 document.getElementById("carvarient1").innerHTML = '';
                }
                if(angular.isUndefined(cardetails.insurancecompanyname)){
                document.getElementById("insurancecompanyname").style.borderColor = "red";
                document.getElementById("insurancecompanyname1").innerHTML = '*required';
                count++;
                 }else{
                 document.getElementById("insurancecompanyname").style.borderColor = "white";
                document.getElementById("insurancecompanyname1").innerHTML = '';   
                 }
                 if(angular.isUndefined(cardetails.enginenumber)){
                 document.getElementById("enginenumber").style.borderColor = "red";
                document.getElementById("enginenumber1").innerHTML = '*required';
                count++;
                 }else{
                  document.getElementById("enginenumber").style.borderColor = "white";
                  document.getElementById("enginenumber1").innerHTML = ''; 
                 }
                 if(angular.isUndefined(cardetails.chassisnumber)){
                  document.getElementById("chassisnumber").style.borderColor = "red";
                  document.getElementById("chassisnumber1").innerHTML = '*required';
                count++;
                 }else{
                  document.getElementById("chassisnumber").style.borderColor = "white";
                  document.getElementById("chassisnumber1").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.carregistrationnumber)){
                  document.getElementById("carregistrationnumber").style.borderColor = "red";
                  document.getElementById("carregistrationnumber1").innerHTML = 'Enter Valid Car Registration No';
                count++;
                 }else{
                  document.getElementById("carregistrationnumber").style.borderColor = "white";
                  document.getElementById("carregistrationnumber1").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.carManDate)){
                  document.getElementById("carManDate").style.borderColor = "red";
                  document.getElementById("carManDate1").innerHTML = '*required';
                count++;
                 }else{
                  document.getElementById("carManDate").style.borderColor = "white";
                  document.getElementById("carManDate1").innerHTML = '';
                  $rootScope.cardetails.carManDate = moment(cardetails.carManDate).format('YYYY-MM-DD');
                 }
                 if(angular.isUndefined(cardetails.rcinsurance)){
                  document.getElementById("rcinsurance").style.borderColor = "red";
                  document.getElementById("rcinsurance1").innerHTML = '*required';
                count++;
                 }else{
                  document.getElementById("rcinsurance").style.borderColor = "white";
                  document.getElementById("rcinsurance1").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.pvDate)){
                  document.getElementById("pvDate").style.borderColor = "red";
                  document.getElementById("pvDate1").innerHTML = '*required';
                count++;
                 }else{
                $rootScope.cardetails.pvDate = moment(cardetails.pvDate).format('YYYY-MM-DD');
                 document.getElementById("pvDate").style.borderColor = "";
                 document.getElementById("pvDate1").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.PermitExDate)){
                 document.getElementById("permitExDate").style.borderColor = "red";
                document.getElementById("permitExDate2").innerHTML = '*required';
                count++;
                 }else{
                    $rootScope.cardetails.PermitExDate = moment(cardetails.PermitExDate).format('YYYY-MM-DD');
                 document.getElementById("permitExDate").style.borderColor = "white";
                document.getElementById("permitExDate2").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.vehPassDate)){
                 document.getElementById("vehPassDate").style.borderColor = "red";
                document.getElementById("vehPassDate2").innerHTML = '*required';
                count++;
                 }else{
                    $rootScope.cardetails.vehPassDate = moment(cardetails.vehPassDate).format('YYYY-MM-DD');
                 document.getElementById("vehPassDate").style.borderColor = "white";
                 document.getElementById("vehPassDate2").innerHTML = '';
                 }
                 if(angular.isUndefined(cardetails.kmcovered)){
                 document.getElementById("kmcovered").style.borderColor = "red";
                document.getElementById("kmcovered1").innerHTML = '*required';
                count++;
                 }else{
                 document.getElementById("kmcovered").style.borderColor = "white";
                 document.getElementById("kmcovered1").innerHTML = '';
                 }
                  
     }

                     
                if(count === 0){ 
                   
                    $modalInstance.dismiss('cancel');
                   var modalInstance = $modal.open({
                                        templateUrl: '/carVerification.html',
                                        controller: ModalDriverWithCarCtrl
                                    });

                                   var state = $('#modal-state');
                                    modalInstance.result.then(function() {
                                        state.text('Modal dismissed with OK status');
                                    }, function() {
                                        state.text('Modal dismissed with Cancel status');
                                    });
                }
                
              
            };

             
            $scope.driverCarType = function(cartype) {
                console.log(cartype);
                $rootScope.cartype = cartype;
                if(angular.isUndefined(cartype)){
                    document.getElementById("basicType").style.borderColor = "red";
                               document.getElementById("basicType1").innerHTML = '*required';
                               document.getElementById("category").style.borderColor = "red";
                               document.getElementById("category1").innerHTML = '*required';
                }else{
                    if ((!angular.isUndefined(cartype.basicType) || cartype.basicType !== null ||cartype.basicType !== '') && (angular.isUndefined(cartype.category) || cartype.category ===null || cartype.category === '')){
                        document.getElementById("category").style.borderColor = "red";
                               document.getElementById("category1").innerHTML = '*required';
                               document.getElementById("basicType").style.borderColor = "white";
                        document.getElementById("basicType1").innerHTML = ' '; 
                    }else if ((angular.isUndefined(cartype.basicType)||cartype.basicType ===null || cartype.basicType==='')  && (!angular.isUndefined(cartype.category) || cartype.category !== null|| cartype.category !== '')){
                        document.getElementById("basicType").style.borderColor = "red";
                               document.getElementById("basicType1").innerHTML = '*required';
                                document.getElementById("category").style.borderColor = "white";
                        document.getElementById("category1").innerHTML = '';
                    }else{
                        document.getElementById("basicType").style.borderColor = "white";
                        document.getElementById("basicType1").innerHTML = ' ';
                        document.getElementById("category").style.borderColor = "white";
                        document.getElementById("category1").innerHTML = '';
                        $modalInstance.dismiss('cancel');
                        var modalInstanceCar = $modal.open({
                                        templateUrl: '/carDetails.html',
                                        controller: ModalDriverWithCarCtrl
                                    });

                                   var state = $('#modal-state');
                                    modalInstanceCar.result.then(function() {
                                        state.text('Modal dismissed with OK status');
                                    }, function() {
                                        state.text('Modal dismissed with Cancel status');
                                    });
                     }
                }

                 
            };
            $scope.driver = {};
            $scope.submitUserBtn = false;
            $scope.count = 0;

        $scope.toggleMin = function() {
             $scope.minDate;
        };
        $scope.backtocartype = function() {
                $modalInstance.dismiss('cancel');
                var modalInstanceCar = $modal.open({
                            templateUrl: '/carType.html',
                            controller: ModalDriverWithCarCtrl
                        });
         };
        
         $scope.cancel = function() {
                $modalInstance.dismiss('cancel');

                 
         };
         $scope.cancelCarType = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.searchDrvId=undefined;
                $rootScope.cartype = undefined;
                $rootScope.cardetails = undefined;
                $state.reload();
                 
         };
         $scope.backtocardetails = function() {
                $modalInstance.dismiss('cancel');
                 var modalInstanceCar = $modal.open({
                                        templateUrl: '/carDetails.html',
                                        controller: ModalDriverWithCarCtrl
                                    });
         };
         $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
         };
         $rootScope.addCarDetails = function(cartype,cardetails) {//add car details

            if(cardetails.rcinsurance==='TRUE'){
                var rc=true;
            }
            if(cardetails.rcinsurance==='FALSE'){
                var rc=false;
            }
            
            var driverId = $rootScope.searchDrvId; 
            var manufacuringDate = moment(cardetails.carManDate).format('YYYY-MM-DD');
            var vehicalPassingDate = moment(cardetails.vehPassDate).format('YYYY-MM-DD');
            var pvDate = moment(cardetails.pvDate).format('YYYY-MM-DD');
            var permitExpiryDate = moment(cardetails.PermitExDate).format('YYYY-MM-DD');


             CarDetails.driverCarDetails({
                         
                        driverId : driverId,
                        carName : cardetails.carname,
                        carVariant : cardetails.carvarient,
                        carType : cartype.basicType,
                        carCategory : cartype.category,
                        carInsuranceCompany : cardetails.insurancecompanyname,
                        engineNo : cardetails.enginenumber,
                        chassisNo : cardetails.chassisnumber,
                        carRegistartionNumber : cardetails.carregistrationnumber,
                        manufacturingDate : manufacuringDate,
                        vehiclePassingDate : vehicalPassingDate,
                        rcInsuranceCopyDocumented : rc,
                        pvDate : pvDate,
                        permitExpiryDate : permitExpiryDate,
                        kmCovered : cardetails.kmcovered,
                        remark : cardetails.remark,
                        createdBy : $rootScope.userId
                             

                     }, function(success){
                            $rootScope.cartype=undefined;
                            $rootScope.cardetails=undefined;
                          
                          $.notify('Driver Car Add successfully Done.', {
                         status: 'success'
                     });

                          $modalInstance.dismiss('cancel');
                          //$scope.fetchsearchDrvList();
                          $state.reload();

                     }, function(error){

                               console.log('error' +JSON.stringify(error));
                              window.alert('Oops! You are disconnected from server.');
                              $state.go('page.login');

                    });
        }; 

        
       
        $scope.openCar = function(car){
            console.log('error' +JSON.stringify(car));
             

            CarDetails.findOne({
                filter:{
                    where:{
                        carRegistrationNo:car
                    }
                }

            },function(success){
                $rootScope.car= success;
                CarType.findOne({
                filter:{
                    where:{
                        id:$rootScope.car.carTypeId
                    }
                }

            },function(success){
                $rootScope.cartype = success;
var modalInstance = $modal.open({
                templateUrl: '/showCar.html',
                controller: ModalDriverCtrl
            });
            },function(err){
console.log('error' +JSON.stringify(err));
            });
console.log('success' +JSON.stringify(success));

            },function(err){
console.log('error' +JSON.stringify(err));
            });


        };
        $scope.searchDriverCarDetails = function(){
        var driverId = $rootScope.searchDrvId; 
             $rootScope.loader = 1;
             
           $rootScope.carData = [];
            var DriverCarData = [];

             DriverDetails.getDriverCarDetails({
                    driverId : driverId,    
               },function(driverData){
                
                for (var i = 0; i < driverData.length; i++) {
                    var carName = null;
                    var carRegNo = null;
                   
                     
                    if (!angular.isUndefined(driverData[i].car_name) || driverData[i].car_name !== null || driverData[i].car_name !== '') {
                        name = driverData[i].car_name;
                    }

                     if (!angular.isUndefined(driverData[i].car_registration_no) || driverData[i].car_registration_no !== null || driverData[i].car_registration_no !== '') {
                        carRegNo = driverData[i].car_registration_no;
                    }

                    
                     

                        DriverCarData.push({
                        carName: driverData[i].car_name,
                        carRegNo: driverData[i].car_registration_no
                        
                    });

                }
               $rootScope.carData = DriverCarData;
                
                $scope.orginalData = DriverCarData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                 
                    $rootScope.loader = 0;
            },function(error){
                    $rootScope.loader = 0;
            });
};

                   
    };


        $scope.newDriver = function() {
            // console.log('create popup called.' + modelAssetId);


            var modalInstance = $modal.open({
                templateUrl: '/addDriver.html',
                controller: ModalDriverCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };
        var ModalDriverCtrl = function($scope, $rootScope, $modalInstance) {
            $scope.driverBatchArray = [{
                'desc': 'Monday'
            }, {
                'desc': 'Tuesday'
            }, {
                'desc': 'Wednesday'
            }, {
                'desc': 'Thursday'
            }, {
                'desc': 'Friday'
            }, {
                'desc': 'Saturday'
            }, {
                'desc': 'Sunday'
            }];
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }, {
                'desc': 'Blocked'
            }];
            $scope.selectedStatus = $scope.statusArray[1].desc;
            $scope.luxuryArray = [{
                'desc': 'Manual'
            }, {
                'desc': 'Automatic'
            }, {
                'desc': 'Luxury'
            }];
             $scope.carname = [{
                'desc': 'Nissan Micra'
            }, {
                'desc': 'Maruti suzuki Dezire'
            },
            {
                'desc': 'Hyundai Xcent'
            },
            {
                'desc': 'Nissan Sunny'
            },
            {
                'desc': 'Toyoto Etios'
            },
            {
                'desc': 'Maruti Suzuki Ciaz'
            },
            {
                'desc': 'Mahindra Scorpio'
            },
            {
                'desc': 'Renault Lodgy'
            },
            {
                'desc': 'Toyoto Innova'
            },
            {
                'desc': 'Toyoto Innova Crysta'
            },
            {
                'desc': 'Tata Indica'
            },
            {
                'desc': 'Mahindra Xylo'
            },
            {
                'desc': 'Toyoto Tavera'
            },
            {
                'desc': 'Maruti Ertiga'
            },
            {
                'desc': 'Honda City'
            },
            {
                'desc': 'Maruti Wagon R'
            }];
             $scope.rc = [{
                'desc': 'TRUE'
            }, {
                'desc': 'FALSE'
            }];
            $scope.driver = {};
            $scope.submitUserBtn = false;
            $scope.count = 0;

             $scope.toggleMin = function() {
        $scope.minDate;
        $scope.maxDate = new Date();
    };
    $scope.toggleMin();
    $scope.openToDate = false;
    $scope.openedStart = false;
    $scope.openBirthDate = false;
    
    $scope.openStart = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
        $scope.openToDate = false;
        

    };
    $scope.openStart1 = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openBirthDate = true;
         

    };
    $scope.changeMin = function(minDt) {
        $scope.minToDate = $scope.minToDate ? null : minDt;
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
            $scope.verifyMobile = function(mobileNumber) {


                $scope.MobileExist = false;
                $scope.invalidNumber = false;

                ConUsers.count({
                        where: {
                            mobileNumber: mobileNumber
                        }
                    },
                    function(response) {
                        //console.log('response ' + JSON.stringify(response));
                        if (angular.isDefined(mobileNumber) && mobileNumber !== null) {
                            if (response.count > 0) {

                                $scope.MobileExist = true;

                                document.getElementById("cellNumber").style.borderColor = "red";
                                document.getElementById("cellNumber1").innerHTML = 'Mobile number exist';
                                //console.log('Mobile already exists : ' + JSON.stringify(response));
                            } else {
                                if (mobileNumber.length != 10) {
                                    // $scope.MobileExist = true;
                                    $scope.invalidNumber = true;
                                    $scope.user.cellNumber1 = 'Enter valid Mobile Number';
                                    document.getElementById("cellNumber").style.borderColor = "red";
                                    document.getElementById("cellNumber1").innerHTML = 'Enter valid Mobile Number';
                                } else {
                                    $scope.MobileExist = false;
                                    $scope.invalidNumber = false;
                                    $scope.user.cellNumber1 = null;
                                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                                    document.getElementById("cellNumber1").innerHTML = '';
                                }
                            }
                        } else {
                            $scope.MobileExist = true;
                            $scope.user.cellNumber1 = 'Enter valid Mobile Number';
                            document.getElementById("cellNumber").style.borderColor = "red";
                            document.getElementById("cellNumber1").innerHTML = 'Enter valid Mobile Number';
                        }
                    },
                    function(error) {
                        console.log('Error verifying mobile : ' + JSON.stringify(error));
                        document.getElementById("cellNumber").style.borderColor = "red";
                        $scope.MobileExist = false;
                        $modalInstance.dismiss('cancel');
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });


            };

            $scope.verifyDriverCode1 = function(driver) {
                $scope.submitUserBtn = true;
                //console.log('driver verify code' + JSON.stringify(driver));
                if (angular.isUndefined(driver.driverCode) || driver.driverCode === '') {
                    $scope.addDriver(driver);
                } else {

                    DriverDetails.find({
                        filter: {
                            where: {
                                driverCode: driver.driverCode
                            },
                            include: {
                                relation: 'conUsers'
                            }

                        }
                    }, function(drvCodeSuccess) {
                        //console.log('drvCodeSuccess***' + JSON.stringify(drvCodeSuccess));

                        if (drvCodeSuccess.length > 0) {


                            document.getElementById("driverCode").style.borderColor = "red";
                            document.getElementById("driverCode1").innerHTML = 'Driver code exist';
                            return false;
                            $scope.submitUserBtn = false;


                        } else {
                            document.getElementById("driverCode").style.borderColor = "#dde6e9";
                            document.getElementById("driverCode1").innerHTML = '';
                            $scope.addDriver(driver);
                        }

                    }, function(drvCodeErr) {
                        console.log('drvCodeErr***' + JSON.stringify(drvCodeErr));
                        $scope.submitUserBtn = false;
                        $modalInstance.dismiss('cancel');
                        if (drvCodeErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                    });
                }


            };



            $scope.addDriver = function(driver) {

                $rootScope.loader = 1;
                var count = 0;
                if (angular.isUndefined(driver.firstName) || driver.firstName === '') {
                    document.getElementById("firstName").style.borderColor = "red";
                    document.getElementById("firstName1").innerHTML = '*required';
                    driver.firstName1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';
                    driver.firstName1 = null;
                }
                if (angular.isUndefined(driver.lastName) || driver.lastName === '') {
                    document.getElementById("lastName").style.borderColor = "red";
                    document.getElementById("lastName1").innerHTML = '*required';
                    driver.lastName1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';
                    driver.lastName1 = null;
                }

                if (angular.isUndefined(driver.cellNumber) || driver.cellNumber === '') {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = '*required';
                    driver.cellNumber1 = 'This value is required';
                    count++;
                } else if ($scope.MobileExist == true) {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = 'Mobile number exist';
                    driver.cellNumber1 = 'Mobile already exist';
                    count++;
                } else if ($scope.invalidNumber == true) {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = 'Enter valid number';
                    driver.cellNumber1 = 'Invalid number';
                    count++;
                } else {
                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                    document.getElementById("cellNumber1").innerHTML = '';
                    driver.cellNumber1 = null;
                }

                if (angular.isUndefined(driver.isLuxury) || driver.isLuxury === '' || driver.isLuxury === null) {
                    document.getElementById("isLuxury").style.borderColor = "red";
                    document.getElementById("isLuxury1").innerHTML = '*required';
                    driver.isLuxury1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("isLuxury").style.borderColor = "#dde6e9";
                    document.getElementById("isLuxury1").innerHTML = '';
                    driver.isLuxury1 = null;
                }

                if ((angular.isUndefined(driver.trDate) || driver.trDate === '' || driver.trDate === null) && (angular.isUndefined(driver.ntDate) || driver.ntDate === '' || driver.ntDate === null)) {
                  document.getElementById("trDate").style.borderColor = "red";
                  document.getElementById("trDate1").innerHTML = '*required';
                  driver.trDate1 = 'This value is required';

                  document.getElementById("ntDate").style.borderColor = "red";
                  document.getElementById("ntDate1").innerHTML = '*required';
                  driver.ntDate1 = 'This value is required';
                  count++;
              } else if ((angular.isDefined(driver.trDate) || driver.trDate != '' || driver.trDate != null) && (angular.isUndefined(driver.ntDate) || driver.ntDate === '' || driver.ntDate === null)) {
                  document.getElementById("trDate").style.borderColor = "#dde6e9";
                  document.getElementById("trDate1").innerHTML = '';
                  driver.trDate1 = null;
                  document.getElementById("ntDate").style.borderColor = "#dde6e9";
                  document.getElementById("ntDate1").innerHTML = '';
                  driver.ntDate1 = null;
              }else if ((angular.isUndefined(driver.trDate) || driver.trDate === '' || driver.trDate === null) && (angular.isDefined(driver.ntDate) || driver.ntDate != '' || driver.ntDate != null)) {
                  document.getElementById("trDate").style.borderColor = "#dde6e9";
                  document.getElementById("trDate1").innerHTML = '';
                  driver.trDate1 = null;
                  document.getElementById("ntDate").style.borderColor = "#dde6e9";
                  document.getElementById("ntDate1").innerHTML = '';
                  driver.ntDate1 = null;
              }else{

              }


                if (angular.isUndefined(driver.driverBatch) || driver.driverBatch === '' || driver.driverBatch === null) {
                    document.getElementById("driverBatch").style.borderColor = "red";
                    document.getElementById("driverBatch1").innerHTML = '*required';
                    driver.driverBatch1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverBatch").style.borderColor = "#dde6e9";
                    document.getElementById("driverBatch1").innerHTML = '';
                    driver.driverBatch1 = null;
                }
                if (angular.isUndefined(driver.status) || driver.status === '' || driver.status === null) {
                    document.getElementById("status").style.borderColor = "red";
                    document.getElementById("status1").innerHTML = '*required';
                    driver.status1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("status").style.borderColor = "#dde6e9";
                    document.getElementById("status1").innerHTML = '';
                    driver.status1 = null;
                }
                if (angular.isUndefined(driver.driverCode) || driver.driverCode === '') {
                    document.getElementById("driverCode").style.borderColor = "red";
                    document.getElementById("driverCode1").innerHTML = '*required';
                    driver.driverCode1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverCode").style.borderColor = "#dde6e9";
                    document.getElementById("driverCode1").innerHTML = '';
                    driver.driverCode1 = null;
                }

                if (angular.isUndefined(driver.currentaddr) || driver.currentaddr === '' || driver.currentaddr === null) {
                    document.getElementById("currentaddr").style.borderColor = "red";
                    document.getElementById("currentaddr1").innerHTML = '*required';
                    driver.currentaddr1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("currentaddr").style.borderColor = "#dde6e9";
                    document.getElementById("currentaddr1").innerHTML = '';
                    driver.currentaddr1 = null;
                }

                if (angular.isUndefined(driver.permanentaddr) || driver.permanentaddr === '' || driver.permanentaddr === null) {
                    document.getElementById("permanentaddr").style.borderColor = "red";
                    document.getElementById("permanentaddr1").innerHTML = '*required';
                    driver.permanentaddr1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("permanentaddr").style.borderColor = "#dde6e9";
                    document.getElementById("permanentaddr1").innerHTML = '';
                    driver.permanentaddr1 = null;
                }
                if (angular.isUndefined(driver.bankname) || driver.bankname === '' || driver.bankname === null) {
                    document.getElementById("bankname").style.borderColor = "red";
                    document.getElementById("bankname1").innerHTML = '*required';
                    driver.bankname1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("bankname").style.borderColor = "#dde6e9";
                    document.getElementById("bankname1").innerHTML = '';
                    driver.bankname1 = null;
                }

                if (angular.isUndefined(driver.accno) || driver.accno === '' || driver.accno === null) {
                    document.getElementById("accno").style.borderColor = "red";
                    document.getElementById("accno1").innerHTML = '*required';
                    driver.accno1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("accno").style.borderColor = "#dde6e9";
                    document.getElementById("accno1").innerHTML = '';
                    driver.accno1 = null;
                }

                if (angular.isUndefined(driver.ifsc) || driver.ifsc === '' || driver.ifsc === null) {
                    document.getElementById("ifsc").style.borderColor = "red";
                    document.getElementById("ifsc1").innerHTML = '*required';
                    driver.ifsc1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("ifsc").style.borderColor = "#dde6e9";
                    document.getElementById("ifsc1").innerHTML = '';
                    driver.ifsc1 = null;
                }
                if (angular.isUndefined(driver.city) || driver.city === '' || driver.city === null) {
                    document.getElementById("city").style.borderColor = "red";
                    document.getElementById("city1").innerHTML = '*required';
                    driver.city1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("city").style.borderColor = "#dde6e9";
                    document.getElementById("city1").innerHTML = '';
                    driver.city1 = null;
                }
                 if (angular.isUndefined(driver.bdate) || driver.bdate === '') {
                    document.getElementById("bdate").style.borderColor = "red";
                    document.getElementById("bdate1").innerHTML = '*required';
                    driver.bdate1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("bdate").style.borderColor = "#dde6e9";
                    document.getElementById("bdate1").innerHTML = '';
                    driver.bdate1 = null;
                }
                    if (angular.isUndefined(driver.experience) || driver.experience === '') {
                    document.getElementById("experience").style.borderColor = "red";
                    document.getElementById("experience1").innerHTML = '*required';
                    driver.experience1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("experience").style.borderColor = "#dde6e9";
                    document.getElementById("experience1").innerHTML = '';
                    driver.experience1 = null;
                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $scope.MobileExist = false;
                    $scope.invalidNumber = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $rootScope.loader = 0;

                    $scope.count = 0;
                    if ($scope.MobileExist == false) {


                        ConUsers.createDriver({
                            firstName: driver.firstName,
                            middleName: driver.middleName,
                            lastName: driver.lastName,
                            mobileNumber: driver.cellNumber,
                            email: driver.cellNumber + '@consrv.in',
                            address: driver.currentaddr,
                            userId: $rootScope.userId,
                            status: driver.status,
                            isLuxury: driver.isLuxury,
                            permanentAddress: driver.permanentaddr,
                            bankName: driver.bankname,
                            accountNumber: driver.accno,
                            ifscCode: driver.ifsc,
                            emergencyNumber: driver.emergencyNumber,
                            trDate: driver.trDate,
                            ntDate: driver.ntDate,
                            driverBatch: driver.driverBatch,
                            freeAddress: driver.freeAddress,
                            driverCode: driver.driverCode,
                            operationCity:driver.city,
                            BDate:driver.bdate,
                            Experience:driver.experience


                        }, function(driverData) {
                            //console.log('driverData ' + JSON.stringify(driverData));
                            $.notify('Driver created successfully.', {
                                status: 'success'
                            });
                            var registerDriverData = driverData;
                            registerDriverSMS(registerDriverData);
                            $modalInstance.dismiss('cancel');
                            $rootScope.getAllDriver();
                            //reloadFunc();
                            $rootScope.loader = 0;
                        }, function(driverErr) {
                            console.log('driverErr ' + JSON.stringify(driverErr));
                            $scope.submitUserBtn = false;
                            $modalInstance.dismiss('cancel');
                            if (driverErr.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                        });


                    } else {
                        $scope.submitUserBtn = false;
                    }

                }

            };

            function registerDriverSMS(registerDriverData) {
                //console.log('new driver sms details' + JSON.stringify(registerDriverData));
                var msg = 'Dear Driver ' + registerDriverData[0].firstName + ' ' + registerDriverData[0].lastName + ', Thank you for registering with Indian Drivers.';
                var data = "";
                data += "username=msgs-driver";
                data += "&password=driver";
                data += "&type=0";
                data += "&dlr=1";
                data += "&destination=" + registerDriverData[0].mobileNumber;
                data += "&source=INDRIV";
                data += "&sender=INDRIV";
                data += "&message=" + msg;

                var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
                $http({
                    method: 'post',
                    url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
                }).then(function successCallback(response) {
                        // console.log(JSON.stringify(response));
                        //console.log('position : ' + JSON.stringify(response));
                    },
                    function errorCallback(response) {
                        //console.log('errorCallback : ' + JSON.stringify(response));
                    });
            };

           $scope.sendNotification = function(sendRequestAdv){//manage driver
            $rootScope.loader = 1;
                    $scope.allToken = [];
                    var count = 0;
                    var message = sendRequestAdv;
                    for (var i = 0; i < $rootScope.number.length; i++) {
                        var mobileNumber = $rootScope.number[i];
                            ConUsers.find({
                                filter:{
                                    where:{
                                            mobileNumber:  $rootScope.number[i]
                                    },
                                     include: [{
                                    relation: 'userDevices',
                                    scope: {
                                        include: {
                                            relation: 'conUsers',
                                        }
                                    }
                                     }]
                                }      
                            },function(success){

                                count++;
                                if(angular.isDefined(success[0].userDevices[0])){
                                    var token = success[0].userDevices[0].deviceId;
                                    $scope.allToken.push(token);

                                }
                                if(count == i && count  == $rootScope.number.length) {
                                     console.log($scope.allToken);
                                    var obj = {
                                            "token":$scope.allToken,
                                            "msg":message
                                    };
                                    var url = 'http://65.0.186.134:3000';
                                    $http.post(url + '/push',obj).
                                        success(function(result) {
                                        $modalInstance.dismiss('cancel');
                                        $.notify('Notification Successfully Sent.', {
                                             status: 'success'
                                        });
                                        $scope.allToken = undefined;
                                        $rootScope.number = undefined;
                                        $rootScope.loader = 0;
                                        }).
                                        error(function(error) {
                                          console.log("error");
                                          $rootScope.loader = 0;
                                          // $cordovaDialogs.alert('Error......');
                                         //  console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                                         });
                           
                                }     
                             
                           },function(error){
                                console.log("error");
                                $rootScope.loader = 0;
                               });

                  } 
                   
               }
            $scope.sendMessage = function(sendRequestAdv) {
                $rootScope.loader = 1;
                for (var i = 0; i < $rootScope.number.length; i++) {
                    for (var j = i; j <= i; j++) {
                        var f = $rootScope.cname[j].split(" ", 1);
                        var msg = 'Dear  ' + f + ', ' + sendRequestAdv;
                        ConUsers.sendSMS({
                            mobileNumber:$rootScope.number[i],
                            msg: msg
                        }, function(mgssuccess) {
                            // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                        }, function(error) {
                          //  console.log('error in sending msg: ' + JSON.stringify(error));
        
                        });
                      
                       

                      
                    }
                }
                $modalInstance.dismiss('cancel');
                $.notify('send message successfully.', {
                    status: 'success'
                });
                $rootScope.getAllDriver();
                //reloadFunc();
                $rootScope.number = 0;
                $rootScope.cname = 0;
                $rootScope.loader = 0;
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };
        };



        $scope.updateDriver = function(driverId, userId) {
            // console.log('create popup called.' + modelAssetId);

            $rootScope.driverId = driverId;
            $rootScope.conUserId = userId;
            var modalInstance = $modal.open({
                templateUrl: '/updateDriver.html',
                controller: ModalUpdateDriverCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };
        var ModalUpdateDriverCtrl = function($scope, $rootScope, $modalInstance, $http) {
            $scope.driverBatchArray = [{
                'desc': 'Monday'
            }, {
                'desc': 'Tuesday'
            }, {
                'desc': 'Wednesday'
            }, {
                'desc': 'Thursday'
            }, {
                'desc': 'Friday'
            }, {
                'desc': 'Saturday'
            }, {
                'desc': 'Sunday'
            }];
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }];
            $scope.driverTrainingArray = [{
                'desc': true
            }, {
                'desc': false
            }];
            $scope.pvArray = [{
                'desc': true
            }, {
                'desc': false
            }];
            $scope.cpvArray = [{
                'desc': true
            }, {
                'desc': false
            }];
            $scope.luxuryArray = [{
                'desc': 'Manual'
            }, {
                'desc': 'Automatic'
            }, {
                'desc': 'Luxury'
            }];
            $scope.vehicleArray = [{
                'desc': 'Car Driver'
            }, {
                'desc': 'Bus Driver'
            }, {
                'desc': 'Truck Driver'
            }, {
                'desc': 'JCB Driver'
            }, {
                'desc': 'Forklift Driver'
            }];
            $scope.interviewStatusArray = [{
                'desc': 'Sheduled'
            }, {
                'desc': 'Done'
            }];
            $scope.driver = {};
            $scope.submitUserBtn = false;
            $scope.count = 0;

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
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

$scope.toggleMin1 = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
                $scope.maxDate = new Date();
            };
            $scope.toggleMin1();
            $scope.openToDate1 = false;
            $scope.openedStart1 = false;
            $scope.openStart1 = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart1 = true;
                $scope.openToDate1 = false;

            };

            $scope.openedToDate1= function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openToDate1 = true;
                $scope.openedStart1 = false;

            };

            $scope.dateOptions1 = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.ismeridian = true;
            $scope.toggleMode1 = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };

            $scope.toggleMin2 = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
                $scope.maxDate = new Date();
            };
            $scope.toggleMin2();
            $scope.openToDate2 = false;
            $scope.openedStart2 = false;
            $scope.openStart2 = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart2 = true;
                $scope.openToDate2 = false;

            };

            $scope.openedToDate2= function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openToDate2 = true;
                $scope.openedStart2 = false;

            };

            $scope.dateOptions2 = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.ismeridian = true;
            $scope.toggleMode2 = function() {
                $scope.ismeridian = !$scope.ismeridian;

            };

             
     $scope.openBirthDate = false;
    $scope.openStartBirth = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openBirthDate = true;

    };
    $scope.openLicenseDate = false;
    $scope.openStartLicense = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openLicenseDate = true;

    };
    $scope.openDateOfFitness = false;
    $scope.openStartDateOfFitness = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openDateOfFitness = true;

    };

            $scope.verifyMobile1 = function(driver) {

                //console.log('driver verify details' + JSON.stringify(driver));

                ConUsers.find({
                    filter: {
                        where: {
                            mobileNumber: driver.cellNumber
                        }

                    }
                }, function(drvSuccess) {
                    //console.log('drvSuccess***' + JSON.stringify(drvSuccess));
                    if (drvSuccess.length > 0) {

                        if (drvSuccess[0].id === driver.conuserId) {
                            document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                            document.getElementById("cellNumber1").innerHTML = '';
                            $scope.verifyDriverCode(driver);
                        } else {
                            document.getElementById("cellNumber").style.borderColor = "red";
                            document.getElementById("cellNumber1").innerHTML = 'Mobile number exist';
                            return false;
                        }

                    } else {
                        document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                        document.getElementById("cellNumber1").innerHTML = '';
                        $scope.verifyDriverCode(driver);
                    }

                }, function(drvErr) {
                    console.log('drvErr***' + JSON.stringify(drvErr));
                    $modalInstance.dismiss('cancel');
                    if (drvErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                });

            };

            $scope.verifyDriverCode = function(driver) {

                //console.log('driver verify code' + JSON.stringify(driver));
                if (angular.isUndefined(driver.driverCode) || driver.driverCode === '' || driver.driverCode === null) {
                    $scope.updateDriver(driver);
                } else {
                    DriverDetails.find({
                        filter: {
                            where: {
                                driverCode: driver.driverCode
                            },
                            include: {
                                relation: 'conUsers'
                            }

                        }
                    }, function(drvCodeSuccess) {
                        //console.log('drvCodeSuccess***' + JSON.stringify(drvCodeSuccess));

                        if (drvCodeSuccess.length > 0) {

                            if (drvCodeSuccess[0].conuserId === driver.conuserId) {
                                document.getElementById("driverCode").style.borderColor = "#dde6e9";
                                document.getElementById("driverCode1").innerHTML = '';
                                $scope.updateDriver(driver);
                            } else {
                                document.getElementById("driverCode").style.borderColor = "red";
                                document.getElementById("driverCode1").innerHTML = 'Driver code exist';
                                return false;
                            }

                        } else {
                            document.getElementById("driverCode").style.borderColor = "#dde6e9";
                            document.getElementById("driverCode1").innerHTML = '';
                            $scope.updateDriver(driver);
                        }

                    }, function(drvCodeErr) {
                        console.log('drvCodeErr***' + JSON.stringify(drvCodeErr));
                        $modalInstance.dismiss('cancel');
                        if (drvCodeErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                    });
                }

            };
             
$scope.verifyDriverCodeUpdate = function(driver) {

                //console.log('driver verify code' + JSON.stringify(driver));
                if (angular.isUndefined(driver.driverCode) || driver.driverCode === '' || driver.driverCode === null) {
                    $scope.updateDriverWthountDateValidation(driver);
                } else {
                    DriverDetails.find({
                        filter: {
                            where: {
                                driverCode: driver.driverCode
                            },
                            include: {
                                relation: 'conUsers'
                            }

                        }
                    }, function(drvCodeSuccess) {
                        //console.log('drvCodeSuccess***' + JSON.stringify(drvCodeSuccess));

                        if (drvCodeSuccess.length > 0) {

                            if (drvCodeSuccess[0].conuserId === driver.conuserId) {
                                document.getElementById("driverCode").style.borderColor = "#dde6e9";
                                document.getElementById("driverCode1").innerHTML = '';
                                $scope.updateDriverWthountDateValidation(driver);
                            } else {
                                document.getElementById("driverCode").style.borderColor = "red";
                                document.getElementById("driverCode1").innerHTML = 'Driver code exist';
                                return false;
                            }

                        } else {
                            document.getElementById("driverCode").style.borderColor = "#dde6e9";
                            document.getElementById("driverCode1").innerHTML = '';
                            $scope.updateDriverWthountDateValidation(driver);
                        }

                    }, function(drvCodeErr) {
                        console.log('drvCodeErr***' + JSON.stringify(drvCodeErr));
                        $modalInstance.dismiss('cancel');
                        if (drvCodeErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                    });
                }

            };

            $scope.updateDriver = function(driver) {
                $scope.submitUserBtn = true;
                $rootScope.loader = 1;

                var count = 0;
                if (angular.isUndefined(driver.firstName) || driver.firstName === '') {
                    document.getElementById("firstName").style.borderColor = "red";
                    document.getElementById("firstName1").innerHTML = '*required';
                    driver.firstName1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';
                    driver.firstName1 = null;
                }
                if (angular.isUndefined(driver.lastName) || driver.lastName === '') {
                    document.getElementById("lastName").style.borderColor = "red";
                    document.getElementById("lastName1").innerHTML = '*required';
                    driver.lastName1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';
                    driver.lastName1 = null;
                }

                


                if (angular.isUndefined(driver.cellNumber) || driver.cellNumber === '') {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = '*required';
                    driver.cellNumber1 = 'This value is required';
                    count++;
                } else if (driver.cellNumber.length != 10) {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = 'Invalid mobile number';
                    driver.cellNumber1 = 'Invalid mobile number';
                    count++;
                } else {
                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                    document.getElementById("cellNumber1").innerHTML = '';
                    driver.cellNumber1 = null;
                }

                 
                if ((angular.isUndefined(driver.trDate) || driver.trDate === '' || driver.trDate === null) && (angular.isUndefined(driver.ntDate) || driver.ntDate === '' || driver.ntDate === null)) {
                  document.getElementById("trDate").style.borderColor = "red";
                  document.getElementById("trDate1").innerHTML = '*required';
                  driver.trDate1 = 'This value is required';

                  document.getElementById("ntDate").style.borderColor = "red";
                  document.getElementById("ntDate1").innerHTML = '*required';
                  driver.ntDate1 = 'This value is required';
                  count++;
              } else if ((angular.isDefined(driver.trDate) || driver.trDate != '' || driver.trDate != null) && (angular.isUndefined(driver.ntDate) || driver.ntDate === '' || driver.ntDate === null)) {
                  document.getElementById("trDate").style.borderColor = "#dde6e9";
                  document.getElementById("trDate1").innerHTML = '';
                  driver.trDate1 = null;
                  document.getElementById("ntDate").style.borderColor = "#dde6e9";
                  document.getElementById("ntDate1").innerHTML = '';
                  driver.ntDate1 = null;
              }else if ((angular.isUndefined(driver.trDate) || driver.trDate === '' || driver.trDate === null) && (angular.isDefined(driver.ntDate) || driver.ntDate != '' || driver.ntDate != null)) {
                  document.getElementById("trDate").style.borderColor = "#dde6e9";
                  document.getElementById("trDate1").innerHTML = '';
                  driver.trDate1 = null;
                  document.getElementById("ntDate").style.borderColor = "#dde6e9";
                  document.getElementById("ntDate1").innerHTML = '';
                  driver.ntDate1 = null;
              }else{

              }

                 

                if (angular.isUndefined(driver.currentaddr) || driver.currentaddr === '' || driver.currentaddr === null) {
                    document.getElementById("currentaddr").style.borderColor = "red";
                    document.getElementById("currentaddr1").innerHTML = '*required';
                    driver.currentaddr1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("currentaddr").style.borderColor = "#dde6e9";
                    document.getElementById("currentaddr1").innerHTML = '';
                    driver.currentaddr1 = null;
                }

                if (angular.isUndefined(driver.permanentaddr) || driver.permanentaddr === '' || driver.permanentaddr === null) {
                    document.getElementById("permanentaddr").style.borderColor = "red";
                    document.getElementById("permanentaddr1").innerHTML = '*required';
                    driver.permanentaddr1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("permanentaddr").style.borderColor = "#dde6e9";
                    document.getElementById("permanentaddr1").innerHTML = '';
                    driver.permanentaddr1 = null;
                }

               /* if (angular.isUndefined(driver.bankname) || driver.bankname === '' || driver.bankname === null) {
                    document.getElementById("bankname").style.borderColor = "red";
                    document.getElementById("bankname1").innerHTML = '*required';
                    driver.bankname1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("bankname").style.borderColor = "#dde6e9";
                    document.getElementById("bankname1").innerHTML = '';
                    driver.bankname1 = null;
                }

                if (angular.isUndefined(driver.accno) || driver.accno === '' || driver.accno === null) {
                    document.getElementById("accno").style.borderColor = "red";
                    document.getElementById("accno1").innerHTML = '*required';
                    driver.accno1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("accno").style.borderColor = "#dde6e9";
                    document.getElementById("accno1").innerHTML = '';
                    driver.accno1 = null;
                }

                if (angular.isUndefined(driver.ifsc) || driver.ifsc === '' || driver.ifsc === null) {
                    document.getElementById("ifsc").style.borderColor = "red";
                    document.getElementById("ifsc1").innerHTML = '*required';
                    driver.ifsc1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("ifsc").style.borderColor = "#dde6e9";
                    document.getElementById("ifsc1").innerHTML = '';
                    driver.ifsc1 = null;
                }*/
                if (angular.isUndefined(driver.operationCity) || driver.operationCity === '' || driver.operationCity === null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*required';
                    driver.operationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("operationCity1").innerHTML = '';
                    driver.operationCity1 = null;
                }
                if (angular.isUndefined(driver.bdate) || driver.bdate === '' || driver.bdate === null) {
                    document.getElementById("bdate").style.borderColor = "red";
                    document.getElementById("bdate1").innerHTML = '*required';
                    driver.bdate1 = 'This value is required';
                    count++;
                } else {

                   var birthday = new Date(driver.bdate);
                      var today = new Date();
                      var age = ((today - birthday) / (31557600000));
                      var age = Math.floor( age );
                 

                if(age < 25){
                    document.getElementById("bdate").style.borderColor = "red";
                    document.getElementById("bdate1").innerHTML = '*Age should be more than 25 years.';
                     
                    count++;
                }else{
                  document.getElementById("bdate").style.borderColor = "#dde6e9";
                    document.getElementById("bdate1").innerHTML = '';
                     driver.bdate1 = null;
                } 
                }
                    
                   
                if (angular.isUndefined(driver.licenseIssueDate) || driver.licenseIssueDate === '' || driver.licenseIssueDate === null) {
                    document.getElementById("licenceIssueDate").style.borderColor = "red";
                    document.getElementById("licenceIssueDate1").innerHTML = '*required';
                    driver.licenceIssueDate1 = 'This value is required';
                    count++;
                } else {
                    var experience = 0;
                    var birthday1 = new Date(driver.licenseIssueDate);
                      var today1 = new Date();
                      var age1 = ((today1 - birthday1) / (31557600000));
                      var experience = Math.floor( age1 );
                      
                



                if(experience < 3){
                    document.getElementById("licenceIssueDate").style.borderColor = "red";
                    document.getElementById("licenceIssueDate1").innerHTML = '*Experience should be more than 3 years.';
                     
                    count++;
                }else{
                  document.getElementById("licenceIssueDate").style.borderColor = "#dde6e9";
                    document.getElementById("licenceIssueDate1").innerHTML = '';
                    driver.licenceIssueDate1 = null;
                     
                }
  

                    
                }

 


                
                   

                if (count > 0) {
                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {


                    $scope.count = 0;
                    var latitude;
                    var longitude;
                     latitude = 0; 
                    longitude = 0; 
                        var remark = null;
                        if (!angular.isUndefined(driver.remark) || driver.remark !== null || driver.remark !== '') {
                            remark = driver.remark;
                        }

                        ConUsers.findById({
                                id: $rootScope.userId
                            },
                            function(userSuccess) {

                                var userName = userSuccess.firstName + ' ' + userSuccess.lastName;

                                ConUsers.findById({
                                        id: $rootScope.conUserId
                                    },
                                    function(ConUsers) {
                                        ConUsers.firstName = driver.firstName;
                                        ConUsers.middleName = driver.middleName;
                                        ConUsers.lastName = driver.lastName;
                                        ConUsers.mobileNumber = driver.cellNumber;
                                        ConUsers.username = driver.cellNumber;
                                        ConUsers.email = driver.cellNumber + '@consrv.in';
                                        ConUsers.address = driver.currentaddr;
                                        ConUsers.addressLat = latitude;
                                        ConUsers.addressLong = longitude;
                                        ConUsers.operationCity = driver.operationCity;
                                        ConUsers.updatedBy = $localStorage.get('userId');
                                        ConUsers.updatedDate = new Date();
                                        ConUsers.$save();
                                        //console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers));

                                        DriverDetails.findById({
                                                id: $rootScope.driverId
                                            },
                                            function(DriverDetails) {
                                                var remarkUpdatedDate = new Date(); 
                                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                                
                                                DriverDetails.isLuxury = driver.isLuxury;
                                                DriverDetails.permanentAddress = driver.permanentaddr;
                                                DriverDetails.accountNumber = driver.accno;
                                                DriverDetails.bankName = driver.bankname;
                                                DriverDetails.ifscCode = driver.ifsc;
                                                DriverDetails.emergencyNumber = driver.emergencyNumber;
                                                DriverDetails.trDate = driver.trDate;
                                                DriverDetails.ntDate = driver.ntDate;
                                                DriverDetails.pv = driver.pv;
                                                DriverDetails.pvExpiryDate = driver.pvDate;
                                                DriverDetails.cpvDate = driver.cpvDate;
                                                DriverDetails.cpv = driver.cpv;
                                                DriverDetails.driverBatch = driver.driverBatch;
                                                DriverDetails.freeAddress = driver.freeAddress;
                                                DriverDetails.driverCode = driver.driverCode;
                                                DriverDetails.BDate = driver.bdate;
                                                DriverDetails.licenseDate = driver.licenseIssueDate;
                                                DriverDetails.vehicle = driver.vehicle;
                                                DriverDetails.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                                DriverDetails.updatedBy = $localStorage.get('userId');
                                                DriverDetails.updatedDate = new Date();
                                                DriverDetails.driverTraining = driver.driverTraining;
                                                DriverDetails.InterviewStatus = driver.interviewStatus;
                                                DriverDetails.fitnessCertificate;
                                                DriverDetails.DOF;
                                                DriverDetails.$save();
                                                //console.log('DriverDetails updated for id : ' + JSON.stringify(DriverDetails));


                                                $.notify('Driver updated successfully.', {
                                                    status: 'success'
                                                });

                                                $modalInstance.dismiss('cancel');
                                                $rootScope.getAllDriver();
                                                $rootScope.loader = 0;


                                            },
                                            function(error) {
                                                console.log('Error updating driver details : ' + JSON.stringify(error));
                                                $modalInstance.dismiss('cancel');
                                                if (error.status == 0) {
                                                    window.alert('Oops! You are disconnected from server.');
                                                    $state.go('page.login');
                                                }
                                                $rootScope.loader = 0;
                                            });



                                    },
                                    function(error) {
                                        console.log('Error updating driver : ' + JSON.stringify(error));
                                        $modalInstance.dismiss('cancel');
                                        if (error.status == 0) {
                                            window.alert('Oops! You are disconnected from server.');
                                            $state.go('page.login');
                                        }
                                        $rootScope.loader = 0;
                                    });
                            },
                            function(err) {
                                console.log(JSON.stringify(err));
                                $rootScope.loader = 0;
                            });

                    /*}).
                    error(function(err) {
                        console.log(JSON.stringify(err));
                        $rootScope.loader = 0;
                    });*/


                }
            };
            //copy link 
            $scope.copylink = function () {
                /* Get the text field */
                var copyText = document.getElementById("interviewLink");

                /* Select the text field */
                copyText.select();
                copyText.setSelectionRange(0, 99999); /*For mobile devices*/

                /* Copy the text inside the text field */
                document.execCommand("copy");

                /* Alert the copied text */
                alert("Interview Link Copied");
            }
             $scope.updateDriverWthountDateValidation = function(driver) {
                $scope.submitUserBtn = true;
                $rootScope.loader = 1;

                var count = 0;
                if (angular.isUndefined(driver.firstName) || driver.firstName === '') {
                    document.getElementById("firstName").style.borderColor = "red";
                    document.getElementById("firstName1").innerHTML = '*required';
                    driver.firstName1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';
                    driver.firstName1 = null;
                }
                if (angular.isUndefined(driver.lastName) || driver.lastName === '') {
                    document.getElementById("lastName").style.borderColor = "red";
                    document.getElementById("lastName1").innerHTML = '*required';
                    driver.lastName1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';
                    driver.lastName1 = null;
                }

                 


                if (angular.isUndefined(driver.cellNumber) || driver.cellNumber === '') {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = '*required';
                    driver.cellNumber1 = 'This value is required';
                    count++;
                } else if (driver.cellNumber.length != 10) {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = 'Invalid mobile number';
                    driver.cellNumber1 = 'Invalid mobile number';
                    count++;
                } else {
                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                    document.getElementById("cellNumber1").innerHTML = '';
                    driver.cellNumber1 = null;
                }

                

                 
                 

                 

               /* if (angular.isUndefined(driver.bankname) || driver.bankname === '' || driver.bankname === null) {
                    document.getElementById("bankname").style.borderColor = "red";
                    document.getElementById("bankname1").innerHTML = '*required';
                    driver.bankname1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("bankname").style.borderColor = "#dde6e9";
                    document.getElementById("bankname1").innerHTML = '';
                    driver.bankname1 = null;
                }

                if (angular.isUndefined(driver.accno) || driver.accno === '' || driver.accno === null) {
                    document.getElementById("accno").style.borderColor = "red";
                    document.getElementById("accno1").innerHTML = '*required';
                    driver.accno1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("accno").style.borderColor = "#dde6e9";
                    document.getElementById("accno1").innerHTML = '';
                    driver.accno1 = null;
                }

                if (angular.isUndefined(driver.ifsc) || driver.ifsc === '' || driver.ifsc === null) {
                    document.getElementById("ifsc").style.borderColor = "red";
                    document.getElementById("ifsc1").innerHTML = '*required';
                    driver.ifsc1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("ifsc").style.borderColor = "#dde6e9";
                    document.getElementById("ifsc1").innerHTML = '';
                    driver.ifsc1 = null;
                }*/
                if (angular.isUndefined(driver.operationCity) || driver.operationCity === '' || driver.operationCity === null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*required';
                    driver.operationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("operationCity1").innerHTML = '';
                    driver.operationCity1 = null;
                }
                 
                 


               /* if(angular.isUndefined(driver.bdate) || driver.bdate === '' || driver.bdate=== null){
                 var age = 0;
                 }else{


                   var birthday = new Date(driver.bdate);
                      var today = new Date();
                      var age = ((today - birthday) / (31557600000));
                      var age = Math.floor( age );
                      
                }

                if(age < 25){
                    document.getElementById("bdate").style.borderColor = "red";
                    document.getElementById("bdate1").innerHTML = '*Age should be more than 25 years.';
                     
                    count++;
                }else{
                  document.getElementById("bdate").style.borderColor = "#dde6e9";
                    document.getElementById("bdate1").innerHTML = '';
                     
                }
                
                if(angular.isUndefined(driver.licenseIssueDate) || driver.licenseIssueDate === '' || driver.licenseIssueDate=== null){
                 var experience = 0;
                 }else{


                   var birthday1 = new Date(driver.licenseIssueDate);
                      var today1 = new Date();
                      var age1 = ((today1 - birthday1) / (31557600000));
                      var experience = Math.floor( age1 );
                      
                }
                if(experience < 3){
                    document.getElementById("licenceIssueDate").style.borderColor = "red";
                    document.getElementById("licenceIssueDate1").innerHTML = '*Experience should be more than 3 years.';
                     
                    count++;
                }else{
                  document.getElementById("licenceIssueDate").style.borderColor = "#dde6e9";
                    document.getElementById("licenceIssueDate1").innerHTML = '';
                     
                }*/
  


                if (count > 0) {
                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {


                    $scope.count = 0;
                    var latitude;
                    var longitude;
                     latitude = 0; 
                    longitude = 0; 
                        var remark = null;
                        if (!angular.isUndefined(driver.remark) || driver.remark !== null || driver.remark !== '') {
                            remark = driver.remark;
                        }

                        ConUsers.findById({
                                id: $rootScope.userId
                            },
                            function(userSuccess) {

                                var userName = userSuccess.firstName + ' ' + userSuccess.lastName;

                                ConUsers.findById({
                                        id: $rootScope.conUserId
                                    },
                                    function(ConUsers) {
                                        ConUsers.firstName = driver.firstName;
                                        ConUsers.middleName = driver.middleName;
                                        ConUsers.lastName = driver.lastName;
                                        ConUsers.mobileNumber = driver.cellNumber;
                                        ConUsers.username = driver.cellNumber;
                                        ConUsers.email = driver.cellNumber + '@consrv.in';
                                        ConUsers.address = driver.currentaddr;
                                        ConUsers.addressLat = latitude;
                                        ConUsers.addressLong = longitude;
                                        ConUsers.operationCity = driver.operationCity;
                                        ConUsers.updatedBy = $localStorage.get('userId');
                                        ConUsers.updatedDate = new Date();
                                        ConUsers.$save();
                                        //console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers));

                                        DriverDetails.findById({
                                                id: $rootScope.driverId
                                            },
                                            function(DriverDetails) {
                                                var remarkUpdatedDate = new Date(); 
                                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                                
                                                DriverDetails.isLuxury = driver.isLuxury;
                                                DriverDetails.permanentAddress = driver.permanentaddr;
                                                DriverDetails.accountNumber = driver.accno;
                                                DriverDetails.bankName = driver.bankname;
                                                DriverDetails.ifscCode = driver.ifsc;
                                                DriverDetails.emergencyNumber = driver.emergencyNumber;
                                                DriverDetails.trDate = driver.trDate;
                                                DriverDetails.ntDate = driver.ntDate;
                                                DriverDetails.pv = driver.pv;
                                                DriverDetails.pvExpiryDate = driver.pvDate;
                                                DriverDetails.cpvDate = driver.cpvDate;
                                                DriverDetails.cpv = driver.cpv;
                                                DriverDetails.driverBatch = driver.driverBatch;
                                                DriverDetails.freeAddress = driver.freeAddress;
                                                DriverDetails.driverCode = driver.driverCode;
                                                DriverDetails.BDate = driver.bdate;
                                                DriverDetails.licenseDate = driver.licenseIssueDate;
                                                DriverDetails.vehicle = driver.vehicle;
                                                DriverDetails.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                                DriverDetails.updatedBy = $localStorage.get('userId');
                                                DriverDetails.updatedDate = new Date();
                                                DriverDetails.driverTraining = driver.driverTraining;
                                                DriverDetails.InterviewStatus = driver.interviewStatus;
                                                DriverDetails.fitnessCertificate = driver.fitnessCertificate;
                                                DriverDetails.DOF = driver.DOF;
                                                DriverDetails.$save();
                                                //console.log('DriverDetails updated for id : ' + JSON.stringify(DriverDetails));


                                                $.notify('Driver updated successfully.', {
                                                    status: 'success'
                                                });

                                                $modalInstance.dismiss('cancel');
                                                $rootScope.getAllDriver();
                                                $rootScope.loader = 0;


                                            },
                                            function(error) {
                                                console.log('Error updating driver details : ' + JSON.stringify(error));
                                                $modalInstance.dismiss('cancel');
                                                if (error.status == 0) {
                                                    window.alert('Oops! You are disconnected from server.');
                                                    $state.go('page.login');
                                                }
                                                $rootScope.loader = 0;
                                            });



                                    },
                                    function(error) {
                                        console.log('Error updating driver : ' + JSON.stringify(error));
                                        $modalInstance.dismiss('cancel');
                                        if (error.status == 0) {
                                            window.alert('Oops! You are disconnected from server.');
                                            $state.go('page.login');
                                        }
                                        $rootScope.loader = 0;
                                    });
                            },
                            function(err) {
                                console.log(JSON.stringify(err));
                                $rootScope.loader = 0;
                            });

                    /*}).
                    error(function(err) {
                        console.log(JSON.stringify(err));
                        $rootScope.loader = 0;
                    });*/


                }
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.fetchDriverDetails = function() {
                 //$rootScope.getCities();
                var resultData = $rootScope.driverData;

                for (var i = 0; i < resultData.length; i++) {
                    var luxuryType;
                    if (resultData[i].isLuxury == 'A') {
                        luxuryType = 'Automatic';
                    } else if (resultData[i].isLuxury == 'L') {
                        luxuryType = 'Luxury';
                    } else {
                        luxuryType = 'Manual';
                    }
                    var status;
                    if (resultData[i].status == 'Inactive') {
                        status = 'Inactive';
                    } else {
                        status = resultData[i].status;
                    }
                    var city;
                    if(resultData[i].operationCity !== null){
                      for(var l=0;l<$rootScope.cities.length; l++){
                      if(resultData[i].operationCity === $rootScope.cities[l]){
                        city = $rootScope.cities[l];
                    }   
                    }  
                }else{
                    city = '';
                }
                    if (resultData[i].id == $rootScope.driverId) {
                        $scope.driver = {
                            firstName: resultData[i].firstName,
                            middleName: resultData[i].middleName,
                            lastName: resultData[i].lastName,
                            conuserId: resultData[i].conuserId,
                            email: resultData[i].email,
                            cellNumber: resultData[i].contactNo,
                            emergencyNumber: resultData[i].emergencyNumber,
                            status: status,
                            isLuxury: luxuryType,
                            accno: resultData[i].accountNumber,
                            bankname: resultData[i].bankName,
                            ifsc: resultData[i].ifscCode,
                            currentaddr: resultData[i].address,
                            permanentaddr: resultData[i].permanentAddress,
                            trDate: resultData[i].trDate,
                            ntDate: resultData[i].ntDate,
                            bdate: resultData[i].bdate,
                            driverBatch: resultData[i].driverBatch,
                            freeAddress: resultData[i].freeAddress,
                            driverCode: resultData[i].driverCode,
                            pv: resultData[i].pv,
                            pvDate: resultData[i].pvDate,
                            cpvDate:resultData[i].cpvDate,
                            cpv: resultData[i].cpv,
                            remark: resultData[i].remarkdes,
                            licenseIssueDate:resultData[i].licenseIssueDate,
                            vehicle:resultData[i].vehicle,
                            operationCity:city,
                            driverTraining: resultData[i].driverTraining,
                            interviewStatus:resultData[i].InterviewStatus,
                            fitnessCertificate:resultData[i].fitnessCertificate,
                            DOF:resultData[i].DOF,
                            interviewLink:resultData[i].InterviewLink
                        };
                    }
                }
                console.log('driver: '+JSON.stringify($scope.driver));
            };

            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };

        };

        $(function() {
            //$scope.getDriver();
        });

    }
])
.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            // see where the cursor is before the update so that we can set it back
            var selection = element[0].selectionStart;
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
            // set back the cursor after rendering
            element[0].selectionStart = selection;
            element[0].selectionEnd = selection;
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    }
    })
.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };

            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
})

.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
}).directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
}])

.directive('allowPattern', [allowPatternDirective]);

function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
                // I handle key events
                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                    // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                        event.preventDefault();
                        return false;
                    }

                });
            };
        }
    };
};
