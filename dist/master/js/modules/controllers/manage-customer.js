App.controller('manageCustomerCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
        '$cookieStore', 'orderByFilter', '$modal', '$state', 'FileUploader', '$base64', 'ConUsers', 'CustomerDetails', '$http', '$localStorage', '$window', 'UserRoles',
        function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
            $cookieStore, orderByFilter, $modal, $state, FileUploader, $base64, ConUsers, CustomerDetails, $http, $localStorage, $window, UserRoles) {
            'use strict';

             $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
    $scope.searchCustFlag = true;
             
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }];

            $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
            $rootScope.operationCity = city;
           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
            $rootScope.getCustomer();
            reloadFunc(); 
             
        }

        $rootScope.cityAt = [];
        for(var i = 0; i<$rootScope.cities.length; i++){
            
            if($rootScope.cities[i] !== 'All'){
                $rootScope.cityAt.push($rootScope.cities[i]);
            }
        }
                //console.log("user roles**" + JSON.stringify(success));
                if (!angular.isUndefined($rootScope.roleId) || $rootScope.roleId !== null || $rootScope.roleId !== '') {
                    if ($rootScope.roleId === '1') {
                        $rootScope.deleteCustomerFlag = true;
                    } else {
                        $rootScope.deleteCustomerFlag = false;
                    }
             }

             $scope.custSearchStatusArray = [{
                'desc': 'All'
            }, {
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }];

            
            $scope.searchByNameAndNumber = function() {
            if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchCustomer');
                      
                }else{
                    $scope.searchCustFlag = false;
                     $timeout(function() {
     var searchInput = document.getElementById('mobileNo_value');
     searchInput.focus();
   }, 0);   
                }

                
                }else{
                $scope.searchCustFlag = false;
                 $timeout(function() {
     var searchInput = document.getElementById('mobileNo_value');
     searchInput.focus();
   }, 0);   
                }
            
            //$scope.shouldBeOpen = true;


        };
        $scope.backToSearch = function(id) {


            $scope.searchCustFlag = true;
            $rootScope.searchDrvId = undefined;
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            } else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }

        };
        $scope.backToSearchCriteria = function() {
              
            $localStorage.put('customerSearchData', undefined);
            $localStorage.put('custSearchId', undefined);
            $rootScope.searchDrvId = undefined;
            $rootScope.setFlag1 = false;
            $rootScope.setFlag2 = false;
            $state.go('app.searchCustomer');

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

        // Fetch data through search button - Method 2

       $scope.getCustomerMobileDetails11 = function(customerMobile) {

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






        // Search data by ID - Customer

        $rootScope.searchCustById = function() {
            if (!angular.isUndefined($rootScope.searchCustomerId)) {

                $localStorage.put('drvSearchData', undefined);
                $localStorage.put('custSearchId', $rootScope.searchCustomerId);
                //console.log('search driver Id ' + JSON.stringify($localStorage.get('drvSearchId')));
                $rootScope.setFlag1 = false;

                $state.go('app.manageCustomer');

            }


        }


        $scope.custSearchMobileSelected = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));

                $rootScope.searchCustomerId = $scope.search.mobileNumber.originalObject.id;

            }
        };


        $rootScope.getCustomerById = function(CustomerId) {
             $rootScope.loader = 1;

                $rootScope.customerData = [];
                var allCustomerData = [];
         if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchCustomer');
                      
                }else{
                   if($rootScope.operationCitySelect === 'All'){

                    CustomerDetails.find({
                        filter:{
                            where:{
                                id:CustomerId
                            },
                            include:{
                                relation:'conUsers'
                            }
                        }
                        
                             
                     
                }, function(customerData) {
                    console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers)) {
                                 
                                 var name;
                               if (angular.isUndefined(customerData[i].conUsers.middleName) || customerData[i].conUsers.middleName == null) {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName;
                               } else {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.middleName + ' ' + customerData[i].conUsers.lastName;
                               }
                                var landmark = '-';
                                if (!angular.isUndefined(customerData[i].conUsers.address) || customerData[i].conUsers.address !== null || customerData[i].conUsers.address !== '') {
                                    landmark = customerData[i].conUsers.address + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].conUsers.userDevice) || customerData[i].conUsers.userDevice !== null || customerData[i].conUsers.userDevice !== '') {
                                    deviceName = customerData[i].conUsers.userDevice;
                                }
                                var str = customerData[i].conUsers.email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].conUsers.email;
                                }
                                var status;
                                if (customerData[i].conUsers.status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].conUsers.status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].id,
                                    conuserId: customerData[i].conUsers.id,
                                    name: customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName,
                                    firstName: customerData[i].conUsers.firstName,
                                    lastName: customerData[i].conUsers.lastName,
                                    email: email,
                                    remark:customerData[i].remark, 
                                    address: customerData[i].conUsers.addressLine2,
                                    landmark: landmark,
                                    contactNo: customerData[i].conUsers.mobileNumber,
                                    status: status,
                                    createdDate: customerData[i].conUsers.createdDate,
                                    otp: customerData[i].conUsers.otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customerType,
                                    operationCity:customerData[i].conUsers.operationCity
                                });
                            }
                        }

                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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
                   }else{
                    CustomerDetails.find({
                        filter:{
                            where:{
                                id:CustomerId
                            },
                            include:{
                                relation:'conUsers'
                            }
                        }      
                }, function(customerData) {
                    console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers)) {
                                 
                                 var name;
                               if (angular.isUndefined(customerData[i].conUsers.middleName) || customerData[i].conUsers.middleName == null) {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName;
                               } else {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.middleName + ' ' + customerData[i].conUsers.lastName;
                               }
                                var landmark = '-';
                                if (!angular.isUndefined(customerData[i].conUsers.address) || customerData[i].conUsers.address !== null || customerData[i].conUsers.address !== '') {
                                    landmark = customerData[i].conUsers.address + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].conUsers.userDevice) || customerData[i].conUsers.userDevice !== null || customerData[i].conUsers.userDevice !== '') {
                                    deviceName = customerData[i].conUsers.userDevice;
                                }
                                var str = customerData[i].conUsers.email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].conUsers.email;
                                }
                                var status;
                                if (customerData[i].conUsers.status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].conUsers.status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].id,
                                    conuserId: customerData[i].conUsers.id,
                                    name: customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName,
                                    firstName: customerData[i].conUsers.firstName,
                                    lastName: customerData[i].conUsers.lastName,
                                    email: email,
                                    remark:customerData[i].remark,
                                    address: customerData[i].conUsers.addressLine2,
                                    landmark: landmark,
                                    contactNo: customerData[i].conUsers.mobileNumber,
                                    status: status,
                                    createdDate: customerData[i].conUsers.createdDate,
                                    otp: customerData[i].conUsers.otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customerType,
                                    operationCity:customerData[i].conUsers.operationCity
                                });
                            }
                        }
                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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

                }
            }else{
               CustomerDetails.find({
                        filter:{
                            where:{
                                id:CustomerId
                            },
                            include:{
                                relation:'conUsers'
                            }
                        }      
                }, function(customerData) {
                   // console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i].conUsers)) {
                            if (!angular.isUndefined(customerData[i].conUsers)) {
                                 
                                 var name;
                               if (angular.isUndefined(customerData[i].conUsers.middleName) || customerData[i].conUsers.middleName == null) {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName;
                               } else {
                                   name = customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.middleName + ' ' + customerData[i].conUsers.lastName;
                               }
                                var landmark = '-';
                                if (!angular.isUndefined(customerData[i].conUsers.address) || customerData[i].conUsers.address !== null || customerData[i].conUsers.address !== '') {
                                    landmark = customerData[i].conUsers.address + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].conUsers.userDevice) || customerData[i].conUsers.userDevice !== null || customerData[i].conUsers.userDevice !== '') {
                                    deviceName = customerData[i].conUsers.userDevice;
                                }
                                var str = customerData[i].conUsers.email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].conUsers.email;
                                }
                                var status;
                                if (customerData[i].conUsers.status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].conUsers.status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].id,
                                    conuserId: customerData[i].conUsers.id,
                                    name: customerData[i].conUsers.firstName + ' ' + customerData[i].conUsers.lastName,
                                    firstName: customerData[i].conUsers.firstName,
                                    lastName: customerData[i].conUsers.lastName,
                                    email: email,
                                    remark:customerData[i].remark,
                                    address: customerData[i].conUsers.addressLine2,
                                    landmark: landmark,
                                    contactNo: customerData[i].conUsers.mobileNumber,
                                    status: status,
                                    createdDate: customerData[i].conUsers.createdDate,
                                    otp: customerData[i].conUsers.otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customerType,
                                    operationCity:customerData[i].conUsers.operationCity
                                });
                            }
                        }

                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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
};

$scope.mobileSelected11 = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                // console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.cellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

            }
        };



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


        $rootScope.getCustomerSerchList = function(searchData){
    $scope.count = 0;
    if (!angular.isUndefined(searchData)) {
        if((!angular.isUndefined(searchData.driverStatus)) && (!angular.isUndefined(searchData.frmDate)) && (!angular.isUndefined(searchData.toDate))){
                document.getElementById("driverStatus").style.borderColor = "#dde6e9";
                document.getElementById("driverStatus1").innerHTML = '';

                document.getElementById("frmDate").style.borderColor = "#dde6e9";
                document.getElementById("frmDate1").innerHTML = '';

                document.getElementById("toDate").style.borderColor = "#dde6e9";
                document.getElementById("toDate1").innerHTML = '';

                $scope.count--;
            }else if((!angular.isUndefined(searchData.frmDate)) && (angular.isUndefined(searchData.toDate))){
                document.getElementById("toDate").style.borderColor = "red";
                 document.getElementById("toDate1").innerHTML = '*required';
                 document.getElementById("frmDate").style.borderColor = "#dde6e9";
                document.getElementById("frmDate1").innerHTML = '';

                $scope.count++;
            }else if((!angular.isUndefined(searchData.toDate)) && (angular.isUndefined(searchData.frmDate))){
                document.getElementById("frmDate").style.borderColor = "red";
                 document.getElementById("frmDate1").innerHTML = '*required';
                 document.getElementById("toDate").style.borderColor = "#dde6e9";
                document.getElementById("toDate1").innerHTML = '';

                $scope.count++;
            }else if((!angular.isUndefined(searchData.driverStatus)) && (angular.isUndefined(searchData.frmDate)) && (angular.isUndefined(searchData.toDate))){
                document.getElementById("frmDate").style.borderColor = "red";
                 document.getElementById("frmDate1").innerHTML = '*required';

                  document.getElementById("toDate").style.borderColor = "red";
                 document.getElementById("toDate1").innerHTML = '*required';
                
                $scope.count++;
            }
            }else{       
                 document.getElementById("frmDate").style.borderColor = "red";
                 document.getElementById("frmDate1").innerHTML = '*required';

                  document.getElementById("toDate").style.borderColor = "red";
                 document.getElementById("toDate1").innerHTML = '*required';
                
                $scope.count++;
            
            
        }

        if($scope.count <= 0){
             $localStorage.put('customerSearchData', searchData);
             $state.go('app.manageCustomer');
            
            } 
};
            $rootScope.getCustomer = function() {

                $rootScope.loader = 1;

                $rootScope.customerData = [];
                var allCustomerData = [];
                var customerStoredData = $localStorage.get('customerSearchData');
                var storedCustomerId = $localStorage.get('custSearchId');
                if(angular.isDefined(storedCustomerId)){

                    $rootScope.getCustomerById(storedCustomerId);


                }else{
                    var from_date='';
                var to_date='';
                var status='';
                if (!angular.isUndefined(customerStoredData)){
                  if (!angular.isUndefined(customerStoredData.frmDate)){
                       from_date= moment(customerStoredData.frmDate).format('YYYY/MM/DD');
                    }
                    if (!angular.isUndefined(customerStoredData.toDate)){
                       to_date= moment(customerStoredData.toDate).format('YYYY/MM/DD');
                    }
                     if (!angular.isUndefined(customerStoredData.driverStatus)){
                       status= customerStoredData.driverStatus;
                    }
                    if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchCustomer');
                      
                }else{
                   if($rootScope.operationCitySelect === 'All'){

                    CustomerDetails.searchCustomers({
                     
                            from_date:from_date, 
                            to_date: to_date,
                            status:status,
                            operationCity:$rootScope.operationCitySelect
                                
                             
                     
                }, function(customerData) {
                    console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i])) {
                            if (!angular.isUndefined(customerData[i])) {
                                 
                                
                                var landmark = '-';
                                if (!angular.isUndefined(customerData[i].landmark) || customerData[i].landmark !== null || customerData[i].landmark !== '') {
                                    landmark = customerData[i].landmark + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].user_device) || customerData[i].user_device !== null || customerData[i].user_device !== '') {
                                    deviceName = customerData[i].user_device;
                                }
                                var str = customerData[i].email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].email;
                                }
                                var status;
                                if (customerData[i].status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].customer_id,
                                    conuserId: customerData[i].conuser_id,
                                    name: customerData[i].first_name + ' ' + customerData[i].last_name,
                                    firstName: customerData[i].first_name,
                                    lastName: customerData[i].last_name,
                                    email: email,
                                    remark: customerData[i].remark,
                                    address: customerData[i].address,
                                    landmark: landmark,
                                    contactNo: customerData[i].mobile_number,
                                    status: status,
                                    createdDate: customerData[i].created_date,
                                    otp: customerData[i].otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customer_type,
                                    operationCity:customerData[i].operation_city
                                });
                            }
                        }

                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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
                   }else{
                    CustomerDetails.searchCustomers({
                            from_date:from_date, 
                            to_date: to_date,
                            status:status,
                            operationCity:$rootScope.operationCitySelect
                                
                                
                }, function(customerData) {
                    console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i])) {
                            if (!angular.isUndefined(customerData[i])) {
                                var landmark = '-';
                                if (!angular.isUndefined(customerData[i].landmark) || customerData[i].landmark !== null || customerData[i].landmark !== '') {
                                    landmark = customerData[i].landmark + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].user_device) || customerData[i].user_device !== null || customerData[i].user_device !== '') {
                                    deviceName = customerData[i].user_device;
                                }
                                var str = customerData[i].email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].email;
                                }
                                var status;
                                if (customerData[i].status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].customer_id,
                                    conuserId: customerData[i].conuser_id,
                                    name: customerData[i].first_name + ' ' + customerData[i].last_name,
                                    firstName: customerData[i].first_name,
                                    lastName: customerData[i].last_name,
                                    email: email,
                                    remark: customerData[i].remark,
                                    address: customerData[i].address,
                                    landmark: landmark,
                                    contactNo: customerData[i].mobile_number,
                                    status: status,
                                    createdDate: customerData[i].created_date,
                                    otp: customerData[i].otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customer_type,
                                    operationCity:customerData[i].operation_city
                                });
                            }
                        }

                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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

                }
            }else{
                CustomerDetails.searchCustomers({
                            from_date:from_date, 
                            to_date: to_date,
                            status:status,
                            operationCity:$rootScope.operationCity
                                
                }, function(customerData) {
                   // console.log('customer all Data ' + JSON.stringify(customerData));

                    for (var i = 0; i < customerData.length; i++) {
                        if (!angular.isUndefined(customerData[i])) {
                            if (!angular.isUndefined(customerData[i])) {
                                 var landmark = '-';
                                if (!angular.isUndefined(customerData[i].landmark) || customerData[i].landmark !== null || customerData[i].landmark !== '') {
                                    landmark = customerData[i].landmark + ', ';
                                }
                                var deviceName = '';
                                if (!angular.isUndefined(customerData[i].user_device) || customerData[i].user_device !== null || customerData[i].user_device !== '') {
                                    deviceName = customerData[i].user_device;
                                }
                                var str = customerData[i].email;
                                if (str.match(/@consrv.in/g)) {
                                    var email = '-';
                                } else {
                                    var email = customerData[i].email;
                                }
                                var status;
                                if (customerData[i].status === 'Inactive') {
                                    status = 'Blocked';
                                } else {
                                    status = customerData[i].status;
                                }
                                allCustomerData.push({
                                    id:customerData[i].customer_id,
                                    conuserId: customerData[i].conuser_id,
                                    name: customerData[i].first_name + ' ' + customerData[i].last_name,
                                    firstName: customerData[i].first_name,
                                    lastName: customerData[i].last_name,
                                    email: email,
                                    remark: customerData[i].remark,
                                    address: customerData[i].address,
                                    landmark: landmark,
                                    contactNo: customerData[i].mobile_number,
                                    status: status,
                                    createdDate: customerData[i].created_date,
                                    otp: customerData[i].otp,
                                    userDevice: deviceName,
                                    customerType: customerData[i].customer_type,
                                    operationCity:customerData[i].operation_city
                                });
                            }
                        }

                    }
                    $rootScope.address2 = landmark;
                    $rootScope.customerData = allCustomerData;
                    $rootScope.data = allCustomerData;
                    $scope.orginalData = allCustomerData;
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
                }
                 


                
                }
                
                
            };

            $scope.Message = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/sendMessage.html',
                    controller: ModalCustomerCtrl
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
                    controller: ModalCustomerCtrl
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

            $rootScope.checkAll = function() {
                if ($scope.selectedAll) {
                    $scope.selectedAll = true;
                } else {
                    $scope.selectedAll = false;
                }
                angular.forEach($rootScope.customerData, function(user) {
                    user.Selected = $scope.selectedAll;
                });

            }
            $rootScope.selectCustomer = function(contactNo, name) {
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
            $rootScope.selectAllCustomer = function() {

                if (cnt == 0) {
                    $scope.selct = [];
                    $scope.selctn = [];

                    var num = $rootScope.customerData.length;

                    for (var i = 0; i < num; i++) {
                        if ($scope.selct.indexOf($rootScope.customerData[i].contactNo) == -1 && $scope.selctn.indexOf($rootScope.customerData[i].name) == -1) {

                            $scope.selct.push($rootScope.customerData[i].contactNo);
                            $scope.selctn.push($rootScope.customerData[i].name);
                            $scope.count++;

                        } else {
                            for (var j = $scope.selct.length - 1; j >= 0; j--) {

                                if ($scope.selct[j] == $rootScope.customerData[i].contactNo && $scope.selctn[j] == $rootScope.customerData[i].name) {
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

            $rootScope.getAllCustomer = function() {
                $rootScope.getCustomer();
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
                    $rootScope.getCustomer();
                }

            }

            $scope.deactivate = function(conUserId) {
                if (angular.isDefined(conUserId) && conUserId !== null) {
                    ConUsers.findById({
                            id: conUserId
                        },
                        function(ConUsers) {

                            ConUsers.status = 'Inactive';

                            ConUsers.updatedBy = $localStorage.get('userId');
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            reloadFunc();
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
            $scope.activate = function(conUserId) {
                if (angular.isDefined(conUserId) && conUserId !== null) {
                    ConUsers.findById({
                            id: conUserId
                        },
                        function(ConUsers) {

                            ConUsers.status = 'Active';

                            ConUsers.updatedBy = $localStorage.get('userId');
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            reloadFunc();
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

            $scope.deleteCustomerConfirm = function(custId) {
                if ($window.confirm("Are you sure you want to delete this customer?")) {
                    $scope.result = "Yes";
                    $scope.deleteCustomerFunction(custId);
                } else {
                    $scope.result = "No";
                }
            }

            $scope.deleteCustomerFunction = function(custId) {

                $rootScope.loader = 1;
                if (angular.isDefined(custId) && custId !== null) {

                    ConUsers.deleteCustomer({
                        customerId: custId

                    }, function(customerSuccess) {
                        //console.log('customerSuccess' + JSON.stringify(customerSuccess));
                        if (customerSuccess[0].delete_customer_permanentaly === '0') {
                            $.notify('Customer deleted successfully.', {
                                status: 'success'
                            });
                        } else {
                            window.alert('Not able to delete this customer. This Customer is related to bookings.');
                        }
                        reloadFunc();
                        $rootScope.loader = 0;
                    }, function(customerError) {
                        console.log('customerError' + JSON.stringify(customerError));
                        if (customerError.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $rootScope.loader = 0;
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

            $scope.update = function(id) {

            };

            $scope.searchRecords = function(searchData) {

                if (searchData !== '') {
                    var users = $scope.orginalData;
                    var searchList = $filter('filter')(users, {
                        name: searchData
                    });

                  //  console.log('Search data : ' + JSON.stringify(searchList));
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


            $scope.newCustomer = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/addCustomer.html',
                    controller: ModalCustomerCtrl
                });

                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
            };

            var ModalCustomerCtrl = function($scope, $rootScope, $modalInstance, $state) {

                $scope.statusArray = [{
                    'desc': 'Active'
                }, {
                    'desc': 'Inactive'
                }];

                $scope.tripArray = [{
                    'desc': 'O'
                }, {
                    'desc': 'R'
                }];

                $scope.submitUserBtn = false;
                $scope.count = 0;
                $scope.customer = {};
                $scope.verifyMobile = function(mobileNumber) {
                    $scope.MobileExist = false;
                    ConUsers.count({
                            where: {
                                mobileNumber: mobileNumber
                            }
                        },
                        function(response) {
                            if (angular.isDefined(mobileNumber) && mobileNumber !== null) {
                                if (response.count > 0) {

                                    $scope.MobileExist = true;

                                    document.getElementById("cellNumber").style.borderColor = "red";
                                    document.getElementById("cellNumber1").innerHTML = 'Mobile number exist';
                                   // console.log('Mobile already exists : ' + JSON.stringify(response));
                                } else {
                                    if (mobileNumber.length != 10) {
                                        $scope.MobileExist = true;
                                        $scope.customer.cellNumber1 = 'Enter valid Mobile Number';
                                        document.getElementById("cellNumber").style.borderColor = "red";
                                        document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile Number';
                                    } else {
                                        $scope.MobileExist = false;
                                        $scope.customer.cellNumber1 = null;
                                        document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                                        document.getElementById("cellNumber1").innerHTML = '';
                                    }
                                }
                            } else {
                                $scope.MobileExist = true;
                                $scope.customer.cellNumber1 = 'Enter valid Mobile Number';
                                document.getElementById("cellNumber").style.borderColor = "red";
                                document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile Number';
                            }
                        },
                        function(error) {
                            console.log('Error verifying mobile : ' + JSON.stringify(error));
                            document.getElementById("cellNumber").style.borderColor = "red";
                            $scope.MobileExist = false;
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                        });


                };

                $scope.verifyEmail = function(email) {


                    $scope.EmailExist = false;
                    if ((!angular.isUndefined(email)) && email !== '') {

                        var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        if (!mailTest.test(email)) {
                            document.getElementById("email").style.borderColor = "red";
                            document.getElementById("email1").innerHTML = 'Enter valid email';
                            $scope.EmailExist = true;
                            return false;
                        }

                        ConUsers.count({
                                where: {
                                    email: email
                                }
                            },
                            function(response) {
                                if (response.count > 0) {

                                    $scope.EmailExist = true;

                                    document.getElementById("email").style.borderColor = "red";
                                    document.getElementById("email1").innerHTML = 'Email exist';
                                   // console.log('Email already exists : ' + JSON.stringify(response));
                                } else {
                                    $scope.EmailExist = false;
                                    $scope.customer.email1 = null;
                                    document.getElementById("email").style.borderColor = "#dde6e9";
                                    document.getElementById("email1").innerHTML = '';
                                }
                            },
                            function(error) {
                                console.log('Error verifying email : ' + JSON.stringify(error));
                                document.getElementById("email").style.borderColor = "red";
                                $scope.EmailExist = false;
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                            });
                    } else {
                        $scope.EmailExist = false;
                    }


                };
                $scope.addCustomer = function(customer) {

                    $scope.submitUserBtn = true;
                    $rootScope.loader = 1;

                    var count = 0;
                    if (angular.isUndefined(customer.firstName) || customer.firstName === '') {
                        document.getElementById("firstName").style.borderColor = "red";
                        document.getElementById("firstName1").innerHTML = '*required';
                        customer.firstName1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("firstName").style.borderColor = "#dde6e9";
                        document.getElementById("firstName1").innerHTML = '';
                        customer.firstName1 = null;
                    }
                    if (angular.isUndefined(customer.lastName) || customer.lastName === '') {
                        document.getElementById("lastName").style.borderColor = "red";
                        document.getElementById("lastName1").innerHTML = '*required';
                        customer.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("lastName").style.borderColor = "#dde6e9";
                        document.getElementById("lastName1").innerHTML = '';
                        customer.lastName1 = null;
                    }

                    if (angular.isUndefined(customer.email) || customer.email === '') {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = '*required';
                        customer.email1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        customer.email1 = null;

                    }



                    if (angular.isUndefined(customer.address) || customer.address === '') {
                        document.getElementById("address").style.borderColor = "red";
                        document.getElementById("address1").innerHTML = '*required';
                        customer.address1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("address").style.borderColor = "#dde6e9";
                        document.getElementById("address1").innerHTML = '';
                        customer.address1 = null;
                    }

                    if (angular.isUndefined(customer.status) || customer.status === '' || customer.status === null) {
                        document.getElementById("status").style.borderColor = "red";
                        document.getElementById("status1").innerHTML = '*required';
                        customer.status1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("status").style.borderColor = "#dde6e9";
                        document.getElementById("status1").innerHTML = '';
                        customer.status1 = null;
                    }

                    if (angular.isUndefined(customer.customerType) || customer.customerType === '' || customer.customerType === null) {
                        document.getElementById("customerType").style.borderColor = "red";
                        document.getElementById("customerType1").innerHTML = '*required';
                        customer.customerType1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("customerType").style.borderColor = "#dde6e9";
                        document.getElementById("customerType1").innerHTML = '';
                        customer.status1 = null;
                    }
                    if (angular.isUndefined(customer.landmark) || customer.landmark === '' || customer.customerlandmarkType === null) {
                        document.getElementById("landmark").style.borderColor = "red";
                        document.getElementById("landmark1").innerHTML = '*required';
                        customer.landmark1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("landmark").style.borderColor = "#dde6e9";
                        document.getElementById("landmark1").innerHTML = '';
                        customer.landmark1 = null;
                    }

                    if (count > 0) {
                        $scope.count = count;
                        $scope.submitUserBtn = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $scope.count = 0;
                        var landmark;
                        if (!angular.isUndefined(customer.landmark) || customer.landmark !== '' || customer.landmark !== null) {
                            landmark = customer.landmark;
                        }

                        if ($scope.MobileExist == false && $scope.EmailExist == false) {
                            if($rootScope.roleId === '1'){
                if(!angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect !== null){
                 
                            ConUsers.createCustomer({
                                firstName: customer.firstName,
                                middleName: customer.middleName,
                                lastName: customer.lastName,
                                mobileNumber: customer.cellNumber,
                                email: customer.email,
                                password: customer.cellNumber,
                                address: landmark,
                                addressLine2: customer.address,
                                userId: $rootScope.userId,
                                status: customer.status,
                                customerType: customer.customerType,
                                operationCity: $rootScope.operationCitySelect

                            }, function(customerData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                $.notify('Customer inserted successfully.', {
                                    status: 'success'
                                });
                                var custmerRegistaration = customerData;
                                customerRegistrationSMS(custmerRegistaration);
                                $rootScope.loader = 0;
                                $modalInstance.dismiss('cancel');

                                //$rootScope.getAllCustomer();
                            }, function(customerErr) {
                                console.log('customerErr ' + JSON.stringify(customerErr));
                                if (customerErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });
                        }
                    }else{
                         ConUsers.createCustomer({
                                firstName: customer.firstName,
                                middleName: customer.middleName,
                                lastName: customer.lastName,
                                mobileNumber: customer.cellNumber,
                                email: customer.email,
                                password: customer.cellNumber,
                                address: landmark,
                                addressLine2: customer.address,
                                userId: $rootScope.userId,
                                status: customer.status,
                                customerType: customer.customerType,
                                operationCity: $rootScope.operationCity

                            }, function(customerData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                $.notify('Customer inserted successfully.', {
                                    status: 'success'
                                });
                                var custmerRegistaration = customerData;
                                customerRegistrationSMS(custmerRegistaration);
                                $rootScope.loader = 0;
                                $modalInstance.dismiss('cancel');

                               // $rootScope.getAllCustomer();
                            }, function(customerErr) {
                                console.log('customerErr ' + JSON.stringify(customerErr));
                                if (customerErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });   
                        }

                        } else {
                            $rootScope.loader = 0;
                        }

                    }

                };

                function customerRegistrationSMS(custmerRegistaration) {
                    var msg = 'Hi ' + custmerRegistaration[0].firstName + ',Thank you for your registration with Indian Drivers. To avail discounts kindly download our mobile app (https://goo.gl/3aKc5a). ';
                    ConUsers.sendSMS({
                    mobileNumber: custmerRegistaration[0].mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });

                     
                };
                       $scope.sendNotification = function(sendRequestAdv){//manage customer
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
                                        $.notify('Notification successfully sent.', {
                                             status: 'success'
                                        });
                                         $scope.allToken = undefined;
                                           $rootScope.number = undefined;
                                        }).
                                        error(function(error) {
                                          console.log("error");
                                          // $cordovaDialogs.alert('Error......');
                                         //  console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                                         });
                           
                                }     
                             
                           },function(error){
                                console.log("error");
                               });

                  } 
                   
               }
                $scope.sendMessage = function(sendRequestAdv) {
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
                    $rootScope.getAllCustomer();
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


            $scope.updateCustomer = function(conUserId, id) {
                
                $rootScope.conUserId = conUserId;
                $rootScope.custID = id;

                var modalInstance = $modal.open({
                    templateUrl: '/updateCustomer.html',
                    controller: ModalUpdateCustomerCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
            };
            var ModalUpdateCustomerCtrl = function($scope, $rootScope, $modalInstance, $state, $http) {

                $scope.statusArray = [{
                    'desc': 'Active'
                }, {
                    'desc': 'Inactive'
                }];
                $scope.tripArray = [{
                    'desc': 'O'
                }, {
                    'desc': 'R'
                }];
                $scope.customer = {};
                $scope.submitUserBtn = false;
                $scope.count = 0;

                $scope.verifyMobile1 = function(customer) {

                    ConUsers.find({
                        filter: {
                            where: {
                                mobileNumber: customer.cellNumber
                            }

                        }
                    }, function(custSuccess) {
                        //console.log('custSuccess***' + JSON.stringify(custSuccess));
                        if (custSuccess.length > 0) {

                            if (custSuccess[0].id === $rootScope.conUserId) {
                                document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                                document.getElementById("cellNumber1").innerHTML = '';
                                $scope.verifyEmail(customer);
                            } else {
                                document.getElementById("cellNumber").style.borderColor = "red";
                                document.getElementById("cellNumber1").innerHTML = 'Mobile number exist';
                                return false;
                            }

                        } else {
                            document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                            document.getElementById("cellNumber1").innerHTML = '';
                            $scope.verifyEmail(customer);
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


                $scope.verifyEmail = function(customer) {

                    var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    if (!mailTest.test(customer.email)) {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Enter valid email';
                        return false;
                    }

                    ConUsers.find({
                        filter: {
                            where: {
                                email: customer.email
                            }

                        }
                    }, function(custSuccess) {
                        //console.log('custSuccess***' + JSON.stringify(custSuccess));
                        if (custSuccess.length > 0) {

                            if (custSuccess[0].id === $rootScope.conUserId) {
                                document.getElementById("email").style.borderColor = "#dde6e9";
                                document.getElementById("email1").innerHTML = '';
                                $scope.updateCustomer(customer);
                            } else {
                                document.getElementById("email").style.borderColor = "red";
                                document.getElementById("email1").innerHTML = 'Email exist';
                                return false;
                            }

                        } else {
                            document.getElementById("email").style.borderColor = "#dde6e9";
                            document.getElementById("email1").innerHTML = '';
                            $scope.updateCustomer(customer);
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

                $scope.updateCustomer = function(customer) {
                    $scope.submitUserBtn = true;
                    $rootScope.loader = 1;

                    var count = 0;
                    if (angular.isUndefined(customer.firstName) || customer.firstName === '') {
                        document.getElementById("firstName").style.borderColor = "red";
                        document.getElementById("firstName1").innerHTML = '*required';
                        customer.firstName1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("firstName").style.borderColor = "#dde6e9";
                        document.getElementById("firstName1").innerHTML = '';
                        customer.firstName1 = null;
                    }
                    if (angular.isUndefined(customer.lastName) || customer.lastName === '') {
                        document.getElementById("lastName").style.borderColor = "red";
                        document.getElementById("lastName1").innerHTML = '*required';
                        customer.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("lastName").style.borderColor = "#dde6e9";
                        document.getElementById("lastName1").innerHTML = '';
                        customer.lastName1 = null;
                    }

                    if (angular.isUndefined(customer.email) || customer.email === '') {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = '*required';
                        customer.email1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        customer.email1 = null;

                    }

                    if (angular.isUndefined(customer.cellNumber) || customer.cellNumber === '') {
                        document.getElementById("cellNumber").style.borderColor = "red";
                        document.getElementById("cellNumber1").innerHTML = '*required';
                        customer.cellNumber1 = 'This value is required';
                        count++;
                    } else if (customer.cellNumber.length != 10) {
                        document.getElementById("cellNumber").style.borderColor = "red";
                        document.getElementById("cellNumber1").innerHTML = 'Enter valid number';
                        customer.cellNumber1 = 'Invalid number';
                        count++;
                    } else {
                        document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                        document.getElementById("cellNumber1").innerHTML = '';
                        customer.cellNumber1 = null;
                    }

                    if (angular.isUndefined(customer.status) || customer.status === '' || customer.status === null) {
                        document.getElementById("status").style.borderColor = "red";
                        document.getElementById("status1").innerHTML = '*required';
                        customer.status1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("status").style.borderColor = "#dde6e9";
                        document.getElementById("status1").innerHTML = '';
                        customer.status1 = null;
                    }
                    if (angular.isUndefined(customer.address) || customer.address === '') {
                        document.getElementById("address").style.borderColor = "red";
                        document.getElementById("address1").innerHTML = '*required';
                        customer.address1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("address").style.borderColor = "#dde6e9";
                        document.getElementById("address1").innerHTML = '';
                        customer.address1 = null;
                    }
                    if (angular.isUndefined(customer.customerType) || customer.customerType === '' || customer.customerType === null) {
                        document.getElementById("customerType").style.borderColor = "red";
                        document.getElementById("customerType1").innerHTML = '*required';
                        customer.customerType1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("customerType").style.borderColor = "#dde6e9";
                        document.getElementById("customerType1").innerHTML = '';
                        customer.customerType1 = null;
                    }


                    if (count > 0) {
                        $scope.count = count;
                        $scope.submitUserBtn = false;

                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $rootScope.loader = 1;
                        $scope.count = 0;
                        var latitude;
                        var longitude
                        var landmark;
                        if (!angular.isUndefined(customer.landmark) || customer.landmark != '' || customer.landmark != null) {
                            landmark = customer.landmark;
                        }
                            var remark = null;
                        if (!angular.isUndefined(customer.remark) || customer.remark !== null || customer.remark !== '') {
                            remark = customer.remark;
                        }

                         
                             latitude = 0;
                                    longitude = 0;
                                    ConUsers.findById({
                                id: $rootScope.userId
                            },
                            function(userSuccess) {

                                var userName = userSuccess.firstName + ' ' + userSuccess.lastName;

                                              ConUsers.findById({
                                    id: $rootScope.conUserId
                                },
                                function(ConUsers) {

                                    //console.log('fetch customer for update' + JSON.stringify(ConUsers));
                                    ConUsers.firstName = customer.firstName;
                                    ConUsers.middleName = customer.middleName;
                                    ConUsers.lastName = customer.lastName;
                                    ConUsers.email = customer.email;
                                    ConUsers.mobileNumber = customer.cellNumber;
                                    ConUsers.username = customer.cellNumber;
                                    ConUsers.password = customer.cellNumber;
                                    ConUsers.status = customer.status;
                                    ConUsers.addressLine2 = customer.address;
                                    ConUsers.address = landmark;
                                    ConUsers.operationCity = city;
                                    ConUsers.addressLat = latitude;
                                    ConUsers.addressLong = longitude;
                                    ConUsers.operationCity = customer.operationCity;
                                    ConUsers.updatedBy = $localStorage.get('userId');
                                    ConUsers.updatedDate = new Date();
                                    ConUsers.$save();
                                    //console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers));
                                    CustomerDetails.findById({
                                            id: $rootScope.custID
                                        },
                                        function(CustomerDetails) {
                                            var remarkUpdatedDate = new Date(); 
                                            remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                                            CustomerDetails.updatedBy = $localStorage.get('userId');
                                            CustomerDetails.updatedDate = new Date();
                                            CustomerDetails.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                            CustomerDetails.customerType = customer.customerType;
                                            CustomerDetails.$save();
                                            //console.log('CustomerDetails updated for id : ' + JSON.stringify(CustomerDetails));
                                            
                                            $.notify('Customer updated successfully.', {
                                                status: 'success'
                                            });

                                            $modalInstance.dismiss('cancel');

                                            $rootScope.getAllCustomer();
                                            $rootScope.loader = 0;

                                        },
                                        function(error) {
                                            console.log('Error updating customer details : ' + JSON.stringify(error));
                                            $modalInstance.dismiss('cancel');
                                            if (error.status == 0) {
                                                window.alert('Oops! You are disconnected from server.');
                                                $state.go('page.login');
                                            }
                                            $rootScope.loader = 0;
                                        });

                                },
                                function(error) {
                                    console.log('Error updating Customer : ' + JSON.stringify(error));
                                    if (error.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                });
                            },
                            function(err) {
                                console.log(JSON.stringify(err));
                                $rootScope.loader = 0;
                            });


                         


                    }
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
                $scope.fetchCustomerDetails = function() {
                    var resultData = $rootScope.customerData;
                    for (var i = 0; i < resultData.length; i++) {
                        var status;
                        if (resultData[i].status === 'Blocked') {
                            status = 'Inactive';
                        } else {
                            status = resultData[i].status;
                        }
                        if (resultData[i].conuserId == $rootScope.conUserId) {
                            $scope.customer = {
                                firstName: resultData[i].firstName,
                                middleName: resultData[i].middleName,
                                lastName: resultData[i].lastName,
                                email: resultData[i].email,
                                cellNumber: resultData[i].contactNo,
                                status: status,
                                remark:resultData[i].remark,
                                address: resultData[i].address,
                                landmark: resultData[i].landmark,
                                customerType: resultData[i].customerType,
                                operationCity:resultData[i].operationCity
                            };
                        }
                    }
                };

                $scope.closeModal = function() {
                    $modalInstance.dismiss('cancel');
                    $rootScope.custID = undefined;
                    $rootScope.conUserId = undefined;
                };

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
