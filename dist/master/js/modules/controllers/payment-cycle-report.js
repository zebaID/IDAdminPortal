App.controller('paymentCycleReportCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
        '$cookieStore', 'orderByFilter', '$modal', '$state', '$base64', '$http', '$localStorage', 'DriverPaymentCycles', 'Bookings', 'DriverPaymentCycleDetails', '$window',
        function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
            $cookieStore, orderByFilter, $modal, $state, $base64, $http, $localStorage, DriverPaymentCycles, Bookings, DriverPaymentCycleDetails, $window) {
            'use strict';



            $rootScope.userId = $localStorage.get('userId');
            $rootScope.backToSearchPaymentCycle = function() {
                //$localStorage.clear('paymentCycleData');
                //localStorage.removeItem('paymentCycleData');

                $localStorage.put('paymentCycleData', undefined);
                $state.go('app.paymentCycleReport');
            }
            $rootScope.searchPaymentCycle = function(searchData) {
                if (!angular.isUndefined(searchData)) {

                    $localStorage.put('paymentCycleData', searchData);
                    // console.log('create popup called.' + modelAssetId);
                    $state.go('app.paymentCycleResult');
                    //$rootScope.searchPaymentCycleById(searchData);
                } else {
                    //$rootScope.searchAllPaymentCycle();
                    $localStorage.put('paymentCycleData', undefined);
                    $state.go('app.paymentCycleResult');
                }
            }

            $rootScope.getPaymentCycleDetails = function() {
                var paymentData = $localStorage.get('paymentCycleData');
                if (!angular.isUndefined(paymentData)) {


                    // console.log('create popup called.' + modelAssetId);
                    //$state.go('app.paymentCycleResult');
                    $rootScope.searchPaymentCycleById(paymentData);
                } else {
                    $rootScope.searchAllPaymentCycle();
                    //$state.go('app.paymentCycleResult');
                }
            }

            $scope.paymentCycleFunction = function(payment) {
                $rootScope.search = payment;
                $rootScope.paymentCycleId = payment.paymentId;
                console.log('$rootScope.search ' + JSON.stringify($rootScope.search));
                if ($rootScope.search.paymentCycleStatus === 'In Process') {
                    $rootScope.completeFlag = false;
                    $state.go('app.paymentCycleDriverDetails');
                } else {
                    //$state.go('app.paymentCyclePrint');
                    $rootScope.completeFlag = true;
                    $state.go('app.paymentCycleDriverDetails');
                }


            };

            $scope.paymentCyclePrintFunction = function(payment) {
                $state.go('app.paymentCyclePrint');
            };

           $scope.confirmPayments = function() {

                if($rootScope.uselected.length>0){
                    console.log('unselected array: ' + JSON.stringify($rootScope.uselected));
                $rootScope.uselected = $rootScope.uselected.map(function(obj) {
                    return obj;
                }).join('$');
                 console.log('unselected : ' + JSON.stringify($rootScope.uselected));
             }else{
                $rootScope.uselected ='$';
             }
                
                 
                console.log(' unselected driverIds : ' + JSON.stringify($rootScope.uselected));
                DriverPaymentCycles.paymentConfirmation({
                    paymentCycleId: $rootScope.paymentCycleId,
                    driverId: $rootScope.uselected
                }, function(success) {
                    console.log('success' + JSON.stringify(success));
                    $.notify('Payment cycle Completed successfully.', {
                        status: 'success'
                    });
                    $rootScope.completeFlag = true;
                     $state.go('app.paymentCyclePrint');

                }, function(error) {
                    console.log('error' + JSON.stringify(error));
                });
            }
            $scope.fetchPaymentCycleDetails = function() {


                //$rootScope.cycleId = $localStorage.get('cycleId');
                DriverPaymentCycleDetails.find({
                    filter: {
                        where: {
                            driverPaymentCycleId: $rootScope.search.paymentId
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
                                $rootScope.uselected = [];
                                if ($rootScope.data.length > 0) {
                                    for (var k = 0; k < $rootScope.data.length; k++) {
                                        if ($rootScope.uselected.indexOf($rootScope.data[k].driverId) == -1) {

                                            $rootScope.uselected.push($rootScope.data[k].driverId);
                                            console.log('push driver id:' + JSON.stringify($scope.uselected));


                                        }

                                    }
                                   }

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
                if (cnt == 0) {
                    $rootScope.uselected = [];

                    console.log('CNT:' + JSON.stringify(cnt));
                    console.log('selected bookingId is:' + JSON.stringify($rootScope.uselected));

                    console.log('array :' + JSON.stringify($rootScope.uselected));

                    console.log('all bookingId s:' + JSON.stringify($rootScope.data.length));

                    var num = $rootScope.data.length;
                    console.log('selected bookingId s' + JSON.stringify(num));
                    for (var i = 0; i < num; i++) {

                        /*$rootScope.selectCustomer($rootScope.customerData[i].contactNo);*/
                        if ($rootScope.uselected.indexOf($rootScope.data[i].driverId) == -1) {

                            $scope.selct.push($rootScope.data[i].driverId);
                            console.log('push booking id:' + JSON.stringify($rootScope.uselected));
                            
                        } else {

                            for (var j = $rootScope.uselected.length - 1; j >= 0; j--) {

                                if ($rootScope.uselected[j] == $rootScope.data[i].driverId) {
                                    console.log('duplicate bookingId is:' + JSON.stringify($rootScope.data[i].driverId));

                                    $rootScope.uselected.splice(j, 0);
                                    console.log('deleted bookingId is:' + JSON.stringify($rootScope.data[i].driverId));
                                     
                                }

                            }


                        }
                        console.log('array number--:' + JSON.stringify($rootScope.uselected));


                         
                        console.log('root number:' + JSON.stringify($rootScope.uselected));
                        cnt = 1;
                    }

                    console.log('CNT ++:' + JSON.stringify(cnt));
                } else {

                   for(var k=0; k<$rootScope.data.length; k++){
                                        if ($rootScope.uselected.indexOf($rootScope.data[k].driverId) == -1) {

                            $rootScope.uselected.push($rootScope.data[k].driverId);
                            console.log('push driver id:' + JSON.stringify($scope.uselected));
                            

                        }
                                         
                                    }
                     

                    $scope.count1 = 0;
                    cnt = 0;
                    console.log('else bookingId:' + JSON.stringify($rootScope.uselected));

                }

                 
                console.log('unselected: ' +JSON.stringify($rootScope.uselected));
            };

            $rootScope.selectDriver = function(driverId, driverShare) {

                if ($rootScope.uselected.indexOf(driverId) == -1) {

                    $rootScope.uselected.push(driverId);

                } else {

                    for (var i = $rootScope.uselected.length - 1; i >= 0; i--) {

                        if ($rootScope.uselected[i] == driverId) {
                            console.log('duplicate id is:' + JSON.stringify(driverId));
                            $rootScope.uselected.splice(i, 1);
                            console.log('deleted number is:' + JSON.stringify(driverId));

                        }

                    }
                }

                console.log('unselected: ' + JSON.stringify($rootScope.uselected));


            };

            $scope.back = function() {
                $state.go('app.paymentCycleResult');
            }

            $scope.backFromPrint = function() {
                if (!angular.isUndefined($rootScope.search)) {

                    $state.go('app.paymentCycleDriverDetails');

                } else {
                    $state.go('app.paymentCycleResult');
                }



            }

            $rootScope.print = function() {

                printElement(document.getElementById("printThis"));
                var modThis = document.querySelector("#printSection");
                //modThis.appendChild(document.createTextNode(" new"));
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

            $rootScope.searchPaymentCycleById = function(paymentData) {
                $rootScope.loader = 1;
                //$scope.paymentCycleSearchData = $localStorage.get('paymentCycleData');
                //console.log('paymentCycleSearchData ' + JSON.stringify($scope.paymentCycleSearchData));
                var allPaymentData = [];
                DriverPaymentCycles.find({
                    filter: {
                        where: {

                            id: paymentData.paymentCycleId

                        }
                    }
                }, function(cycleData) {
                    console.log('cycleData: ' + JSON.stringify(cycleData));

                    for (var i = 0; i < cycleData.length; i++) {
                        var createdDate = moment(cycleData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');


                        allPaymentData.push({
                            paymentId: cycleData[i].id,
                            cycleName: cycleData[i].paymentCycleName,
                            paymentCycleStatus: cycleData[i].paymentCycleStatus,
                            createdDate: createdDate
                        });
                    }
                    $rootScope.fetchedPaymentData = allPaymentData;
                    $rootScope.data = allPaymentData;
                    console.log('booking data****** ' + JSON.stringify($rootScope.data));
                    $scope.orginalData = allPaymentData;
                    createTable();
                    $rootScope.loader = 0;

                }, function(cycleErr) {
                    console.log('cycleErr: ' + JSON.stringify(cycleErr));
                    $rootScope.loader = 0;
                });
            }
            $rootScope.searchAllPaymentCycle = function() {
                $rootScope.loader = 1;
                //$scope.paymentCycleSearchData = $localStorage.get('paymentCycleData');
                //console.log('paymentCycleSearchData ' + JSON.stringify($scope.paymentCycleSearchData));

                var allPaymentData = [];
                DriverPaymentCycles.find({

                }, function(cycleData) {
                    console.log('cycleData: ' + JSON.stringify(cycleData));
                    for (var i = 0; i < cycleData.length; i++) {

                        var createdDate = moment(cycleData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                        allPaymentData.push({
                            paymentId: cycleData[i].id,
                            cycleName: cycleData[i].paymentCycleName,
                            paymentCycleStatus: cycleData[i].paymentCycleStatus,
                            createdDate: createdDate
                        });
                    }
                    $rootScope.fetchedPaymentData = allPaymentData;
                    $rootScope.data = allPaymentData;
                    console.log('booking data****** ' + JSON.stringify($rootScope.data));
                    $scope.orginalData = allPaymentData;
                    createTable();
                    $rootScope.loader = 0;
                }, function(cycleErr) {
                    console.log('cycleErr: ' + JSON.stringify(cycleErr));
                    $rootScope.loader = 0;
                });
            }

            $rootScope.bookingDetailsPopup = function(payment) {

                $rootScope.paymentDriverId = payment.driverId;

                var modalInstance = $modal.open({
                    templateUrl: '/bookingDetails.html',
                    controller: bookingDetailsPopupCtrl,
                    windowClass: 'app-modal-window'
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });

            };

            var bookingDetailsPopupCtrl = function($scope, $rootScope, $modalInstance, Bookings, DriverPaymentCycleDetails) {

                $scope.closeModal = function() {
                    $rootScope.paymentDriverId = undefined;
                    $modalInstance.dismiss('cancel');

                };

                $scope.getBookingDetails = function() {

                    DriverPaymentCycleDetails.find({
                        filter: {
                            where: {
                                driverPaymentCycleId: $rootScope.search.paymentId,
                                driverId: $rootScope.paymentDriverId
                            }
                        }
                    }, function(paymentDetails) {
                        console.log('payment details***' + JSON.stringify(paymentDetails));
                        var allBookingData = [];
                        for (var i = 0; i < paymentDetails.length; i++) {
                            var bookingId = paymentDetails[i].bookingId;
                            Bookings.find({
                                filter: {
                                    where: {
                                        id: bookingId
                                    },
                                    order: ['reportingDate DESC', 'reportingTime DESC'],
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
                                console.log('Booking data  ' + JSON.stringify(bookingData));

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
                                    var amount = '-';
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
                                        //parsedDrvShare = driverShare.toFixed(2);
                                        //anis
                                    }
                                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                                        idShare = bookingData[i].idShare.toFixed(2);
                                        //parsedIdShare = idShare.toFixed(2);
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
                                        reportingLocation: landmark + bookingData[i].pickAddress,
                                        releavingLocation: bookingData[i].dropAddress,
                                        paymentMethod: bookingData[i].paymentMethod,
                                        status: bookingData[i].status,
                                        reportingDate: bookingData[i].reportingDate,
                                        reportingTime: bookingData[i].reportingTime,
                                        reportingDateAndTime: bookingData[i].reportingDate + ' ' + bookingData[i].reportingTime,
                                        releavingDate: relDate,
                                        releavingTime: relTime,
                                        driverShare: driverShare,
                                        idShare: idShare,
                                        dutyType: dutyType,
                                        driverPaymentStatus: bookingData[i].driverPaymentStatus
                                    });
                                }
                                $rootScope.driverBookingDetails = allBookingData;
                                $scope.data = allBookingData;
                                console.log('booking data****** ' + JSON.stringify($scope.data));

                                //createTable();
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
                    }, function(bookingErr) {
                        console.log('booking error***' + JSON.stringify(bookingErr));
                    });

                }

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
