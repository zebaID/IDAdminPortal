App.controller('manageUserCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', 'orderByFilter', '$modal', '$state', 'FileUploader', '$base64', 'ConUsers', 'Roles', '$localStorage', 'AgentDetails', 'UserRoles', 'Cities',
    function($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, orderByFilter, $modal, $state, FileUploader, $base64, ConUsers, Roles, $localStorage, AgentDetails, UserRoles, Cities) {

        'use strict';
        //fetch all the variables wich stored in local storage
       $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
   // console.log('there:' +JSON.stringify($rootScope.cities));
   $rootScope.cityAt = [];// get all cities in this scope variable
        for(var i = 0; i<$rootScope.cities.length; i++){
            
            if($rootScope.cities[i] !== 'All'){
                $rootScope.cityAt.push($rootScope.cities[i]);
            }
        }
        console.log('there:' +JSON.stringify($rootScope.cityAt));
        
        $scope.statusArray = [{
            'desc': 'Active'
        }, {
            'desc': 'Inactive'
        }];
             
          $rootScope.getUserforSelectedCity = function(city){//for admin if we change location in top drp down change operation city
            $rootScope.operationCitySelect = city;
            console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
            $scope.getUser();
            reloadFunc(); 
             
        }


         
        $rootScope.userId = $localStorage.get('userId');

        $scope.getUser = function() {//method called at ng-init
            console.log('city: '+JSON.stringify($rootScope.operationCitySelect));
            console.log('Called get user');
            $rootScope.loader = 1;
            $rootScope.userData = [];
            var allClubData = [];
            if ($rootScope.roleId === '1') {
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        AgentDetails.find({
                filter: {
                    include: {
                        relation: 'conUsers',
                        scope: {
                            include: {
                                relation: 'userRoles',
                                scope: {
                                    include: {
                                        relation: 'roles'
                                    }
                                }

                            }
                        }
                    }
                }
            }, function(agentData) {

                //console.log('agentData ' + JSON.stringify(agentData));

                for (var k = 0; k < agentData.length; k++) {
                     var name;
                     var roles = [];
                    var roleId = [];
                    var userRole = [];
                    if(!angular.isUndefined(agentData[k].conUsers)){

                       
                    if (agentData[k].conUsers.middleName === null) {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.lastName;
                    } else {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.middleName + ' ' + agentData[k].conUsers.lastName;
                    }
                
                if(!angular.isUndefined(agentData[k].conUsers.userRoles)){
                    
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roles.push(agentData[k].conUsers.userRoles[j].roles.roleDesc);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        userRole.push(agentData[k].conUsers.userRoles[j].id);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roleId.push(agentData[k].conUsers.userRoles[j].roles.id);
                    }
                    var role = '' + roles;
                }
                var status;
                if(agentData[k].conUsers.status === 'Inactive'){
                    status = 'Blocked';
                }else{
                    status = agentData[k].conUsers.status;
                }
            
                    allClubData.push({
                        id: agentData[k].id,
                        conUserId: agentData[k].conUsers.id,
                        name: name,
                        firstName: agentData[k].conUsers.firstName,
                        middleName: agentData[k].conUsers.middleName,
                        lastName: agentData[k].conUsers.lastName,
                        email: agentData[k].conUsers.email,
                        address: agentData[k].conUsers.address,
                        contactNo: agentData[k].conUsers.mobileNumber,
                        status: status,
                        role: role.replace('[', '').replace(']', '').replace('"', ''),
                        userRole: userRole,
                        roleId: roleId,
                        operationCity: agentData[k].conUsers.operationCity,
                        createdDate: agentData[k].conUsers.createdDate
                    });
                }
                }
                $rootScope.userData = allClubData;
                $scope.data = allClubData;
                $scope.orginalData = allClubData;
                 createTable();

                $rootScope.loader = 0;

            }, function(agentErr) {
                $rootScope.loader = 0;
                console.log('agentErr ' + JSON.stringify(agentErr));
                if (agentErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                    }else{
                        AgentDetails.find({
                filter: {
                    include: {
                        relation: 'conUsers',
                        scope: {
                            where:{
                                operationCity:$rootScope.operationCitySelect
                            },
                            include: {
                                relation: 'userRoles',
                                scope: {
                                    include: {
                                        relation: 'roles'
                                    }
                                }

                            }
                        }
                    }
                }
            }, function(agentData) {

                //console.log('agentData ' + JSON.stringify(agentData));

                for (var k = 0; k < agentData.length; k++) {
                     var name;
                     var roles = [];
                    var roleId = [];
                    var userRole = [];
                    if(!angular.isUndefined(agentData[k].conUsers)){

                       
                    if (agentData[k].conUsers.middleName === null) {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.lastName;
                    } else {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.middleName + ' ' + agentData[k].conUsers.lastName;
                    }
                
                if(!angular.isUndefined(agentData[k].conUsers.userRoles)){
                    
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roles.push(agentData[k].conUsers.userRoles[j].roles.roleDesc);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        userRole.push(agentData[k].conUsers.userRoles[j].id);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roleId.push(agentData[k].conUsers.userRoles[j].roles.id);
                    }
                    var role = '' + roles;
                }
                var status;
                if(agentData[k].conUsers.status === 'Inactive'){
                    status = 'Blocked';
                }else{
                    status = agentData[k].conUsers.status;
                }
            
                    allClubData.push({
                        id: agentData[k].id,
                        conUserId: agentData[k].conUsers.id,
                        name: name,
                        firstName: agentData[k].conUsers.firstName,
                        middleName: agentData[k].conUsers.middleName,
                        lastName: agentData[k].conUsers.lastName,
                        email: agentData[k].conUsers.email,
                        address: agentData[k].conUsers.address,
                        contactNo: agentData[k].conUsers.mobileNumber,
                        status: status,
                        role: role.replace('[', '').replace(']', '').replace('"', ''),
                        userRole: userRole,
                        roleId: roleId,
                        operationCity: agentData[k].conUsers.operationCity,
                        createdDate: agentData[k].conUsers.createdDate
                    });
                }
                }
                $rootScope.userData = allClubData;
                $scope.data = allClubData;
                $scope.orginalData = allClubData;
                 createTable();

                $rootScope.loader = 0;

            }, function(agentErr) {
                $rootScope.loader = 0;
                console.log('agentErr ' + JSON.stringify(agentErr));
                if (agentErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                    }
                    
                }
            }else{
                AgentDetails.find({
                filter: {
                    include: {
                        relation: 'conUsers',
                        scope: {
                            where:{
                                operationCity:$rootScope.operationCity
                            },
                            include: {
                                relation: 'userRoles',
                                scope: {
                                    include: {
                                        relation: 'roles'
                                    }
                                }

                            }
                        }
                    }
                }
            }, function(agentData) {

                //console.log('agentData ' + JSON.stringify(agentData));

                for (var k = 0; k < agentData.length; k++) {
                     var name;
                     var roles = [];
                    var roleId = [];
                    var userRole = [];
                    if(!angular.isUndefined(agentData[k].conUsers)){

                       
                    if (agentData[k].conUsers.middleName === null) {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.lastName;
                    } else {
                        name = agentData[k].conUsers.firstName + ' ' + agentData[k].conUsers.middleName + ' ' + agentData[k].conUsers.lastName;
                    }
                
                if(!angular.isUndefined(agentData[k].conUsers.userRoles)){
                    
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roles.push(agentData[k].conUsers.userRoles[j].roles.roleDesc);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        userRole.push(agentData[k].conUsers.userRoles[j].id);
                    }
                    for (var j = 0; j < agentData[k].conUsers.userRoles.length; j++) {
                        roleId.push(agentData[k].conUsers.userRoles[j].roles.id);
                    }
                    var role = '' + roles;
                }
                var status;
                if(agentData[k].conUsers.status === 'Inactive'){
                    status = 'Blocked';
                }else{
                    status = agentData[k].conUsers.status;
                }
            
                    allClubData.push({
                        id: agentData[k].id,
                        conUserId: agentData[k].conUsers.id,
                        name: name,
                        firstName: agentData[k].conUsers.firstName,
                        middleName: agentData[k].conUsers.middleName,
                        lastName: agentData[k].conUsers.lastName,
                        email: agentData[k].conUsers.email,
                        address: agentData[k].conUsers.address,
                        contactNo: agentData[k].conUsers.mobileNumber,
                        status: status,
                        role: role.replace('[', '').replace(']', '').replace('"', ''),
                        userRole: userRole,
                        roleId: roleId,
                        operationCity: agentData[k].conUsers.operationCity,
                        createdDate: agentData[k].conUsers.createdDate
                    });
                }
                }
                $rootScope.userData = allClubData;
                $scope.data = allClubData;
                $scope.orginalData = allClubData;
                 createTable();

                $rootScope.loader = 0;

            }, function(agentErr) {
                $rootScope.loader = 0;
                console.log('agentErr ' + JSON.stringify(agentErr));
                if (agentErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
            }
            

            
            

        };
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

            },function(error){
                console.log('erro in city fetching' +JSON.stringify(error))
            });
        }
        $rootScope.getAllUser = function() {
            $scope.count = 0;
            loadFunc();

        };

        function loadFunc() {
            $scope.count = 0;
            $scope.timers = setInterval(loadData, 5);


        }

        function loadData() {
            $scope.count = $scope.count + 1;
            if ($scope.count >= 4) {
                clearInterval($scope.timers);
            } else {
                $state.go($state.current, {}, {
                    reload: true
                });
                $scope.getUser();
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
                $scope.getUser();
            }
        }


        $scope.deactivate = function(conUserId) {//deactivate user
            $rootScope.loader = 1;
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
                        $rootScope.loader = 0;
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }

                    });
            }
        };
        $scope.activate = function(conUserId) {
            $rootScope.loader = 1;
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

        //$scope.getUser();

        function createTable() {//ng table

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


        $scope.newUser = function() { //to add new user
            // console.log('create popup called.' + modelAssetId);


            var modalInstance = $modal.open({
                templateUrl: '/addUser.html',
                controller: ModalUserCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };



        var ModalUserCtrl = function($scope, $rootScope, $modalInstance, FileUploader, $base64) {
            //sub controller for adding user
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }];

            Roles.find({
                filter: {
                    where: {
                        isVisible: true
                    }
                }
            }, function(roleData) {
                //console.log('roleData ' + JSON.stringify(roleData));
                var role = [];
                for (var i = 0; i < roleData.length; i++) {

                    role.push({
                        id: roleData[i].id,
                        desc: roleData[i].roleDesc
                    });
                }
                $scope.roleArray = role;
            }, function(roleErr) {
                console.log('roleErr ' + JSON.stringify(roleErr));
                $modalInstance.dismiss('cancel');
                if (roleErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });


            $("li.search-field input").val('Select Role');
            $scope.user = {};
            $scope.submitUserBtn = false;
            $scope.count = 0;

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
                                console.log('Mobile already exists : ' + JSON.stringify(response));
                            } else {
                                if (mobileNumber.length != 10) {
                                    $scope.MobileExist = true;
                                    $scope.user.cellNumber1 = 'Enter valid Mobile Number';
                                    document.getElementById("cellNumber").style.borderColor = "red";
                                    document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile Number';
                                } else {
                                    $scope.MobileExist = false;
                                    $scope.user.cellNumber1 = null;
                                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                                    document.getElementById("cellNumber1").innerHTML = '';
                                }
                            }
                        } else {
                            $scope.MobileExist = true;
                            $scope.user.cellNumber1 = 'Enter valid Mobile Number';
                            document.getElementById("cellNumber").style.borderColor = "red";
                            document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile Number';
                        }
                    },
                    function(error) {
                        console.log('Error verifying mobile : ' + JSON.stringify(error));
                        document.getElementById("cellNumber").style.borderColor = "red";
                        $scope.MobileExist = false;
                        $modalInstance.dismiss('cancel');
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
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
                                console.log('Email already exists : ' + JSON.stringify(response));
                            } else {
                                $scope.EmailExist = false;
                                $scope.user.email1 = null;
                                document.getElementById("email").style.borderColor = "#dde6e9";
                                document.getElementById("email1").innerHTML = '';
                            }
                        },
                        function(error) {
                            console.log('Error verifying email : ' + JSON.stringify(error));
                            document.getElementById("email").style.borderColor = "red";
                            $scope.EmailExist = false;
                            $modalInstance.dismiss('cancel');
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                        });
                } else {
                    $scope.EmailExist = false;
                }


            };
            $scope.addUser = function(user) {// add user
                $scope.submitUserBtn = true;
                $rootScope.loader = 1;
                console.log('userDetails: '+JSON.stringify(user));
                var count = 0;
                if (angular.isUndefined(user.firstName) || user.firstName === '') {
                    document.getElementById("firstName").style.borderColor = "red";
                    document.getElementById("firstName1").innerHTML = '*required';
                    user.firstName1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';
                    user.firstName1 = null;
                }
                if (angular.isUndefined(user.lastName) || user.lastName === '') {
                    document.getElementById("lastName").style.borderColor = "red";
                    document.getElementById("lastName1").innerHTML = '*required';
                    user.lastName1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';
                    user.lastName1 = null;
                }

                if (angular.isUndefined(user.email) || user.email === '') {
                    document.getElementById("email").style.borderColor = "red";
                    document.getElementById("email1").innerHTML = '*required';
                    user.email1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    user.email1 = null;

                }

                if (angular.isUndefined(user.cellNumber) || user.cellNumber === '') {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = '*required';
                    user.cellNumber1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                    document.getElementById("cellNumber1").innerHTML = '';
                    user.cellNumber1 = null;
                }

                if (angular.isUndefined(user.status) || user.status === '' || user.status === null) {
                    document.getElementById("status").style.borderColor = "red";
                    document.getElementById("status1").innerHTML = '*required';
                    user.status1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("status").style.borderColor = "#dde6e9";
                    document.getElementById("status1").innerHTML = '';
                    user.status1 = null;
                }
                if (angular.isUndefined(user.role) || user.role === '' || user.role === null) {
                    document.getElementById("role").style.borderColor = "red";
                    document.getElementById("role1").innerHTML = '*required';
                    user.status1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("role").style.borderColor = "#dde6e9";
                    document.getElementById("role1").innerHTML = '';
                    user.status1 = null;
                }
                if (angular.isUndefined(user.city) || user.city === '' || user.city === null) {
                    document.getElementById("city").style.borderColor = "red";
                    document.getElementById("city1").innerHTML = '*required';
                    user.city1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("city").style.borderColor = "#dde6e9";
                    document.getElementById("city1").innerHTML = '';
                    user.city1 = null;
                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $rootScope.loader = 0;
                    $scope.count = 0;
                    if ($scope.MobileExist == false && $scope.EmailExist == false) {

                        ConUsers.createAgentUser({
                            firstName: user.firstName,
                            middleName: user.middleName,
                            lastName: user.lastName,
                            mobileNumber: user.cellNumber,
                            email: user.email,
                            userId: $rootScope.userId,
                            status: user.status,
                            roleId: '[' + user.role + ']',
                            operationCity:user.city

                        }, function(customerData) {
                            //console.log('customerData ' + JSON.stringify(customerData));
                            $.notify('User created successfully.', {
                                status: 'success'
                            });
                            $rootScope.loader = 0;
                            $modalInstance.dismiss('cancel');

                            $rootScope.getAllUser();
                        }, function(customerErr) {
                            console.log('customerErr ' + JSON.stringify(customerErr));
                            $modalInstance.dismiss('cancel');
                            if (customerErr.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $rootScope.loader = 0;
                        });

                    }


                }
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };

            var uploader = $scope.uploader = new FileUploader({
                url: 'server/upload.php'
            });

            // FILTERS

            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    return this.queue.length < 10;
                }
            });

            // CALLBACKS
            var readURL = function(input) {
                console.log('Called file input');
                if (input.file) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        console.log('file size: ' + ~~((e.total) / 1024) + 'KB');

                        var logoSize = ~~((e.total) / 1024);
                        if (logoSize <= 1024) {
                            $scope.logoFlag = false;

                            $scope.updatedImg = e.target.result;
                            console.log('file options: ' + JSON.stringify(e.target.result));
                            // $('.profile-pic').attr('src', e.target.result);
                        } else {
                            $scope.updatedImg = $scope.updateLogo;

                            $scope.logoFlag = true;
                        }
                    }
                    reader.onloadend = function() {
                        console.log('file path: ' + reader.result);
                    }
                    var imgsplit = input.file.type;
                    var splitedText = imgsplit.split('/');
                    if (splitedText[0] === 'image') {
                        $scope.imgFile = false;
                        reader.readAsDataURL(input);
                    } else {
                        $scope.updatedImg = $scope.updateLogo;

                        $scope.logoFlag = false;
                        $scope.imgFile = true;
                    }
                }
            }


            $(".file-upload").on('change', function() {

            });
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                readURL(fileItem);
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

        };// end of ModalUserCtrl sub controller 

        $scope.update = function(userId) {
            // console.log('create popup called.' + modelAssetId);

            $rootScope.conUserId = userId;

            var modalInstance = $modal.open({
                templateUrl: '/updateUser.html',
                controller: ModalUpdateUserCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });




        };

        var ModalUpdateUserCtrl = function($scope, $rootScope, $modalInstance) {
            //controller for update user
            $scope.statusArray = [{
                'desc': 'Active'
            }, {
                'desc': 'Inactive'
            }];
            Roles.find({
                filter: {
                    where: {
                        isVisible: true
                    }
                }
            }, function(roleData) {
                //console.log('roleData ' + JSON.stringify(roleData));
                var role = [];
                for (var i = 0; i < roleData.length; i++) {

                    role.push({
                        id: roleData[i].id,
                        desc: roleData[i].roleDesc
                    });
                }
                $scope.roleArray = role;
                console.log('role array: '+JSON.stringify($scope.roleArray));
            }, function(roleErr) {
                console.log('roleErr ' + JSON.stringify(roleErr));
                $modalInstance.dismiss('cancel');
                if (roleErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

            $scope.user = {};
            $scope.submitUserBtn = false;
            $scope.count = 0;
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
                                console.log('Email already exists : ' + JSON.stringify(response));
                            } else {
                                $scope.EmailExist = false;
                                $scope.user.email1 = null;
                                document.getElementById("email").style.borderColor = "#dde6e9";
                                document.getElementById("email1").innerHTML = '';
                            }
                        },
                        function(error) {
                            console.log('Error verifying mobile : ' + JSON.stringify(error));
                            document.getElementById("email").style.borderColor = "red";
                            $scope.EmailExist = false;
                        });
                } else {
                    $scope.EmailExist = false;
                }


            };
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
                                document.getElementById("cellNumber1").innerHTML = 'Mobile No exist';
                                console.log('Mobile already exists : ' + JSON.stringify(response));
                            } else {
                                if (mobileNumber.length != 10) {
                                    $scope.MobileExist = true;
                                    $scope.user.cellNumber1 = 'Enter valid Mobile No';
                                    document.getElementById("cellNumber").style.borderColor = "red";
                                    document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile No';
                                } else {
                                    $scope.MobileExist = false;
                                    $scope.user.cellNumber1 = null;
                                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                                    document.getElementById("cellNumber1").innerHTML = '';
                                }
                            }
                        } else {
                            $scope.MobileExist = true;
                            $scope.user.cellNumber1 = 'Enter valid Mobile No';
                            document.getElementById("cellNumber").style.borderColor = "red";
                            document.getElementById("cellNumber1").innerHTML = 'enter valid Mobile No';
                        }
                    },
                    function(error) {
                        console.log('Error verifying mobile : ' + JSON.stringify(error));
                        document.getElementById("cellNumber").style.borderColor = "red";
                        $scope.MobileExist = false;
                    });


            };
            $scope.updateUser = function(user) {// update user
                
                $scope.submitUserBtn = true;
                $rootScope.loader = 1;

                var count = 0;
                if (angular.isUndefined(user.firstName) || user.firstName === '') {
                    document.getElementById("firstName").style.borderColor = "red";
                    document.getElementById("firstName1").innerHTML = '*required';
                    user.firstName1 = 'This value is required';

                    count++;
                } else {
                    document.getElementById("firstName").style.borderColor = "#dde6e9";
                    document.getElementById("firstName1").innerHTML = '';
                    user.firstName1 = null;
                }
                if (angular.isUndefined(user.lastName) || user.lastName === '') {
                    document.getElementById("lastName").style.borderColor = "red";
                    document.getElementById("lastName1").innerHTML = '*required';
                    user.lastName1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("lastName").style.borderColor = "#dde6e9";
                    document.getElementById("lastName1").innerHTML = '';
                    user.lastName1 = null;
                }

                if (angular.isUndefined(user.email) || user.email === '') {
                    document.getElementById("email").style.borderColor = "red";
                    document.getElementById("email1").innerHTML = '*required';
                    user.email1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    user.email1 = null;

                }

                if (angular.isUndefined(user.cellNumber) || user.cellNumber === '') {
                    document.getElementById("cellNumber").style.borderColor = "red";
                    document.getElementById("cellNumber1").innerHTML = '*required';
                    user.cellNumber1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                    document.getElementById("cellNumber1").innerHTML = '';
                    user.cellNumber1 = null;
                }

                if (angular.isUndefined(user.status) || user.status === '' || user.status === null) {
                    document.getElementById("status").style.borderColor = "red";
                    document.getElementById("status1").innerHTML = '*required';
                    user.status1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("status").style.borderColor = "#dde6e9";
                    document.getElementById("status1").innerHTML = '';
                    user.status1 = null;
                }

                if (angular.isUndefined(user.role) || user.role.length === 0) {
                    document.getElementById("role").style.borderColor = "red";
                    document.getElementById("role1").innerHTML = '*required';
                    user.status1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("role").style.borderColor = "#dde6e9";
                    document.getElementById("role1").innerHTML = '';
                    user.status1 = null;
                }
                if (angular.isUndefined(user.operationCity) || user.operationCity === '' || user.operationCity === null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("city1").innerHTML = '*required';
                    user.city1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("city1").innerHTML = '';
                    user.city1 = null;
                }

                if (count > 0) {
                    $scope.count = count;
                    $scope.submitUserBtn = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $rootScope.loader = 0;

                    $scope.count = 0;
                    ConUsers.findById({
                            id: $rootScope.conUserId
                        },
                        function(ConUsers) {
                            ConUsers.firstName = user.firstName;
                            ConUsers.middleName = user.middleName;
                            ConUsers.lastName = user.lastName;
                            ConUsers.status = user.status;
                            ConUsers.operationCity = user.operationCity;
                            ConUsers.updatedBy = $localStorage.get('userId');
                            ConUsers.updatedDate = new Date();
                            ConUsers.$save();
                            console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers));

                            $rootScope.loader = 0;

                            for (var j = 0; j < $scope.user.userRole.length; j++) {
                                UserRoles.deleteById({
                                    id: $scope.user.userRole[j]
                                }, function(userRolesData) {
                                    //console.log('userRolesData ' + JSON.stringify(userRolesData));
                                }, function(userRolesErr) {
                                    console.log('userRolesErr ' + JSON.stringify(userRolesErr));
                                });
                            }
                            var userRoleStatus;
                            for (var j = 0; j < user.role.length; j++) {
                                if (user.role[j] == 1) {
                                    userRoleStatus = true;
                                }
                            }
                            if (userRoleStatus == true) {
                                UserRoles.create({
                                    conuserId: $rootScope.conUserId,
                                    roleId: 1
                                }, function(userRolesData) {
                                    //console.log('userRolesData ' + JSON.stringify(userRolesData));
                                }, function(userRolesErr) {
                                    console.log('userRolesErr ' + JSON.stringify(userRolesErr));
                                });
                            } else {
                                for (var j = 0; j < user.role.length; j++) {
                                    UserRoles.create({
                                        conuserId: $rootScope.conUserId,
                                        roleId: user.role[j]
                                    }, function(userRolesData) {
                                        //console.log('userRolesData ' + JSON.stringify(userRolesData));
                                    }, function(userRolesErr) {
                                        console.log('userRolesErr ' + JSON.stringify(userRolesErr));
                                    });
                                }
                            }


                            $.notify('User updated successfully.', {
                                status: 'success'
                            });

                            $modalInstance.dismiss('cancel');

                            $rootScope.getAllUser();


                        },
                        function(error) {
                            console.log('Error updating user : ' + JSON.stringify(error));
                            $modalInstance.dismiss('cancel');
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $rootScope.loader = 0;
                        });

                }
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.fetchUserDetails = function() {
                  Cities.find({

            },function(success){
                console.log('select cities :' +JSON.stringify(success));
                $rootScope.cities =[];
                for(var i = 0; i< success.length ; i++){
                    if(success[i].cityName !== null){
                      $rootScope.cities.push(success[i].cityName);  
                    }
                    
                }
                var resultData = $rootScope.userData;
                for (var i = 0; i < resultData.length; i++) {
                    var status;
                    if(resultData[i].status === 'Blocked'){
                        status = 'Inactive';
                    }else{
                        status = resultData[i].status;
                    }
                    var city;
                    if(resultData[i].operationCity !== null){
                      for(var l=0;l<$rootScope.cities.length; l++){
                      if(resultData[i].operationCity === $rootScope.cities[l]){
                        city = $rootScope.cities[l];
                    }   
                    }  
                }else{
                    city = '';
                }
                    
                    

                    if (resultData[i].conUserId == $rootScope.conUserId) {
                        $scope.user = {
                            firstName: resultData[i].firstName,
                            middleName: resultData[i].middleName,
                            lastName: resultData[i].lastName,
                            email: resultData[i].email,
                            cellNumber: resultData[i].contactNo,
                            status: status,
                            role: resultData[i].roleId,
                            userRole: resultData[i].userRole,
                            operationCity: resultData[i].operationCity
                        };
                        
                        console.log('$scope.user ' + JSON.stringify($scope.user));
                    }
                }

            },function(error){
                console.log('erro in city fetching' +JSON.stringify(error))
            });
                
            };

            $scope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };

        };// end of sub controller ModalUpdateUserCtrl
    }
]).directive('numbersOnly', function() {
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
}).directive('allowPattern', [allowPatternDirective]);

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
