App.controller('manageSettlementReport', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout',
    '$cookieStore', 'orderByFilter', '$modal', '$state', 'DriverDetails', 'ConUsers', '$localStorage', '$http', '$window', 'Bookings', 'UserRoles', 'BookingPaymentTransaction',

    function manageSettlementReport($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, orderByFilter, $modal, $state, DriverDetails, ConUsers, $localStorage, $http, $window, Bookings, UserRoles, BookingPaymentTransaction) {
        'use strict';

        $scope.driverId = $localStorage.get('driverId');

        $scope.statusArray = [{
            'desc': 'All'
        }, {
            'desc': 'Paid'
        }, {
            'desc': 'Done'
        }, {
            'desc': 'Settled'
        }, {
            'desc': 'Unsettled'
        }, {
            'desc': 'Hold'
        }, {
            'desc': 'Stopped'
        }];

        $rootScope.searchByStatusFunction = function(searchStatus) {
            //console.log('searchStatus' + searchStatus);
            $localStorage.put('searchStatus', searchStatus);
            if (searchStatus === 'Paid' || searchStatus === 'Done') {
                //console.log('paid or Done :' + searchStatus);
                $scope.searchBookingsByStatus(searchStatus);
            }

            if (searchStatus === 'All') {
                //console.log('all :' + searchStatus);
                $scope.searchAllBookings(searchStatus);
            }
            if (searchStatus === 'Settled' || searchStatus === 'Unsettled' || searchStatus === 'Stopped' || searchStatus === 'Hold') {
                //console.log('settled or Unsettled or hold or stop :' + searchStatus);
                $scope.searchBookingsByPaymentStatus(searchStatus);
            }



        }

        $scope.searchBookingsByStatus = function(searchStatus) {
            $rootScope.loader = 1;
            $rootScope.driverSettlementBookings = [];
            var allSettlementBooking = [];
            var bookingStatus = '';
            if (searchStatus === 'Paid') {
                bookingStatus = 'Paid';
            } else {
                bookingStatus = 'Done';
            }
            Bookings.find({
                filter: {
                    where: {
                        driverId: $scope.driverId,
                        status: bookingStatus
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
                //console.log('booking details' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname;
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid;
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
                    var actualAmount = '-';
                    var amount = '-';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    var collectedByOffice;
                    var collectedByDriver;
                    if (!angular.isUndefined(bookingData[i].paymentMethod) || bookingData[i].paymentMethod != null || bookingData[i].paymentMethod != '') {
                        if (bookingData[i].paymentMethod == 'O' || bookingData[i].paymentMethod == 'C') {
                            collectedByOffice = 'Yes';
                        } else {
                            collectedByOffice = 'No';
                        }
                        if (bookingData[i].paymentMethod == 'D') {
                            collectedByDriver = 'Yes';
                        } else {
                            collectedByDriver = 'No';
                        }
                    }

                    var driverShare;
                    var idShare;
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }

                    allSettlementBooking.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        actualAmt: amount,
                        paymentOffice: collectedByOffice,
                        paymentDriver: collectedByDriver,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus

                    });
                }
                $rootScope.driverSettlementBookings = allSettlementBooking;
                $scope.data = allSettlementBooking;
                $rootScope.settlementBookingData1 = allSettlementBooking;
                $scope.doSearch();
                $rootScope.loader = 0;

            }, function(bookingErr) {
                console.log('booking error' + JSON.stringify(bookingErr));
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
                if (bookingErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
        };

        $scope.searchBookingsByPaymentStatus = function(searchStatus) {
            $rootScope.loader = 1;
            $rootScope.driverSettlementBookings = [];
            var allSettlementBooking = [];
            var paymentStatus = '';
            if (searchStatus === 'Settled') {
                paymentStatus = 'Settled';
            } else if (searchStatus === 'Unsettled') {
                paymentStatus = 'Unsettled';
            } else if (searchStatus === 'Hold') {
                paymentStatus = 'Hold';
            } else {
                paymentStatus = 'Stopped';
            }
            Bookings.find({
                filter: {
                    where: {
                        driverId: $scope.driverId,
                        driverPaymentStatus: paymentStatus
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
                //console.log('booking details' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname;
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid;
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
                    var actualAmount = '-';
                    var amount = '-';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    var collectedByOffice;
                    var collectedByDriver;
                    if (!angular.isUndefined(bookingData[i].paymentMethod) || bookingData[i].paymentMethod != null || bookingData[i].paymentMethod != '') {
                        if (bookingData[i].paymentMethod == 'O' || bookingData[i].paymentMethod == 'C') {
                            collectedByOffice = 'Yes';
                        } else {
                            collectedByOffice = 'No';
                        }
                        if (bookingData[i].paymentMethod == 'D') {
                            collectedByDriver = 'Yes';
                        } else {
                            collectedByDriver = 'No';
                        }
                    }

                    var driverShare;
                    var idShare;
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }

                    allSettlementBooking.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        actualAmt: amount,
                        paymentOffice: collectedByOffice,
                        paymentDriver: collectedByDriver,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus

                    });
                }
                $rootScope.driverSettlementBookings = allSettlementBooking;
                $scope.data = allSettlementBooking;
                $rootScope.settlementBookingData1 = allSettlementBooking;
                $scope.doSearch();
                $rootScope.loader = 0;

            }, function(bookingErr) {
                console.log('booking error' + JSON.stringify(bookingErr));
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
                if (bookingErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
        };


        $scope.searchAllBookings = function(searchStatus) {
            $rootScope.loader = 1;
            $rootScope.driverSettlementBookings = [];
            var allSettlementBooking = [];


            Bookings.find({
                filter: {
                    where: {
                        driverId: $scope.driverId

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
                //console.log('booking details' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname;
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid;
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
                    var actualAmount = '-';
                    var amount = '-';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }
                    var collectedByOffice;
                    var collectedByDriver;
                    if (!angular.isUndefined(bookingData[i].paymentMethod) || bookingData[i].paymentMethod != null || bookingData[i].paymentMethod != '') {
                        if (bookingData[i].paymentMethod == 'O' || bookingData[i].paymentMethod == 'C') {
                            collectedByOffice = 'Yes';
                        } else {
                            collectedByOffice = 'No';
                        }
                        if (bookingData[i].paymentMethod == 'D') {
                            collectedByDriver = 'Yes';
                        } else {
                            collectedByDriver = 'No';
                        }
                    }

                    var driverShare;
                    var idShare;
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }

                    allSettlementBooking.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        actualAmt: amount,
                        paymentMethod: bookingData[i].paymentMethod,
                        paymentOffice: collectedByOffice,
                        paymentDriver: collectedByDriver,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus

                    });
                }
                $rootScope.driverSettlementBookings = allSettlementBooking;
                $scope.data = allSettlementBooking;
                $rootScope.settlementBookingData1 = allSettlementBooking;
                $scope.doSearch();
                $rootScope.loader = 0;

            }, function(bookingErr) {
                console.log('booking error' + JSON.stringify(bookingErr));
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
                if (bookingErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
        };

        $scope.doSearch = function() {
            $rootScope.bId = [];
            $scope.selct = [];
            $scope.selctn = [];
            $rootScope.settlementBookingDetails1 = [];
            $scope.count = 0;
            cnt = 0;
            //$scope.tableParams.total($scope.data.length);
            $scope.tableParams3.reload();
        }
        $scope.showList = function(list) {
            $rootScope.listItems = list;
            //console.log('start duty popup');
            // $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/ShowListPopup.html',
                controller: showListCtrl,
                windowClass: 'app-modal-window-rating'
            });

            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };
        var showListCtrl = function($modalInstance) {
            $rootScope.cancelModel = function() {
                $modalInstance.dismiss('cancel');
                //$rootScope.getSearchHistory();
            };
        }
        $scope.getNumber = function(num) {
            return new Array(num);
        }
        $rootScope.settlementBookingDetails = function() {
            $rootScope.loader = 1;
            $rootScope.driverSettlementBookings = [];
            var allSettlementBooking = [];
            Bookings.find({
                filter: {
                    where: {
                        driverId: $scope.driverId

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
                    }]
                }
            }, function(bookingData) {
                //console.log('booking details' + JSON.stringify(bookingData));

                for (var i = 0; i < bookingData.length; i++) {
                    var cname;
                    var cfName = '-';
                    var cmName = '-';
                    var clName = '-';
                    var cid;
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
                    var actualAmount = '-';
                    var amount = '-';
                    if (!angular.isUndefined(bookingData[i].invoices) && (bookingData[i].invoices.length >= 1)) {
                        if (!angular.isUndefined(bookingData[i].invoices[0].netAmount)) {
                            actualAmount = bookingData[i].invoices[0].netAmount;
                            amount = actualAmount.toFixed(2);

                        }
                    }

                    var collectedByOffice;
                    var collectedByDriver;
                    if (!angular.isUndefined(bookingData[i].paymentMethod) || bookingData[i].paymentMethod != null || bookingData[i].paymentMethod != '') {
                        if (bookingData[i].paymentMethod == 'O' || bookingData[i].paymentMethod == 'C') {
                            collectedByOffice = 'Yes';
                        } else {
                            collectedByOffice = 'No';
                        }
                        if (bookingData[i].paymentMethod == 'D') {
                            collectedByDriver = 'Yes';
                        } else {
                            collectedByDriver = 'No';
                        }
                    }

                    var driverShare;
                    var idShare;
                    if (bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))) {
                        driverShare = bookingData[i].driverShare.toFixed(2);

                    }
                    if (bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))) {
                        idShare = bookingData[i].idShare.toFixed(2);

                    }
                    var dutyType = '';
                    if (!angular.isUndefined(bookingData[i].isOutstation) || bookingData[i].isOutstation !== null || bookingData[i].isOutstation !== '') {
                        if (bookingData[i].isOutstation == true) {
                            dutyType = 'O';
                        } else {
                            dutyType = 'L';
                        }
                    }

                    var list = [];
                    if (bookingData[i].bookingRating.length !== 0) {
                        if (bookingData[i].bookingRating[0].bookingRatingDetails.length !== 0) {
                            for (var k = 0; k < bookingData[i].bookingRating[0].bookingRatingDetails.length; k++) {
                                list.push(bookingData[i].bookingRating[0].bookingRatingDetails[k].ratingAnswer);
                            }

                        }
                    }
                    var rateCount = 0;
                    if (angular.isDefined(bookingData[i].rateCount) || bookingData[i].rateCount !== null) {
                        rateCount = bookingData[i].rateCount;
                    }

                    allSettlementBooking.push({
                        bookingId: bookingData[i].id,
                        customerId: cid,
                        custName: cname,
                        mobileNumber: cellNumber,
                        actualAmt: amount,
                        paymentMethod: bookingData[i].paymentMethod,
                        paymentOffice: collectedByOffice,
                        paymentDriver: collectedByDriver,
                        status: bookingData[i].status,
                        reportingDate: bookingData[i].reportingDate,
                        reportingTime: bookingData[i].reportingTime,
                        releavingDate: bookingData[i].invoices[0].releavingDate,
                        releavingTime: bookingData[i].invoices[0].releavingTime,
                        driverShare: driverShare,
                        idShare: idShare,
                        dutyType: dutyType,
                        driverPaymentStatus: bookingData[i].driverPaymentStatus,
                        list: list,
                        rating: rateCount

                    });
                }
                $rootScope.driverSettlementBookings = allSettlementBooking;
                $scope.data = allSettlementBooking;
                $rootScope.settlementBookingData1 = allSettlementBooking;
                createTable();
                $rootScope.loader = 0;

            }, function(bookingErr) {
                console.log('booking error' + JSON.stringify(bookingErr));
                
                $rootScope.loader = 0;
                if (bookingErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
        };

        $rootScope.backToReport = function() {
            $state.go('app.manageDriver');
        }

        $scope.count = 0;
        $scope.select = [];
        $scope.selectN = [];
        var bookingArray = [];

        $rootScope.selectedBookings = function(user) {

            if ($scope.selct.length !== null) {
                $scope.select = $scope.selct;

            }

            if ($scope.select.indexOf(user) == -1) {

                $scope.select.push(user);
                $scope.count++;

            } else {
                for (var i = $scope.select.length - 1; i >= 0; i--) {

                    if ($scope.select[i] == user) {

                        $scope.select.splice(i, 1);
                        $scope.count--;

                    }

                }


            }
            $rootScope.disabledFlag = $scope.select;
            $rootScope.bId = $scope.select;
            $rootScope.settlementBookingDetails1 = $scope.select;
            //console.log('array number:' + JSON.stringify($scope.select));
        };

        $scope.changePaymentStatus = function(bookingId) {
            $rootScope.loader = 1;
            //console.log('booking id of change payment status***' + JSON.stringify(bookingId));
            if (angular.isDefined(bookingId) && bookingId !== null) {
                Bookings.findById({
                        id: bookingId
                    },
                    function(Bookings) {
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
                        //$window.location.reload(); 

                        $rootScope.settlementBookingDetails();
                        reloadFunc();
                        $rootScope.loader = 0;


                    },
                    function(error) {
                        console.log('Error updating User : ' + JSON.stringify(error));
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
            }
        };

        $scope.holdBookingConfirm = function() {

            if ($window.confirm("Are you sure you want to hold all these bookings?")) {
                $scope.result = "Yes";

                var count = 0;
                var count1 = 0;

                for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {
                    if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Settled') {
                        $scope.alertMsg1 = 'Can not change the payment status of settled booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'In Process') {
                        $scope.alertMsg1 = 'Can not change the payment status of In Process booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'Line Up') {
                        $scope.alertMsg1 = 'Can not change the payment status of Line Up booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'On Duty') {
                        $scope.alertMsg1 = 'Can not change the payment status of On Duty booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'New Booking') {
                        $scope.alertMsg1 = 'Can not change the payment status of New Booking booking.';
                        count++;
                    } else {

                    }
                }
                if (count > 0) {
                    window.alert($scope.alertMsg1);
                    $scope.alertMsg1 = undefined;
                } else {

                    $scope.holdFunction();
                }
            } else {
                $scope.result = "No";
                $rootScope.settlementBookingDetails();
                reloadFunc();
            }
        }

        $scope.holdFunction = function() {
            $rootScope.loader = 1;
            //console.log('bookings of payment status to hold***' + JSON.stringify($rootScope.settlementBookingDetails1));
            var len = $rootScope.settlementBookingDetails1.length;
            var numCnt = len;
            for (var i = 0; i < len; i++) {

                Bookings.findById({
                        id: $rootScope.settlementBookingDetails1[i].bookingId
                    },
                    function(Bookings) {
                        //console.log('searched booking data***' + JSON.stringify(Bookings));
                        Bookings.driverPaymentStatus = 'Hold';
                        Bookings.updatedBy = $localStorage.get('userId');
                        Bookings.updatedDate = new Date();
                        Bookings.$save();

                        numCnt--;
                        if (numCnt == 0) {
                            $rootScope.settlementBookingDetails();
                            reloadFunc();
                            $rootScope.loader = 0;
                        }


                    },
                    function(error) {
                        console.log('Error updating User : ' + JSON.stringify(error));

                        $rootScope.loader = 0;
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
            }

        };

        $scope.unholdBookingConfirm = function() {

            if ($window.confirm("Are you sure you want to unhold all these bookings?")) {
                $scope.result = "Yes";
                var count = 0;
                var count1 = 0;

                for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {
                    if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Settled') {
                        $scope.alertMsg2 = 'Can not change the payment status of settled booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'In Process') {
                        $scope.alertMsg2 = 'Can not change the payment status of In Process booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'Line Up') {
                        $scope.alertMsg2 = 'Can not change the payment status of Line Up booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'On Duty') {
                        $scope.alertMsg2 = 'Can not change the payment status of On Duty booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'New Booking') {
                        $scope.alertMsg2 = 'Can not change the payment status of New Booking booking.';
                        count++;
                    } else {

                    }
                }
                if (count > 0) {
                    window.alert($scope.alertMsg2);
                    $scope.alertMsg2 = undefined;
                } else {
                    $scope.unholdFunction();
                }
            } else {
                $scope.result = "No";
                $rootScope.settlementBookingDetails();
                reloadFunc();
            }
        }
        $scope.unholdFunction = function() {
            $rootScope.loader = 1;
            //console.log('bookings of payment status to unhold***' + JSON.stringify($rootScope.settlementBookingDetails1));
            var len = $rootScope.settlementBookingDetails1.length;
            var numCnt = len;
            for (var i = 0; i < len; i++) {

                Bookings.findById({
                        id: $rootScope.settlementBookingDetails1[i].bookingId
                    },
                    function(Bookings) {
                        //console.log('searched booking data***' + JSON.stringify(Bookings));
                        Bookings.driverPaymentStatus = 'Unsettled';
                        Bookings.updatedBy = $localStorage.get('userId');
                        Bookings.updatedDate = new Date();
                        Bookings.$save();
                        numCnt--;
                        if (numCnt == 0) {
                            $rootScope.settlementBookingDetails();
                            reloadFunc();
                            $rootScope.loader = 0;
                        }


                    },
                    function(error) {
                        console.log('Error updating User : ' + JSON.stringify(error));

                        $rootScope.loader = 0;
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                    });
            }

        };

        $scope.stopBookingConfirm = function() {

            if ($window.confirm("Are you sure you want to stop all these bookings?")) {
                $scope.result = "Yes";
                var count = 0;
                var count1 = 0;

                for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {
                    if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Settled') {
                        $scope.alertMsg3 = 'Can not change the payment status of settled booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'In Process') {
                        $scope.alertMsg3 = 'Can not change the payment status of In Process booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'Line Up') {
                        $scope.alertMsg3 = 'Can not change the payment status of Line Up booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'On Duty') {
                        $scope.alertMsg3 = 'Can not change the payment status of On Duty booking.';
                        count++;
                    } else if ($rootScope.settlementBookingDetails1[i].status == 'New Booking') {
                        $scope.alertMsg3 = 'Can not change the payment status of New Booking booking.';
                        count++;
                    } else {

                    }
                }
                if (count > 0) {
                    window.alert($scope.alertMsg3);
                    $scope.alertMsg3 = undefined;
                } else {
                    $scope.stopFunction();
                }
            } else {
                $scope.result = "No";
                $rootScope.settlementBookingDetails();
                reloadFunc();
            }
        }


        $scope.stopBookingPopup = function() {

            if ($window.confirm("Are you sure you want to stop this booking?")) {
                $scope.result = "Yes";
                var count = 0;
                var count1 = 0;
                //console.log('length of booking: ' + $rootScope.settlementBookingDetails1.length);
                if ($rootScope.settlementBookingDetails1.length > 1) {
                    window.alert('Only one booking can stop at a time.');
                } else {
                    for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {
                        if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Settled') {
                            $scope.alertMsg4 = 'Can not change the payment status of settled booking.';
                            count++;
                        } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'In Process') {
                            $scope.alertMsg4 = 'Can not change the payment status of In Process booking.';
                            count++;
                        } else if ($rootScope.settlementBookingDetails1[i].status == 'Line Up') {
                            $scope.alertMsg4 = 'Can not change the payment status of Line Up booking.';
                            count++;
                        } else if ($rootScope.settlementBookingDetails1[i].status == 'On Duty') {
                            $scope.alertMsg4 = 'Can not change the payment status of On Duty booking.';
                            count++;
                        } else if ($rootScope.settlementBookingDetails1[i].status == 'New Booking') {
                            $scope.alertMsg4 = 'Can not change the payment status of New Booking booking.';
                            count++;
                        } else {

                        }
                    }
                    if (count > 0) {
                        window.alert($scope.alertMsg4);
                        $scope.alertMsg4 = undefined;
                    } else {
                        var modalInstance = $modal.open({
                            templateUrl: '/stopBookingPopup.html',
                            controller: stopBookingPopupCtrl,

                        });


                        var state = $('#modal-state');
                        modalInstance.result.then(function() {
                            state.text('Modal dismissed with OK status');
                        }, function() {
                            state.text('Modal dismissed with Cancel status');
                        });
                    }
                }

            } else {
                $scope.result = "No";
                $rootScope.settlementBookingDetails();
                reloadFunc();
            }




        };

        var stopBookingPopupCtrl = function($scope, $rootScope, $modalInstance, Bookings) {

            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.settlementModeFlag = false;
                $rootScope.settlementBookingDetails();
                reloadFunc();

            };

            $scope.stopFunction = function(booking) {
                $rootScope.loader = 1;
                $scope.isDisabledButton = true;
                var count = 0;
                if (angular.isDefined(booking)) {


                    if (angular.isUndefined(booking.remark) || booking.remark === '') {
                        document.getElementById("remark").style.borderBottom = "1px solid red";
                        document.getElementById("remark1").innerHTML = '*required';

                        count++;
                    } else {
                        document.getElementById("remark").style.borderColor = "#dde6e9";
                        document.getElementById("remark1").innerHTML = '';

                    }
                } else {
                    document.getElementById("remark").style.borderBottom = "1px solid red";
                    document.getElementById("remark1").innerHTML = '*required';

                    count++;
                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    var len = $rootScope.settlementBookingDetails1.length;
                    var numCnt = len;
                    for (var i = 0; i < len; i++) {

                        Bookings.findById({
                                id: $rootScope.settlementBookingDetails1[i].bookingId
                            },
                            function(Bookings) {
                                //console.log('searched booking data***' + JSON.stringify(Bookings));
                                Bookings.driverPaymentStatus = 'Stopped';
                                Bookings.remark = booking.remark;
                                Bookings.updatedBy = $localStorage.get('userId');
                                Bookings.updatedDate = new Date();
                                Bookings.$save();
                                numCnt--;
                                if (numCnt == 0) {
                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;
                                    $rootScope.settlementBookingDetails();
                                    reloadFunc();
                                    $rootScope.loader = 0;
                                }


                            },
                            function(error) {
                                console.log('Error updating User : ' + JSON.stringify(error));

                                $rootScope.loader = 0;
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                            });
                    }
                }

            };




        }

        $rootScope.checksAllBookings = function() {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
                //console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
            } else {
                $scope.selectedAll = false;
                //console.log('Selected checkbox is: ' + JSON.stringify($scope.selectedAll));
            }
            angular.forEach($rootScope.driverSettlementBookings, function(user) {
                user.Selected = $scope.selectedAll;
            });

        }

        var cnt = 0;
        $scope.count = 0;
        $scope.selct = [];

        $rootScope.selectAllBookings = function() {

            if (cnt == 0) {
                $scope.selct = [];

                var num = $rootScope.driverSettlementBookings.length;
                for (var i = 0; i < num; i++) {
                    if ($scope.selct.indexOf($rootScope.driverSettlementBookings[i]) == -1) {
                        $scope.selct.push($rootScope.driverSettlementBookings[i]);
                        $scope.count++;

                    } else {
                        for (var j = $scope.selct.length - 1; j >= 0; j--) {

                            if ($scope.selct[j] == $rootScope.driverSettlementBookings[i]) {
                                $scope.selct.splice(j, 1);
                                $scope.count--;
                            }

                        }


                    }
                    $rootScope.bId = $scope.selct;
                    $rootScope.settlementBookingDetails1 = $scope.selct;
                    cnt = 1;
                }
            } else {

                $rootScope.bId = [];
                $scope.selct = [];
                $scope.selctn = [];
                $rootScope.settlementBookingDetails1 = [];
                $scope.count = 0;
                cnt = 0;

            }

        }

        $scope.settlementCalculationPopup = function() {

            var count = 0;
            var count1 = 0;
            var count2 = 0;
            for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {
                if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Hold') {
                    $scope.alertMsg5 = 'Can not settled, payment status is on Hold';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Settled') {
                    $scope.alertMsg5 = 'Can not settled, payment has already been settled';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'Stopped') {
                    $scope.alertMsg5 = 'Can not settled, payment status is on Stopped';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].driverPaymentStatus == 'In Process') {
                    $scope.alertMsg5 = 'Can not settled, payment status is on In Process';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].status == 'Line Up') {
                    $scope.alertMsg5 = 'Can not change the payment status of Line Up booking.';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].status == 'On Duty') {
                    $scope.alertMsg5 = 'Can not change the payment status of On Duty booking.';
                    count++;
                } else if ($rootScope.settlementBookingDetails1[i].status == 'New Booking') {
                    $scope.alertMsg5 = 'Can not change the payment status of New Booking booking.';
                    count++;
                } else {

                }
            }
            if (count > 0) {
                window.alert($scope.alertMsg5);
                $scope.alertMsg5 = undefined;
            } else {

                var modalInstance = $modal.open({
                    templateUrl: '/settlement.html',
                    controller: settlementPopupCtrl,
                    windowClass: 'app-modal-window'
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
            }

        };


        var settlementPopupCtrl = function($scope, $rootScope, $modalInstance, Bookings) {

            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
                $rootScope.settlementModeFlag = false;
                $rootScope.settlementBookingDetails();
                reloadFunc();

            };

            $rootScope.settlementFlagFunction = function(settlementMode) {
                //console.log('settlement mode: ' + JSON.stringify(settlementMode));
                if (settlementMode === '2') {
                    $rootScope.settlementModeFlag = true;
                } else {
                    $rootScope.settlementModeFlag = false;
                }

            }
            $scope.calculateShareFunction = function() {
                //console.log('booking for calculation' + JSON.stringify($rootScope.settlementBookingDetails1));
                $rootScope.loader = 1;
                var idShareTotal = 0;
                var driverShareTotal = 0;
                for (var i = 0; i < $rootScope.settlementBookingDetails1.length; i++) {


                    if ($rootScope.settlementBookingDetails1[i].paymentOffice == 'Yes') {
                        driverShareTotal += parseFloat($rootScope.settlementBookingDetails1[i].driverShare);
                    } else {
                        idShareTotal += parseFloat($rootScope.settlementBookingDetails1[i].idShare);
                    }

                }
                $rootScope.cashToPayDrv = 0;
                $rootScope.cashCollectFromDrv = 0;
                if (idShareTotal < driverShareTotal) {
                    $rootScope.cashToPayDrv = driverShareTotal - idShareTotal;
                } else {
                    $rootScope.cashCollectFromDrv = idShareTotal - driverShareTotal;
                }
                $rootScope.loader = 0;
            };

            $scope.updateStatusFunction = function(booking) {
                //console.log('update status function' + JSON.stringify(booking));
                $rootScope.loader = 1;
                var count = 0;

                if (angular.isDefined(booking)) {
                    if (angular.isUndefined(booking.settlementMode) || booking.settlementMode === '' || booking.settlementMode === null) {
                        document.getElementById("settlementMode").style.borderBottom = "1px solid red";
                        document.getElementById("settlementMode1").innerHTML = '*required';
                        booking.settlementMode1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("settlementMode").style.borderColor = "#dde6e9";
                        document.getElementById("settlementMode1").innerHTML = '';
                        booking.settlementMode1 = null;
                        if (booking.settlementMode === '2') {
                            if (angular.isUndefined(booking.bankName) || booking.bankName === '' || booking.bankName === null) {
                                document.getElementById("bankName").style.borderBottom = "1px solid red";
                                document.getElementById("bankName1").innerHTML = '*required';
                                booking.bankName1 = 'This value is required';
                                count++;
                            } else {
                                document.getElementById("bankName").style.borderColor = "#dde6e9";
                                document.getElementById("bankName1").innerHTML = '';
                                booking.bankName1 = null;
                            }
                        }

                    }
                } else {
                    document.getElementById("settlementMode").style.borderBottom = "1px solid red";
                    document.getElementById("settlementMode1").innerHTML = '*required';

                    count++;
                }



                if (count > 0) {
                    $scope.count = count;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;

                    if ($window.confirm("Please confirm?")) {
                        var len = $rootScope.settlementBookingDetails1.length;
                        var lenCnt = len;
                        var bankName = null;
                        var settlementMode = null;
                        if (angular.isDefined(booking)) {
                            if (angular.isDefined(booking.settlementMode)) {
                                if (booking.settlementMode === '1') {
                                    settlementMode = 'Cash';
                                } else {
                                    settlementMode = 'Bank';
                                }

                            }
                            if (angular.isDefined(booking.bankName)) {
                                bankName = booking.bankName;
                            }
                        }
                        for (var i = 0; i < len; i++) {

                            Bookings.findById({
                                    id: $rootScope.settlementBookingDetails1[i].bookingId
                                },
                                function(Bookings) {
                                    //console.log('Bookings: ' + JSON.stringify(Bookings));

                                    Bookings.driverPaymentStatus = 'Settled';
                                    Bookings.settlementMode = settlementMode;
                                    Bookings.settlementBankName = bankName;
                                    Bookings.updatedBy = $localStorage.get('userId');
                                    Bookings.updatedDate = new Date();
                                    Bookings.$save();
                                    var txn_id = '0A' + Bookings.id;
                                    BookingPaymentTransaction.create({
                                        bookingId: Bookings.id,
                                        transactionId: txn_id,
                                        transactionStatus: 'Success',
                                        createdBy: $localStorage.get('userId'),
                                        createdDate: new Date()
                                    }, function(transactionSuccess) {
                                        //console.log('transaction Success: ' + JSON.stringify(transactionSuccess));
                                        lenCnt--;
                                        if (lenCnt == 0) {
                                            $modalInstance.dismiss('cancel');
                                            $rootScope.settlementModeFlag = false;
                                            $rootScope.settlementBookingDetails();
                                            reloadFunc();
                                            $rootScope.loader = 0;
                                        }
                                    }, function(transactionErr) {
                                        console.log('transaction error: ' + JSON.stringify(transactionErr));
                                    });

                                },
                                function(error) {
                                    console.log('Error updating User : ' + JSON.stringify(error));
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                    if (error.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                });
                        }
                    } else {

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
                //$rootScope.settlementBookingDetails();
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
                $rootScope.settlementBookingDetails();
            }

        }


        function createTable() {

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



        $(function() {
            //$scope.getDriver();
        });

    }
])
