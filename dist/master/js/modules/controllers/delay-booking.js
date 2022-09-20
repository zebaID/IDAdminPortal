App.controller('delayBookingCtrl', delayBookingCtrl)

function delayBookingCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, DriverAllocationReport) {
    'use strict';

    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
         

        
        $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $rootScope.getBookings();
            reloadFunc(); 
             
        }
    $rootScope.fetchCancelReason = function() {
        CancellationReasons.find({},
            function(response) {
                //console.log('Cancelation reasion : ' + JSON.stringify(response));
                $rootScope.cancelationReasons1 = response;
            },
            function(error) {
                console.log('Error : ' + JSON.stringify(error));
            });
    };


    $rootScope.getBookings = function() {
         
        
            if($rootScope.roleId === '1'){
 if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        $rootScope.loader = 1;
        $scope.tournamentList = [];
        $scope.newoDate = new Date();
        var dd = $scope.newoDate.getDate();
        var mm = $scope.newoDate.getMonth() + 1;
        var yy = $scope.newoDate.getFullYear();
        var hh = $scope.newoDate.getHours() + 1;
        var min = $scope.newoDate.getMinutes();
        var sec = $scope.newoDate.getSeconds();
        var currentD = yy + '-' + mm + '-' + dd + ' 00:00:00';
        var currentT = hh + ':' + min + ':' + sec;
        var allBookingData = [];
        Bookings.find({
            filter: {
                where: {

                    and: [{
                        reportingDate: currentD
                    }, {
                        reportingTime: {
                            lt: currentT
                        }

                    }, {
                        or: [{
                            status: 'Line Up'
                        }, {
                            status: 'New Booking'
                        }]
                    }]

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
                    if(bookingData[i].tripType === 'R'){
                        $scope.tripFlag = true;
                    }else{
                        $scope.tripFlag = false;
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
            $scope.data = allBookingData;
            //console.log('booking data****** ' + JSON.stringify($scope.data));
            $scope.orginalData = allBookingData;
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
                    }else{
                        $rootScope.loader = 1;
        $scope.tournamentList = [];
        $scope.newoDate = new Date();
        var dd = $scope.newoDate.getDate();
        var mm = $scope.newoDate.getMonth() + 1;
        var yy = $scope.newoDate.getFullYear();
        var hh = $scope.newoDate.getHours() + 1;
        var min = $scope.newoDate.getMinutes();
        var sec = $scope.newoDate.getSeconds();
        var currentD = yy + '-' + mm + '-' + dd + ' 00:00:00';
        var currentT = hh + ':' + min + ':' + sec;
        var allBookingData = [];
        Bookings.find({
            filter: {
                where: {

                    and: [{
                        reportingDate: currentD
                    }, {
                        reportingTime: {
                            lt: currentT
                        }

                    }, {
                        or: [{
                            status: 'Line Up'
                        }, {
                            status: 'New Booking'
                        }]
                    }, {
                    operationCity: $rootScope.operationCitySelect
                    }]

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
                    if(bookingData[i].tripType === 'R'){
                        $scope.tripFlag = true;
                    }else{
                        $scope.tripFlag = false;
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
            $scope.data = allBookingData;
            //console.log('booking data****** ' + JSON.stringify($scope.data));
            $scope.orginalData = allBookingData;
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
                    }
        
    }
}else{
        $rootScope.loader = 1;
        $scope.tournamentList = [];
        $scope.newoDate = new Date();
        var dd = $scope.newoDate.getDate();
        var mm = $scope.newoDate.getMonth() + 1;
        var yy = $scope.newoDate.getFullYear();
        var hh = $scope.newoDate.getHours() + 1;
        var min = $scope.newoDate.getMinutes();
        var sec = $scope.newoDate.getSeconds();
        var currentD = yy + '-' + mm + '-' + dd + ' 00:00:00';
        var currentT = hh + ':' + min + ':' + sec;
        var allBookingData = [];
        Bookings.find({
            filter: {
                where: {

                    and: [{
                        reportingDate: currentD
                    }, {
                        reportingTime: {
                            lt: currentT
                        }
                    }, {
                        or: [{
                            status: 'Line Up'
                        }, {
                            status: 'New Booking'
                        }]
                    },{
                        operationCity:$rootScope.operationCity
                    }]

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
                    if(bookingData[i].tripType === 'R'){
                        $scope.tripFlag = true;
                    }else{
                        $scope.tripFlag = false;
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
            $scope.data = allBookingData;
            //console.log('booking data****** ' + JSON.stringify($scope.data));
            $scope.orginalData = allBookingData;
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
        }
     

    };

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
                        $rootScope.getBookings();


                    } else {
                        $window.alert('You can not settle the status unless booking status is Done or Paid');
                    }
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

    function createTable() {

        $scope.tableParams3 = new ngTableParams({
            page: 1, // show first page
            count: 10 // count per page

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
    }

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

        var start_date = (s_date && !isNaN(Date.parse(s_date))) ? Date.parse(s_date) : 0;
        var end_date = (e_date && !isNaN(Date.parse(e_date))) ? Date.parse(getCurrentDateTime(e_date)) : new Date().getTime();
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


        $scope.tableParams3.reload();
    };

    $scope.searchLikeRecords = function(searchData) {

        if (searchData !== '') {
            var users = $scope.orginalData;
            var searchList = $filter('filter')(users, {
                custName: searchData
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

    $scope.bookingReportFunction = function(user) {
        //console.log('bookingReportFunction ***********' + JSON.stringify(user));
        $rootScope.bookingReportData = user;
        if ($rootScope.bookingReportData.status == 'New Booking' || $rootScope.bookingReportData.status == 'Cancelled' && $rootScope.bookingReportData.driverId == '') {
            var modalInstance = $modal.open({
                templateUrl: '/newBookingModel.html',
                controller: newBookingCtrl,
                windowClass: 'app-modal-window'
            });
            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        } else {
            if ($rootScope.bookingReportData.status == 'Line Up' || $rootScope.bookingReportData.status == 'Paid' || $rootScope.bookingReportData.status == 'Done' || $rootScope.bookingReportData.status == 'On Duty' || $rootScope.bookingReportData.status == 'Cancelled' && (!angular.isUndefined($rootScope.bookingReportData.driverId))) {

                var modalInstance = $modal.open({
                    templateUrl: '/lineUpBookingModel.html',
                    controller: lineUpBookingCtrl,
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

    };

    $scope.newBooking = function() {
        $scope.addBooking();
    };
    $scope.addBooking = function() {

        var modalInstance = $modal.open({
            templateUrl: '/addBooking.html',
            controller: addBookingCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    var addBookingCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getBookings();

        };
         $scope.tripArray = [{
            'desc': 'O'
        }, {
            'desc': 'R'
        }];
        $scope.paymentArray = [{
            'desc': 'Cash By Office'
        }, {
            'desc': 'Cash By Driver'
        }];
        $scope.addNewBooking = function() {

            var count = 0;
            $rootScope.mobDisable1 = true;
            var cellNumber = document.getElementById('mobileNo_value').value;

            if (angular.isUndefined($rootScope.cellNo) || $rootScope.cellNo == null || $rootScope.cellNo == '') {
                if (angular.isUndefined(cellNumber) || cellNumber === '' || cellNumber === null) {
                    document.getElementById("mobileNo").style.borderBottom = "1px solid red";
                    document.getElementById("mobileNo1").innerHTML = '*required';
                    count++;
                } else {
                    if ((cellNumber.length < 10 || cellNumber.length > 10) && isNaN(cellNumber) == false) {
                        document.getElementById("mobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("mobileNo1").innerHTML = 'Invalid number';
                        count++;
                    } else if (isNaN(cellNumber)) {
                        document.getElementById("mobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("mobileNo1").innerHTML = 'Enter only number';
                        count++;
                    } else {
                        document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                        document.getElementById("mobileNo1").innerHTML = '';
                    }

                }


            }

            if (count > 0) {
                $scope.count = count;
                return false;
            } else {

                $scope.count = 0;

                var modalInstance = $modal.open({
                    templateUrl: '/addBookingNew.html',
                    controller: addBookingCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });

                if (!angular.isUndefined($rootScope.cellNo)) {
                    getCustomerData($rootScope.cellNo);
                } else {
                    getCustomerData(cellNumber);
                }
            }

        };
        $scope.mobileSelected = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.cellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

            }
        };

        function getCustomerData(cellNumber) {
            var cellNumber = cellNumber;
            ConUsers.mobileNoDetails({
                    mobileNumber: cellNumber
                },
                function(custData) {
                    //console.log('custData ' + JSON.stringify(custData));
                    if (custData.length > 0) {
                        $rootScope.exist = true;
                        $rootScope.customerExist = 0;
                        $rootScope.bookingDetails = {
                            customerId: custData[0].id,
                            conUserId: custData[0].conuser_id,
                            firstName: custData[0].first_name,
                            middleName: custData[0].middle_name,
                            lastName: custData[0].last_name,
                            mobileNumber: cellNumber,
                            address: custData[0].address_line_2,
                            landmark: custData[0].address,
                            email: custData[0].email,
                            customerType: custData[0].customer_type
                        };

                    } else {
                        $rootScope.exist = false;
                        $rootScope.customerExist = 1;
                        $rootScope.bookingDetails = {
                            customerId: '',
                            conUserId: '',
                            firstName: '',
                            middleName: '',
                            lastName: '',
                            mobileNumber: cellNumber,
                            address: '',
                            landmark: '',
                            email: '',
                            customerType: ''
                        };
                    }

                    //console.log('customer details' + JSON.stringify($rootScope.bookingDetails));
                    $modalInstance.dismiss('cancel');

                },
                function(error) {
                    console.log('error ' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                });
        }

        $scope.getCustomerMobileDetails = function(customerMobile) {

            $rootScope.loader = 1;
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    CustomerDetails.find({
                    filter: {
                        include: {
                            relation: 'conUsers',
                            scope: {
                                where: {
                                    mobileNumber: customerMobile,
                                    status: 'Active' 
                                }
                            }
                        }

                    }
                }, function(customerData) {
                    //console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        var mobNo = '';
                        var firstName = '';
                        var lastName = '';
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers.mobileNumber) || customerData[i].conUsers.mobileNumber !== '' || customerData[i].conUsers.mobileNumber !== null) {
                                mobNo = customerData[i].conUsers.mobileNumber;
                            }

                            if (!angular.isUndefined(customerData[i].conUsers.firstName) || customerData[i].conUsers.firstName !== '' || customerData[i].conUsers.firstName !== null) {
                                firstName = customerData[i].conUsers.firstName;
                            }
                            if (!angular.isUndefined(customerData[i].conUsers.lastName) || customerData[i].conUsers.lastName !== '' || customerData[i].conUsers.lastName !== null) {
                                lastName = customerData[i].conUsers.lastName;
                            }
                        }

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: firstName + ' ' + lastName,
                            custDetails: firstName + ' ' + lastName + ' - ' + mobNo


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
                    CustomerDetails.find({
                    filter: {
                        include: {
                            relation: 'conUsers',
                            scope: {
                                where: {
                                    mobileNumber: customerMobile,
                                    status: 'Active',
                                    operationCity:$rootScope.operationCitySelect

                                }
                            }
                        }

                    }
                }, function(customerData) {
                    //console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        var mobNo = '';
                        var firstName = '';
                        var lastName = '';
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers.mobileNumber) || customerData[i].conUsers.mobileNumber !== '' || customerData[i].conUsers.mobileNumber !== null) {
                                mobNo = customerData[i].conUsers.mobileNumber;
                            }

                            if (!angular.isUndefined(customerData[i].conUsers.firstName) || customerData[i].conUsers.firstName !== '' || customerData[i].conUsers.firstName !== null) {
                                firstName = customerData[i].conUsers.firstName;
                            }
                            if (!angular.isUndefined(customerData[i].conUsers.lastName) || customerData[i].conUsers.lastName !== '' || customerData[i].conUsers.lastName !== null) {
                                lastName = customerData[i].conUsers.lastName;
                            }
                        }

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: firstName + ' ' + lastName,
                            custDetails: firstName + ' ' + lastName + ' - ' + mobNo


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
            CustomerDetails.find({
                    filter: {
                        include: {
                            relation: 'conUsers',
                            scope: {
                                where: {
                                    mobileNumber: customerMobile,
                                    status: 'Active',
                                    operationCity:$rootScope.operationCity

                                }
                            }
                        }

                    }
                }, function(customerData) {
                    //console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        var mobNo = '';
                        var firstName = '';
                        var lastName = '';
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers.mobileNumber) || customerData[i].conUsers.mobileNumber !== '' || customerData[i].conUsers.mobileNumber !== null) {
                                mobNo = customerData[i].conUsers.mobileNumber;
                            }

                            if (!angular.isUndefined(customerData[i].conUsers.firstName) || customerData[i].conUsers.firstName !== '' || customerData[i].conUsers.firstName !== null) {
                                firstName = customerData[i].conUsers.firstName;
                            }
                            if (!angular.isUndefined(customerData[i].conUsers.lastName) || customerData[i].conUsers.lastName !== '' || customerData[i].conUsers.lastName !== null) {
                                lastName = customerData[i].conUsers.lastName;
                            }
                        }

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: firstName + ' ' + lastName,
                            custDetails: firstName + ' ' + lastName + ' - ' + mobNo


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
        $scope.user = {};
        $scope.submitUserBtn = false;
        $scope.count = 0;

        $scope.verifyMobile = function() {

            var cellNumber = document.getElementById('mobileNo_value').value;

            ConUsers.find({
                filter: {
                    where: {
                        mobileNumber: cellNumber
                    },
                    include: {
                        relation: 'userRoles'
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {
                    if ((custSuccess[0].mobileNumber === cellNumber) && (custSuccess[0].userRoles[0].roleId === '2')) {
                        document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                        document.getElementById("mobileNo1").innerHTML = '';
                        $scope.addNewBooking();
                    } else {
                        document.getElementById("mobileNo").style.borderColor = "red";
                        document.getElementById("mobileNo1").innerHTML = 'Can not book,This number belongs to driver or staff.';
                    }
                } else {
                    $scope.addNewBooking();
                }
            }, function(custErr) {
                console.log('custErr***' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        };

        $scope.verifyEmailFunction = function(bookingDetails) {
            var currentUserId = parseInt($rootScope.bookingDetails.conUserId);
            $scope.isDisabledButton = true;
            ConUsers.find({
                filter: {
                    where: {
                        email: bookingDetails.email
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {

                    if (custSuccess[0].id === currentUserId) {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $rootScope.addBookingDetails(bookingDetails);
                    } else {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Email exist';
                        $scope.isDisabledButton = false;
                        return false;
                    }

                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    $rootScope.addBookingDetails(bookingDetails);
                }

            }, function(custErr) {
                console.log('custErr***' + JSON.stringify(custErr));
                $scope.isDisabledButton = false;
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        }

       $rootScope.addBookingDetails = function(bookingDetails) {
            //console.log('bookingDetails' + JSON.stringify(bookingDetails));
            $rootScope.loader = 1;
            var count = 0;
            var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (angular.isUndefined(bookingDetails.firstName) || bookingDetails.firstName === '') {
                document.getElementById("firstName").style.borderBottom = "1px solid red";
                document.getElementById("firstName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("firstName").style.borderColor = "#dde6e9";
                document.getElementById("firstName1").innerHTML = '';

            }

            if (angular.isUndefined(bookingDetails.lastName) || bookingDetails.lastName === '' || bookingDetails.lastName === null) {
                document.getElementById("lastName").style.borderBottom = "1px solid red";
                document.getElementById("lastName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("lastName").style.borderColor = "#dde6e9";
                document.getElementById("lastName1").innerHTML = '';


            }
            if (angular.isUndefined(bookingDetails.email) || bookingDetails.email === '' || bookingDetails.email === null) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';
                count++;
            } else if (!mailTest.test(bookingDetails.email) && bookingDetails.email.length > 0) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
            }
            if (angular.isUndefined(bookingDetails.dutyType) || bookingDetails.dutyType === '' || bookingDetails.dutyType === null) {
                document.getElementById("dutyType").style.borderColor = "red";
                document.getElementById("dutyType1").innerHTML = '*required';
                bookingDetails.dutyType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("dutyType").style.borderColor = "#dde6e9";
                document.getElementById("dutyType1").innerHTML = '';
                bookingDetails.dutyType1 = null;
            }
            if (angular.isUndefined(bookingDetails.tripType) || bookingDetails.tripType === '' || bookingDetails.tripType === null) {
                document.getElementById("tripType").style.borderColor = "red";
                document.getElementById("tripType1").innerHTML = '*required';
                bookingDetails.tripType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("tripType").style.borderColor = "#dde6e9";
                document.getElementById("tripType1").innerHTML = '';
                bookingDetails.tripType1 = null;
            }
            if (angular.isUndefined(bookingDetails.carType) || bookingDetails.carType === '' || bookingDetails.carType === null) {
                document.getElementById("carType").style.borderColor = "red";
                document.getElementById("carType1").innerHTML = '*required';
                bookingDetails.carType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("carType").style.borderColor = "#dde6e9";
                document.getElementById("carType1").innerHTML = '';
                bookingDetails.carType1 = null;
            }

            if (angular.isUndefined(bookingDetails.journeyType) || bookingDetails.journeyType === '' || bookingDetails.journeyType === null) {
                document.getElementById("journeyType").style.borderColor = "red";
                document.getElementById("journeyType1").innerHTML = '*required';
                bookingDetails.journeyType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("journeyType").style.borderColor = "#dde6e9";
                document.getElementById("journeyType1").innerHTML = '';
                bookingDetails.journeyType1 = null;
            }

            if (angular.isUndefined(bookingDetails.reportingDate) || bookingDetails.reportingDate === '' || bookingDetails.reportingDate === null) {
                document.getElementById("reportingDate").style.borderColor = "red";
                document.getElementById("reportingDate1").innerHTML = '*required';
                bookingDetails.reportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("reportingDate").style.borderColor = "#dde6e9";
                document.getElementById("reportingDate1").innerHTML = '';
                bookingDetails.reportingDate1 = null;
            }

            if (angular.isUndefined(bookingDetails.paymentMethod) || bookingDetails.paymentMethod === '' || bookingDetails.paymentMethod === null) {
                document.getElementById("paymentMethod").style.borderColor = "red";
                document.getElementById("paymentMethod1").innerHTML = '*required';
                bookingDetails.paymentMethod1 = 'This value is required';
                count++;
            } else {
                document.getElementById("paymentMethod").style.borderColor = "#dde6e9";
                document.getElementById("paymentMethod1").innerHTML = '';
                bookingDetails.paymentMethod1 = null;
            }
            if (angular.isUndefined(bookingDetails.landmark) || bookingDetails.landmark === '' || bookingDetails.landmark === null) {
                document.getElementById("landmark").style.borderColor = "red";
                document.getElementById("landmark1").innerHTML = '*required';
                bookingDetails.landmark = 'This value is required';
                count++;
            } else {

                document.getElementById("landmark").style.borderColor = "#dde6e9";
                document.getElementById("landmark1").innerHTML = '';
                bookingDetails.landmark = null;
            }

            if (angular.isUndefined(bookingDetails.address) || bookingDetails.address === '' || bookingDetails.address === null) {
                document.getElementById("bookingFrmLocation").style.borderColor = "red";
                document.getElementById("bookingFrmLocation1").innerHTML = '*required';
                bookingDetails.bookingFrmLocation = 'This value is required';
                count++;
            } else {

                document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
                document.getElementById("bookingFrmLocation1").innerHTML = '';
                bookingDetails.bookingFrmLocation = null;

            }
            if (angular.isUndefined(bookingDetails.dutyType) || bookingDetails.dutyType === '' || bookingDetails.dutyType === null) {} else {
                if (bookingDetails.dutyType !== '2') {
                    if (angular.isUndefined(bookingDetails.releavingHours) || bookingDetails.releavingHours === '' || bookingDetails.releavingHours === null) {
                        document.getElementById("releavingHours").style.borderColor = "red";
                        document.getElementById("releavingHours1").innerHTML = '*required';
                        bookingDetails.releavingHours1 = 'This value is required';
                        count++;
                    } else if (parseInt(bookingDetails.releavingHours) > 12) {
                        document.getElementById("releavingHours").style.borderColor = "red";
                        document.getElementById("releavingHours1").innerHTML = 'Releiving Hours cannot be more than 12 hours.';
                        count++;
                    } else {
                        document.getElementById("releavingHours").style.borderColor = "#dde6e9";
                        document.getElementById("releavingHours1").innerHTML = '';
                        bookingDetails.releavingHours1 = null;
                    }
                }
            }
            if (angular.isUndefined(bookingDetails.dutyType) || bookingDetails.dutyType === '' || bookingDetails.dutyType === null) {} else {
                if (bookingDetails.dutyType === '2') {
                    if (angular.isUndefined(bookingDetails.outstationCity) || bookingDetails.outstationCity === '' || bookingDetails.outstationCity === null) {
                        document.getElementById("outstationCity").style.borderColor = "red";
                        document.getElementById("outstationCity1").innerHTML = '*required';
                        bookingDetails.outstationCity1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("outstationCity").style.borderColor = "#dde6e9";
                        document.getElementById("outstationCity1").innerHTML = '';
                        bookingDetails.outstationCity1 = null;
                    }
                }
            }

            if (angular.isUndefined(bookingDetails.dutyType) || bookingDetails.dutyType === '' || bookingDetails.dutyType === null) {} else {
                if (bookingDetails.dutyType === '2') {
                    if (angular.isUndefined(bookingDetails.bookingToDate) || bookingDetails.bookingToDate === '' || bookingDetails.bookingToDate === null) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = '*required';
                        bookingDetails.bookingToDate1 = 'This value is required';
                        count++;
                    } else if (bookingDetails.bookingToDate < bookingDetails.reportingDate) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        bookingDetails.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        bookingDetails.bookingToDate1 = null;
                    }

                    var startDate = moment(bookingDetails.reportingDate).format('YYYY-MM-DD');
                    var endDate = moment(bookingDetails.bookingToDate).format('YYYY-MM-DD');
                    if (startDate === endDate) {
                        if ((!angular.isUndefined(bookingDetails.hours) || bookingDetails.hours != null || bookingDetails.hours != '') && (!angular.isUndefined(bookingDetails.tohours) || bookingDetails.tohours != null || bookingDetails.tohours != '')) {
                            if (bookingDetails.tohours < bookingDetails.hours) {
                                document.getElementById("tohours").style.borderColor = "red";
                                document.getElementById("tominutes").style.borderColor = "red";
                                document.getElementById("tohours2").innerHTML = 'Releiving time should be greater than Reporting Time';
                                count++;
                            } else {
                                document.getElementById("tohours").style.borderColor = "#dde6e9";
                                document.getElementById("tominutes").style.borderColor = "#dde6e9";
                                document.getElementById("tohours2").innerHTML = '';
                            }
                        }
                    }

                    if (angular.isUndefined(bookingDetails.tohours) || bookingDetails.tohours === '' || bookingDetails.tohours === null) {
                        document.getElementById("tohours").style.borderColor = "red";
                        document.getElementById("tohours1").innerHTML = '*required';
                        bookingDetails.tohours1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("tohours").style.borderColor = "#dde6e9";
                        document.getElementById("tohours1").innerHTML = '';
                        bookingDetails.tohours1 = null;
                    }

                    if (angular.isUndefined(bookingDetails.tominutes) || bookingDetails.tominutes === '' || bookingDetails.tominutes === null) {
                        document.getElementById("tominutes").style.borderColor = "red";
                        document.getElementById("tominutes1").innerHTML = '*required';
                        bookingDetails.tominutes1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("tominutes").style.borderColor = "#dde6e9";
                        document.getElementById("tominutes1").innerHTML = '';
                        bookingDetails.tominutes1 = null;
                    }
                }
            }

            if (angular.isUndefined(bookingDetails.journeyType) || bookingDetails.journeyType === '' || bookingDetails.journeyType === null) {} else {
                if (bookingDetails.journeyType === '1') {
                    if (angular.isUndefined(bookingDetails.bookingToLocation) || bookingDetails.bookingToLocation === '' || bookingDetails.bookingToLocation === null) {
                        document.getElementById("bookingToLocation").style.borderColor = "red";
                        document.getElementById("bookingToLocation1").innerHTML = '*required';
                        bookingDetails.bookingToLocation1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToLocation1").innerHTML = '';
                        bookingDetails.bookingToLocation1 = null;
                    }
                }
            }

            if (angular.isUndefined(bookingDetails.hours) || bookingDetails.hours === '' || bookingDetails.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                bookingDetails.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                bookingDetails.hours1 = null;
            }
            if (angular.isUndefined(bookingDetails.minutes) || bookingDetails.minutes === '' || bookingDetails.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                bookingDetails.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                bookingDetails.minutes1 = null;
            }

            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {

                 var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + bookingDetails.address + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
                $http.post(mapUrl).success(function(result) {
                    //console.log('result' + JSON.stringify(result));
                    $rootScope.pickAddressResults = result;
                    var count1 = 0;

                    if ($rootScope.pickAddressResults.results.length == '0') {
                        document.getElementById("bookingFrmLocation").style.borderColor = "red";
                        document.getElementById("bookingFrmLocation1").innerHTML = 'Invalid address';
                        bookingDetails.bookingFrmLocation = 'Invalid address';
                        count1++;
                    } else {
                        document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
                        document.getElementById("bookingFrmLocation1").innerHTML = '';
                        bookingDetails.bookingFrmLocation = null;
                    }
                    if (count1 > 0) {
                        $scope.count1 = count1;
                        $scope.isDisabledButton = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $scope.count = 0;
                        $scope.count1 = 0;
                        $scope.repDate = bookingDetails.reportingDate;
                        $scope.mainDate = new Date(
                            $scope.repDate.getFullYear(),
                            $scope.repDate.getMonth(),
                            $scope.repDate.getDate() + 1);
                        $scope.releDate = '';
                        if (angular.isDefined(bookingDetails.bookingToDate)) {
                            $scope.releDate = bookingDetails.bookingToDate;
                            $scope.mainRelDate = new Date(
                                $scope.releDate.getFullYear(),
                                $scope.releDate.getMonth(),
                                $scope.releDate.getDate() + 1);

                        }

                        var carType;
                        var dutyType;
                        var journeyType;
                        if (angular.isDefined(bookingDetails.carType)) {
                            if (bookingDetails.carType == '1') {
                                carType = 'M';
                            } else if (bookingDetails.carType == '2') {

                                carType = 'A';
                            } else {
                                carType = 'L';
                            }

                        }

                        var relDate;
                        var relTime;
                        var hours;
                        var minutes;
                        var relDuration;
                        var city;
                        var timeFormat;
                        var rptTime;
                        rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
                        if (angular.isDefined(bookingDetails.dutyType)) {
                            if (bookingDetails.dutyType == '2') {
                                dutyType = true;
                                relDate = $scope.mainRelDate;
                                relTime = bookingDetails.tohours + ':' + bookingDetails.tominutes + ':' + '00';
                                relDuration = '0';
                                city = bookingDetails.outstationCity;
                                city = city.replace(/, Maharashtra/g, '');
                                city = city.replace(/, India/g, '');

                            } else {

                                dutyType = false;
                                var tempHour = 0;
                                var tempHour1 = 0;
                                tempHour1 = parseInt(bookingDetails.hours) + parseInt(bookingDetails.releavingHours);

                                if (tempHour1 > 23) {
                                    tempHour = tempHour1 - 24;
                                    relTime = tempHour + ':' + bookingDetails.minutes + ':' + '00';

                                    var tempRelDate = new Date(
                                        $scope.mainDate.getFullYear(),
                                        $scope.mainDate.getMonth(),
                                        $scope.mainDate.getDate() + 1);

                                    relDate = tempRelDate;
                                } else {
                                    relTime = tempHour1 + ':' + bookingDetails.minutes + ':' + '00';
                                    relDate = $scope.mainDate;
                                }

                                relDuration = bookingDetails.releavingHours * 60;
                                city = null;

                            }
                        }
                        var relLoc;
                        if (angular.isDefined(bookingDetails.journeyType)) {
                            if (bookingDetails.journeyType == '2') {
                                journeyType = true;
                                relLoc = bookingDetails.address;
                            } else {
                                journeyType = false;
                                relLoc = bookingDetails.bookingToLocation;
                            }
                        }
                        var paymentMode;
                        if (angular.isDefined(bookingDetails.paymentMethod)) {
                            if (bookingDetails.paymentMethod == 'Cash By Office') {
                                paymentMode = 'C';
                            } else if (bookingDetails.paymentMethod == 'Cash By Driver') {
                                paymentMode = 'D';
                            } else {
                                paymentMode = 'O';
                            }
                        }
                        var landmark = '';
                        if (!angular.isUndefined(bookingDetails.landmark) || bookingDetails.landmark != null || bookingDetails.landmark != '') {
                            landmark = bookingDetails.landmark;
                        }
                        var remark = '';
                        if (!angular.isUndefined(bookingDetails.remark) || bookingDetails.remark != null || bookingDetails.remark != '') {
                            remark = bookingDetails.remark;
                        }
                        var pickupLat = null;
                        var pickupLng = null;
                        var dropLat = null;
                        var dropLng = null;
                        var cityLat = null;
                        var cityLng = null;
                        var totalAmt = '500';
                        var pickLat = $rootScope.pickAddressResults.results[0].geometry.location.lat;
                        var pickLong = $rootScope.pickAddressResults.results[0].geometry.location.lng;
                        if ($rootScope.customerExist == 1) {

                                Bookings.newCustomerCreateBooking({
                                    email: bookingDetails.email,
                                    firstName: bookingDetails.firstName,
                                    middleName: bookingDetails.middleName,
                                    lastName: bookingDetails.lastName,
                                    mobileNumber: bookingDetails.mobileNumber,
                                    status: 'Active',
                                    addressLandmark: landmark,
                                    address: bookingDetails.address,
                                    addressLat: pickLat,
                                    addressLong: pickLong,
                                    userId: $rootScope.userId,

                                    carType: carType,
                                    isRoundTrip: journeyType,
                                    isOutstation: dutyType,
                                    reportingDate: $scope.mainDate,
                                    reportingTime: rptTime,
                                    releivingDate: relDate,
                                    releivingTime: relTime,
                                    releavingDuration: relDuration,
                                    pickupLandmark: landmark,
                                    pickupAddress: bookingDetails.address,
                                    pickupLat: pickLat,
                                    pickupLng: pickLong,
                                    dropAddress: relLoc,
                                    dropLat: dropLat,
                                    dropLng: dropLng,
                                    cityName: city,
                                    cityLat: cityLat,
                                    cityLng: cityLng,
                                    totalAmount: totalAmt,
                                    userId1: $rootScope.userId,
                                    paymentMethod: paymentMode,
                                    remark: remark,
                                    tripType: bookingDetails.tripType

                                }, function(bookingSuccess) {
                                    if(bookingSuccess[0].operation_city ==='undefined'){
                                           $rootScope.loader = 0;
                                           $scope.isDisabledButton = false;
                                            window.alert('Something Went Wrong! Try Again.');  
                                        }else{
                                            console.log('new customer booking created' + JSON.stringify(bookingSuccess));
                                    ConUsers.findById({
                                        id: bookingSuccess[0].conuser_id
                                    },
                                    function(ConUsers) {
                                        console.log('fetch customer for update' + JSON.stringify(ConUsers));

                                        ConUsers.password = bookingDetails.mobileNumber;
                                        ConUsers.updatedBy = $localStorage.get('userId');
                                        ConUsers.updatedDate = new Date();
                                        ConUsers.$save();
                                    },
                                    function(ConErr) {
                                        console.log('conuser err' + JSON.stringify(ConErr));
                                    });
                                    $rootScope.newBookingId = bookingSuccess[0].booking_id;
                                    $.notify('Successfully created booking with booking ID: ' + $rootScope.newBookingId + '.', {
                                        status: 'success'
                                    });
                                $scope.opcity = bookingSuccess[0].operation_city;

                                if (bookingDetails.dutyType !== '2' && bookingDetails.journeyType === '2') {
                                    newBookingSMSLocalRound(bookingDetails, $scope.opcity);
                                    ackSMSFunction(bookingDetails, $scope.opcity);
                                } else if (bookingDetails.dutyType !== '2' && bookingDetails.journeyType === '1') {
                                    newBookingSMSLocalOneway(bookingDetails, $scope.opcity );
                                    ackSMSFunction(bookingDetails, $scope.opcity);
                                } else if (bookingDetails.dutyType === '2' && bookingDetails.journeyType === '2') {
                                    newBookingSMSOutstationRound(bookingDetails, $scope.opcity);
                                    ackSMSFunction(bookingDetails, $scope.opcity);
                                } else {
                                    newBookingSMSOutstationOneway(bookingDetails, $scope.opcity);
                                    ackSMSFunction(bookingDetails, $scope.opcity);
                                }
                                    
                                    $rootScope.bookingDetails = undefined;
                                    $rootScope.cellNo = undefined;
                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;
                                    $rootScope.loader = 0;
                                    reloadFunc();
                                    $rootScope.getBookings();
                                        }
                                    
                                }, function(bookingError) {
                                    console.log('new customer booking error' + JSON.stringify(bookingError));
                                    $scope.isDisabledButton = false;
                                    if (bookingError.status == 0) {
                                        window.alert('Something Went Wrong! Try Again.');
                                         
                                    }
                                     
                                    $rootScope.loader = 0;
                                });


                        } else {
                            ConUsers.findById({
                                    id: $rootScope.bookingDetails.conUserId
                                },
                                function(ConUsers) {
                                    //console.log('fetch customer for update' + JSON.stringify(ConUsers));
                                    ConUsers.email = bookingDetails.email;
                                    ConUsers.updatedBy = $localStorage.get('userId');
                                    ConUsers.updatedDate = new Date();
                                    ConUsers.$save();

                                    Bookings.createBookingForAdmin({
                                        carType: carType,
                                        isRoundTrip: journeyType,
                                        isOutstation: dutyType,
                                        reportingDate: $scope.mainDate,
                                        reportingTime: rptTime,
                                        releivingDate: relDate,
                                        releivingTime: relTime,
                                        releavingDuration: relDuration,
                                        landmark: landmark,
                                        pickupAddress: bookingDetails.address,
                                        pickupLat: pickLat,
                                        pickupLng: pickLong,
                                        dropAddress: relLoc,
                                        dropLat: dropLat,
                                        dropLng: dropLng,
                                        cityName: city,
                                        cityLat: cityLat,
                                        cityLng: cityLng,
                                        totalAmount: totalAmt,
                                        customerId: $rootScope.bookingDetails.customerId,
                                        userId: $rootScope.userId,
                                        paymentMethod: paymentMode,
                                        remark: remark,
                                        tripType: bookingDetails.tripType

                                    }, function(bookingDataValues) {
                                       if(bookingDataValues[0].create_booking_for_admin ==='undefined'){
                                             $rootScope.loader = 0;
                                           $scope.isDisabledButton = false;
                                            window.alert('Something Went Wrong! Try Again.');  
                                        }else{
                                        //console.log('bookingDataValues ' + JSON.stringify(bookingDataValues));
                                         $rootScope.newBookId = bookingDataValues[0].create_booking_for_admin;
                                        Bookings.findById({
                                            id :  $rootScope.newBookId
                                        }, function(success){

                                            $scope.opcity = success.operationCity;
                                              $.notify('Successfully created booking with booking ID: ' + $rootScope.newBookId + '.', {
                                            status: 'success'
                                         });

                                        var customerSMSdetails = $rootScope.bookingDetails;
                                        if (bookingDetails.dutyType !== '2' && bookingDetails.journeyType === '2') {
                                            newBookingSMSLocalRound1(customerSMSdetails, $scope.opcity);
                                            ackSMSFunction(customerSMSdetails, $scope.opcity);
                                        } else if (bookingDetails.dutyType !== '2' && bookingDetails.journeyType === '1') {
                                            newBookingSMSLocalOneway1(customerSMSdetails, $scope.opcity);
                                            ackSMSFunction(customerSMSdetails, $scope.opcity);
                                        } else if (bookingDetails.dutyType === '2' && bookingDetails.journeyType === '2') {
                                            newBookingSMSOutstationRound1(customerSMSdetails, $scope.opcity);
                                            ackSMSFunction(customerSMSdetails, $scope.opcity);
                                        } else {
                                            newBookingSMSOutstaionOneway1(customerSMSdetails, $scope.opcity);
                                            ackSMSFunction(customerSMSdetails, $scope.opcity);
                                        }


                                        $rootScope.bookingDetails = undefined;
                                        $rootScope.cellNo = undefined;
                                        $modalInstance.dismiss('cancel');
                                        $scope.isDisabledButton = false;
                                        $rootScope.loader = 0;
                                        reloadFunc();
                                        $rootScope.getBookings();
                                        }
                                         ,function(err){

                                        });
                                    }
                                    }, function(bookingError) {
                                        console.log('bookingError ' + JSON.stringify(bookingError));
                                        $scope.isDisabledButton = false;
                                        if (bookingError.status == 0) {
                                            window.alert('Something Went Wrong! Try Again.');
                                             
                                        }
 
                                        $rootScope.loader = 0;

                                    });
                                },
                                function(error) {
                                    console.log('Error updating Customer : ' + JSON.stringify(error));
                                    $scope.isDisabledButton = false;
                                    if (error.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                });
                        }
                    }

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


            }
        };
       
        function ackSMSFunction(smsData, opcity) {

            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }

            var msg = 'Dear ' + smsData.firstName + ',%0aWe have taken utmost care while selecting driver, however we are not responsible for any type of losses including financial with respect to services. Need to make payment by cash immediately once trip is over. If not agree with this terms, please cancel the booking. For queries '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + smsData.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        }
       function newBookingSMSOutstationOneway(bookingDetails, opcity) {

            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation OneWay Trip has been received, driver details will be shared two hours before the trip. Driver\'s return fare will be applicable as per rate card. Food allowances are included in the bill amount. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + bookingDetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };
            function newBookingSMSOutstationRound(bookingDetails, opcity) {

            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Driver\'s food allowance is included in the bill. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + bookingDetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSLocalOneway(bookingDetails, opcity) {

            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Oneway Trip has been received, driver details will be shared two hours before the trip. Return fare of the Driver is not included in the bill. It is to be paid in cash (as per rate card)  to the driver. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + bookingDetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        }

        function newBookingSMSLocalRound(bookingDetails, opcity) {

                 if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
       


            var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round Trip has been received, driver details will be shared two hours before the trip. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + bookingDetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

         function newBookingSMSOutstaionOneway1(customerSMSdetails, opcity) {

             if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + customerSMSdetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation OneWay Trip has been received, driver details will be shared two hours before the trip. Driver\'s return fare will be applicable as per rate card. Food allowances are included in the bill amount. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSOutstationRound1(customerSMSdetails, opcity) {

             if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + customerSMSdetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Driver\'s food allowance is included in the bill. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSLocalOneway1(customerSMSdetails, opcity) {
             if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + customerSMSdetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Oneway Trip has been received, driver details will be shared two hours before the trip. Return fare of the Driver is not included in the bill. It is to be paid in cash (as per rate card)  to the driver. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        }

        function newBookingSMSLocalRound1(customerSMSdetails, opcity) {
             if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
             
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + customerSMSdetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round Trip has been received, driver details will be shared two hours before the trip. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                    
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        $scope.closeModal = function() {
            $rootScope.bookingDetails = undefined;
            $rootScope.cellNo = undefined;
            $modalInstance.dismiss('cancel');
            $rootScope.getBookings();
        };

    };


    var newBookingCtrl = function($scope, $rootScope, $modalInstance) {

        $scope.searchDriver = false;
        if ($rootScope.bookingReportData.status == 'New Booking') {
            $scope.allocateDriver = true;
            $scope.cancelButton = true;
        }

        $scope.CancelBookingPopUp = function() {
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: newBookingCtrl
            });

        }

        $scope.submitCancellationReason = function(cancelationReason, comment) {
            $rootScope.loader = 1;

            ConUsers.findById({
                    id: $rootScope.userId
                },
                function(ConUsers) {
                    $scope.Aname = ConUsers.firstName + ' ' + ConUsers.lastName;
                    var cancelName = 'Booking cancelled by ' + $scope.Aname + ' on ';

                    Bookings.cancelBookingForAdmin({
                            bookingId: $rootScope.cancelDetails1.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.cancelationReasons1.comment + ' ' + cancelName

                        },

                        function(response) {

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
                            $rootScope.getBookings();
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

             if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
            var rptDate = moment(cancelSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelSMS.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        $scope.newBookingMobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $rootScope.driverId1 = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.newBookingDrvcellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
                $rootScope.newBookingSMSData = $scope.search.mobileNumber;

            }
        };

        $rootScope.allocateDriverFunction = function() {
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
                    $rootScope.loader = 0;

                } else if (dutyReport[0].accept_duty == 'Allocation Error') {

                    window.alert("This booking is not valid any more.");
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;

                } else if (dutyReport[0].accept_duty == 'Please Recharge Your Account to Accept this Duty') {

                    window.alert("Please Recharge Driver Account to Assign this Duty.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Account Error') {

                    window.alert("Driver account does not exist.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Driver Block') {

                    window.alert("The Driver is not active to allocate this duty.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Please complete your lineup duty') {

                    window.alert("Please complete your lineup duty.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expired') {

                    window.alert("License of this Driver is expired.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Kindly Update Your License') {

                    window.alert("Please update driver license date.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'Driver  blocked for this customer') {
                    console.log('driver blocked');
                    window.alert("This driver is blocked for this customer.");
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expire Soon') {
                    window.alert("License of this Driver will expire soon.");
                    $.notify('Driver ID: ' + $rootScope.driverId1 + ' has been allocated to booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    var customerSMS = $rootScope.allocateNewBookings;
                    var driverSMS = $rootScope.newBookingSMSData;
                    var opcity = $rootScope.allocateNewBookings.opCity;
                    customerSMSFunction(customerSMS, driverSMS, opcity);
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: parseInt($rootScope.allocateNewBookings.bookingId),
                        driverId: $rootScope.driverId1,
                        userId: $scope.uid,
                        allocationStatus: 'Allocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));

                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getBookings();
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
                        bookingId: parseInt($rootScope.allocateNewBookings.bookingId),
                        driverId: $rootScope.driverId1,
                        userId: $scope.uid,
                        allocationStatus: 'Allocation'
                    }, function(success) {
                        console.log('created allocation successfully' + JSON.stringify(success));
                        $modalInstance.dismiss('cancel');
                        reloadFunc();
                        $rootScope.getBookings();
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
                console.log('error in accepting duty');
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');

            });



        }

        function customerSMSFunction(customerSMS, driverSMS, opcity) {

            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }

            var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + customerSMS.bookingFirstName + ',%0a Driver Name: ' + driverSMS.originalObject.driverName + ' (Contact Number: ' + driverSMS.originalObject.mobileNumber + ') has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMS.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            driverSMSFunction(customerSMS, driverSMS);
        };

        function driverSMSFunction(customerSMS, driverSMS) {
            var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
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
            if(customerSMS.journeyType === 'Round Trip'){
                var dropadd = ' ';
            }else{
                var dropadd = ' Drop Address:' + customerSMS.bookingToLocation;
            }
            var picadd = ', Pickup Address:' + landmark + ', ' + customerSMS.bookingFrmLocation;
            var reportingTime = customerSMS.hours + ':' + customerSMS.minutes + ':' + '00';
            var msg = 'Hi ' + driverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' Duty Type: ' + customerSMS.dutyType + ' ' + customerSMS.journeyType + ' Car Type: ' + customerSMS.carType + ' Dated on: ' + rptDate + ' @ ' + reportingTime + relHour + picadd + dropadd + ' Client Name: ' + customerSMS.bookingFirstName + '-' + customerSMS.bookingCellNumber;
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + driverSMS.originalObject.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;
            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
             
        };
        $scope.getNewBookingDriverMobile = function() {

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
            $rootScope.getBookings();
        };
        $scope.allocate = function() {
            $scope.isDisabled = false;
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

         $scope.getNewBooking = function() {
            $rootScope.loader = 1;
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


                        },{
                            relation:'driverAllocationReport',
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

                        CancellationReasons.findOne({
                            id: bookingData.cancellationId
                        }, function(cancellationData) {
                            $rootScope.cancelReason1 = cancellationData.desc;

                        }, function(error) {
                            console.log('cancel reason fetch error' + JSON.stringify(error));
                        });
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
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark,
                                    history:history,
                                    opCity: bookingData.operationCity

                                };
                                $rootScope.allocateNewBookings = $scope.booking;
                                $rootScope.cancelDetails1 = $scope.booking;
                                $scope.getNewBookingDriverMobile();
                                $rootScope.loader = 0;
                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $modalInstance.dismiss('cancel');
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

    };



    var lineUpBookingCtrl = function($scope, $rootScope, $modalInstance, $state) {

        $scope.searchDriver = false;

        if ($rootScope.bookingReportData.status == 'Line Up') {
            $scope.allocateDriver = true;
            $rootScope.cancelButton1 = true;
            $rootScope.offDutyFlag1 = false;
            $rootScope.cashButton = false;
            $rootScope.cashButton1 = false;
            $rootScope.cashButton2 = false;
            $rootScope.startDutyFlag1 = true;
        } else if ($rootScope.bookingReportData.status == 'On Duty') {
            $rootScope.cashButton = false;
            $rootScope.cashButton1 = false;
            $rootScope.cashButton2 = false;
            $scope.allocateDriver = false;
            $rootScope.cancelButton1 = false;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = true;
        } else if ($rootScope.bookingReportData.status == 'New Booking') {
            $scope.allocateDriver = true;
            $rootScope.cancelButton1 = true;
            $rootScope.startDutyFlag1 = false;
            $rootScope.offDutyFlag1 = false;

        } else if ($rootScope.bookingReportData.status == 'Done') {
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

        $scope.CancelBookingPopUp = function() {

            console.log('cancelBooking popup');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: lineUpBookingCtrl
            });

        }



       $scope.submitCancellationReason = function(cancelationReason, comment) {
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
                            cancellationReason: $rootScope.cancelationReasons1.comment + ' ' + cancelName

                        },

                        function(response) {
                            //console.log('booking for cancellation:' + JSON.stringify(response));
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
                            }  else {

                            }
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getBookings();


                        },
                        function(er) {
                            console.log('error in cancellation of booking:' + JSON.stringify(er));
                        });

                },
                function(error) {

                    $rootScope.loader = 0;
                });
        }

       function cancelCustomerSMS(cancelData, opcity) {

              if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }


            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelData.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            cancelDriverSMS(cancelData, opcity);
        };

        function cancelDriverSMS(cancelData, opcity) {
            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your duty dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelData.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        };

        
        $scope.startDuty = function(booking) {
            //var url = 'http://192.168.2.23:3000';
            var url = 'http://34.217.89.71:3000';
           // var url = 'http://18.220.250.238:3000';
            $scope.isDisabledButton = true;
            //$rootScope.loader = 1;
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
                            "offDutyTime": null
                        };
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated invoices successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Duty has started successfully. ', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getBookings();
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
                        $rootScope.getBookings();
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
                        $rootScope.getBookings();
                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0;
                    } else if (startDutySuccess[0].start_duty_for_admin === 'Paid') {
                        $modalInstance.dismiss('cancel');
                        $.notify('Duty has already been paid. ', {
                            status: 'danger'
                        });

                        reloadFunc();
                        $rootScope.getBookings();
                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0;
                    }else if (startDutySuccess[0].start_duty_for_admin === 'Already On Duty on other Duty') {
                       $modalInstance.dismiss('cancel');
                        $.notify('Already On Duty on other Duty. ', {
                            status: 'danger'
                        });

                        reloadFunc();
                        $rootScope.getBookings();

                        $rootScope.offDutyFlag = true;
                        $rootScope.startDutyFlag = false;
                        $rootScope.loader = 0; 
                    }


                }, function(startDutyError) {
                    console.log('start duty error: ' + JSON.stringify(startDutyError));
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                });

            }

        };

       
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
                    $rootScope.getBookings();
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
                            $rootScope.getBookings();
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
                            $rootScope.getBookings();
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
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.lineupBookingDetails.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            var newDriverSMS = $rootScope.reallocateDetails;
            customerSMS(newDriverSMS);
        };

       function customerSMS(newDriverSMS) {

             var opcity = $rootScope.allocateNewBookings.opCity;



            if( opcity === 'Pune'){
                var cnumber = '020-67641000';
           }else if( opcity === 'Aurangabad'){
                var cnumber = '020-67641020'; 
            }
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.bookingFirstName + ',%0a Driver Name: ' + newDriverSMS.originalObject.driverName + ' (Contact Number: ' + newDriverSMS.originalObject.mobileNumber + ') ' + ' has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.lineupBookingDetails.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            newdriverSMSFunction(newDriverSMS);
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
            if($rootScope.lineupBookingDetails.journeyType === 'Round Trip'){
                var dropadd = ' ';
            }else{
                var dropadd = ', Drop Address: ' + $rootScope.lineupBookingDetails.bookingToLocation;
            }
            var picadd = landmark + $rootScope.lineupBookingDetails.bookingFrmLocation;
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + newDriverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' Duty Type: ' + $rootScope.lineupBookingDetails.dutyType + ' ' + $rootScope.lineupBookingDetails.journeyType + ' Car Type: ' + $rootScope.lineupBookingDetails.carType + ' Dated on: ' + rptDate + ' @ ' + rptTime + relHour + ', Pickup address: ' + picadd + dropadd + ' Client Name: ' + $rootScope.lineupBookingDetails.bookingFirstName + '-' + $rootScope.lineupBookingDetails.bookingCellNumber;
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + newDriverSMS.originalObject.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            
        };



      $scope.deallocateDriver = function() {
        $scope.isDisabled = true;
            $scope.uid = $localStorage.get('userId');
            $rootScope.loader = 1;
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

                            //console.log('driver deallocation success' + JSON.stringify(SuccessData)); zebs
                            $.notify('Driver removed successfully ', {
                                status: 'success'
                            });
                            driverDeallocateSMS();

                            DriverAllocationReport.createAllocationHistory({
                                bookingId: parseInt($rootScope.lineupBookingDetails.bookingId),
                                driverId: $rootScope.lineupBookingDetails.oldDrvId,
                                userId: $scope.uid,
                                allocationStatus: 'Deallocation'
                            }, function(success) {
                                console.log('created allocation successfully' + JSON.stringify(success));
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getBookings();
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
                        $rootScope.getBookings();
                        $rootScope.loader = 0;
                    }
                } else if (success.status === 'New Booking') {
                    window.alert('This driver has already deallocated.', 'Alert');
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;

                } else if (success.status === 'On Duty') {
                    window.alert('This booking is already started, unable to remove driver.', 'Alert');
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                } else {
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                }




            }, function(error) {});
        }

        function driverDeallocateSMS() {
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.driverFirstName + ',%0a Duty details assigned to you, booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', reporting date ' + rptDate + ' time ' + reportingTime + ' has been cancelled. Please contact customer desk for details.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.lineupBookingDetails.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    //console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    //console.log('errorCallback : ' + JSON.stringify(response));
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

        $scope.getLineUpData = function() {
            $scope.isDisabled = false;
            $rootScope.loader = 1;
            //console.log('called get lineup booking ');
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
                        var history = [];
                            if (bookingData.driverAllocationReport.length !== 0) {
                                
                                   for (var k = 0; k < bookingData.driverAllocationReport.length; k++) {
                                       var status = bookingData.driverAllocationReport[k].history + moment(bookingData.driverAllocationReport[k].createdDate).format('DD-MM-YYYY | HH:mm:ss');
                                        history.push(status);
                                    }

                               
                           }
                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;

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
                                    paymentMethod: paymentMode,
                                    driverShare: drvShare,
                                    idShare: idShare,
                                    carTypeValue: carTypeText,
                                    returnFareAmt: returnFareText + returnFare,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark,
                                    status: bookingData.status,
                                    history:history,
                                    operationCity: bookingData.operationCity


                                };
                                $rootScope.checkFare = $scope.booking;
                                $rootScope.lineupBookingDetails = $scope.booking;
                                //console.log('booking details' + JSON.stringify($rootScope.lineupBookingDetails));
                                $scope.getLineUpDriverMobile();
                                $rootScope.loader = 0;
                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
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


        $scope.checkFare = function() {
            $modalInstance.dismiss('cancel');
            $state.go('app.fareCalculator');
        };

        $scope.allocate = function() {

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
            $rootScope.getBookings();
        };

    };

    $(function() {

    });

}
