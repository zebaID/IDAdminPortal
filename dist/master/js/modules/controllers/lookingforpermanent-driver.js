 
App.controller('permanentdriverCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
'$cookieStore', '$localStorage', '$state', 'PermanentDriverRequest', 'ConUsers', 'CustomerDetails', 'orderByFilter', '$modal', '$http', '$window', 'UserRoles',
function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, PermanentDriverRequest, ConUsers, CustomerDetails, orderByFilter, $modal, $http, $window, UserRoles) {
    'use strict';
     $rootScope.operationCity = $localStorage.get('operationCity');
   $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
$rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
    $rootScope.userId = $localStorage.get('userId');
$rootScope.cities = $localStorage.get('cities'); 
$rootScope.roleId = $localStorage.get('roleId');
     $scope.searchDrvFlag = true;

    
    $rootScope.getUserforSelectedCity = function(city){
        $rootScope.operationCitySelect = city;

       // console.log('city: '+JSON.stringify(city));
        $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
         $rootScope.getPdriver();
         reloadFunc();
        
         
    }
             $scope.loadMonthlyDriverRequests = function(){
         $state.go('app.lookingForPermanentDriver');
    };

      $rootScope.cityMo = [];
    for(var i = 0; i<$rootScope.cities.length; i++){
        
        if($rootScope.cities[i] === 'Aurangabad'){
            $rootScope.cityMo.push($rootScope.cities[i]);
        }
        else if($rootScope.cities[i] === 'Pune'){
            $rootScope.cityMo.push($rootScope.cities[i]);
        }
        else if($rootScope.cities[i] === 'Mumbai'){
            $rootScope.cityMo.push($rootScope.cities[i]);
        }else if($rootScope.cities[i] === 'Bengaluru'){
            $rootScope.cityMo.push($rootScope.cities[i]);
        }
    }

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
        $scope.openToDatefu = false;
        $scope.openedStartfu = false;
        $scope.openStartfu = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStartfu = true;
            $scope.openToDatefu = false;

        };

        $scope.openedToDatefu = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openToDatefu = true;
            $scope.openedStartfu = false;

        };
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

        $scope.custSearchStatusArray = [{
            'desc': 'Initial'
        },{

            'desc': 'New'
        }, {
            'desc': 'Follow Up'
        }, {
            'desc': 'Scheduled'
        }, {
            'desc': 'Agreement Done'
        }, {
            'desc': 'Closed'
        }, {
            'desc': 'All'
        }
        ];

$scope.searchDrvFlag = true;   


        $scope.searchByNameAndNumber = function() {
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                window.alert('Please Select Operation City.'); 
                $state.go('app.searchMonthlyDriverRequest');
                  
            }else{
                $scope.searchDrvFlag = false;
                $timeout(function() {
 var searchInput = document.getElementById('mobileNo_value');
 searchInput.focus();
}, 0);   
            }

            
        }else{
            $scope.searchDrvFlag = false;
            $timeout(function() {
 var searchInput = document.getElementById('mobileNo_value');
 searchInput.focus();
}, 0);   
        }
        
        //$scope.shouldBeOpen = true;


    };
    $scope.backToSearch = function(id) {


        $scope.searchDrvFlag = true;
        $rootScope.searchDrvId = undefined;
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
        } else {
            $scope.$broadcast('angucomplete-alt:clearInput');
        }

    };
    $scope.backToSearchCriteriaMDR = function() {
        $localStorage.put('MDRcustomerSearchData', undefined);
        $localStorage.put('MDRcustSearchId', undefined);
        $rootScope.searchDrvId = undefined;
        $rootScope.setFlag1 = false;
        $rootScope.setFlag2 = false;
        $state.go('app.searchMonthlyDriverRequest');

    }
        $rootScope.Message = function(){
            var modalInstance = $modal.open({
            templateUrl: '/sendMessage.html',
            controller: requestDetailsCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        }); 
        }
        $scope.pushNotification = function() {
        // console.log('create popup called.' + modelAssetId);

        var modalInstance = $modal.open({
            templateUrl: '/sendPushNotification.html',
            controller: requestDetailsCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });

    };

         $rootScope.count = 0;
    $rootScope.select = [];
    $rootScope.selectN = [];

    $rootScope.checksAll = function() {
        if ($rootScope.selectedAll) {
            $rootScope.selectedAll = true;
            //console.log('Selected checkbox is: ' + JSON.stringify($rootScope.selectedAll));
        } else {
            $rootScope.selectedAll = false;
            //console.log('Selected checkbox is: ' + JSON.stringify($rootScope.selectedAll));
        }
        angular.forEach($rootScope.fetchRequestData, function(customer) {
             customer.Selected = $rootScope.selectedAll;
        });

    }
    $rootScope.selectCustomer = function(contactNo, name) {
        if ($rootScope.selct.length !== null) {
            $rootScope.select = $rootScope.selct;
            $rootScope.selectN = $rootScope.selctn;
        }

//its me
        if ($rootScope.select.indexOf(contactNo) == -1 && $rootScope.selectN.indexOf(name) == -1) {
            $rootScope.selectN.push(contactNo);
            $rootScope.select.push(name);
            $rootScope.count++;

        } else {
            for (var i = $rootScope.select.length - 1; i >= 0; i--) {

                if ($rootScope.select[i] == contactNo && $rootScope.selectN[i] == name) {
                    $rootScope.select.splice(i, 1);
                    $rootScope.selectN.splice(i, 1);
                    $rootScope.count--;

                }

            }


        }
        $rootScope.number = $rootScope.selectN;
        $rootScope.cname = $rootScope.select;
    };



     var cnt = 0;
    $rootScope.count = 0;
    $rootScope.selct = [];
    $rootScope.selctn = [];
    $rootScope.selectAllCustomer = function() {

        if (cnt == 0) {
            $rootScope.selct = [];
            $rootScope.selctn = [];
           var num = $rootScope.fetchRequestData.length;

            for (var i = 0; i < num; i++) {

                //$rootScope.selectCustomer($rootScope.fetchRequestData[i].mobile_number);
                if ($rootScope.selct.indexOf($rootScope.fetchRequestData[i].mobile) == -1 && $rootScope.selctn.indexOf($rootScope.fetchRequestData[i].custName) == -1) {
                   $rootScope.selct.push($rootScope.fetchRequestData[i].mobile );
                    $rootScope.selctn.push($rootScope.fetchRequestData[i].custName);
                    $rootScope.count++;
                    /*console.log('count:' + JSON.stringify($scope.cont));*/
                } else {
                    for (var j = $rootScope.selct.length - 1; j >= 0; j--) {

                       if ($rootScope.selct[j] == $rootScope.fetchRequestData[i].mobile  && $rootScope.selctn[j] == $rootScope.fetchRequestData[i].custName) {
                            $rootScope.selct.splice(j, 1);
                            $rootScope.selctn.splice(j, 1);
                            $rootScope.count--;

                        } 

                    }

                }

                $rootScope.number = $rootScope.selct;
                $rootScope.cname = $rootScope.selctn;
                cnt = 1;
            }
        } else {

            $rootScope.number = [];
            $rootScope.cname = []; 
            $rootScope.selct = [];
            $rootScope.selctn = [];
            $rootScope.count = 0; 
            cnt = 0;

        }


    }
    

        

    $rootScope.getAllCustomer = function() {
        $rootScope.count = 0;
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

    $rootScope.getCustomerMDRById = function(customerId) {
         $rootScope.loader = 1;
        $rootScope.fetchRequestData = [];
        var allPDriver = [];
         UserRoles.findOne({
     filter: {
            where: {
                conuserId: $rootScope.userId
            }
        }
},function(suc){
   // console.log('suc: '+JSON.stringify(suc));
    $rootScope.roleId = suc.roleId;
    $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                window.alert('Please Select Operation City.'); 
                $state.go('app.dashboard');
                $rootScope.loader = 0;
           } else{
            if($rootScope.operationCitySelect === 'All'){
                PermanentDriverRequest.find({

                filter: {
                    where: {
                        customerId:customerId
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }
                }

            },


            function(requestData) {
               // console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                   var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    var Days = '' + weekDays;
                    if(angular.isDefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
            }else{
              PermanentDriverRequest.find({

                filter: {
                     where: {
                        customerId:customerId
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                                scope:{
                                    where:{
                                        operationCity:$rootScope.operationCitySelect
                                    }
                                }
                            }
                        }
                    }
                }

            },


            function(requestData) {
              //  console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                    var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(angular.isDefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               // console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });  
            }
            
           }
       }else{
        PermanentDriverRequest.find({

                filter: {
                     where: {
                        customerId:customerId
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                                scope:{
                                    where:{
                                        operationCity: $rootScope.operationCity
                                    }
                                } 
                            }
                        }
                    }
                }

            },


            function(requestData) {
                //console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                    var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(angular.isDefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark:remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
                //console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                    }
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
    } 
        
    
    },function(er){

});
};

$rootScope.getMonthlyDriverRequest = function(searchData){
$scope.count = 0;
if (!angular.isUndefined(searchData)) {
   if((!angular.isUndefined(searchData.driverStatus)) && (!angular.isUndefined(searchData.frmDate)) || (!angular.isUndefined(searchData.toDate))){
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
          document.getElementById("driverStatus").style.borderColor = "#dde6e9";
           document.getElementById("driverStatus1").innerHTML = '';
             if(searchData.driverStatus === 'All'){
                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required if status is All';
                 document.getElementById("toDate").style.borderColor = "red";
            document.getElementById("toDate1").innerHTML = '*required if status is All';
                    $scope.count++;
            }else{
           document.getElementById("frmDate").style.borderColor = "#dde6e9";
           document.getElementById("frmDate1").innerHTML = '';

           document.getElementById("toDate").style.borderColor = "#dde6e9";
           document.getElementById("toDate1").innerHTML = '';
           
           $scope.count--; 
            }
           
       }
       }
       else{      
            document.getElementById("frmDate").style.borderColor = "red";
            document.getElementById("frmDate1").innerHTML = '*required';

             document.getElementById("toDate").style.borderColor = "red";
            document.getElementById("toDate1").innerHTML = '*required';
           
           $scope.count++;
       
       
   }

   if($scope.count <= 0){
        $localStorage.put('MDRcustomerSearchData', searchData);
        $state.go('app.lookingForPermanentDriver');
       
       } 
};
$rootScope.getMonthlyDriverRequestNFD = function(searchDatafu){
$scope.count = 0;
if (!angular.isUndefined(searchDatafu)) {
    if((!angular.isUndefined(searchDatafu.frmDate)) || (!angular.isUndefined(searchDatafu.toDate))){
            
            
            document.getElementById("frmDatefd").style.borderColor = "#dde6e9";
            document.getElementById("frmDatefd1").innerHTML = '';

            document.getElementById("toDatefd").style.borderColor = "#dde6e9";
            document.getElementById("toDatefd1").innerHTML = '';

            $scope.count--;
        }else if((!angular.isUndefined(searchDatafu.frmDate)) && (angular.isUndefined(searchDatafu.toDate))){
            document.getElementById("toDatefd").style.borderColor = "red";
             document.getElementById("toDatefd1").innerHTML = '*required';
             document.getElementById("frmDatefd").style.borderColor = "#dde6e9";
            document.getElementById("frmDatefd1").innerHTML = '';

            $scope.count++;
        }else if((!angular.isUndefined(searchDatafu.toDate)) && (angular.isUndefined(searchDatafu.frmDate))){
            document.getElementById("frmDatefd").style.borderColor = "red";
             document.getElementById("frmDatefd1").innerHTML = '*required';
             document.getElementById("toDatefd").style.borderColor = "#dde6e9";
            document.getElementById("toDatefd1").innerHTML = '';

            $scope.count++;
        } 
        }
        else{      
             document.getElementById("frmDatefd").style.borderColor = "red";
             document.getElementById("frmDatefd1").innerHTML = '*required';

              document.getElementById("toDatefd").style.borderColor = "red";
             document.getElementById("toDatefd1").innerHTML = '*required';
            
            $scope.count++;
        
        
    }

    if($scope.count <= 0){
         $localStorage.put('MDRcustomerSearchDataFD', searchDatafu);
         $state.go('app.lookingForPermanentDriver');
        
        } 
};
$rootScope.getMDRDetailsNFD = function(searchDatafu) {
$rootScope.loader = 1;
       $rootScope.fetchRequestData = [];
       var allPDriver = [];
        var from_date='nil';
           var to_date='nil';

           if (!angular.isUndefined(searchDatafu.frmDate)){

                  from_date=  moment(searchDatafu.frmDate).format('YYYY/MM/DD');
               }
               if (!angular.isUndefined(searchDatafu.toDate)){
                  to_date= moment(searchDatafu.toDate).format('YYYY/MM/DD');
               }
               
        
        UserRoles.findOne({
    filter: {
           where: {
               conuserId: $rootScope.userId
           }
       }
},function(suc){
  // console.log('suc: '+JSON.stringify(suc));
   $rootScope.roleId = suc.roleId;
   $rootScope.loader = 1;
       if($rootScope.roleId === '1'){
           if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
               window.alert('Please Select Operation City.'); 
               $state.go('app.dashboard');
               $rootScope.loader = 0;
          } else{
           if($rootScope.operationCitySelect === 'All'){
               PermanentDriverRequest.searchMonthlyDriversNFD({
               from_date:from_date,
               to_date:to_date,
               operationCity:$rootScope.operationCitySelect

           },


           function(requestData) {
              console.log('request data' + JSON.stringify(requestData));
               for (var i = 0; i < requestData.length; i++) {
                  var weekDaysId = [];
                   var weekDays = [];



                   var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                   if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                       for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                           if (requestData[i].weekly_off[j] === '1') {
                               weekDaysId.push(1);
                               weekDays.push('Monday');
                           }
                           if (requestData[i].weekly_off[j] === '2') {
                               weekDaysId.push(2);
                               weekDays.push('Tuesday');
                           }
                           if (requestData[i].weekly_off[j] === '3') {
                               weekDaysId.push(3);
                               weekDays.push('Wednesday');
                           }
                           if (requestData[i].weekly_off[j] === '4') {
                               weekDaysId.push(4);
                               weekDays.push('Thursday');
                           }
                           if (requestData[i].weekly_off[j] === '5') {
                               weekDaysId.push(5);
                               weekDays.push('Friday');
                           }
                           if (requestData[i].weekly_off[j] === '6') {
                               weekDaysId.push(6);
                               weekDays.push('Saturday');
                           }
                           if (requestData[i].weekly_off[j] === '7') {
                               weekDaysId.push(7);
                               weekDays.push('Sunday');
                           }

                       }
                   }
                   var Days = '' + weekDays;
                   var remark =requestData[i].remark

                    
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                   if(angular.isDefined(requestData[i])){
                    allPDriver.push({
                       id: requestData[i].id,
                       customerId: requestData[i].customer_id,
                       custName: requestData[i].first_name + ' ' + requestData[i].last_name +' ('+requestData[i].mobile_number+')',
                       date: createdDate,
                       firstName: requestData[i].first_name,
                       lastName: requestData[i].last_name,
                       email: requestData[i].email,
                       mobile: requestData[i].mobile_number,
                       status: requestData[i].status,
                       remark: remark1,
                       address: requestData[i].address + ',' + requestData[i].address_line_2,
                       createdDate: requestData[i].created_date,
                       createdBy: requestData[i].created_by,
                       createdByName: requestData[i].created_by_name,
                       carType: requestData[i].car_type,
                       dutyHours: requestData[i].duty_hours,
                       salBudget: requestData[i].salary_budget,
                       natureOfDuty: requestData[i].nature_of_duty,
                       weeklyOff: weekDaysId,
                       weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                       nextFollowUpDate:requestData[i].next_follow_up_date

                   });


               }
           }
               $rootScope.fetchRequestData = allPDriver;
               $scope.data = allPDriver;
              console.log('All Driver' + JSON.stringify($scope.data));
               createTable();
               $rootScope.loader = 0;   
               
                   $rootScope.loader = 0;
           },
           function(requestErr) {

               console.log('request error ' + JSON.stringify(requestErr));
               if (requestErr.status == 0) {
                   window.alert('Oops! You are disconnected from server.');
                   $state.go('page.login');
               }

               $rootScope.loader = 0;
           });
           }else{
             PermanentDriverRequest.searchMonthlyDriversNFD({
               from_date:from_date,
               to_date:to_date,
               operationCity:$rootScope.operationCitySelect

           },
           function(requestData) {
             console.log('request data' + JSON.stringify(requestData));
               for (var i = 0; i < requestData.length; i++) {
                  var weekDaysId = [];
                   var weekDays = [];



                   var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                   if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                       for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                           if (requestData[i].weekly_off[j] === '1') {
                               weekDaysId.push(1);
                               weekDays.push('Monday');
                           }
                           if (requestData[i].weekly_off[j] === '2') {
                               weekDaysId.push(2);
                               weekDays.push('Tuesday');
                           }
                           if (requestData[i].weekly_off[j] === '3') {
                               weekDaysId.push(3);
                               weekDays.push('Wednesday');
                           }
                           if (requestData[i].weekly_off[j] === '4') {
                               weekDaysId.push(4);
                               weekDays.push('Thursday');
                           }
                           if (requestData[i].weekly_off[j] === '5') {
                               weekDaysId.push(5);
                               weekDays.push('Friday');
                           }
                           if (requestData[i].weekly_off[j] === '6') {
                               weekDaysId.push(6);
                               weekDays.push('Saturday');
                           }
                           if (requestData[i].weekly_off[j] === '7') {
                               weekDaysId.push(7);
                               weekDays.push('Sunday');
                           }

                       }
                   }
                   var Days = '' + weekDays;
                   var remark =requestData[i].remark

                    
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                   if(angular.isDefined(requestData[i])){
                    allPDriver.push({
                       id: requestData[i].id,
                       customerId: requestData[i].customer_id,
                       custName: requestData[i].first_name + ' ' + requestData[i].last_name+' ('+requestData[i].mobile_number+')',
                       date: createdDate,
                       firstName: requestData[i].first_name,
                       lastName: requestData[i].last_name,
                       email: requestData[i].email,
                       mobile: requestData[i].mobile_number,
                       status: requestData[i].status,
                       remark: remark1,
                       address: requestData[i].address + ',' + requestData[i].address_line_2,
                       createdDate: requestData[i].created_date,
                       createdBy: requestData[i].created_by,
                       createdByName: requestData[i].created_by_name,
                       carType: requestData[i].car_type,
                       dutyHours: requestData[i].duty_hours,
                       salBudget: requestData[i].salary_budget,
                       natureOfDuty: requestData[i].nature_of_duty,
                       weeklyOff: weekDaysId,
                       weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                       nextFollowUpDate:requestData[i].next_follow_up_date

                   });


               }
           }
               $rootScope.fetchRequestData = allPDriver;
               $scope.data = allPDriver;
              console.log('All Driver' + JSON.stringify($scope.data));
               createTable();
               $rootScope.loader = 0;   
               
                   $rootScope.loader = 0;
           },
           function(requestErr) {

              // console.log('request error ' + JSON.stringify(requestErr));
               if (requestErr.status == 0) {
                   window.alert('Oops! You are disconnected from server.');
                   $state.go('page.login');
               }

               $rootScope.loader = 0;
           });  
           }
           
          }
      }else{
        PermanentDriverRequest.searchMonthlyDriversNFD({
               from_date:from_date,
               to_date:to_date,
               operationCity:$rootScope.operationCity

           },
           function(requestData) {
                console.log('request data' + JSON.stringify(requestData));
               for (var i = 0; i < requestData.length; i++) {
                  var weekDaysId = [];
                   var weekDays = [];



                   var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                   if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                       for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                           if (requestData[i].weekly_off[j] === '1') {
                               weekDaysId.push(1);
                               weekDays.push('Monday');
                           }
                           if (requestData[i].weekly_off[j] === '2') {
                               weekDaysId.push(2);
                               weekDays.push('Tuesday');
                           }
                           if (requestData[i].weekly_off[j] === '3') {
                               weekDaysId.push(3);
                               weekDays.push('Wednesday');
                           }
                           if (requestData[i].weekly_off[j] === '4') {
                               weekDaysId.push(4);
                               weekDays.push('Thursday');
                           }
                           if (requestData[i].weekly_off[j] === '5') {
                               weekDaysId.push(5);
                               weekDays.push('Friday');
                           }
                           if (requestData[i].weekly_off[j] === '6') {
                               weekDaysId.push(6);
                               weekDays.push('Saturday');
                           }
                           if (requestData[i].weekly_off[j] === '7') {
                               weekDaysId.push(7);
                               weekDays.push('Sunday');
                           }

                       }
                   }
                   var Days = '' + weekDays;
                   var remark =requestData[i].remark

                    
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                   if(angular.isDefined(requestData[i])){
                    allPDriver.push({
                       id: requestData[i].id,
                       customerId: requestData[i].customer_id,
                       custName: requestData[i].first_name + ' ' + requestData[i].last_name+' ('+requestData[i].mobile_number+')',
                       date: createdDate,
                       firstName: requestData[i].first_name,
                       lastName: requestData[i].last_name,
                       email: requestData[i].email,
                       mobile: requestData[i].mobile_number,
                       status: requestData[i].status,
                       remark: remark1,
                       address: requestData[i].address + ',' + requestData[i].address_line_2,
                       createdDate: requestData[i].created_date,
                       createdBy: requestData[i].created_by,
                       createdByName: requestData[i].created_by_name,
                       carType: requestData[i].car_type,
                       dutyHours: requestData[i].duty_hours,
                       salBudget: requestData[i].salary_budget,
                       natureOfDuty: requestData[i].nature_of_duty,
                       weeklyOff: weekDaysId,
                       weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                       nextFollowUpDate:requestData[i].next_follow_up_date

                   });


               }
           }
               $rootScope.fetchRequestData = allPDriver;
               $scope.data = allPDriver;
              console.log('All Driver' + JSON.stringify($scope.data));
               createTable();
               $rootScope.loader = 0;   
               
                   $rootScope.loader = 0;
           },
           function(requestErr) {

              // console.log('request error ' + JSON.stringify(requestErr));
               if (requestErr.status == 0) {
                   window.alert('Oops! You are disconnected from server.');
                   $state.go('page.login');
               }

               $rootScope.loader = 0;
           });
   } 
       
   
   },function(er){

});
}

$rootScope.getMDRDetails = function(searchData) {
 $rootScope.loader = 1;
        $rootScope.fetchRequestData = [];
        var allPDriver = [];
         var from_date='nil';
            var to_date='nil';
            var status='nil';
            if (!angular.isUndefined(searchData.frmDate)){

                   from_date=  moment(searchData.frmDate).format('YYYY/MM/DD');
                }
                if (!angular.isUndefined(searchData.toDate)){
                   to_date= moment(searchData.toDate).format('YYYY/MM/DD');
                }
                if (!angular.isUndefined(searchData.driverStatus))
                {
                    status=searchData.driverStatus;
                }
         
         UserRoles.findOne({
     filter: {
            where: {
                conuserId: $rootScope.userId
            }
        }
},function(suc){
   // console.log('suc: '+JSON.stringify(suc));
    $rootScope.roleId = suc.roleId;
    $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                window.alert('Please Select Operation City.'); 
                $state.go('app.dashboard');
                $rootScope.loader = 0;
           } else{
            if($rootScope.operationCitySelect === 'All'){
                PermanentDriverRequest.searchMonthlyDrivers({
                from_date:from_date,
                to_date:to_date,
                status:status,
                operationCity:$rootScope.operationCitySelect

            },


            function(requestData) {
               console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                   var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                        for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                            if (requestData[i].weekly_off[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weekly_off[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weekly_off[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weekly_off[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weekly_off[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weekly_off[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weekly_off[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(angular.isDefined(requestData[i])){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customer_id,
                        custName: requestData[i].first_name + ' ' + requestData[i].last_name +' ('+requestData[i].mobile_number+')',
                        date: createdDate,
                        firstName: requestData[i].first_name,
                        lastName: requestData[i].last_name,
                        email: requestData[i].email,
                        mobile: requestData[i].mobile_number,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].address + ',' + requestData[i].address_line_2,
                        createdDate: requestData[i].created_date,
                        createdBy: requestData[i].created_by,
                        createdByName: requestData[i].created_by_name,
                        carType: requestData[i].car_type,
                        dutyHours: requestData[i].duty_hours,
                        salBudget: requestData[i].salary_budget,
                        natureOfDuty: requestData[i].nature_of_duty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].next_follow_up_date

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

                console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
            }else{
              PermanentDriverRequest.searchMonthlyDrivers({
                from_date:from_date,
                to_date:to_date,
                status:status,
                operationCity:$rootScope.operationCitySelect

            },
            function(requestData) {
              console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                   var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                        for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                            if (requestData[i].weekly_off[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weekly_off[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weekly_off[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weekly_off[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weekly_off[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weekly_off[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weekly_off[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(angular.isDefined(requestData[i])){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customer_id,
                        custName: requestData[i].first_name + ' ' + requestData[i].last_name+' ('+requestData[i].mobile_number+')',
                        date: createdDate,
                        firstName: requestData[i].first_name,
                        lastName: requestData[i].last_name,
                        email: requestData[i].email,
                        mobile: requestData[i].mobile_number,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].address + ',' + requestData[i].address_line_2,
                        createdDate: requestData[i].created_date,
                        createdBy: requestData[i].created_by,
                        createdByName: requestData[i].created_by_name,
                        carType: requestData[i].car_type,
                        dutyHours: requestData[i].duty_hours,
                        salBudget: requestData[i].salary_budget,
                        natureOfDuty: requestData[i].nature_of_duty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].next_follow_up_date

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });  
            }
            
           }
       }else{
         PermanentDriverRequest.searchMonthlyDrivers({
                from_date:from_date,
                to_date:to_date,
                status:status,
                operationCity:$rootScope.operationCity

            },
            function(requestData) {
                 console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                   var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weekly_off) && requestData[i].weekly_off !== null) {
                        for (var j = 0; j < requestData[i].weekly_off.length; j++) {
                            if (requestData[i].weekly_off[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weekly_off[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weekly_off[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weekly_off[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weekly_off[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weekly_off[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weekly_off[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(angular.isDefined(requestData[i])){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customer_id,
                        custName: requestData[i].first_name + ' ' + requestData[i].last_name+' ('+requestData[i].mobile_number+')',
                        date: createdDate,
                        firstName: requestData[i].first_name,
                        lastName: requestData[i].last_name,
                        email: requestData[i].email,
                        mobile: requestData[i].mobile_number,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].address + ',' + requestData[i].address_line_2,
                        createdDate: requestData[i].created_date,
                        createdBy: requestData[i].created_by,
                        createdByName: requestData[i].created_by_name,
                        carType: requestData[i].car_type,
                        dutyHours: requestData[i].duty_hours,
                        salBudget: requestData[i].salary_budget,
                        natureOfDuty: requestData[i].nature_of_duty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].next_follow_up_date

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
    } 
        
    
    },function(er){

});
}


    $rootScope.getPdriver = function() {

        $rootScope.loader = 1;
        $rootScope.fetchRequestData = [];
        var allPDriver = [];
         var ONE_WEEK = 3 * 24 * 60 * 60 * 1000;

       var from = moment(Date.now() - ONE_WEEK).format('YYYY-MM-DD');
       var todateof = new Date();
       todateof.setDate(todateof.getDate() + 1);
       var to = moment(todateof).format('YYYY-MM-DD');
       
        var storedCustomerId = $localStorage.get('MDRcustSearchId');
         var customerStoredData = $localStorage.get('MDRcustomerSearchData');
         var customerStoredDataFD = $localStorage.get('MDRcustomerSearchDataFD');
       if(angular.isDefined(storedCustomerId)){

                $rootScope.getCustomerMDRById(storedCustomerId);


            }else if(angular.isDefined(customerStoredData)){

                $rootScope.getMDRDetails(customerStoredData);


            }else if(angular.isDefined(customerStoredDataFD)){
                $rootScope.getMDRDetailsNFD(customerStoredDataFD);
            }else{
        UserRoles.findOne({
     filter: {
            where: {
                conuserId: $rootScope.userId
            }
        }
},function(suc){
   // console.log('suc: '+JSON.stringify(suc));
    $rootScope.roleId = suc.roleId;
    $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                window.alert('Please Select Operation City.'); 
                $state.go('app.dashboard');
                $rootScope.loader = 0;
           } else{
            if($rootScope.operationCitySelect === 'All'){
                PermanentDriverRequest.find({

                filter: {
                    where:  { and: [{
                           createdDate: {
                               gte: from
                           }
                       }, {
                           createdDate: {
                               lt: to
                           }
                       }]
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers' 
                            }
                        }
                    }
                }

            },


            function(requestData) {
               // console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                   var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);



                    if(!angular.isUndefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });
            }else{
              PermanentDriverRequest.find({

                filter: {
                    where:  { and: [{
                           createdDate: {
                               gte: from
                           }
                       }, {
                           createdDate: {
                               lt: to
                           }
                       }]
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                                scope:{
                                    where:{
                                        operationCity:$rootScope.operationCitySelect
                                    }
                                }
                            }
                        }
                    }
                }

            },


            function(requestData) {
              //  console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                    var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(!angular.isUndefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
            }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
               // console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;
            });  
            }
            
           }
       }else{
        PermanentDriverRequest.find({

                filter: {
                    where:  { and: [{
                           createdDate: {
                               gte: from
                           }
                       }, {
                           createdDate: {
                               lt: to
                           }
                       }]
                    },
                    order: 'createdDate DESC',
                    include: {
                        relation: 'customerDetails',
                        scope: {
                            include: {
                                relation: 'conUsers',
                                scope:{
                                    where:{
                                        operationCity: $rootScope.operationCity
                                    }
                                } 
                            }
                        }
                    }
                }

            },


            function(requestData) {
                //console.log('request data' + JSON.stringify(requestData));
                for (var i = 0; i < requestData.length; i++) {
                    var weekDaysId = [];
                    var weekDays = [];



                    var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (angular.isDefined(requestData[i].weeklyOff) && requestData[i].weeklyOff !== null) {
                        for (var j = 0; j < requestData[i].weeklyOff.length; j++) {
                            if (requestData[i].weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestData[i].weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestData[i].weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestData[i].weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestData[i].weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestData[i].weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestData[i].weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }
                    var Days = '' + weekDays;
                    var remark =requestData[i].remark

                     
var n = remark.indexOf(".");
var remark1 = remark.slice(0, n);
                    if(!angular.isUndefined(requestData[i].customerDetails.conUsers)){
                     allPDriver.push({
                        id: requestData[i].id,
                        customerId: requestData[i].customerId,
                        custName: requestData[i].customerDetails.conUsers.firstName + ' ' + requestData[i].customerDetails.conUsers.lastName+' ('+requestData[i].customerDetails.conUsers.mobileNumber+')',
                        date: createdDate,
                        firstName: requestData[i].customerDetails.conUsers.firstName,
                        lastName: requestData[i].customerDetails.conUsers.lastName,
                        email: requestData[i].customerDetails.conUsers.email,
                        mobile: requestData[i].customerDetails.conUsers.mobileNumber,
                        status: requestData[i].status,
                        remark: remark1,
                        address: requestData[i].customerDetails.conUsers.address + ',' + requestData[i].customerDetails.conUsers.addressLine2,
                        createdDate: requestData[i].createdDate,
                        createdBy: requestData[i].createdBy,
                        createdByName: requestData[i].createdByName,
                        carType: requestData[i].carType,
                        dutyHours: requestData[i].dutyHours,
                        salBudget: requestData[i].salaryBudget,
                        natureOfDuty: requestData[i].natureOfDuty,
                        weeklyOff: weekDaysId,
                        weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                        nextFollowUpDate:requestData[i].nextFollowUpDate

                    });


                }
                $rootScope.fetchRequestData = allPDriver;
                $scope.data = allPDriver;
                //console.log('All Driver' + JSON.stringify($scope.data));
                createTable();
                $rootScope.loader = 0;   
                    }
                    $rootScope.loader = 0;
            },
            function(requestErr) {

               // console.log('request error ' + JSON.stringify(requestErr));
                if (requestErr.status == 0) {
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



$scope.mobileSelected11 = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
            // console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
            $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
            $rootScope.cellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

        }
    };





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





     $scope.custSearchMobileSelected = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber2));

            $rootScope.searchCustomerId = $scope.search.mobileNumber.originalObject.id;

        }
    };

     $rootScope.searchCustMDRById = function() {
        if (!angular.isUndefined($rootScope.searchCustomerId)) {

            $localStorage.put('drvSearchData', undefined);
            $localStorage.put('MDRcustSearchId', $rootScope.searchCustomerId);
            //console.log('search driver Id ' + JSON.stringify($localStorage.get('drvSearchId')));
            $rootScope.setFlag1 = false;

            $state.go('app.lookingForPermanentDriver');

        }


    }



    $rootScope.requestDetailsPopup = function(customer) {
        //console.log('requestData ********' + JSON.stringify(customer));
        $rootScope.driverRequestData = customer;

        var modalInstance = $modal.open({
            templateUrl: '/requestDetails.html',
            controller: requestDetailsCtrl

        });

        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });


    };

    var requestDetailsCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getPdriver();

        };
              $scope.sendNotification = function(sendRequestAdv){//monthly driver Request
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
                                var url = 'http://13.232.203.238:3000';
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
                    var msg = 'Dear  ' + f + ', ' + sendRequestAdv;
                    
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
            //reloadFunc();
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

        $scope.getRequestData = function() {
            $rootScope.loader = 1;
            $scope.carType = [
                { name: 'A' },
                { name: 'M' }
            ];


            $scope.weeklyOffArr = [{
                'id': 1,
                'desc': 'Monday'
            }, {
                'id': 2,
                'desc': 'Tuesday'
            }, {
                'id': 3,
                'desc': 'Wednesday'
            }, {
                'id': 4,
                'desc': 'Thursday'
            }, {
                'id': 5,
                'desc': 'Friday'
            }, {
                'id': 6,
                'desc': 'Saturday'
            }, {
                'id': 7,
                'desc': 'Sunday'
            }];
            //console.log('called new booking ');
            if (angular.isDefined($rootScope.driverRequestData.id) && $rootScope.driverRequestData.id !== null) {
                PermanentDriverRequest.findOne({
                    filter: {
                        where: {
                            id: $rootScope.driverRequestData.id
                        },
                        include: {
                            relation: 'customerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                        }
                    }
                }, function(requestSuccess) {
                    //console.log('requestSuccess' +JSON.stringify(requestSuccess));
                    var weekDaysId = [];
                    var weekDays = [];



                    // var createdDate = moment(requestData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                    if (requestSuccess.weeklyOff !== null) {
                        for (var j = 0; j < requestSuccess.weeklyOff.length; j++) {
                            if (requestSuccess.weeklyOff[j] === '1') {
                                weekDaysId.push(1);
                                weekDays.push('Monday');
                            }
                            if (requestSuccess.weeklyOff[j] === '2') {
                                weekDaysId.push(2);
                                weekDays.push('Tuesday');
                            }
                            if (requestSuccess.weeklyOff[j] === '3') {
                                weekDaysId.push(3);
                                weekDays.push('Wednesday');
                            }
                            if (requestSuccess.weeklyOff[j] === '4') {
                                weekDaysId.push(4);
                                weekDays.push('Thursday');
                            }
                            if (requestSuccess.weeklyOff[j] === '5') {
                                weekDaysId.push(5);
                                weekDays.push('Friday');
                            }
                            if (requestSuccess.weeklyOff[j] === '6') {
                                weekDaysId.push(6);
                                weekDays.push('Saturday');
                            }
                            if (requestSuccess.weeklyOff[j] === '7') {
                                weekDaysId.push(7);
                                weekDays.push('Sunday');
                            }

                        }
                    }

                    var Days = '' + weekDays;
                     var recipe ={};
$scope.remark = requestSuccess.remark.split(".");


                    if (angular.isDefined(requestSuccess) && requestSuccess !== null) {

                        var requestCreatedDate = moment(requestSuccess.createdDate).format('DD-MM-YYYY | HH:mm:ss');


                        ConUsers.findById({
                                id: requestSuccess.createdBy
                            },
                            function(ConUsers) {

                                var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                                $scope.fetchData = {
                                    custFirstName: requestSuccess.customerDetails.conUsers.firstName,
                                    custLastName: requestSuccess.customerDetails.conUsers.lastName,
                                    custmobileNumber: requestSuccess.customerDetails.conUsers.mobileNumber,
                                    custEmail: requestSuccess.customerDetails.conUsers.email,
                                    custAddress: requestSuccess.customerDetails.conUsers.addressLine2,
                                    remark: requestSuccess.remark,
                                    createdDate: requestCreatedDate,
                                    createdByName: userName,
                                    carType: requestSuccess.carType,
                                    dutyHours: parseInt(requestSuccess.dutyHours),
                                    salBudget: requestSuccess.salaryBudget,
                                    natureOfDuty: requestSuccess.natureOfDuty,
                                    weeklyOff: weekDaysId

                                };
                                $rootScope.requestFetchedData = $scope.fetchData;
                                $rootScope.loader = 0;


                            },
                            function(error) {
                               // console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });


                    }


                }, function(requestErr) {
                   // console.log('requestErr ' + JSON.stringify(requestErr));
                    if (requestErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });
            }

        };

    };


    $scope.addRequest = function() {

        var modalInstance = $modal.open({
            templateUrl: '/addRequest.html',
            controller: addRequestCtrl
        });

        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    var addRequestCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getPdriver();

        };
        $scope.paymentArray = [{
            'desc': 'Online'
        }, {
            'desc': 'Cash By Office'
        }, {
            'desc': 'Cash By Driver'
        }];
         $scope.weeklyOffArr = [{
            'id': 1,
            'desc': 'Monday'
        }, {
            'id': 2,
            'desc': 'Tuesday'
        }, {
            'id': 3,
            'desc': 'Wednesday'
        }, {
            'id': 4,
            'desc': 'Thursday'
        }, {
            'id': 5,
            'desc': 'Friday'
        }, {
            'id': 6,
            'desc': 'Saturday'
        }, {
            'id': 7,
            'desc': 'Sunday'
        }];
        //console.log('weeklyOffArray: ' + JSON.stringify($scope.weeklyOffArray));
        $("li.search-field input").val('Select Days');

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
                        $scope.addNewRequest();
                    } else {
                        document.getElementById("mobileNo").style.borderColor = "red";
                        document.getElementById("mobileNo1").innerHTML = 'Can not add request,This number belongs to driver or staff.';
                    }
                } else {
                    $scope.addNewRequest();
                }
            }, function(custErr) {
               // console.log('custErr***' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        };



        $scope.addNewRequest = function() {

            var count = 0;
            $rootScope.mobileDisable1 = true;
            var cellNumber = document.getElementById('mobileNo_value').value;
             
            if (angular.isUndefined($rootScope.customerCellNo) || $rootScope.customerCellNo == null || $rootScope.customerCellNo == '') {
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
                    templateUrl: '/addNewRequest.html',
                    controller: addRequestCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });

                if (!angular.isUndefined($rootScope.customerCellNo)) {
                    getCustomerData($rootScope.customerCellNo);
                } else {
                    getCustomerData(cellNumber);
                }
            }

        };
        $scope.verifyMobileL = function() {
         
            var cellNumber = document.getElementById('mobileNo1_value').value;

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
                        document.getElementById("mobileNo1").style.borderColor = "#dde6e9";
                        document.getElementById("mobileNo2").innerHTML = '';
                        $scope.addNewRequest();
                    } else {
                        document.getElementById("mobileNo1").style.borderColor = "red";
                        document.getElementById("mobileNo2").innerHTML = 'Can not add request,This number belongs to driver or staff.';
                    }
                } else {
                    $scope.addNewRequest11();
                }
            }, function(custErr) {
               // console.log('custErr***' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        };



        $scope.addNewRequest11 = function() {

            var count = 0;
            $rootScope.mobileDisable1 = true;
             
            var cellNumber = document.getElementById('mobileNo1_value').value;
            if (angular.isUndefined($rootScope.customerCellNo) || $rootScope.customerCellNo == null || $rootScope.customerCellNo == '') {
                if (angular.isUndefined(cellNumber) || cellNumber === '' || cellNumber === null) {
                    document.getElementById("mobileNo1").style.borderBottom = "1px solid red";
                    document.getElementById("mobileNo2").innerHTML = '*required';
                    count++;
                } else {
                    if ((cellNumber.length < 10 || cellNumber.length > 10) && isNaN(cellNumber) == false) {
                        document.getElementById("mobileNo1").style.borderBottom = "1px solid red";
                        document.getElementById("mobileNo2").innerHTML = 'Invalid number';
                        count++;
                    } else if (isNaN(cellNumber)) {
                        document.getElementById("mobileNo1").style.borderBottom = "1px solid red";
                        document.getElementById("mobileNo2").innerHTML = 'Enter only number';
                        count++;
                    } else {
                        document.getElementById("mobileNo1").style.borderColor = "#dde6e9";
                        document.getElementById("mobileNo2").innerHTML = '';
                    }

                }


            }

            if (count > 0) {
                $scope.count = count;
                return false;
            } else {

                $scope.count = 0;

                var modalInstance = $modal.open({
                    templateUrl: '/addNewRequest.html',
                    controller: addRequestCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });

                if (!angular.isUndefined($rootScope.customerCellNo)) {
                    getCustomerData($rootScope.customerCellNo);
                } else {
                    getCustomerData(cellNumber);
                }
            }

        };
        $scope.mobileSelected = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.customerCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

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
                        $rootScope.recordExist = true;
                        $rootScope.customerExistFlag = 1;
                        $rootScope.customerDetails = {
                            customerId: custData[0].id,
                            conUserId: custData[0].conuser_id,
                            firstName: custData[0].first_name,
                            middleName: custData[0].middle_name,
                            lastName: custData[0].last_name,
                            mobileNumber: cellNumber,
                            address: custData[0].address_line_2,
                            landmark: custData[0].address,
                            email: custData[0].email
                        };

                    } else {
                        $rootScope.recordExist = false;
                        $rootScope.customerExistFlag = 0;
                        $rootScope.customerDetails = {
                            customerId: '',
                            conUserId: '',
                            firstName: '',
                            middleName: '',
                            lastName: '',
                            mobileNumber: cellNumber,
                            address: '',
                            landmark: '',
                            email: ''
                        };
                    }

                    //console.log('customer details' + JSON.stringify($rootScope.customerDetails));
                    $modalInstance.dismiss('cancel');

                },
                function(error) {
                   // console.log('error ' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');

                    }
                });
        }

        $scope.getCustomerMobileDetails = function(customerMobile) {

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

        $scope.getSearchResult = function(searchText) {
            var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=' + ENV.googlePlacesAPIKey;
            $http.get(url)
                .then(function successCallback(response) {
                    if (angular.isDefined(response.data.predictions))
                       // console.log('search results : ' + JSON.stringify(response.data.predictions));
                    $scope.searchResult = response.data.predictions;
                }, function errorCallback(response) {
                   // console.log('search place error : ' + JSON.stringify(response));
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
        $scope.carType = [
            { name: 'A' },
            { name: 'M' }
        ]; 

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



        $scope.verifyEmailFunction = function(customerDetails) {
            var currentUserId = parseInt($rootScope.customerDetails.conUserId);
            $scope.isDisabledButton = true;
            ConUsers.find({
                filter: {
                    where: {
                        email: customerDetails.email
                    }

                }
            }, function(custSuccess) {
                //console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {

                    if (custSuccess[0].id === currentUserId) {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $scope.addRequestForDriver(customerDetails);
                    } else {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Email exist';
                        $scope.isDisabledButton = false;
                        return false;
                    }

                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    $scope.addRequestForDriver(customerDetails);
                }

            }, function(custErr) {
               // console.log('custErr***' + JSON.stringify(custErr));
                $scope.isDisabledButton = false;
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        }



        $scope.addRequestForDriver = function(customerDetails) {
            //console.log('customerDetails' + JSON.stringify(customerDetails));
            $rootScope.loader = 1;
            var count = 0;
            var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (angular.isUndefined(customerDetails.firstName) || customerDetails.firstName === '') {
                document.getElementById("firstName").style.borderBottom = "1px solid red";
                document.getElementById("firstName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("firstName").style.borderColor = "#dde6e9";
                document.getElementById("firstName1").innerHTML = '';

            }

            if (angular.isUndefined(customerDetails.lastName) || customerDetails.lastName === '' || customerDetails.lastName === null) {
                document.getElementById("lastName").style.borderBottom = "1px solid red";
                document.getElementById("lastName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("lastName").style.borderColor = "#dde6e9";
                document.getElementById("lastName1").innerHTML = '';


            }
            if (angular.isUndefined(customerDetails.email) || customerDetails.email === '' || customerDetails.email === null) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';
                count++;
            } else if (!mailTest.test(customerDetails.email) && customerDetails.email.length > 0) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
            }

            if (angular.isUndefined(customerDetails.address) || customerDetails.address === '' || customerDetails.address === null) {
                document.getElementById("address").style.borderColor = "red";
                document.getElementById("address1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {


                document.getElementById("address").style.borderColor = "#dde6e9";
                document.getElementById("address1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.drivercity) || customerDetails.drivercity === '' || customerDetails.drivercity === null) {
                document.getElementById("drivercity").style.borderColor = "red";
                document.getElementById("drivercity1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {


                document.getElementById("drivercity").style.borderColor = "#dde6e9";
                document.getElementById("drivercity1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.NFDate) || customerDetails.NFDate === null || customerDetails.NFDate === '') {
                document.getElementById("nextDate").style.borderBottom = "1px solid red";
                document.getElementById("nextDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("nextDate").style.borderColor = "#dde6e9";
                document.getElementById("nextDate1").innerHTML = '';
                var today = new Date();
                var nextday = new Date(customerDetails.NFDate);
                if(nextday<today){
                document.getElementById("nextDate").style.borderBottom = "1px solid red";
                document.getElementById("nextDate1").innerHTML = '*Please update next follow up date';
                 count++;
                }else{
                document.getElementById("nextDate").style.borderColor = "#dde6e9";
                document.getElementById("nextDate1").innerHTML = '';
                }

            }


            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {

                 
                    var count1 = 0;

                     
                    if (count1 > 0) {
                        $scope.count1 = count1;
                        $scope.isDisabledButton = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        var dutyHrs = 0;
                        var cartp = '';
                        var weeklf = '{}';

                        var salarybdgt = '';
                        var naturefduty = '';
                          if (angular.isDefined(customerDetails)) {
                            if (angular.isDefined(customerDetails.dutyhours)) {
                                dutyHrs = customerDetails.dutyhours;
                            }

                            if (angular.isDefined(customerDetails.cartype)) {
                                cartp = customerDetails.cartype;
                            }

                            if (angular.isDefined(customerDetails.weeklyOffD)) {
                                weeklf = '{' + customerDetails.weeklyOffD + '}';
                            }

                            if (angular.isDefined(customerDetails.salbudget)) {
                                salarybdgt = customerDetails.salbudget;
                            }

                            if (angular.isDefined(customerDetails.natureofduty)) {
                                naturefduty = customerDetails.natureofduty;
                            }
                        }
                        var addressLat = 0;
                        var addressLong = 0;
                        if ($rootScope.customerExistFlag == 1) {
                            var nextDate = new Date(customerDetails.NFDate.setDate(customerDetails.NFDate.getDate()+1));
                            PermanentDriverRequest.createPermanentDriverForAdmin({
                                customerId: $rootScope.customerDetails.customerId,
                                createdBy: $rootScope.userId,
                                remark: '-->'+customerDetails.remark,
                                carType: cartp,
                                dutyHours: dutyHrs,
                                salaryBudget: salarybdgt,
                                naturOfDuty: naturefduty,
                                weeklyOff: weeklf,
                                operationCity:customerDetails.drivercity,
                                nextFollowUpDate: nextDate 

                            }, function(success) {
                                $scope.id = success[0].create_permanent_driver_for_admin;
                               // console.log('Permanent Driver Request success :' + JSON.stringify(success));
                                if (success[0].create_permanent_driver_for_admin === '1') {
                                    
                                    window.alert('This customer has already requested for monthly driver.');

                                    $rootScope.customerDetails = undefined;
                                    $rootScope.customerCellNo = undefined;

                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;

                                    reloadFunc();
                                    $rootScope.getPdriver();
                                    $rootScope.loader = 0;
                                } else{
                                     
                                         
                                        $.notify('Request for permanent driver is added successfully.', {
                                        status: 'success'
                                    });
                                    $rootScope.customerDetails = undefined;
                                    $rootScope.customerCellNo = undefined;

                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;

                                    reloadFunc();
                                    $rootScope.getPdriver();
                                    $rootScope.loader = 0;
                                    
                                    
                                }

                            }, function(err) {
                               // console.log('Permanent Driver Request err ' + JSON.stringify(err));
                                $scope.isDisabledButton = false;
                                if (err.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;

                            });

                        } else {
                            var nextDate = new Date(customerDetails.NFDate.setDate(customerDetails.NFDate.getDate()+1));
                            if($rootScope.roleId === '1'){
            if(!angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect !== null){
            ConUsers.createCustomer({
                                firstName: customerDetails.firstName,
                                middleName: customerDetails.middleName,
                                lastName: customerDetails.lastName,
                                mobileNumber: customerDetails.mobileNumber,
                                email: customerDetails.email,
                                password: customerDetails.mobileNumber,
                                address: customerDetails.landmark,
                                addressLine2: customerDetails.address,
                                userId: $rootScope.userId,
                                status: 'Active',
                                customerType: 'O',
                                operationCity: customerDetails.drivercity
                            }, function(customerData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                PermanentDriverRequest.createPermanentDriverForAdmin({
                                    customerId: customerData[1].id,
                                    createdBy: $rootScope.userId,
                                    remark: customerDetails.remark,
                                    carType: cartp,
                                    dutyHours: dutyHrs,
                                    salaryBudget: salarybdgt,
                                    naturOfDuty: naturefduty,
                                    weeklyOff: weeklf,
                                    operationCity:customerDetails.drivercity,
                                    nextFollowUpDate:nextDate

                                }, function(success) {
                                    //console.log('Permanent Driver Request success :' + JSON.stringify(success));
                                    if (success[0].create_permanent_driver_for_admin === '1') {
                                       window.alert('This customer has already requested for monthly driver.');

                                        $rootScope.customerDetails = undefined;
                                        $rootScope.customerCellNo = undefined;

                                        $modalInstance.dismiss('cancel');
                                        $scope.isDisabledButton = false;

                                        reloadFunc();
                                        $rootScope.getPdriver();
                                        $rootScope.loader = 0; 
                                    } else {
                                        

                                        $.notify('Request for permanent driver is added successfully.', {
                                            status: 'success'
                                        });
                                        $rootScope.customerDetails = undefined;
                                        $rootScope.customerCellNo = undefined;

                                        $modalInstance.dismiss('cancel');
                                        $scope.isDisabledButton = false;

                                        reloadFunc();
                                        $rootScope.getPdriver();
                                        $rootScope.loader = 0;
                                    }


                                }, function(err) {
                                    console.log('Permanent Driver Request err ' + JSON.stringify(err));
                                    $scope.isDisabledButton = false;
                                    if (err.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                });


                            }, function(customerErr) {
                              //  console.log('customerErr ' + JSON.stringify(customerErr));
                                $scope.isDisabledButton = false;
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
                                firstName: customerDetails.firstName,
                                middleName: customerDetails.middleName,
                                lastName: customerDetails.lastName,
                                mobileNumber: customerDetails.mobileNumber,
                                email: customerDetails.email,
                                password: customerDetails.mobileNumber,
                                address: customerDetails.landmark,
                                addressLine2: customerDetails.address,
                                userId: $rootScope.userId,
                                status: 'Active',
                                customerType: 'O',
                                operationCity: customerDetails.drivercity

                            }, function(customerData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                PermanentDriverRequest.createPermanentDriver({
                                    customerId: customerData[1].id,
                                    createdBy: $rootScope.userId,
                                    remark: customerDetails.remark,
                                    carType: cartp,
                                    dutyHours: dutyHrs,
                                    salaryBudget: salarybdgt,
                                    naturOfDuty: naturefduty,
                                    weeklyOff: weeklf,
                                    operationCity:customerDetails.drivercity
                                }, function(success) {
                                    //console.log('Permanent Driver Request success :' + JSON.stringify(success));
                                    if (success[0].create_permanent_driver === '0') {
                                        $.notify('Request for permanent driver is added successfully.', {
                                            status: 'success'
                                        });
                                        $rootScope.customerDetails = undefined;
                                        $rootScope.customerCellNo = undefined;

                                        $modalInstance.dismiss('cancel');
                                        $scope.isDisabledButton = false;

                                        reloadFunc();
                                        $rootScope.getPdriver();
                                        $rootScope.loader = 0;
                                    } else {
                                        window.alert('This customer has already requested for monthly driver.');

                                        $rootScope.customerDetails = undefined;
                                        $rootScope.customerCellNo = undefined;

                                        $modalInstance.dismiss('cancel');
                                        $scope.isDisabledButton = false;

                                        reloadFunc();
                                        $rootScope.getPdriver();
                                        $rootScope.loader = 0;
                                    }


                                }, function(err) {
                                    console.log('Permanent Driver Request err ' + JSON.stringify(err));
                                    $scope.isDisabledButton = false;
                                    if (err.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                });


                            }, function(customerErr) {
                              //  console.log('customerErr ' + JSON.stringify(customerErr));
                                $scope.isDisabledButton = false;
                                if (customerErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;

                            });
         }

                            


                        }
                    }

                


            }
        };


        $scope.closeModal = function() {
            $rootScope.customerDetails = undefined;
            $rootScope.customerCellNo = undefined;
            $modalInstance.dismiss('cancel');
            $rootScope.getPdriver();
        };

    };

    $scope.updateRequest = function(reqId) {
        $rootScope.requestId = reqId;
        //console.log('request Id: ' + $rootScope.requestId);
        var modalInstance = $modal.open({
            templateUrl: '/updateRequest.html',
            controller: updateRequestCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    var updateRequestCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
        $scope.weeklyOffArr = [{
            'id': 1,
            'desc': 'Monday'
        }, {
            'id': 2,
            'desc': 'Tuesday'
        }, {
            'id': 3,
            'desc': 'Wednesday'
        }, {
            'id': 4,
            'desc': 'Thursday'
        }, {
            'id': 5,
            'desc': 'Friday'
        }, {
            'id': 6,
            'desc': 'Saturday'
        }, {
            'id': 7,
            'desc': 'Sunday'
        }];
        $scope.getSearchResult = function(searchText) {
            var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=' + ENV.googlePlacesAPIKey;
            $http.get(url)
                .then(function successCallback(response) {
                    if (angular.isDefined(response.data.predictions))
                       // console.log('search results : ' + JSON.stringify(response.data.predictions));
                    $scope.searchResult = response.data.predictions;
                }, function errorCallback(response) {
                    //console.log('search place error : ' + JSON.stringify(response));
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

        $scope.statusArray = [{
            'desc': 'New'
        }, {
            'desc': 'Follow Up'
        }, {
            'desc': 'Scheduled'
        }, {
            'desc': 'Agreement Done'
        }, {
            'desc': 'Closed'
        }];

      $scope.updateRequestDetails = function(customer) {
            $rootScope.loader = 1;
            //console.log('request data to update' + JSON.stringify(customer));
            var count = 0;

            if (angular.isUndefined(customer.status) || customer.status === null || customer.status === '') {
                document.getElementById("status").style.borderBottom = "1px solid red";
                document.getElementById("status1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("status").style.borderColor = "#dde6e9";
                document.getElementById("status1").innerHTML = '';

            }if (angular.isUndefined(customer.NFDate) || customer.NFDate === null || customer.NFDate === '') {
                document.getElementById("nextDate").style.borderBottom = "1px solid red";
                document.getElementById("nextDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("nextDate").style.borderColor = "#dde6e9";
                document.getElementById("nextDate1").innerHTML = '';
                var today = new Date();
                var nextday = new Date(customer.NFDate);
                if(nextday<today){
                document.getElementById("nextDate").style.borderBottom = "1px solid red";
                document.getElementById("nextDate1").innerHTML = '*Please update next follow up date';
                 count++;
                }else{
                document.getElementById("nextDate").style.borderColor = "#dde6e9";
                document.getElementById("nextDate1").innerHTML = '';
                }

            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;
                var remark = null;
                if (!angular.isUndefined(customer.remark) || customer.remark !== null || customer.remark !== '') {
                    remark = customer.remark;
                }

                ConUsers.findById({
                        id: $rootScope.userId
                    },
                    function(ConUsers) {

                        var userName = ConUsers.firstName;

                        PermanentDriverRequest.findById({
                                id: customer.id
                            },
                            function(DriverRequestData) {
                                var remarkUpdatedDate = new Date();
                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD/MM HH:mm');
                                DriverRequestData.status = customer.status;
                                DriverRequestData.remark = '\n-->'+remark + ' By ' + userName + '(' + remarkUpdatedDate + ').' + DriverRequestData.remark;
                                DriverRequestData.updatedBy = $rootScope.userId;
                                DriverRequestData.updatedDate = new Date();
                                 DriverRequestData.carType = customer.carType;
                                 DriverRequestData.nextFollowUpDate = customer.NFDate;
                            DriverRequestData.dutyHours = customer.dutyHours;
                            DriverRequestData.salaryBudget = customer.salBudget;
                            DriverRequestData.natureOfDuty = customer.natureOfDuty;
                            DriverRequestData.weeklyOff = '{' + customer.weeklyOff + '}';
                                DriverRequestData.$save();
                                //console.log('Driver request updated : ' + JSON.stringify(DriverRequestData));

                                $.notify('Request updated successfully.', {
                                    status: 'success'
                                });

                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getPdriver();
                                $rootScope.loader = 0;


                            },
                            function(error) {
                               // console.log('Error updating request details : ' + JSON.stringify(error));
                                $modalInstance.dismiss('cancel');
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $rootScope.loader = 0;
                            });

                    },
                    function(error) {
                      //  console.log('error ' + JSON.stringify(error));
                        $rootScope.loader = 0;
                    });
            }

        };
        
        $scope.fetchRequestDetails = function() {

            $scope.carType = [
            { name: 'A' },
            { name: 'M' }
        ];
            var resultData = $rootScope.fetchRequestData;

            for (var i = 0; i < resultData.length; i++) {


                if (resultData[i].id == $rootScope.requestId) {
                    $scope.customer = {
                        id: resultData[i].id,
                        customerId: resultData[i].customerId,
                        custName: resultData[i].custName,
                        date: resultData[i].date,
                        mobile: resultData[i].mobile,
                        email: resultData[i].email,
                        firstName: resultData[i].firstName,
                        lastName: resultData[i].lastName,
                        status: resultData[i].status,
                        remark: resultData[i].remark,
                        address: resultData[i].address,
                        createdDate: resultData[i].createdDate,
                        carType: resultData[i].carType,
                        dutyHours: parseInt(resultData[i].dutyHours),
                        salBudget: resultData[i].salBudget,
                        natureOfDuty: resultData[i].natureOfDuty,
                        weeklyOff: resultData[i].weeklyOff,
                        weeklyOffDays: resultData[i].weeklyOffDays,
                        NFDate:resultData[i].nextFollowUpDate
                    };
                }
            }
        };


        $scope.closeModal = function() {
            $rootScope.customerDetails = undefined;
            $rootScope.customerCellNo = undefined;
            $rootScope.requestId = undefined;
            $modalInstance.dismiss('cancel');
            $rootScope.getPdriver();
        };

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

         if($scope.data.length>1){
$scope.tableParams3 = new ngTableParams({
        //page: 1, // show first page
        count: $scope.data.length  // count per page

    }, {
        total: $scope.data.length, // length of data
        counts:[],
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
}else{
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
}

    }

}
]);
