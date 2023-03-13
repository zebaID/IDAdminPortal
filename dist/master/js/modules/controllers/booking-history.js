App.controller('bookingHistoryCtrl', bookingHistoryCtrl)

function bookingHistoryCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, BookingPaymentTransaction, DriverAllocationReport, Cities) {
    'use strict';

    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
      console.log('history =', $scope.searchBooking);   

        if($rootScope.history === true){
            $rootScope.history = false;
        }else{
            $scope.searchBooking =true;
        }
        $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;

           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $state.go('app.bookingHistory');
             $scope.fetchBookingHistoryCustList();
            
             
        }
     
    $scope.uid = $localStorage.get('userId');
    $scope.tripArray = [{
        'desc': 'O'
    }, {
        'desc': 'R'
    }];
    
    $rootScope.fetchBookingHistoryCancelReason = function() {
        CancellationReasons.find({},
            function(response) {
                $rootScope.bookingHistoryCancelationReasons = response;
            },
            function(error) {
              //  console.log('Error : ' + JSON.stringify(error));
            });
    };

    $scope.fetchBookingHistoryCustList = function() {

        $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if($rootScope.operationCitySelect === 'All'){
                CustomerDetails.getCustomers({
                 operationCity: $rootScope.operationCitySelect
            }, function(customerData) {

                //console.log('customerData' + JSON.stringify(customerData));
                $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                     

                    $scope.bookingHistorycustomerList.push({
                        id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.bookingHistorycustomerList));

                $rootScope.loader = 0;

            },
            function(custErr) {
               // console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
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
                $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                     

                    $scope.bookingHistorycustomerList.push({
                         id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.bookingHistorycustomerList));

                $rootScope.loader = 0;

            },
            function(custErr) {
               // console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');

                }
                $rootScope.loader = 0;
            });
            }
            
        }else{
        CustomerDetails.getCustomers({
                 
                operationCity:$rootScope.operationCity
                                 
            }, function(customerData) {

                //console.log('customerData' + JSON.stringify(customerData));
                $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                   

                    $scope.bookingHistorycustomerList.push({
                         id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.bookingHistorycustomerList));

                $rootScope.loader = 0;

            },
            function(custErr) {
               // console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');

                }
                $rootScope.loader = 0;
            });
    }
    };


    $scope.Message1 = function() {
        // console.log('create popup called.' + modelAssetId);

        var modalInstance = $modal.open({
            templateUrl: '/sendMessage.html',
            controller: bookingHistoryDoneBookingCtrl
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
    $rootScope.checkAll1 = function(user) {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;

        } else {
            $scope.selectedAll = false;

        }
        angular.forEach($rootScope.customerData1, function(user) {
            user.Selected = $scope.selectedAll;
        });

    }
    $rootScope.selectCustomer1 = function(contactNo, name) {
        if ($scope.selct.length !== null && $scope.selctn.length !== null) {
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
        $rootScope.cname = $scope.selectN;
        $rootScope.number = $scope.select;
    };

    var cnt = 0;
    $scope.count = 0;
    $scope.selct = [];
    $scope.selctn = [];
    $rootScope.selectAllCustomer1 = function() {

        if (cnt == 0) {
            $scope.selct = [];
            $scope.selctn = [];

            var num = $rootScope.customerData1.length;

            for (var i = 0; i < num; i++) {


                if ($scope.selct.indexOf($rootScope.customerData1[i].mobileNumber) == -1 && $scope.selctn.indexOf($rootScope.customerData1[i].custName) == -1) {

                    $scope.selct.push($rootScope.customerData1[i].mobileNumber);

                    $scope.selctn.push($rootScope.customerData1[i].custName);

                    $scope.count++;

                } else {
                    for (var j = $scope.selct.length - 1; j >= 0; j--) {

                        if ($scope.selct[j] == $rootScope.customerData1[i].mobileNumber && $scope.selctn[j] == $rootScope.customerData1[i].custName) {


                            $scope.selct.splice(j, 0);
                            $scope.selctn.splice(j, 0);
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


    var bookingHistoryDoneBookingCtrl = function($modalInstance) {
        $rootScope.cancel1 = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getSearchHistory();
        };

        $rootScope.sendMessage1 = function(sendRequestAdv) {
            $rootScope.loader = 1;
            for (var i = 0; i < $rootScope.number.length; i++) {
                for (var j = i; j <= i; j++) {
                    var f = $rootScope.cname[j].split(" ", 1);

                    var msg = 'Dear ' + f + ', ' + sendRequestAdv;
                    ConUsers.sendSMS({
                    mobileNumber: $rootScope.number[i],
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
            $rootScope.getSearchHistory();
            $rootScope.number = 0;
            $rootScope.cname = 0;
            $rootScope.loader = 0;

        };


        $rootScope.closeModal1 = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getSearchHistory();
        };


    };
    $scope.bookingHistoryCustMobileSelected = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber1 !== undefined && $scope.search.mobileNumber1 !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber1));
            $scope.mobileId = parseInt($scope.search.mobileNumber1.originalObject.id);
            $rootScope.custCellNo = $scope.search.mobileNumber1.originalObject.mobileNumber;

        }
    };

    $scope.fetchBookingHistoryDrvList = function() {

          if($rootScope.roleId === '1'){
            if($rootScope.operationCitySelect === 'All'){
                $rootScope.loader = 1;
        DriverDetails.getDrivers({
            operationCity:$rootScope.operationCitySelect
        }, function(driverData) {
            //console.log('driver Data*' + JSON.stringify(driverData));
            $scope.bookingHistoryDrvList = [];
            if (!angular.isUndefined(driverData)) {
                for (var i = 0; i < driverData.length; i++) {
                     

                    $scope.bookingHistoryDrvList.push({
                        id: driverData[i].id,
                        mobileNumber: driverData[i].mobile_number,
                        driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                        driverSearchData: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number

                    });
                    //console.log('driver list' + JSON.stringify($scope.bookingHistoryDrvList));
                }
            }



            $rootScope.loader = 0;
        }, function(driverErr) {
           // console.log('driver error' + JSON.stringify(driverErr));
            if (driverErr.status == 0) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }
            /*$modalInstance.dismiss('cancel');*/
            $rootScope.loader = 0;
        });
            }else{
             $rootScope.loader = 1;
        DriverDetails.getDrivers({
            operationCity:$rootScope.operationCitySelect
        }, function(driverData) {
            //console.log('driver Data*' + JSON.stringify(driverData));
            $scope.bookingHistoryDrvList = [];
            if (!angular.isUndefined(driverData)) {
                for (var i = 0; i < driverData.length; i++) {
                     

                    $scope.bookingHistoryDrvList.push({
                        id: driverData[i].id,
                        mobileNumber: driverData[i].mobile_number,
                        driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                        driverSearchData: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number

                    });
                    //console.log('driver list' + JSON.stringify($scope.bookingHistoryDrvList));
                }
            }



            $rootScope.loader = 0;
        }, function(driverErr) {
           // console.log('driver error' + JSON.stringify(driverErr));
            if (driverErr.status == 0) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }
            /*$modalInstance.dismiss('cancel');*/
            $rootScope.loader = 0;
        });
            }
            
          }else{


        $rootScope.loader = 1;
        DriverDetails.getDrivers({
            operationCity:$rootScope.operationCity
        }, function(driverData) {
            //console.log('driver Data*' + JSON.stringify(driverData));
            $scope.bookingHistoryDrvList = [];
            if (!angular.isUndefined(driverData)) {
                for (var i = 0; i < driverData.length; i++) {
                     

                    $scope.bookingHistoryDrvList.push({
                        id: driverData[i].id,
                        mobileNumber: driverData[i].mobile_number,
                        driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                        driverSearchData: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number

                    });
                    //console.log('driver list' + JSON.stringify($scope.bookingHistoryDrvList));
                }
            }



            $rootScope.loader = 0;
        }, function(driverErr) {
           // console.log('driver error' + JSON.stringify(driverErr));
            if (driverErr.status == 0) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }
            /*$modalInstance.dismiss('cancel');*/
            $rootScope.loader = 0;
        });
    }

    };



    $scope.bookingHistoryDrvMobileSelected = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber2 !== undefined && $scope.search.mobileNumber2 !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));
            $rootScope.driverId1 = parseInt($scope.search.mobileNumber2.originalObject.id);
            $rootScope.drvCellNo = $scope.search.mobileNumber2.originalObject.mobileNumber;
            $rootScope.newBookingSMSData = $scope.search.mobileNumber2;

        }
    };




    $scope.toggleMin = function() {
        $scope.minDate;
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

    $scope.searchRecords = function(s_date, e_date) {

        $scope.start_date = (s_date && !isNaN(Date.parse(s_date))) ? Date.parse(s_date) : 0;
        $scope.end_date = (e_date && !isNaN(Date.parse(e_date))) ? Date.parse(getCurrentDateTime(e_date)) : new Date().getTime();
        var result = [];
        var searchList = $scope.orginalData;
        if (searchList && searchList.length > 0) {
            $.each(searchList, function(index, searchList) {
                var reportingDate = new Date(searchList.reportingDate);
                if (start_date <= reportingDate && reportingDate <= end_date) {
                    result.push(searchList);
                }
            });
            $scope.data = result;

        } else {

            $scope.data = $scope.orginalData;

        }


        //  $scope.tableParams3.reload();
    };

    $scope.Status1 = [{
        Id: 1,
        Bstatus: 'New Booking'
    }, {
        Id: 2,
        Bstatus: 'Line Up'
    }, {
        Id: 3,
        Bstatus: 'On Duty'
    }, {
        Id: 4,
        Bstatus: 'Done'
    }, {
        Id: 5,
        Bstatus: 'Paid'
    }, {
        Id: 6,
        Bstatus: 'Cancelled'
    }];


    $scope.paymentModeArray = [{
        Id: 1,
        Mode: 'D'
    }, {
        Id: 2,
        Mode: 'C'
    }, {
        Id: 3,
        Mode: 'O'
    }];

    $scope.getNumber = function(num) {
        return new Array(num);
    }
    $rootScope.fetchBookingHistoryDetails = function(searchData) {

        $scope.isDisabledButton = true;
        //console.log('searchData is' + JSON.stringify(searchData));

        $rootScope.loader = 1;
        var count = 0;
        $scope.tournamentList = [];
        var allBookingData = [];
        var custId = null;
        var drvId = null;
        var bookingStatus = null;
        var paymentMethod = null;
        var startDate = null;
        var endDate = null;
        var bookingId = null;
        var tripType = null;
        
        if (!angular.isUndefined(searchData)) {

            if (!angular.isUndefined(searchData.frmDate) || searchData.frmDate !== '' || searchData.frmDate !== null) {
                startDate = (searchData.frmDate && !isNaN(Date.parse(searchData.frmDate))) ? Date.parse(searchData.frmDate) : 0;
                    var dateone = new Date(searchData.frmDate); 
        
            }
            if (!angular.isUndefined(searchData.toDate) || searchData.toDate !== '' || searchData.toDate !== null) {
                var datetwo = new Date(searchData.toDate);
        
                endDate = (searchData.toDate && !isNaN(Date.parse(searchData.toDate))) ? Date.parse(getCurrentDateTime(searchData.toDate)) : new Date().getTime();
            }

            if (!angular.isUndefined(searchData.status) || searchData.status !== '' || searchData.status !== null) {
                bookingStatus = searchData.status;
                if (searchData.status === 'Done') {
                    $rootScope.available = true;
                } else {
                    $rootScope.available = false;
                }
            }

            if (!angular.isUndefined(searchData.paymentMode) || searchData.paymentMode !== '' || searchData.paymentMode !== null) {

                paymentMethod = searchData.paymentMode;

            }
            if (!angular.isUndefined(searchData.tripType) || searchData.tripType !== '' || searchData.tripType !== null) {

                tripType = searchData.tripType;

            }
            if (!angular.isUndefined(searchData.bookingId) || searchData.bookingId !== '' || searchData.bookingId !== null) {
                bookingId = searchData.bookingId;
            }
        }

        //To retreive data upto 31 days of booking
        if (!angular.isUndefined(searchData)) {
            if (angular.isUndefined(searchData.frmDate) || searchData.frmDate === '' || searchData.frmDate === null) {
                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required';
                searchData.frmDate1 = 'required';
                count++;
            } else if(angular.isUndefined($scope.mobileId) && angular.isUndefined($rootScope.driverId1)){
            var dayDif = (datetwo - dateone)  / 1000 / 60 / 60 / 24;
            if(dayDif <= 31){
                    document.getElementById("frmDate").style.borderColor = "#dde6e9";
                document.getElementById("frmDate1").innerHTML = '';
                //searchData.frmDate1 = null;
            }else{
              document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*Unable to retrive more than 31 days data.';
                //searchData.frmDate1 = 'Unable to retrive more than 4 days data.';
                count++;  
            }
        }else {

                document.getElementById("frmDate").style.borderColor = "#dde6e9";
                document.getElementById("frmDate1").innerHTML = '';
                searchData.frmDate1 = null;

            }

            if (endDate < startDate) {
                document.getElementById("toDate").style.borderBottom = "1px solid red";
                document.getElementById("toDate1").innerHTML = 'to Date should be greater';
                count++;

            } else {
                document.getElementById("toDate").style.borderColor = "#dde6e9";
                document.getElementById("toDate1").innerHTML = '';

            }
        } else {
            document.getElementById("frmDate").style.borderColor = "red";
            document.getElementById("frmDate1").innerHTML = '*required';


            count++;
        }

        

        if (!angular.isUndefined($scope.mobileId) || $scope.mobileId !== '' || $scope.mobileId !== null) {
            custId = $scope.mobileId;
        } else {
            custId = 0;
        }
        if (!angular.isUndefined($rootScope.driverId1) || $rootScope.driverId1 !== '' || $rootScope.driverId1 !== null) {
            drvId = $rootScope.driverId1;
        } else {
            drvId = 0;
        }


        if (count > 0) {
            $scope.count = count;
            $scope.isDisabledButton = false;
            $rootScope.loader = 0;
            return false;
        } else {
            $scope.count = 0;

            UserRoles.findOne({
         filter: {
                where: {
                    conuserId: $scope.uid
                }
            }
    },function(suc){
       // console.log('suc: '+JSON.stringify(suc));
        $rootScope.roleId = suc.roleId;
        $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.bookingHistory');
                      $rootScope.loader = 0;
                      $scope.isDisabledButton = false;
                }else{
                     if($rootScope.operationCitySelect === 'All'){
                        Bookings.find({
                filter: {
                    where: {
                        and: [{
                            reportingDate: {
                                gte: new Date(startDate)
                            }
                        }, {
                            reportingDate: {
                                lte: new Date(endDate)
                            }
                        }],
                        status: bookingStatus,
                        customerId: custId,
                        driverId: drvId,
                        paymentMethod: paymentMethod,
                        tripType: tripType

                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                    }
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount)) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var tripType = '';
                    if (!angular.isUndefined(bookingData[i].tripType) || bookingData[i].tripType !== null || bookingData[i].tripType !== '') {
                        tripType = bookingData[i].tripType;
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus,
                        tripType: tripType
                    });
                }
                $rootScope.newBookingsData = allBookingData;

                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
               // console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
                     }else{
                      Bookings.find({
                filter: {
                    where: {
                        and: [{
                            reportingDate: {
                                gte: new Date(startDate)
                            }
                        }, {
                            reportingDate: {
                                lte: new Date(endDate)
                            }
                        },{
                            operationCity:$rootScope.operationCitySelect
                        }],
                        status: bookingStatus,
                        customerId: custId,
                        driverId: drvId,
                        paymentMethod: paymentMethod,
                        tripType: tripType

                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                    
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount)) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var tripType = '';
                    if (!angular.isUndefined(bookingData[i].tripType) || bookingData[i].tripType !== null || bookingData[i].tripType !== '') {
                        tripType = bookingData[i].tripType;
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus,
                        tripType: tripType
                    });
                }
            }
                $rootScope.newBookingsData = allBookingData;

                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
              //  console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });  
                     }
                
            
             }   
             }else{
                Bookings.find({
                filter: {
                    where: {
                        and: [{
                            reportingDate: {
                                gte: new Date(startDate)
                            }
                        }, {
                            reportingDate: {
                                lte: new Date(endDate)
                            }
                        },{
                            operationCity:$rootScope.operationCity
                        }],
                        status: bookingStatus,
                        customerId: custId,
                        driverId: drvId,
                        paymentMethod: paymentMethod,
                        tripType: tripType

                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                   
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount)) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var tripType = '';
                    if (!angular.isUndefined(bookingData[i].tripType) || bookingData[i].tripType !== null || bookingData[i].tripType !== '') {
                        tripType = bookingData[i].tripType;
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus,
                        tripType: tripType
                    });
                }
            }
                $rootScope.newBookingsData = allBookingData;

                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
               // console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
                }
    },function(er){

    });
        }
    };

    

    $rootScope.fetchBookingHistoryDetailsByID = function(searchData) {

        $scope.isDisabledButton = true;
        //console.log('searchData is' + JSON.stringify(searchData));
        $rootScope.loader = 1;
        var count = 0;
        $scope.tournamentList = [];
        var allBookingData = [];

        var bookingId = null;

        if (!angular.isUndefined(searchData)) {
            if (!angular.isUndefined(searchData.bookingId) || searchData.bookingId !== '' || searchData.bookingId !== null) {
                bookingId = searchData.bookingId;
            }
        }

        if (!angular.isUndefined(searchData)) {


            if (angular.isUndefined(searchData.bookingId) || searchData.bookingId === '' || searchData.bookingId === null) {
                document.getElementById("bookingId").style.borderColor = "red";
                document.getElementById("bookingId1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("bookingId").style.borderColor = "#dde6e9";
                document.getElementById("bookingId1").innerHTML = '';

            }

        } else {
            document.getElementById("bookingId").style.borderColor = "red";
            document.getElementById("bookingId1").innerHTML = '*required';

            count++;
        }



        if (count > 0) {
            $scope.count = count;
            $scope.isDisabledButton = false;
            $rootScope.loader = 0;
            return false;
        } else {
            $scope.count = 0;

            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    Bookings.find({
                filter: {
                    where: {

                        id: bookingId 
                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                    }
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount) && bookingData[i].invoices[0].netAmount!==null) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount) && bookingData[i].invoices[0].grossAmount!== null) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus
                    });
                }
                $rootScope.newBookingsData = allBookingData;
                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
               // console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
                }else{
                  Bookings.find({
                filter: {
                    where: {

                        id: bookingId,
                        operationCity:$rootScope.operationCitySelect
                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                    
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount)) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus
                    });
                }
            }
                $rootScope.newBookingsData = allBookingData;
                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
               // console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });  
                }
                
            }else{



            Bookings.find({
                filter: {
                    where: {

                        id: bookingId,
                        operationCity:$rootScope.operationCity
                    },

                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers'
                            }
                        }
                    }, {
                        relation: 'outstationBookings'
                    }, {
                        relation: 'localBookings'
                    }, {
                        relation: 'invoices'
                    }]
                }
            }, function(bookingData) {
                //console.log('Booking data  ' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname = '-';
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid = '';
                    var cellNumber = '-';

                    if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {

                        if (!angular.isUndefined(bookingData[i].customerDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].customerDetails.conUsers.middleName) || bookingData[i].customerDetails.conUsers.middleName === null) {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + clName;
                                cid = bookingData[i].customerDetails.id;
                            } else {

                                cfName = bookingData[i].customerDetails.conUsers.firstName;
                                cmName = bookingData[i].customerDetails.conUsers.middleName;
                                clName = bookingData[i].customerDetails.conUsers.lastName;
                                cname = cfName + ' ' + cmName + ' ' + clName;
                            }
                            if (!angular.isUndefined(bookingData[i].customerDetails.conUsers.mobileNumber) || bookingData[i].customerDetails.conUsers.mobileNumber !== null || bookingData[i].customerDetails.conUsers.mobileNumber !== '') {
                                cellNumber = bookingData[i].customerDetails.conUsers.mobileNumber;
                            }
                        }
                   
                    var drvId = '';
                    var dname = '-';
                    var dfName = '-';
                    var dmName = '-';
                    var dlName = '-';
                    var relDate = '-';
                    var relTime = '-';
                    var actualAmount = '-';
                    var estimatedAmount = '-';

                    if (bookingData[i].outstationBookings.length > 0) {
                        if (bookingData[i].outstationBookings[0].releavingDate != null || bookingData[i].outstationBookings[0].releavingDate != '') {
                            relDate = bookingData[i].outstationBookings[0].releavingDate;
                            relTime = bookingData[i].outstationBookings[0].releavingTime;
                        }

                    } else {
                        if (bookingData[i].invoices.length > 0) {
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingDate) || bookingData[i].invoices[0].releavingDate !== null || bookingData[i].invoices[0].releavingDate !== '') {
                                relDate = bookingData[i].invoices[0].releavingDate;
                            }
                            if (!angular.isUndefined(bookingData[i].invoices[0].releavingTime) || bookingData[i].invoices[0].releavingTime !== null || bookingData[i].invoices[0].releavingTime !== '') {
                                relTime = bookingData[i].invoices[0].releavingTime;
                            }
                        } else {
                            var reportingTime = bookingData[i].reportingTime;
                            var arr = reportingTime.split(':');
                            var hours = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            var sec = parseInt(arr[2]);

                            if (bookingData[i].localBookings[0].releavingDuration != null || bookingData[i].localBookings[0].releavingDuration != '') {
                                var relHours = bookingData[i].localBookings[0].releavingDuration / 60;
                                var tohours = hours + relHours;
                                var toTime = tohours + ':' + min + ':' + sec + '0';
                                var repDate = bookingData[i].reportingDate;
                                var arr = repDate.split('-');
                                var year = parseInt(arr[0]);
                                var month = parseInt(arr[1]);
                                var day = parseInt(arr[2]) + 1;


                                if (tohours < 24) {
                                    relDate = repDate;

                                    if (tohours < 10) {
                                        tohours = '0' + tohours;
                                    }

                                    relTime = tohours + ':' + min + ':' + sec;

                                } else {
                                    if (tohours > 23) {
                                        tohours = tohours - 24;
                                        if (tohours < 10) {
                                            tohours = '0' + tohours;
                                        }

                                    }
                                    relDate = day + '/' + month + '/' + year;
                                    relTime = tohours + ':' + min + ':' + sec;
                                }

                            }
                        }
                    }
                    if (!angular.isUndefined(bookingData[i].driverDetails)) {

                        if (!angular.isUndefined(bookingData[i].driverDetails.conUsers)) {
                            if (angular.isUndefined(bookingData[i].driverDetails.conUsers.middleName) || bookingData[i].driverDetails.conUsers.middleName === null) {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dlName;
                            } else {
                                dfName = bookingData[i].driverDetails.conUsers.firstName;
                                dmName = bookingData[i].driverDetails.conUsers.middleName;
                                dlName = bookingData[i].driverDetails.conUsers.lastName;
                                dname = dfName + ' ' + dmName + ' ' + dlName;
                            }

                        }
                        if (!angular.isUndefined(bookingData[i].driverDetails.id)) {
                            drvId = bookingData[i].driverDetails.id;
                        }
                    }
                    var amount = '0.00';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length == 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].grossAmount)) {

                            estimatedAmount = bookingData[i].invoices[0].grossAmount;
                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var landmark = ' ';
                    if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                        landmark = bookingData[i].landmark + ', ';
                    }

                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].landmark !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allBookingData.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        carType: bookingData[i].carType,
                        drvName: dname,
                        custFirstName: cfName,
                        custMiddleName: cmName,
                        custLastName: clName,
                        estimatedAmt: estimatedAmount,
                        actualAmt: amount,
                        paymentMode: $scope.paymentMode,
                        driverId: drvId,
                        drvFirstName: dfName,
                        drvMiddleName: dmName,
                        drvLastName: dlName,
                        rating: rateCount,
                        reportingLocation: landmark + bookingData[i].pickAddress,
                        releavingLocation: bookingData[i].dropAddress,
                        paymentMethod: bookingData[i].paymentMethod,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: relDate,
                        releavingTime: relTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus
                    });
                }
            }
                $rootScope.newBookingsData = allBookingData;
                // console.log('booking data****** ' + JSON.stringify($rootScope.data));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $state.go('app.bookingHistoryResult');
                $rootScope.loader = 0;

            }, function(bookErr) {
                console.log('booking error ' + JSON.stringify(bookErr));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (bookErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
        }
        }
    };

    $rootScope.getSearchHistory = function() {
        $rootScope.data = $rootScope.newBookingsData;
        $rootScope.customerData1 = $rootScope.newBookingsData;
        createTable();
    }


    function createTable() {

        $scope.tableParams3 = new ngTableParams({
            page: 1, // show first page
            count: 10 // count per page

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

    $scope.changeDrvPaymentStatus = function(bookingId) {
        $rootScope.loader = 1;
        //console.log('booking id of change payment status***' + JSON.stringify(bookingId));
        if (angular.isDefined(bookingId) && bookingId !== null) {
            Bookings.findById({
                    id: bookingId
                },
                function(Bookings) {
                    if (Bookings.status == 'Done' || Bookings.status == 'Paid') {

                        if (Bookings.driverPaymentStatus == 'Hold') {
                            Bookings.driverPaymentStatus = 'Unsettled';
                            Bookings.updatedBy = $localStorage.get('userId');
                            Bookings.updatedDate = new Date();
                            Bookings.$save();
                        } else {
                            Bookings.driverPaymentStatus = 'Hold';
                            Bookings.updatedBy = $localStorage.get('userId');
                            Bookings.updatedDate = new Date();
                            Bookings.$save();
                        }

                        reloadFunc();
                        $rootScope.getSearchHistory();


                    } else {
                        $window.alert('You can not settle the status unless booking status is Done or Paid');
                    }
                    //$window.location.reload(); 
                    $rootScope.loader = 0;
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


    $scope.bookingHistoryFunction = function(user) {
        //console.log('bookingReportFunction ***********' + JSON.stringify(user));
        $rootScope.bookingReportData = user;

        $rootScope.loader = 1;
        console.log('called new booking ');
        if (angular.isDefined($rootScope.bookingReportData.bookingId) && $rootScope.bookingReportData.bookingId !== null) {
            Bookings.findOne({
                filter: {
                    where: {
                        id: $rootScope.bookingReportData.bookingId
                    },
                    include: [{
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                            }
                        }
                    }, {
                        relation: 'driverDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                            }
                        }
                    }, {
                        relation: 'localBookings'


                    }, {
                        relation: 'outstationBookings'


                    }, {
                        relation: 'invoices',
                        scope: {
                            include: {
                                relation: 'invoiceDetails',
                                scope: {
                                    include: {
                                        relation: 'invoiceSubHeads'
                                    }
                                }
                            }
                        }


                    }]
                }
            }, function(bookingData) {
                $scope.bookingFare = bookingData;
                //console.log('bookingData ' + JSON.stringify(bookingData));
                if (angular.isDefined(bookingData) && bookingData !== null) {
                    var cityName;
                    var carType;
                    var dutyType;
                    var journeyType;
                    var releavingDate;
                    var releavingTime;
                    var reportingTime;

                    reportingTime = bookingData.reportingTime;
                    var arr1 = reportingTime.split(':');
                    var fromhour = parseInt(arr1[0]);
                    var frommin = parseInt(arr1[1]);
                    var fromsec = parseInt(arr1[2]);
                    var fromFormat;
                    if (fromhour <= 12) {
                        fromFormat = "AM";
                    } else {
                        fromFormat = "PM";
                    }

                    var minuteRemaining = frommin % 5;
                    var totalTime;
                    $scope.fromTimeHours;
                    $scope.fromTimeMinutes;
                    if (minuteRemaining == 0) {
                        totalTime = 0;
                    } else {
                        totalTime = (parseInt(frommin)) + (5 - (parseInt(minuteRemaining)));
                    }

                    if (fromhour < 10) {
                        fromhour = '0' + fromhour;
                    }
                    if (totalTime == 60) {
                        totalTime = '0';
                        fromhour = ((parseInt(fromhour)) + 1);
                        if (fromhour > 12) {
                            fromhour = fromhour - 12;
                            fromhour = '0' + fromhour;
                        } else {
                            if (fromhour < 10) {
                                fromhour = '0' + fromhour;
                            }
                        }
                    } else {
                        if (totalTime < 10) {
                            if (totalTime == 0) {
                                totalTime = '0';
                            } else {
                                totalTime = '0' + totalTime;
                            }
                        }
                    }
                    $scope.fromTimeHours = '' + fromhour;
                    $scope.fromTimeMinutes = totalTime;
                    if (angular.isDefined(bookingData.outstationBookings) && bookingData.outstationBookings.length > 0) {
                        cityName = bookingData.outstationBookings[0].cityName;
                    }
                    if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                        releavingDate = bookingData.invoices[0].releavingDate;
                        releavingTime = bookingData.invoices[0].releavingTime;
                        var arr = releavingTime.split(':');
                        var tohour = parseInt(arr[0]);
                        var tomin = parseInt(arr[1]);
                        var tosec = parseInt(arr[2]);
                        var toFormat;
                        if (tohour < 10) {
                            tohour = '0' + tohour;
                        }
                        if (tohour <= 12) {
                            toFormat = "AM";
                        } else {
                            toFormat = "PM";
                        }


                    }
                    var carTypeText;
                    if (angular.isDefined(bookingData.carType)) {
                        if (bookingData.carType == 'A') {
                            carType = 'Automatic';
                            carTypeText = 'Automatic';
                        } else if (bookingData.carType == 'M') {
                            carType = 'Manual';
                            carTypeText = 'Manual';
                        } else {
                            carType = 'Luxury';
                            carTypeText = 'Luxury';
                        }

                    }
                    if (angular.isDefined(bookingData.isOutstation)) {
                        if (bookingData.isOutstation == true) {
                            dutyType = 'Outstation';
                        } else {
                            dutyType = 'Local';
                        }
                    }
                    if (angular.isDefined(bookingData.isRoundTrip)) {
                        if (bookingData.isRoundTrip == true) {
                            journeyType = 'Round Trip';
                        } else {
                            journeyType = 'One Way';
                        }
                    }

                    var travelDuration = '0';
                    var grossAmt = '0';
                    var netAmt = '0';
                    if (bookingData.invoices.length > 0) {
                        if (bookingData.invoices[0].totalTravelTime != null || bookingData.invoices[0].totalTravelTime != '' || (!angular.isUndefined(bookingData.invoices[0].totalTravelTime))) {
                            travelDuration = bookingData.invoices[0].totalTravelTime / 60;
                        }
                        if (bookingData.invoices[0].grossAmount != null || bookingData.invoices[0].grossAmount != '' || (!angular.isUndefined(bookingData.invoices[0].grossAmount))) {
                            grossAmt = bookingData.invoices[0].grossAmount;
                        }
                        if (bookingData.invoices[0].netAmount != null || bookingData.invoices[0].netAmount != '' || (!angular.isUndefined(bookingData.invoices[0].netAmount))) {
                            netAmt = bookingData.invoices[0].netAmount;
                        }
                    }
                    var drvShare;
                    var idShare;
                    if (angular.isDefined(bookingData.driverShare)) {
                        drvShare = bookingData.driverShare;
                    }

                    if (angular.isDefined(bookingData.idShare)) {
                        idShare = bookingData.idShare;
                    }

                    var paymentMode;
                    if (angular.isDefined(bookingData.paymentMethod) || bookingData.paymentMethod != null || bookingData.paymentMethod != '') {
                        if (bookingData.paymentMethod == 'O') {
                            paymentMode = 'Online';
                        } else if (bookingData.paymentMethod == 'C') {
                            paymentMode = 'Cash By Office';
                        } else {
                            paymentMode = 'Cash By Driver';
                        }
                    }

                    var returnFare = '0';
                    var returnFareText;
                    if (bookingData.isOutstation == true && bookingData.isRoundTrip == false) {
                        if (bookingData.outstationBookings.length > 0) {
                            if (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime) || bookingData.outstationBookings[0].returnTravelTime != null || bookingData.outstationBookings[0].returnTravelTime != '') {
                                returnFare = ((bookingData.outstationBookings[0].returnTravelTime) * 35 * 1.75).toFixed(2);
                                returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime) * 35).toFixed(2) + ' KM ' + '* 1.75) = ';
                            }
                        }
                    } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                        returnFare = '100';
                        returnFareText = ' ';
                    } else {
                        returnFare = '0';
                        returnFareText = ' ';
                    }
                    var returnTravelHours = '0';
                    var returnTime = '0';
                    var driverId = null;
                    if (!angular.isUndefined(bookingData.driverDetails)) {
                        if (!angular.isUndefined(bookingData.driverDetails.id) || bookingData.driverDetails.id !== '' || bookingData.driverDetails.id !== null) {
                            driverId = bookingData.driverDetails.id;
                        }

                    }
                    if (bookingData.outstationBookings.length > 0) {
                        if (bookingData.outstationBookings[0].returnTravelTime != null && (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime))) {
                            returnTime = bookingData.outstationBookings[0].returnTravelTime.toFixed(2);
                            var arr = returnTime.split('.');
                            var hr = parseInt(arr[0]);
                            var min = parseInt(arr[1]);
                            if (min < 10) {
                                min = '0' + min;
                            }
                            var actualMin = min * 0.6;
                            var roundMin = Math.round(actualMin);
                            returnTravelHours = hr + ' Hrs. ' + roundMin + ' Mins.';

                        }
                    }

                    var driverShare = '0';
                    var idShare = '0';
                    var parsedDrvShare = '0';
                    var parsedIdShare = '0';
                    if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                        driverShare = bookingData.driverShare.toFixed(2);

                    }
                    if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                        idShare = bookingData.idShare.toFixed(2);

                    }

                    var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');



                    $scope.booking = {
                        bookingId: bookingData.id,
                        startDuty: bookingData.startOffDuty,
                        bookingCustomerName: bookingData.customerDetails.firstName + ' ' + bookingData.customerDetails.lastName,
                        bookingFirstName: bookingData.customerDetails.conUsers.firstName,
                        bookingMiddleName: bookingData.customerDetails.conUsers.middleName,
                        bookingLastName: bookingData.customerDetails.conUsers.lastName,
                        bookingCellNumber: bookingData.customerDetails.conUsers.mobileNumber,
                        email: bookingData.customerDetails.conUsers.email,
                        bookingReportingDate: bookingData.reportingDate,
                        bookingToDate: releavingDate,
                        reportingTime: reportingTime,
                        releivingTime: releavingTime,
                        bookingFrmLocation: bookingData.pickAddress,
                        bookingToLocation: bookingData.dropAddress,
                        dutyType: dutyType,
                        landmark: bookingData.landmark,
                        carType: carType,
                        hours: $scope.fromTimeHours,
                        minutes: frommin,
                        timeformat: fromFormat,
                        tohours: tohour,
                        tominutes: tomin,
                        totimeformat: toFormat,
                        totalDuration: travelDuration,
                        outstationCity: cityName,
                        journeyType: journeyType,
                        estimatedAmt: grossAmt,
                        totalAmt: netAmt,
                        driverShare: drvShare,
                        idShare: idShare,
                        paymentMethod: paymentMode,
                        carTypeValue: carTypeText,
                        status: bookingData.status,
                        cancellationId: bookingData.cancellationId,
                        otherReason: bookingData.otherCancellationReason,
                        returnFareAmt: returnFareText + returnFare,
                        driverShare: driverShare,
                        idShare: idShare,
                        returnTime: returnTravelHours,
                        bookingDate: createdDate,
                        driverId: driverId

                    };
                    $rootScope.fetchedBookingDetails = $scope.booking;
                    $rootScope.cancelDetails1 = $scope.booking;
                    $rootScope.loader = 0;

                    if ($rootScope.fetchedBookingDetails.status == 'New Booking' || $rootScope.fetchedBookingDetails.status == 'Cancelled') {
                        var modalInstance = $modal.open({
                            templateUrl: '/bookingHistoryNewBookingModel.html',
                            controller: bookingHistoryNewBookingCtrl,
                            windowClass: 'app-modal-window'
                        });
                        var state = $('#modal-state');
                        modalInstance.result.then(function() {
                            state.text('Modal dismissed with OK status');
                        }, function() {
                            state.text('Modal dismissed with Cancel status');
                        });
                    } else {
                        if ($rootScope.fetchedBookingDetails.status == 'Line Up' || $rootScope.fetchedBookingDetails.status == 'Paid' || $rootScope.fetchedBookingDetails.status == 'Done' || $rootScope.fetchedBookingDetails.status == 'On Duty') {

                            var modalInstance = $modal.open({
                                templateUrl: '/bookingHistoryLineUpBookingModel.html',
                                controller: bookingHistoryLineUpBookingCtrl,
                                windowClass: 'app-modal-window'
                            });
                            var state = $('#modal-state');
                            modalInstance.result.then(function() {
                                state.text('Modal dismissed with OK status');
                            }, function() {
                                state.text('Modal dismissed with Cancel status');
                            });
                        }
                    }

                }


            }, function(bookingErr) {
                console.log('bookingErr ' + JSON.stringify(bookingErr));
                if (bookingErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
        }



    };

    var bookingHistoryNewBookingCtrl = function($scope, $rootScope, $modalInstance) {

        $scope.searchDriver = false;
        if ($rootScope.fetchedBookingDetails.status == 'New Booking') {
            $scope.allocateDriver = true;
            $scope.cancelButton = true;
        }
$scope.dutyArray = [{
            'desc': 'Regular'
        }, {
            'desc': 'Immediate'
        }];
        $scope.CancelBookingPopUp = function() {

            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: bookingHistoryNewBookingCtrl
            });

        }



         $scope.bookingHistorySubmitCancellationReason = function(cancelationReason, comment) {
            $rootScope.loader = 1;
            ConUsers.findById({
                    id: $rootScope.userId
                },
                function(ConUsers) {

                    $scope.Aname = ConUsers.firstName + ' ' + ConUsers.lastName;
                    var cancelName = ' Booking cancelled by ' + $scope.Aname + ' on ';

                    Bookings.cancelBookingForAdmin({
                            bookingId: $rootScope.cancelDetails1.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.bookingHistoryCancelationReasons.comment + ' ' + cancelName,
                            userId: $rootScope.userId
                        },

                        function(response) {
                            // console.log('booking for cancellation:' + JSON.stringify(response));


                           if (response[0].booking_status === 'Cancelled') {

                                var cancelSMS = $rootScope.cancelDetails1;
                                 $scope.opcity = response[0].operation_city;

                                cancelBookingSMS(cancelSMS,  $scope.opcity);
                                $.notify('This duty has been cancelled successfully.', {
                                    status: 'success'
                                });


                            } else if (response[0].booking_status === 'On Duty') {
                                $.notify('This duty has already started', {
                                    status: 'danger'
                                });
                            } else if (response[0].booking_status === 'Done') {
                                $.notify('This duty has already done ', {
                                    status: 'danger'
                                });
                            } else if (response[0].booking_status === 'Paid') {
                                $.notify('This duty has already paid', {
                                    status: 'danger'
                                });
                            } else {

                            }
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;
                        },
                        function(er) {
                            console.log('error in cancellation of booking:' + JSON.stringify(er));
                            if (er.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });

                },
                function(error) {

                    $rootScope.loader = 0;
                });
        }

        function cancelBookingSMS(cancelSMS, opcity) {
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment(cancelSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            
ConUsers.sendSMS({
                mobileNumber: cancelSMS.bookingCellNumber,
                msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });


                                 },function(r){
                    });
           

        };

        $scope.bookingHistoryNewBookingDriverSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $rootScope.driverId1 = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.newBookingDrvCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
                $rootScope.newBookingSMSData = $scope.search.mobileNumber;

            }
        };

        $rootScope.bookingHistoryAllocateDriverFunction = function() {
            $scope.isDisabled = true;
            $rootScope.loader = 1;
            $scope.uid = $localStorage.get('userId');
            Bookings.acceptDuty({
                driverId: $rootScope.driverId1,
                bookingId: $rootScope.allocateNewBookings.bookingId,
                oldDriverId: '0'
            }, function(dutyReport) {
                //console.log('driver report' + JSON.stringify(dutyReport));
                if ((dutyReport[0].accept_duty == 'Already Allocated to other duty on the same day') || (dutyReport[0].accept_duty == 'Allocation Error')) {
                    window.alert("Driver already allocated.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Allocation Error') {
                    window.alert("This booking is not valid any more.");
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Please Recharge Your Account to Accept this Duty') {
                    window.alert("Please Recharge Driver Account to Assign this Duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Account Error') {
                    window.alert("Driver account does not exist.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Driver Block') {
                    window.alert("The Driver is not active to allocate this duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Please complete your lineup duty') {
                    window.alert("Please complete your lineup duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expired') {
                    window.alert("License of this Driver is expired.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Kindly Update Your License') {
                    window.alert("Please update driver license date.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                }  else if (dutyReport[0].accept_duty == 'Driver  blocked for this customer') {
                    console.log('driver blocked');
                    window.alert("This driver is blocked for this customer.");
                    $rootScope.loader = 0;
                }else if (dutyReport[0].accept_duty == 'License Expire Soon') {
                    window.alert("License of this Driver will expire soon.");
                    $.notify('Driver ID: ' + $rootScope.driverId1 + ' has been allocated to booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    var customerSMS = $rootScope.allocateNewBookings;
                    var driverSMS = $rootScope.newBookingSMSData;
                   var opcity = $rootScope.allocateNewBookings.opCity;
                    customerSMSFunction(customerSMS, driverSMS, opcity);
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.allocateNewBookings.bookingId,
                        driverId: $rootScope.driverId1,
                        userId: $scope.uid,
                        allocationStatus: 'Allocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));
                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getSearchHistory();
                        $rootScope.driverId1 = undefined;
                        $rootScope.allocateNewBookings.bookingId = undefined;
                        $rootScope.loader = 0;
                    }, function(error) {
                        console.log('created allocation error' + JSON.stringify(error));
                    });
                } else if (dutyReport[0].accept_duty == 'Accepted') {
                    $.notify('Driver ID: ' + $rootScope.driverId1 + ' has been allocated to booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    var customerSMS = $rootScope.allocateNewBookings;
                    var driverSMS = $rootScope.newBookingSMSData;
                   var opcity = $rootScope.allocateNewBookings.opCity;
                    customerSMSFunction(customerSMS, driverSMS, opcity);
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.allocateNewBookings.bookingId,
                        driverId: $rootScope.driverId1,
                        userId: $scope.uid,
                        allocationStatus: 'Allocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));
                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getSearchHistory();
                        $rootScope.driverId1 = undefined;
                        $rootScope.allocateNewBookings.bookingId = undefined;
                        $rootScope.loader = 0;
                    }, function(error) {
                        console.log('created allocation error' + JSON.stringify(error));
                    });
                } else {
                    // do nothing
                }
            }, function(error) {
                console.log('error in accepting duty' +JSON.stringify(error));
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        }

        function customerSMSFunction(customerSMS, driverSMS, opcity) {
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + customerSMS.bookingFirstName + ',%0a Driver Name: ' + driverSMS.originalObject.driverName + ' (Contact Number: ' + driverSMS.originalObject.mobileNumber + ') has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';



ConUsers.sendSMS({
                mobileNumber: customerSMS.bookingCellNumber,
                msg: msg
                }, function(mgssuccess) {
                    driverSMSFunction(customerSMS, driverSMS);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

             
                                },function(r){
                    });

           
        };
        function driverSMSFunction(customerSMS, driverSMS) {
            var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            //console.log('customer sms:' + JSON.stringify(customerSMS));
            var relTime = customerSMS.tohours + ':' + customerSMS.tominutes + ':' + '00';
            var rptTime = customerSMS.hours + ':' + customerSMS.minutes + ':' + '00';
            if (customerSMS.landmark === null) {
                var landmark = '';
            } else {
                var landmark = customerSMS.landmark;
            }
            if (customerSMS.dutyType !== 'Outstation') {
                var relHour = ' Duty Hours:' + customerSMS.totalDuration;
            } else {
                var relDate = moment(customerSMS.bookingToDate).format('DD-MM-YYYY');
                var relHour = ' Releiving on: ' + relDate + ' @ ' + relTime
            }
            if (customerSMS.journeyType === 'Round Trip') {
                var dropadd = ' ';
            } else {
                var dropadd = ' Drop Address:' + customerSMS.bookingToLocation;
            }

            var picadd = ', Pickup Address:' + landmark + ', ' + customerSMS.bookingFrmLocation;
            var reportingTime = customerSMS.hours + ':' + customerSMS.minutes + ':' + '00';
            var msg = 'Hi ' + driverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' Duty Type: ' + customerSMS.dutyType + ' ' + customerSMS.journeyType + ' Car Type: ' + customerSMS.carType + ' Dated on: ' + rptDate + ' @ ' + reportingTime + relHour + picadd + dropadd + ' Client Name: ' + customerSMS.bookingFirstName + '-' + customerSMS.bookingCellNumber;

    ConUsers.sendSMS({
        mobileNumber: driverSMS.originalObject.mobileNumber,
                msg: msg
                }, function(mgssuccess) {
                    //driverSMSFunction(customerSMS, driverSMS);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

              
        };



        $scope.fetchBookingHistoryNewBookingDriverList = function() {

            $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                Bookings.getDriverList({
                bookingId: $rootScope.allocateNewBookings.bookingId,
                operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver Data' + JSON.stringify(driverData));
                $scope.driverMobileList = [];

                for (var i = 0; i < driverData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';


                    if (!angular.isUndefined(driverData[i].mobile_number) || driverData[i].mobile_number !== '' || driverData[i].mobile_number !== null) {
                        mobNo = driverData[i].mobile_number;
                    }
                    if (!angular.isUndefined(driverData[i].first_name) || driverData[i].driverData !== '' || driverData[i].first_name !== null) {
                        firstName = driverData[i].first_name;
                    }
                    if (!angular.isUndefined(driverData[i].last_name) || driverData[i].last_name !== '' || driverData[i].last_name !== null) {
                        lastName = driverData[i].last_name;
                    }

                    $scope.driverMobileList.push({
                        id: driverData[i].driver_id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        driverSearchData: firstName + ' ' + lastName + ' - ' + mobNo

                    });
                }


                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });

            }else{


            Bookings.getDriverList({
                bookingId: $rootScope.allocateNewBookings.bookingId,
                operationCity:$rootScope.operationCity
            }, function(driverData) {
                //console.log('driver Data' + JSON.stringify(driverData));
                $scope.driverMobileList = [];

                for (var i = 0; i < driverData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';


                    if (!angular.isUndefined(driverData[i].mobile_number) || driverData[i].mobile_number !== '' || driverData[i].mobile_number !== null) {
                        mobNo = driverData[i].mobile_number;
                    }
                    if (!angular.isUndefined(driverData[i].first_name) || driverData[i].driverData !== '' || driverData[i].first_name !== null) {
                        firstName = driverData[i].first_name;
                    }
                    if (!angular.isUndefined(driverData[i].last_name) || driverData[i].last_name !== '' || driverData[i].last_name !== null) {
                        lastName = driverData[i].last_name;
                    }

                    $scope.driverMobileList.push({
                        id: driverData[i].driver_id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        driverSearchData: firstName + ' ' + lastName + ' - ' + mobNo

                    });
                }


                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
        }
        };


        $scope.searchDrivers = function(dist) {
            $scope.driverData = $scope.allDriverData;
            var resultData = [];
            var distanceVal = parseInt(dist);
            for (var i = 0; i < $scope.driverData.length; i++) {
                if (parseInt($scope.driverData[i].distance) <= distanceVal) {
                    resultData.push($scope.driverData[i]);
                }
            }

            $scope.driverData = resultData;
        };
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
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getSearchHistory();
        };
        $scope.allocate = function() {

            $scope.searchDriver = true;
            $scope.allocateDriver = false;

        };


        var formatTime = (function() {
            function addZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }

            return function(dt) {
                var formatted = '';

                if (dt) {
                    var hours24 = dt.getHours();
                    var hours = ((hours24 + 11) % 12) + 1;
                    formatted = [formatted, [addZero(hours), addZero(dt.getMinutes())].join(":"), hours24 > 11 ? "pm" : "am"].join(" ");
                }
                return formatted.trim();
            }
        });

         $scope.bookingHistoryGetNewBooking = function() {
            $rootScope.loader = 1;
            //console.log('called new booking ');
            if (angular.isDefined($rootScope.fetchedBookingDetails.bookingId) && $rootScope.fetchedBookingDetails.bookingId !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.fetchedBookingDetails.bookingId
                        },
                        include: [{
                            relation: 'customerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers',
                                }
                            }
                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers',
                                }
                            }
                        }, {
                            relation: 'localBookings'


                        }, {
                            relation: 'outstationBookings'


                        }, {
                            relation: 'invoices',
                            scope: {
                                include: {
                                    relation: 'invoiceDetails',
                                    scope: {
                                        include: {
                                            relation: 'invoiceSubHeads'
                                        }
                                    }
                                }
                            }


                        },{
                            relation:'driverAllocationReport',
                        }]
                    }
                }, function(bookingData) {
                    $scope.bookingFare = bookingData;
                    // console.log('bookingData ' + JSON.stringify(bookingData));
                    if (angular.isDefined(bookingData) && bookingData !== null) {
                        var cityName;
                        var carType;
                        var dutyType;
                        var journeyType;
                        var releavingDate;
                        var releavingTime;
                        var reportingTime;

                        reportingTime = bookingData.reportingTime;
                        var arr1 = reportingTime.split(':');
                        var fromhour = parseInt(arr1[0]);
                        var frommin = arr1[1];
                        var fromsec = parseInt(arr1[2]);
                        var fromFormat;
                        if (fromhour <= 12) {
                            fromFormat = "AM";
                        } else {
                            fromFormat = "PM";
                        }

                        var minuteRemaining = frommin % 5;
                        var totalTime;
                        $scope.fromTimeHours;
                        $scope.fromTimeMinutes;
                        if (minuteRemaining == 0) {
                            totalTime = 0;
                        } else {
                            totalTime = (parseInt(frommin)) + (5 - (parseInt(minuteRemaining)));
                        }

                        if (fromhour < 10) {
                            fromhour = '0' + fromhour;
                        }
                        if (totalTime == 60) {
                            totalTime = '0';
                            fromhour = ((parseInt(fromhour)) + 1);
                            if (fromhour > 12) {
                                fromhour = fromhour - 12;
                                fromhour = '0' + fromhour;
                            } else {
                                if (fromhour < 10) {
                                    fromhour = '0' + fromhour;
                                }
                            }
                        } else {
                            if (totalTime < 10) {
                                if (totalTime == 0) {
                                    totalTime = '0';
                                } else {
                                    totalTime = '0' + totalTime;
                                }
                            }
                        }
                        $scope.fromTimeHours = '' + fromhour;
                        $scope.fromTimeMinutes = totalTime;
                        if (angular.isDefined(bookingData.outstationBookings) && bookingData.outstationBookings.length > 0) {
                            cityName = bookingData.outstationBookings[0].cityName;
                        }
                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = parseInt(arr[1]);
                            var tosec = parseInt(arr[2]);
                            var toFormat;
                            if (tohour < 10) {
                                tohour = '0' + tohour;
                            }
                            if (tohour <= 12) {
                                toFormat = "AM";
                            } else {
                                toFormat = "PM";
                            }


                        }
                        var carTypeText;
                        if (angular.isDefined(bookingData.carType)) {
                            if (bookingData.carType == 'A') {
                                carType = 'Automatic';
                                carTypeText = 'Automatic';
                            } else if (bookingData.carType == 'M') {
                                carType = 'Manual';
                                carTypeText = 'Manual';
                            } else {
                                carType = 'Luxury';
                                carTypeText = 'Luxury';
                            }

                        }
                        if (angular.isDefined(bookingData.isOutstation)) {
                            if (bookingData.isOutstation == true) {
                                dutyType = 'Outstation';
                            } else {
                                dutyType = 'Local';
                            }
                        }
                        if (angular.isDefined(bookingData.isRoundTrip)) {
                            if (bookingData.isRoundTrip == true) {
                                journeyType = 'Round Trip';
                            } else {
                                journeyType = 'One Way';
                            }
                        }

                        var travelDuration = '0';
                        var grossAmt = '0';
                        var netAmt = '0';
                        if (bookingData.invoices.length > 0) {
                            if (bookingData.invoices[0].totalTravelTime != null || bookingData.invoices[0].totalTravelTime != '' || (!angular.isUndefined(bookingData.invoices[0].totalTravelTime))) {
                                travelDuration = bookingData.invoices[0].totalTravelTime / 60;
                            }
                            if (bookingData.invoices[0].grossAmount != null || bookingData.invoices[0].grossAmount != '' || (!angular.isUndefined(bookingData.invoices[0].grossAmount))) {
                                grossAmt = bookingData.invoices[0].grossAmount;
                            }
                            if (bookingData.invoices[0].netAmount != null || bookingData.invoices[0].netAmount != '' || (!angular.isUndefined(bookingData.invoices[0].netAmount))) {
                                netAmt = bookingData.invoices[0].netAmount;
                            }
                        }
                        var drvShare;
                        var idShare;
                        if (angular.isDefined(bookingData.driverShare)) {
                            drvShare = bookingData.driverShare;
                        }

                        if (angular.isDefined(bookingData.idShare)) {
                            idShare = bookingData.idShare;
                        }

                        var paymentMode;
                        if (angular.isDefined(bookingData.paymentMethod) || bookingData.paymentMethod != null || bookingData.paymentMethod != '') {
                            if (bookingData.paymentMethod == 'O') {
                                paymentMode = 'Online';
                            } else if (bookingData.paymentMethod == 'C') {
                                paymentMode = 'Cash By Office';
                            } else {
                                paymentMode = 'Cash By Driver';
                            }
                        }

                        var returnFare = '0';
                        var returnFareText;
                        if (bookingData.isOutstation == true && bookingData.isRoundTrip == false) {
                            if (bookingData.outstationBookings.length > 0) {
                                if (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime) || bookingData.outstationBookings[0].returnTravelTime != null || bookingData.outstationBookings[0].returnTravelTime != '') {
                                    returnFare = (bookingData.outstationBookings[0].returnTravelTime).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime)-125).toFixed(2) + ' KM ' + '* 6)';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
                            returnFareText = ' ';
                        } else {
                            returnFare = '0';
                            returnFareText = ' ';
                        }
                        var dutyHours = 0;
                        if (angular.isDefined(bookingData.localBookings) && bookingData.localBookings.length > 0) {
                            if (bookingData.localBookings[0].releavingDuration != null || bookingData.localBookings[0].releavingDuration != '' || (!angular.isUndefined(bookingData.localBookings[0].releavingDuration))) {
                                dutyHours = Math.round(bookingData.localBookings[0].releavingDuration / 60);
                            }
                        }
                        var returnTravelHours = '0';
                        var returnTime = '0';
                        if (bookingData.outstationBookings.length > 0) {
                            var cancelledReleivingDate = bookingData.outstationBookings[0].releavingDate;
                            var cancelledReleivingTime = bookingData.outstationBookings[0].releavingTime;
                            
                            if (bookingData.outstationBookings[0].returnTravelTime != null && (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime))) {
                                returnTime = bookingData.outstationBookings[0].returnTravelTime.toFixed(2);
                                var arr = returnTime.split('.');
                                var hr = parseInt(arr[0]);
                                var min = parseInt(arr[1]);
                                if (min < 10) {
                                    min = '0' + min;
                                }
                                var actualMin = min * 0.6;
                                var roundMin = Math.round(actualMin);
                                returnTravelHours = hr + ' Hrs. ' + roundMin + ' Mins.';

                            }
                        }

                        var driverShare = '0';
                        var idShare = '0';
                        var parsedDrvShare = '0';
                        var parsedIdShare = '0';
                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);

                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);

                        }

                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        if (bookingData.status === 'Cancelled') {

                            CancellationReasons.findById({
                                id: bookingData.cancellationId
                            }, function(cancellationData) {
                                $rootScope.cancelReason1 = cancellationData.desc;

                            }, function(error) {
                                console.log('cancel reason fetch error' + JSON.stringify(error));
                            });
                        }
                        var history = [];
                            if (bookingData.driverAllocationReport.length !== 0) {
                                
                                   for (var k = 0; k < bookingData.driverAllocationReport.length; k++) {
                                       var status = bookingData.driverAllocationReport[k].history + moment(bookingData.driverAllocationReport[k].createdDate).format('DD-MM-YYYY | HH:mm:ss');
                                        history.push(status);
                                    }

                               
                           }

                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;
                                //console.log('BookedBy' + JSON.stringify($scope.bookedBy));

                                $scope.booking = {
                                    bookingId: bookingData.id,
                                    startDuty: bookingData.startOffDuty,
                                    bookingCustomerName: bookingData.customerDetails.firstName + ' ' + bookingData.customerDetails.lastName,
                                    bookingFirstName: bookingData.customerDetails.conUsers.firstName,
                                    bookingMiddleName: bookingData.customerDetails.conUsers.middleName,
                                    bookingLastName: bookingData.customerDetails.conUsers.lastName,
                                    bookingCellNumber: bookingData.customerDetails.conUsers.mobileNumber,
                                    email: bookingData.customerDetails.conUsers.email,
                                    bookingReportingDate: bookingData.reportingDate,
                                    bookingToDate: releavingDate,
                                    reportingTime: reportingTime,
                                    releivingTime: releavingTime,
                                    bookingFrmLocation: bookingData.pickAddress,
                                    bookingToLocation: bookingData.dropAddress,
                                    dutyType: dutyType,
                                    landmark: bookingData.landmark,
                                    carType: carType,
                                    hours: $scope.fromTimeHours,
                                    minutes: frommin,
                                    timeformat: fromFormat,
                                    tohours: tohour,
                                    tominutes: tomin,
                                    totimeformat: toFormat,
                                    totalDuration: travelDuration,
                                    outstationCity: cityName,
                                    journeyType: journeyType,
                                    estimatedAmt: grossAmt,
                                    totalAmt: netAmt,
                                    driverShare: drvShare,
                                    idShare: idShare,
                                    paymentMethod: paymentMode,
                                    carTypeValue: carTypeText,
                                    status: bookingData.status,
                                    cancellationId: bookingData.cancellationId,
                                    otherReason: bookingData.otherCancellationReason,
                                    returnFareAmt: returnFareText,
                                    returnFarekm: returnFare,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark,
                                    cancelledToDate: cancelledReleivingDate,
                                    cancelledToTime: cancelledReleivingTime,
                                    localDutyHours: dutyHours,
                                    history:history,
                                    opCity: bookingData.operationCity,
                                    dutyBasis:bookingData.dutyBasis,
                                    extraCharges:bookingData.extraCharges

                                };
                                $rootScope.allocateNewBookings = $scope.booking;
                                $rootScope.cancelDetails1 = $scope.booking;
                                $scope.fetchBookingHistoryNewBookingDriverList();
                                $rootScope.loader = 0;
                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });


                    }


                }, function(bookingErr) {
                    console.log('bookingErr ' + JSON.stringify(bookingErr));
                    if (bookingErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });
            }


        };


        $scope.updateDateAndTime = function(booking) {
           //var url = 'http://192.168.1.18:3000';
            var url = 'http://65.0.186.134:3000';
            //var url = 'http://18.220.250.238:3000';
            $rootScope.loader = 1;
            var returnFarekm=0;
            if (booking.dutyType == 'Outstation' && booking.journeyType == 'One Way') {
               
                returnFarekm = (booking.returnFarekm);
           
    }
            var count = 0;
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
            var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
            var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
            var date1 = new Date(rptDate);
            var date2 = new Date(relDate);
            //console.log('booking details' + JSON.stringify(booking));
            if (angular.isUndefined(booking.bookingReportingDate) || booking.bookingReportingDate === '' || booking.bookingReportingDate === null) {
                document.getElementById("bookingReportingDate").style.borderColor = "red";
                document.getElementById("bookingReportingDate1").innerHTML = '*required';
                booking.bookingReportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingReportingDate1").innerHTML = '';
                booking.bookingReportingDate1 = null;
            }
            if (angular.isUndefined(booking.hours) || booking.hours === '' || booking.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                booking.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                booking.hours1 = null;
            }
            if (angular.isUndefined(booking.minutes) || booking.minutes === '' || booking.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                booking.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                booking.minutes1 = null;
            }
            if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                document.getElementById("bookingToDate").style.borderColor = "red";
                document.getElementById("bookingToDate1").innerHTML = '*required';
                booking.bookingToDate1 = 'This value is required';
                count++;
            } else {
                 document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingToDate1").innerHTML = '';
                booking.bookingToDate1 = null;
                 if (booking.dutyType === 'Outstation') {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }
                } else {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    }else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }  else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;
                    }
                }
            }
            /*if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null) {
                document.getElementById("toHours").style.borderColor = "red";
                document.getElementById("toHours1").innerHTML = '*required';
                booking.toHours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("toHours").style.borderColor = "#dde6e9";
                document.getElementById("toHours").innerHTML = '';
                booking.toHours = null;
            }
            if (angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                document.getElementById("toMinutes").style.borderColor = "red";
                document.getElementById("toMinutes1").innerHTML = '*required';
                booking.toMinutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("toMinutes").style.borderColor = "#dde6e9";
                document.getElementById("toMinutes1").innerHTML = '';
                booking.toMinutes1 = null;
            }*/

            if(angular.isUndefined(booking.remark) || (booking.remark === '' ) || booking.remark === null || booking.remark==='undefined'){
                var remark='';
            }
            else{
                var remark=booking.remark;
            }
            var extracharges = 0;
            if(booking.dutyBasis === 'Immediate'){
                    extracharges = Number(booking.extraCharges);
            }



            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
                var rptTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                
                Bookings.find({
                    filter: {
                        where: {
                            id: booking.bookingId
                        },
                        include: [{
                            relation: 'invoices'

                        }, {
                            relation: 'outstationBookings'


                        }]
                    }
                }, function(success) {
                    if(booking.dutyBasis === 'Immediate'){
                     if(success[0].dutyBasis === 'Regular' && success[0].extraCharges === 0){
                            var dutyBasis = 'ID_Immediate';
                            var extraCharges = 0;
                    } else{
                       var dutyBasis = booking.dutyBasis;
                        var extraCharges = Number(booking.extraCharges);
                    }  
                    }else{
                       var dutyBasis = booking.dutyBasis;
                        var extraCharges = Number(booking.extraCharges);
                    }
                    //console.log('booking success' + JSON.stringify(success));
                    success[0].dutyBasis = dutyBasis;
                    success[0].extraCharges = extraCharges;
                    success[0].reportingDate = rptDate;
                    success[0].remark = remark;
                    success[0].reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';
                    success[0].updatedDate = new Date();
                    success[0].updatedBy = $rootScope.userId;
                    success[0].$save();

                    if (success[0].isOutstation === true) {
                        OutstationBookings.find({
                            filter: {
                                where: {
                                    bookingId: booking.bookingId
                                }
                            }
                        }, function(OBSuccess) {
                            //console.log('OutstationBookings details' + JSON.stringify(OBSuccess));
                            OBSuccess[0].releavingDate = relDate;
                            OBSuccess[0].releavingTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            OBSuccess[0].updatedBy = $rootScope.userId;
                            OBSuccess[0].updatedDate = new Date();
                            OBSuccess[0].$save();
                        }, function(OBErr) {
                            console.log('OutstationBookings error' + JSON.stringify(OBErr));
                        });
                    }


                    Invoices.upsert({
                        id: success[0].invoices[0].id,
                        reportingDate: rptDate,
                        reportingTime: booking.hours + ':' + booking.minutes + ':' + '00',
                        releavingDate: relDate,
                        releavingTime: booking.tohours + ':' + booking.tominutes + ':' + '00',
                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        //console.log('invoice A:' + JSON.stringify(s));

                         var obj = {
                            "bookingId": booking.bookingId,
                            "requestFrom": "ADMIN_OFF",
                            "offDutyDate": relDate,
                            "offDutyTime": relTime,
                            "distanceBetweenPickupAndDrop":returnFarekm
                        };
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated invoices successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;
                        }).
                        error(function(error) {
                            console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                        });



                    }, function(e) {
                        console.log('error:' + JSON.stringify(e));

                        if (e.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;

                    });
                }, function(error) {
                    console.log('booking error' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                })

            }

        }
    };


    var bookingHistoryLineUpBookingCtrl = function($scope, $rootScope, $modalInstance, $state) {

        $scope.searchDriver = false;

        if ($rootScope.fetchedBookingDetails.status == 'Line Up') {
            $scope.allocateDriver = true;
            $rootScope.cancelButton1 = true;
            $rootScope.offDutyFlag1 = false;
            $rootScope.cashButton = false;
            $rootScope.cashButton1 = false;
            $rootScope.cashButton2 = false;
            $rootScope.startDutyFlag1 = true;
        } else if ($rootScope.fetchedBookingDetails.status == 'On Duty') {
            $rootScope.cashButton = false;
            $rootScope.cashButton1 = false;
            $rootScope.cashButton2 = false;
            $scope.allocateDriver = false;
            $rootScope.cancelButton1 = false;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = true;
        } else if ($rootScope.fetchedBookingDetails.status == 'New Booking') {
            $scope.allocateDriver = true;
            $rootScope.cancelButton1 = true;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = false;

        } else if ($rootScope.fetchedBookingDetails.status == 'Done') {
            $scope.allocateDriver = false;
            $rootScope.cashButton = true;
            $rootScope.cashButton1 = true;
            $rootScope.cashButton2 = true;
            $rootScope.cancelButton1 = false;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = false;

        } else {
            $scope.allocateDriver = false;
            $rootScope.cashButton = false;
            $rootScope.cashButton1 = false;
            $rootScope.cashButton2 = false;
            $rootScope.cancelButton1 = false;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = false;
        }
        $scope.confirmPaymentMethod1 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton1 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Online.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod1();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton1 = false;
            }
        }
        $scope.bookingHistoryDetails = function(booking) {

            // $rootScope.data = $rootScope.bookingDetailsData;
 
            // $scope.historyDetails()
             $rootScope.bookinghist = booking;
             var modalInstance = $modal.open({
                 templateUrl: '/bookingHistoryDetails.html',
                 controller: bookingHistoryDetailsCtrl
             });
             //historyDetails(booking);
         
             var state = $('#modal-state');
             modalInstance.result.then(function() {
                 state.text('Modal dismissed with OK status');
             }, function() {
                 state.text('Modal dismissed with Cancel status');
             });
         };

        $scope.confirmPaymentMethod2 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton2 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Cash By Office.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod2();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton2 = false;

            }
        }
        $scope.confirmPaymentMethod3 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton3 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Cash By Driver.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod3();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton3 = false;

            }
        }
        $scope.savePaymentMethod1 = function() {
            $rootScope.loader = 1;

            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'O',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));
                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else {
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                }



            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton1 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

        }

        $scope.savePaymentMethod2 = function() {
            $rootScope.loader = 1;

            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'C',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));

                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else {
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                }


            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton2 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });


        }


        $scope.savePaymentMethod3 = function() {
            $rootScope.loader = 1;

            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'D',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));

                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else {
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                }


            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton3 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

        }
        $scope.CancelBookingPopUp = function() {

            //console.log('cancelBooking popup');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: bookingHistoryLineUpBookingCtrl
            });

        }



           $scope.bookingHistorySubmitCancellationReason = function(cancelationReason, comment) {
            $rootScope.loader = 1;
            ConUsers.findById({
                    id: $rootScope.userId
                },
                function(ConUsers) {

                    $scope.Aname = ConUsers.firstName + ' ' + ConUsers.lastName;
                    var cancelName = 'Booking cancelled by ' + $scope.Aname + ' on ';

                    Bookings.cancelBookingForAdmin({
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.bookingHistoryCancelationReasons.comment + ' ' + cancelName,
                            userId: $rootScope.userId
                        },

                        function(response) {
                           
                             if (response[0].booking_status === 'Cancelled') {
                                var cancelData = $rootScope.lineupBookingDetails;
                               $scope.opcity = response[0].operation_city;
                                cancelCustomerSMS(cancelData, $scope.opcity);
                                $.notify('This duty has been cancelled successfully.', {
                                    status: 'success'
                                });
                            } else if (response[0].booking_status === 'On Duty') {
                                $.notify('This duty has already started', {
                                    status: 'danger'
                                });
                            } else if (response[0].booking_status === 'Done') {
                                $.notify('This duty has already done ', {
                                    status: 'danger'
                                });
                            } else if (response[0].booking_status === 'Paid') {
                                $.notify('This duty has already paid', {
                                    status: 'danger'
                                });
                            }else {

                            }
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;

                        },
                        function(er) {
                            console.log('error in cancellation of booking:' + JSON.stringify(er));
                            if (er.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;

                        });
                },
                function(error) {

                    $rootScope.loader = 0;
                });

        }

       function cancelCustomerSMS(cancelData, opcity) {
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            //var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            var msg ='Hi ' + cancelData.bookingFirstName + ', your booking Id: ' + $rootScope.lineupBookingDetails.bookingId + 'reporting date '+ rptDate+' time '+cnumber+' has been cancelled. please reach us on 020-67641000 or info@indian-drivers.com..'
ConUsers.sendSMS({
        mobileNumber: cancelData.bookingCellNumber,
                msg: msg
                }, function(mgssuccess) {
                        cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

                   
                                },function(r){
                    });

            
        };

        function cancelDriverSMS(cancelData, opcity) {
              Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            //var msg = 'Your duty dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var msg = 'Hi ' + cancelData.driverFirstName +', Duty details assigned to you, booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ' reporting date ' + rptDate +' time ' + cancelData.reportingTime +' has been cancelled. please reach us on 020-67641000 or info@indian-drivers.com..'
ConUsers.sendSMS({
        mobileNumber: cancelData.driverContact,
                msg: msg
                }, function(mgssuccess) {
                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                 },function(r){
                    });
           
        };
        $scope.monitorStartDutyDate = function() {
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/StartDutyDatePopup.html',
                controller: bookingHistoryLineUpBookingCtrl
            });
        };

        $scope.monitorOffDutyDate = function(booking) {
             $rootScope.cityForOffDuty = booking.operationCity;
            $rootScope.dutyType = booking.dutyType;
            $rootScope.journeyType = booking.journeyType;
            $rootScope.offDutyAddress = booking.bookingToLocation;
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/OffDutyDatePopup.html',
                controller: bookingHistoryLineUpBookingCtrl
            });
        };
        $scope.startDuty = function(booking) {
            //var url = 'http://192.168.1.18:3000';
            var url = 'http://65.0.186.134:3000';
            //var url = 'http://18.220.250.238:3000';
            $scope.isDisabledButton = true;
            var returnFarekm=0;
            if (booking.dutyType == 'Outstation' && booking.journeyType == 'One Way') {
               
                        returnFarekm = (booking.returnFarekm);
                   
            }
            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            $rootScope.loader = 1;
            var currentDate = new Date();
            var startDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var startDate1 = new Date(startDate);
            var count = 0;

            var reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';

            var h = addZero(currentDate.getHours());
            var m = addZero(currentDate.getMinutes());
            var s = addZero(currentDate.getSeconds());
            var currentTime = h + ':' + m + ':' + s;
            var currentDate1 = moment(currentDate).format('YYYY-MM-DD');

            if (startDate1 > currentDate) {
                document.getElementById("bookingReportingDate").style.borderBottom = "1px solid red";
                document.getElementById("bookingReportingDate1").innerHTML = 'Not able to start future duty';

                count++;
            } else {
                document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingReportingDate1").innerHTML = '';

            }

            if (startDate === currentDate1) {
                if (booking.hours > h) {
                    document.getElementById("hours").style.borderBottom = "1px solid red";
                    document.getElementById("minutes").style.borderBottom = "1px solid red";
                    document.getElementById("reportingTime1").innerHTML = 'Not able to start future duty';

                    count++;
                } else {
                    document.getElementById("hours").style.borderColor = "#dde6e9";
                    document.getElementById("minutes").style.borderColor = "#dde6e9";
                    document.getElementById("reportingTime1").innerHTML = '';

                }
            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
                var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD 00:00:00');
                $rootScope.currentBookingstart = booking;

                Bookings.startDutyForAdmin({
                    bookingId: $rootScope.lineupBookingDetails.bookingId,
                    driverId: $rootScope.lineupBookingDetails.oldDrvId,
                    reportingDate: rptDate,
                    reportingTime: rptTime,
                    updatedBy: $rootScope.userId
                }, function(startDutySuccess) {
                    //console.log('start duty success: ' + JSON.stringify(startDutySuccess));
                    if (startDutySuccess[0].start_duty_for_admin === '0') {
                        var obj = {
                            "bookingId": $rootScope.lineupBookingDetails.bookingId,
                            "requestFrom": "ADMIN_START",
                            "offDutyDate": null,
                            "offDutyTime": null,
                            "distanceBetweenPickupAndDrop":returnFarekm
                        };
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated invoices successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Duty has started successfully. ', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getSearchHistory();

                            $rootScope.offDutyFlag = true;
                            $rootScope.startDutyFlag = false;
                            $rootScope.loader = 0;
                        }).
                        error(function(error) {
                            console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                        });
                    } else if (startDutySuccess[0].start_duty_for_admin === 'On Duty') {
                        $modalInstance.dismiss('cancel');
                        $.notify('Duty has already been started. ', {
                            status: 'danger'
                        });

                        reloadFunc();
                        $rootScope.getSearchHistory();

                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0;
                    } else if (startDutySuccess[0].start_duty_for_admin === 'Done') {
                        $modalInstance.dismiss('cancel');
                        $.notify('Duty has already been completed. ', {
                            status: 'danger'
                        });
                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getSearchHistory();
                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0;
                    } else if (startDutySuccess[0].start_duty_for_admin === 'Paid') {
                        $modalInstance.dismiss('cancel');
                        $.notify('Duty has already been paid. ', {
                            status: 'danger'
                        });

                        reloadFunc();
                        $rootScope.getSearchHistory();
                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0;
                    }else if (startDutySuccess[0].start_duty_for_admin === 'Already On Duty on other Duty') {
                       $modalInstance.dismiss('cancel');
                        $.notify('Already On Duty on other Duty. ', {
                            status: 'danger'
                        });

                        reloadFunc();
                        $rootScope.getSearchHistory();

                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0; 
                    }


                }, function(startDutyError) {
                    console.log('start duty error: ' + JSON.stringify(startDutyError));
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                });

            }

        };

        $scope.bookingHistoryOffDuty = function(booking, offDutyAddress, journeyType) {
            $rootScope.loader = 1;
            $scope.isDisabled = true;
            var returnFarekm=0;
            if ($rootScope.lineupBookingDetails.dutyType == 'Outstation' && journeyType == 'One Way') {
               
                // returnFarekm = ($rootScope.lineupBookingDetails.returnFarekm);
                 var mapUrl1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + offDutyAddress + '&types=geocode&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
                 $http.post(mapUrl1).success(function(result1) {
                     if(result1.results.length>0){
                         dropLat = result1.results[0].geometry.location.lat;
                          dropLng = result1.results[0].geometry.location.lng;
                        
                     }
                  
                 var distancemap='https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + $rootScope.lineupBookingDetails.fromLat + ',' + $rootScope.lineupBookingDetails.fromLong + '&destinations=' + dropLat + ',' + dropLng + '&mode=driving&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
 $http.post(distancemap).success(function(resultresponce) {
 console.log('result' + JSON.stringify(resultresponce));
 if (resultresponce.rows[0].elements[0].status === 'NOT_FOUND') {
   
      dropLat = $rootScope.lineupBookingDetails.fromLat;
      dropLng = $rootScope.lineupBookingDetails.fromLong; 
 }
 if(dropLat!=null&&dropLng!=null){
 if (resultresponce.rows[0].elements[0].status === 'ZERO_RESULTS') {
     
       dropLat = $rootScope.lineupBookingDetails.fromLat;
       dropLng = $rootScope.lineupBookingDetails.fromLong; 
 } else {
     if(resultresponce['rows'][0]['elements'][0]['status']==='NOT_FOUND'){
      returnFarekm=0;
     }else{
         returnFarekm=Math.round((resultresponce['rows'][0]['elements'][0]['distance']['value'])/1000);
      }   
     }
     }
     function addZero(i) {
         if (i < 10) {
             i = "0" + i;
         }
         return i;
     }
     var count = 0;
     var currentDate = new Date();
 
     var h = addZero(currentDate.getHours());
     var m = addZero(currentDate.getMinutes());
     var s = addZero(currentDate.getSeconds());
     var currentTime = h + ':' + m + ':' + s;
     var currentDate1 = moment(currentDate).format('YYYY-MM-DD');
     var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('YYYY-MM-DD');
     var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
     var date1 = new Date(rptDate);
     date1.setHours($rootScope.lineupBookingDetails.hours);
     date1.setMinutes($rootScope.lineupBookingDetails.minutes);
    //var url = 'http://192.168.1.104:3000';
     var url = 'http://65.0.186.134:3000';
     //var url = 'http://43.240.67.79:3000';
 
     if (angular.isUndefined(booking) || booking === '' || booking === null) {
         if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
             if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                 document.getElementById("bookingToDate").style.borderColor = "red";
                 document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                 document.getElementById("bookingReleivingTime").style.borderColor = "red";
                 document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                 count++;
                 $scope.isDisabled = false;
             } else {
                 document.getElementById("bookingToDatelocal").style.borderColor = "red";
                 document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                 document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                 document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                 $scope.isDisabled = false;
                 count++;
 
             }
         }
     } else {
         if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
             if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                 if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                     document.getElementById("bookingToDate").style.borderColor = "red";
                     document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                     document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                     document.getElementById("bookingReleivingTime1").innerHTML = '';
                     count++;
                     $scope.isDisabled = false;
                 } else if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null || angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                     document.getElementById("bookingReleivingTime").style.borderColor = "red";
                     document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                     document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                     document.getElementById("bookingToDate1").innerHTML = '';
                     count++;
                     $scope.isDisabled = false;
                 } else {
                     document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                     document.getElementById("bookingToDate1").innerHTML = '';
                     document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                     document.getElementById("bookingReleivingTime1").innerHTML = '';
                     $scope.isDisabled = true;
                     var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                     var relTime1 = booking.tohours + ':' + booking.tominutes + ':' + '00';
                     var date2 = new Date(relDate);
                     date2.setHours(booking.tohours);
                     date2.setMinutes(booking.tominutes);
                     if (date2 < date1) {
                         document.getElementById("bookingToDate").style.borderColor = "red";
                         document.getElementById("bookingReleivingTime").style.borderColor = "red";
                         document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                         booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                         count++;
                     } else if (date2.getTime() === date1.getTime()) {
                         var hour, minute, hours, minutes;
 
                         hour = parseInt(relTime1.split(":")[0]);
                         hours = parseInt(rptTime.split(":")[0]);
 
                         minute = parseInt(relTime1.split(":")[1]);
                         minutes = parseInt(rptTime.split(":")[1]);
 
                         var rptDay = new Date(rptDate);
                         var givenDate = new Date(relDate);
                         givenDate.setHours(hour);
                         givenDate.setMinutes(minute);
                         rptDay.setHours(hours);
                         rptDay.setMinutes(minutes);
 
                         if (givenDate < rptDay) {
                             document.getElementById("bookingToDate").style.borderColor = "red";
                             document.getElementById("bookingReleivingTime").style.borderColor = "red";
                             document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                             booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                             count++;
 
                         }  else {
                             document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                             document.getElementById("bookingReleivingTime1").innerHTML = '';
                             // booking.bookingToDate1local = null;
                         }
                             if(journeyType !== 'One Way'){
                               if (givenDate > currentDate) {
                             document.getElementById("bookingReleivingTime").style.borderColor = "red";
                             document.getElementById("bookingReleivingTime1").innerHTML = 'Not able to Off future duty';
                             booking.bookingReleivingTime1local = 'Not able to Off future duty';
                             count++;
                         }else {
                             document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                             document.getElementById("bookingReleivingTime1").innerHTML = '';
                             // booking.bookingToDate1local = null;
                         }  
                             }
                          
 
 
                     } else {
                         document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                         document.getElementById("bookingToDate1").innerHTML = '';
                         booking.bookingToDate1 = null;
 
                     }
 
                      if(journeyType !== 'One Way'){
                        if (date2 > currentDate) {
                         document.getElementById("bookingToDate").style.borderBottom = "1px solid red";
                         document.getElementById("bookingToDate1").innerHTML = 'Not able to Off future date duty';
 
                         count++;
                     } else {
                         document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                         document.getElementById("bookingToDate1").innerHTML = '';
                         booking.bookingToDate1 = null;
 
                     } 
                      }
                 }
 
             } else {
 
                 if (angular.isUndefined(booking.toDate) || booking.toDate === '' || booking.toDate === null) {
                     document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                     document.getElementById("bookingReleivingTime1local").innerHTML = '';
                     document.getElementById("bookingToDatelocal").style.borderColor = "red";
                     document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                     count++;
                     $scope.isDisabled = false;
                 } else if (angular.isUndefined(booking.tohour1) || booking.tohour1 === '' || booking.tohour1 === null || angular.isUndefined(booking.tomin1) || booking.tomin1 === '' || booking.tomin1 === null) {
                     document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                     document.getElementById("bookingToDate1local").innerHTML = '';
                     document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                     document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                     count++;
                     $scope.isDisabled = false;
                 } else {
                     document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                     document.getElementById("bookingToDate1local").innerHTML = '';
                     document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                     document.getElementById("bookingReleivingTime1local").innerHTML = '';
                     $scope.isDisabled = true;
                     var relDate1 = moment(booking.toDate).format('YYYY-MM-DD');
                     var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                     var date3 = new Date(relDate1);
                     date3.setHours(booking.tohour1);
                     date3.setMinutes(booking.tomin1);
                     if (date3 < date1) {
                         document.getElementById("bookingToDatelocal").style.borderColor = "red";
                         document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                         document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                         booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                         count++;
                     } else if (date3.getTime() == date1.getTime()) {
                         var hour, minute, hours, minutes;
 
                         hour = parseInt(relTime.split(":")[0]);
                         hours = parseInt(rptTime.split(":")[0]);
 
                         minute = parseInt(relTime.split(":")[1]);
                         minutes = parseInt(rptTime.split(":")[1]);
 
                         var rptDay = new Date(rptDate);
                         var givenDate = new Date(relDate1);
                         givenDate.setHours(hour);
                         givenDate.setMinutes(minute);
                         rptDay.setHours(hours);
                         rptDay.setMinutes(minutes);
 
                         if (givenDate < rptDay) {
                             document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                             document.getElementById("bookingToDatelocal").style.borderColor = "red";
                             document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                             booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                             count++;
 
                         }else if (givenDate > currentDate) {
                             document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                             document.getElementById("bookingReleivingTime1local").innerHTML = 'Not able to Off future duty';
                             booking.bookingReleivingTime1local = 'Not able to Off future duty';
                             count++;
                         }   else {
                             document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                             document.getElementById("bookingReleivingTimelocal").innerHTML = '';
                         }
 
                     } else if (date3 > currentDate) {
                         document.getElementById("bookingToDatelocal").style.borderBottom = "1px solid red";
                         document.getElementById("bookingToDate1local").innerHTML = 'Not able to Off future date duty';
                         count++;
                     } else {
                         document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                         document.getElementById("bookingToDate1local").innerHTML = '';
                     }
                 }
             }
         }
 
     }
     if (angular.isUndefined(offDutyAddress) || offDutyAddress === '' || offDutyAddress === null) {
         document.getElementById("bookingToLocation").style.borderColor = "red";
         document.getElementById("bookingToLocation1").innerHTML = '*required';
         $scope.isDisabled = false;
         count++;
     } else {
         document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
         document.getElementById("bookingToLocation1").innerHTML = '';
     }
     if (count > 0) {
         $scope.count = count;
         $scope.isDisabled = false;
         $rootScope.loader = 0;
         return false;
     } else {
 
         $scope.count = 0;
         $rootScope.currentBookingoff1 = booking;
         if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
             if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
 
                 var offDutyDate = moment(booking.toDate).format('YYYY-MM-DD');
                 var offDutyTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                 $scope.travelTime = null;
             } else {
                 var travelTimeRelMin = ((parseInt(booking.tohours) * 60) + parseInt(booking.tominutes));
                 var travelTimeRepMin = ((parseInt($rootScope.lineupBookingDetails.hours) * 60) + parseInt($rootScope.lineupBookingDetails.minutes));
                 $scope.travelTime = (travelTimeRelMin - travelTimeRepMin);
                 var offDutyTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                 var offDutyDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
             }
         }
         var obj = {
             "bookingId": $rootScope.lineupBookingDetails.bookingId,
             "requestFrom": "ADMIN_OFF",
             "offDutyDate": offDutyDate,
             "offDutyTime": offDutyTime,
             "distanceBetweenPickupAndDrop":returnFarekm
         };
         if(journeyType === 'One Way'){
            // console.log(dropLat1);
            // console.log(dropLong1); 
             Bookings.offDutyForAdmin({
                 bookingId: $rootScope.lineupBookingDetails.bookingId,
                 totalTravelTime: $scope.travelTime,
                 releivingDate: offDutyDate,
                 releivingTime: offDutyTime,
                 dropLocation: offDutyAddress,
                 dropLat: dropLat,
                 dropLong: dropLng,
                 updatedBy: $rootScope.userId
             }, function(offDutySuccess) {
                 //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                 $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                 success(function(result) {
                     //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                     if (result.length > 0) {
                         $rootScope.offDutyFlag = false;
                         $rootScope.startDutyFlag = true;
                         $scope.billedAmount = result[0].amount;
                         sendSmsToCustomerAtOff(booking);
                         sendSmsToDriverAtOff(booking);
                         $modalInstance.dismiss('cancel');
                         reloadFunc();
                         $rootScope.getBookings();
                         $rootScope.loader = 0;
                     }
 
                 }).
                 error(function(error) {
                     console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                     $scope.isDisabled = false;
                     $modalInstance.dismiss('cancel');
                     $rootScope.loader = 0;
                 });
 
             }, function(offDutyError) {
                 console.log('offDutyError' + JSON.stringify(offDutyError));
                 $scope.isDisabled = false;
                 $modalInstance.dismiss('cancel');
                 $rootScope.loader = 0;
             });
              $scope.isDisabled = false;
              
             
               
         }else{
             var dropLat1 = 0;
             var dropLong1 = 0; 
             Bookings.offDutyForAdmin({
                 bookingId: $rootScope.lineupBookingDetails.bookingId,
                 totalTravelTime: $scope.travelTime,
                 releivingDate: offDutyDate,
                 releivingTime: offDutyTime,
                 dropLocation: offDutyAddress,
                 dropLat: dropLat1,
                 dropLong: dropLong1,
                 updatedBy: $rootScope.userId
             }, function(offDutySuccess) {
                 //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                 $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                 success(function(result) {
                     //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                     if (result.length > 0) {
                         $rootScope.offDutyFlag = false;
                         $rootScope.startDutyFlag = true;
                         $scope.billedAmount = result[0].amount;
                         sendSmsToCustomerAtOff(booking);
                         sendSmsToDriverAtOff(booking);
                         $modalInstance.dismiss('cancel');
                         reloadFunc();
                         $rootScope.getBookings();
                         $rootScope.loader = 0;
                     }
 
                 }).
                 error(function(error) {
                     console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                     $scope.isDisabled = false;
                     $modalInstance.dismiss('cancel');
                     $rootScope.loader = 0;
                 });
 
             }, function(offDutyError) {
                 console.log('offDutyError' + JSON.stringify(offDutyError));
                 $scope.isDisabled = false;
                 $modalInstance.dismiss('cancel');
                 $rootScope.loader = 0;
             });
         }
         
 
             
 
        
     }
 
     
 }).error(function(error) {
     console.log('error' + JSON.stringify(error));
     $scope.isDisabledButton = false;
     $modalInstance.dismiss('cancel');
     $rootScope.loader = 0;
    });
 
 }).error(function(error) {
      console.log('error' + JSON.stringify(error));
      $scope.isDisabledButton = false;
      if (error == null) {
          window.alert('Oops! You are disconnected from server.');
          $state.go('page.login');
      }
      $modalInstance.dismiss('cancel');
      $rootScope.loader = 0;
  });
               
         
         }else{
            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            var count = 0;
            var currentDate = new Date();
            var h = addZero(currentDate.getHours());
            var m = addZero(currentDate.getMinutes());
            var s = addZero(currentDate.getSeconds());
            var currentTime = h + ':' + m + ':' + s;
            var currentDate1 = moment(currentDate).format('YYYY-MM-DD');
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var date1 = new Date(rptDate);
            date1.setHours($rootScope.lineupBookingDetails.hours);
            date1.setMinutes($rootScope.lineupBookingDetails.minutes);
            //var url = 'http://192.168.2.23:3000';
            var url = 'http://65.0.186.134:3000';
            //var url = 'http://18.220.250.238:3000';
            //console.log('offDuty booking' + JSON.stringify(booking));

            if (angular.isUndefined(booking) || booking === '' || booking === null) {
                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                        document.getElementById("bookingReleivingTime").style.borderColor = "red";
                        document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                        count++;
                        $scope.isDisabled = false;
                    } else {
                        document.getElementById("bookingToDatelocal").style.borderColor = "red";
                        document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                        document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                        document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                        $scope.isDisabled = false;
                        count++;

                    }
                }
            } else {
                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                        if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                            document.getElementById("bookingToDate").style.borderColor = "red";
                            document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                            document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1").innerHTML = '';
                            count++;
                            $scope.isDisabled = false;
                        } else if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null || angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                            document.getElementById("bookingReleivingTime").style.borderColor = "red";
                            document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                            document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1").innerHTML = '';
                            count++;
                            $scope.isDisabled = false;
                        } else {
                            document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1").innerHTML = '';
                            document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1").innerHTML = '';
                            $scope.isDisabled = true;
                            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                            var relTime1 = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            var date2 = new Date(relDate);
                            date2.setHours(booking.tohours);
                            date2.setMinutes(booking.tominutes);
                            if (date2 < date1) {

                                document.getElementById("bookingToDate").style.borderColor = "red";
                                document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                count++;
                            } else if (date2.getTime() === date1.getTime()) {
                                var hour, minute, hours, minutes;

                                hour = parseInt(relTime1.split(":")[0]);
                                hours = parseInt(rptTime.split(":")[0]);

                                minute = parseInt(relTime1.split(":")[1]);
                                minutes = parseInt(rptTime.split(":")[1]);

                                var rptDay = new Date(rptDate);
                                var givenDate = new Date(relDate);
                                givenDate.setHours(hour);
                                givenDate.setMinutes(minute);
                                rptDay.setHours(hours);
                                rptDay.setMinutes(minutes);

                                if (givenDate < rptDay) {

                                    document.getElementById("bookingToDate").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                    document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    count++;
                                }  else {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTime1").innerHTML = '';
                                    // booking.bookingToDate1local = null;
                                }
                                    if(journeyType !== 'One Way'){
                                if (givenDate > currentDate) {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime1").innerHTML = 'Not able to Off future duty';
                                    booking.bookingReleivingTime1local = 'Not able to Off future duty';
                                    count++;
                                } else {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTime1").innerHTML = '';
                                    // booking.bookingToDate1local = null;
                                }}

                                


                            }   else {
                                document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                                document.getElementById("bookingToDate1").innerHTML = '';
                                booking.bookingToDate1 = null;

                            }
                            if(journeyType !== 'One Way'){
                                     if (date2 > currentDate) {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime1").innerHTML = 'Not able to Off future duty';
                                    booking.bookingReleivingTime1local = 'Not able to Off future duty';
                                    count++;
                                }else {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTime1").innerHTML = '';
                                    // booking.bookingToDate1local = null;
                                }
                                }
                        }

                    } else {

                        if (angular.isUndefined(booking.toDate) || booking.toDate === '' || booking.toDate === null) {
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1local").innerHTML = '';
                            document.getElementById("bookingToDatelocal").style.borderColor = "red";
                            document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                            count++;
                            $scope.isDisabled = false;
                        } else if (angular.isUndefined(booking.tohour1) || booking.tohour1 === '' || booking.tohour1 === null || angular.isUndefined(booking.tomin1) || booking.tomin1 === '' || booking.tomin1 === null) {
                            document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1local").innerHTML = '';
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                            document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                            count++;
                            $scope.isDisabled = false;
                        } else {
                            document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1local").innerHTML = '';
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1local").innerHTML = '';
                            $scope.isDisabled = true;
                            var relDate1 = moment(booking.toDate).format('YYYY-MM-DD');
                            var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                            var date3 = new Date(relDate1);
                            date3.setHours(booking.tohour1);
                            date3.setMinutes(booking.tomin1);
                            if (date3 < date1) {
                                document.getElementById("bookingToDatelocal").style.borderColor = "red";
                                document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                count++;
                            } else if (date3.getTime() == date1.getTime()) {
                                var hour, minute, hours, minutes;

                                hour = parseInt(relTime.split(":")[0]);
                                hours = parseInt(rptTime.split(":")[0]);

                                minute = parseInt(relTime.split(":")[1]);
                                minutes = parseInt(rptTime.split(":")[1]);

                                var rptDay = new Date(rptDate);
                                var givenDate = new Date(relDate1);
                                givenDate.setHours(hour);
                                givenDate.setMinutes(minute);
                                rptDay.setHours(hours);
                                rptDay.setMinutes(minutes);

                                if (givenDate < rptDay) {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                    document.getElementById("bookingToDatelocal").style.borderColor = "red";
                                    document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    count++;
                                } else if (givenDate > currentDate) {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime1local").innerHTML = 'Not able to Off future duty';
                                    booking.bookingReleivingTime1local = 'Not able to Off future duty';
                                    count++;
                                } else {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTimelocal").innerHTML = '';
                                    
                                }

                            } else if (date3 > currentDate) {
                                document.getElementById("bookingToDatelocal").style.borderBottom = "1px solid red";
                                document.getElementById("bookingToDate1local").innerHTML = 'Not able to Off future date duty';

                                count++;
                            } else {
                                document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                                document.getElementById("bookingToDate1local").innerHTML = '';
                                
                            }
                        }
                    }
                }



            }
            if (angular.isUndefined(offDutyAddress) || offDutyAddress === '' || offDutyAddress === null) {
                document.getElementById("bookingToLocation").style.borderColor = "red";
                document.getElementById("bookingToLocation1").innerHTML = '*required';
                $scope.isDisabled = false;
                count++;
            } else {
                document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                document.getElementById("bookingToLocation1").innerHTML = '';
                
            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabled = false;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                $rootScope.currentBookingoff1 = booking;

                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                        var offDutyDate = moment(booking.toDate).format('YYYY-MM-DD');
                        var offDutyTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                        $scope.travelTime = null;
                    } else {
                        var travelTimeRelMin = ((parseInt(booking.tohours) * 60) + parseInt(booking.tominutes));
                        var travelTimeRepMin = ((parseInt($rootScope.lineupBookingDetails.hours) * 60) + parseInt($rootScope.lineupBookingDetails.minutes));
                        $scope.travelTime = (travelTimeRelMin - travelTimeRepMin);
                        var offDutyTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                        var offDutyDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                    }
                }

                var obj = {
                    "bookingId": $rootScope.lineupBookingDetails.bookingId,
                    "requestFrom": "ADMIN_OFF",
                    "offDutyDate": offDutyDate,
                    "offDutyTime": offDutyTime,
                    "distanceBetweenPickupAndDrop":returnFarekm
                };
                if(journeyType === 'One Way'){
                     var dropLat1 =0;
                    var dropLong1 = 0;
                    Bookings.offDutyForAdmin({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        totalTravelTime: $scope.travelTime,
                        releivingDate: offDutyDate,
                        releivingTime: offDutyTime,
                        dropLocation: offDutyAddress,
                        dropLat: dropLat1,
                        dropLong: dropLong1,
                        updatedBy: $rootScope.userId
                    }, function(offDutySuccess) {
                        //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            if (result.length > 0) {
                                $rootScope.offDutyFlag = false;
                                $rootScope.startDutyFlag = true;
                                $scope.billedAmount = result[0].amount;
                                sendSmsToCustomerAtOff(booking);
                                sendSmsToDriverAtOff(booking);
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getSearchHistory();
                                $rootScope.loader = 0;
                            }

                        }).
                        error(function(error) {
                            
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                            $scope.isDisabled = false;
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });

                    }, function(offDutyError) {
                        console.log('offDutyError' + JSON.stringify(offDutyError));
                        $scope.isDisabled = false;
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });
                    
                }else{
                    var dropLat1 = 0;
                    var dropLong1 = 0;
                    Bookings.offDutyForAdmin({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        totalTravelTime: $scope.travelTime,
                        releivingDate: offDutyDate,
                        releivingTime: offDutyTime,
                        dropLocation: offDutyAddress,
                        dropLat: dropLat1,
                        dropLong: dropLong1,
                        updatedBy: $rootScope.userId
                    }, function(offDutySuccess) {
                        //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            if (result.length > 0) {
                                $rootScope.offDutyFlag = false;
                                $rootScope.startDutyFlag = true;
                                $scope.billedAmount = result[0].amount;
                                sendSmsToCustomerAtOff(booking);
                                sendSmsToDriverAtOff(booking);
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getSearchHistory();
                                $rootScope.loader = 0;
                            }

                        }).
                        error(function(error) {
                            
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                            $scope.isDisabled = false;
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });

                    }, function(offDutyError) {
                        console.log('offDutyError' + JSON.stringify(offDutyError));
                        $scope.isDisabled = false;
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });

                }
               
                    
                    
                
            }
         }
            
        };
     
         function sendSmsToCustomerAtOff(booking) {

           

            if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.toDate).format('DD-MM-YYYY');
                    var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.bookingToDate).format('DD-MM-YYYY');
                    var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';

                }
            }

            var customerName = $rootScope.lineupBookingDetails.bookingFirstName;
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.cityForOffDuty
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                               // var msg = 'Dear ' + customerName + ',%0aYour Duty(ID: ' + $rootScope.lineupBookingDetails.bookingId + ') %0aStarted on: ' + rptDate + ' @ ' + rptTime + '%0aEnded on: ' + endDate + ' @ ' + relTime + '%0aTotal billed amount: Rs.' + Math.round($scope.billedAmount) + '/-. %0aFor details download app (https://goo.gl/XFPFwh). For inquiries call '+ cnumber +'. %0aThank you, %0aIndian Drivers.';
         
           var msg = '\'Dear ' + customerName + ', Your Duty(ID: ' + $rootScope.lineupBookingDetails.bookingId + ') Started on: ' + rptDate + ' @ ' + rptTime + ' Ended on: ' + endDate + ' @ ' + relTime + ' Total billed amount Rs.' + Math.round($scope.billedAmount) + ' plus Rs.100 travel allowance if reporting or relieving between 10pm to 5:45am. For details download app (https://goo.gl/XFPFwh). %0aThank you, Indian Drivers '+ cnumber +'.';
          $scope.msg1 ='Dear ' + customerName + ',%0a Hope you had pleasant and safe journey by our Driver %0a %0a Kindly review us on google %0a %0a https://g.co/kgs/yqtAm3  %0a %0a Thanks,%0a Indian Drivers %0a 02067641000';
            $scope.num = $rootScope.lineupBookingDetails.bookingCellNumber;
ConUsers.sendSMS({
mobileNumber: $rootScope.lineupBookingDetails.bookingCellNumber,
                msg: msg
                }, function(mgssuccess) {
                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

                                 },function(r){
                    });

       
            

        }

         function sendthanksmessage(msg,num) {
         
         ConUsers.sendSMS({
mobileNumber: num,
                msg: msg
                }, function(mgssuccess) {
                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                 

        }
        function sendSmsToDriverAtOff(booking) {

            Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.cityForOffDuty
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.toDate).format('DD-MM-YYYY');
                    var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.bookingToDate).format('DD-MM-YYYY');
                    var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';

                }
            }

            var driverName = $rootScope.lineupBookingDetails.driverFirstName;
            var msg = 'Hi ' + driverName + ',%0a Your journey started on: ' + rptDate + ' ' + rptTime + ' and ended at : ' + endDate + ' ' + relTime + ' of booking Id: ' + $rootScope.lineupBookingDetails.bookingId + '. Thanks for your association with Indian-Drivers. For any query or concern, please contact us on '+ cnumber +' or info@indian-drivers.com.';


         ConUsers.sendSMS({
mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                msg: msg
                }, function(mgssuccess) {
                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
               
                                },function(r){
                    });
            
        }


        $scope.lineUpmobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $rootScope.newDrvId1 = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.newCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
                $rootScope.reallocateDetails = $scope.search.mobileNumber;

            }
        };

         $rootScope.allocateNewDriverFunction = function() {
            $scope.isDisabled = true;
            $rootScope.loader = 1;
            $scope.uid = $localStorage.get('userId');
            Bookings.acceptDuty({
                driverId: $rootScope.newDrvId1,
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                oldDriverId: $rootScope.lineupBookingDetails.oldDrvId
            }, function(dutyReport) {
                //console.log('driver report' + JSON.stringify(dutyReport));
                if ((dutyReport[0].accept_duty == 'Already Allocated to other duty on the same day') || (dutyReport[0].accept_duty == 'Allocation Error')) {
                    
                    window.alert("Driver already allocated.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Allocation Error') {
                    
                    window.alert("This booking is not valid any more.");
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Please Recharge Your Account to Accept this Duty') {
                    
                    window.alert("Please Recharge Driver Account to Assign this Duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Account Error') {
                    
                    window.alert("Driver account does not exist."); //simple alert
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Driver Block') {
                    
                    window.alert("The Driver is not active to allocate this duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Please complete your lineup duty') {
                    
                    window.alert("Please complete your lineup duty.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expired') {
                    
                    window.alert("License of this Driver is expired.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Kindly Update Your License') {
                    
                    window.alert("Please update driver license date.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Driver  blocked for this customer') {
                    console.log('driver blocked');
                    window.alert("This driver is blocked for this customer.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expire Soon') {
                    window.alert("License of this Driver will expire soon.");
                    $.notify('Driver ID: ' + $rootScope.newDrvId1 + ' has been allocated to booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    
                    driverReallocateSMS();
                   
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        driverId: $rootScope.lineupBookingDetails.oldDrvId,
                        userId: $scope.uid,
                        allocationStatus: 'Deallocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));
                        DriverAllocationReport.createAllocationHistory({
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                            driverId: $rootScope.newDrvId1,
                            userId: $scope.uid,
                            allocationStatus: 'Allocation'
                        }, function(success) {
                            console.log('created allocation successfully' + JSON.stringify(success));
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;
                            $scope.isDisabled = false;
                            $rootScope.newDrvId1 = undefined;
                            $rootScope.lineupBookingDetails.oldDrvId = undefined;
                            $rootScope.lineupBookingDetails.bookingId = undefined;
                        }, function(error) {
                            console.log('created allocation error' + JSON.stringify(error));
                        });
                    }, function(error) {
                        console.log('created allocation error' + JSON.stringify(error));
                    });
                } else if (dutyReport[0].accept_duty == 'Accepted') {
                    $.notify('Driver ID: ' + $rootScope.newDrvId1 + ' has been allocated to booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    
                    driverReallocateSMS();
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        driverId: $rootScope.lineupBookingDetails.oldDrvId,
                        userId: $scope.uid,
                        allocationStatus: 'Deallocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));
                        DriverAllocationReport.createAllocationHistory({
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                            driverId: $rootScope.newDrvId1,
                            userId: $scope.uid,
                            allocationStatus: 'Allocation'
                        }, function(success) {
                            console.log('created allocation successfully' + JSON.stringify(success));
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;
                            $scope.isDisabled = false;
                            $rootScope.newDrvId1 = undefined;
                            $rootScope.lineupBookingDetails.oldDrvId = undefined;
                            $rootScope.lineupBookingDetails.bookingId = undefined;
                        }, function(error) {
                            console.log('created allocation error' + JSON.stringify(error));
                        });
                    }, function(error) {
                        console.log('created allocation error' + JSON.stringify(error));
                    });
                } else {
                    // do nothing
                }
            }, function(error) {
                console.log('error in accepting duty');
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
        }

        function driverReallocateSMS() {
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.driverFirstName + ',%0a Duty details assigned to you, booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', reporting date ' + rptDate + ' time ' + reportingTime + ' has been cancelled. Please contact customer desk for details.';

         ConUsers.sendSMS({
mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                msg: msg
                }, function(mgssuccess) {
            var newDriverSMS = $rootScope.reallocateDetails;
            customerSMS(newDriverSMS);

                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
               
                     };

         function customerSMS(newDriverSMS) {

             var opcity = $rootScope.allocateNewBookings.opCity;


             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.bookingFirstName + ',%0a Driver Name: ' + newDriverSMS.originalObject.driverName + ' (Contact Number: ' + newDriverSMS.originalObject.mobileNumber + ') ' + ' has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
mobileNumber: $rootScope.lineupBookingDetails.bookingCellNumber,
                msg: msg
                }, function(mgssuccess) {
             
             newdriverSMSFunction(newDriverSMS);
                       // cancelDriverSMS(cancelData, opcity);
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
         
                                },function(r){
                    });
            
        };

        function newdriverSMSFunction(newDriverSMS) {
            var relTime = $rootScope.lineupBookingDetails.tohours + ':' + $rootScope.lineupBookingDetails.tominutes + ':' + '00';
            var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';

            if (newDriverSMS.landmark === null) {
                var landmark = '';
            } else {
                var landmark = $rootScope.lineupBookingDetails.landmark + ', ';
            }

            if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                var relHour = ' Duty Hours ' + $rootScope.lineupBookingDetails.totalDuration;
            } else {
                var relDate = moment($rootScope.lineupBookingDetails.bookingToDate).format('DD-MM-YYYY');
                var relHour = ' Releiving on: ' + relDate + ' @ ' + relTime;
            }
            if ($rootScope.lineupBookingDetails.journeyType === 'Round Trip') {
                var dropadd = ' ';
            } else {
                var dropadd = ', Drop Address: ' + $rootScope.lineupBookingDetails.bookingToLocation;
            }
            var picadd = landmark + $rootScope.lineupBookingDetails.bookingFrmLocation;
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + newDriverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' Duty Type: ' + $rootScope.lineupBookingDetails.dutyType + ' ' + $rootScope.lineupBookingDetails.journeyType + ' Car Type: ' + $rootScope.lineupBookingDetails.carType + ' Dated on: ' + rptDate + ' @ ' + rptTime + relHour + ', Pickup address: ' + picadd + dropadd + ' Client Name: ' + $rootScope.lineupBookingDetails.bookingFirstName + '-' + $rootScope.lineupBookingDetails.bookingCellNumber;
             ConUsers.sendSMS({
mobileNumber: newDriverSMS.originalObject.mobileNumber,
                msg: msg
                }, function(mgssuccess) {
              
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
             
            
        };

        $scope.deallocateDriver = function() {
            $scope.isDisabled = true;
            $rootScope.loader = 1;
             $scope.uid = $localStorage.get('userId');
            Bookings.findById({
                id: $rootScope.lineupBookingDetails.bookingId
            }, function(success) {
                //console.log('booking : ' + JSON.stringify(success));
                if (success.status === 'Line Up') {
                    if (Number(success.driverId) === $rootScope.lineupBookingDetails.oldDrvId) {
                        Bookings.driverCancelDutyNew1({
                            driverId: $rootScope.lineupBookingDetails.oldDrvId,
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                             userId: $scope.uid
                        }, function(SuccessData) {
                            //console.log('driver deallocation success' + JSON.stringify(SuccessData));
                            $.notify('Driver removed successfully ', {
                                status: 'success'
                            });
                            driverDeallocateSMS2();
                            DriverAllocationReport.createAllocationHistory({
                                bookingId: parseInt($rootScope.lineupBookingDetails.bookingId),
                                driverId: $rootScope.lineupBookingDetails.oldDrvId,
                                userId: $scope.uid,
                                allocationStatus: 'Deallocation'
                            }, function(success) {
                                console.log('created allocation successfully' + JSON.stringify(success));
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getSearchHistory();
                                $rootScope.loader = 0;
                            }, function(error) {
                                console.log('created allocation error' + JSON.stringify(error));
                            });
                             
                        }, function(error) {
                            console.log('driver deallocation error' + JSON.stringify(error));
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });
                    } else {
                        window.alert('This duty is no more valid. Already cancelled and allocated to other driver.', 'Alert');
                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getSearchHistory();
                        $rootScope.loader = 0;
                    }
                } else if (success.status === 'New Booking') {
                    window.alert('This driver has already deallocated.', 'Alert');
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else if (success.status === 'On Duty') {
                    window.alert('This booking is already started, unable to remove driver.', 'Alert');
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                } else {
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getSearchHistory();
                    $rootScope.loader = 0;
                }
            }, function(error) {});
        }

        function driverDeallocateSMS2() {
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.driverFirstName + ',%0a Duty details assigned to you, booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', reporting date ' + rptDate + ' time ' + reportingTime + ' has been cancelled. Please contact customer desk for details.';
            ConUsers.sendSMS({
mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                msg: msg
                }, function(mgssuccess) {
              
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
             
        };

        $scope.getLineUpDriverMobile = function() {

            $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                 Bookings.getDriverList({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                operationCity:$rootScope.operationCitySelect
            }, function(driverData) {
                //console.log('driver Data' + JSON.stringify(driverData));
                $scope.driverList = [];

                for (var i = 0; i < driverData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';


                    if (!angular.isUndefined(driverData[i].mobile_number) || driverData[i].mobile_number !== '' || driverData[i].mobile_number !== null) {
                        mobNo = driverData[i].mobile_number;
                    }
                    if (!angular.isUndefined(driverData[i].first_name) || driverData[i].driverData !== '' || driverData[i].first_name !== null) {
                        firstName = driverData[i].first_name;
                    }
                    if (!angular.isUndefined(driverData[i].last_name) || driverData[i].last_name !== '' || driverData[i].last_name !== null) {
                        lastName = driverData[i].last_name;
                    }

                    $scope.driverList.push({
                        id: driverData[i].driver_id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        drvSearchData: firstName + ' ' + lastName + ' - ' + mobNo

                    });
                }


                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
            }else{


            Bookings.getDriverList({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                operationCity:$rootScope.operationCity
            }, function(driverData) {
                //console.log('driver Data' + JSON.stringify(driverData));
                $scope.driverList = [];

                for (var i = 0; i < driverData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';


                    if (!angular.isUndefined(driverData[i].mobile_number) || driverData[i].mobile_number !== '' || driverData[i].mobile_number !== null) {
                        mobNo = driverData[i].mobile_number;
                    }
                    if (!angular.isUndefined(driverData[i].first_name) || driverData[i].driverData !== '' || driverData[i].first_name !== null) {
                        firstName = driverData[i].first_name;
                    }
                    if (!angular.isUndefined(driverData[i].last_name) || driverData[i].last_name !== '' || driverData[i].last_name !== null) {
                        lastName = driverData[i].last_name;
                    }

                    $scope.driverList.push({
                        id: driverData[i].driver_id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        drvSearchData: firstName + ' ' + lastName + ' - ' + mobNo

                    });
                }


                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
        }

        };

        $scope.searchDrivers = function(dist) {
            $scope.driverData = $scope.allDriverData;
            var resultData = [];
            var distanceVal = parseInt(dist);
            for (var i = 0; i < $scope.driverData.length; i++) {
                if (parseInt($scope.driverData[i].distance) <= distanceVal) {
                    resultData.push($scope.driverData[i]);
                }
            }

            $scope.driverData = resultData;
        };
        var formatTime = (function() {
            function addZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }

            return function(dt) {
                var formatted = '';

                if (dt) {
                    var hours24 = dt.getHours();
                    var hours = ((hours24 + 11) % 12) + 1;
                    formatted = [formatted, [addZero(hours), addZero(dt.getMinutes())].join(":"), hours24 > 11 ? "pm" : "am"].join(" ");
                }
                return formatted.trim();
            }
        });
        $scope.getNumber = function(num) {
            return new Array(num);
        }
        $scope.getLineUpData = function() {
            $scope.isDisabled = false;
            $rootScope.loader = 1;
            //console.log('called get lineup booking ');
            if (angular.isDefined($rootScope.fetchedBookingDetails.bookingId) && $rootScope.fetchedBookingDetails.bookingId !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.fetchedBookingDetails.bookingId
                        },
                        include: [{
                            relation: 'customerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers',
                                }
                            }
                        }, {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers',
                                }
                            }
                        }, {
                            relation: 'localBookings'


                        }, {
                            relation: 'outstationBookings'


                        }, {
                            relation: 'invoices',
                            scope: {
                                include: {
                                    relation: 'invoiceDetails',
                                    scope: {
                                        include: {
                                            relation: 'invoiceSubHeads'
                                        }
                                    }
                                }
                            }


                        }, {
                            relation: 'bookingRating',
                            scope: {
                                include: {
                                    relation: 'bookingRatingDetails',
                                }
                            }
                        },{
                            relation:'driverAllocationReport',
                        }]

                    }
                }, function(bookingData) {
                    $scope.lineFare = bookingData;
                    //console.log('bookingData ' + JSON.stringify(bookingData));
                    if (angular.isDefined(bookingData) && bookingData !== null) {
                        var cityName;
                        var carType;
                        var dutyType;
                        var journeyType;
                        var releavingDate;
                        var releavingTime;
                        var releavingDate1;
                        var releavingTime1;
                        if (angular.isDefined(bookingData.localBookings) && bookingData.localBookings.length > 0) {
                            releavingDate1 = bookingData.invoices[0].releavingDate;
                            releavingTime1 = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime1.split(':');
                            var tohour1 = parseInt(arr[0]);
                            var tomin1 = parseInt(arr[1]);
                            var tosec1 = parseInt(arr[2]);
                            var toFormat1;
                            if (tohour1 < 10) {
                                tohour1 = '0' + tohour1;
                            }
                            if (tohour1 <= 12) {
                                toFormat1 = "AM";
                            } else {
                                toFormat1 = "PM";
                            }

                        }

                        if (angular.isDefined(bookingData.outstationBookings) && bookingData.outstationBookings.length > 0) {
                            cityName = bookingData.outstationBookings[0].cityName;
                            $rootScope.releavingTimeAtOffDuty = releavingTime;
                        }
                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = arr[1];
                            var tosec = parseInt(arr[2]);
                            var toFormat;
                            if (tohour < 10) {
                                tohour = '0' + tohour;
                            }
                            if (tohour <= 12) {
                                toFormat = "AM";
                            } else {
                                toFormat = "PM";
                            }


                        }

                        /*if (bookingData.status == 'Done') {
                            var relDate = moment(releavingDate).format('YYYY-MM-DD');
                            //var url = 'http://192.168.2.23:3000';
                            var url = 'http://52.32.39.44:3000';
                            var obj = {
                                "bookingId": bookingData.id,
                                "requestFrom": "ADMIN_OFF",
                                "offDutyDate": relDate,
                                "offDutyTime": releavingTime
                            };


                            $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                            success(function(result) {
                                //console.log('Updated Geolocation successfully' + JSON.stringify(result));

                            }).
                            error(function(error) {

                                console.log('Error in updating driver geolocation:' + JSON.stringify(error));

                            });
                        }*/

                        var bankName = '';
                        var settlementMode = '';

                        if (angular.isDefined(bookingData.settlementMode)) {
                            settlementMode = bookingData.settlementMode;
                        }

                        if (angular.isDefined(bookingData.settlementBankName)) {
                            bankName = bookingData.settlementBankName;
                        }

                        var reportingTime = bookingData.reportingTime;
                        var arr1 = reportingTime.split(':');
                        var fromhour = parseInt(arr1[0]);
                        var frommin = parseInt(arr1[1]);
                        var fromsec = parseInt(arr1[2]);
                        var fromFormat;
                        if (fromhour < 10) {
                            fromhour = '0' + fromhour;
                        }
                        if (fromhour <= 12) {
                            fromFormat = "AM";
                        } else {
                            fromFormat = "PM";
                        }


                        var carTypeText;
                        if (angular.isDefined(bookingData.carType)) {
                            if (bookingData.carType == 'A') {
                                carType = 'Automatic';
                                carTypeText = 'Automatic';
                            } else if (bookingData.carType == 'M') {
                                carType = 'Manual';
                                carTypeText = 'Manual';
                            } else {
                                carType = 'Luxury';
                                carTypeText = 'Luxury';
                            }

                        }
                        if (angular.isDefined(bookingData.isOutstation)) {
                            if (bookingData.isOutstation == true) {
                                dutyType = 'Outstation';
                            } else {
                                dutyType = 'Local';
                            }
                        }
                        if (angular.isDefined(bookingData.isRoundTrip)) {
                            if (bookingData.isRoundTrip == true) {
                                journeyType = 'Round Trip';
                            } else {
                                journeyType = 'One Way';
                            }
                        }

                        var travelDuration = '0';
                        var grossAmt = '0';
                        var netAmt = '0';
                        var invoiceType = '';
                        if (bookingData.invoices.length > 0) {
                            if (bookingData.invoices[0].totalTravelTime != null || bookingData.invoices[0].totalTravelTime != '' || (!angular.isUndefined(bookingData.invoices[0].totalTravelTime))) {
                                travelDuration = bookingData.invoices[0].totalTravelTime / 60;
                            }
                            if (bookingData.invoices[0].grossAmount != null || bookingData.invoices[0].grossAmount != '' || (!angular.isUndefined(bookingData.invoices[0].grossAmount))) {
                                grossAmt = bookingData.invoices[0].grossAmount;
                            }
                            if (bookingData.invoices[0].netAmount != null || bookingData.invoices[0].netAmount != '' || (!angular.isUndefined(bookingData.invoices[0].netAmount))) {
                                netAmt = bookingData.invoices[0].netAmount;
                            }
                            if (bookingData.invoices[0].invoiceType != null || bookingData.invoices[0].invoiceType != '' || (!angular.isUndefined(bookingData.invoices[0].invoiceType))) {
                                invoiceType = bookingData.invoices[0].invoiceType;
                            }
                        }

                        var drvShare;
                        var idShare;
                        if (angular.isDefined(bookingData.driverShare)) {
                            drvShare = bookingData.driverShare;
                        }

                        if (angular.isDefined(bookingData.idShare)) {
                            idShare = bookingData.idShare;
                        }

                        var paymentMode;
                        if (angular.isDefined(bookingData.paymentMethod) || bookingData.paymentMethod != null || bookingData.paymentMethod != '') {
                            if (bookingData.paymentMethod == 'O') {
                                paymentMode = 'Online';
                            } else if (bookingData.paymentMethod == 'C') {
                                paymentMode = 'Cash By Office';
                            } else {
                                paymentMode = 'Cash By Driver';
                            }
                        }

                        var returnFare = '0';
                        var returnFareText;
                        if (bookingData.isOutstation == true && bookingData.isRoundTrip == false) {
                            if (bookingData.outstationBookings.length > 0) {
                                if (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime) || bookingData.outstationBookings[0].returnTravelTime != null || bookingData.outstationBookings[0].returnTravelTime != '') {
                                    returnFare = (bookingData.outstationBookings[0].returnTravelTime).toFixed(2);
                                        returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime)-125).toFixed(2) + ' KM ' + '* 6)';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
                            returnFareText = ' ';
                        } else {
                            returnFare = '0';
                            returnFareText = ' ';
                        }
                        var returnTravelHours = '0';
                        var returnTime = '0';
                        if (bookingData.outstationBookings.length > 0) {
                            if (bookingData.outstationBookings[0].returnTravelTime != null && (!angular.isUndefined(bookingData.outstationBookings[0].returnTravelTime))) {
                                returnTime = bookingData.outstationBookings[0].returnTravelTime.toFixed(2);
                                var arr = returnTime.split('.');
                                var hr = parseInt(arr[0]);
                                var min = parseInt(arr[1]);
                                if (min < 10) {
                                    min = '0' + min;
                                }
                                var actualMin = min * 0.6;
                                var roundMin = Math.round(actualMin);
                                returnTravelHours = hr + ' Hrs. ' + roundMin + ' Mins.';

                            }
                        }


                        var driverShare = '0';
                        var idShare = '0';
                        var parsedDrvShare = '0';
                        var parsedIdShare = '0';
                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);

                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);

                        }
                        var rateCount = 0;
                        if (angular.isDefined(bookingData.rateCount) || bookingData.rateCount !== null) {
                            rateCount = bookingData.rateCount;
                        }
                        var list = [];
                        if (bookingData.bookingRating.length !== 0) {
                            if (bookingData.bookingRating[0].bookingRatingDetails.length !== 0) {
                                for (var k = 0; k < bookingData.bookingRating[0].bookingRatingDetails.length; k++) {
                                    list.push(bookingData.bookingRating[0].bookingRatingDetails[k].ratingAnswer);
                                }

                            }
                        }
                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        var history = [];
                            if (bookingData.driverAllocationReport.length !== 0) {
                                
                                   for (var k = 0; k < bookingData.driverAllocationReport.length; k++) {
                                       var status = bookingData.driverAllocationReport[k].history + moment(bookingData.driverAllocationReport[k].createdDate).format('DD-MM-YYYY | HH:mm:ss');
                                        history.push(status);
                                    }

                               
                           }
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;


                                BookingPaymentTransaction.find({
                                        filter: {
                                            where: {
                                                bookingId: bookingData.id,
                                                transactionStatus: 'Success'
                                            }
                                        }
                                    },
                                    function(transactionResponse) {
                                        //console.log('transaction response' + JSON.stringify(transactionResponse));
                                        var paymentDate = '';
                                        if (transactionResponse.length > 0) {

                                            if (!angular.isUndefined(transactionResponse[0].createdDate) || transactionResponse[0].createdDate !== null && transactionResponse[0].createdDate !== '') {
                                                paymentDate = moment(transactionResponse[0].createdDate).format('DD-MM-YYYY HH:mm:ss');
                                            }

                                        }
                                        $scope.booking = {
                                            bookingId: bookingData.id,
                                            bookingCustomerName: bookingData.customerDetails.firstName + ' ' + bookingData.customerDetails.lastName,
                                            bookingFirstName: bookingData.customerDetails.conUsers.firstName,
                                            bookingMiddleName: bookingData.customerDetails.conUsers.middleName,
                                            bookingLastName: bookingData.customerDetails.conUsers.lastName,
                                            bookingCellNumber: bookingData.customerDetails.conUsers.mobileNumber,
                                            email: bookingData.customerDetails.conUsers.email,
                                            bookingReportingDate: bookingData.reportingDate,
                                            bookingToDate: releavingDate,
                                            toDate: releavingDate1,
                                            toTime: releavingTime1,
                                            tohour1: tohour1,
                                            tomin1: tomin1,
                                            toFormat1: toFormat1,
                                            reportingDate: bookingData.reportingDate,
                                            releivingDate: releavingDate,
                                            reportingTime: reportingTime,
                                            releivingTime: releavingTime,
                                            bookingReleivingTime: $rootScope.releavingTimeAtOffDuty,
                                            landmark: bookingData.landmark,
                                            bookingFrmLocation: bookingData.pickAddress,
                                            bookingToLocation: bookingData.dropAddress,
                                            dutyType: dutyType,
                                            carType: carType,
                                            hours: fromhour,
                                            minutes: frommin,
                                            timeformat: fromFormat,
                                            tohours: tohour,
                                            tominutes: tomin,
                                            totimeformat: toFormat,
                                            outstationCity: cityName,
                                            journeyType: journeyType,
                                            estimatedAmt: grossAmt,
                                            totalAmt: netAmt,
                                            invoiceType: invoiceType,
                                            totalDuration: travelDuration,
                                            oldDrvId: bookingData.driverDetails.id,
                                            driverFirstName: bookingData.driverDetails.conUsers.firstName,
                                            driverMiddleName: bookingData.driverDetails.conUsers.middleName,
                                            driverLastName: bookingData.driverDetails.conUsers.lastName,
                                            driverContact: bookingData.driverDetails.conUsers.mobileNumber,
                                            driverAddress: bookingData.driverDetails.conUsers.address,
                                            driverAccNo: bookingData.driverDetails.accountNumber,
                                            bankName: bookingData.driverDetails.bankName,
                                            ifscCode: bookingData.driverDetails.ifscCode,
                                            paymentMethod: paymentMode,
                                            driverShare: drvShare,
                                            idShare: idShare,
                                            carTypeValue: carTypeText,
                                            returnFareAmt: returnFareText,
                                            returnFarekm:returnFare,
                                            driverShare: driverShare,
                                            idShare: idShare,
                                            returnTime: returnTravelHours,
                                            bookingDate: createdDate,
                                            bookBy: ' Created By ' + $scope.bookedBy,
                                            remark: bookingData.remark,
                                            status: bookingData.status,
                                            paymentStatus: bookingData.driverPaymentStatus,
                                            paymentDate: paymentDate,
                                            settlementMode: settlementMode,
                                            bankName: bankName,
                                            list: list,
                                            rating: rateCount,
                                            history:history,
                                            operationCity: bookingData.operationCity,
                                            fromLat:bookingData.fromLat,
                                            fromLong:bookingData.fromLong
                                        };
                                        $rootScope.checkFare = $scope.booking;
                                        $rootScope.lineupBookingDetails = $scope.booking;
                                        //console.log('booking details' + JSON.stringify($rootScope.lineupBookingDetails));
                                        $scope.getLineUpDriverMobile();
                                        $rootScope.loader = 0;
                                    },
                                    function(error) {
                                        console.log('error ' + JSON.stringify(error));
                                        $rootScope.loader = 0;
                                    });
                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });

                    }

                }, function(bookingErr) {
                    console.log('bookingErr ' + JSON.stringify(bookingErr));
                    if (bookingErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;

                });
            }


        };

        $scope.updateDateAndTime = function(booking) {
            $rootScope.loader = 1;
            var count = 0;
            var returnFarekm=0; 
            if (booking.dutyType == 'Outstation' && booking.journeyType == 'One Way') {
               
                returnFarekm = (booking.returnFarekm);
           
    }
            //console.log('booking details' + JSON.stringify(booking));
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
            var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
            var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
            var date1 = new Date(rptDate);
            var date2 = new Date(relDate);

            if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null) {
                document.getElementById("tohours").style.borderColor = "red";
                document.getElementById("tohours1").innerHTML = '*required';
                booking.tohours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("tohours").style.borderColor = "#dde6e9";
                document.getElementById("tohours1").innerHTML = '';
                booking.tohours1 = null;
            }
            if (angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                document.getElementById("tominutes").style.borderColor = "red";
                document.getElementById("tominutes1").innerHTML = '*required';
                booking.tominutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("tominutes").style.borderColor = "#dde6e9";
                document.getElementById("tominutes1").innerHTML = '';
                booking.tominutes1 = null;
            }
            if (angular.isUndefined(booking.hours) || booking.hours === '' || booking.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                booking.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                booking.hours1 = null;
            }
            if (angular.isUndefined(booking.minutes) || booking.minutes === '' || booking.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                booking.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                booking.minutes1 = null;
            }

            if (angular.isUndefined(booking.bookingReportingDate) || booking.bookingReportingDate === '' || booking.bookingReportingDate === null) {
                document.getElementById("bookingReportingDate").style.borderColor = "red";
                document.getElementById("bookingReportingDate1").innerHTML = '*required';
                booking.bookingReportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingReportingDate1").innerHTML = '';
                booking.bookingReportingDate1 = null;
            }
            if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                document.getElementById("bookingToDate").style.borderColor = "red";
                document.getElementById("bookingToDate1").innerHTML = '*required';
                booking.bookingToDate1 = 'This value is required';
                count++;
            } else {

                if (booking.dutyType === 'Outstation') {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    }else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }
                } else {


                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;

                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);

                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);

                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;
                    }
                }

            }


            if(angular.isUndefined(booking.remark) || (booking.remark === '' ) || booking.remark === null || booking.remark==='undefined')
            {
                var remark='';
            }
            else
            {
                var remark=booking.remark;
            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;

                Bookings.find({
                    filter: {
                        where: {
                            id: booking.bookingId
                        },
                        include: {
                            relation: 'invoices'

                        }
                    }
                }, function(success) {
                    //console.log('booking success' + JSON.stringify(success));
                    success[0].reportingDate = rptDate;
                    success[0].remark = remark;
                    success[0].reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';
                    success[0].updatedBy = $rootScope.userId;
                    success[0].updatedDate = new Date();
                    success[0].$save();
                    //var url = 'http://192.168.1.18:3000';
                    var url = 'http://65.0.186.134:3000';
                    var obj = {
                        "bookingId": booking.bookingId,
                        "requestFrom": "ADMIN_OFF",
                        "offDutyDate": relDate,
                        "offDutyTime": booking.tohours + ':' + booking.tominutes + ':' + '00',
                        "distanceBetweenPickupAndDrop":returnFarekm
                    };
                    if (success[0].isOutstation === true) {
                        OutstationBookings.find({
                            filter: {
                                where: {
                                    bookingId: booking.bookingId
                                }
                            }
                        }, function(OBSuccess) {
                            //console.log('OutstationBookings details' + JSON.stringify(OBSuccess));
                            OBSuccess[0].releavingDate = relDate;
                            OBSuccess[0].releavingTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            OBSuccess[0].updatedBy = $rootScope.userId;
                            OBSuccess[0].updatedDate = new Date();
                            OBSuccess[0].$save();
                        }, function(OBErr) {
                            console.log('OutstationBookings error' + JSON.stringify(OBErr));
                        });
                    }

                    Invoices.upsert({
                        id: success[0].invoices[0].id,
                        reportingDate: rptDate,
                        reportingTime: booking.hours + ':' + booking.minutes + ':' + '00',
                        releavingDate: relDate,
                        releavingTime: booking.tohours + ':' + booking.tominutes + ':' + '00',

                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        //console.log('invoice A:' + JSON.stringify(s));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getSearchHistory();
                            $rootScope.loader = 0;

                        }).
                        error(function(error) {
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                        });


                    }, function(e) {
                        console.log('error:' + JSON.stringify(e));

                        if (e.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;

                    });
                }, function(error) {
                    console.log('booking error' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });

            }
        }

        $scope.checkFare = function() {
            $modalInstance.dismiss('cancel');
            $state.go('app.fareCalculator');
        };

        $scope.allocate = function() {
            $scope.isDisabled = false;
            $scope.searchDriver = true;
            $scope.allocateDriver = false;

        };


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
        $scope.count = 0;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getSearchHistory();
        };

    };
    var bookingHistoryDetailsCtrl = function($scope, $rootScope, $modalInstance, $state, BookingDetails) {
        //booking estimation controller
    
        $scope.closeModal1 = function() {
            $modalInstance.dismiss('cancel');
             

        };
        $scope.historyDetails = function(){
            
            $rootScope.data = $rootScope.bookinghist;
            console.log("history: " +JSON.stringify($rootScope.data));
            BookingDetails.find({
                filter:{
                   where:{
                    bookingId: $rootScope.data.bookingId
                } 
                }
                 
                },function(s){ 
                    $rootScope.BookingDetails=s;
                    console.log($rootScope.BookingDetails.description+ 'success');
                    //$scope.bookingHistoryDetails
                    //$rootScope.bookingDetails = s;
                },
                function(error){
                    console.log(error+ 'Failure');
                });
        
        }

        
    };

    $(function() {

    });

    $scope.SearchCriteria = function() {

        $rootScope.driverId1 = undefined;
        $scope.mobileId = undefined;
        $state.go('app.bookingHistory');

    }

    $scope.searchById = function() {
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.bookingHistory');
                      
                }else{
                     
                   $scope.searchBooking = false;
                   $scope.shouldBeOpen = true;
                }
        }else{
             
            $scope.searchBooking = false;
        $scope.shouldBeOpen = true;
        }
        


    };
    $scope.backToSerach = function() {


        $scope.searchBooking = true;
        $scope.shouldBeOpen = false;
        document.getElementById("bookingId").style.borderColor = "#dde6e9";
        document.getElementById("bookingId1").innerHTML = '';


    };


    /*controller end*/
}
App.directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
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
}]);
