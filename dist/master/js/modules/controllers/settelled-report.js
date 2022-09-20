//Anis
App.controller('settlementCtrl', settlementCtrl)

function settlementCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window) {
    'use strict';

    $rootScope.userId = $localStorage.get('userId');

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

    $scope.changePaymentStatus = function(bookingId){
    	console.log('booking id of change payment status***' +JSON.stringify(bookingId));
    	if (angular.isDefined(bookingId) && bookingId !== null) {
                    Bookings.findById({
                            id: bookingId
                        },
                        function(Bookings) {
                        	if(Bookings.driverPaymentStatus == 'Hold'){
                        		Bookings.driverPaymentStatus = 'Unsettled';
                        		Bookings.updatedBy = $localStorage.get('userId');
                            	Bookings.updatedDate = new Date();
                            	Bookings.$save();
                        	}else{
                        		Bookings.driverPaymentStatus = 'Hold';
                        		Bookings.updatedBy = $localStorage.get('userId');
                            	Bookings.updatedDate = new Date();
                            	Bookings.$save();
                        	}
                  			//$window.location.reload(); 
                            $rootScope.driverBookingDetails();
                            reloadFunc();
                            

                        },
                        function(error) {
                            console.log('Error updating User : ' + JSON.stringify(error));
                        });
                }
    }
    $scope.driverSelect = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
            console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
            $rootScope.selectedDrvId = parseInt($scope.search.mobileNumber.originalObject.id);
            $rootScope.drvCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
            console.log('driver id' + JSON.stringify($rootScope.selectedDrvId));
        }
    };


    $rootScope.getDriverDetails = function(driverMobile) {

        $rootScope.loader = 1;

        DriverDetails.find({
                filter: {
                    include: {
                        relation: 'conUsers'
                    }

                }
            }, function(driverData) {
                console.log('driver data' + JSON.stringify(driverData));
                $scope.driverList = [];

                for (var i = 0; i < driverData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';
                    if (!angular.isUndefined(driverData[i].conUsers)) {
                        if (!angular.isUndefined(driverData[i].conUsers.mobileNumber) || driverData[i].conUsers.mobileNumber !== '' || driverData[i].conUsers.mobileNumber !== null) {
                            mobNo = driverData[i].conUsers.mobileNumber;
                        }

                        if (!angular.isUndefined(driverData[i].conUsers.firstName) || driverData[i].conUsers.firstName !== '' || driverData[i].conUsers.firstName !== null) {
                            firstName = driverData[i].conUsers.firstName;
                        }
                        if (!angular.isUndefined(driverData[i].conUsers.lastName) || driverData[i].conUsers.lastName !== '' || driverData[i].conUsers.lastName !== null) {
                            lastName = driverData[i].conUsers.lastName;
                        }
                    }

                    $scope.driverList.push({
                        id: driverData[i].id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        driverDetails: firstName + ' ' + lastName + ' - ' + mobNo


                    });
                }

                console.log('driver List = ' + JSON.stringify($scope.driverList));

                $rootScope.loader = 0;

            },
            function(drvErr) {
                console.log('Error fetching existing mobile number : ' + JSON.stringify(drvErr));
                $rootScope.loader = 0;
            });
    };
    $rootScope.driverBookingDetails = function() {
        var allBookingData = [];
        Bookings.find({
            filter: {
                where: {
                    driverId: $rootScope.selectedDrvId,
                    status: {inq: ['Paid','Done']},
                    driverPaymentStatus: {neq: 'Settled'}  
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
            console.log('booking details' + JSON.stringify(bookingData));
    
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
                if(!angular.isUndefined(bookingData[i].paymentMethod) || bookingData[i].paymentMethod != null || bookingData[i].paymentMethod != ''){
                	if(bookingData[i].paymentMethod == 'O' || bookingData[i].paymentMethod == 'C'){
                		collectedByOffice = 'Yes';
                	}else{
                		collectedByOffice = 'No';
                	}
                	if(bookingData[i].paymentMethod == 'D'){
                		collectedByDriver = 'Yes';
                	}else{
                		collectedByDriver = 'No';
                	}
                }

                var driverShare;
                var idShare;
                if(bookingData[i].driverShare != null && (!angular.isUndefined(bookingData[i].driverShare))){
                    driverShare = bookingData[i].driverShare.toFixed(2);
                    //parsedDrvShare = driverShare.toFixed(2);
                    //anis
                }
                if(bookingData[i].idShare != null && (!angular.isUndefined(bookingData[i].idShare))){
                    idShare = bookingData[i].idShare.toFixed(2);
                    //parsedIdShare = idShare.toFixed(2);
                }

                allBookingData.push({
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
            $scope.data = allBookingData;
            $rootScope.paidBookingDetails = allBookingData;
            console.log('booking data***' + JSON.stringify($scope.data));

        }, function(bookingErr) {
            console.log('booking error' + JSON.stringify(bookingErr));
        });
    };

    $scope.bookingTable = function() {

        $scope.showTable = true;
        $scope.allocateDriver = false;

    };

    var bookingArray = [];
    $scope.count = 0;
    $scope.selectedBookings =function(user){
    	console.log('selected booking details' +JSON.stringify(user));


       if(bookingArray.indexOf(user) == -1) 
     {

        bookingArray.push(user);
        $scope.count++;
        console.log('push number:'+JSON.stringify(bookingArray));
     }
     else{
            for(var i = bookingArray.length-1;i>=0;i--)
            {

                if(bookingArray[i] == user)
                {
                    console.log('duplicate number is:'+JSON.stringify(user));

                    bookingArray.splice(i,1);
                    $scope.count--;

                    console.log('deleted number is:'+JSON.stringify(user));

                }

            }
     

     }
     $rootScope.disabledFlag = bookingArray;
     $rootScope.settlementBookingData = bookingArray;
  console.log('array number:'+JSON.stringify(bookingArray));
    }

     $scope.settlementBookingPopup = function() {
     	var count=0;
     	for(var i=0;i< $rootScope.settlementBookingData.length;i++){
     		if($rootScope.settlementBookingData[i].driverPaymentStatus == 'Hold'){
     			count++;
     		}else{
     		}
     	}
     	if(count>0){
     		window.alert('Can not settled, payment status is on Hold');
     	}else{
     		 var modalInstance = $modal.open({
            templateUrl: '/settlement.html',
            controller: settlementBookingCtrl,
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
     
 var settlementBookingCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings, $window) {
    $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
   
        };

        $scope.calculateShare = function(){
        console.log('booking for calculation' +JSON.stringify($rootScope.settlementBookingData));
        	
        	var idShareTotal = 0;
        	var driverShareTotal = 0;
        	for(var i = 0; i < $rootScope.settlementBookingData.length; i++){
        		
        		
        		if($rootScope.settlementBookingData[i].paymentOffice == 'Yes'){
        			driverShareTotal += parseFloat($rootScope.settlementBookingData[i].driverShare); 
        		}else{
        			idShareTotal += parseFloat($rootScope.settlementBookingData[i].idShare);
        		}
        		console.log('Id total Share' +JSON.stringify(idShareTotal));
        		console.log('Driver total share' +JSON.stringify(driverShareTotal));
        	}
        	$rootScope.cashToPayDriver = 0;
        	$rootScope.cashCollectFromDriver = 0;
        		if(idShareTotal < driverShareTotal){
        			$rootScope.cashToPayDriver = driverShareTotal - idShareTotal;
        		}else{
        			$rootScope.cashCollectFromDriver = idShareTotal - driverShareTotal;	
        		}
        		console.log('cash to pay driver: ' +$rootScope.cashToPayDriver);
        		console.log('cash to pay id: ' +$rootScope.cashCollectFromDriver);
        }
        $rootScope.updatePaymentStatus = function() {
     	console.log('Hello');
     	if ($window.confirm("Please confirm?")) {
                   for(var i = 0; i < $rootScope.settlementBookingData.length; i++){
                   		Bookings.findById({
                            id: $rootScope.settlementBookingData[i].bookingId
                        },
                        function(Bookings) {
                        	
                        		Bookings.driverPaymentStatus = 'Settled'; 
                        		Bookings.updatedBy = $localStorage.get('userId');
                            	Bookings.updatedDate = new Date();
                            	Bookings.$save();
                        	$modalInstance.dismiss('cancel');
                  			//$window.location.reload(); 
                            $rootScope.driverBookingDetails();
                            reloadFunc();
                            

                        },
                        function(error) {
                            console.log('Error updating User : ' + JSON.stringify(error));
                        });
                   }
                } else {
                   
                }
     }
    }

     

    $(function() {

    });

}
