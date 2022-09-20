App.controller('paymentCycleDetailsCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
        '$cookieStore', 'orderByFilter', '$modal', '$state', '$base64', '$http', '$localStorage', 'DriverPaymentCycleDetails', 'DriverPaymentCycles', 'Bookings', 'DriverDetails',
        function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
            $cookieStore, orderByFilter, $modal, $state, $base64, $http, $localStorage, DriverPaymentCycleDetails, DriverPaymentCycles, Bookings, DriverDetails) {
            'use strict';

 

            $rootScope.userId = $localStorage.get('userId');

            $rootScope.paymentCyclePage = function() {

                $state.go('app.paymentCycle');

            }

            var paymentCycleID = $rootScope.paymentCycleId;
            $scope.paymentCycleName = $rootScope.paymentCycleName1;
            $rootScope.getPaymentCycleDetails = function() {


                $rootScope.loader = 1;
                $rootScope.customerData = [];
                var allPaymentData = [];
                DriverPaymentCycleDetails.find({
                    filter: {
                        where: {
                            driverPaymentCycleId: paymentCycleID
                        }
                    }
                }, function(paymentCycleDetails) {
                    console.log('payment cycle details ' + JSON.stringify(paymentCycleDetails));

                    for (var i = 0; i < paymentCycleDetails.length; i++) {


                        allPaymentData.push({
                            id: paymentCycleDetails[i].id,
                            driverPaymentCycleId: paymentCycleDetails[i].driverPaymentCycleId,
                            driverId: paymentCycleDetails[i].driverId,
                            bookingId: paymentCycleDetails[i].bookingId,
                            driverShare: paymentCycleDetails[i].driverShare
                        });

                    }

                    $rootScope.data = allPaymentData;
                    console.log('payment cycle Data ' + JSON.stringify($rootScope.data));
                    createTable();
                    $rootScope.loader = 0;


                }, function(paymentErr) {
                    $rootScope.loader = 0;
                    console.log('payment error ' + JSON.stringify(paymentErr));
                });

            };

            $rootScope.getAllCustomer = function() {
                $scope.count = 0;
                loadFunc();

            };
            $rootScope.backTopaymentSection = function() {

                $state.go('app.paymentCycle');
                $scope.searchData1 = false;
            }
            $rootScope.backTopaymentSection1 = function() {
                $state.go('app.paymentCycleBookingDetails');
            }
            $rootScope.generatePayment = function() {
                $rootScope.loader = 1;
                var allPaymentCycleData = [];
                console.log('booking length' + $rootScope.number.length);
                $scope.numberCount = $rootScope.number.length;
                for (var j = 0; j < $rootScope.number.length; j++) {

                    console.log('$rootScope.number: ' + JSON.stringify($rootScope.number[j]));
                    var bookingId = $rootScope.number[j];

                    Bookings.findOne({
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
                    }, function(generateDriverPaymentCycle) {
                        console.log('Booking Unsetteled Data  ' + JSON.stringify(generateDriverPaymentCycle));
                        var cname = '-';
                        var cfName = '-';
                        var cmName = '-';
                        var clName = '-';
                        var cid = '';
                        var cellNumber = '-';

                        if (!angular.isUndefined(generateDriverPaymentCycle.customerDetails)) {

                            if (!angular.isUndefined(generateDriverPaymentCycle.customerDetails.conUsers)) {
                                if (angular.isUndefined(generateDriverPaymentCycle.customerDetails.conUsers.middleName) || generateDriverPaymentCycle.customerDetails.conUsers.middleName === null) {

                                    cfName = generateDriverPaymentCycle.customerDetails.conUsers.firstName;
                                    clName = generateDriverPaymentCycle.customerDetails.conUsers.lastName;
                                    cname = cfName + ' ' + clName;
                                    cid = generateDriverPaymentCycle.customerDetails.id;
                                } else {

                                    cfName = generateDriverPaymentCycle.customerDetails.conUsers.firstName;
                                    cmName = generateDriverPaymentCycle.customerDetails.conUsers.middleName;
                                    clName = generateDriverPaymentCycle.customerDetails.conUsers.lastName;
                                    cname = cfName + ' ' + cmName + ' ' + clName;
                                }
                                if (!angular.isUndefined(generateDriverPaymentCycle.customerDetails.conUsers.mobileNumber) || generateDriverPaymentCycle.customerDetails.conUsers.mobileNumber !== null || generateDriverPaymentCycle.customerDetails.conUsers.mobileNumber !== '') {
                                    cellNumber = generateDriverPaymentCycle.customerDetails.conUsers.mobileNumber;
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

                        if (generateDriverPaymentCycle.outstationBookings.length > 0) {
                            if (generateDriverPaymentCycle.outstationBookings[0].releavingDate != null || generateDriverPaymentCycle.outstationBookings[0].releavingDate != '') {
                                relDate = generateDriverPaymentCycle.outstationBookings[0].releavingDate;
                                relTime = generateDriverPaymentCycle.outstationBookings[0].releavingTime;
                            }

                        } else {
                            if (generateDriverPaymentCycle.invoices.length > 0) {
                                if (!angular.isUndefined(generateDriverPaymentCycle.invoices[0].releavingDate) || generateDriverPaymentCycle.invoices[0].releavingDate !== null || generateDriverPaymentCycle.invoices[0].releavingDate !== '') {
                                    relDate = generateDriverPaymentCycle.invoices[0].releavingDate;
                                }
                                if (!angular.isUndefined(generateDriverPaymentCycle.invoices[0].releavingTime) || generateDriverPaymentCycle.invoices[0].releavingTime !== null || generateDriverPaymentCycle.invoices[0].releavingTime !== '') {
                                    relTime = generateDriverPaymentCycle.invoices[0].releavingTime;
                                }
                            } else {

                            }
                        }

                        if (!angular.isUndefined(generateDriverPaymentCycle.driverDetails)) {

                            if (!angular.isUndefined(generateDriverPaymentCycle.driverDetails.conUsers)) {
                                if (angular.isUndefined(generateDriverPaymentCycle.driverDetails.conUsers.middleName) || generateDriverPaymentCycle.driverDetails.conUsers.middleName === null) {
                                    dfName = generateDriverPaymentCycle.driverDetails.conUsers.firstName;
                                    dlName = generateDriverPaymentCycle.driverDetails.conUsers.lastName;
                                    dname = dfName + ' ' + dlName;
                                } else {
                                    dfName = generateDriverPaymentCycle.driverDetails.conUsers.firstName;
                                    dmName = generateDriverPaymentCycle.driverDetails.conUsers.middleName;
                                    dlName = generateDriverPaymentCycle.driverDetails.conUsers.lastName;
                                    dname = dfName + ' ' + dmName + ' ' + dlName;
                                }

                            }
                            if (!angular.isUndefined(generateDriverPaymentCycle.driverDetails.id)) {
                                drvId = generateDriverPaymentCycle.driverDetails.id;
                            }
                        }
                        var amount = '-';
                        if (!angular.isUndefined(generateDriverPaymentCycle.invoices) && (generateDriverPaymentCycle.invoices.length >= 1)) {
                            if (!angular.isUndefined(generateDriverPaymentCycle.invoices[0].netAmount)) {
                                actualAmount = generateDriverPaymentCycle.invoices[0].netAmount;
                                amount = actualAmount.toFixed(2);

                            }
                        }
                        if (!angular.isUndefined(generateDriverPaymentCycle.invoices) && (generateDriverPaymentCycle.invoices.length == 1)) {
                            if (!angular.isUndefined(generateDriverPaymentCycle.invoices[0].grossAmount)) {

                                estimatedAmount = generateDriverPaymentCycle.invoices[0].grossAmount;
                            }
                        }

                        var driverShare = '0';
                        var idShare = '0';
                        var parsedDrvShare = '0';
                        var parsedIdShare = '0';
                        if (generateDriverPaymentCycle.driverShare != null && (!angular.isUndefined(generateDriverPaymentCycle.driverShare))) {
                            driverShare = generateDriverPaymentCycle.driverShare.toFixed(2);

                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (generateDriverPaymentCycle.idShare != null && (!angular.isUndefined(generateDriverPaymentCycle.idShare))) {
                            idShare = generateDriverPaymentCycle.idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }
                        var landmark = ' ';
                        if (!angular.isUndefined(generateDriverPaymentCycle.landmark) || generateDriverPaymentCycle.landmark !== null || generateDriverPaymentCycle.landmark !== '') {
                            landmark = generateDriverPaymentCycle.landmark + ', ';
                        }

                        var dutyType = '';
                        if (!angular.isUndefined(generateDriverPaymentCycle.isOutstation) || generateDriverPaymentCycle.isOutstation !== null || generateDriverPaymentCycle.landmark !== '') {
                            if (generateDriverPaymentCycle.isOutstation == true) {
                                dutyType = 'O';
                            } else {
                                dutyType = 'L';
                            }
                        }


                        allPaymentCycleData.push({
                            bookingId: generateDriverPaymentCycle.id,
                            customerId: cid,
                            custName: cname,
                            mobileNumber: cellNumber,
                            carType: generateDriverPaymentCycle.carType,
                            drvName: dname,
                            driverId: generateDriverPaymentCycle.driverId,
                            drvmobile: generateDriverPaymentCycle.driverDetails.conUsers.mobileNumber,
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
                            reportingLocation: landmark + generateDriverPaymentCycle.pickAddress,
                            releavingLocation: generateDriverPaymentCycle.dropAddress,
                            paymentMethod: generateDriverPaymentCycle.paymentMethod,
                            status: generateDriverPaymentCycle.status,
                            reportingDate: generateDriverPaymentCycle.reportingDate,
                            reportingTime: generateDriverPaymentCycle.reportingTime,
                            reportingDateAndTime: generateDriverPaymentCycle.reportingDate + ' ' + generateDriverPaymentCycle.reportingTime,
                            releavingDate: relDate,
                            releavingTime: relTime,
                            driverShare: driverShare,
                            idShare: idShare,
                            dutyType: dutyType,
                            driverPaymentStatus: generateDriverPaymentCycle.driverPaymentStatus
                        });

                        $scope.numberCount--;

                        if ($scope.numberCount === 0) {
                            $rootScope.data = allPaymentCycleData;
                            console.log('generated payment cycle data****** :' + JSON.stringify($rootScope.data));
                            createTable();
                            $rootScope.loader = 0;

                        }
                    }, function(bookErr) {
                        console.log('booking error ' + JSON.stringify(bookErr));
                        if (bookErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                        $rootScope.loader = 0;
                    });

                }



            };
            $rootScope.print = function() {
                console.log('booking ids: ' + JSON.stringify($rootScope.number));
                for (var j = 0; j < $rootScope.number.length; j++) {

                    console.log('$rootScope.number: ' + JSON.stringify($rootScope.number[j]));
                    var bookingId = $rootScope.number[j];
                    /* Bookings.findOne({

                             filter: {
                                 where: {
                                     id: bookingId
                                      
                                 }
                             }
                         }, function(suc) {
                             console.log('save payment method success: ' + JSON.stringify(suc));

                             suc.updatedBy = $rootScope.userId;
                             suc.updatedDate = new Date();
                             suc.driverPaymentStatus = 'In Process';
                             suc.status = 'Paid';
                             suc.$save();
                              
                            
                              
                         }, function(err) {
                             console.log('error in save payment method' + JSON.stringify(err));
                         });*/
                }
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
            $rootScope.checkAll3 = function(payment) {
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
            $rootScope.selectCustomer3 = function(bookingId, driverShare) {
                if ($scope.selct.length !== null) {
                    $scope.select = $scope.selct;
                }
                console.log('Slect number: ' + JSON.stringify($scope.selct));
                console.log('bookingId : ' + JSON.stringify(bookingId));
                var driverShare1 = 0;


                if ($scope.select.indexOf(bookingId) == -1) {

                    $scope.select.push(bookingId);
                    console.log('push number:' + JSON.stringify($scope.select));

                    $scope.count1++;
                    console.log('count:' + JSON.stringify($scope.count));
                } else {

                    for (var i = $scope.select.length - 1; i >= 0; i--) {

                        if ($scope.select[i] == bookingId) {
                            console.log('duplicate id is:' + JSON.stringify(bookingId));
                            // $rootScope.driverShare = driverShare1+Number(driverShare);
                            $scope.select.splice(i, 1);
                            console.log('deleted number is:' + JSON.stringify(bookingId));
                            $scope.count1--;
                            console.log('count:' + JSON.stringify($scope.count));
                        }

                    }


                }
                console.log('array number:' + JSON.stringify($scope.select));

                $rootScope.number = $scope.select;
            };

            var cnt = 0;
            $scope.count1 = 0;
            $scope.selct = [];

            $rootScope.selectAllCustomer3 = function() {

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
                            $scope.count1++;
                            console.log('count:' + JSON.stringify($scope.cont));
                        } else {

                            for (var j = $scope.selct.length - 1; j >= 0; j--) {

                                if ($scope.selct[j] == $rootScope.data[i].bookingId) {
                                    console.log('duplicate bookingId is:' + JSON.stringify($rootScope.data[i].bookingId));

                                    $scope.selct.splice(j, 0);
                                    console.log('deleted bookingId is:' + JSON.stringify($rootScope.data[i].bookingId));
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

            $scope.generatePaymentPopup = function() {
                $state.go('app.paymentCycleDetails');

                /*// console.log('create popup called.' + modelAssetId);
                var modalInstance = $modal.open({
                    templateUrl: '/generatePayment.html',
                    controller: GeneratePaymentCtrl
                });

                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });*/
            };

 
            $scope.generatePaymentdriverPopup = function() {
                $state.go('app.paymentCycleDetailsdriver');

            };

            function getAllBookings(bookingId) {
                var AllBooking = [];
                for (var j = 0; j < bookingId.length; j++) {
                    $scope.numberCount = bookingId.length;
                    console.log('booking ids: ' + JSON.stringify(bookingId[j]));
                    var booking_Id = bookingId[j];

                    Bookings.findOne({
                        filter: {
                            where: {
                                id: booking_Id
                            }
                        }
                    }, function(booking) {
                        console.log('booking :' + JSON.stringify(booking));
                        AllBooking.push({
                            bookingId: booking.id,
                            driverId: booking.driverId,
                            driverShare: booking.driverShare
                        });
                        $scope.numberCount--
                            if ($scope.numberCount === 0) {
                                $rootScope.data = AllBooking;
                                $rootScope.idDetails = $rootScope.data;
                                console.log('id s : ' + JSON.stringify($rootScope.data));
                                createTable();
                            }

                    }, function(bookingerr) {
                        console.log('error booking: ' + JSON.stringify(bookingerr));

                    });
                }



            };

            $rootScope.generatePaymentCycledrive = function() {
                $rootScope.loader = 1;
                var AllBooking = [];
                var allPaymentCycleData = [];
                console.log('booking length' + JSON.stringify($rootScope.number));
                for (var j = 0; j < $rootScope.number.length; j++) {
                    $scope.numberCount = $rootScope.number.length;
                    console.log('booking ids: ' + JSON.stringify($rootScope.number[j]));
                    var booking_Id = $rootScope.number[j];

                    Bookings.findOne({
                        filter: {
                            where: {
                                id: booking_Id
                            }
                        }
                    }, function(booking) {
                        console.log('booking :' + JSON.stringify(booking));
                        AllBooking.push({
                            bookingId: booking.id,
                            driverId: booking.driverId,
                            driverShare: booking.driverShare
                        });
                        $scope.numberCount--
                            if ($scope.numberCount === 0) {
                                $rootScope.data = AllBooking;
                                $rootScope.idDetails = $rootScope.data;
                                console.log('id s : ' + JSON.stringify($rootScope.data));

                                var date = new Date();
                                var weekday = new Array(7);
                                weekday[0] = "Sunday";
                                weekday[1] = "Monday";
                                weekday[2] = "Tuesday";
                                weekday[3] = "Wednesday";
                                weekday[4] = "Thursday";
                                weekday[5] = "Friday";
                                weekday[6] = "Saturday";

                                var n = weekday[date.getDay()];
                                var date = $filter('date')(new Date(date), 'medium');
                                date = date + ' ' + n;
                                var newDate = new Date();
                                DriverPaymentCycles.create({
                                        paymentCycleName: date,
                                        paymentDate: newDate,
                                        createdBy: $rootScope.userId,
                                        createdDate: newDate,
                                        paymentCycleStatus: 'In Process'
                                    }, function(paymentCycle) {
                                        console.log('paymentCycle: ' + JSON.stringify(paymentCycle));
                                        $rootScope.paymentCycleId = paymentCycle.id;
                                        var paymentCycleId = paymentCycle.id;
                                        for (var i = 0; i < $rootScope.idDetails.length; i++) {
                                            $scope.countdata = $rootScope.idDetails.length;
                                            DriverPaymentCycles.generatePaymentCycle({
                                                paymentCycleId: paymentCycleId,

                                                driverId: $rootScope.idDetails[i].driverId,
                                                bookingId: $rootScope.idDetails[i].bookingId,
                                                driverShare: $rootScope.idDetails[i].driverShare,
                                                createdBy: $rootScope.userId,
                                                createdDate: date
                                            }, function(successData) {
                                                console.log('generate payment cycle success' + JSON.stringify(successData));
                                                $scope.countdata--;
                                                if ($scope.countdata === 0) {
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
                                                            //$scope.tableParams3.reload();
                                                            $.notify('Payment Successfull ID is: ' + $rootScope.paymentCycleId + '.', {
                                                                status: 'success'
                                                            });
                                                            $rootScope.loader = 0;
                                                        },
                                                        function(er) {
                                                            console.log('error: ' + JSON.stringify(er));
                                                        });

                                                }



                                            }, function(successErr) {
                                                console.log('generate payment cycle error' + JSON.stringify(successErr));
                                            });


                                        }
                                    },
                                    function(er) {
                                        console.log('error: ' + JSON.stringify(er));
                                    });
                            }

                    }, function(bookingerr) {
                        console.log('error booking: ' + JSON.stringify(bookingerr));

                    });
                }



                /* 
                 */ //zeba

                /*console.log('share: '+JSON.stringify($rootScope.driverShare));
                 $rootScope.loader = 1;
                var allPaymentCycleData = [];
                $scope.select = [];
                console.log('booking length' +$rootScope.number.length);
                $scope.numberCount = $rootScope.number.length;

        for (var j = 0; j < $rootScope.number.length; j++) {
                         
        console.log('$rootScope.number: ' + JSON.stringify($rootScope.number[j]));
          var driverId = $rootScope.number[j].driver_id;      
          var amount = $rootScope.number[j].total.toFixed(2);
         DriverDetails.findOne({
                    filter: {
                        where:{
                            id:$rootScope.number[j].driver_id
                        },
                    
                        include: {
                            relation: 'conUsers'
                        
                        }
                }
            }, function(generateDriverPaymentCycle) {
            console.log('Booking Unsetteled Data  ' + JSON.stringify(generateDriverPaymentCycle));
             var cname = '-';
                var cfName = '-';
                var cmName = '-';
                var clName = '-';
                 
                var cellNumber = '-';

                 var drvId = '';
                var dname = '-';
                var dfName = '-';
                var dmName = '-';
                var dlName = '-';
                var relDate = '-';
                var relTime = '-';
                var actualAmount = '-';
                var estimatedAmount = '-';

                 

                if (!angular.isUndefined(generateDriverPaymentCycle)) {

                    if (!angular.isUndefined(generateDriverPaymentCycle.conUsers)) {
                        if (angular.isUndefined(generateDriverPaymentCycle.conUsers.middleName) || generateDriverPaymentCycle.conUsers.middleName === null) {
                            dfName = generateDriverPaymentCycle.conUsers.firstName;
                            dlName = generateDriverPaymentCycle.conUsers.lastName;
                            dname = dfName + ' ' + dlName;
                        } else {
                            dfName = generateDriverPaymentCycle.conUsers.firstName;
                            dmName = generateDriverPaymentCycle.conUsers.middleName;
                            dlName = generateDriverPaymentCycle.conUsers.lastName;
                            dname = dfName + ' ' + dmName + ' ' + dlName;
                        }

                    }
                    if (!angular.isUndefined(generateDriverPaymentCycle.id)) {
                        drvId = generateDriverPaymentCycle.id;
                    }
                }
                
              allPaymentCycleData.push({
                    drvName: dname,
                    bankName:generateDriverPaymentCycle.bankName,
                    accountNumber:generateDriverPaymentCycle.accountNumber,
                    ifscCode:generateDriverPaymentCycle.ifscCode,
                    drvmobile:generateDriverPaymentCycle.conUsers.mobileNumber,
                    actualAmt: amount,
                    paymentMode: $scope.paymentMode,
                    driverId: drvId,
                    drvFirstName: dfName,
                    drvMiddleName: dmName,
                    drvLastName: dlName
                     
                });
              console.log('single payment cycle data****** ' + JSON.stringify(allPaymentCycleData));
                $scope.numberCount--;

                 if($scope.numberCount === 0){
                 $rootScope.data = allPaymentCycleData;
                console.log('generated payment cycle data****** ' + JSON.stringify($rootScope.data));
                // create($rootScope.data); 
                 createTable();
                $rootScope.loader = 0;  
                
            }
            }, function(bookErr) {
            console.log('booking error ' + JSON.stringify(bookErr));
            if (bookErr.status == 0) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }

              $rootScope.loader = 0;
        });
             
            }
           */





            };

            function create(driverDetails) {
                $scope.share = [];
                console.log(' number  :' + JSON.stringify($rootScope.data.length));
                for (var j = 0; j < $rootScope.data.length; j++) {
                    if ($scope.select.indexOf($rootScope.data[j].driverId) == -1) {
                        $scope.select.push($rootScope.data[j].driverId);
                        $scope.share.push($rootScope.data[j].driverShare);

                        console.log(' drv id :' + JSON.stringify($rootScope.data[j].driverId));
                        console.log('array :' + JSON.stringify($scope.select));
                        console.log('array :' + JSON.stringify($scope.share));
                        console.log('count:' + JSON.stringify($scope.count));
                    } else {
                        for (var i = $scope.select.length - 1; i >= 0; i--) {

                            if ($scope.select[i] == $rootScope.data[j].driverId) {

                                console.log('duplicate driverId is:' + JSON.stringify($rootScope.data[j].driverId));
                                var total = Number($scope.share[i]) + Number($rootScope.data[j].driverShare);

                                $scope.share.push(total);
                                console.log('array :' + JSON.stringify($scope.share));
                                console.log('list:' + JSON.stringify($scope.select));


                            }

                        }
                    }

                }


            }

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
