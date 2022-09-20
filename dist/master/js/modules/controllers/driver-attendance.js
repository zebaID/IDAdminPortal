App.controller('driverAttendanceCtrl', driverAttendanceCtrl)

function driverAttendanceCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, BookingPaymentTransaction, Company1CustomerDetails, Company1CustomerRate, Company2CustomerDetails, Company1CustomerBills, Company2CustomerBills, Company2CustomerRate, Company1BillDetails, Company2BillDetails, Company1Items, Company2Items,Company2DriverDetails,DriverAttendance) {
    'use strict';



        $rootScope.appointDriverDetails = [];
         $rootScope.addNewDutyDetails = [];
    $scope.setCompany = function() {// on innit set the company name
        $rootScope.company = 'ID Car Drivers Pvt Ltd';
        $localStorage.put('selectedCompanyName', $rootScope.company);
        //console.log($rootScope.company);
        //$state.go('app.monthlyCustomerBilling');
    }
      
    $scope.gobillingAttendanceDetails =function(){
        
         $state.go('app.billingAttendanceDetails');
    }
    $scope.driverAttendance =function(driverId,driverName,customerId){
        var billingDriverId = driverId;
        var billingDriverName = driverName;
        var billingDriverCustomerId = customerId; 
        $scope.billingDriverId = undefined;
        $scope.billingDriverName = undefined;
        $scope.billingDriverCustomerId = undefined;
        $localStorage.put('billingDriverId',billingDriverId);
        $localStorage.put('billingDriverName',billingDriverName);
         $localStorage.put('billingDriverCustomerId',billingDriverCustomerId);
        $state.go('app.driverAttendanceDetails');
    }
    $scope.updateAttendanceDriverPopup = function(){
      var driverId = $localStorage.get('billingDriverId');
      var customerId = $localStorage.get('billingCustomerId'); 
      $rootScope.driverUpdateDetails = [];
      Company2DriverDetails.findOne({
                filter:{    
                  where:{
                    company2CustomerId:customerId,
                    driverId:driverId
                  }
            }             
               
      },function(success){
        console.log(success); 

        $rootScope.driverUpdateDetails = success;
          // $rootScope.driverUpdateDetails.cycle = success.cycle;
          // $rootScope.driverUpdateDetails.monthlySalary = success.monthlySalary;
          // $rootScope.driverUpdateDetails.dutyHours = success.dutyHours;
          // $rootScope.driverUpdateDetails.reportingDate = success.reportingDate;
          // $rootScope.driverUpdateDetails.relievingDate = success.relievingDate;
           Company2CustomerRate.find({
                filter:{
                  where:{
                    company2CustomerId:customerId,
                    driverId:driverId
                  }
              }
                
              },function(success1){
                  for (var i = 0; i < success1.length; i++) {
                        if(success1[i].itemId == 1){
                              $rootScope.driverUpdateDetails.salartCharge = success1[i].value;
                        }
                         if(success1[i].itemId == 2){
                              $rootScope.driverUpdateDetails.otRate = success1[i].value;
                        }
                         if(success1[i].itemId == 3){
                              $rootScope.driverUpdateDetails.osaRate = success1[i].value;
                        }
                         if(success1[i].itemId == 4){
                              $rootScope.driverUpdateDetails.nsaRate = success1[i].value;
                        }
                         if(success1[i].itemId == 5){
                              $rootScope.driverUpdateDetails.edRate = success1[i].value;
                        }
                  }
                 // console.log($localStorage.put('billingDriverId'));
                  
                  var modalInstance = $modal.open({
                    templateUrl: '/billingDriverUpdatePopUp.html',//crteate billing popupp
                    controller: billingCustomerModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
                  
              },function(error){
                 window.alert('Oops! You are disconnected from server.');
                  
              });
          
      },function(error){
         window.alert('Oops! You are disconnected from server.');
          
      });
    
        
    };
    
    $scope.editAttendance =function(attendanceId){
       $rootScope.attendanceId = attendanceId;
       DriverAttendance.findOne({
        filter:{
            where:{
                id:$rootScope.attendanceId
            }
        }
       },function(success){
            $rootScope.editAttendanceDetails = success;
            $rootScope.editAttendanceDetails.inTime = new Date("January 31 2020 " + success.inTime);
            $rootScope.editAttendanceDetails.outTime = new Date("January 31 2020 " + success.outTime);
             var modalInstance = $modal.open({
                    templateUrl: '/editAttendancePopUp.html',//crteate billing popupp
                    controller: billingCustomerModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
       },function(error){
          window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');

       })
       
    }
    $scope.showAttendanceTotal = function(){
         var modalInstance = $modal.open({
                    templateUrl: '/showAttendanceTotal.html',//crteate billing popupp
                    controller: billingCustomerModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
    }
      $scope.addNewDutyPopUp = function(){
         var modalInstance = $modal.open({
                    templateUrl: '/addNewDutyPopUp.html',//crteate billing popupp
                    controller: billingCustomerModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
    }
    $scope.getCompany2CustomersDriverDetails = function(){
        var driverId = $localStorage.get('billingDriverId');
        
         Company2DriverDetails.findOne({
        filter: {
            where: {
                driverId: driverId
            }
        }

         },function(success){
             
              $rootScope.driverDetails = success;

              $rootScope.driverDetails.reportingDate = $filter('date')(success.reportingDate, 'dd-MM-yyyy');
             $rootScope.driverDetails.name = $localStorage.get('billingDriverName');
         },function(error){
               window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
         });
    }
    $scope.showAttendance = function (){
        var count = 0;
        if(angular.isUndefined($rootScope.driverDetails.attendanceMonth) || $rootScope.driverDetails.attendanceMonth == '' || $rootScope.driverDetails.attendanceMonth == null){
            document.getElementById("attendanceMonth1").style.borderBottom = "1px solid red";
            document.getElementById("attendanceMonth1").innerHTML = '*required';
            count++;
        }
        else{
            document.getElementById("attendanceMonth1").style.borderBottom = "";
            document.getElementById("attendanceMonth1").innerHTML = '';
        }

       
        if(count == 0){
             
           var getMonth = $filter('date')($rootScope.driverDetails.attendanceMonth, 'MM');
           var getYear = $filter('date')($rootScope.driverDetails.attendanceMonth, 'yyyy');
             
            if($rootScope.driverDetails.cycle == '25-26'){
                     var start = getMonth + '-25-'+ getYear;
                     var startDate = new Date( start);
                     var ONE_MONTH = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30));
                     var lastMonth = $filter('date')(ONE_MONTH, 'MM');
                     var lastYear = $filter('date')(ONE_MONTH, 'yyyy');
                     var last = lastMonth + '-26-'+ lastYear;
                     var lastDate = new Date(last);
           
              } if($rootScope.driverDetails.cycle == '01-30'){
                     var start = getMonth + '-01-'+ getYear;
                     var startDate = new Date( start);
                     var ONE_MONTH = new Date(new Date(startDate).setDate(new Date(startDate).getDate()+30));
                     var lastMonth = $filter('date')(ONE_MONTH, 'MM');
                     var lastYear = $filter('date')(ONE_MONTH, 'yyyy');
                     var last = lastMonth + '-31-'+ lastYear;
                     var lastDate = new Date(last);
           
              } if($rootScope.driverDetails.cycle == '20-21'){
                     var start = getMonth + '-20-'+ getYear;
                     var startDate = new Date( start);
                     var ONE_MONTH = new Date(new Date(startDate).setDate(new Date(startDate).getDate()+30));
                     var lastMonth = $filter('date')(ONE_MONTH, 'MM');
                     var lastYear = $filter('date')(ONE_MONTH, 'yyyy');
                     var last = lastMonth + '-21-'+ lastYear;
                     var lastDate = new Date(last);
           
              }
               
            var driverId = $localStorage.get('billingDriverId');
             DriverAttendance.find({
            filter: {
                where: {
                     driverId: driverId,
                     and:[
                         {inDate:{gt: startDate }},
                         {inDate:{lt: ONE_MONTH}}
                         ]
                      
                }
            }

             },function(success){

                if(success.length == 0){
                     window.alert('Attendance data not availabe to retrive');
                }
                else{

                    $rootScope.driverMonthAttendance = success;
                }
                
                
             },function(error){
                   window.alert('Oops! You are disconnected from server.');
                    //$state.go('page.login');
             });
        }
    }
    $rootScope.searchAppointedDriverDetails = function(){

            $rootScope.loader = 1;
             
            $rootScope.appointedDriverData = [];
            var DriverData = [];
            var customerId = $localStorage.get('billingCustomerId');

             
             Company2DriverDetails.find({
                    filter:{
                        where:{
                            company2CustomerId:customerId
                        },
                         include: [{
                                    relation: 'driverDetails',
                                    scope: {
                                        include: {
                                            relation: 'conUsers',
                                        }
                                    }
                                },{
                                    relation: 'customerDetails',
                                    scope: {
                                        include: {
                                            relation: 'conUsers',
                                                 
                                        }
                                    }
                                }]
                         }                           

                     }, function(success){
                       //s console.log(success[0].driverDetails.conUsers.firstName);
                         for (var i = 0; i < success.length; i++) 
                         {

                            var driverId = null;
                            var driverName = null; 
                            var directorName = null;
                            var customerId = null;
                            var status = "Appointed";
                                     
                     
                            // if (!angular.isUndefined(success[i].id) || success[i].id !== null || success[i].id !== '') {
                            //     driverId = success[i].driverDetails.id;
                            // }

                            // if (!angular.isUndefined(success[i].driver_name) || success[i].driver_name !== null || success[i].driver_name !== '') {
                            //     driverName = success[i].driver_name;
                            // }
                            //  if (!angular.isUndefined(success[i].director_name) || success[i].director_name !== null || success[i].director_name !== '') {
                            //     driverName = success[i].customerDetails.conUsers.firstName +' '+success[i].customerDetails.conUsers.lastName;
                            // }
                            
                           if (angular.isUndefined( success[i].driverDetails ) ||  success[i].driverDetails == null ||  success[i].driverDetails  == '') {
                                status = "Not Appointed";
                                DriverData.push({
                              
                                 customerId: success[i].customerDetails.id,
                                 
                                directorName: success[i].customerDetails.conUsers.firstName +' '+success[i].customerDetails.conUsers.lastName,
                                status:status
                                 });
                            }
                            else{
                                DriverData.push({
                                driverId: success[i].driverDetails.id,
                                 customerId: success[i].customerDetails.id,
                                driverName: success[i].driverDetails.conUsers.firstName +' '+success[i].driverDetails.conUsers.lastName,
                                directorName: success[i].customerDetails.conUsers.firstName +' '+success[i].customerDetails.conUsers.lastName,
                                status:status
                            });
                             }

                            }
                            
                    $rootScope.appointedDriverData = DriverData;

                     }, function(error){

                           $rootScope.loader = 0;
                    });
    }
    $scope.billingCustMobileSelected = function() { // selected customer mobile number on serch number

        if ($scope.search !== undefined && $scope.search.custMobile !== undefined && $scope.search.custMobile !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.custMobile));
            $scope.billingCustId = parseInt($scope.search.custMobile.originalObject.id);
            $rootScope.billingCustNumber = $scope.search.custMobile.originalObject.mobileNumber;

        }
    };

    $rootScope.getBillingCustomerDetails = function() {//to get billing customer details

        $rootScope.loader = 1;

        //$rootScope.customerData = [];
        var allBillingCustomerData = [];
        var allCustomerBills = [];
        var bCId = $localStorage.get('billingCustomerId');
        var compName = $localStorage.get('selectedCompanyName');
        //console.log('id * ' + bCId);
        if (compName === 'ID Services') {
            Company1CustomerDetails.findOne({
                filter: {
                    where: {
                        id: bCId
                    },
                    include: {
                        relation: 'conUsers'
                    }
                }
            }, function(customerData) {
                //console.log('customer all Data ' + JSON.stringify(customerData));

                if (angular.isDefined(customerData)) {
                    if (!angular.isUndefined(customerData.conUsers)) {

                        var name;
                        if (angular.isUndefined(customerData.conUsers.middleName) || customerData.conUsers.middleName == null) {
                            name = customerData.conUsers.firstName + ' ' + customerData.conUsers.lastName;
                        } else {
                            name = customerData.conUsers.firstName + ' ' + customerData.conUsers.middleName + ' ' + customerData.conUsers.lastName;
                        }


                        allBillingCustomerData.push({
                            id: customerData.id,
                            conuserId: customerData.conUsers.id,
                            name: name,
                            firstName: customerData.conUsers.firstName,
                            middleName: customerData.conUsers.middleName,
                            lastName: customerData.conUsers.lastName,
                            email: customerData.conUsers.email,
                            address: customerData.conUsers.address,
                            contactNo: customerData.conUsers.mobileNumber,
                            createdDate: customerData.conUsers.createdDate

                        });

                    }

                     

                }
                //$rootScope.address2 = landmark;
                //$rootScope.customerData = allCustomerData;
                $scope.data = allCustomerBills;
                $rootScope.companyCustomerData = allBillingCustomerData;
                $rootScope.company1Cid = allBillingCustomerData[0].id;
                $rootScope.cName = allBillingCustomerData[0].firstName + ' ' + allBillingCustomerData[0].lastName;
                $rootScope.address = allBillingCustomerData[0].address;
                $rootScope.contactNo = allBillingCustomerData[0].contactNo;


                createTable();

                $rootScope.loader = 0;


            }, function(customerErr) {

                console.log('customer error ' + JSON.stringify(customerErr));
                if (customerErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
        } else {
            Company2CustomerDetails.getCompany2CustomerDetails({
                 
                        company2CustomerId: bCId
                     
            }, function(customerData) {
                console.log('customer all Data ' + JSON.stringify(customerData));

                if (angular.isDefined(customerData)) {
                    if (!angular.isUndefined(customerData)) {

                        var name;
                         


                        allBillingCustomerData.push({
                            id: customerData[0].id,
                            conuserId: customerData[0].conuser_id,
                            name: customerData[0].name,
                            email: customerData[0].email,
                            address: customerData[0].address,
                            contactNo: customerData[0].mobile_number,
                            createdDate: customerData[0].createdDate

                        });

                    }

                    

                }
                 console.log('customer all Data ' + JSON.stringify(allBillingCustomerData));
                //$rootScope.address2 = landmark;
                //$rootScope.customerData = allCustomerData;
                $scope.data = allCustomerBills;
                $rootScope.companyCustomerData = allBillingCustomerData;
                $rootScope.company1Cid = allBillingCustomerData[0].id;
                $rootScope.cName = allBillingCustomerData[0].name;
                $rootScope.address = allBillingCustomerData[0].address;
                $rootScope.contactNo = allBillingCustomerData[0].contactNo;


                createTable();

                $rootScope.loader = 0;


            }, function(customerErr) {

                console.log('customer error ' + JSON.stringify(customerErr));
                if (customerErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
        }

         function createTable() {

        $scope.tableParams3 = new ngTableParams({
            page: 1, // show first page
            count: 100 // count per page

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


    };
    $scope.backToSearchPage = function() {
        $scope.billingCustId = undefined;
        $rootScope.billingCustNumber = undefined;
        $localStorage.put('billingCustomerId', undefined);
        $localStorage.put('searchBillFromDate', undefined);
        $localStorage.put('searchBillToDate', undefined);
        //console.log('id **** ' + $localStorage.get('billingCustomerId'));
        $state.go('app.driverAttendance');
    };
    $scope.fetchBillingCustList = function() {//fetch billing customer list for update

        $rootScope.loader = 1;
        var compName = $localStorage.get('selectedCompanyName');
        if (compName === 'ID Services') {
            Company1CustomerDetails.find({
                    filter: {
                        where: {
                            companyName: compName
                        },
                        include: {
                            relation: 'conUsers'

                        }

                    }
                }, function(customerData) {
                    //success fethck block
                    //console.log('customerData' + JSON.stringify(customerData));

                    $scope.billingCustomerList = [];

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
                        var contactPerson = '';

                        if (!angular.isUndefined(customerData[i].contactPersonName) || customerData[i].contactPersonName !== '' || customerData[i].contactPersonName !== null) {
                            contactPerson = customerData[i].contactPersonName;
                        }
                        $scope.billingCustomerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: firstName + ' ' + lastName,
                            custDetails: firstName + ' ' + lastName + ' - ' + contactPerson


                        });
                    }

                    // console.log('customer List = ' + JSON.stringify($scope.bookingHistorycustomerList));

                    $rootScope.loader = 0;

                },
                function(custErr) {
                    //error fetch block
                    console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                    $rootScope.loader = 0;
                });
        } else {
            Company2CustomerDetails.getCompany2Customers({
                     
                }, function(customerData) {

                    //console.log('customerData' + JSON.stringify(customerData));

                    $scope.billingCustomerList = [];

                    for (var i = 0; i < customerData.length; i++) {
                        var mobNo = '';
                        var name = '';
 
                        if (!angular.isUndefined(customerData[i])) {
                            if (!angular.isUndefined(customerData[i].mobile_number) || customerData[i].mobile_number !== '' || customerData[i].mobile_number !== null) {
                                mobNo = customerData[i].mobile_number;
                            }

                            if (!angular.isUndefined(customerData[i].name) || customerData[i].name !== '' || customerData[i].name !== null) {
                                name = customerData[i].name;
                            }
                        }

                        var contactPerson = '';

                        if (!angular.isUndefined(customerData[i].contact_person_name) || customerData[i].contact_person_name !== '' || customerData[i].contact_person_name !== null) {
                            contactPerson = customerData[i].contact_person_name;
                        }

                        $scope.billingCustomerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: name,
                            custDetails: name + ' - ' + contactPerson


                        });
                    }

                    // console.log('customer List = ' + JSON.stringify($scope.bookingHistorycustomerList));

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
    
    
    $scope.verifyMobile = function() {//verify mobile number if its already exists

        var cellNumber = document.getElementById('billingMobileNo_value').value;
        //console.log('cellNumber***' + JSON.stringify(cellNumber));
        var compName = $localStorage.get('selectedCompanyName');
        if (compName === 'ID Services') {
            ConUsers.find({
                filter: {
                    where: {
                        mobileNumber: cellNumber
                    },
                    include: {
                        relation: 'company1CustomerDetails'
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {
                    $rootScope.existingUserData = custSuccess;
                    //console.log('not null');
                    if (custSuccess[0].company1CustomerDetails.length > 0) {

                        $localStorage.put('billingCustomerId', custSuccess[0].company1CustomerDetails[0].id);
                        $state.go('app.billingAttendanceDetails');

                    } else {

                        //console.log('existing conuser');
                        $rootScope.updateExistingUser();
                    }
                } else {
                    //console.log('null');
                    $rootScope.searchCustomerBilling();
                }
            }, function(custErr) {
                console.log('custErr***' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        } else {
            ConUsers.find({
                filter: {
                    where: {
                        mobileNumber: cellNumber
                    },
                    include: {
                        relation: 'company2CustomerDetails'
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {
                    $rootScope.existingUserData = custSuccess;
                    //console.log('not null');
                    if (custSuccess[0].company2CustomerDetails.length > 0) {


                        $localStorage.put('billingCustomerId', custSuccess[0].company2CustomerDetails[0].id);
                        $state.go('app.billingAttendanceDetails');

                    } else {

                        //console.log('existing conuser');
                        $rootScope.updateExistingUser();
                    }
                } else {
                    //console.log('null');
                    $rootScope.searchCustomerBilling();
                }
            }, function(custErr) {
                console.log('custErr***' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        }
    };

    $rootScope.searchCustomerBilling = function() { //search customer and create bill for existing user

        if (!angular.isUndefined($scope.billingCustId)) {
            $localStorage.put('billingCustomerId', $scope.billingCustId);
            $state.go('app.billingAttendanceDetails');
        } else {
            var count = 0;
            $rootScope.createButtonDisable = true;
            var cellNumber = document.getElementById('billingMobileNo_value').value;

            if (angular.isUndefined($rootScope.billingCustNumber) || $rootScope.billingCustNumber == null || $rootScope.billingCustNumber == '') {
                if (angular.isUndefined(cellNumber) || cellNumber === '' || cellNumber === null) {
                    document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                    document.getElementById("billingMobileNo1").innerHTML = '*required';
                    count++;
                } else {
                    if ((cellNumber.length < 10 || cellNumber.length > 10) && isNaN(cellNumber) == false) {
                        document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("billingMobileNo1").innerHTML = 'Invalid number';
                        count++;
                    } else if (isNaN(cellNumber)) {
                        document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("billingMobileNo1").innerHTML = 'Enter only number';
                        count++;
                    } else {
                        document.getElementById("billingMobileNo").style.borderColor = "#dde6e9";
                        document.getElementById("billingMobileNo1").innerHTML = '';
                    }

                }


            }

            if (count > 0) {
                $scope.count = count;
                return false;
            } else {

                $scope.count = 0;

                var modalInstance = $modal.open({
                    templateUrl: '/createBillingCustomer.html',//crteate billing popupp
                    controller: billingCustomerModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
                var compName = $localStorage.get('selectedCompanyName');
                $rootScope.billCustomer = {
                    mobileNumber: cellNumber,
                    companyName: compName
                };

            }
        }
    }
    var billingCustomerModalCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings,AppointedDriverHistoricalData) {


        $scope.showDriverTotalAttendance = function(){

            var startDate = new Date("2020-02-02");
            var lastDate = new Date("2020-02-30"); 
            DriverAttendance.find({
                filter:{
                    where:{
                        driverId:145,
                         and:[
                         {inDate:{gt: startDate }},
                         {inDate:{lt: lastDate}}
                         ]
                    }
                }
                
            },function(success){
                     window.alert('success');

            },function(error){
                 window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            })
            $rootScope.driverTotalAttendance = [];
        }
         $scope.removeAppointedDriver = function(){

            var count = 0;
            if(angular.isUndefined($rootScope.driverUpdateDetails.lastDate) || $rootScope.driverUpdateDetails.lastDate == '' || $rootScope.driverUpdateDetails.lastDate == null){
            document.getElementById("lastDate1").style.borderBottom = "1px solid red";
            document.getElementById("lastDate1").innerHTML = '*required';
            count++;
            }
            else{
                document.getElementById("lastDate1").style.borderBottom = "";
                document.getElementById("lastDate1").innerHTML = '';
            }
            if(angular.isUndefined($rootScope.driverUpdateDetails.reason) || $rootScope.driverUpdateDetails.reason == '' || $rootScope.driverUpdateDetails.reason == null){
            document.getElementById("reason1").style.borderBottom = "1px solid red";
            document.getElementById("reason1").innerHTML = '*required';
            count++;
            }
            else{
                document.getElementById("reason1").style.borderBottom = "";
                document.getElementById("reason1").innerHTML = '';
            }
            if(count == 0){
                var temp = 0;
                 var reportingDate = $filter('date')($rootScope.driverDetails.reportingDate, 'dd-MM-yyyy');
                  var lastDate = $filter('date')($rootScope.driverUpdateDetails.lastDate, 'dd-MM-yyyy');
                    if( reportingDate > lastDate  ){
                    document.getElementById("lastDate1").style.borderBottom = "1px solid red";
                    document.getElementById("lastDate1").innerHTML = 'Last Date Should be greater than Reporting Date ';
                    temp++;
                    }
                    else{
                        document.getElementById("lastDate1").style.borderBottom = "";
                        document.getElementById("lastDate1").innerHTML = '';
                    }
                    if(temp == 0){

                            var driverId = $localStorage.get('billingDriverId');
                            var customerId = $localStorage.get('billingCustomerId');
                            Company2DriverDetails.removeAppointDriver({
                                customerId:customerId,
                                driverId:driverId,
                                dol:$rootScope.driverUpdateDetails.lastDate,
                                reason:$rootScope.driverUpdateDetails.reason,
                                updatedBy:$rootScope.userId

                            },function(success){
                                 $modalInstance.dismiss('cancel');
                                 //window.alert("Driver Remove Successfully");
                                 $.notify(' Driver Remove Successfully', {
                                      status: 'success'
                                });
                                  $state.go('app.billingAttendanceDetails');
                                   $modalInstance.dismiss('cancel');

                            },function(error){
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');


                            })

                    }
                     
            }
             
        }
        $scope.removeAppointedDriverPopUp = function(){

            $modalInstance.dismiss('cancel');
             var modalInstance = $modal.open({
            templateUrl: '/removeAppointedDriver.html',//crteate billing popupp
            controller: billingCustomerModalCtrl
            });
            var state = $('#modal-state');
            modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
            }, function() {
               state.text('Modal dismissed with Cancel status');
            });
        }
        $scope.updateAppointedDriverDetails12 = function(){
        var count = 0;
         if (angular.isUndefined($rootScope.driverUpdateDetails.cycle) || $rootScope.driverUpdateDetails.cycle === '' ||  $rootScope.driverUpdateDetails.cycle === null) {
                document.getElementById("driverCycle1").style.borderBottom = "1px solid red";
                document.getElementById("driverCycle1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("driverCycle1").style.borderColor = "#dde6e9";
                document.getElementById("driverCycle1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.dutyHours) || $rootScope.driverUpdateDetails.dutyHours === '' ||  $rootScope.driverUpdateDetails.dutyHours === null) {
                document.getElementById("dutyHours1").style.borderBottom = "1px solid red";
                document.getElementById("dutyHours1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("dutyHours1").style.borderColor = "#dde6e9";
                document.getElementById("dutyHours1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.reportingDate) || $rootScope.driverUpdateDetails.reportingDate === '' ||  $rootScope.driverUpdateDetails.reportingDate === null) {
                document.getElementById("appointedDate1").style.borderBottom = "1px solid red";
                document.getElementById("appointedDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("appointedDate1").style.borderColor = "#dde6e9";
                document.getElementById("appointedDate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.otRate) || $rootScope.driverUpdateDetails.otRate === '' ||  $rootScope.driverUpdateDetails.otRate === null) {
                document.getElementById("otRate1").style.borderBottom = "1px solid red";
                document.getElementById("otRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("otRate1").style.borderColor = "#dde6e9";
                document.getElementById("otRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.nsaRate) || $rootScope.driverUpdateDetails.nsaRate === '' ||  $rootScope.driverUpdateDetails.nsaRate === null) {
                document.getElementById("nsaRate1").style.borderBottom = "1px solid red";
                document.getElementById("nsaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("nsaRate1").style.borderColor = "#dde6e9";
                document.getElementById("nsaRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.edRate) || $rootScope.driverUpdateDetails.edRate === '' ||  $rootScope.driverUpdateDetails.edRate === null) {
                document.getElementById("edRate1").style.borderBottom = "1px solid red";
                document.getElementById("edRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("edRate1").style.borderColor = "#dde6e9";
                document.getElementById("edRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.driverUpdateDetails.osaRate) || $rootScope.driverUpdateDetails.osaRate === '' ||  $rootScope.driverUpdateDetails.osaRate === null) {
                document.getElementById("osaRate1").style.borderBottom = "1px solid red";
                document.getElementById("osaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("osaRate1").style.borderColor = "#dde6e9";
                document.getElementById("osaRate1").innerHTML = '';

            }
             if (angular.isUndefined($rootScope.driverUpdateDetails.monthlySalary) || $rootScope.driverUpdateDetails.monthlySalary === '' ||  $rootScope.driverUpdateDetails.monthlySalary === null) {
                document.getElementById("salary1").style.borderBottom = "1px solid red";
                document.getElementById("salary1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("salary1").style.borderColor = "#dde6e9";
                document.getElementById("salary1").innerHTML = '';

            }
             
            if (angular.isUndefined($rootScope.driverUpdateDetails.weeklyOff) || $rootScope.driverUpdateDetails.weeklyOff === '' ||  $rootScope.driverUpdateDetails.weeklyOff === null) {
                document.getElementById("weeklyOff1").style.borderBottom = "1px solid red";
                document.getElementById("weeklyOff1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("weeklyOff1").style.borderColor = "#dde6e9";
                document.getElementById("weeklyOff1").innerHTML = '';

            }


        if (count == 0){
           var driverId = $localStorage.get('billingDriverId');
           var customerId = $localStorage.get('billingCustomerId'); 
           // var reportingDate12 =  $filter('date')($rootScope.driverUpdateDetails.reportingDate, 'yyyy-dd-MM');
                 Company2DriverDetails.updateAppointDriverDetails({
                       customerId:customerId,
                       driverId:driverId,
                       dutyHours:$rootScope.driverUpdateDetails.dutyHours,
                       weeklyOff:$rootScope.driverUpdateDetails.weeklyOff,
                       otRate:$rootScope.driverUpdateDetails.otRate,
                       nsaRate:$rootScope.driverUpdateDetails.nsaRate,
                       edRate:$rootScope.driverUpdateDetails.edRate,
                       monthlySalary:$rootScope.driverUpdateDetails.monthlySalary,
                       driverCycle:$rootScope.driverUpdateDetails.cycle,
                       reportingDate:$rootScope.driverUpdateDetails.reportingDate,
                       osaRate:$rootScope.driverUpdateDetails.osaRate,
                       updatedBy:$rootScope.userId 
                },function(success){
                   $modalInstance.dismiss('cancel');
                    //window.alert("Driver Details Updated Successfully");
                    $.notify('Driver Details Updated successfully.', {
                                    status: 'success'
                                });

                     reloadFunc();
                   

                 },function(error){

                       window.alert('Oops! You are disconnected from server.');
                      //   $state.go('page.login');

                 });
             }
        };
        $scope.updatedriverCycle = [{
            'desc': '01-30'
        }, {
            'desc': '20-21'
        }, {
            'desc': '25-26'
        }];
        $scope.updateweeklyOffArray = [{
            'desc': 'Sunday'
        }, {
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
        }];
        
        $scope.updatedutyHour = [{
            'desc': '1'
        }, {
            'desc': '2'
        }, {
            'desc': '3'
        }, {
            'desc': '4'
        }, {
            'desc': '5'
        }, {
            'desc': '6'
        }, {
            'desc': '7'
        }, {
            'desc': '8'
        }, {
            'desc': '9'
        }, {
            'desc': '10'
        }, {
            'desc': '11'
        }, {
            'desc': '12'
        }, {
            'desc': '13'
        }, {
            'desc': '14'
        }];
        $rootScope.billCustomerDirectorDetails = [];
         $scope.addDirectorDetails = function(){
              var count = 0;
               if(angular.isUndefined($rootScope.searchDirectorCustId) || $rootScope.searchDirectorCustId == null || $rootScope.searchDirectorCustId == '')
             {
                    window.alert('please Select Director');
                    count++;
             }
             if(count == 0){

                 document.getElementById("customerMobileNumber").style.borderBottom = "1px solid red";
                document.getElementById("customerMobileNumber").innerHTML = '';              
                Company2DriverDetails.find({filter:{

                    where:{
                         customerId:$rootScope.searchDirectorCustId
                    }
                   
                }
                },function(success){

                    var temp = 0;
                   
                    if(success.length == 1){
                         window.alert('This Director Already Assigned.');
                          temp++;
                            }
                            if(temp == 0){
                             $rootScope.billCustomerDirectorDetails.push({
                                 id : $scope.search.mobileNumber1.originalObject.id,
                           directorName : $scope.search.mobileNumber1.originalObject.customerName,
                           mobileNumber : $scope.search.mobileNumber1.originalObject.mobileNumber
                           
                        });
                            }
                           

                        $rootScope.searchDirectorCustId = undefined;



                },function(error){
                     console.log("not exists");

                });
            }
             
           
             
            
            
         }
         $rootScope.contact12 = 0;
        $scope.contact2 = function(value){
            if(value == 0){
                $rootScope.contact12 = 1;
            }
            else{
                $rootScope.contact12 = 0;
            }
            
        }
         $scope.closeModal = function() {

            $modalInstance.dismiss('cancel');

        };
        
         $scope.vehicalType = [{
            'desc': 'Manual'
        }, {
            'desc': 'Automatic'
        }, {
            'desc': 'Luxury'
        }];

        $scope.updateAttendanceDetails = function(){
            var count = 0;
             if(angular.isUndefined($rootScope.editAttendanceDetails.inDate) || $rootScope.editAttendanceDetails.inDate == null || $rootScope.editAttendanceDetails.inDate == '')
             {
                    document.getElementById("reportingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("reportingDate1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("reportingDate1").style.borderBottom = "";
                    document.getElementById("reportingDate1").innerHTML = ' ';
             } 
             if(angular.isUndefined($rootScope.editAttendanceDetails.outDate) || $rootScope.editAttendanceDetails.outDate == null || $rootScope.editAttendanceDetails.outDate == '')
             {
                    document.getElementById("relievingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("relievingDate1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("relievingDate1").style.borderBottom = "";
                    document.getElementById("relievingDate1").innerHTML = ' ';
             } 
             if(angular.isUndefined($rootScope.editAttendanceDetails.dutyType) || $rootScope.editAttendanceDetails.dutyType == null || $rootScope.editAttendanceDetails.dutyType == '')
             {
                    document.getElementById("dutyType1").style.borderBottom = "1px solid red";
                    document.getElementById("dutyType1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("dutyType1").style.borderBottom = "";
                    document.getElementById("dutyType1").innerHTML = ' ';
             } 
             if(angular.isUndefined($rootScope.editAttendanceDetails.inTime) || $rootScope.editAttendanceDetails.inTime == null || $rootScope.editAttendanceDetails.inTime == '')
             {
                    document.getElementById("reportingTime1").style.borderBottom = "1px solid red";
                    document.getElementById("reportingTime1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("reportingTime1").style.borderBottom = "";
                    document.getElementById("reportingTime1").innerHTML = ' ';
             } 
             if(angular.isUndefined($rootScope.editAttendanceDetails.outTime) || $rootScope.editAttendanceDetails.outTime == null || $rootScope.editAttendanceDetails.outTime == '')
             {
                    document.getElementById("relievingTime1").style.borderBottom = "1px solid red";
                    document.getElementById("relievingTime1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("relievingTime1").style.borderBottom = "";
                    document.getElementById("relievingTime1").innerHTML = ' ';
             } 
             if(angular.isUndefined($rootScope.editAttendanceDetails.status) || $rootScope.editAttendanceDetails.status == null || $rootScope.editAttendanceDetails.status == '')
             {
                    document.getElementById("status1").style.borderBottom = "1px solid red";
                    document.getElementById("status1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("status1").style.borderBottom = "";
                    document.getElementById("status1").innerHTML = ' ';
             } 
            
            if (count == 0) {
                $rootScope.editAttendanceDetails.inTime = $filter('date')($rootScope.editAttendanceDetails.inTime, 'HH:mm:ss'); ;
                $rootScope.editAttendanceDetails.outTime = $filter('date')($rootScope.editAttendanceDetails.outTime, 'HH:mm:ss'); ;
                $rootScope.editAttendanceDetails.$save();
                $modalInstance.dismiss('cancel');
                //  window.alert('Updated');
                   $.notify('Successfully updated.', {
                          status: 'success'
                      });
                // $scope.showAttendance();
                 reloadFunc();
                   
            }
        }
        $scope.addNewDuty = function(){
            var count = 0;
             if(angular.isUndefined($rootScope.addNewDutyDetails.reportingDate) || $rootScope.addNewDutyDetails.reportingDate == null || $rootScope.addNewDutyDetails.reportingDate == '')
             {
                    document.getElementById("reportingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("reportingDate1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("reportingDate1").style.borderBottom = "";
                    document.getElementById("reportingDate1").innerHTML = ' ';
             } 
              if(angular.isUndefined($rootScope.addNewDutyDetails.reportingTime) || $rootScope.addNewDutyDetails.reportingTime == null || $rootScope.addNewDutyDetails.reportingTime == '')
             {
                    document.getElementById("reportingTime1").style.borderBottom = "1px solid red";
                    document.getElementById("reportingTime1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("reportingTime1").style.borderBottom = "";
                    document.getElementById("reportingTime1").innerHTML = ' ';
             }
             if(angular.isUndefined($rootScope.addNewDutyDetails.relievingDate) || $rootScope.addNewDutyDetails.relievingDate == null || $rootScope.addNewDutyDetails.relievingDate == '')
             {
                    document.getElementById("relievingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("relievingDate1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("relievingDate1").style.borderBottom = "";
                    document.getElementById("relievingDate1").innerHTML = ' ';
             } 
              if(angular.isUndefined($rootScope.addNewDutyDetails.relievingTime) || $rootScope.addNewDutyDetails.relievingTime == null || $rootScope.addNewDutyDetails.relievingTime == '')
             {
                    document.getElementById("relievingTime1").style.borderBottom = "1px solid red";
                    document.getElementById("relievingTime1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("relievingTime1").style.borderBottom = "";
                    document.getElementById("relievingTime1").innerHTML = ' ';
             } 
               if(angular.isUndefined($rootScope.addNewDutyDetails.dutyType) || $rootScope.addNewDutyDetails.dutyType == null || $rootScope.addNewDutyDetails.dutyType == '')
             {
                    document.getElementById("dutyType1").style.borderBottom = "1px solid red";
                    document.getElementById("dutyType1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("dutyType1").style.borderBottom = "";
                    document.getElementById("dutyType1").innerHTML = ' ';
             } 
              if(angular.isUndefined($rootScope.addNewDutyDetails.status) || $rootScope.addNewDutyDetails.status == null || $rootScope.addNewDutyDetails.status == '')
             {
                    document.getElementById("status1").style.borderBottom = "1px solid red";
                    document.getElementById("status1").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("status1").style.borderBottom = "";
                    document.getElementById("status1").innerHTML = ' ';
             } 
            if(count == 0){
              var count1 = 0; 
              if($rootScope.addNewDutyDetails.reportingDate > $rootScope.addNewDutyDetails.relievingDate)
             {
                    document.getElementById("reportingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("reportingDate1").innerHTML = '*relievingDate Should be greater than reportingDate';
                    document.getElementById("relievingDate1").style.borderBottom = "1px solid red";
                    document.getElementById("relievingDate1").innerHTML = '*relievingDate Should be greater than reportingDate';
                    count1++;
             }else{
                     document.getElementById("reportingDate1").style.borderBottom = " ";
                    document.getElementById("reportingDate1").innerHTML = ' ';
                    document.getElementById("relievingDate1").style.borderBottom = " ";
                    document.getElementById("relievingDate1").innerHTML = ' ';
                    var inDate = $filter('date')($rootScope.addNewDutyDetails.reportingDate, 'dd-MM-yyyy');
                    var outDate = $filter('date')($rootScope.addNewDutyDetails.relievingDate, 'dd-MM-yyyy');
                    
                    if(inDate == outDate){
                        if($rootScope.addNewDutyDetails.reportingTime > $rootScope.addNewDutyDetails.relievingTime)
                           {
                                  document.getElementById("reportingTime1").style.borderBottom = "1px solid red";
                                  document.getElementById("reportingTime1").innerHTML = '*relievingTime Should be greater than reportingTime';
                                  document.getElementById("relievingTime1").style.borderBottom = "1px solid red";
                                  document.getElementById("relievingTime1").innerHTML = '*relievingTime Should be greater than reportingTime';
                                  count1++;
                           }
                        else{
                                 document.getElementById("reportingTime1").style.borderBottom = " ";
                                  document.getElementById("reportingTime1").innerHTML = ' ';
                                  document.getElementById("relievingTime1").style.borderBottom = " ";
                                  document.getElementById("relievingTime1").innerHTML = ' ';
                                 
                             }
                    }
             }
              if(count1 == 0 && count == 0){
                var driverId = $localStorage.get('billingDriverId');
                var company2CustomerId = $localStorage.get('billingCustomerId');
                //$localStorage.put('billingDriverCustomerId',billingDriverCustomerId); 
                var customerId = $localStorage.get('billingDriverCustomerId'); 

                 var  inTime = $filter('date')($rootScope.addNewDutyDetails.reportingTime, 'HH:mm:ss');
                var outTime = $filter('date')($rootScope.addNewDutyDetails.relievingTime, 'HH:mm:ss');
                  
                  // var reportingDate =  $filter('date')($rootScope.addNewDutyDetails.reportingDate, 'yyyy-dd-MM');
                  // var relievingDate =  $filter('date')($rootScope.addNewDutyDetails.relievingDate, 'yyyy-dd-MM');
                  
                  DriverAttendance.addDriverAttendance({
                          driverId: driverId,  
                          company2CustomerId: company2CustomerId,
                          dutyType:$rootScope.addNewDutyDetails.dutyType,
                          inDate:$rootScope.addNewDutyDetails.reportingDate,
                          inTime:inTime,
                          outDate:$rootScope.addNewDutyDetails.relievingDate,
                          outTime:outTime,
                          status:$rootScope.addNewDutyDetails.status,
                          createdBy:$rootScope.userId,
                          city:'undefined',
                          customerId:customerId


                    }, function(success){
                         $modalInstance.dismiss('cancel');
                       window.alert('Attendance Added Successfully.');
                         reloadFunc();
                         //$localStorage.put('billingDriverCustomerId',undefined);
                         //$localStorage.put('billingDriverId',undefined);
                                                 
                    }, function(error){
                       // console.log('error' +JSON.stringify(error));
                        window.alert('Oops! You are disconnected from server.');
                      //  $state.go('page.login');
                    });
                }
                }
        }
         function reloadFunc() {
                $scope.count = 0;
                $scope.timers = setInterval(reloadData, 5);
                 $modalInstance.dismiss('cancel');
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
         $rootScope.driverAttendanceDetailsPopUp = function() { 

            var count = 0;
            if(angular.isUndefined($rootScope.searchDrvId) || $rootScope.searchDrvId == null || $rootScope.searchDrvId == '')
             {

                    document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                    document.getElementById("appointDriverMobileNumber").innerHTML = '*required';
                    count++;
             }else{
                    document.getElementById("appointDriverMobileNumber").style.borderBottom = "";
                    document.getElementById("appointDriverMobileNumber").innerHTML = ' ';
             }
             if(count == 0){
 
                  Company2DriverDetails.validateAppointedDriver({
                  
                          driverId: $rootScope.searchDrvId
                    
                    },function(success){
                      if(success[0].validate_appointed_driver == 2){

                                    $modalInstance.dismiss('cancel');
                                      var modalInstance = $modal.open({
                                      templateUrl: '/appointedDriverDetails.html',//crteate billing popupp
                                      controller: searchDriverModalCtrl
                                       });
                                      var state = $('#modal-state');
                                      modalInstance.result.then(function() {
                                      state.text('Modal dismissed with OK status');
                                     }, function() {
                                      state.text('Modal dismissed with Cancel status');
                                     });
                               
                      }
                      else if(success[0].validate_appointed_driver == 3){
                             document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                             document.getElementById("appointDriverMobileNumber").innerHTML = '*Driver Balance is Negative';
                      }
                       else if(success[0].validate_appointed_driver == 0){
                             document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                             document.getElementById("appointDriverMobileNumber").innerHTML = '*Driver is Blocked';
                      }
                       else if(success[0].validate_appointed_driver == 1){
                             document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                             document.getElementById("appointDriverMobileNumber").innerHTML = '*Driver license is Expired';
                      }
                        else if(success[0].validate_appointed_driver == 4){
                             document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                             document.getElementById("appointDriverMobileNumber").innerHTML = '*Driver Already appointed';
                      }
                      else{
                         document.getElementById("appointDriverMobileNumber").style.borderBottom = "1px solid red";
                             document.getElementById("appointDriverMobileNumber").innerHTML = '*Driver not Found';

                      }
                     },function(error){
                         window.alert('Oops! You are disconnected from server.');
                          $modalInstance.dismiss('cancel');
                           $state.go('page.login');
                       });
                } 
         };
         $scope.fetchAppointedCustomerList = function(){
             $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if($rootScope.operationCitySelect === 'All'){
                CustomerDetails.getCustomers({
                 operationCity: $rootScope.operationCitySelect
            }, function(customerData) {

                //console.log('customerData' + JSON.stringify(customerData));
                $scope.allCustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                     

                    $scope.allCustomerList.push({
                        id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.allCustomerList));

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
                $scope.allCustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                     

                    $scope.allCustomerList.push({
                         id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.allCustomerList));

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
                $scope.allCustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                   

                    $scope.allCustomerList.push({
                         id: customerData[i].id,
                        mobileNumber:  customerData[i].mobile_number,
                        customerName:  customerData[i].first_name + ' ' +  customerData[i].last_name,
                        custDetails:  customerData[i].first_name + ' ' +  customerData[i].last_name + ' - ' + customerData[i].mobile_number


                    });
                }

                // console.log('customer List = ' + JSON.stringify($scope.allCustomerList));

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

        $scope.fetchsearchAppointedDrvList = function() {// fetch all drivers list


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
        
         $scope.custSearchMobileSelected = function() {//mobile number selected

            if ($scope.search !== undefined && $scope.search.mobileNumber1 !== undefined && $scope.search.mobileNumber1 !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));

                $rootScope.searchDirectorCustId = $scope.search.mobileNumber1.originalObject.id;
              }
        };

         $scope.drvSearchMobileSelected = function() {//mobile number selected

            if ($scope.search !== undefined && $scope.search.mobileNumber2 !== undefined && $scope.search.mobileNumber2 !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));

                $rootScope.searchDrvId = $scope.search.mobileNumber2.originalObject.id;
                $rootScope.appointDriverDetails.mobileNumber =  $scope.search.mobileNumber2.originalObject.mobileNumber;
                $rootScope.appointDriverDetails.name = $scope.search.mobileNumber2.originalObject.driverName;
            }
        };

        $scope.verifyEmailFunction1 = function(billCustomer) {//email verify for update attendancecustomer 
            //console.log('customer update data: ' + JSON.stringify(billCustomer));
            var conUserId = billCustomer.conuserId;
            if (angular.isUndefined(billCustomer.email)) {
                var email = null;
            } else {

                var email = billCustomer.email;
            }

            $scope.isDisabledButton = true;
            ConUsers.find({
                filter: {
                    where: {
                        email: email
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {

                    if (custSuccess[0].id === conUserId) {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $scope.updateCompanyCustomerDetails(billCustomer);
                        //console.log('same entry');
                    } else {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Email exist';
                        $scope.isDisabledButton = false;
                        return false;
                        //console.log('different entry');
                    }

                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    //console.log('new entry');
                    $scope.updateCompanyCustomerDetails(billCustomer)
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
        function reloadFunc() {
                $scope.count = 0;
                $scope.timers = setInterval(reloadData, 5);
            }
        $scope.updateCompanyCustomerDetails = function(billCustomer) {//update Attendancecustomer details
            //console.log('customer update data: '+JSON.stringify(billCustomer));

            $rootScope.loader = 1;
            var count = 0;
            var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (angular.isUndefined(billCustomer.firstName) || billCustomer.firstName === '') {
                document.getElementById("firstName").style.borderBottom = "1px solid red";
                document.getElementById("firstName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("firstName").style.borderColor = "#dde6e9";
                document.getElementById("firstName1").innerHTML = '';

            }

            // if (angular.isUndefined(billCustomer.lastName) || billCustomer.lastName === '' || billCustomer.lastName === null) {
            //     document.getElementById("lastName").style.borderBottom = "1px solid red";
            //     document.getElementById("lastName1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("lastName").style.borderColor = "#dde6e9";
            //     document.getElementById("lastName1").innerHTML = '';


            // }
            if (angular.isUndefined(billCustomer.email) || billCustomer.email === '' || billCustomer.email === null) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';
                count++;
            } else if (!mailTest.test(billCustomer.email) && billCustomer.email.length > 0) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
            }


            if (angular.isUndefined(billCustomer.agreementNumber) || billCustomer.agreementNumber === '' || billCustomer.agreementNumber === null) {
                document.getElementById("agreementNumber").style.borderBottom = "1px solid red";
                document.getElementById("agreementNumber1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementNumber").style.borderColor = "#dde6e9";
                document.getElementById("agreementNumber1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.contactPersonName) || billCustomer.contactPersonName === '' || billCustomer.contactPersonName === null) {
                document.getElementById("contactPersonName").style.borderBottom = "1px solid red";
                document.getElementById("contactPersonName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("contactPersonName").style.borderColor = "#dde6e9";
                document.getElementById("contactPersonName1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.contactPersonEmail) || billCustomer.contactPersonEmail === '' || billCustomer.contactPersonEmail === null) {
                document.getElementById("contactPersonEmail").style.borderBottom = "1px solid red";
                document.getElementById("contactPersonEmail1").innerHTML = '*required';

                count++;
            } else if (!mailTest.test(billCustomer.contactPersonEmail) && billCustomer.contactPersonEmail.length > 0) {
                document.getElementById("contactPersonEmail").style.borderColor = "red";
                document.getElementById("contactPersonEmail1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("contactPersonEmail").style.borderColor = "#dde6e9";
                document.getElementById("contactPersonEmail1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.vehicleName) || billCustomer.vehicleName === '' || billCustomer.vehicleName === null) {
                document.getElementById("vehicleName").style.borderBottom = "1px solid red";
                document.getElementById("vehicleName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("vehicleName").style.borderColor = "#dde6e9";
                document.getElementById("vehicleName1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.vehicleType) || billCustomer.vehicleType === '' || billCustomer.vehicleType === null) {
                document.getElementById("vehicleType").style.borderBottom = "1px solid red";
                document.getElementById("vehicleType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("vehicleType").style.borderColor = "#dde6e9";
                document.getElementById("vehicleType1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.gstinNumber) || billCustomer.gstinNumber === '' || billCustomer.gstinNumber === null) {
                document.getElementById("gstnNumber").style.borderBottom = "1px solid red";
                document.getElementById("gstnNumber1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("gstnNumber").style.borderColor = "#dde6e9";
                document.getElementById("gstnNumber1").innerHTML = '';


            }


            if (angular.isUndefined(billCustomer.address) || billCustomer.address === '' || billCustomer.address === null) {
                document.getElementById("address").style.borderBottom = "1px solid red";
                document.getElementById("address1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("address").style.borderColor = "#dde6e9";
                document.getElementById("address1").innerHTML = '';


            }
 

            if (angular.isUndefined(billCustomer.adminCharge) || billCustomer.adminCharge === '' || billCustomer.adminCharge === null) {
                document.getElementById("adminCharge").style.borderBottom = "1px solid red";
                document.getElementById("adminCharge1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("adminCharge").style.borderColor = "#dde6e9";
                document.getElementById("adminCharge1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.adminChargeType) || billCustomer.adminChargeType === '' || billCustomer.adminChargeType === null) {
                document.getElementById("adminChargeType").style.borderBottom = "1px solid red";
                document.getElementById("adminChargeType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("adminChargeType").style.borderColor = "#dde6e9";
                document.getElementById("adminChargeType1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.agreementStartDate) || billCustomer.agreementStartDate === '' || billCustomer.agreementStartDate === null) {
                document.getElementById("agreementStartDate").style.borderBottom = "1px solid red";
                document.getElementById("agreementStartDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementStartDate").style.borderColor = "#dde6e9";
                document.getElementById("agreementStartDate1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.agreementEndDate) || billCustomer.agreementEndDate === '' || billCustomer.agreementEndDate === null) {
                document.getElementById("agreementEndDate").style.borderBottom = "1px solid red";
                document.getElementById("agreementEndDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementEndDate").style.borderColor = "#dde6e9";
                document.getElementById("agreementEndDate1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.contactPerson2Name) || billCustomer.contactPerson2Name === '' || billCustomer.contactPerson2Name === null) {
                  billCustomer.contactPerson2Name = '';
            } 
            if (angular.isUndefined(billCustomer.contactPerson2Email) || billCustomer.contactPerson2Email === '' || billCustomer.contactPerson2Email === null) {
                 billCustomer.contactPerson2Email = '';
            }
            if (angular.isUndefined(billCustomer.contactPerson2MobileNumber) || billCustomer.contactPerson2MobileNumber === '' || billCustomer.contactPerson2MobileNumber === null) {
                  billCustomer.contactPerson2MobileNumber = '';
            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;

                var compName = $localStorage.get('selectedCompanyName');
                if (compName === 'ID Services') {
                    ConUsers.findById({
                            id: $rootScope.cuid
                        },
                        function(ConUsers) {
                            //console.log('fetch conuser for update' + JSON.stringify(ConUsers));
                            ConUsers.firstName = billCustomer.firstName;
                            ConUsers.lastName = billCustomer.lastName;
                            ConUsers.email = billCustomer.email;
                            ConUsers.mobileNumber = billCustomer.contactNo;
                            ConUsers.username = billCustomer.contactNo;
                            ConUsers.password = billCustomer.contactNo;
                            ConUsers.address = billCustomer.address;
                            ConUsers.updatedBy = $rootScope.userId;
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            //console.log('ConUsers updated : ' + JSON.stringify(ConUsers));
                            Company1CustomerDetails.findById({
                                    id: $rootScope.custID
                                },
                                function(customerData) {

                                    //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                                    customerData.landline = billCustomer.landline;
                                    customerData.contactPersonName = billCustomer.contactPersonName;
                                    customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                                    customerData.vehicleName = billCustomer.vehicleName;
                                    customerData.vehicleType = billCustomer.vehicleType;
                                    customerData.hsaNumber = billCustomer.hsaNumber; 
                                    customerData.agreementStartDate = billCustomer.agreementStartDate;
                                    customerData.agreementEndDate = billCustomer.agreementEndDate; 
                                    customerData.updatedBy = $rootScope.userId; 
                                    customerData.updatedDate = new Date();
                                    customerData.$save();
                                    //console.log('customer updated: ' + JSON.stringify(customerData));
                                    Company1CustomerRate.find({
                                        filter: {
                                            where: {
                                                company1CustomerId: customerData.id
                                            }
                                        }
                                    }, function(succesCR) {
                                        //console.log('fetch customer rate for update: ' + JSON.stringify(succesCR));
                                        if (succesCR.length > 0) {
                                            for (var i = 0; i < succesCR.length; i++) {
                                                if (succesCR[i].itemId === '1') {

                                                    succesCR[i].value = (billCustomer.monthlySalary / 30);
                                                    succesCR[i].$save();
                                                }
                                                if (succesCR[i].itemId === '2') {

                                                    succesCR[i].value = billCustomer.otRate;
                                                    succesCR[i].$save();
                                                }
                                                if (succesCR[i].itemId === '3') {

                                                    succesCR[i].value = billCustomer.osaRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '4') {

                                                    succesCR[i].value = billCustomer.nsaRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '5') {

                                                    succesCR[i].value = billCustomer.edRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '6') {

                                                    succesCR[i].value = billCustomer.adminCharge;
                                                    succesCR[i].unit = billCustomer.adminChargeType;
                                                    succesCR[i].$save();

                                                }
                                            }
                                            //console.log('updated customer rate: ' + JSON.stringify(succesCR));
                                        }
                                        $modalInstance.dismiss('cancel');
                                      
                                        $rootScope.getBillingCustomerDetails();

                                        $rootScope.loader = 0;


                                    }, function(error) {
                                        console.log('Error updating customer details : ' + JSON.stringify(error));
                                        $scope.isDisabledButton = false;
                                        $rootScope.loader = 0;
                                    });

                                },
                                function(error) {
                                    console.log('Error updating customer details : ' + JSON.stringify(error));
                                    $scope.isDisabledButton = false;
                                    $rootScope.loader = 0;
                                });

                        },
                        function(error) {
                            console.log('Error updating Customer : ' + JSON.stringify(error));
                            $scope.isDisabledButton = false;
                            $rootScope.loader = 0;
                        });

                } else {

                    ConUsers.findById({
                            id: $rootScope.cuid
                        },
                        function(ConUsers) {
                            //console.log('fetch conuser for update' + JSON.stringify(ConUsers));
                            ConUsers.firstName = billCustomer.firstName;
                            ConUsers.lastName = billCustomer.lastName;
                            ConUsers.email = billCustomer.email;
                            ConUsers.mobileNumber = billCustomer.contactNo;
                            ConUsers.username = billCustomer.contactNo;
                            ConUsers.password = billCustomer.contactNo;
                            ConUsers.address = billCustomer.address;
                            ConUsers.updatedBy = $rootScope.userId;
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            //console.log('ConUsers updated : ' + JSON.stringify(ConUsers));
                            Company2CustomerDetails.findById({
                                    id: $rootScope.custID
                                },
                                function(customerData) {

                                    //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                                    customerData.landline = billCustomer.landline;
                                    customerData.contactPersonName = billCustomer.contactPersonName;
                                    customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                                    customerData.vehicleName = billCustomer.vehicleName;
                                    customerData.vehicleType = billCustomer.vehicleType;
                                    customerData.hsaNumber = billCustomer.hsaNumber; 
                                    customerData.agreementStartDate = billCustomer.agreementStartDate;
                                    customerData.agreementEndDate = billCustomer.agreementEndDate; 
                                    customerData.updatedBy = $rootScope.userId; 
                                    customerData.updatedDate = new Date();
                                    customerData.contactPerson2Name = billCustomer.contactPerson2Name;
                                    customerData.contactPerson2Email = billCustomer.contactPerson2Email;
                                    customerData.contactPerson2MobileNumber = billCustomer.contactPerson2MobileNumber;
                                    customerData.$save();
                                    //console.log('customer updated: ' + JSON.stringify(customerData));
                                    Company2CustomerRate.find({
                                        filter: {
                                            where: {
                                                company2CustomerId: customerData.id
                                            }
                                        }
                                    }, function(succesCR) {
                                        //console.log('fetch customer rate for update: ' + JSON.stringify(succesCR));
                                        if (succesCR.length > 0) {
                                            for (var i = 0; i < succesCR.length; i++) {
                                                if (succesCR[i].itemId === '1') {

                                                    succesCR[i].value = (billCustomer.monthlySalary / 30);
                                                    succesCR[i].$save();
                                                }
                                                if (succesCR[i].itemId === '2') {

                                                    succesCR[i].value = billCustomer.otRate;
                                                    succesCR[i].$save();
                                                }
                                                if (succesCR[i].itemId === '3') {

                                                    succesCR[i].value = billCustomer.osaRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '4') {

                                                    succesCR[i].value = billCustomer.nsaRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '5') {

                                                    succesCR[i].value = billCustomer.edRate;
                                                    succesCR[i].$save();

                                                }
                                                if (succesCR[i].itemId === '6') {

                                                    succesCR[i].value = billCustomer.adminCharge;
                                                    succesCR[i].unit = billCustomer.adminChargeType;
                                                    succesCR[i].$save();

                                                }
                                            }
                                            //console.log('updated customer rate: ' + JSON.stringify(succesCR));
                                        }
                                        $modalInstance.dismiss('cancel');
                                        //reloadFunc();
                                        //update customer Director
                                          var customerId = $localStorage.get('billingCustomerId');
                                        if($rootScope.billCustomerDirectorDetails.length > 0){
                                                for(var i = 0;i < $rootScope.billCustomerDirectorDetails.length;i++){
                                                        var s = i;
                                                        CustomerDetails.find({
                                                            filter:{
                                                                where:{
                                                                    id : $rootScope.billCustomerDirectorDetails[s].id
                                                                }
                                                            }
                                                            },function(success){
                                                                success[0].company2CustomerId = customerId;
                                                                success[0].$save();
                                                                console.log("done");
                                                                      
                                                                        var customerId1 = $localStorage.get('billingCustomerId');
                                                                            Company2DriverDetails.assignDirector({

                                                                                company2CustomerId:customerId1,
                                                                                customerId:$rootScope.billCustomerDirectorDetails[s].id

                                                                            },function(success){
                                                                                 
                                                                                    $rootScope.getBillingCustomerDetails();
                                                                                     $rootScope.searchAppointedDriverDetails();
                                                                                     $modalInstance.dismiss('cancel');
                                                             
                                                                                     $.notify('Successfully customer updated.', {
                                                                                            status: 'success'
                                                                                        });
                                                                                  
                                                                                    $state.go('app.billingAttendanceDetails');
                                                                                   
                                                                                       reloadFunc();
                                                                                        $rootScope.loader = 0;

                                                                            },function(error){
                                                                                 window.alert('Oops! You are disconnected from server.');
                                                                         //  $state.go('page.login');


                                                                            });
                                                                        

                                                            },function(error){
                                                              window.alert('Oops! You are disconnected from server.');
                                                                 //  $state.go('page.login');

                                                            });


                                                }
                                        }
                                        else{
                                              $rootScope.loader = 0;

                                        }
                                       


                                    }, function(error) {
                                        console.log('Error updating customer details : ' + JSON.stringify(error));
                                        $scope.isDisabledButton = false;
                                        $rootScope.loader = 0;
                                    });

                                },
                                function(error) {
                                    console.log('Error updating customer details : ' + JSON.stringify(error));
                                    $scope.isDisabledButton = false;
                                    $rootScope.loader = 0;
                                });

                        },
                        function(error) {
                            console.log('Error updating Customer : ' + JSON.stringify(error));
                            $scope.isDisabledButton = false;
                            $rootScope.loader = 0;
                        });
                }

            }

        }

         function reloadFunc() {
          $modalInstance.dismiss('cancel');
                $scope.count = 0;
                $scope.timers = setInterval(reloadData, 5);
                 $modalInstance.dismiss('cancel');
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
         $scope.fetchCompanyCustomerDetails123 = function() {//fetch company customer for update
            $rootScope.loader = 1;

            //$rootScope.customerData = [];
            var compName = $localStorage.get('selectedCompanyName');
            if (compName === 'ID Services') {
                Company1CustomerDetails.findOne({
                    filter: {
                        where: {
                            id: $rootScope.custID
                        },
                        include: [{
                            relation: 'conUsers'
                        }, {
                            relation: 'company1CustomerRate'
                        }]
                    }
                }, function(customerData) {
                    //console.log('customer all Data ' + JSON.stringify(customerData));

                    if (angular.isDefined(customerData)) {
                        if (!angular.isUndefined(customerData.conUsers)) {

                            var name;
                            if (angular.isUndefined(customerData.conUsers.middleName) || customerData.conUsers.middleName == null) {
                                name = customerData.conUsers.firstName + ' ' + customerData.conUsers.lastName;
                            } else {
                                name = customerData.conUsers.firstName + ' ' + customerData.conUsers.middleName + ' ' + customerData.conUsers.lastName;
                            }


                            if (customerData.company1CustomerRate.length > 0) {
                                for (var i = 0; i < customerData.company1CustomerRate.length; i++) {

                                    if (customerData.company1CustomerRate[i].itemId === '2') {
                                        var overTime = customerData.company1CustomerRate[i].value;
                                    }
                                    if (customerData.company1CustomerRate[i].itemId === '3') {
                                        var outstationRate = customerData.company1CustomerRate[i].value;
                                    }
                                    if (customerData.company1CustomerRate[i].itemId === '4') {
                                        var nightStayRate = customerData.company1CustomerRate[i].value;
                                    }
                                    if (customerData.company1CustomerRate[i].itemId === '5') {
                                        var extraDayRate = customerData.company1CustomerRate[i].value;
                                    }
                                    if (customerData.company1CustomerRate[i].itemId === '6') {
                                        var adminCharge = customerData.company1CustomerRate[i].value;
                                        var adminChargeUnit = customerData.company1CustomerRate[i].unit;
                                    }
                                }
                            }

                            var landlineNo = null;
                            if (!angular.isUndefined(customerData.landline) || customerData.landline !== null || customerData.landline !== '') {
                                landlineNo = customerData.landline
                            }
                            var hsaNo = null;
                            if (!angular.isUndefined(customerData.hsaNumber) || customerData.hsaNumber !== null || customerData.hsaNumber !== '') {
                                hsaNo = customerData.hsaNumber
                            }
                            var weeklyOff = null;
                            if (!angular.isUndefined(customerData.weeklyOff) || customerData.weeklyOff !== null || customerData.weeklyOff !== '') {
                                weeklyOff = customerData.weeklyOff
                            }
                            $scope.billCustomer = {
                                id: customerData.id,
                                conuserId: customerData.conUsers.id,
                                agreementNumber: customerData.agreementNumber,
                                landline: landlineNo,
                                contactPersonName: customerData.contactPersonName,
                                contactPersonEmail: customerData.contactPersonEmail,
                                vehicleName: customerData.vehicleName,
                                vehicleType: customerData.vehicleType,
                                gstinNumber: customerData.gstinNumber,
                                hsaNumber: hsaNo,
                                dutyHours: customerData.dutyHours,
                                weeklyOff: weeklyOff,
                                agreementStartDate: customerData.agreementStartDate,
                                agreementEndDate: customerData.agreementEndDate,
                                companyName: customerData.companyName,
                                name: name,
                                firstName: customerData.conUsers.firstName,
                                lastName: customerData.conUsers.lastName,
                                email: customerData.conUsers.email,
                                monthlySalary: customerData.monthlySalary,
                                otRate: overTime,
                                osaRate: outstationRate,
                                nsaRate: nightStayRate,
                                edRate: extraDayRate,
                                adminCharge: adminCharge,
                                address: customerData.conUsers.address,
                                contactNo: customerData.conUsers.mobileNumber,
                                adminChargeType: adminChargeUnit,
                                driverName:customerData.driverName
                            };

                        }

                    }


                    $rootScope.loader = 0;


                }, function(customerErr) {

                    console.log('customer error ' + JSON.stringify(customerErr));
                    if (customerErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });
            } else {
                Company2CustomerDetails.findOne({
                    filter: {
                        where: {
                            id: $rootScope.custID
                        },
                        include: [{
                            relation: 'conUsers'
                        }, {
                            relation: 'company2CustomerRate'
                        }]
                    }
                }, function(customerData) {
                    //console.log('customer all Data ' + JSON.stringify(customerData));

                    if (angular.isDefined(customerData)) {
                        if (!angular.isUndefined(customerData.conUsers)) {

                            var name;
                            if (angular.isUndefined(customerData.conUsers.middleName) || customerData.conUsers.middleName == null) {
                                name = customerData.conUsers.firstName + ' ' + customerData.conUsers.lastName;
                            } else {
                                name = customerData.conUsers.firstName + ' ' + customerData.conUsers.middleName + ' ' + customerData.conUsers.lastName;
                            }


                            if (customerData.company2CustomerRate.length > 0) {
                                for (var i = 0; i < customerData.company2CustomerRate.length; i++) {

                                    if (customerData.company2CustomerRate[i].itemId === '2') {
                                        var overTime = customerData.company2CustomerRate[i].value;
                                    }
                                    if (customerData.company2CustomerRate[i].itemId === '3') {
                                        var outstationRate = customerData.company2CustomerRate[i].value;
                                    }
                                    if (customerData.company2CustomerRate[i].itemId === '4') {
                                        var nightStayRate = customerData.company2CustomerRate[i].value;
                                    }
                                    if (customerData.company2CustomerRate[i].itemId === '5') {
                                        var extraDayRate = customerData.company2CustomerRate[i].value;
                                    }
                                    if (customerData.company2CustomerRate[i].itemId === '6') {
                                        var adminCharge = customerData.company2CustomerRate[i].value;
                                        var adminChargeUnit = customerData.company2CustomerRate[i].unit;
                                    }
                                }
                            }

                            var landlineNo = null;
                            if (!angular.isUndefined(customerData.landline) || customerData.landline !== null || customerData.landline !== '') {
                                landlineNo = customerData.landline
                            }
                            var hsaNo = null;
                            if (!angular.isUndefined(customerData.hsaNumber) || customerData.hsaNumber !== null || customerData.hsaNumber !== '') {
                                hsaNo = customerData.hsaNumber
                            }
                            var weeklyOff = null;
                            if (!angular.isUndefined(customerData.weeklyOff) || customerData.weeklyOff !== null || customerData.weeklyOff !== '') {
                                weeklyOff = customerData.weeklyOff
                            }
                            $scope.billCustomer = {
                                id: customerData.id,
                                conuserId: customerData.conUsers.id,
                                agreementNumber: customerData.agreementNumber,
                                landline: landlineNo,
                                contactPersonName: customerData.contactPersonName,
                                contactPersonEmail: customerData.contactPersonEmail,
                                vehicleName: customerData.vehicleName,
                                vehicleType: customerData.vehicleType,
                                gstinNumber: customerData.gstinNumber,
                                hsaNumber: hsaNo,
                                dutyHours: customerData.dutyHours,
                                weeklyOff: weeklyOff,
                                agreementStartDate: customerData.agreementStartDate,
                                agreementEndDate: customerData.agreementEndDate,
                                companyName: customerData.companyName,
                                name: name,
                                firstName: customerData.conUsers.firstName,
                                lastName: customerData.conUsers.lastName,
                                email: customerData.conUsers.email,
                                monthlySalary: customerData.monthlySalary,
                                otRate: overTime,
                                osaRate: outstationRate,
                                nsaRate: nightStayRate,
                                edRate: extraDayRate,
                                adminCharge: adminCharge,
                                address: customerData.conUsers.address,
                                contactNo: customerData.conUsers.mobileNumber,
                                adminChargeType: adminChargeUnit,
                                driverName:customerData.driverName,
                                contactPerson2Name:customerData.contactPerson2Name,
                                contactPerson2Email:customerData.contactPerson2Email,
                                contactPerson2MobileNumber:customerData.contactPerson2MobileNumber
                            };

                        }

                    }

                    $rootScope.loader = 0;


                }, function(customerErr) {

                    console.log('customer error ' + JSON.stringify(customerErr));
                    if (customerErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $rootScope.loader = 0;
                });
            }


        }

        $scope.verifyEmailFunction = function(billCustomer) {//verify email for add new customer
            var mobNo = billCustomer.mobileNumber;
            if (angular.isUndefined(billCustomer.email)) {
                var email = null;
            } else {
                var email = billCustomer.email;
            }
    
            $scope.isDisabledButton = true;
            ConUsers.find({
                filter: {
                    where: {
                        email: email
                    }
    
                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {
    
                    if (custSuccess[0].mobileNumber === mobNo) {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $rootScope.addNewCustomer(billCustomer);
                        //console.log('same entry');
                    } else {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Email exist';
                        $scope.isDisabledButton = false;
                        return false;
                        //console.log('different entry');
                    }
    
                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    //console.log('new entry');
                    $rootScope.addNewCustomer(billCustomer);
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
        $rootScope.addNewCustomer = function(billCustomer) {
             //console.log('billCustomer' + JSON.stringify(billCustomer));
             $rootScope.loader = 1;
             var count = 0;
             var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
             if (angular.isUndefined(billCustomer.firstName) || billCustomer.firstName === '') {
                 document.getElementById("firstName").style.borderBottom = "1px solid red";
                 document.getElementById("firstName1").innerHTML = '*required';
 
                 count++;
             } else {
                 document.getElementById("firstName").style.borderColor = "#dde6e9";
                 document.getElementById("firstName1").innerHTML = '';
 
             }
 
             // if (angular.isUndefined(billCustomer.lastName) || billCustomer.lastName === '' || billCustomer.lastName === null) {
             //     document.getElementById("lastName").style.borderBottom = "1px solid red";
             //     document.getElementById("lastName1").innerHTML = '*required';
 
             //     count++;
             // } else {
             //     document.getElementById("lastName").style.borderColor = "#dde6e9";
             //     document.getElementById("lastName1").innerHTML = '';
 
 
             // }
             if (angular.isUndefined(billCustomer.email) || billCustomer.email === '' || billCustomer.email === null) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';
                count++;
            } else if (!mailTest.test(billCustomer.email) && billCustomer.email.length > 0) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
            }


            if (angular.isUndefined(billCustomer.agreementNumber) || billCustomer.agreementNumber === '' || billCustomer.agreementNumber === null) {
                document.getElementById("agreementNumber").style.borderBottom = "1px solid red";
                document.getElementById("agreementNumber1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementNumber").style.borderColor = "#dde6e9";
                document.getElementById("agreementNumber1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.contactPersonName) || billCustomer.contactPersonName === '' || billCustomer.contactPersonName === null) {
                document.getElementById("contactPersonName").style.borderBottom = "1px solid red";
                document.getElementById("contactPersonName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("contactPersonName").style.borderColor = "#dde6e9";
                document.getElementById("contactPersonName1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.contactPersonEmail) || billCustomer.contactPersonEmail === '' || billCustomer.contactPersonEmail === null) {
                document.getElementById("contactPersonEmail").style.borderBottom = "1px solid red";
                document.getElementById("contactPersonEmail1").innerHTML = '*required';

                count++;
            } else if (!mailTest.test(billCustomer.contactPersonEmail) && billCustomer.contactPersonEmail.length > 0) {
                document.getElementById("contactPersonEmail").style.borderColor = "red";
                document.getElementById("contactPersonEmail1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("contactPersonEmail").style.borderColor = "#dde6e9";
                document.getElementById("contactPersonEmail1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.vehicleName) || billCustomer.vehicleName === '' || billCustomer.vehicleName === null) {
                document.getElementById("vehicleName").style.borderBottom = "1px solid red";
                document.getElementById("vehicleName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("vehicleName").style.borderColor = "#dde6e9";
                document.getElementById("vehicleName1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.vehicleType) || billCustomer.vehicleType === '' || billCustomer.vehicleType === null) {
                document.getElementById("vehicleType").style.borderBottom = "1px solid red";
                document.getElementById("vehicleType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("vehicleType").style.borderColor = "#dde6e9";
                document.getElementById("vehicleType1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.gstnNumber) || billCustomer.gstnNumber === '' || billCustomer.gstnNumber === null) {
                document.getElementById("gstnNumber").style.borderBottom = "1px solid red";
                document.getElementById("gstnNumber1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("gstnNumber").style.borderColor = "#dde6e9";
                document.getElementById("gstnNumber1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.address) || billCustomer.address === '' || billCustomer.address === null) {
                document.getElementById("address").style.borderBottom = "1px solid red";
                document.getElementById("address1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("address").style.borderColor = "#dde6e9";
                document.getElementById("address1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.adminCharge) || billCustomer.adminCharge === '' || billCustomer.adminCharge === null) {
                document.getElementById("adminCharge").style.borderBottom = "1px solid red";
                document.getElementById("adminCharge1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("adminCharge").style.borderColor = "#dde6e9";
                document.getElementById("adminCharge1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.agreementStartDate) || billCustomer.agreementStartDate === '' || billCustomer.agreementStartDate === null) {
                document.getElementById("agreementStartDate").style.borderBottom = "1px solid red";
                document.getElementById("agreementStartDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementStartDate").style.borderColor = "#dde6e9";
                document.getElementById("agreementStartDate1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.agreementEndDate) || billCustomer.agreementEndDate === '' || billCustomer.agreementEndDate === null) {
                document.getElementById("agreementEndDate").style.borderBottom = "1px solid red";
                document.getElementById("agreementEndDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("agreementEndDate").style.borderColor = "#dde6e9";
                document.getElementById("agreementEndDate1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.adminChargeType) || billCustomer.adminChargeType === '' || billCustomer.adminChargeType === null) {
                document.getElementById("adminChargeType").style.borderBottom = "1px solid red";
                document.getElementById("adminChargeType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("adminChargeType").style.borderColor = "#dde6e9";
                document.getElementById("adminChargeType1").innerHTML = '';


            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;

                var agreementSDate = new Date(
                    billCustomer.agreementStartDate.getFullYear(),
                    billCustomer.agreementStartDate.getMonth(),
                    billCustomer.agreementStartDate.getDate() + 1);
                var agreementEDate = new Date(
                    billCustomer.agreementEndDate.getFullYear(),
                    billCustomer.agreementEndDate.getMonth(),
                    billCustomer.agreementEndDate.getDate() + 1);
                var hsaNo = null;
                if (!angular.isUndefined(billCustomer.hsaNumber) || billCustomer.hsaNumber !== null || billCustomer.hsaNumber !== '') {
                    hsaNo = billCustomer.hsaNumber;
                }
                var landlineNo = null;
                if (!angular.isUndefined(billCustomer.landlineNumber) || billCustomer.landlineNumber !== null || billCustomer.landlineNumber !== '') {
                    landlineNo = billCustomer.landlineNumber;
                }
                var weeklyOff = null;
                if (!angular.isUndefined(billCustomer.weeklyOff) || billCustomer.weeklyOff !== null || billCustomer.weeklyOff !== '') {
                    weeklyOff = billCustomer.weeklyOff;
                }
                var note = null;
                if (!angular.isUndefined(billCustomer.driverName) || billCustomer.driverName !== null || billCustomer.driverName !== '') {
                    note = billCustomer.driverName;

                }
                 if (angular.isUndefined(billCustomer.contactPerson2Name) || billCustomer.contactPerson2Name == null || billCustomer.contactPerson2Name == '') {
                    billCustomer.contactPerson2Name = '  ';

                }
                if (angular.isUndefined(billCustomer.contactPerson2Email) || billCustomer.contactPerson2Email == null || billCustomer.contactPerson2Email == '') {
                    billCustomer.contactPerson2Email = '  ';

                }
                if (angular.isUndefined(billCustomer.contactPerson2MobileNumber) || billCustomer.contactPerson2MobileNumber == null || billCustomer.contactPerson2MobileNumber == '') {
                    billCustomer.contactPerson2MobileNumber = '  ';

                }
                var agreementSDate = $filter('date')(billCustomer.agreementStartDate, 'yyyy-MM-dd');
                var agreementEDate = $filter('date')(billCustomer.agreementEndDate, 'yyyy-MM-dd');
                Company2CustomerDetails.createBillingAttendanceCustomer({
                    firstName: billCustomer.firstName,
                    lastName: '  ',
                    mobileNumber: billCustomer.mobileNumber,
                    email: billCustomer.email,
                    address: billCustomer.address,
                    agreementNumber: billCustomer.agreementNumber,
                    landline: landlineNo,
                    contactPersonName: billCustomer.contactPersonName,
                    contactPersonEmail: billCustomer.contactPersonEmail,
                    vehicleName: billCustomer.vehicleName,
                    vehicleType: billCustomer.vehicleType,
                    gstnNumber: billCustomer.gstnNumber,
                    hsaNumber: hsaNo,
                    adminCharge: billCustomer.adminCharge,
                    agreementStartDate: agreementSDate,
                    agreementEndDate: agreementEDate,
                    userId: $rootScope.userId,
                    adminChargeType: billCustomer.adminChargeType,
                    contactPerson2Name:billCustomer.contactPerson2Name,
                    contactPerson2Email:billCustomer.contactPerson2Email,
                    contactPerson2MobileNumber:billCustomer.contactPerson2MobileNumber

                }, function(createSuccess) {
                    //console.log('create customer data: ' + JSON.stringify(createSuccess));
                    
                    $scope.isDisabledButton = false;
                    $modalInstance.dismiss('cancel');
                    $localStorage.put('billingCustomerId', createSuccess[0].create_billing_attendance_customer);
                    
                     var id =Number(createSuccess[0].create_billing_attendance_customer);
                     Company2CustomerDetails.findById({
                                    id: id,
                        },function(s){
                            var conuserId = Number(s.conuserId);
                            ConUsers.findById({
                                id:conuserId
                            },function(ConUsers){
                            ConUsers.password = billCustomer.mobileNumber;
                            ConUsers.updatedBy = $localStorage.get('userId');
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            $rootScope.loader = 0;

                              $state.go('app.driverAttendance');
                    window.alert('Customer added Successfully.');
                   
                             reloadFunc();
                            },function(error){
                            });
                        },function(error){
                        });
                   

                }, function(createErr) {
                    console.log('create customer error: ' + JSON.stringify(createErr));
                    $scope.isDisabledButton = false;
                    $modalInstance.dismiss('cancel');
                });
            }
            

            
        }
        $scope.adminChargeArray = [{
            'desc': 'Amount'
        }, {
            'desc': 'Percentage'
        }];
        $scope.dutyType = [{
            'desc': 'Local'
        },{
            'desc': 'Outstation'
        }];
        $scope.status = [{
            'desc': 'Approved by Admin'
        },{
            'desc': 'Approved by Client'
        }, {
            'desc': 'On Duty'
        },{
            'desc': 'Submit'
        }, {
            'desc': 'On Leave'
        }];


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
    }
    $rootScope.updateExistingUser = function() {// to add new bill with new customer


        $rootScope.createButtonDisable = true;
        //var cellNumber = document.getElementById('billingMobileNo_value').value;

        var modalInstance = $modal.open({
            templateUrl: '/updateBillingCustomer.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });

        var compName = $localStorage.get('selectedCompanyName');
        $rootScope.billCustomer = {
            conuserId: $rootScope.existingUserData[0].id,
            mobileNumber: $rootScope.existingUserData[0].mobileNumber,
            companyName: compName,
            firstName: $rootScope.existingUserData[0].firstName,
            lastName: $rootScope.existingUserData[0].lastName,
            email: $rootScope.existingUserData[0].email,
            address: $rootScope.existingUserData[0].address + ', ' + $rootScope.existingUserData[0].addressLine2
        };

    }

    $scope.updateCompanyCustomerPopup12 = function(cid, uid) { // popup to update customer for company
        //console.log('update customer ID' + JSON.stringify(cid));
        //console.log('update conuser ID' + JSON.stringify(uid));
        $rootScope.custID = cid;
        $rootScope.cuid = uid;

        var modalInstance = $modal.open({
            templateUrl: '/updateCompanyCustomerPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
    

        

    $rootScope.searchDriver = function() { //search customer and create bill for existing user

        if (!angular.isUndefined($scope.billingCustId)) {
            $localStorage.put('billingCustomerId', $scope.billingCustId);
            //$state.go('app.billingAttendanceDetails');
        } else {
            var count = 0;
            $rootScope.createButtonDisable = true;
            var cellNumber = document.getElementById('billingMobileNo_value').value;

            if (angular.isUndefined($rootScope.billingCustNumber) || $rootScope.billingCustNumber == null || $rootScope.billingCustNumber == '') {
                if (angular.isUndefined(cellNumber) || cellNumber === '' || cellNumber === null) {
                    document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                    document.getElementById("billingMobileNo1").innerHTML = '*required';
                    count++;
                } else {
                    if ((cellNumber.length < 10 || cellNumber.length > 10) && isNaN(cellNumber) == false) {
                        document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("billingMobileNo1").innerHTML = 'Invalid number';
                        count++;
                    } else if (isNaN(cellNumber)) {
                        document.getElementById("billingMobileNo").style.borderBottom = "1px solid red";
                        document.getElementById("billingMobileNo1").innerHTML = 'Enter only number';
                        count++;
                    } else {
                        document.getElementById("billingMobileNo").style.borderColor = "#dde6e9";
                        document.getElementById("billingMobileNo1").innerHTML = '';
                    }

                }


            }

            if (count > 0) {
                $scope.count = count;
                return false;
            } else {

                $scope.count = 0;

                var modalInstance = $modal.open({
                    templateUrl: '/searchDriver.html',//crteate billing popupp
                    controller: searchDriverModalCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
                var compName = $localStorage.get('selectedCompanyName');
                $rootScope.billCustomer = {
                    mobileNumber: cellNumber,
                    companyName: compName
                };

            }
        }
    }
    var searchDriverModalCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
             
        $scope.driverShowPastAttendance= function(){
           var count = 0;
            if (angular.isUndefined($rootScope.driverShowPastAttendancedata.month) || $rootScope.driverShowPastAttendancedata.month === '' || angular.isUndefined($rootScope.driverShowPastAttendancedata.month)) {
                document.getElementById("month1").style.borderBottom = "1px solid red";
                document.getElementById("month1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("month1").style.borderColor = "#dde6e9";
                document.getElementById("month1").innerHTML = '';

            }
            if(count == 0){
               console.log($rootScope.driverShowPastAttendancedata.month);
                 var startDate = $rootScope.driverShowPastAttendancedata.month;
                 var startDateMonth = $filter('date')($rootScope.driverShowPastAttendancedata.month, 'MM');
                 startDateMonth++;
                 if(startDateMonth == 12){
                    startDateMonth = 0;
                 }


                 var lastDate = new Date(startDateMonth+'-01-20');
               
                 DriverAttendance.find({
                    filter:{
                        where:{

                           driverId:$rootScope.billingAttendanceDriverId,
                             and:[
                                 {inDate:{gt: startDate }},
                                 {inDate:{lt: lastDate}}
                                 ]

                        }
                    }

                    },function(success){
                            

                        if(success.length == 0){

                             window.alert('Driver this month Data Not available to retrieve is Empty');
                  

                        }
                        else{
                             var startDate = new Date($rootScope.billingAttendanceDoj);
                              var lastDate = new Date($rootScope.billingAttendanceDol);


                             for (var i = 0; i < success.length; i++) 
                              {
                                var tempIndate = new Date(success[i].inDate);

                                 if(tempIndate >= startDate && tempIndate <= lastDate){
                                     $rootScope.driverShowPastAttendancedata[i] = success[i];

                                 }
                                   else{
                                        window.alert('Driver this month Data Not available to retrieve is Empty');
                                   }
                              
                              }


                        }
                      
                    },function(error){

                    });
            }




        }
        $scope.billingDriverApptendance = function(driverId,doj,dol){
            $rootScope.driverShowPastAttendancedata = [];
                $rootScope.billingAttendanceDol = dol;
                  $rootScope.billingAttendanceDoj = doj;
                  console.log(dol)
             $rootScope.billingAttendanceDriverId = driverId;
              $modalInstance.dismiss('cancel');
                          var modalInstance = $modal.open({
                         templateUrl: '/billingDriverApptendancePopUp.html',
                         controller: searchDriverModalCtrl
                      });


                       var state = $('#modal-state');
                       modalInstance.result.then(function() {
                        state.text('Modal dismissed with OK status');
                      }, function() {
                              state.text('Modal dismissed with Cancel status');
                          });
        }
        $scope.getAppointDriverHistory = function(){
            var customerId = $localStorage.get('billingCustomerId');
            $rootScope.billingAppintedDriverDetails = [];
                Company2DriverDetails.getBillingDriverHistoryDetails ({
                                 
                                        company2CustomerId:customerId
                                 
                            },function(success){
                                
                                 if(success.length == 0){
                                            $modalInstance.dismiss('cancel');
                                            window.alert('Driver Employment History Not available to retrieve is Empty');
                                    }
                                     else{

                                               $rootScope.billingAppintedDriverDetails = success;
                                     }
                    
                            },function(error){
                                console.log("error");

                            });
        };
         $scope.weeklyOffArray = [{
            'desc': 'Sunday'
        }, {
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
        }];
        $scope.driverCycle = [{
            'desc': '01-30'
        }, {
            'desc': '20-21'
        }, {
            'desc': '25-26'
        }];
        $scope.dutyHour = [{
            'desc': '1'
        }, {
            'desc': '2'
        }, {
            'desc': '3'
        }, {
            'desc': '4'
        }, {
            'desc': '5'
        }, {
            'desc': '6'
        }, {
            'desc': '7'
        }, {
            'desc': '8'
        }, {
            'desc': '9'
        }, {
            'desc': '10'
        }, {
            'desc': '11'
        }, {
            'desc': '12'
        }, {
            'desc': '13'
        }, {
            'desc': '14'
        }];
         

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
         $scope.closeModal = function() {

            $modalInstance.dismiss('cancel');

        };
        $scope.appointDriver = function() {

            var count = 0;
            if (angular.isUndefined($rootScope.appointDriverDetails.dutyHours) || $rootScope.appointDriverDetails.dutyHours === '') {
                document.getElementById("dutyHours1").style.borderBottom = "1px solid red";
                document.getElementById("dutyHours1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("dutyHours1").style.borderColor = "#dde6e9";
                document.getElementById("dutyHours1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.weeklyOff) || $rootScope.appointDriverDetails.weeklyOff === '') {
                document.getElementById("weeklyOff1").style.borderBottom = "1px solid red";
                document.getElementById("weeklyOff1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("weeklyOff1").style.borderColor = "#dde6e9";
                document.getElementById("weeklyOff1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.otRate) || $rootScope.appointDriverDetails.otRate === '') {
                document.getElementById("otRate1").style.borderBottom = "1px solid red";
                document.getElementById("otRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("otRate1").style.borderColor = "#dde6e9";
                document.getElementById("otRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.nsaRate) || $rootScope.appointDriverDetails.nsaRate === '') {
                document.getElementById("nsaRate1").style.borderBottom = "1px solid red";
                document.getElementById("nsaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("nsaRate1").style.borderColor = "#dde6e9";
                document.getElementById("nsaRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.edRate) || $rootScope.appointDriverDetails.edRate === '') {
                document.getElementById("edRate1").style.borderBottom = "1px solid red";
                document.getElementById("edRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("edRate1").style.borderColor = "#dde6e9";
                document.getElementById("edRate1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.salary) || $rootScope.appointDriverDetails.salary === '') {
                document.getElementById("salary1").style.borderBottom = "1px solid red";
                document.getElementById("salary1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("salary1").style.borderColor = "#dde6e9";
                document.getElementById("salary1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.driverCycle) || $rootScope.appointDriverDetails.driverCycle === '') {
                document.getElementById("driverCycle1").style.borderBottom = "1px solid red";
                document.getElementById("driverCycle1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("driverCycle1").style.borderColor = "#dde6e9";
                document.getElementById("driverCycle1").innerHTML = '';

            }
            if (angular.isUndefined($rootScope.appointDriverDetails.appointedDate) || $rootScope.appointDriverDetails.appointedDate === '') {
                document.getElementById("appointedDate1").style.borderBottom = "1px solid red";
                document.getElementById("appointedDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("appointedDate1").style.borderColor = "#dde6e9";
                document.getElementById("appointedDate1").innerHTML = '';

            }
            
            if (angular.isUndefined($rootScope.appointDriverDetails.osaRate) || $rootScope.appointDriverDetails.osaRate === '') {
                document.getElementById("osaRate1").style.borderBottom = "1px solid red";
                document.getElementById("osaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("osaRate1").style.borderColor = "#dde6e9";
                document.getElementById("osaRate1").innerHTML = '';

            }
              
            if(count == 0){
                var customerId = $localStorage.get('billingCustomerId');
                Company2CustomerDetails.addAppointDriver({
                    customerId:customerId,
                    driverName:$rootScope.appointDriverDetails.name,
                    driverId:$rootScope.searchDrvId,
                    driverHours:$rootScope.appointDriverDetails.dutyHours,
                    weeklyOff:$rootScope.appointDriverDetails.weeklyOff,
                    otRate:$rootScope.appointDriverDetails.otRate,
                    nsaRate:$rootScope.appointDriverDetails.nsaRate,
                    edRate:$rootScope.appointDriverDetails.edRate,
                    monthlySalary:$rootScope.appointDriverDetails.salary,
                    driverCycle:$rootScope.appointDriverDetails.driverCycle,
                    appointedDate:$rootScope.appointDriverDetails.appointedDate,
                    osaRate:$rootScope.appointDriverDetails.osaRate,
                    createdBy:$rootScope.userId,
                    directorId:$rootScope.appointedDirectorId
                     


                },function(success){
                  $modalInstance.dismiss('cancel');
                 
                     $.notify('Successfully Driver Appointed.', {
                            status: 'success'
                        });
                  
                    $state.go('app.billingAttendanceDetails');
                  
                       reloadFunc();


                },function(error){
                    window.alert('Oops! You are disconnected from server.');
                    $modalInstance.dismiss('cancel');
                   $state.go('page.login');
                });
            }
        }
         function reloadFunc() {
          $modalInstance.dismiss('cancel');
                $scope.count = 0;
                $scope.timers = setInterval(reloadData, 5);
                 $modalInstance.dismiss('cancel');
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

    }
    $scope.billingAppointedDriverHistoryPopUp = function(){
         var modalInstance = $modal.open({
            templateUrl: '/driverAppoinmentHistoryPopUp.html',
            controller: searchDriverModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
    $scope.billingAppointedDriverPopUp = function(appointedDirectorId) {

        $rootScope.appointedDirectorId = appointedDirectorId;
       // console.log($scope.appointedDirectorId);

         var modalInstance = $modal.open({
            templateUrl: '/searchDriver.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
   
}


