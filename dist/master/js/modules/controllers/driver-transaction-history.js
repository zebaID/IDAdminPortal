App.controller('driverTransactionCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'DriverAccountTransactions', 'orderByFilter', '$modal', '$http', '$window',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, DriverAccountTransactions, orderByFilter, $modal, $http, $window) {
        'use strict';
        $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');

   $rootScope.getUserforSelectedCity = function(city){//change operation city in drop down
            $rootScope.operationCitySelect = city;
            console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
            $rootScope.getDriverTransactionHistory();
            $state.go('app.driverTransactionHistory');
            reloadFunc(); 
             
        }
        $rootScope.getDriverTransactionHistory = function() {//get driver transaction history of current date
            //console.log('All Driver' + JSON.stringify($rootScope.data));
            if (angular.isDefined($rootScope.data)) {
                $rootScope.data = undefined;
            }

            $rootScope.loader = 1;
            $rootScope.driverData = [];
            var allData = [];
            var currentDate = Date.now();
            if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                     $rootScope.loader = 0;
                }else{
                DriverAccountTransactions.getDriverTransaction({
                    operationCity: $rootScope.operationCitySelect
                }, function(transactionData) {
                    //console.log('transaction data' + JSON.stringify(transactionData));
                    for (var i = 0; i < transactionData.length; i++) {

                        var amt = '0.00';
                        var createdDate = moment(transactionData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        if (transactionData[i].amount !== null && transactionData[i].amount !== '' && !angular.isUndefined(transactionData[i].amount)) {
                            amt = transactionData[i].amount.toFixed(2);

                        }
                        allData.push({
                            id: transactionData[i].id,
                            accountID: transactionData[i].account_id,
                            driverId: transactionData[i].driver_id,
                            name: transactionData[i].first_name + ' ' + transactionData[i].last_name,
                            description: transactionData[i].description,
                            amount: amt,
                            createdDate: createdDate,
                            status: transactionData[i].transaction_status

                        });


                    }
                    $rootScope.driverData = allData;
                    $rootScope.data = allData;
                    //console.log('All Driver' + JSON.stringify($rootScope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }
            }else{

        
            DriverAccountTransactions.getDriverTransaction({
                        operationCity: $rootScope.operationCity
                }, function(transactionData) {
                    //console.log('transaction data' + JSON.stringify(transactionData));
                    for (var i = 0; i < transactionData.length; i++) {

                        var amt = '0.00';
                        var createdDate = moment(transactionData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        if (transactionData[i].amount !== null && transactionData[i].amount !== '' && !angular.isUndefined(transactionData[i].amount)) {
                            amt = transactionData[i].amount.toFixed(2);

                        }
                        allData.push({
                            id: transactionData[i].id,
                            accountID: transactionData[i].account_id,
                            driverId: transactionData[i].driver_id,
                            name: transactionData[i].first_name + ' ' + transactionData[i].last_name,
                            description: transactionData[i].description,
                            amount: amt,
                            createdDate: createdDate,
                            status: transactionData[i].transaction_status

                        });


                    }
                    $rootScope.driverData = allData;
                    $rootScope.data = allData;
                    //console.log('All Driver' + JSON.stringify($rootScope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        }
        };
        $scope.backToSearch = function() {
            $state.go('app.driverTransactionHistory');
        }


        function reloadFunc() {
            $scope.count = 0;
            $scope.timers = setInterval(reloadData, 5);


        }
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
        $scope.changeMin = function(minDt) {
            $scope.minToDate = $scope.minToDate ? null : minDt;
        };



  $scope.storeValue = function(fromDate, toDate) {
            $rootScope.loader = 1;
            var date2 = toDate;
            var date1 = fromDate;
            var count = 0;
            var dateone = new Date(date1); 
        var datetwo = new Date(date2);
        var dayDif = (datetwo - dateone)  / 1000 / 60 / 60 / 24;

            if ((angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) && (angular.isUndefined(toDate) || toDate === '' || toDate === null)) {
                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required';

                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate2").innerHTML = '*required';
                count++;

            } else {
                if(dayDif>9){
                    document.getElementById("frmDate").style.borderColor = "red";
                    document.getElementById("frmDate1").innerHTML = '*Unable to retrive more than 10 days data.';
                    count++;

                }else{
                  if (angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) {
                    document.getElementById("frmDate").style.borderColor = "red";
                    document.getElementById("frmDate1").innerHTML = '*required';
                    count++;

                } else {
                    document.getElementById("frmDate").style.borderColor = "#dde6e9";
                    document.getElementById("frmDate1").innerHTML = '';
                }
                 if (angular.isUndefined(toDate) || toDate === '' || toDate === null) {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate2").innerHTML = '*required';
                    count++;

                } else if (date2 < date1) {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate2").innerHTML = 'To Date should be greater than From Date';
                    count++;

                } else {
                    document.getElementById("toDate").style.borderColor = "#dde6e9";
                    document.getElementById("toDate2").innerHTML = '';
                }  
                }
               
                

            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;
                $localStorage.put('fromDate', fromDate);
                $localStorage.put('toDate', toDate);
                $state.go('app.driver-transaction-history_byDate');
                $rootScope.loader = 0;
            }

        }

        $scope.searchTransactionHistory = function() {
            $rootScope.storedFromDate = $localStorage.get('fromDate');
            $rootScope.storedToDate = $localStorage.get('toDate');
            $rootScope.loader = 1;
            $rootScope.driverData = [];
            var allData = [];
            var currentDate = Date.now();
            var fromDate = moment($rootScope.storedFromDate).format('YYYY/MM/DD');
            var toDate = moment($rootScope.storedToDate).format('YYYY/MM/DD');
            if($rootScope.roleId === '1'){
                DriverAccountTransactions.getDriverTransactionHistory({

                    fromDate: fromDate,
                    ToDate: toDate,
                    operationCity:$rootScope.operationCitySelect

                }, function(transactionData1) {
                    //console.log('transaction data' + JSON.stringify(transactionData1));
                    for (var i = 0; i < transactionData1.length; i++) {

                        var amt = '0.00';
                        var createdDate = moment(transactionData1[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        if (transactionData1[i].amount !== null && transactionData1[i].amount !== '' && !angular.isUndefined(transactionData1[i].amount)) {
                            amt = transactionData1[i].amount.toFixed(2);

                        }
                        allData.push({
                            id: transactionData1[i].id,
                            accountID: transactionData1[i].account_id,
                            driverId: transactionData1[i].driver_id,
                            name: transactionData1[i].first_name + ' ' + transactionData1[i].last_name,
                            description: transactionData1[i].description,
                            amount: amt,
                            createdDate: createdDate,
                            status: transactionData1[i].transaction_status
                        });


                    }
                    $rootScope.driverData = allData;
                    $rootScope.data = allData;
                    //console.log('All Driver' + JSON.stringify($rootScope.data));
                    createTable();

                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }else{


            DriverAccountTransactions.getDriverTransactionHistory({

                    fromDate: fromDate,
                    ToDate: toDate,
                    operationCity:$rootScope.operationCity

                }, function(transactionData1) {
                    //console.log('transaction data' + JSON.stringify(transactionData1));
                    for (var i = 0; i < transactionData1.length; i++) {

                        var amt = '0.00';
                        var createdDate = moment(transactionData1[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        if (transactionData1[i].amount !== null && transactionData1[i].amount !== '' && !angular.isUndefined(transactionData1[i].amount)) {
                            amt = transactionData1[i].amount.toFixed(2);

                        }
                        allData.push({
                            id: transactionData1[i].id,
                            accountID: transactionData1[i].account_id,
                            driverId: transactionData1[i].driver_id,
                            name: transactionData1[i].first_name + ' ' + transactionData1[i].last_name,
                            description: transactionData1[i].description,
                            amount: amt,
                            createdDate: createdDate,
                            status: transactionData1[i].transaction_status
                        });


                    }
                    $rootScope.driverData = allData;
                    $rootScope.data = allData;
                    //console.log('All Driver' + JSON.stringify($rootScope.data));
                    createTable();

                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        }

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

    }
]);
