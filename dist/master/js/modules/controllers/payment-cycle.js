App.controller('paymentCycleCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
        '$cookieStore', 'orderByFilter', '$modal', '$state', '$base64', '$http', '$localStorage', 'DriverPaymentCycles', 'Bookings', 'DriverPaymentCycleDetails','$window',
        function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
            $cookieStore, orderByFilter, $modal, $state, $base64, $http, $localStorage, DriverPaymentCycles, Bookings, DriverPaymentCycleDetails, $window) {
            'use strict';


  
            $rootScope.userId = $localStorage.get('userId');
            $scope.searchData1 = false;
            $scope.shouldBeOpen = true;
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
            $scope.set = false;
            $rootScope.paymentCycleDetailsPage = function(paymentId, paymentName) {

                $rootScope.paymentCycleName1 = paymentName;
                $rootScope.paymentCycleId = paymentId;

                $state.go('app.paymentCycleDetails');

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

             $rootScope.searchPaymentCycleBooking = function(searchData) {
                if (!angular.isUndefined(searchData)) {

                    $localStorage.put('generateSearchData', searchData);
                    // console.log('create popup called.' + modelAssetId);
                    $state.go('app.paymentCycleBookingDetails');
                    //$rootScope.searchPaymentCycleById(searchData);
                } else {
                    //$rootScope.searchAllPaymentCycle();
                    $localStorage.put('generateSearchData', undefined);
                    $state.go('app.paymentCycleBookingDetails');
                }
            }

            $rootScope.getPaymentCycleBookings = function() {
                var generatePaymentData = $localStorage.get('generateSearchData');
                if (!angular.isUndefined(generatePaymentData)) {
                    $rootScope.getPaymentDetails(generatePaymentData);
                } else {
                    $rootScope.getAllPaymentDetails();
                }
            }
            $rootScope.getAllPaymentDetails = function() {
                $rootScope.loader = 1;
                $rootScope.data = [];
                var allPaymentData = [];

                Bookings.find({
                    filter: {
                        where: {

                            driverPaymentStatus: 'Unsettled'

                        },

                        include: [{
                            relation: 'driverDetails',
                            scope: {

                                include: {
                                    relation: 'conUsers'
                                }
                            }
                        }, {
                            relation: 'customerDetails',
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
                }, function(bookingUnsetteledData) {
                    console.log('Booking Unsetteled Data  ' + JSON.stringify(bookingUnsetteledData));
                    for (var i = 0; i < bookingUnsetteledData.length; i++) {
                        if (angular.isDefined(bookingUnsetteledData[i].driverDetails)) {



                            var cname = '-';
                            var cfName = '-';
                            var cmName = '-';
                            var clName = '-';
                            var cid = '';
                            var cellNumber = '-';

                            if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails)) {

                                if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers)) {
                                    if (angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers.middleName) || bookingUnsetteledData[i].customerDetails.conUsers.middleName === null) {

                                        cfName = bookingUnsetteledData[i].customerDetails.conUsers.firstName;
                                        clName = bookingUnsetteledData[i].customerDetails.conUsers.lastName;
                                        cname = cfName + ' ' + clName;
                                        cid = bookingUnsetteledData[i].customerDetails.id;
                                    } else {

                                        cfName = bookingUnsetteledData[i].customerDetails.conUsers.firstName;
                                        cmName = bookingUnsetteledData[i].customerDetails.conUsers.middleName;
                                        clName = bookingUnsetteledData[i].customerDetails.conUsers.lastName;
                                        cname = cfName + ' ' + cmName + ' ' + clName;
                                    }
                                    if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber) || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== null || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== '') {
                                        cellNumber = bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber;
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

                            if (bookingUnsetteledData[i].outstationBookings.length > 0) {
                                if (bookingUnsetteledData[i].outstationBookings[0].releavingDate != null || bookingUnsetteledData[i].outstationBookings[0].releavingDate != '') {
                                    relDate = bookingUnsetteledData[i].outstationBookings[0].releavingDate;
                                    relTime = bookingUnsetteledData[i].outstationBookings[0].releavingTime;
                                }

                            } else {
                                if (bookingUnsetteledData[i].invoices.length > 0) {
                                    if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].releavingDate) || bookingUnsetteledData[i].invoices[0].releavingDate !== null || bookingUnsetteledData[i].invoices[0].releavingDate !== '') {
                                        relDate = bookingUnsetteledData[i].invoices[0].releavingDate;
                                    }
                                    if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].releavingTime) || bookingUnsetteledData[i].invoices[0].releavingTime !== null || bookingUnsetteledData[i].invoices[0].releavingTime !== '') {
                                        relTime = bookingUnsetteledData[i].invoices[0].releavingTime;
                                    }
                                } else {

                                }
                            }
                            if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails)) {

                                if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails.conUsers)) {
                                    if (angular.isUndefined(bookingUnsetteledData[i].driverDetails.conUsers.middleName) || bookingUnsetteledData[i].driverDetails.conUsers.middleName === null) {
                                        dfName = bookingUnsetteledData[i].driverDetails.conUsers.firstName;
                                        dlName = bookingUnsetteledData[i].driverDetails.conUsers.lastName;
                                        dname = dfName + ' ' + dlName;
                                    } else {
                                        dfName = bookingUnsetteledData[i].driverDetails.conUsers.firstName;
                                        dmName = bookingUnsetteledData[i].driverDetails.conUsers.middleName;
                                        dlName = bookingUnsetteledData[i].driverDetails.conUsers.lastName;
                                        dname = dfName + ' ' + dmName + ' ' + dlName;
                                    }

                                }
                                if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails.id)) {
                                    drvId = bookingUnsetteledData[i].driverDetails.id;
                                }
                            }
                            var amount = '-';
                            if (!angular.isUndefined(bookingUnsetteledData[i].invoices) && (bookingUnsetteledData[i].invoices.length >= 1)) {
                                if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].netAmount)) {
                                    actualAmount = bookingUnsetteledData[i].invoices[0].netAmount;
                                    amount = actualAmount.toFixed(2);

                                }
                            }
                            if (!angular.isUndefined(bookingUnsetteledData[i].invoices) && (bookingUnsetteledData[i].invoices.length == 1)) {
                                if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].grossAmount)) {

                                    estimatedAmount = bookingUnsetteledData[i].invoices[0].grossAmount;
                                }
                            }

                            var driverShare = '0';
                            var idShare = '0';
                            var parsedDrvShare = '0';
                            var parsedIdShare = '0';
                            if (bookingUnsetteledData[i].driverShare != null && (!angular.isUndefined(bookingUnsetteledData[i].driverShare))) {
                                driverShare = bookingUnsetteledData[i].driverShare.toFixed(2);
                                //parsedDrvShare = driverShare.toFixed(2);
                                //anis
                            }
                            if (bookingUnsetteledData[i].idShare != null && (!angular.isUndefined(bookingUnsetteledData[i].idShare))) {
                                idShare = bookingUnsetteledData[i].idShare.toFixed(2);
                                //parsedIdShare = idShare.toFixed(2);
                            }
                            var landmark = ' ';
                            if (!angular.isUndefined(bookingUnsetteledData[i].landmark) || bookingUnsetteledData[i].landmark !== null || bookingUnsetteledData[i].landmark !== '') {
                                landmark = bookingUnsetteledData[i].landmark + ', ';
                            }

                            var dutyType = '';
                            if (!angular.isUndefined(bookingUnsetteledData[i].isOutstation) || bookingUnsetteledData[i].isOutstation !== null || bookingUnsetteledData[i].landmark !== '') {
                                if (bookingUnsetteledData[i].isOutstation == true) {
                                    dutyType = 'O';
                                } else {
                                    dutyType = 'L';
                                }
                            }

                            allPaymentData.push({
                                bookingId: bookingUnsetteledData[i].id,
                                customerId: cid,
                                custName: cname,
                                mobileNumber: cellNumber,
                                carType: bookingUnsetteledData[i].carType,
                                drvName: dname,
                                driverBatch: bookingUnsetteledData[i].driverDetails.driverBatch,
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
                                reportingLocation: landmark + bookingUnsetteledData[i].pickAddress,
                                releavingLocation: bookingUnsetteledData[i].dropAddress,
                                paymentMethod: bookingUnsetteledData[i].paymentMethod,
                                status: bookingUnsetteledData[i].status,
                                reportingDate: bookingUnsetteledData[i].reportingDate,
                                reportingTime: bookingUnsetteledData[i].reportingTime,
                                reportingDateAndTime: bookingUnsetteledData[i].reportingDate + ' ' + bookingUnsetteledData[i].reportingTime,
                                releavingDate: relDate,
                                releavingTime: relTime,
                                driverShare: driverShare,
                                idShare: idShare,
                                dutyType: dutyType,
                                driverPaymentStatus: bookingUnsetteledData[i].driverPaymentStatus
                            });
                        }
                    }
                    $rootScope.data = allPaymentData;
                    $scope.searchData1 = true;
                    console.log('booking payment cycle data****** ' + JSON.stringify($scope.data));
                    if ($scope.set === true) {
                        $scope.tableParams3.reload();
                        $scope.set = false;
                    } else {
                        createTable();

                    }
                    $rootScope.loader = 0;


                }, function(bookErr) {
                    console.log('booking error ' + JSON.stringify(bookErr));
                    if (bookErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }
            $rootScope.getPaymentDetails = function(searchData) {


                $rootScope.loader = 1;
                var count = 0;

                $rootScope.data = [];
                var allPaymentData = [];

                var driverBatch = null;
                var startDate = null;
                var endDate = null;


                if (!angular.isUndefined(searchData)) {

                    if (!angular.isUndefined(searchData.frmDate) || searchData.frmDate !== '' || searchData.frmDate !== null) {
                        /*startDate = moment(searchData.frmDate).format('YYYY-MM-DD');
                        startDate = new Date(startDate);
                        console.log('startDate is' + JSON.stringify(startDate));*/
                        startDate = (searchData.frmDate && !isNaN(Date.parse(searchData.frmDate))) ? Date.parse(searchData.frmDate) : 0;


                    }
                    if (!angular.isUndefined(searchData.toDate) || searchData.toDate !== '' || searchData.toDate !== null) {

                        /*endDate = moment(searchData.toDate).format('YYYY-MM-DD');
                        endDate = new Date(endDate);
                        console.log('endDate is' + JSON.stringify(endDate));*/
                        endDate = (searchData.toDate && !isNaN(Date.parse(searchData.toDate))) ? Date.parse(getCurrentDateTime(searchData.toDate)) : new Date().getTime();
                    }
                    if (!angular.isUndefined(searchData.driverBatchArray) || searchData.driverBatchArray !== '' || searchData.driverBatchArray !== null) {
                        driverBatch = searchData.driverBatchArray;
                    }

                }

                if (!angular.isUndefined(searchData)) {
                    /* if (angular.isUndefined(searchData.frmDate) || searchData.frmDate === '' || searchData.frmDate === null) {
                         document.getElementById("frmDate").style.borderColor = "red";
                         document.getElementById("frmDate1").innerHTML = '*required';
                         searchData.frmDate1 = 'required';
                         count++;
                     } else {
                         document.getElementById("frmDate").style.borderColor = "#dde6e9";
                         document.getElementById("frmDate1").innerHTML = '';
                         searchData.frmDate1 = null;

                     }

                     if (angular.isUndefined(searchData.toDate) || searchData.toDate === '' || searchData.toDate === null) {
                         document.getElementById("toDate").style.borderColor = "red";
                         document.getElementById("toDate1").innerHTML = '*required';
                         searchData.toDate1 = 'required';
                         count++;
                     } else {
                         document.getElementById("toDate").style.borderColor = "#dde6e9";
                         document.getElementById("toDate1").innerHTML = '';
                         searchData.toDate1 = null;

                     }*/
                    if (angular.isDefined(searchData.toDate) || angular.isDefined(searchData.toDate)) {
                        if (endDate < startDate) {
                            document.getElementById("toDate").style.borderBottom = "1px solid red";
                            document.getElementById("toDate1").innerHTML = 'to Date should be greater';
                            count++;

                        } else {
                            document.getElementById("toDate").style.borderColor = "#dde6e9";
                            document.getElementById("toDate1").innerHTML = '';

                        }
                    }

                    /* if (angular.isUndefined(searchData.driverBatchArray) || searchData.driverBatchArray === '' || searchData.driverBatchArray === null) {
                        document.getElementById("driverBatch").style.borderColor = "red";
                        document.getElementById("driverBatch1").innerHTML = '*required';
                        searchData.driverBatch1 = 'required';
                        count++;
                    } else {
                        document.getElementById("driverBatch").style.borderColor = "#dde6e9";
                        document.getElementById("driverBatch1").innerHTML = '';
                        searchData.driverBatch1 = null;

                    }*/

                } else {
                    document.getElementById("frmDate").style.borderColor = "red";
                    document.getElementById("frmDate1").innerHTML = '*required';

                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate1").innerHTML = '*required';

                    document.getElementById("driverBatch").style.borderColor = "red";
                    document.getElementById("driverBatch1").innerHTML = '*required';

                    count++;
                }
                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    Bookings.find({
                        filter: {
                            where: {
                                and: [{
                                    reportingDate: {
                                        gte: startDate
                                    }
                                }, {
                                    reportingDate: {
                                        lte: endDate
                                    }
                                }],
                                /*reportingDate: {gte: startDate, lte: endDate}, */
                                driverPaymentStatus: 'Unsettled'



                            },

                            include: [{
                                relation: 'driverDetails',
                                scope: {
                                    where: {
                                        driverBatch: searchData.driverBatchArray
                                    },
                                    include: {
                                        relation: 'conUsers'
                                    }
                                }
                            }, {
                                relation: 'customerDetails',
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
                    }, function(bookingUnsetteledData) {
                        console.log('Booking Unsetteled Data  ' + JSON.stringify(bookingUnsetteledData));
                        for (var i = 0; i < bookingUnsetteledData.length; i++) {
                            if (angular.isDefined(bookingUnsetteledData[i].driverDetails)) {



                                var cname = '-';
                                var cfName = '-';
                                var cmName = '-';
                                var clName = '-';
                                var cid = '';
                                var cellNumber = '-';

                                if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails)) {

                                    if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers)) {
                                        if (angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers.middleName) || bookingUnsetteledData[i].customerDetails.conUsers.middleName === null) {

                                            cfName = bookingUnsetteledData[i].customerDetails.conUsers.firstName;
                                            clName = bookingUnsetteledData[i].customerDetails.conUsers.lastName;
                                            cname = cfName + ' ' + clName;
                                            cid = bookingUnsetteledData[i].customerDetails.id;
                                        } else {

                                            cfName = bookingUnsetteledData[i].customerDetails.conUsers.firstName;
                                            cmName = bookingUnsetteledData[i].customerDetails.conUsers.middleName;
                                            clName = bookingUnsetteledData[i].customerDetails.conUsers.lastName;
                                            cname = cfName + ' ' + cmName + ' ' + clName;
                                        }
                                        if (!angular.isUndefined(bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber) || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== null || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== '') {
                                            cellNumber = bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber;
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

                                if (bookingUnsetteledData[i].outstationBookings.length > 0) {
                                    if (bookingUnsetteledData[i].outstationBookings[0].releavingDate != null || bookingUnsetteledData[i].outstationBookings[0].releavingDate != '') {
                                        relDate = bookingUnsetteledData[i].outstationBookings[0].releavingDate;
                                        relTime = bookingUnsetteledData[i].outstationBookings[0].releavingTime;
                                    }

                                } else {
                                    if (bookingUnsetteledData[i].invoices.length > 0) {
                                        if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].releavingDate) || bookingUnsetteledData[i].invoices[0].releavingDate !== null || bookingUnsetteledData[i].invoices[0].releavingDate !== '') {
                                            relDate = bookingUnsetteledData[i].invoices[0].releavingDate;
                                        }
                                        if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].releavingTime) || bookingUnsetteledData[i].invoices[0].releavingTime !== null || bookingUnsetteledData[i].invoices[0].releavingTime !== '') {
                                            relTime = bookingUnsetteledData[i].invoices[0].releavingTime;
                                        }
                                    } else {

                                    }
                                }
                                if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails)) {

                                    if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails.conUsers)) {
                                        if (angular.isUndefined(bookingUnsetteledData[i].driverDetails.conUsers.middleName) || bookingUnsetteledData[i].driverDetails.conUsers.middleName === null) {
                                            dfName = bookingUnsetteledData[i].driverDetails.conUsers.firstName;
                                            dlName = bookingUnsetteledData[i].driverDetails.conUsers.lastName;
                                            dname = dfName + ' ' + dlName;
                                        } else {
                                            dfName = bookingUnsetteledData[i].driverDetails.conUsers.firstName;
                                            dmName = bookingUnsetteledData[i].driverDetails.conUsers.middleName;
                                            dlName = bookingUnsetteledData[i].driverDetails.conUsers.lastName;
                                            dname = dfName + ' ' + dmName + ' ' + dlName;
                                        }

                                    }
                                    if (!angular.isUndefined(bookingUnsetteledData[i].driverDetails.id)) {
                                        drvId = bookingUnsetteledData[i].driverDetails.id;
                                    }
                                }
                                var amount = '-';
                                if (!angular.isUndefined(bookingUnsetteledData[i].invoices) && (bookingUnsetteledData[i].invoices.length >= 1)) {
                                    if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].netAmount)) {
                                        actualAmount = bookingUnsetteledData[i].invoices[0].netAmount;
                                        amount = actualAmount.toFixed(2);

                                    }
                                }
                                if (!angular.isUndefined(bookingUnsetteledData[i].invoices) && (bookingUnsetteledData[i].invoices.length == 1)) {
                                    if (!angular.isUndefined(bookingUnsetteledData[i].invoices[0].grossAmount)) {

                                        estimatedAmount = bookingUnsetteledData[i].invoices[0].grossAmount;
                                    }
                                }

                                var driverShare = '0';
                                var idShare = '0';
                                var parsedDrvShare = '0';
                                var parsedIdShare = '0';
                                if (bookingUnsetteledData[i].driverShare != null && (!angular.isUndefined(bookingUnsetteledData[i].driverShare))) {
                                    driverShare = bookingUnsetteledData[i].driverShare.toFixed(2);
                                    //parsedDrvShare = driverShare.toFixed(2);
                                    //anis
                                }
                                if (bookingUnsetteledData[i].idShare != null && (!angular.isUndefined(bookingUnsetteledData[i].idShare))) {
                                    idShare = bookingUnsetteledData[i].idShare.toFixed(2);
                                    //parsedIdShare = idShare.toFixed(2);
                                }
                                var landmark = ' ';
                                if (!angular.isUndefined(bookingUnsetteledData[i].landmark) || bookingUnsetteledData[i].landmark !== null || bookingUnsetteledData[i].landmark !== '') {
                                    landmark = bookingUnsetteledData[i].landmark + ', ';
                                }

                                var dutyType = '';
                                if (!angular.isUndefined(bookingUnsetteledData[i].isOutstation) || bookingUnsetteledData[i].isOutstation !== null || bookingUnsetteledData[i].landmark !== '') {
                                    if (bookingUnsetteledData[i].isOutstation == true) {
                                        dutyType = 'O';
                                    } else {
                                        dutyType = 'L';
                                    }
                                }

                                allPaymentData.push({
                                    bookingId: bookingUnsetteledData[i].id,
                                    customerId: cid,
                                    custName: cname,
                                    mobileNumber: cellNumber,
                                    carType: bookingUnsetteledData[i].carType,
                                    drvName: dname,
                                    driverBatch: bookingUnsetteledData[i].driverDetails.driverBatch,
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
                                    reportingLocation: landmark + bookingUnsetteledData[i].pickAddress,
                                    releavingLocation: bookingUnsetteledData[i].dropAddress,
                                    paymentMethod: bookingUnsetteledData[i].paymentMethod,
                                    status: bookingUnsetteledData[i].status,
                                    reportingDate: bookingUnsetteledData[i].reportingDate,
                                    reportingTime: bookingUnsetteledData[i].reportingTime,
                                    reportingDateAndTime: bookingUnsetteledData[i].reportingDate + ' ' + bookingUnsetteledData[i].reportingTime,
                                    releavingDate: relDate,
                                    releavingTime: relTime,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    dutyType: dutyType,
                                    driverPaymentStatus: bookingUnsetteledData[i].driverPaymentStatus
                                });
                            }
                        }
                        $rootScope.data = allPaymentData;
                        $scope.searchData1 = true;
                        console.log('booking payment cycle data****** ' + JSON.stringify($scope.data));
                        if ($scope.set === true) {
                            $scope.tableParams3.reload();
                            $scope.set = false;
                        } else {
                            createTable();

                        }
                        $rootScope.loader = 0;


                    }, function(bookErr) {
                        console.log('booking error ' + JSON.stringify(bookErr));
                        if (bookErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                        $rootScope.loader = 0;
                    });
                }
                /* DriverPaymentCycles.find({}, function(paymentData) {
                     console.log('payment cycle data ' + JSON.stringify(paymentData));

                     for (var i = 0; i < bookingUnsetteledData.length; i++) {


                         allPaymentData.push({
                             id: paymentData[i].id,
                             paymentCycleName: paymentData[i].paymentCycleName,
                             paymentDate: paymentData[i].paymentDate,
                             paymentCycleStatus: paymentData[i].paymentCycleStatus,
                             paymentTotal: paymentData[i].paymentTotal.toFixed(2)
                         });

                     }



                     $rootScope.data = allPaymentData;
                     console.log('payment cycle Data array' + JSON.stringify($rootScope.data));
                     createTable();
                     $rootScope.loader = 0;
                 }, function(paymentErr) {
                     $rootScope.loader = 0;
                     console.log('payment error ' + JSON.stringify(paymentErr));
                 });*/

            };
            $rootScope.checkAll2 = function(payment) {
                if ($scope.selectedAll) {
                    $scope.selectedAll = true;
                    console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
                } else {
                    $scope.selectedAll = false;
                    console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
                }
                angular.forEach($rootScope.data, function(payment) {
                    payment.Selected = $scope.selectedAll;
                });

            }
            $scope.backTopayment = function() {
                //$scope.searchData1 = false;
                $scope.set = true;
                $localStorage.put('generateSearchData', undefined);
                //$rootScope.data = [];
                $state.go('app.paymentCycle');
                //$scope.tableParams3.reload();
                //$state.reload();

            }
            $scope.back = function() {
                $state.go('app.paymentCycle');
            }

            $rootScope.selectCustomer2 = function(bookingId, driverShare) {
                if ($scope.selct.length !== null) {
                    $scope.select = $scope.selct;
                }
                console.log('Slect number: ' + JSON.stringify($scope.selct));
                console.log('bookingId : ' + JSON.stringify(bookingId));



                if ($scope.select.indexOf(bookingId) == -1) {

                    $scope.select.push(bookingId);
                    console.log('push number:' + JSON.stringify($scope.select));

                    $scope.count++;
                    console.log('count:' + JSON.stringify($scope.count));
                } else {

                    for (var i = $scope.select.length - 1; i >= 0; i--) {

                        if ($scope.select[i] == bookingId) {
                            console.log('duplicate id is:' + JSON.stringify(bookingId));

                            $scope.select.splice(i, 1);
                            console.log('deleted number is:' + JSON.stringify(bookingId));
                            $scope.count--;
                            console.log('count:' + JSON.stringify($scope.count));
                        }

                    }


                }
                console.log('array number:' + JSON.stringify($scope.select));

                $rootScope.number = $scope.select;
            };

            var cnt = 0;
            $scope.count = 0;
            $scope.selct = [];

            $rootScope.selectAllCustomer2 = function() {

                if (cnt == 0) {
                    $scope.selct = [];

                    console.log('CNT:' + JSON.stringify(cnt));
                    console.log('selected bookingId is:' + JSON.stringify($scope.selct));

                    console.log('array :' + JSON.stringify($rootScope.number));

                    console.log('all bookingId s:' + JSON.stringify($rootScope.data.length));

                    var num = $rootScope.data.length;
                    console.log('selected bookingId s' + JSON.stringify(num));
                    for (var i = 0; i < num; i++) {

                        /*$rootScope.selectCustomer($rootScope.customerData[i].contactNo);*/
                        if ($scope.selct.indexOf($rootScope.data[i].bookingId) == -1) {

                            $scope.selct.push($rootScope.data[i].bookingId);
                            console.log('push booking id:' + JSON.stringify($scope.selct));
                            $scope.count++;
                            console.log('count:' + JSON.stringify($scope.cont));
                        } else {

                            for (var j = $scope.selct.length - 1; j >= 0; j--) {

                                if ($scope.selct[j] == $rootScope.data[i].bookingId) {
                                    console.log('duplicate bookingId is:' + JSON.stringify($rootScope.data[i].bookingId));

                                    $scope.selct.splice(j, 0);
                                    console.log('deleted bookingId is:' + JSON.stringify($rootScope.data[i].bookingId));
                                    $scope.count--;
                                    console.log('count:' + JSON.stringify($scope.count));
                                }

                            }


                        }
                        console.log('array number--:' + JSON.stringify($scope.selct));


                        $rootScope.number = $scope.selct;
                        console.log('root number:' + JSON.stringify($rootScope.number));
                        cnt = 1;
                    }

                    console.log('CNT ++:' + JSON.stringify(cnt));
                } else {

                    $rootScope.number = [];

                    $scope.selct = [];

                    $scope.count = 0;
                    cnt = 0;
                    console.log('else bookingId:' + JSON.stringify($rootScope.number));

                }

            }


            $rootScope.getAllCustomer = function() {
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

            function createTable() {

                $scope.tableParams3 /**/ = new ngTableParams({
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
            /*$rootScope.generatePaymentPopup = function() {
                $rootScope.loader = 1;

                console.log('$rootScope.number: ' + JSON.stringify($rootScope.number));
                var allPaymentData = [];
                Bookings.findById({
                    filter: {
                        where: {
                            id: $rootScope.number
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
                }, function(generateDriverPaymentCycle) {
                    console.log('Booking Unsetteled Data  ' + JSON.stringify(generateDriverPaymentCycle));
                    for (var i = 0; i < generateDriverPaymentCycle.length; i++) {
                        var cname = '-';
                        var cfName = '-';
                        var cmName = '-';
                        var clName = '-';
                        var cid = '';
                        var cellNumber = '-';

                        if (!angular.isUndefined(generateDriverPaymentCycle[i].customerDetails)) {

                            if (!angular.isUndefined(generateDriverPaymentCycle[i].customerDetails.conUsers)) {
                                if (angular.isUndefined(generateDriverPaymentCycle[i].customerDetails.conUsers.middleName) || bookingUnsetteledData[i].customerDetails.conUsers.middleName === null) {

                                    cfName = generateDriverPaymentCycle[i].customerDetails.conUsers.firstName;
                                    clName = generateDriverPaymentCycle[i].customerDetails.conUsers.lastName;
                                    cname = cfName + ' ' + clName;
                                    cid = generateDriverPaymentCycle[i].customerDetails.id;
                                } else {

                                    cfName = generateDriverPaymentCycle[i].customerDetails.conUsers.firstName;
                                    cmName = generateDriverPaymentCycle[i].customerDetails.conUsers.middleName;
                                    clName = generateDriverPaymentCycle[i].customerDetails.conUsers.lastName;
                                    cname = cfName + ' ' + cmName + ' ' + clName;
                                }
                                if (!angular.isUndefined(generateDriverPaymentCycle[i].customerDetails.conUsers.mobileNumber) || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== null || bookingUnsetteledData[i].customerDetails.conUsers.mobileNumber !== '') {
                                    cellNumber = generateDriverPaymentCycle[i].customerDetails.conUsers.mobileNumber;
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

                        if (generateDriverPaymentCycle[i].outstationBookings.length > 0) {
                            if (generateDriverPaymentCycle[i].outstationBookings[0].releavingDate != null || generateDriverPaymentCycle[i].outstationBookings[0].releavingDate != '') {
                                relDate = generateDriverPaymentCycle[i].outstationBookings[0].releavingDate;
                                relTime = generateDriverPaymentCycle[i].outstationBookings[0].releavingTime;
                            }

                        } else {
                            if (generateDriverPaymentCycle[i].invoices.length > 0) {
                                if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices[0].releavingDate) || generateDriverPaymentCycle[i].invoices[0].releavingDate !== null || generateDriverPaymentCycle[i].invoices[0].releavingDate !== '') {
                                    relDate = generateDriverPaymentCycle[i].invoices[0].releavingDate;
                                }
                                if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices[0].releavingTime) || generateDriverPaymentCycle[i].invoices[0].releavingTime !== null || generateDriverPaymentCycle[i].invoices[0].releavingTime !== '') {
                                    relTime = generateDriverPaymentCycle[i].invoices[0].releavingTime;
                                }
                            } else {

                            }
                        }
                        if (!angular.isUndefined(generateDriverPaymentCycle[i].driverDetails)) {

                            if (!angular.isUndefined(generateDriverPaymentCycle[i].driverDetails.conUsers)) {
                                if (angular.isUndefined(generateDriverPaymentCycle[i].driverDetails.conUsers.middleName) || generateDriverPaymentCycle[i].driverDetails.conUsers.middleName === null) {
                                    dfName = generateDriverPaymentCycle[i].driverDetails.conUsers.firstName;
                                    dlName = generateDriverPaymentCycle[i].driverDetails.conUsers.lastName;
                                    dname = dfName + ' ' + dlName;
                                } else {
                                    dfName = generateDriverPaymentCycle[i].driverDetails.conUsers.firstName;
                                    dmName = generateDriverPaymentCycle[i].driverDetails.conUsers.middleName;
                                    dlName = generateDriverPaymentCycle[i].driverDetails.conUsers.lastName;
                                    dname = dfName + ' ' + dmName + ' ' + dlName;
                                }

                            }
                            if (!angular.isUndefined(generateDriverPaymentCycle[i].driverDetails.id)) {
                                drvId = generateDriverPaymentCycle[i].driverDetails.id;
                            }
                        }
                        var amount = '-';
                        if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices) && (generateDriverPaymentCycle[i].invoices.length >= 1)) {
                            if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices[0].netAmount)) {
                                actualAmount = generateDriverPaymentCycle[i].invoices[0].netAmount;
                                amount = actualAmount.toFixed(2);

                            }
                        }
                        if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices) && (generateDriverPaymentCycle[i].invoices.length == 1)) {
                            if (!angular.isUndefined(generateDriverPaymentCycle[i].invoices[0].grossAmount)) {

                                estimatedAmount = generateDriverPaymentCycle[i].invoices[0].grossAmount;
                            }
                        }

                        var driverShare = '0';
                        var idShare = '0';
                        var parsedDrvShare = '0';
                        var parsedIdShare = '0';
                        if (generateDriverPaymentCycle[i].driverShare != null && (!angular.isUndefined(generateDriverPaymentCycle[i].driverShare))) {
                            driverShare = generateDriverPaymentCycle[i].driverShare.toFixed(2);
                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (generateDriverPaymentCycle[i].idShare != null && (!angular.isUndefined(generateDriverPaymentCycle[i].idShare))) {
                            idShare = generateDriverPaymentCycle[i].idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }
                        var landmark = ' ';
                        if (!angular.isUndefined(generateDriverPaymentCycle[i].landmark) || generateDriverPaymentCycle[i].landmark !== null || generateDriverPaymentCycle[i].landmark !== '') {
                            landmark = generateDriverPaymentCycle[i].landmark + ', ';
                        }

                        var dutyType = '';
                        if (!angular.isUndefined(generateDriverPaymentCycle[i].isOutstation) || generateDriverPaymentCycle[i].isOutstation !== null || generateDriverPaymentCycle[i].landmark !== '') {
                            if (generateDriverPaymentCycle[i].isOutstation == true) {
                                dutyType = 'O';
                            } else {
                                dutyType = 'L';
                            }
                        }

                        allPaymentCycleData.push({
                            bookingId: generateDriverPaymentCycle[i].id,
                            customerId: cid,
                            custName: cname,
                            mobileNumber: cellNumber,
                            carType: generateDriverPaymentCycle[i].carType,
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
                            reportingLocation: landmark + generateDriverPaymentCycle[i].pickAddress,
                            releavingLocation: generateDriverPaymentCycle[i].dropAddress,
                            paymentMethod: generateDriverPaymentCycle[i].paymentMethod,
                            status: generateDriverPaymentCycle[i].status,
                            reportingDate: generateDriverPaymentCycle[i].reportingDate,
                            reportingTime: generateDriverPaymentCycle[i].reportingTime,
                            reportingDateAndTime: generateDriverPaymentCycle[i].reportingDate + ' ' + generateDriverPaymentCycle[i].reportingTime,
                            releavingDate: relDate,
                            releavingTime: relTime,
                            driverShare: driverShare,
                            idShare: idShare,
                            dutyType: dutyType,
                            driverPaymentStatus: generateDriverPaymentCycle[i].driverPaymentStatus
                        });
                    }
                    $rootScope.data = allPaymentCycleData;
                    console.log('generated payment cycle data****** ' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;

                }, function(bookErr) {
                    console.log('booking error ' + JSON.stringify(bookErr));
                    if (bookErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });


            };*/
            $scope.generatePaymentPopup = function() {
                $state.go('app.paymentCycleDetails');

            }; 
            $scope.generatePaymentdriverPopup = function() {

                if ($window.confirm("Are you sure you want to generate payment cycle of these bookings?")) {
                $scope.result = "Yes";
                $state.go('app.paymentCycleDetailsdriver');
            } else {
                $scope.result = "No";
                
            }
                

            };
            $scope.getPaymentCycleDetailsData = function(search) {
                console.log('payment cycleId: ' + JSON.stringify(search.driverPaymentCycleId));
                DriverPaymentCycleDetails.find({
                    filter: {
                        where: {
                            driverPaymentCycleId: search.driverPaymentCycleId
                        }
                    }
                }, function(details) {
                    $rootScope.bookingId = details;
                    console.log('details: ' + JSON.stringify(details.length));
                    $rootScope.selectAllbookingids();
                    if ($rootScope.number.length > 0) {
                        $scope.generatePaymentp();
                    }

                }, function(erer) {
                    console.log('details: ' + JSON.stringify(erer));


                });


            }
            $scope.generatePaymentp = function(search) {
                $rootScope.search = search;
                $localStorage.put('cycleId', search.driverPaymentCycleId);
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.paymentCyclePrint');
            };

            var cnt = 0;
            $scope.count1 = 0;
            $scope.selct = [];

            $rootScope.selectAllbookingids = function() {

                if (cnt == 0) {
                    $scope.selct = [];

                    console.log('CNT:' + JSON.stringify(cnt));
                    console.log('selected bookingId is:' + JSON.stringify($scope.selct));

                    console.log('array :' + JSON.stringify($rootScope.number));

                    console.log('all bookingId s:' + JSON.stringify($rootScope.bookingId.length));

                    var num = $rootScope.bookingId.length;
                    console.log('selected bookingId s' + JSON.stringify(num));
                    for (var i = 0; i < num; i++) {

                        /*$rootScope.selectCustomer($rootScope.customerData[i].contactNo);*/
                        if ($scope.selct.indexOf($rootScope.bookingId[i].bookingId) == -1) {

                            $scope.selct.push($rootScope.bookingId[i].bookingId);
                            console.log('push booking id:' + JSON.stringify($scope.selct));
                            $scope.count1++;
                            console.log('count:' + JSON.stringify($scope.cont));
                        } else {

                            for (var j = $scope.selct.length - 1; j >= 0; j--) {

                                if ($scope.selct[j] == $rootScope.bookingId[i].bookingId) {
                                    console.log('duplicate bookingId is:' + JSON.stringify($rootScope.bookingId[i].bookingId));

                                    $scope.selct.splice(j, 0);
                                    console.log('deleted bookingId is:' + JSON.stringify($rootScope.bookingId[i].bookingId));
                                    $scope.count1--;
                                    console.log('count:' + JSON.stringify($scope.count));
                                }

                            }


                        }
                        console.log('array number--:' + JSON.stringify($scope.selct));


                        $rootScope.number = $scope.selct;
                        console.log('root number:' + JSON.stringify($rootScope.number));
                        cnt = 1;
                    }

                    console.log('CNT ++:' + JSON.stringify(cnt));
                } else {

                    $rootScope.number = [];

                    $scope.selct = [];

                    $scope.count1 = 0;
                    cnt = 0;
                    console.log('else bookingId:' + JSON.stringify($rootScope.number));

                }

            }
            $scope.generatePaymentCycledrive1 = function() {


                $rootScope.cycleId = $localStorage.get('cycleId');
                DriverPaymentCycleDetails.find({
                    filter: {
                        where: {
                            driverPaymentCycleId: $rootScope.cycleId
                        }
                    }
                }, function(details) {
                    $rootScope.bookingId = details;
                    console.log('details: ' + JSON.stringify(details.length));
                    $rootScope.selectAllbookingids();
                    if ($rootScope.number.length > 0) {
                        var allPaymentCycleData = [];

                        Bookings.getDriverSalaryList({
                                bookingId: $rootScope.number
                            },
                            function(suc) {
                                console.log('suc: ' + JSON.stringify(suc));

                                for (var i = 0; i < suc.length; i++) {
                                    var drvName = suc[i].first_name + ' ' + suc[i].last_name;
                                    allPaymentCycleData.push({
                                        driverId: suc[i].driver_id,
                                        drvName: drvName,
                                        bankName: suc[i].bank_name,
                                        accountNumber: suc[i].account_number,
                                        ifscCode: suc[i].ifsc_code,
                                        drvmobile: suc[i].mobile_number,
                                        actualAmt: suc[i].total,



                                    });

                                }

                                $rootScope.data = allPaymentCycleData;
                                console.log('result : ' + JSON.stringify($rootScope.data));
                                createTable();
                                cnt = 0;
                                $rootScope.loader = 0;
                                $rootScope.number = [];
                                $scope.selct = [];
                            },
                            function(er) {
                                console.log('error: ' + JSON.stringify(er));
                            });

                    }

                }, function(erer) {
                    console.log('details: ' + JSON.stringify(erer));


                });


            };
            $scope.confirmPayments = function() {
                if ($rootScope.uselected.length < 1) {
                    $rootScope.uselected = '$';
                }
                DriverPaymentCycles.paymentConfirmation({
                    paymentCycleId: $rootScope.cycleId,
                    driverId: $rootScope.uselected
                }, function(success) {
                    console.log('success' + JSON.stringify(success));
                    $.notify('Payment cycle Completed successfully.', {
                        status: 'success'
                    });

                    $state.go('app.paymentCycle');

                }, function(error) {
                    console.log('error' + JSON.stringify(error));
                });
            }

            $rootScope.selectDriver = function(driverId, driverShare) {
                $rootScope.uselected = [];
                if ($scope.selct.length !== null) {
                    $scope.select = $scope.selct;
                }
                console.log('Slect number: ' + JSON.stringify($scope.selct));
                console.log('bookingId : ' + JSON.stringify(driverId));
                var driverShare1 = 0;


                if ($scope.select.indexOf(driverId) == -1) {

                    $scope.select.push(driverId);
                    console.log('push number:' + JSON.stringify($scope.select));

                    $scope.count3++;
                    console.log('count:' + JSON.stringify($scope.count));
                } else {

                    for (var i = $scope.select.length - 1; i >= 0; i--) {

                        if ($scope.select[i] == driverId) {
                            console.log('duplicate id is:' + JSON.stringify(driverId));
                            $rootScope.uselected.push(driverId);
                            // $rootScope.driverShare = driverShare1+Number(driverShare);
                            $scope.select.splice(i, 1);
                            console.log('deleted number is:' + JSON.stringify(driverId));
                            $scope.count3--;
                            console.log('count:' + JSON.stringify($scope.count3));
                        }

                    }


                }
                console.log('array number:' + JSON.stringify($scope.select));
                console.log('unselected : ' + JSON.stringify($rootScope.uselected));
                $rootScope.uselected = $rootScope.uselected.map(function(obj) {
                    return obj;
                }).join('$');
                $rootScope.number = $scope.select;
                var drv = $rootScope.number.map(function(obj) {
                    return obj;
                }).join('$');
                console.log(' unselected driverIds : ' + JSON.stringify($rootScope.uselected));

                console.log('$rootScope.driverIds : ' + JSON.stringify(drv));
            };
            var cnt = 0;
            $scope.count3 = 0;
            $scope.selct = [];
            $rootScope.selectAll = function(payment) {
                if ($scope.selectedAll) {
                    $scope.selectedAll = true;
                    console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
                } else {
                    $scope.selectedAll = false;
                    console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
                }
                angular.forEach($rootScope.data, function(payment) {
                    payment.Selected = $scope.selectedAll;
                });

            }
            $rootScope.selectAllDrivers = function() {
                $rootScope.uselected = [];
                if (cnt == 0) {
                    $scope.selct = [];

                    console.log('CNT:' + JSON.stringify(cnt));
                    console.log('selected bookingId is:' + JSON.stringify($scope.selct));

                    console.log('array :' + JSON.stringify($rootScope.number));

                    console.log('all bookingId s:' + JSON.stringify($rootScope.data.length));

                    var num = $rootScope.data.length;
                    console.log('selected bookingId s' + JSON.stringify(num));
                    for (var i = 0; i < num; i++) {

                        /*$rootScope.selectCustomer($rootScope.customerData[i].contactNo);*/
                        if ($scope.selct.indexOf($rootScope.data[i].driverId) == -1) {

                            $scope.selct.push($rootScope.data[i].driverId);
                            console.log('push booking id:' + JSON.stringify($scope.selct));
                            $scope.count3++;
                            console.log('count:' + JSON.stringify($scope.cont));
                        } else {

                            for (var j = $scope.selct.length - 1; j >= 0; j--) {

                                if ($scope.selct[j] == $rootScope.data[i].driverId) {
                                    console.log('duplicate bookingId is:' + JSON.stringify($rootScope.data[i].driverId));
                                    $rootScope.uselected.push($rootScope.data[i].driverId);
                                    $scope.selct.splice(j, 0);
                                    console.log('deleted bookingId is:' + JSON.stringify($rootScope.data[i].driverId));
                                    $scope.count3--;
                                    console.log('count:' + JSON.stringify($scope.count));
                                }

                            }


                        }
                        console.log('array number--:' + JSON.stringify($scope.selct));


                        $rootScope.number = $scope.selct;
                        console.log('root number:' + JSON.stringify($rootScope.number));

                        cnt = 1;
                    }

                    console.log('CNT ++:' + JSON.stringify(cnt));
                } else {

                    $rootScope.number = [];
                    var num = $rootScope.data.length;
                    console.log('selected bookingId s' + JSON.stringify(num));
                    for (var i = 0; i < num; i++) {

                        /*$rootScope.selectCustomer($rootScope.customerData[i].contactNo);*/
                        if ($rootScope.uselected.indexOf($rootScope.data[i].driverId) == -1) {

                            $rootScope.uselected.push($rootScope.data[i].driverId);
                            console.log('push driver id:' + JSON.stringify($scope.uselected));
                            $rootScope.uselected = $rootScope.uselected.map(function(obj) {
                                return obj;
                            }).join('$');
                            console.log('$rootScope.driverIds : ' + JSON.stringify($rootScope.uselected));

                        }
                    }

                    $scope.selct = [];

                    $scope.count3 = 0;
                    cnt = 0;
                    console.log('else bookingId:' + JSON.stringify($rootScope.number));

                }
                var drv = $rootScope.number.map(function(obj) {
                    return obj;
                }).join('$');
                console.log('$rootScope.driverIds : ' + JSON.stringify(drv));
            };
            $rootScope.print = function() {

                printElement(document.getElementById("printThis"));
                var modThis = document.querySelector("#printSection");
                modThis.appendChild(document.createTextNode(" new"));
                window.print();

            };

            function printElement(elem) {
                var domClone = elem.cloneNode(true);

                var $printSection = document.getElementById("printSection");

                if (!$printSection) {
                    var $printSection = document.createElement("div");
                    $printSection.id = "printSection";
                    document.body.appendChild($printSection);
                }

                $printSection.innerHTML = "";

                $printSection.appendChild(domClone);
            }

            var GeneratePaymentCtrl = function($scope, $rootScope, $modalInstance) {
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
                $scope.closeModal = function() {
                    $modalInstance.dismiss('cancel');
                };

                $scope.generatePaymentCycle = function(paymentCycle) {
                    console.log('payment cycle details***' + JSON.stringify(paymentCycle));

                    $rootScope.loader = 1;
                    var count = 0;
                    if (angular.isUndefined(paymentCycle.paymentName) || paymentCycle.paymentName == '' || paymentCycle.paymentName == null) {
                        document.getElementById("paymentName").style.borderBottom = "1px solid red";
                        document.getElementById("paymentName1").innerHTML = '*required';
                        paymentCycle.paymentName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("paymentName").style.borderColor = "#dde6e9";
                        document.getElementById("paymentName1").innerHTML = '';
                        paymentCycle.paymentName1 = null;

                    }

                    if (angular.isUndefined(paymentCycle.paymentDate) || paymentCycle.paymentDate == '' || paymentCycle.paymentDate == null) {
                        document.getElementById("paymentDate").style.borderBottom = "1px solid red";
                        document.getElementById("paymentDate1").innerHTML = '*required';
                        paymentCycle.paymentDate1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("paymentDate").style.borderColor = "#dde6e9";
                        document.getElementById("paymentDate1").innerHTML = '';
                        paymentCycle.paymentDate1 = null;

                    }

                    if (angular.isUndefined(paymentCycle.driverBatch) || paymentCycle.driverBatch === '' || paymentCycle.driverBatch === null) {
                        document.getElementById("driverBatch").style.borderColor = "red";
                        document.getElementById("driverBatch1").innerHTML = '*required';
                        paymentCycle.driverBatch1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("driverBatch").style.borderColor = "#dde6e9";
                        document.getElementById("driverBatch1").innerHTML = '';
                        paymentCycle.driverBatch1 = null;
                    }
                    if (count > 0) {
                        $scope.count = count;
                        $scope.isDisabledButton = true;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $rootScope.loader = 0;
                        $scope.count = 0;

                        var paymentDate = new Date(
                            paymentCycle.paymentDate.getFullYear(),
                            paymentCycle.paymentDate.getMonth(),
                            paymentCycle.paymentDate.getDate() + 1);
                        var allDriverDetails = [];

                        DriverPaymentCycle.generateDriverPaymentCycle({
                            paymentCycleName: paymentCycle.paymentName,
                            paymentCycleDate: paymentDate,
                            userId: $rootScope.userId
                        }, function(successData) {
                            console.log('generate payment cycle success' + JSON.stringify(successData));

                            for (var i = 0; i < successData.length; i++) {
                                var fName;
                                var mName;
                                var lName;
                                var dName;
                                var totalAmount = '-';
                                var accNo = '-';
                                var bankName = '-';
                                var ifsCode = '-';
                                var driverPaymentCycleId = '';
                                var driverId = '';
                                var micrCode = '-';
                                if (angular.isUndefined(successData[i].middle_name) || successData[i].middle_name === null) {

                                    fName = successData[i].first_name;
                                    lName = successData[i].last_name;
                                    dName = fName + ' ' + lName;
                                } else {

                                    fName = successData[i].first_name;
                                    mName = successData[i].middle_name;
                                    lName = successData[i].last_name;
                                    dName = fName + ' ' + mName + ' ' + lName;
                                }
                                if (!angular.isUndefined(successData[i].total_amount_l) || successData[i].total_amount_l != null || successData[i].total_amount_l != '') {
                                    totalAmount = successData[i].total_amount_l;
                                }

                                if (!angular.isUndefined(successData[i].account_number) || successData[i].account_number != null || successData[i].account_number != '') {
                                    accNo = successData[i].account_number;
                                }

                                if (!angular.isUndefined(successData[i].bank_name) || successData[i].bank_name != null || successData[i].bank_name != '') {
                                    bankName = successData[i].bank_name;
                                }

                                if (!angular.isUndefined(successData[i].ifs_code) || successData[i].ifs_code != null || successData[i].ifs_code != '') {
                                    ifsCode = successData[i].ifs_code;
                                }

                                if (!angular.isUndefined(successData[i].driver_payment_cycle_id_l) || successData[i].driver_payment_cycle_id_l != null || successData[i].driver_payment_cycle_id_l != '') {
                                    driverPaymentCycleId = successData[i].driver_payment_cycle_id_l;
                                }
                                if (!angular.isUndefined(successData[i].driver_id_l) || successData[i].driver_id_l != null || successData[i].driver_id_l != '') {
                                    driverId = successData[i].driver_id_l;
                                }

                                if (!angular.isUndefined(successData[i].micr_code) || successData[i].micr_code != null || successData[i].micr_code != '') {
                                    micrCode = successData[i].micr_code;
                                }


                                allDriverDetails.push({
                                    id: driverId,
                                    drvPaymentCycleId: driverPaymentCycleId,
                                    driverName: dName,
                                    totalAmount: totalAmount,
                                    accountNumber: accNo,
                                    bankName: bankName,
                                    ifscCode: ifsCode,
                                    micrCode: micrCode

                                });
                            }


                            $rootScope.paymentDriverData = allDriverDetails;
                            console.log('all Driver Details***' + JSON.stringify($rootScope.paymentDriverData));
                            $modalInstance.dismiss('cancel');
                            $.notify('Payment cycle generated successfully.', {
                                status: 'success'
                            });
                            $rootScope.paymentDetailsPopup();
                            $rootScope.getPaymentDetails();
                            reloadFunc();
                        }, function(successErr) {
                            console.log('generate payment cycle error' + JSON.stringify(successErr));
                        })
                    }
                }

                $rootScope.myDate = new Date();

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
            }

            $rootScope.paymentDetailsPopup = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/payment-details-popup.html',
                    controller: paymentDetailsCtrl,
                    windowClass: 'app-modal-window'
                });

                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
            };

            var paymentDetailsCtrl = function($scope, $rootScope, $modalInstance) {
                $scope.closeModal = function() {
                    $modalInstance.dismiss('cancel');
                };

            }


            $(function() {

            });

        }
    ]).directive('googleplace', function() {
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
    })
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
