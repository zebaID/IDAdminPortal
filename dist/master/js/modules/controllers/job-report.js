App.controller('driverJobCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'DriverJobDetails', 'DriverJobRequest', 'ConUsers', 'CustomerDetails', 'DriverDetails', 'UserRoles', 'orderByFilter', '$modal', '$http', '$window',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, DriverJobDetails, DriverJobRequest, ConUsers, CustomerDetails, DriverDetails, UserRoles, orderByFilter, $modal, $http, $window) {
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
            $rootScope.getDriverJob();
            reloadFunc(); 
             
        }

         $scope.openedStart1 = false;
            $scope.openToDate1 = false;
            $scope.openedOpenFromDate = false;
            $scope.openOenedToDate = false;
$scope.openStart1 = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart1 = true;
                $scope.openToDate1 = false;

            };
            $scope.openFromDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOpenFromDate = true;
                $scope.openOenedToDate = false;

            };
$scope.openedToDate1 = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openToDate1 = true;
                $scope.openedStart1 = false;

            };
            $scope.openedOpenToDate = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOpenFromDate = false;
                $scope.openOenedToDate = true;

            };
        $rootScope.cityAt1 = [];
        for(var i = 0; i<$rootScope.cities.length; i++){
            
            if($rootScope.cities[i] === 'Pune'){
                $rootScope.cityAt1.push($rootScope.cities[i]);
            }else if($rootScope.cities[i] === 'Mumbai'){
                $rootScope.cityAt1.push($rootScope.cities[i]);
            }else if($rootScope.cities[i] === 'Aurangabad'){
                $rootScope.cityAt1.push($rootScope.cities[i]);
            }else{

            }
        }

   $rootScope.getDriverJob = function() {
            if($rootScope.AllReport === true){
            $rootScope.loader = 1;
            $rootScope.fetchJobData = [];
            var allJobData = [];
            var customerId = $localStorage.get('customerId');
            var area = $localStorage.get('Area');
            if(angular.isDefined(customerId)){
                $scope.sendDataHere(customerId);
            }else{ 
            if($rootScope.roleId === '1'){
                 if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                      $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                         DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCitySelect    

                },


                function(jobData) {
                    //console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDays = [];
                         var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });



                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                   // console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                       DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCitySelect    

                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });



                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                   
                }
            }else{
                 DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCity
                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                         var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });



                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }
        }
            }else{//zebs
                $rootScope.loader = 1;
            $rootScope.fetchJobData = [];
            var allJobData = [];

            var area = $localStorage.get('Area');
            var customerId = $localStorage.get('customerId');
                if(angular.isDefined(customerId)){
                $scope.sendDataHere(customerId);
            }else{ 

            if($rootScope.roleId === '1'){
                 if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                      $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                         DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCitySelect    
                },


                function(jobData) {
                    //console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                         var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });



                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                   // console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                        DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCitySelect    

                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });



                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                   
                }
            }else{
                DriverJobDetails.getDriverJobOpenReport({
                            operationCity:$rootScope.operationCity  

                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                         var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
            }
        }
            }

            
            
        };
        $scope.fetchDriverJobCustListforSearch = function() {

        $rootScope.loader = 1;
        if($rootScope.roleId === '1'){
            if($rootScope.operationCitySelect === 'All'){
                 DriverJobDetails.getCustomerJob({
                     operationCity:$rootScope.operationCitySelect

                }, function(customerData) {

                //console.log('customerData' + JSON.stringify(customerData));
                $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                    

                    $scope.bookingHistorycustomerList.push({
                        id: customerData[i].id,
                        mobileNumber: customerData[i].mobile_number,
                        customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                        custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


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
                DriverJobDetails.getCustomerJob({
                     operationCity:$rootScope.operationCitySelect

                },function(customerData) {

                console.log('customerData' + JSON.stringify(customerData));
                $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                 
                    $scope.bookingHistorycustomerList.push({
                        id: customerData[i].id,
                        mobileNumber: customerData[i].mobile_number,
                        customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                        custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


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
         DriverJobDetails.getCustomerJob({
                     operationCity:$rootScope.operationCity


                }, function(customerData) {

                //console.log('customerData' + JSON.stringify(customerData));
               $scope.bookingHistorycustomerList = [];

                for (var i = 0; i < customerData.length; i++) {
                    
                    $scope.bookingHistorycustomerList.push({
                        id: customerData[i].id,
                        mobileNumber: customerData[i].mobile_number,
                        customerName: customerData[i].first_name + ' ' + customerData[i].last_name,
                        custDetails: customerData[i].first_name + ' ' + customerData[i].last_name + ' - ' + customerData[i].mobile_number


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


        $scope.searchJobReport = function(fromDate,todate){
                 $rootScope.loader = 1;

            var count = 0;
            if ((angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) && (angular.isUndefined(toDate) || toDate === '' || toDate === null)) {
                document.getElementById("fromDateNew").style.borderColor = "red";
                document.getElementById("fromDateNew1").innerHTML = '*required';

                document.getElementById("toDateNew").style.borderColor = "red";
                document.getElementById("toDateNew1").innerHTML = '*required';
                count++;
                //toDate.toDate2 = 'required';

            } else {

                if (angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) {
                    document.getElementById("fromDateNew").style.borderColor = "red";
                    document.getElementById("fromDateNew1").innerHTML = '*required';
                    count++;
                    //fromDate.frmDate1 = 'required';


                } else {
                    document.getElementById("fromDateNew").style.borderColor = "#dde6e9";
                    document.getElementById("fromDateNew1").innerHTML = '';
                }
                if (angular.isUndefined(toDate) || toDate === '' || toDate === null) {
                    document.getElementById("toDateNew").style.borderColor = "red";
                    document.getElementById("toDateNew1").innerHTML = '*required';
                    count++;
                    //toDate.toDate2 = 'required';

                } else if (toDate < fromDate) {
                    document.getElementById("toDateNew").style.borderColor = "red";
                    document.getElementById("toDateNew1").innerHTML = 'To Date should be greater than From Date';
                    count++;
                    //toDate.toDate2 = 'To Date should be greater than To Date';

                } else {
                    document.getElementById("toDateNew").style.borderColor = "#dde6e9";
                    document.getElementById("toDateNew1").innerHTML = '';
                }
                var datetwo = new Date(todate);
                var dateone = new Date(fromDate)
                var dayDif = (datetwo - dateone)  / 1000 / 60 / 60 / 24;
                if(dayDif <= 29){
                    document.getElementById("fromDateNew").style.borderColor = "#dde6e9";
                document.getElementById("fromDateNew1").innerHTML = '';
                //searchData.frmDate1 = null;
            }else{
              document.getElementById("fromDateNew").style.borderColor = "red";
                document.getElementById("fromDateNew1").innerHTML = '*Unable to retrive more than one month data.';
                //searchData.frmDate1 = 'Unable to retrive more than 4 days data.';
                count++;  
            }


            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;
                $localStorage.put('searchReportFromDate', fromDate);
                $localStorage.put('searchReportToDate', todate);
                $state.go('app.searchedJobReport');
                $rootScope.loader = 0;
            }

        }
        

        $scope.searchJobReportByOpenedDate = function(fromDate,todate){
            $rootScope.loader = 1;

       var count = 0;
       if ((angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) && (angular.isUndefined(toDate) || toDate === '' || toDate === null)) {
           document.getElementById("fromDateOpened").style.borderColor = "red";
           document.getElementById("fromDateOpened1").innerHTML = '*required';

           document.getElementById("toDateOpened").style.borderColor = "red";
           document.getElementById("toDateOpened1").innerHTML = '*required';
           count++;
           //toDate.toDate2 = 'required';

       } else {

           if (angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) {
               document.getElementById("fromDateOpened").style.borderColor = "red";
               document.getElementById("fromDateOpened1").innerHTML = '*required';
               count++;
               //fromDate.frmDate1 = 'required';


           } else {
               document.getElementById("fromDateOpened").style.borderColor = "#dde6e9";
               document.getElementById("fromDateOpened1").innerHTML = '';
           }
           if (angular.isUndefined(toDate) || toDate === '' || toDate === null) {
               document.getElementById("toDateOpened").style.borderColor = "red";
               document.getElementById("toDateOpened1").innerHTML = '*required';
               count++;
               //toDate.toDate2 = 'required';

           } else if (toDate < fromDate) {
               document.getElementById("toDateOpened").style.borderColor = "red";
               document.getElementById("toDateOpened1").innerHTML = 'To Date should be greater than From Date';
               count++;
               //toDate.toDate2 = 'To Date should be greater than To Date';

           } else {
               document.getElementById("toDateOpened").style.borderColor = "#dde6e9";
               document.getElementById("toDateOpened1").innerHTML = '';
           }
           var datetwo = new Date(todate);
           var dateone = new Date(fromDate)
           var dayDif = (datetwo - dateone)  / 1000 / 60 / 60 / 24;
           if(dayDif <= 29){
               document.getElementById("fromDateOpened").style.borderColor = "#dde6e9";
           document.getElementById("fromDateOpened1").innerHTML = '';
           //searchData.frmDate1 = null;
       }else{
         document.getElementById("fromDateOpened").style.borderColor = "red";
           document.getElementById("fromDateOpened1").innerHTML = '*Unable to retrive more than one month data.';
           //searchData.frmDate1 = 'Unable to retrive more than 4 days data.';
           count++;  
       }


       }

       if (count > 0) {
           $scope.count = count;
           $rootScope.loader = 0;
           return false;
       } else {
           $scope.count = 0;
           $localStorage.put('searchReportFromDateOpen', fromDate);
           $localStorage.put('searchReportToDateOpen', todate);
           $state.go('app.searchedJobReport');
           $rootScope.loader = 0;
       }

   }
   

                $scope.sendDataHere = function(customerId){
                    $rootScope.loader = 1;
            $rootScope.fetchJobData = [];
            var allJobData = [];
            if($rootScope.roleId === '1'){
                 if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                      $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                         DriverJobDetails.find({

                    filter: {
                         where:{
                            customerId: customerId

                         },
                         
                        order: ['createdDate DESC'],
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


                function(jobData) {
                    console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weeklyOff !== null) {
                            for (var j = 0; j < jobData[i].weeklyOff.length; j++) {
                                if (jobData[i].weeklyOff[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weeklyOff[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weeklyOff[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weeklyOff[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weeklyOff[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weeklyOff[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weeklyOff[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].clientId,
                            customerId: jobData[i].customerId,
                            custName: jobData[i].customerDetails.conUsers.firstName + ' ' + jobData[i].customerDetails.conUsers.lastName,
                            date: createdDate,
                            firstName: jobData[i].customerDetails.conUsers.firstName,
                            lastName: jobData[i].customerDetails.conUsers.lastName,
                            email: jobData[i].customerDetails.conUsers.email,
                            mobile: jobData[i].customerDetails.conUsers.mobileNumber,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].carType,
                            dutyHours: jobData[i].dutyHours,
                            dutyType: jobData[i].dutyType,
                            createdDate: jobData[i].createdDate,
                            createdBy: jobData[i].createdBy,
                            createdByName: jobData[i].createdByName,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].dutyTime,
                            outstationDays: jobData[i].outstationDays,
                            driverAge: jobData[i].driverAge,
                            drivingExp: jobData[i].drivingExperience,
                            carName: jobData[i].vehicleName,
                            clientSalary: jobData[i].clientSalary,
                            driverSalary: jobData[i].driverSalary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                   // console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                       DriverJobDetails.find({

                    filter: {
                        where:{
                            location:  $rootScope.operationCitySelect,
                            customerId: customerId 
                        },
                        order: ['createdDate DESC'],
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


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weeklyOff !== null) {
                            for (var j = 0; j < jobData[i].weeklyOff.length; j++) {
                                if (jobData[i].weeklyOff[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weeklyOff[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weeklyOff[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weeklyOff[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weeklyOff[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weeklyOff[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weeklyOff[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                              var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].clientId,
                            customerId: jobData[i].customerId,
                            custName: jobData[i].customerDetails.conUsers.firstName + ' ' + jobData[i].customerDetails.conUsers.lastName,
                            date: createdDate,
                            firstName: jobData[i].customerDetails.conUsers.firstName,
                            lastName: jobData[i].customerDetails.conUsers.lastName,
                            email: jobData[i].customerDetails.conUsers.email,
                            mobile: jobData[i].customerDetails.conUsers.mobileNumber,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].carType,
                            dutyHours: jobData[i].dutyHours,
                            dutyType: jobData[i].dutyType,
                            createdDate: jobData[i].createdDate,
                            createdBy: jobData[i].createdBy,
                            createdByName: jobData[i].createdByName,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].dutyTime,
                            outstationDays: jobData[i].outstationDays,
                            driverAge: jobData[i].driverAge,
                            drivingExp: jobData[i].drivingExperience,
                            carName: jobData[i].vehicleName,
                            clientSalary: jobData[i].clientSalary,
                            driverSalary: jobData[i].driverSalary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus


                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                   
                }
            }else{
                DriverJobDetails.find({
                    filter: {
                         where:{
                            location: $rootScope.operationCity,
                            customerId: customerId
                        },
                        order: ['createdDate DESC'],
                        include: {
                            relation: 'customerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers',
                                     

                                }
                            }
                        }
                    }

                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].createdDate).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weeklyOff !== null) {
                            for (var j = 0; j < jobData[i].weeklyOff.length; j++) {
                                if (jobData[i].weeklyOff[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weeklyOff[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weeklyOff[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weeklyOff[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weeklyOff[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weeklyOff[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weeklyOff[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                              var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].clientId,
                            customerId: jobData[i].customerId,
                            custName: jobData[i].customerDetails.conUsers.firstName + ' ' + jobData[i].customerDetails.conUsers.lastName,
                            date: createdDate,
                            firstName: jobData[i].customerDetails.conUsers.firstName,
                            lastName: jobData[i].customerDetails.conUsers.lastName,
                            email: jobData[i].customerDetails.conUsers.email,
                            mobile: jobData[i].customerDetails.conUsers.mobileNumber,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].carType,
                            dutyHours: jobData[i].dutyHours,
                            dutyType: jobData[i].dutyType,
                            createdDate: jobData[i].createdDate,
                            createdBy: jobData[i].createdBy,
                            createdByName: jobData[i].createdByName,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].dutyTime,
                            outstationDays: jobData[i].outstationDays,
                            driverAge: jobData[i].driverAge,
                            drivingExp: jobData[i].drivingExperience,
                            carName: jobData[i].vehicleName,
                            clientSalary: jobData[i].clientSalary,
                            driverSalary: jobData[i].driverSalary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus


                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
$localStorage.put('customerId', undefined);
            }

            
                    
 $rootScope.sendAreaHere = function(area){
                    $rootScope.loader = 1;
            $rootScope.fetchJobData = [];
            var allJobData = [];
            if($rootScope.roleId === '1'){
                 if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.searchJob');
                      $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                         
                         DriverJobDetails.getDriverJobOnArea({
                                Area:area,
                                operationCity:$rootScope.operationCitySelect
                },


                function(jobData) {
                    console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                             var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                   // console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
                    }else{
                       DriverJobDetails.getDriverJobOnArea({
                                Area:area,
                                operationCity:$rootScope.operationCitySelect
                },

                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                              var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                            id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus


                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });  
                    }
                   
                }
            }else{
                DriverJobDetails.getDriverJobOnArea({
                                Area:area,
                                operationCity:$rootScope.operationCity
                },


                function(jobData) {
                  //  console.log('job data' + JSON.stringify(jobData));
                    for (var i = 0; i < jobData.length; i++) {

                        var weekDaysId = [];
                        var weekDays = [];
                        var createdDate = moment(jobData[i].created_date).format('DD-MM-YYYY HH:mm:ss');
                        
                        if (jobData[i].weekly_off !== null) {
                            for (var j = 0; j < jobData[i].weekly_off.length; j++) {
                                if (jobData[i].weekly_off[j] === '1') {
                                    weekDaysId.push(1);
                                    weekDays.push('Monday');
                                }
                                if (jobData[i].weekly_off[j] === '2') {
                                    weekDaysId.push(2);
                                    weekDays.push('Tuesday');
                                }
                                if (jobData[i].weekly_off[j] === '3') {
                                    weekDaysId.push(3);
                                    weekDays.push('Wednesday');
                                }
                                if (jobData[i].weekly_off[j] === '4') {
                                    weekDaysId.push(4);
                                    weekDays.push('Thursday');
                                }
                                if (jobData[i].weekly_off[j] === '5') {
                                    weekDaysId.push(5);
                                    weekDays.push('Friday');
                                }
                                if (jobData[i].weekly_off[j] === '6') {
                                    weekDaysId.push(6);
                                    weekDays.push('Saturday');
                                }
                                if (jobData[i].weekly_off[j] === '7') {
                                    weekDaysId.push(7);
                                    weekDays.push('Sunday');
                                }

                            }
                        }
                        var Days = '' +weekDays;
                              var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                    if (jobData[i].status === 'Open') {
                        orderStatus = 'A';
                    } else if(jobData[i].status === 'Closed') {
                        orderStatus = 'B';
                    } 
                }
                        allJobData.push({
                               id: jobData[i].id,
                            clientId: jobData[i].client_id,
                            customerId: jobData[i].customer_id,
                            custName: jobData[i].name,
                            date: createdDate,
                            email: jobData[i].email,
                            status: jobData[i].status,
                            area: jobData[i].area,
                            carType: jobData[i].car_type,
                            dutyHours: jobData[i].duty_hours,
                            dutyType: jobData[i].duty_type,
                            createdDate: jobData[i].created_date,
                            createdByName: jobData[i].created_by_name,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            dutyTime: jobData[i].duty_time,
                            outstationDays: jobData[i].outstation_days,
                            driverAge: jobData[i].driver_age,
                            drivingExp: jobData[i].driving_experience,
                            carName: jobData[i].vehicle_name,
                            clientSalary: jobData[i].client_salary,
                            driverSalary: jobData[i].driver_salary,
                            role: jobData[i].role,
                            other: jobData[i].other,
                            location: jobData[i].location,
                            jobStatusOrder: orderStatus

                        });


                    }
                    $rootScope.fetchJobData = allJobData;
                    $scope.data = allJobData;
                    //console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
$localStorage.put('Area', undefined);
            }
        }
        };

       $scope.gotoReport = function() {
            $rootScope.AllReport = false;
            $state.go('app.jobReport');

        };
        $scope.gotoAllReport = function() {
            $rootScope.AllReport = true;
            $state.go('app.jobReport');

        };

             $scope.jobReportCustMobileSelected = function() {

        if ($scope.search !== undefined && $scope.search.mobileNumber1 !== undefined && $scope.search.mobileNumber1 !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber1));
            $scope.mobileId = parseInt($scope.search.mobileNumber1.originalObject.id);
            $rootScope.custCellNo = $scope.search.mobileNumber1.originalObject.mobileNumber;

        }
    };
    
              $scope.searchJobRequestByName = function(search) {
            $rootScope.loader = 1;

            var count = 0;
            
                    if(angular.isUndefined(search)){
                        document.getElementById("mobileNo").style.borderColor = "red";
                    document.getElementById("mobileNo1").innerHTML = '*required';
                    count++;
                    }
                else if ((angular.isUndefined($scope.mobileId) || $scope.mobileId === '' || $scope.mobileId === null) && (!angular.isUndefined(search.address))) {
                    document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                    document.getElementById("mobileNo1").innerHTML = '';
                    $localStorage.put('Area', search.address);
                    $state.go('app.jobReport');
                $rootScope.loader = 0;
                    count--;
                }else{

                    document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                    document.getElementById("mobileNo1").innerHTML = '';
                    count--;
                }
 

            

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;
                $localStorage.put('customerId', $scope.mobileId);
                
               // $state.go('app.searchedJobRequest');
                $state.go('app.jobReport');
                $rootScope.loader = 0;
            }



        }

        $scope.searchJobRequest = function(fromDate, toDate) {
            $rootScope.loader = 1;

            var count = 0;
            if ((angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) && (angular.isUndefined(toDate) || toDate === '' || toDate === null)) {
                document.getElementById("fromDate").style.borderColor = "red";
                document.getElementById("fromDate1").innerHTML = '*required';

                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate1").innerHTML = '*required';
                count++;
                //toDate.toDate2 = 'required';

            } else {

                if (angular.isUndefined(fromDate) || fromDate === '' || fromDate === null) {
                    document.getElementById("fromDate").style.borderColor = "red";
                    document.getElementById("fromDate1").innerHTML = '*required';
                    count++;
                    //fromDate.frmDate1 = 'required';


                } else {
                    document.getElementById("fromDate").style.borderColor = "#dde6e9";
                    document.getElementById("fromDate1").innerHTML = '';
                }
                if (angular.isUndefined(toDate) || toDate === '' || toDate === null) {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate1").innerHTML = '*required';
                    count++;
                    //toDate.toDate2 = 'required';

                } else if (toDate < fromDate) {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate1").innerHTML = 'To Date should be greater than From Date';
                    count++;
                    //toDate.toDate2 = 'To Date should be greater than To Date';

                } else {
                    document.getElementById("toDate").style.borderColor = "#dde6e9";
                    document.getElementById("toDate1").innerHTML = '';
                }


            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.count = 0;
                $localStorage.put('searchRequestFromDate', fromDate);
                $localStorage.put('searchRequestToDate', toDate);
                $state.go('app.searchedJobRequest');
                $rootScope.loader = 0;
            }



        }
        $scope.backToSearchReport = function() {
            $localStorage.put('customerId', undefined);
            $localStorage.put('Area', undefined);
            $state.go('app.searchJob');

        };
        $scope.jobRequestPopup = function(jobId, cname, jArea) {
            $localStorage.put('custJobId', jobId);
            $localStorage.put('cname', cname);
            $localStorage.put('jobArea', jArea);
            $state.go('app.jobRequestReport');

        };
        $scope.backToJobReport = function() {
            $localStorage.put('custJobId', undefined);
            $localStorage.put('cname', undefined);
            $localStorage.put('jobArea', undefined);
            $rootScope.JobArea = undefined;
            $rootScope.cname = undefined;
            $rootScope.fetchJobRequestData = undefined;
            $window.history.back();

        };
       $rootScope.getJobRequest = function() {

            $rootScope.loader = 1;
            var jobId = $localStorage.get('custJobId');
            $rootScope.cname = $localStorage.get('cname');
            $rootScope.JobArea = $localStorage.get('jobArea');
            $rootScope.fetchJobRequestData = [];

            var allJobRequestData = [];
            DriverJobRequest.DriverJobRequestDataByJobId({
                         jobId: jobId
                         }, function(jobRequestData) {
                    console.log('job request data' + JSON.stringify(jobRequestData));
                    for (var i = 0; i < jobRequestData.length; i++) {
                        /*if(angular.isUndefined(jobRequestData[i].licenseDate) || jobRequestData[i].licenseDate === '' || jobRequestData[i].licenseDate=== null){
             var Experience = 0;
        }else{


                   var birthday = new Date(jobRequestData[i].licenseDate);
                      var today = new Date();
                      var age = ((today - birthday) / (31557600000));
                      var Experience = Math.floor( age );
                       
             }*/
             if(jobRequestData[i].license_date=== null){

            var Experience = 0;
               
        }else{


                 var exp = new Date(jobRequestData[i].license_date);
                 var today = new Date();
                var Experience = ((today - exp) / (31557600000));
                Experience = Math.floor(Experience);
                   
                      
                       
             }



                        var createdDate = moment(jobRequestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].driver_job_id,
                            driverId: jobRequestData[i].driver_id,
                            drvName: jobRequestData[i].first_name + ' ' + jobRequestData[i].last_name,
                            date: createdDate,
                            firstName: jobRequestData[i].first_name,
                            lastName: jobRequestData[i].last_name,
                            contactNo: jobRequestData[i].mobile_number,
                            remark: jobRequestData[i].remark,
                            address: jobRequestData[i].address,
                            createdDate: jobRequestData[i].created_date,
                            createdBy: jobRequestData[i].created_by,
                            createdByName: jobRequestData[i].created_by_name,
                            status: jobRequestData[i].status,
                            age: jobRequestData[i].bdate,
                            experience: Experience


                        });


                    }
                    $rootScope.fetchJobRequestData = allJobRequestData;
                    $scope.data = allJobRequestData;
                    //console.log('All Driver' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;
                },
                function(jabDataErr) {

                    console.log('jobData error ' + JSON.stringify(jabDataErr));
                    if (jabDataErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        };

        /*$scope.closeJob = function(jobId) {
            if ($window.confirm("Are you sure, you wan\'t to close this Job?")) {
                $scope.result = "Yes";
                if (angular.isDefined(jobId) && jobId !== null) {
                    DriverJobDetails.findById({
                            id: jobId
                        },
                        function(DriverJobDetails) {
                            //console.log('update status to closed: '+JSON.stringify(DriverJobDetails));
                            DriverJobDetails.status = 'Closed';

                            DriverJobDetails.updatedBy = $localStorage.get('userId');
                            DriverJobDetails.updatedDate = new Date();
                            DriverJobDetails.$save();
                            reloadFunc();
                            $rootScope.getDriverJob();
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
            } else {
                $scope.result = "No";
            }

        };

        $scope.openJob = function(jobId) {

            if ($window.confirm("Are you sure, you wan\'t to open this Job?")) {
                $scope.result = "Yes";
                if (angular.isDefined(jobId) && jobId !== null) {
                    DriverJobDetails.findById({
                            id: jobId
                        },
                        function(DriverJobDetails) {
                           // console.log('update status to open: '+JSON.stringify(DriverJobDetails));
                            DriverJobDetails.status = 'Open';

                            DriverJobDetails.updatedBy = $localStorage.get('userId');
                            DriverJobDetails.updatedDate = new Date();
                            DriverJobDetails.$save();
                            reloadFunc();
                            $rootScope.getDriverJob();
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
            } else {
                $scope.result = "No";
            }

        };*/
        
      $scope.getAge = function(birthday){
        if(angular.isUndefined(birthday) || birthday === '' || birthday=== null){
            return 0;
        }else{


                   var birthday = new Date(birthday);
                      var today = new Date();
                      var age = ((today - birthday) / (31557600000));
                      var age = Math.floor( age );
                      return age;
             }
  }

        $scope.searchDriverPopup = function(jobId, cutName, status) {
            if (status === 'Open') {
                $rootScope.applyJobId = jobId;
                $rootScope.customerName = cutName;

                var modalInstance = $modal.open({
                    templateUrl: '/applyJob.html',
                    controller: applyJobCtrl
                });


                var state = $('#modal-state');
                modalInstance.result.then(function() {
                    state.text('Modal dismissed with OK status');
                }, function() {
                    state.text('Modal dismissed with Cancel status');
                });
            } else {
                window.alert('Unable to apply for job in Closed Mode.');
            }
        };

        var applyJobCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
            $scope.driverMobileSelected = function() {

                if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                    //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                    $rootScope.applyDrvId = parseInt($scope.search.mobileNumber.originalObject.id);
                    $rootScope.drvCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;

                }
            };
            $scope.verifyDrvMobile = function() {
                $rootScope.loader = 1;
                $scope.disableDrvSubmit = true;

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

                        if ((custSuccess[0].mobileNumber === cellNumber) && (custSuccess[0].userRoles[0].roleId === '3')) {
                            document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                            document.getElementById("mobileNo1").innerHTML = '';
                            $scope.addDriverRequestPopup();
                        } else {
                            document.getElementById("mobileNo").style.borderColor = "red";
                            document.getElementById("mobileNo1").innerHTML = 'Can not add request,This number belongs to customer or staff.';
                            $scope.disableDrvSubmit = false;
                            $rootScope.loader = 0;
                            return false;
                        }
                    } else {
                        $scope.addDriverRequestPopup();
                    }
                }, function(custErr) {
                    console.log('custErr***' + JSON.stringify(custErr));
                    $scope.disableDrvSubmit = false;
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });
            };

            $scope.addDriverRequestPopup = function() {

                var count = 0;
                $rootScope.drvMobileDisable1 = true;
                var cellNumber = document.getElementById('mobileNo_value').value;

                if (angular.isUndefined($rootScope.drvCellNo) || $rootScope.drvCellNo == null || $rootScope.drvCellNo == '') {
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
                    $scope.disableDrvSubmit = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    var modalInstance = $modal.open({
                        templateUrl: '/addDriverRequest.html',
                        controller: applyJobCtrl
                    });


                    var state = $('#modal-state');
                    modalInstance.result.then(function() {
                        state.text('Modal dismissed with OK status');
                    }, function() {
                        state.text('Modal dismissed with Cancel status');
                    });

                    if (!angular.isUndefined($rootScope.drvCellNo)) {
                        $scope.getDriverData($rootScope.drvCellNo);
                    } else {
                        $scope.getDriverData(cellNumber);
                    }
                    $scope.disableDrvSubmit = false;
                    $rootScope.loader = 0;

                }

            };

            $scope.getDriverData = function(cellNumber) {
                var cellNumber = cellNumber;
                ConUsers.find({
                        filter: {
                            where: {
                                mobileNumber: cellNumber
                            },
                            include: {
                                relation: 'driverDetails'
                            }

                        }
                    },
                    function(drvData) {
                        //console.log('drvData ' + JSON.stringify(drvData));
                        if (drvData.length > 0) {
                            $rootScope.drvRecordExist = true;
                            $rootScope.drvExistFlag = 1;
                            $rootScope.drvRequestDetails = {
                                driverId: drvData[0].driverDetails[0].id,
                                conUserId: drvData[0].id,
                                firstName: drvData[0].firstName,
                                lastName: drvData[0].lastName,
                                mobileNumber: cellNumber,
                                address: drvData[0].address,
                                city:drvData[0].operationCity

                            };

                        } else {
                            $rootScope.drvRecordExist = false;
                            $rootScope.drvExistFlag = 0;
                            $rootScope.drvRequestDetails = {
                                driverId: '',
                                conUserId: '',
                                firstName: '',
                                middleName: '',
                                lastName: '',
                                mobileNumber: cellNumber,
                                address: '',
                                city:''

                            };
                        }

                        //console.log('driver details' + JSON.stringify($rootScope.drvRequestDetails));
                        $modalInstance.dismiss('cancel');

                    },
                    function(error) {
                        console.log('error ' + JSON.stringify(error));
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');

                        }
                    });
            }
            $scope.fetchsearchDrvList = function() {


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


            $scope.getDriverMobileDetails = function() {

                $rootScope.loader = 1;
                $scope.driverList = [];
                if($rootScope.roleId === '1'){
                    if($rootScope.operationCitySelect === 'All'){
                        DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
                    }, function(driverData) {
                        //console.log('driverData' + JSON.stringify(driverData));
                        for (var i = 0; i < driverData.length; i++) {
                            $scope.driverList.push({
                                id: driverData[i].id,
                                mobileNumber: driverData[i].mobile_number,
                                driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                                drvDetails: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.driverList));

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
                        DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
                    }, function(driverData) {
                        //console.log('driverData' + JSON.stringify(driverData));
                        for (var i = 0; i < driverData.length; i++) {
                            $scope.driverList.push({
                                id: driverData[i].id,
                                mobileNumber: driverData[i].mobile_number,
                                driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                                drvDetails: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.driverList));

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
                    DriverDetails.getDrivers({
                        operationCity:$rootScope.operationCitySelect
                    }, function(driverData) {
                        //console.log('driverData' + JSON.stringify(driverData));
                        for (var i = 0; i < driverData.length; i++) {
                            $scope.driverList.push({
                                id: driverData[i].id,
                                mobileNumber: driverData[i].mobile_number,
                                driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
                                drvDetails: driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.driverList));

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


            $scope.addDriverRequest = function(drvRequestDetails) {
                //console.log('drvRequestDetails' + JSON.stringify(drvRequestDetails));
                $rootScope.loader = 1;
                var count = 0;
                $scope.isDisabledButton = true;
                if (angular.isUndefined(drvRequestDetails.firstName) || drvRequestDetails.firstName === '') {
                    document.getElementById("firstName").style.borderBottom = "1px solid red";
                    document.getElementById("firstName1").innerHTML = '*required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';

                }

                if (angular.isUndefined(drvRequestDetails.lastName) || drvRequestDetails.lastName === '' || drvRequestDetails.lastName === null) {
                    document.getElementById("lastName").style.borderBottom = "1px solid red";
                    document.getElementById("lastName1").innerHTML = '*required';

                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';


                }

                if ($rootScope.drvExistFlag == 0) {
                    if (angular.isUndefined(drvRequestDetails.address) || drvRequestDetails.address === '' || drvRequestDetails.address === null) {
                        document.getElementById("address").style.borderColor = "red";
                        document.getElementById("address1").innerHTML = '*required';
                        //customerDetails.address = 'This value is required';
                        count++;
                    } else {


                        document.getElementById("address").style.borderColor = "#dde6e9";
                        document.getElementById("address1").innerHTML = '';
                        //customerDetails.address = null;

                    }
                }

                if (angular.isUndefined(drvRequestDetails.city) || drvRequestDetails.city === '' || drvRequestDetails.city === null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*required';
                    drvRequestDetails.operationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("operationCity1").innerHTML = '';
                    drvRequestDetails.operationCity1 = null;
                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    
                        if (count > 0) {
                            $scope.count = count;
                            $scope.isDisabledButton = false;
                            $rootScope.loader = 0;
                            return false;
                        } else {
                            $scope.count = 0;
                            var remark = null;
                            if (!angular.isUndefined(drvRequestDetails.remark) || drvRequestDetails.remark !== null || drvRequestDetails.remark !== '') {
                                remark = drvRequestDetails.remark;
                            }
                            if ($rootScope.drvExistFlag == 1) {
                               
                                DriverJobRequest.applyDriverJob({
                                    jobId: $rootScope.applyJobId,
                                    driverId: $rootScope.drvRequestDetails.driverId,
                                    userId: $rootScope.userId,
                                    remark: remark
                                }, function(requestSuccess) {
                                    //console.log('success: ' + JSON.stringify(requestSuccess));
                                    if (requestSuccess[0].apply_driver_job === '0') {
                                        $.notify('The driver is applied successfully for this Job.', {
                                            status: 'success'
                                        });
                                        $rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                        $rootScope.getDriverJob();
                                        $rootScope.loader = 0;
                                    } else if (requestSuccess[0].apply_driver_job === '1') {

                                        window.alert('The driver is already applied for this Job.');
                                        $rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                        $rootScope.getDriverJob();
                                        $rootScope.loader = 0;
                                    }else{

                                        window.alert('The driver is not registerd with us please ask him to come to office.');
                                        $rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                        $rootScope.getDriverJob();
                                        $rootScope.loader = 0;  
                                    }

                                }, function(error) {
                                    console.log('error');
                                });

                            } else {
                                //console.log('new driver');
                                  
                                     var addressLat =0;
                            var addressLong = 0;

                                ConUsers.create({
                                    firstName: drvRequestDetails.firstName,
                                    lastName: drvRequestDetails.lastName,
                                    mobileNumber: drvRequestDetails.mobileNumber,
                                    username: drvRequestDetails.mobileNumber,
                                    password: drvRequestDetails.mobileNumber,
                                    email: drvRequestDetails.mobileNumber + '@consrv.in',
                                    address: drvRequestDetails.address,
                                    addressLat: addressLat,
                                    addressLong: addressLong,
                                    createdBy: $rootScope.userId,
                                    status: 'Inactive',
                                    operationCity:drvRequestDetails.city

                                }, function(newConUser) {
                                    //console.log('newConUser: ' + JSON.stringify(newConUser));
                                    DriverDetails.create({
                                        conuserId: newConUser.id,
                                        createdBy: $rootScope.userId,
                                        isLuxury: 'M'

                                    }, function(newDriverData) {
                                        //console.log('newDriverData: ' + JSON.stringify(newDriverData));
                                        UserRoles.create({
                                            conuserId: newConUser.id,
                                            roleId: 3,
                                            createdBy: $rootScope.userId
                                        }, function(roleData) {
                                            //console.log('roleData: ' + JSON.stringify(roleData));
                                            DriverJobRequest.applyDriverJob({
                                                jobId: $rootScope.applyJobId,
                                                driverId: newDriverData.id,
                                                userId: $rootScope.userId,
                                                remark: remark
                                            }, function(requestSuccess) {
                                                //console.log('success: ' + JSON.stringify(requestSuccess));
                                                if (requestSuccess[0].apply_driver_job === '0') {
                                                    $.notify('The driver is applied successfully for this Job.', {
                                                        status: 'success'
                                                    });
                                                    $rootScope.drvRequestDetails = undefined;
                                                    $rootScope.applyDrvId = undefined;
                                                    $rootScope.applyJobId = undefined;
                                                    $rootScope.drvCellNo = undefined;
                                                    $scope.isDisabledButton = false;
                                                    $modalInstance.dismiss('cancel');

                                                    reloadFunc();
                                                    $rootScope.getDriverJob();
                                                    $rootScope.loader = 0;
                                                } else if (requestSuccess[0].apply_driver_job === '1') {

                                                    window.alert('The driver is already applied for this Job.');
                                                    $rootScope.drvRequestDetails = undefined;
                                                    $rootScope.applyDrvId = undefined;
                                                    $rootScope.applyJobId = undefined;
                                                    $rootScope.drvCellNo = undefined;
                                                    $scope.isDisabledButton = false;
                                                    $modalInstance.dismiss('cancel');

                                                    reloadFunc();
                                                    $rootScope.getDriverJob();
                                                    $rootScope.loader = 0;
                                                }

                                            }, function(error) {
                                                console.log('error');
                                            });
                                        }, function(roleErr) {
                                            console.log('roleErr: ' + JSON.stringify(roleErr));
                                        });

                                    }, function(newDriverErr) {
                                        console.log('newDriverErr: ' + JSON.stringify(newDriverErr));
                                    });

                                }, function(newConUserErr) {
                                    console.log('newConUser error: ' + JSON.stringify(newConUserErr));
                                });
                                
                                


                            }
                        }

                    


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

            $scope.closeModal = function() {
                $rootScope.customerName = undefined;
                $rootScope.drvRequestDetails = undefined;
                $rootScope.drvCellNo = undefined;
                $rootScope.applyDrvId = undefined;
                $rootScope.applyJobId = undefined;
                $modalInstance.dismiss('cancel');
                $rootScope.getDriverJob();
            };

        };

        $scope.addJob = function() {

            var modalInstance = $modal.open({
                templateUrl: '/addJob.html',
                controller: addJobCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

        var addJobCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {

            $scope.carTypeArray = [{
                'desc': 'M'
            }, {
                'desc': 'A'
            }];

            $scope.roleArray = [{
                'desc': 'I'
            }, {
                'desc': 'H'
            }];

            $scope.weeklyOffArray = [{
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
            $("li.search-field input").val('Select Day');

            $scope.verifyMobile = function() {
                $rootScope.loader = 1;
                $scope.disableCustSubmit = true;
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
                            $scope.addNewJob();
                        } else {
                            document.getElementById("mobileNo").style.borderColor = "red";
                            document.getElementById("mobileNo1").innerHTML = 'Can not add request,This number belongs to driver or staff.';
                            $scope.disableCustSubmit = false;
                            $rootScope.loader = 0;
                            return false;
                        }
                    } else {
                        $scope.addNewJob();
                    }
                }, function(custErr) {
                    console.log('custErr***' + JSON.stringify(custErr));
                    $scope.disableCustSubmit = false;

                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });
            };

            $scope.addNewJob = function() {

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
                    $scope.disableCustSubmit = false;
                    $rootScope.loader = 0;
                    return false;
                } else {

                    $scope.count = 0;

                    var modalInstance = $modal.open({
                        templateUrl: '/addNewJob.html',
                        controller: addJobCtrl
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
                    $scope.disableCustSubmit = false;
                    $rootScope.loader = 0;
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


            $rootScope.getCities = function() {
          Cities.find({

          },function(success){
              console.log('select cities :' +JSON.stringify(success));
              $rootScope.cities =[];
             
              for(var i = 0; i< success.length ; i++){
                  if(success[i].cityName !== null){
                    $rootScope.cities.push(success[i].cityName);  
                  }
                 
              }
             
               $rootScope.put('cities', $rootScope.cities);
              //console.log('select cities :' +JSON.stringify($rootScope.cities));
               

          },function(error){
              console.log('erro in city fetching' +JSON.stringify(error))
          });
      }
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
                            $scope.verifyClientId(customerDetails);
                        } else {
                            document.getElementById("email").style.borderColor = "red";
                            document.getElementById("email1").innerHTML = 'Email exist';
                            $scope.isDisabledButton = false;
                            return false;
                        }

                    } else {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $scope.verifyClientId(customerDetails);
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

            $scope.verifyClientId = function(customerDetails) {

                //console.log('driver verify code' + JSON.stringify(driver));
                if (angular.isUndefined(customerDetails.clientId) || customerDetails.clientId === '') {
                    $scope.addJobForDriver(customerDetails);
                } else {

                    DriverJobDetails.find({
                        filter: {
                            where: {
                                clientId: customerDetails.clientId
                            }

                        }
                    }, function(clientIdSuccess) {
                        //console.log('clientIdSuccess***' + JSON.stringify(clientIdSuccess));

                        if (clientIdSuccess.length > 0) {


                            document.getElementById("clientId").style.borderColor = "red";
                            document.getElementById("clientId1").innerHTML = 'Client Id exist';
                            $scope.isDisabledButton = false;
                            return false;



                        } else {
                            document.getElementById("clientId").style.borderColor = "#dde6e9";
                            document.getElementById("clientId1").innerHTML = '';
                            $scope.addJobForDriver(customerDetails);
                        }

                    }, function(clientIdErr) {
                        console.log('clientIdErr***' + JSON.stringify(clientIdErr));
                        $scope.isDisabledButton = false;
                        $modalInstance.dismiss('cancel');
                        if (clientIdErr.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                    });
                }


            };

            $scope.addJobForDriver = function(customerDetails) {
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

                if (angular.isUndefined(customerDetails.carType) || customerDetails.carType === '' || customerDetails.carType === null) {
                    document.getElementById("carType").style.borderColor = "red";
                    document.getElementById("carType1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("carType").style.borderColor = "#dde6e9";
                    document.getElementById("carType1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.dutyHours) || customerDetails.dutyHours === '' || customerDetails.dutyHours === null) {
                    document.getElementById("dutyHours").style.borderColor = "red";
                    document.getElementById("dutyHours1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                    document.getElementById("dutyHours1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.dutyDetail) || customerDetails.dutyDetail === '' || customerDetails.dutyDetail === null) {
                    document.getElementById("dutyDetail").style.borderColor = "red";
                    document.getElementById("dutyDetail1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("dutyDetail").style.borderColor = "#dde6e9";
                    document.getElementById("dutyDetail1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.clientId) || customerDetails.clientId === '' || customerDetails.clientId === null) {
                    document.getElementById("clientId").style.borderColor = "red";
                    document.getElementById("clientId1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("clientId").style.borderColor = "#dde6e9";
                    document.getElementById("clientId1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.carName) || customerDetails.carName === '' || customerDetails.carName === null) {
                    document.getElementById("carName").style.borderColor = "red";
                    document.getElementById("carName1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("carName").style.borderColor = "#dde6e9";
                    document.getElementById("carName1").innerHTML = '';
                    //customerDetails.address = null;

                }


                if (angular.isUndefined(customerDetails.outstationDays) || customerDetails.outstationDays === '' || customerDetails.outstationDays === null) {
                    document.getElementById("outstationDays").style.borderColor = "red";
                    document.getElementById("outstationDays1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("outstationDays").style.borderColor = "#dde6e9";
                    document.getElementById("outstationDays1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.driverAge) || customerDetails.driverAge === '' || customerDetails.driverAge === null) {
                    document.getElementById("driverAge").style.borderColor = "red";
                    document.getElementById("driverAge1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverAge").style.borderColor = "#dde6e9";
                    document.getElementById("driverAge1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.drivingExp) || customerDetails.drivingExp === '' || customerDetails.drivingExp === null) {
                    document.getElementById("drivingExp").style.borderColor = "red";
                    document.getElementById("drivingExp1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("drivingExp").style.borderColor = "#dde6e9";
                    document.getElementById("drivingExp1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.clientSalary) || customerDetails.clientSalary === '' || customerDetails.clientSalary === null) {
                    document.getElementById("clientSalary").style.borderColor = "red";
                    document.getElementById("clientSalary1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("clientSalary").style.borderColor = "#dde6e9";
                    document.getElementById("clientSalary1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.location) || customerDetails.location=== '' || customerDetails.location=== null) {
                   document.getElementById("location").style.borderColor = "red";
                   document.getElementById("location").innerHTML = '*required';
                   //customerDetails.address = 'This value is required';
                   count++;
               } else {
                   document.getElementById("location").style.borderColor = "#dde6e9 ";
                   document.getElementById("location").innerHTML = '';
                   //customerDetails.address = null;

               }

                if (angular.isUndefined(customerDetails.driverSalary) || customerDetails.driverSalary === '' || customerDetails.driverSalary === null) {
                    document.getElementById("driverSalary").style.borderColor = "red";
                    document.getElementById("driverSalary1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverSalary").style.borderColor = "#dde6e9";
                    document.getElementById("driverSalary1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.role) || customerDetails.role === '' || customerDetails.role === null) {
                    document.getElementById("role").style.borderColor = "red";
                    document.getElementById("role1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("role").style.borderColor = "#dde6e9";
                    document.getElementById("role1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.dutyTime) || customerDetails.dutyTime === '' || customerDetails.dutyTime === null) {
                    document.getElementById("dutyTime").style.borderColor = "red";
                    document.getElementById("dutyTime1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("dutyTime").style.borderColor = "#dde6e9";
                    document.getElementById("dutyTime1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.weeklyOff) || customerDetails.weeklyOff === '' || customerDetails.weeklyOff === null) {
                    document.getElementById("weeklyOff").style.borderColor = "red";
                    document.getElementById("weeklyOff1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("weeklyOff").style.borderColor = "#dde6e9";
                    document.getElementById("weeklyOff1").innerHTML = '';
                    //customerDetails.address = null;

                }


                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    if ($rootScope.customerExistFlag == 1) {
                       
                        DriverJobDetails.createNewJob({
                            customerId: $rootScope.customerDetails.customerId,
                            area: customerDetails.address,
                            carType: customerDetails.carType,
                            dutyHours: customerDetails.dutyHours,
                            dutyType: customerDetails.dutyDetail,
                            createdBy: $rootScope.userId,
                            clientId: customerDetails.clientId,
                            weeklyOff: '{' + customerDetails.weeklyOff + '}',
                            dutyTime: customerDetails.dutyTime,
                            outstationDays: customerDetails.outstationDays,
                            driverAge: customerDetails.driverAge,
                            drivingExp: customerDetails.drivingExp,
                            carName: customerDetails.carName,
                            clientSalary: customerDetails.clientSalary,
                            driverSalary: customerDetails.driverSalary,
                            role: customerDetails.role,
                            other: customerDetails.other,
                            location: customerDetails.location


                        }, function(success) {
                            //console.log('New job success :' + JSON.stringify(success));
                            if (success[0].create_new_job === 'Success') {
                                $.notify('New Job is added successfully.', {
                                    status: 'success'
                                });
                                $rootScope.customerDetails = undefined;
                                $rootScope.customerCellNo = undefined;

                                $modalInstance.dismiss('cancel');
                                $scope.isDisabledButton = false;

                                reloadFunc();
                                $rootScope.getDriverJob();
                                $rootScope.loader = 0;
                            }
                           

                        }, function(err) {
                            console.log('new job creation err ' + JSON.stringify(err));
                            $scope.isDisabledButton = false;
                            if (err.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;

                        });

                    } else {
                            if($rootScope.roleId === '1'){
                if(!angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect !== null){
                  ConUsers.createCustomer({
                            firstName: customerDetails.firstName,
                            middleName: customerDetails.middleName,
                            lastName: customerDetails.lastName,
                            mobileNumber: customerDetails.mobileNumber,
                            email: customerDetails.email,
                            password: customerDetails.mobileNumber,
                            address: '',
                            addressLine2: customerDetails.address,
                            userId: $rootScope.userId,
                            status: 'Active',
                            customerType: 'R',
                            operationCity:$rootScope.operationCitySelect

                        }, function(customerData) {
                            //console.log('customerData ' + JSON.stringify(customerData));
                            DriverJobDetails.createNewJob({
                                customerId: customerData[1].id,
                                area: customerDetails.address,
                                carType: customerDetails.carType,
                                dutyHours: customerDetails.dutyHours,
                                dutyType: customerDetails.dutyDetail,
                                createdBy: $rootScope.userId,
                                clientId: customerDetails.clientId,
                                weeklyOff: '{' + customerDetails.weeklyOff + '}',
                                dutyTime: customerDetails.dutyTime,
                                outstationDays: customerDetails.outstationDays,
                                driverAge: customerDetails.driverAge,
                                drivingExp: customerDetails.drivingExp,
                                carName: customerDetails.carName,
                                clientSalary: customerDetails.clientSalary,
                                driverSalary: customerDetails.driverSalary,
                                role: customerDetails.role,
                                other: customerDetails.other,
                                location: customerDetails.location

                            }, function(success) {
                                //console.log('New job success :' + JSON.stringify(success));
                                if (success[0].create_new_job === 'Success') {
                                    $.notify('New Job is added successfully.', {
                                        status: 'success'
                                    });
                                    $rootScope.customerDetails = undefined;
                                    $rootScope.customerCellNo = undefined;

                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;

                                    reloadFunc();
                                    $rootScope.getDriverJob();
                                    $rootScope.loader = 0;
                                }
                                

                            }, function(err) {
                                console.log('new job creation err ' + JSON.stringify(err));
                                $scope.isDisabledButton = false;
                                if (err.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;

                            });

                        }, function(customerErr) {
                            console.log('customerErr ' + JSON.stringify(customerErr));
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
                            address: '',
                            addressLine2: customerDetails.address,
                            userId: $rootScope.userId,
                            status: 'Active',
                            customerType: 'R',
                            operationCity:$rootScope.operationCity

                        }, function(customerData) {
                            //console.log('customerData ' + JSON.stringify(customerData));
                            DriverJobDetails.createNewJob({
                                customerId: customerData[1].id,
                                area: customerDetails.address,
                                carType: customerDetails.carType,
                                dutyHours: customerDetails.dutyHours,
                                dutyType: customerDetails.dutyDetail,
                                createdBy: $rootScope.userId,
                                clientId: customerDetails.clientId,
                                weeklyOff: '{' + customerDetails.weeklyOff + '}',
                                dutyTime: customerDetails.dutyTime,
                                outstationDays: customerDetails.outstationDays,
                                driverAge: customerDetails.driverAge,
                                drivingExp: customerDetails.drivingExp,
                                carName: customerDetails.carName,
                                clientSalary: customerDetails.clientSalary,
                                driverSalary: customerDetails.driverSalary,
                                role: customerDetails.role,
                                other: customerDetails.other,
                                location: customerDetails.location

                            }, function(success) {
                                //console.log('New job success :' + JSON.stringify(success));
                                if (success[0].create_new_job === 'Success') {
                                    $.notify('New Job is added successfully.', {
                                        status: 'success'
                                    });
                                    $rootScope.customerDetails = undefined;
                                    $rootScope.customerCellNo = undefined;

                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabledButton = false;

                                    reloadFunc();
                                    $rootScope.getDriverJob();
                                    $rootScope.loader = 0;
                                }
                                

                            }, function(err) {
                                console.log('new job creation err ' + JSON.stringify(err));
                                $scope.isDisabledButton = false;
                                if (err.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;

                            });

                        }, function(customerErr) {
                            console.log('customerErr ' + JSON.stringify(customerErr));
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
            };


            $scope.closeModal = function() {
                $rootScope.customerDetails = undefined;
                $rootScope.customerCellNo = undefined;
                $modalInstance.dismiss('cancel');
                $rootScope.getDriverJob();
            };

        };
        $scope.updateJob = function(jobId) {
            $rootScope.updateJobId = jobId;
            //console.log('request Id: ' + $rootScope.updateJobId);
            var modalInstance = $modal.open({
                templateUrl: '/updateJob.html',
                controller: updateJobCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };
        var updateJobCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
            $scope.carTypeArray = [{
                'desc': 'M'
            }, {
                'desc': 'A'
            }];

            $scope.roleArray = [{
                'desc': 'I'
            }, {
                'desc': 'H'
            }];

            $scope.statusArray = [{
                'desc': 'Open'
            }, {
                'desc': 'Closed'
            }];
            
            $scope.weeklyOffArray = [{
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

             $scope.closeJob = function(jobId) {
            if ($window.confirm("Are you sure, you wan\'t to close this Job?")) {
                $scope.result = "Yes";
                if (angular.isDefined(jobId) && jobId !== null) {
                    DriverJobDetails.findById({
                            id: jobId
                        },
                        function(DriverJobDetails) {
                            //console.log('update status to closed: '+JSON.stringify(DriverJobDetails));
                            DriverJobDetails.status = 'Closed';

                            DriverJobDetails.updatedBy = $localStorage.get('userId');
                            DriverJobDetails.updatedDate = new Date();
                            DriverJobDetails.$save();
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getDriverJob();
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
            } else {
                $scope.result = "No";
            }

        };

        $scope.openJob = function(jobId) {

            if ($window.confirm("Are you sure, you wan\'t to open this Job?")) {
                $scope.result = "Yes";
                if (angular.isDefined(jobId) && jobId !== null) {
                    DriverJobDetails.findById({
                            id: jobId
                        },
                        function(DriverJobDetails) {
                           // console.log('update status to open: '+JSON.stringify(DriverJobDetails));
                            DriverJobDetails.status = 'Open';
                            DriverJobDetails.OpenedDate =new Date();
                            DriverJobDetails.updatedBy = $localStorage.get('userId');
                            DriverJobDetails.updatedDate = new Date();
                            DriverJobDetails.$save();
                            $modalInstance.dismiss('cancel');
                            reloadFunc();
                            $rootScope.getDriverJob();
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
            } else {
                $scope.result = "No";
            }

        };
            $scope.verifyClientId1 = function(jobDetails) {
                $scope.isDisabledButton = true;
                //console.log('verify clientId' + JSON.stringify(jobDetails));
                 
                    $scope.updateJobDetails(jobDetails);
                 
                          
                


            };
            $scope.updateJobDetails = function(jobDetails) {

                $rootScope.loader = 1;
                var count = 0;
                console.log('job data to update' + JSON.stringify(jobDetails));
                if (angular.isUndefined(jobDetails.address) || jobDetails.address === '' || jobDetails.address === null) {
                    document.getElementById("address").style.borderColor = "red";
                    document.getElementById("address1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("address").style.borderColor = "#dde6e9";
                    document.getElementById("address1").innerHTML = '';

                }

                if (angular.isUndefined(jobDetails.carType) || jobDetails.carType === '' || jobDetails.carType === null) {
                    document.getElementById("carType").style.borderColor = "red";
                    document.getElementById("carType1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("carType").style.borderColor = "#dde6e9";
                    document.getElementById("carType1").innerHTML = '';

                }

                if (angular.isUndefined(jobDetails.dutyHours) || jobDetails.dutyHours === '' || jobDetails.dutyHours === null) {
                    document.getElementById("dutyHours").style.borderColor = "red";
                    document.getElementById("dutyHours1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                    document.getElementById("dutyHours1").innerHTML = '';

                }

                if (angular.isUndefined(jobDetails.dutyDetail) || jobDetails.dutyDetail === '' || jobDetails.dutyDetail === null) {
                    document.getElementById("dutyDetail").style.borderColor = "red";
                    document.getElementById("dutyDetail1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("dutyDetail").style.borderColor = "#dde6e9";
                    document.getElementById("dutyDetail1").innerHTML = '';

                }

                if (angular.isUndefined(jobDetails.clientId) || jobDetails.clientId === '' || jobDetails.clientId === null) {
                    document.getElementById("clientId").style.borderColor = "red";
                    document.getElementById("clientId1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("clientId").style.borderColor = "#dde6e9";
                    document.getElementById("clientId1").innerHTML = '';

                }

                 if (angular.isUndefined(jobDetails.carName) || jobDetails.carName === '' || jobDetails.carName === null) {
                    document.getElementById("carName").style.borderColor = "red";
                    document.getElementById("carName1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("carName").style.borderColor = "#dde6e9";
                    document.getElementById("carName1").innerHTML = '';
                    //customerDetails.address = null;

                }


                if (angular.isUndefined(jobDetails.outstationDays) || jobDetails.outstationDays === '' || jobDetails.outstationDays === null) {
                    document.getElementById("outstationDays").style.borderColor = "red";
                    document.getElementById("outstationDays1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("outstationDays").style.borderColor = "#dde6e9";
                    document.getElementById("outstationDays1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.driverAge) || jobDetails.driverAge === '' || jobDetails.driverAge === null) {
                    document.getElementById("driverAge").style.borderColor = "red";
                    document.getElementById("driverAge1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverAge").style.borderColor = "#dde6e9";
                    document.getElementById("driverAge1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.drivingExp) || jobDetails.drivingExp === '' || jobDetails.drivingExp === null) {
                    document.getElementById("drivingExp").style.borderColor = "red";
                    document.getElementById("drivingExp1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("drivingExp").style.borderColor = "#dde6e9";
                    document.getElementById("drivingExp1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.clientSalary) || jobDetails.clientSalary === '' || jobDetails.clientSalary === null) {
                    document.getElementById("clientSalary").style.borderColor = "red";
                    document.getElementById("clientSalary1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("clientSalary").style.borderColor = "#dde6e9";
                    document.getElementById("clientSalary1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.driverSalary) || jobDetails.driverSalary === '' || jobDetails.driverSalary === null) {
                    document.getElementById("driverSalary").style.borderColor = "red";
                    document.getElementById("driverSalary1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("driverSalary").style.borderColor = "#dde6e9";
                    document.getElementById("driverSalary1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.role) || jobDetails.role === '' || jobDetails.role === null) {
                    document.getElementById("role").style.borderColor = "red";
                    document.getElementById("role1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("role").style.borderColor = "#dde6e9";
                    document.getElementById("role1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.dutyTime) || jobDetails.dutyTime === '' || jobDetails.dutyTime === null) {
                    document.getElementById("dutyTime").style.borderColor = "red";
                    document.getElementById("dutyTime1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("dutyTime").style.borderColor = "#dde6e9";
                    document.getElementById("dutyTime1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.status) || jobDetails.status === '' || jobDetails.status === null) {
                    document.getElementById("status").style.borderColor = "red";
                    document.getElementById("status1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("status").style.borderColor = "#dde6e9";
                    document.getElementById("status1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(jobDetails.weeklyOff) || jobDetails.weeklyOff.length === 0) {
                    document.getElementById("weeklyOff").style.borderColor = "red";
                    document.getElementById("weeklyOff1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("weeklyOff").style.borderColor = "#dde6e9";
                    document.getElementById("weeklyOff1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    if(jobDetails.status==='Open'){
                       var openedDate =new Date();
                    }          
                    
                    DriverJobDetails.findById({
                            id: jobDetails.id
                        },
                        function(DriverJobDetails) {
                            DriverJobDetails.area = jobDetails.address;
                            DriverJobDetails.carType = jobDetails.carType;
                            DriverJobDetails.dutyHours = jobDetails.dutyHours;
                            DriverJobDetails.status = jobDetails.status;
                            DriverJobDetails.OpenedDate=openedDate;
                            DriverJobDetails.dutyType = jobDetails.dutyDetail;
                            DriverJobDetails.clientId = jobDetails.clientId;
                            DriverJobDetails.weeklyOff = '{' + jobDetails.weeklyOff + '}';
                            DriverJobDetails.dutyTime = jobDetails.dutyTime;
                            DriverJobDetails.outstationDays = jobDetails.outstationDays;
                            DriverJobDetails.driverAge = jobDetails.driverAge;
                            DriverJobDetails.drivingExperience = jobDetails.drivingExp;
                            DriverJobDetails.vehicleName = jobDetails.carName;
                            DriverJobDetails.clientSalary = jobDetails.clientSalary;
                            DriverJobDetails.driverSalary = jobDetails.driverSalary;
                            DriverJobDetails.role = jobDetails.role;
                            DriverJobDetails.other = jobDetails.other;
                            DriverJobDetails.location = jobDetails.location;

                            DriverJobDetails.updatedBy = $rootScope.userId;
                            DriverJobDetails.updatedDate = new Date();
                            DriverJobDetails.$save();

                            $.notify('Job updated successfully.', {
                                status: 'success'
                            });

                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButton = false;
                            reloadFunc();
                            $rootScope.getDriverJob();
                            $rootScope.loader = 0;


                        },
                        function(error) {
                            console.log('Error updating request details : ' + JSON.stringify(error));
                            $modalInstance.dismiss('cancel');
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $rootScope.loader = 0;
                        });


                }



            };
            $scope.fetchJobDetails = function() {
                var resultData = $rootScope.fetchJobData;

                for (var i = 0; i < resultData.length; i++) {


                    if (resultData[i].id == $rootScope.updateJobId) {
                        $scope.jobDetails = {
                            id: resultData[i].id,
                            clientId: resultData[i].clientId,
                            customerId: resultData[i].customerId,
                            custName: resultData[i].custName,
                            date: resultData[i].date,
                            firstName: resultData[i].firstName,
                            lastName: resultData[i].lastName,
                            email: resultData[i].email,
                            mobileNumber: resultData[i].mobile,
                            status: resultData[i].status,
                            address: resultData[i].area,
                            carType: resultData[i].carType,
                            dutyHours: resultData[i].dutyHours,
                            dutyDetail: resultData[i].dutyType,
                            createdDate: resultData[i].createdDate,
                            createdBy: resultData[i].createdBy,
                            createdByName: resultData[i].createdByName,
                            weeklyOff: resultData[i].weeklyOff,
                            weeklyOffDays: resultData[i].weeklyOffDays,
                            dutyTime: resultData[i].dutyTime,
                            outstationDays: resultData[i].outstationDays,
                            driverAge: resultData[i].driverAge,
                            drivingExp: resultData[i].drivingExp,
                            carName: resultData[i].carName,
                            clientSalary: resultData[i].clientSalary,
                            driverSalary: resultData[i].driverSalary,
                            role: resultData[i].role,
                            other: resultData[i].other,
                            location: resultData[i].location
                        };
                        //console.log('job details: ' + JSON.stringify($scope.jobDetails));
                    }
                }
            };


            $scope.closeModal = function() {

                $rootScope.updateJobId = undefined;
                $modalInstance.dismiss('cancel');
                $rootScope.getDriverJob();
            };

        };
        $scope.updateRequest = function(reqId) {
            $rootScope.jobRequestId = reqId;
            //console.log('request Id: ' + $rootScope.jobRequestId);
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
            $scope.statusArray = [{
                'desc': 'Appointed'
            }, {
                'desc': 'Rejected'
            }, {
                'desc': 'Hold'
            }, {
                'desc': 'Left'
            }, {
                'desc': 'Interview'
            }, {
                'desc': 'Applied'
            }, {
                'desc': 'Not Interested'
            }];
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

            $scope.updateRequestDetails = function(job) {
                 
                      $rootScope.loader = 1;
                //console.log('request data to update' + JSON.stringify(job));
                var remark = null;
                if (!angular.isUndefined(job.remark) || job.remark !== null || job.remark !== '') {
                    remark = job.remark;
                }
                    DriverJobRequest.DriverJobRequestCheck({
                        driverId:job.driverId,
                        jobId:job.jobId,
                        status:job.status
                    },
                    function(sssss) {
                        if(sssss[0].check_driver_job_request_status === 'Sccess'){
                                ConUsers.findById({
                        id: $rootScope.userId
                    },
                    function(ConUsers) {

                        var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                        DriverJobRequest.findById({
                                id: job.id
                            },
                            function(DriverJobRequest) {
                                 var driverJobId = DriverJobRequest.driverJobId;
                                    
                                var remarkUpdatedDate = new Date();
                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                                DriverJobRequest.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                DriverJobRequest.status = job.status;
                                DriverJobRequest.updatedBy = $rootScope.userId;
                                DriverJobRequest.updatedDate = new Date();
                                DriverJobRequest.$save();
                                
                                if(job.status==='Appointed')
                                 {
                                    DriverDetails.findOne ({
                                        driverId: DriverJobRequest.driverId
                                    },function(success){
                                        success.driverStatus = 'On Job';
                                        success.$save();
                                    },function(err){

                                    });
                                 }
                                 if(job.status === 'Left')
                                 {
                                    DriverDetails.findOne ({
                                        driverId: DriverJobRequest.driverId
                                    },function(success){
                                        success.driverStatus = 'Free';
                                        success.$save();
                                    },function(err){

                                    });
                                    
                                 }
                                //console.log('Driver request updated : ' + JSON.stringify(DriverRequestData));

                                $.notify('Request updated successfully.', {
                                    status: 'success'
                                });

                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getJobRequest();
                                $rootScope.loader = 0;


                            },
                            function(error) {
                                console.log('Error updating request details : ' + JSON.stringify(error));
                                $modalInstance.dismiss('cancel');
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $rootScope.loader = 0;
                            });

                    },
                    function(error) {
                        console.log('error ' + JSON.stringify(error));
                        $rootScope.loader = 0;
                    });
                        
                        }else{
                     $.notify(sssss[0].check_driver_job_request_status, {
                                    status: 'danger'
                                });

                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                        }
                         
                            console.log(' updating request details : ' + JSON.stringify(sssss));
                    },function(errrr){

                    });
                
                 


            };
            $scope.fetchRequestDetails = function() {
                var resultData = $rootScope.fetchJobRequestData;

                for (var i = 0; i < resultData.length; i++) {


                    if (resultData[i].id == $rootScope.jobRequestId) {
                        $scope.job = {
                            id: resultData[i].id,
                            jobId: resultData[i].jobId,
                            driverId: resultData[i].driverId,
                            drvName: resultData[i].drvName,
                            date: resultData[i].date,
                            firstName: resultData[i].firstName,
                            lastName: resultData[i].lastName,
                            contactNo: resultData[i].contactNo,
                            remark: resultData[i].remark,
                            address: resultData[i].address,
                            createdDate: resultData[i].createdDate,
                            createdBy: resultData[i].createdBy,
                            createdByName: resultData[i].createdByName,
                            status: resultData[i].status
                        };
                    }
                }
            };


            $scope.closeModal = function() {
                $rootScope.customerDetails = undefined;
                $rootScope.customerCellNo = undefined;
                $rootScope.jobRequestId = undefined;
                $modalInstance.dismiss('cancel');
                $rootScope.getJobRequest();
            };

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
                 // show first page
                 page: 1,
                count:10 // count per page

            }, {
                total: $scope.data.length,
                count:[], // length of data
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

          function createTable1() {

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
