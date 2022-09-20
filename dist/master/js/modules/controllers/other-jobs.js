App.controller('otherJobsCtrl', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', '$localStorage', '$state', 'DriverJobDetails', 'DriverJobRequest', 'ConUsers', 'CustomerDetails', 'DriverDetails', 'UserRoles', 'orderByFilter', '$modal', '$http', '$window', 'OtherJobsDetails','OtherUser','OtherJobsRequest',
    function ($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
        $cookieStore, $localStorage, $state, DriverJobDetails, DriverJobRequest, ConUsers, CustomerDetails, DriverDetails, UserRoles, orderByFilter, $modal, $http, $window, OtherJobsDetails,OtherUser,OtherJobsRequest) {
        'use strict';

        
        $scope.Expand = function(obj){
            if (!obj.savesize) obj.savesize=obj.size;
            obj.size=Math.max(obj.savesize,obj.value.length);
           }

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
       
       
        $scope.gotoReport1 = function () {
            var allJobData = [];
            if(angular.isUndefined($rootScope.operationCitySelect)){
                $rootScope.operationCitySelect="All";
            }
    
            //fetch all job reports.
            OtherJobsDetails.getOtherJobOpenReport({
                operationCity:$rootScope.operationCitySelect

            },
                function (jobData) {
                    // $scope.jobData=success;
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
                        var Days = '' + weekDays;
                        var orderStatus;
                        if (!angular.isUndefined(jobData[i].status) || jobData[i].status !== null || jobData[i].status !== '') {
                            if (jobData[i].status === 'Open') {
                                orderStatus = 'A';
                            } else if (jobData[i].status === 'Closed') {
                                orderStatus = 'B';
                            }
                        }
                        allJobData.push({
                            id: jobData[i].id,
                            
                            alternateNumber:jobData[i].alternate_number,
                            jobReportingAddress: jobData[i].job_reporting_address,
                            designation: jobData[i].designation,
                            jobProfile: jobData[i].job_profile,
                            dutyTime: jobData[i].duty_time,
                            age: jobData[i].age,
                            education: jobData[i].education,
                            experience: jobData[i].experience,
                            salaryRange: jobData[i].salary_range,
                            remark: jobData[i].remark,
                            jobStatusOrder: orderStatus,
                            customerId: jobData[i].customer_id,
                            weeklyOff: weekDaysId,
                            weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            status: jobData[i].status,
                            
                            custName: jobData[i].name,
                            firstName: jobData[i].first_name,
                            lastName: jobData[i].last_name,
                            mobile: jobData[i].mobile_number,
                            date: createdDate,
                            email: jobData[i].email,
                            operationCity:jobData[i].operation_city,
                            createdByName:jobData[i].created_by_name

                            

                        });



                    }
                    $rootScope.fetchJobData1 = allJobData;
                    $scope.data = allJobData;
                    // console.log('All Job Data' + JSON.stringify($scope.data));
                    createTable1();
                    $rootScope.loader = 0;

                },
                function (error) {

                })

        }

        function createTable1() {

            if ($scope.data.length > 1) {
                $scope.tableParams3 = new ngTableParams({
                    //page: 1, // show first page
                    count: $scope.data.length  // count per page

                }, {
                    total: $scope.data.length, // length of data
                    counts: [],
                    getData: function ($defer, params) {
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
            } else {
                $scope.tableParams3 = new ngTableParams({
                    page: 1, // show first page
                    count: 50 // count per page

                }, {
                    total: $scope.data.length, // length of data
                    getData: function ($defer, params) {
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


        //         $scope.call = function () {
        // $window.alert('hi');
        //         }
        $rootScope.gotoReport = function () {
            $rootScope.AllReport = false;
            $rootScope.customerDetails = undefined;
            $state.go('app.otherJobsReport');


        };
        $scope.addJob = function () {

            var modalInstance = $modal.open({
                templateUrl: '/addJob.html',
                controller: addJobCtrl
            });


            var state = $('#modal-state');
            modalInstance.result.then(function () {
                state.text('Modal dismissed with OK status');
            }, function () {
                state.text('Modal dismissed with Cancel status');
            });
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


        var addJobCtrl = function ($scope, $rootScope, $modalInstance, $state) {

           

            $scope.designation = [{
                'desc': 'Accountant'
            }, {
                'desc': 'Sales & Marketing'
            }, {
                'desc': 'Back Office'
            }, {
                'desc': 'HR'
            }, {
                'desc': 'Admin'
            }, {
                'desc': 'Telecaller'
            }, {
                'desc': 'Other'
            }
            ];
            
            $scope.operationCity = [{
                'desc': 'Pune'
            }, {
                'desc': 'Mumbai'
            }, {
                'desc': 'Aurangabad'
            }
            ];
            $scope.salaryRange = [{
                'desc': '5000-10000'
            }, {
                'desc': '10000-20000'
            }, {
                'desc': '20K-30K'
            }, {
                'desc': '30k-35k'
            }, {
                'desc': 'Other'
            }
            ];
            $scope.age = [{
                'desc': '16-20yrs'
            }, {
                'desc': '21-25yrs'
            }, {
                'desc': '26-30yrs'
            }, {
                'desc': '31-35yrs'
            },
            {
                'desc': '36-40yrs'
            }, {
                'desc': 'Other'
            }
            ];

            $scope.weekOffArray = [{
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
            //     //console.log('weeklyOffArray: ' + JSON.stringify($scope.weeklyOffArray));
            //     $("li.search-field input").val('Select Day');

            $scope.verifyMobile = function () {
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
                }, function (custSuccess) {
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
                }, function (custErr) {
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

            $scope.addNewJob = function () {

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
                    modalInstance.result.then(function () {
                        state.text('Modal dismissed with OK status');
                    }, function () {
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
            $scope.mobileSelected = function () {

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
                    function (custData) {
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
                    function (error) {
                        console.log('error ' + JSON.stringify(error));
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');

                        }
                    });
            }

            $scope.getCustomerMobileDetails = function (customerMobile) {

                $rootScope.loader = 1;
                if ($rootScope.roleId === '1') {
                    if ($rootScope.operationCitySelect === 'All') {
                        CustomerDetails.getCustomers({
                            operationCity: $rootScope.operationCitySelect
                        }, function (customerData) {
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
                            function (custErr) {
                                console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                                if (custErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');

                                }
                                $rootScope.loader = 0;
                            });
                    } else {
                        CustomerDetails.getCustomers({
                            operationCity: $rootScope.operationCitySelect
                        }, function (customerData) {
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
                            function (custErr) {
                                console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                                if (custErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');

                                }
                                $rootScope.loader = 0;
                            });
                    }
                } else {
                    CustomerDetails.getCustomers({
                        operationCity: $rootScope.operationCity
                    }, function (customerData) {
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
                        function (custErr) {
                            console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                            if (custErr.status == 0) {
                                window.alert('Oops! You are disconnected from server.');

                            }
                            $rootScope.loader = 0;
                        });
                }

            };

           
            $scope.verifyEmailFunction = function (customerDetails) {
                var currentUserId = parseInt($rootScope.customerDetails.conUserId);
                $scope.isDisabledButton = true;
                ConUsers.find({
                    filter: {
                        where: {
                            email: customerDetails.email
                        }

                    }
                }, function (custSuccess) {
                    //console.log('custSuccess***' + JSON.stringify(custSuccess));
                    if (custSuccess.length > 0) {

                        if (custSuccess[0].id === currentUserId) {
                            document.getElementById("email").style.borderColor = "#dde6e9";
                            document.getElementById("email1").innerHTML = '';
                            //$scope.verifyClientId(customerDetails);
                            $scope.addJobForDriver(customerDetails);
                        } else {
                            document.getElementById("email").style.borderColor = "red";
                            document.getElementById("email1").innerHTML = 'Email exist';
                            $scope.isDisabledButton = false;
                            return false;
                        }

                    } else {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        // $scope.verifyClientId(customerDetails);
                        $scope.addJobForDriver(customerDetails);
                    }

                }, function (custErr) {
                    console.log('custErr***' + JSON.stringify(custErr));
                    $scope.isDisabledButton = false;
                    if (custErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                });
            }

            // $scope.verifyClientId = function (customerDetails) {

            //     //console.log('driver verify code' + JSON.stringify(driver));
            //     if (angular.isUndefined(customerDetails.customerId) || customerDetails.customerId === '') {
            //         $scope.addJobForDriver(customerDetails);
            //     } else {

            //         OtherJobsDetails.find({
            //             filter: {
            //                 where: {
            //                     customerId: customerDetails.customerId
            //                 }

            //             }
            //         }, function (customerIdSuccess) {
            //             //console.log('clientIdSuccess***' + JSON.stringify(clientIdSuccess));

            //             if (customerIdSuccess.length > 0) {


            //                 document.getElementById("customerId").style.borderColor = "red";
            //                 document.getElementById("customerId1").innerHTML = 'Client Id exist';
            //                 $scope.isDisabledButton = false;
            //                 return false;



            //             } else {
            //                 document.getElementById("customerId").style.borderColor = "#dde6e9";
            //                 document.getElementById("customerId").innerHTML = '';
            //                 $scope.addJobForDriver(customerDetails);
            //             }

            //         }, function (customerIdErr) {
            //             console.log('customerIdErr***' + JSON.stringify(clientIdErr));
            //             $scope.isDisabledButton = false;
            //             $modalInstance.dismiss('cancel');
            //             if (clientIdErr.status == 0) {
            //                 window.alert('Oops! You are disconnected from server.');
            //                 $state.go('page.login');
            //             }

            //         });
            //     }


            // };

            $scope.addJobForDriver = function (customerDetails) {
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

                // if (angular.isUndefined(customerDetails.alternateMobileNumber) || customerDetails.alternateMobileNumber === '' || customerDetails.alternateMobileNumber === null) {
                //     document.getElementById("alternateMobileNumber").style.borderColor = "red";
                //     document.getElementById("alternateMobileNumber1").innerHTML = '*required';
                //     //customerDetails.address = 'This value is required';
                //     count++;
                // } else {


                //     document.getElementById("alternateMobileNumber").style.borderColor = "#dde6e9";
                //     document.getElementById("alternateMobileNumber1").innerHTML = '';
                //     //customerDetails.address = null;

                // }

                if (angular.isUndefined(customerDetails.reportingAddress) || customerDetails.reportingAddress === '' || customerDetails.reportingAddress === null) {
                    document.getElementById("reportingAddress").style.borderColor = "red";
                    document.getElementById("reportingAddress1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("reportingAddress").style.borderColor = "#dde6e9";
                    document.getElementById("reportingAddress1").innerHTML = '';
                    //customerDetails.address = null;

                }

                // if (angular.isUndefined(customerDetails.dutyHours) || customerDetails.dutyHours === '' || customerDetails.dutyHours === null) {
                //     document.getElementById("dutyHours").style.borderColor = "red";
                //     document.getElementById("dutyHours1").innerHTML = '*required';
                //     //customerDetails.address = 'This value is required';
                //     count++;
                // } else {
                //     document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                //     document.getElementById("dutyHours1").innerHTML = '';
                //     //customerDetails.address = null;

                // }

                if (angular.isUndefined(customerDetails.designation) || customerDetails.designation === '' || customerDetails.designation === null) {
                    document.getElementById("designation").style.borderColor = "red";
                    document.getElementById("designation1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("designation").style.borderColor = "#dde6e9";
                    document.getElementById("designation1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.age) || customerDetails.age === '' || customerDetails.age === null) {
                    document.getElementById("age").style.borderColor = "red";
                    document.getElementById("age1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("age").style.borderColor = "#dde6e9";
                    document.getElementById("age1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.jobProfile) || customerDetails.jobProfile === '' || customerDetails.jobProfile === null) {
                    document.getElementById("jobProfile").style.borderColor = "red";
                    document.getElementById("jobProfile1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("jobProfile").style.borderColor = "#dde6e9";
                    document.getElementById("jobProfile1").innerHTML = '';
                    //customerDetails.address = null;

                }


                if (angular.isUndefined(customerDetails.education) || customerDetails.education === '' || customerDetails.education === null) {
                    document.getElementById("education").style.borderColor = "red";
                    document.getElementById("education1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("education").style.borderColor = "#dde6e9";
                    document.getElementById("education1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.experience) || customerDetails.experience === '' || customerDetails.experience === null) {
                    document.getElementById("experience").style.borderColor = "red";
                    document.getElementById("experience1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("experience").style.borderColor = "#dde6e9";
                    document.getElementById("experience1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.weekOff) || customerDetails.weekOff === '' || customerDetails.weekOff === null) {
                    document.getElementById("weekOff").style.borderColor = "red";
                    document.getElementById("weekOff1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("weekOff").style.borderColor = "#dde6e9";
                    document.getElementById("weekOff1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.dutyTimings) || customerDetails.dutyTimings === '' || customerDetails.dutyTimings === null) {
                    document.getElementById("dutyTimings").style.borderColor = "red";
                    document.getElementById("dutyTimings1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("dutyTimings").style.borderColor = "#dde6e9";
                    document.getElementById("dutyTimings1").innerHTML = '';
                    //customerDetails.address = null;

                }

                if (angular.isUndefined(customerDetails.salaryRange) || customerDetails.salaryRange === '' || customerDetails.salaryRange === null) {
                    document.getElementById("salaryRange").style.borderColor = "red";
                    document.getElementById("salaryRange1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("salaryRange").style.borderColor = "#dde6e9";
                    document.getElementById("salaryRange1").innerHTML = '';
                    //customerDetails.address = null;

                }
                if (angular.isUndefined(customerDetails.operationCity) || customerDetails.operationCity === '' || customerDetails.operationCity === null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*required';
                    //customerDetails.address = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("operationCity1").innerHTML = '';
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

                        OtherJobsDetails.createNewOtherJob({
                            alternateNumber: customerDetails.alternateMobileNumber,
                            jobReportingAddress: customerDetails.reportingAddress,
                            designation: customerDetails.designation,
                            jobProfile: customerDetails.jobProfile,
                            dutyTime: customerDetails.dutyTimings,
                            age: customerDetails.age,
                            education: customerDetails.education,
                            experience: customerDetails.experience,
                            salaryRange: customerDetails.salaryRange,
                            remark: customerDetails.remark,
                            status: 'Open',
                            customerId: customerDetails.customerId,
                            weeklyOff: '{' + customerDetails.weekOff + '}',
                            createdBy: $rootScope.userId,
                            operationCity:customerDetails.operationCity




                        }, function (success) {
                            console.log('New job success :' + JSON.stringify(success));
                            if (success[0].create_new_other_job === 'Success') {
                                $.notify('New Job is added successfully.', {
                                    status: 'success'
                                });
                                $rootScope.customerDetails = undefined;
                                $rootScope.customerCellNo = undefined;

                                $modalInstance.dismiss('cancel');
                                $scope.isDisabledButton = false;

                                reloadFunc();
                                $rootScope.gotoReport();
                                $rootScope.loader = 0;
                            }


                        }, function (err) {
                            console.log('new job creation err ' + JSON.stringify(err));
                            $scope.isDisabledButton = false;
                            if (err.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;

                        });

                    }
                    else {
                        // if ($rootScope.roleId === '1') {
                        //     if (!angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect !== null) {
                        //         ConUsers.createCustomer({
                        //             firstName: customerDetails.firstName,
                        //             middleName: customerDetails.middleName,
                        //             lastName: customerDetails.lastName,
                        //             mobileNumber: customerDetails.mobileNumber,
                        //             email: customerDetails.email,
                        //             password: customerDetails.mobileNumber,
                        //             address: '',
                        //             addressLine2: customerDetails.address,
                        //             userId: $rootScope.userId,
                        //             status: 'Active',
                        //             customerType: 'R',
                        //             operationCity: $rootScope.operationCitySelect

                        //         }, function (customerData) {
                        //             //console.log('customerData ' + JSON.stringify(customerData));
                        //             OtherJobsDetails.createNewOtherJob({
                        //                 alternateNumber: customerDetails.alternateMobileNumber,
                        //                 jobReportingAddress: customerDetails.reportingAddress,
                        //                 designation: customerDetails.designation,
                        //                 jobProfile: customerDetails.jobProfile,
                        //                 dutyTime: customerDetails.dutyTimings,
                        //                 age: customerDetails.age,
                        //                 education: customerDetails.education,
                        //                 experience: customerDetails.experience,
                        //                 salaryRange: customerDetails.salaryRange,
                        //                 remark: customerDetails.remark,
                        //                 status: "new",
                        //                 customerId: customerDetails.customerId,
                        //                 weeklyOff: '{' + customerDetails.weeklyOff + '}',
                        //                 createdBy:$rootScope.userId

                        //             }, function (success) {
                        //                 //console.log('New job success :' + JSON.stringify(success));
                        //                 if (success[0].create_new_job === 'Success') {
                        //                     $.notify('New Job is added successfully.', {
                        //                         status: 'success'
                        //                     });
                        //                     $rootScope.customerDetails = undefined;
                        //                     $rootScope.customerCellNo = undefined;

                        //                     $modalInstance.dismiss('cancel');
                        //                     $scope.isDisabledButton = false;

                        //                     reloadFunc();
                        //                     // $rootScope.getDriverJob();
                        //                     $rootScope.loader = 0;
                        //                 }


                        //             }, function (err) {
                        //                 console.log('new job creation err ' + JSON.stringify(err));
                        //                 $scope.isDisabledButton = false;
                        //                 if (err.status == 0) {
                        //                     window.alert('Oops! You are disconnected from server.');
                        //                     $state.go('page.login');
                        //                 }
                        //                 $modalInstance.dismiss('cancel');
                        //                 $rootScope.loader = 0;

                        //             });

                        //         }, function (customerErr) {
                        //             console.log('customerErr ' + JSON.stringify(customerErr));
                        //             $scope.isDisabledButton = false;
                        //             if (customerErr.status == 0) {
                        //                 window.alert('Oops! You are disconnected from server.');
                        //                 $state.go('page.login');
                        //             }
                        //             $modalInstance.dismiss('cancel');
                        //             $rootScope.loader = 0;

                        //         });

                        //     }
                        // } else {
                        //     ConUsers.createCustomer({
                        //         firstName: customerDetails.firstName,
                        //         middleName: customerDetails.middleName,
                        //         lastName: customerDetails.lastName,
                        //         mobileNumber: customerDetails.mobileNumber,
                        //         email: customerDetails.email,
                        //         password: customerDetails.mobileNumber,
                        //         address: '',
                        //         addressLine2: customerDetails.address,
                        //         userId: $rootScope.userId,
                        //         status: 'Active',
                        //         customerType: 'R',
                        //         operationCity: $rootScope.operationCity

                        //     }, function (customerData) {
                        //         //console.log('customerData ' + JSON.stringify(customerData));
                        //         OtherJobsDetails.createNewOtherJob({
                        //             alternateNumber: customerDetails.alternateMobileNumber,
                        //             jobReportingAddress: customerDetails.reportingAddress,
                        //             designation: customerDetails.designation,
                        //             jobProfile: customerDetails.jobProfile,
                        //             dutyTime: customerDetails.dutyTimings,
                        //             age: customerDetails.age,
                        //             education: customerDetails.education,
                        //             experience: customerDetails.experience,
                        //             salaryRange: customerDetails.salaryRange,
                        //             remark: customerDetails.remark,
                        //             status: "new",
                        //             customerId: customerDetails.customerId,
                        //             weeklyOff: '{' + customerDetails.weeklyOff + '}',
                        //             createdBy:$rootScope.userId

                        //         }, function (success) {
                        //             //console.log('New job success :' + JSON.stringify(success));
                        //             if (success[0].create_new_job === 'Success') {
                        //                 $.notify('New Job is added successfully.', {
                        //                     status: 'success'
                        //                 });
                        //                 $rootScope.customerDetails = undefined;
                        //                 $rootScope.customerCellNo = undefined;

                        //                 $modalInstance.dismiss('cancel');
                        //                 $scope.isDisabledButton = false;

                        //                 reloadFunc();
                        //                 // $rootScope.getDriverJob();
                        //                 $rootScope.loader = 0;
                        //             }


                        //         }, function (err) {
                        //             console.log('new job creation err ' + JSON.stringify(err));
                        //             $scope.isDisabledButton = false;
                        //             if (err.status == 0) {
                        //                 window.alert('Oops! You are disconnected from server.');
                        //                 $state.go('page.login');
                        //             }
                        //             $modalInstance.dismiss('cancel');
                        //             $rootScope.loader = 0;

                        //         });

                        //     }, function (customerErr) {
                        //         console.log('customerErr ' + JSON.stringify(customerErr));
                        //         $scope.isDisabledButton = false;
                        //         if (customerErr.status == 0) {
                        //             window.alert('Oops! You are disconnected from server.');
                        //             $state.go('page.login');
                        //         }
                        //         $modalInstance.dismiss('cancel');
                        //         $rootScope.loader = 0;

                        //     });

                        // }
                        console.log("create new user");


                    }

                }
            };


            $scope.closeModal = function () {
                $rootScope.customerDetails = undefined;
                $rootScope.customerCellNo = undefined;
                $modalInstance.dismiss('cancel');
                //$rootScope.getDriverJob();
            };
            $scope.backToSearchReport = function () {
                $localStorage.put('customerId', undefined);
                $localStorage.put('Area', undefined);
                $state.go('app.searchJob');

            };

        };


        var updateJobCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
       

            $scope.designation = [{
                'desc': 'Accountant'
            }, {
                'desc': 'Sales & Marketing'
            }, {
                'desc': 'Back Office'
            }, {
                'desc': 'HR'
            }, {
                'desc': 'Admin'
            }, {
                'desc': 'Telecaller'
            }, {
                'desc': 'Other'
            }
            ];

            $scope.experience = [{
                'desc': '0'
            }, {
                'desc': '1-2yrs'
            }, {
                'desc': '2-3yrs'
            }, {
                'desc': '3yrs>'
            }
            ];
            $scope.salaryRange = [{
                'desc': '5000-10000'
            }, {
                'desc': '10000-20000'
            }, {
                'desc': '20K-30K'
            }, {
                'desc': '30k-35k'
            }, {
                'desc': 'Other'
            }
            ];
            $scope.age = [{
                'desc': '16-20yrs'
            }, {
                'desc': '21-25yrs'
            }, {
                'desc': '26-30yrs'
            }, {
                'desc': '31-35yrs'
            },
            {
                'desc': '36-40yrs'
            }, {
                'desc': 'Other'
            }
            ];

            
            $scope.weekOffArray = [{
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

            $scope.statusArray = [{
                'desc': 'Open'
            }, {
                'desc': 'Closed'
            }];
            $scope.operationCity = [{
                'desc': 'Pune'
            }, {
                'desc': 'Mumbai'
            }, {
                'desc': 'Aurangabad'
            }
            ];
        //     //console.log('weeklyOffArray: ' + JSON.stringify($scope.weeklyOffArray));
        //     $scope.getSearchResult = function(searchText) {
        //         var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=' + ENV.googlePlacesAPIKey;
        //         $http.get(url)
        //             .then(function successCallback(response) {
        //                 if (angular.isDefined(response.data.predictions))
        //                     console.log('search results : ' + JSON.stringify(response.data.predictions));
        //                 $scope.searchResult = response.data.predictions;
        //             }, function errorCallback(response) {
        //                 console.log('search place error : ' + JSON.stringify(response));
        //             });
        //     };
        //     $scope.toggleMin = function() {
        //         var maximumDate = new Date();
        //         var currentYear = maximumDate.getFullYear();
        //         var currentMonth = maximumDate.getMonth();
        //         var currentDate = maximumDate.getDate();
        //         $scope.maxDate = $scope.maxDate ? null : new Date(currentYear, currentMonth, currentDate + 15);
        //     };
        //     $scope.toggleMin();
        //     $scope.openToDate = false;
        //     $scope.openedStart = false;
        //     $scope.openStart = function($event) {

        //         $event.preventDefault();
        //         $event.stopPropagation();
        //         $scope.openedStart = true;
        //         $scope.openToDate = false;

        //     };

        //     $scope.openedToDate = function($event) {

        //         $event.preventDefault();
        //         $event.stopPropagation();
        //         $scope.openToDate = true;
        //         $scope.openedStart = false;

        //     };

        //     $scope.dateOptions = {
        //         formatYear: 'yy',
        //         startingDay: 1
        //     };

        //     $scope.ismeridian = true;
        //     $scope.toggleMode = function() {
        //         $scope.ismeridian = !$scope.ismeridian;
        //     };

        //      $scope.closeJob = function(jobId) {
        //     if ($window.confirm("Are you sure, you wan\'t to close this Job?")) {
        //         $scope.result = "Yes";
        //         if (angular.isDefined(jobId) && jobId !== null) {
        //             DriverJobDetails.findById({
        //                     id: jobId
        //                 },
        //                 function(DriverJobDetails) {
        //                     //console.log('update status to closed: '+JSON.stringify(DriverJobDetails));
        //                     DriverJobDetails.status = 'Closed';

        //                     DriverJobDetails.updatedBy = $localStorage.get('userId');
        //                     DriverJobDetails.updatedDate = new Date();
        //                     DriverJobDetails.$save();
        //                     $modalInstance.dismiss('cancel');
        //                     reloadFunc();
        //                     $rootScope.getDriverJob();
        //                     $rootScope.loader = 0;

        //                 },
        //                 function(error) {
        //                     console.log('Error updating User : ' + JSON.stringify(error));
        //                     if (error.status == 0) {
        //                         window.alert('Oops! You are disconnected from server.');
        //                         $state.go('page.login');
        //                     }
        //                     $rootScope.loader = 0;
        //                 });
        //         }
        //     } else {
        //         $scope.result = "No";
        //     }

        // };

        // $scope.openJob = function(jobId) {

        //     if ($window.confirm("Are you sure, you wan\'t to open this Job?")) {
        //         $scope.result = "Yes";
        //         if (angular.isDefined(jobId) && jobId !== null) {
        //             DriverJobDetails.findById({
        //                     id: jobId
        //                 },
        //                 function(DriverJobDetails) {
        //                    // console.log('update status to open: '+JSON.stringify(DriverJobDetails));
        //                     DriverJobDetails.status = 'Open';

        //                     DriverJobDetails.updatedBy = $localStorage.get('userId');
        //                     DriverJobDetails.updatedDate = new Date();
        //                     DriverJobDetails.$save();
        //                     $modalInstance.dismiss('cancel');
        //                     reloadFunc();
        //                     $rootScope.getDriverJob();
        //                     $rootScope.loader = 0;
        //                 },
        //                 function(error) {
        //                     console.log('Error updating User : ' + JSON.stringify(error));
        //                     if (error.status == 0) {
        //                         window.alert('Oops! You are disconnected from server.');
        //                         $state.go('page.login');
        //                     }
        //                     $rootScope.loader = 0;
        //                 });
        //         }
        //     } else {
        //         $scope.result = "No";
        //     }

        // };
            $scope.verifyClientId1 = function(customerDetails) {
                $scope.isDisabledButton = true;
                //console.log('verify clientId' + JSON.stringify(jobDetails));
                 
                    $scope.updateJobDetails(customerDetails);
                 
                          
                


            };
            $scope.updateJobDetails = function(customerDetails) {
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

            

            if (angular.isUndefined(customerDetails.reportingAddress) || customerDetails.reportingAddress === '' || customerDetails.reportingAddress === null) {
                document.getElementById("reportingAddress").style.borderColor = "red";
                document.getElementById("reportingAddress1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("reportingAddress").style.borderColor = "#dde6e9";
                document.getElementById("reportingAddress1").innerHTML = '';
                //customerDetails.address = null;

            }

            

            if (angular.isUndefined(customerDetails.designation) || customerDetails.designation === '' || customerDetails.designation === null) {
                document.getElementById("designation").style.borderColor = "red";
                document.getElementById("designation1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("designation").style.borderColor = "#dde6e9";
                document.getElementById("designation1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.age) || customerDetails.age === '' || customerDetails.age === null) {
                document.getElementById("age").style.borderColor = "red";
                document.getElementById("age1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("age").style.borderColor = "#dde6e9";
                document.getElementById("age1").innerHTML = '';
                //customerDetails.address = null;

            }

            if (angular.isUndefined(customerDetails.jobProfile) || customerDetails.jobProfile === '' || customerDetails.jobProfile === null) {
                document.getElementById("jobProfile").style.borderColor = "red";
                document.getElementById("jobProfile1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("jobProfile").style.borderColor = "#dde6e9";
                document.getElementById("jobProfile1").innerHTML = '';
                //customerDetails.address = null;

            }


            if (angular.isUndefined(customerDetails.education) || customerDetails.education === '' || customerDetails.education === null) {
                document.getElementById("education").style.borderColor = "red";
                document.getElementById("education1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("education").style.borderColor = "#dde6e9";
                document.getElementById("education1").innerHTML = '';
                //customerDetails.address = null;

            }

            if (angular.isUndefined(customerDetails.experience) || customerDetails.experience === '' || customerDetails.experience === null) {
                document.getElementById("experience").style.borderColor = "red";
                document.getElementById("experience1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("experience").style.borderColor = "#dde6e9";
                document.getElementById("experience1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.weekOff) || customerDetails.weekOff === '' || customerDetails.weekOff === null) {
                document.getElementById("weekOff").style.borderColor = "red";
                document.getElementById("weekOff1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("weekOff").style.borderColor = "#dde6e9";
                document.getElementById("weekOff1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.dutyTimings) || customerDetails.dutyTimings === '' || customerDetails.dutyTimings === null) {
                document.getElementById("dutyTimings").style.borderColor = "red";
                document.getElementById("dutyTimings1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("dutyTimings").style.borderColor = "#dde6e9";
                document.getElementById("dutyTimings1").innerHTML = '';
                //customerDetails.address = null;

            }

            if (angular.isUndefined(customerDetails.salaryRange) || customerDetails.salaryRange === '' || customerDetails.salaryRange === null) {
                document.getElementById("salaryRange").style.borderColor = "red";
                document.getElementById("salaryRange1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("salaryRange").style.borderColor = "#dde6e9";
                document.getElementById("salaryRange1").innerHTML = '';
                //customerDetails.address = null;

            }
            if (angular.isUndefined(customerDetails.operationCity) || customerDetails.operationCity === '' || customerDetails.operationCity === null) {
                document.getElementById("operationCity").style.borderColor = "red";
                document.getElementById("operationCity1").innerHTML = '*required';
                //customerDetails.address = 'This value is required';
                count++;
            } else {
                document.getElementById("operationCity").style.borderColor = "#dde6e9";
                document.getElementById("operationCity1").innerHTML = '';
                //customerDetails.address = null;

            }

                if (count > 0) {
                    $scope.count = count;
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    return false;
                } else {
                    $scope.count = 0;
                    OtherJobsDetails.findById({
                            id: customerDetails.id
                        },
                        function(OtherJobsDetails) {
                            OtherJobsDetails.age = customerDetails.age;
                            OtherJobsDetails.alternateNumber=customerDetails.alternateMobileNumber;
                            OtherJobsDetails.designation=customerDetails.designation;
                            OtherJobsDetails.dutyTime=customerDetails.dutyTimings;
                            OtherJobsDetails.education=customerDetails.education;
                            OtherJobsDetails.experience=customerDetails.experience;
                            OtherJobsDetails.jobProfile=customerDetails.jobProfile;
                            OtherJobsDetails.jobReportingAddress=customerDetails.reportingAddress;
                            OtherJobsDetails.remark=customerDetails.remark;
                            OtherJobsDetails.salaryRange=customerDetails.salaryRange;
                            OtherJobsDetails.weeklyOff='{' + customerDetails.weekOff + '}';
                           
                            OtherJobsDetails.updatedBy = $rootScope.userId;
                             OtherJobsDetails.updatedDate = new Date();
                             OtherJobsDetails.status=customerDetails.status;
                             OtherJobsDetails.operationCity=customerDetails.operationCity;

                            

                            OtherJobsDetails.$save();

                            $.notify('Job updated successfully.', {
                                status: 'success'
                            });

                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButton = false;
                            reloadFunc();
                           // $rootScope.getDriverJob();
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
                var resultData = $rootScope.fetchJobData1;

                for (var i = 0; i < resultData.length; i++) {


                    if (resultData[i].id == $rootScope.updateJobId) {
                        $scope.customerDetails = {
                            id: resultData[i].id,
                            // clientId: jobData[i].client_id,
                            customerId: resultData[i].customerId,
                            alternateMobileNumber:resultData[i].alternateNumber,
                            reportingAddress: resultData[i].jobReportingAddress,
                            designation: resultData[i].designation,
                            jobProfile: resultData[i].jobProfile,
                            dutyTimings: resultData[i].dutyTime,
                            age: resultData[i].age,
                            education: resultData[i].education,
                            experience: resultData[i].experience,
                            salaryRange: resultData[i].salaryRange,
                            remark: resultData[i].remark,
                            jobStatusOrder: resultData[i].orderStatus,
                            customerId: resultData[i].customerId,
                            weekOff: resultData[i].weeklyOff,
                            weekOffDays: resultData[i].weeklyOffDays,
                            status: resultData[i].status,
                            // createdBy:477//$rootScope.userId
                            custName: resultData[i].custName,
                            firstName: resultData[i].firstName,
                            lastName: resultData[i].lastName,
                            mobileNumber: resultData[i].mobile,
                            date: resultData[i].createdDate,
                            email: resultData[i].email,
                            operationCity:resultData[i].operationCity,
                            createdByName:resultData[i].createdByName

                            // weeklyOff: weekDaysId,
                            // weeklyOffDays: Days.replace('[', '').replace(']', '').replace('"', ''),
                            // dutyTime: jobData[i].duty_time,
                            // outstationDays: jobData[i].outstation_days,
                            // driverAge: jobData[i].driver_age,
                            // drivingExp: jobData[i].driving_experience,
                            // carName: jobData[i].vehicle_name,
                            // clientSalary: jobData[i].client_salary,
                            // driverSalary: jobData[i].driver_salary,
                            // role: jobData[i].role,
                            // other: jobData[i].other,
                            // location: jobData[i].location,
                            // jobStatusOrder: orderStatus
                        };
                        //console.log('job details: ' + JSON.stringify($scope.jobDetails));
                    }
                }
            };


            $scope.closeModal = function() {

                $rootScope.updateJobId = undefined;
                $modalInstance.dismiss('cancel');
               // $rootScope.getDriverJob();
            };

        };

        $scope.backToSearchReport = function () {
            $localStorage.put('customerId', undefined);
            $localStorage.put('Area', undefined);
            $state.go('app.otherJobs');

        };

        $scope.searchOtherUserrPopup = function(jobId, cutName, status) {
            if (status === 'Open') {
                $rootScope.applyJobId = jobId;
                $rootScope.customerName = cutName;

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
            } else {
                window.alert('Unable to apply for job in Closed Mode.');
            }
        };

        var applyJobCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
            $scope.otherUserMobileSelect = function() {

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
                       // $scope.getDriverData($rootScope.drvCellNo);
                    } else {
                        //$scope.getDriverData(cellNumber);
                    }
                    $scope.disableDrvSubmit = false;
                    $rootScope.loader = 0;

                }

            };

            // $scope.getDriverData = function(cellNumber) {
            //     var cellNumber = cellNumber;
            //     ConUsers.find({
            //             filter: {
            //                 where: {
            //                     conuserId: 477
            //                 },
            //                 include: {
            //                     relation: 'otherUsers'
            //                 }

            //             }
            //         },
            //         function(drvData) {
            //             //console.log('drvData ' + JSON.stringify(drvData));
            //             if (drvData.length > 0) {
            //                 $rootScope.drvRecordExist = true;
            //                 $rootScope.drvExistFlag = 1;
            //                 $rootScope.drvRequestDetails = {
            //                     driverId: drvData[0].driverDetails[0].id,
            //                     conUserId: drvData[0].id,
            //                     firstName: drvData[0].firstName,
            //                     lastName: drvData[0].lastName,
            //                     mobileNumber: cellNumber,
            //                     address: drvData[0].address,
            //                     city:drvData[0].operationCity

            //                 };

            //             } else {
            //                 $rootScope.drvRecordExist = false;
            //                 $rootScope.drvExistFlag = 0;
            //                 $rootScope.drvRequestDetails = {
            //                     driverId: '',
            //                     conUserId: '',
            //                     firstName: '',
            //                     middleName: '',
            //                     lastName: '',
            //                     mobileNumber: cellNumber,
            //                     address: '',
            //                     city:''

            //                 };
            //             }

            //             //console.log('driver details' + JSON.stringify($rootScope.drvRequestDetails));
            //             $modalInstance.dismiss('cancel');

            //         },
            //         function(error) {
            //             console.log('error ' + JSON.stringify(error));
            //             if (error.status == 0) {
            //                 window.alert('Oops! You are disconnected from server.');

            //             }
            //         });
            // }
        //     $scope.fetchsearchDrvList = function() {


        //     $rootScope.loader = 1;
        //     if($rootScope.roleId === '1'){
        //         if($rootScope.operationCitySelect ==='All'){
        //             DriverDetails.getDrivers({
        //                 operationCity:$rootScope.operationCitySelect
        //     }, function(driverData) {
        //         //console.log('driver Data*' + JSON.stringify(driverData));
        //         $scope.searchDrvList = [];
        //         if (!angular.isUndefined(driverData)) {
        //             for (var i = 0; i < driverData.length; i++) {
        //                   $scope.searchDrvList.push({
        //                     id: driverData[i].id,
        //                     mobileNumber: driverData[i].mobile_number,
        //                     driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
        //                     driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

        //                 });
        //                 //console.log('driver list' + JSON.stringify($scope.searchDrvList));
        //             }
        //         }



        //         $rootScope.loader = 0;
        //     }, function(driverErr) {
        //         console.log('driver error' + JSON.stringify(driverErr));
        //         if (driverErr.status == 0) {
        //             window.alert('Oops! You are disconnected from server.');
        //             $state.go('page.login');
        //         }

        //         $rootScope.loader = 0;
        //     });
        //         }else{
        //            DriverDetails.getDrivers({
        //                 operationCity:$rootScope.operationCitySelect
        //     }, function(driverData) {
        //         //console.log('driver Data*' + JSON.stringify(driverData));
        //         $scope.searchDrvList = [];
        //         if (!angular.isUndefined(driverData)) {
        //             for (var i = 0; i < driverData.length; i++) {
        //                   $scope.searchDrvList.push({
        //                     id: driverData[i].id,
        //                     mobileNumber: driverData[i].mobile_number,
        //                     driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
        //                     driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

        //                 });
        //                 //console.log('driver list' + JSON.stringify($scope.searchDrvList));
        //             }
        //         }



        //         $rootScope.loader = 0;
        //     }, function(driverErr) {
        //         console.log('driver error' + JSON.stringify(driverErr));
        //         if (driverErr.status == 0) {
        //             window.alert('Oops! You are disconnected from server.');
        //             $state.go('page.login');
        //         }

        //         $rootScope.loader = 0;
        //     });
        //         }
                

        //     }else{
        //          DriverDetails.getDrivers({
        //                 operationCity:$rootScope.operationCitySelect
        //     }, function(driverData) {
        //         //console.log('driver Data*' + JSON.stringify(driverData));
        //         $scope.searchDrvList = [];
        //         if (!angular.isUndefined(driverData)) {
        //             for (var i = 0; i < driverData.length; i++) {
        //                   $scope.searchDrvList.push({

        //                     id: driverData[i].id,
        //                     mobileNumber: driverData[i].mobile_number,
        //                     driverName: driverData[i].first_name + ' ' + driverData[i].last_name,
        //                     driverSearchData: driverData[i].id + ' - ' + driverData[i].first_name + ' ' + driverData[i].last_name + ' - ' + driverData[i].mobile_number + ' (' + driverData[i].status + ')'

        //                 });
        //                 //console.log('driver list' + JSON.stringify($scope.searchDrvList));
        //             }
        //         }



        //         $rootScope.loader = 0;
        //     }, function(driverErr) {
        //         console.log('driver error' + JSON.stringify(driverErr));
        //         if (driverErr.status == 0) {
        //             window.alert('Oops! You are disconnected from server.');
        //             $state.go('page.login');
        //         }

        //         $rootScope.loader = 0;
        //     });
        //     }
            
        // };


            $scope.getOtherUserDetails = function() {

                $rootScope.loader = 1;
                $scope.otherUserList = [];
                if($rootScope.roleId === '1'){
                    if($rootScope.operationCitySelect === 'All'){
                        OtherUser.getUsers({
                        operationCity:$rootScope.operationCitySelect
                    },function(otherUserData) {
                        //console.log('driverData' + JSON.stringify(driverData));
                        for (var i = 0; i < otherUserData.length; i++) {
                            $scope.otherUserList.push({
                                id: otherUserData[i].id,
                                mobileNumber: otherUserData[i].mobile_number,
                                userName: otherUserData[i].first_name + ' ' + otherUserData[i].last_name,
                                otherUserDetails: otherUserData[i].first_name + ' ' + otherUserData[i].last_name + ' - ' + otherUserData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.otherUserList));

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
                        OtherUser.getUsers({
                        operationCity:$rootScope.operationCitySelect
                    }, function(otherUserData) {
                        //console.log('driverData' + JSON.stringify(driverData));
                        for (var i = 0; i < otherUserData.length; i++) {
                            $scope.otherUserList.push({
                                id: otherUserData[i].id,
                                mobileNumber: otherUserData[i].mobile_number,
                                userName: otherUserData[i].first_name + ' ' + otherUserData[i].last_name,
                                otherUserDetails: otherUserData[i].first_name + ' ' + otherUserData[i].last_name + ' - ' + otherUserData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.otherUserList));

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
                    OtherUser.getUsers({
                        operationCity:$rootScope.operationCitySelect
                    }, function(otherUserData) {
                        //console.log('otherUserData' + JSON.stringify(otherUserData));
                        for (var i = 0; i < otherUserData.length; i++) {
                            $scope.otherUserList.push({
                                id: otherUserData[i].id,
                                mobileNumber: otherUserData[i].mobile_number,
                                userName: otherUserData[i].first_name + ' ' + otherUserData[i].last_name,
                                otherUserDetails: otherUserData[i].first_name + ' ' + otherUserData[i].last_name + ' - ' + otherUserData[i].mobile_number 


                            });
                        }

                        //console.log('driver List = ' + JSON.stringify($scope.otherUserList));

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
                if (angular.isUndefined(drvRequestDetails)){
                    window.alert('please fill out the fields');
                }else{

                
                $rootScope.loader = 1;
                var count = 0;
                $scope.isDisabledButton = true;
                 if (angular.isUndefined(drvRequestDetails.mobileNumber) || drvRequestDetails.mobileNumber === '' || drvRequestDetails.mobileNumber === null) {
                    document.getElementById("mobileNumber").style.borderColor = "red";
                    document.getElementById("mobileNumber1").innerHTML = '*required';
                   
                    count++;
                } else {


                    document.getElementById("mobileNumber").style.borderColor = "#dde6e9";
                    document.getElementById("mobileNumber1").innerHTML = '';
                   

                }
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
                               
                                OtherJobsRequest.applyOtherJob({
                                    otherJobsId: $rootScope.applyJobId,
                                    otherUserId: $rootScope.drvRequestDetails.driverId,
                                    userId: $rootScope.userId,
                                    remark: remark
                                }, function(requestSuccess) {
                                    //console.log('success: ' + JSON.stringify(requestSuccess));
                                    if (requestSuccess[0].apply_driver_job === '0') {
                                        $.notify('The driver is applied successfully for this Job.', {
                                            status: 'success'
                                        });
                                        //$rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                        //$rootScope.getDriverJob();
                                        $rootScope.loader = 0;
                                    } else if (requestSuccess[0].apply_driver_job === '1') {

                                        window.alert('The driver is already applied for this Job.');
                                        //$rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                        //$rootScope.getDriverJob();
                                        $rootScope.loader = 0;
                                    }else{

                                        window.alert('The driver is not registerd with us please ask him to come to office.');
                                        //$rootScope.drvRequestDetails = undefined;
                                        $rootScope.applyDrvId = undefined;
                                        $rootScope.applyJobId = undefined;
                                        $rootScope.drvCellNo = undefined;
                                        $scope.isDisabledButton = false;
                                        $modalInstance.dismiss('cancel');

                                        reloadFunc();
                                       // $rootScope.getDriverJob();
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
                                    email: drvRequestDetails.mobileNumber + '@others.in',
                                    address: drvRequestDetails.address,
                                    addressLat: addressLat,
                                    addressLong: addressLong,
                                    createdBy: $rootScope.userId,
                                    status: 'Inactive',
                                    operationCity:drvRequestDetails.city

                                }, function(newConUser) {
                                    //console.log('newConUser: ' + JSON.stringify(newConUser));
                                    OtherUser.create({
                                        conUserId: newConUser.id,
                                        createdBy: $rootScope.userId
                                       

                                    }, function(newDriverData) {
                                        //console.log('newDriverData: ' + JSON.stringify(newDriverData));
                                        UserRoles.create({
                                            conuserId: newConUser.id,
                                            roleId: 28,
                                            createdBy: $rootScope.userId
                                        }, function(roleData) {
                                            //console.log('roleData: ' + JSON.stringify(roleData));
                                            OtherJobsRequest.applyOtherJob({
                                                otherJobsId: $rootScope.applyJobId,
                                                otherUserId: newDriverData.id,
                                                userId: $rootScope.userId,
                                                remark: remark
                                            }, function(requestSuccess) {
                                                //console.log('success: ' + JSON.stringify(requestSuccess));
                                                if (requestSuccess[0].apply_other_job === '0') {
                                                    $.notify(' applied successfully for this Job.', {
                                                        status: 'success'
                                                    });
                                                    //$rootScope.drvRequestDetails = undefined;
                                                    $rootScope.applyDrvId = undefined;
                                                    $rootScope.applyJobId = undefined;
                                                    $rootScope.drvCellNo = undefined;
                                                    $scope.isDisabledButton = false;
                                                    $modalInstance.dismiss('cancel');

                                                    reloadFunc();
                                                    //$rootScope.getDriverJob();
                                                    $rootScope.loader = 0;
                                                } else if (requestSuccess[0].apply_other_job === '1') {

                                                    window.alert('The  is already applied for this Job.');
                                                    //$rootScope.drvRequestDetails = undefined;
                                                    $rootScope.applyDrvId = undefined;
                                                    $rootScope.applyJobId = undefined;
                                                    $rootScope.drvCellNo = undefined;
                                                    $scope.isDisabledButton = false;
                                                    $modalInstance.dismiss('cancel');

                                                    reloadFunc();
                                                    //$rootScope.getDriverJob();
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
                                    $window.alert("this number already exists");
                                    //$scope.closeModal();
                                    $modalInstance.dismiss('cancel');
                                    reloadFunc();
                                    //$window.history.back();
                                });
                                
                                


                            }
                        }

                    


                }
            }
            };
        //     $scope.getSearchResult = function(searchText) {
        //         var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=' + ENV.googlePlacesAPIKey;
        //         $http.get(url)
        //             .then(function successCallback(response) {
        //                 if (angular.isDefined(response.data.predictions))
        //                     console.log('search results : ' + JSON.stringify(response.data.predictions));
        //                 $scope.searchResult = response.data.predictions;
        //             }, function errorCallback(response) {
        //                 console.log('search place error : ' + JSON.stringify(response));
        //             });
        //     };

        //     $scope.toggleMin = function() {
        //         var maximumDate = new Date();
        //         var currentYear = maximumDate.getFullYear();
        //         var currentMonth = maximumDate.getMonth();
        //         var currentDate = maximumDate.getDate();
        //         $scope.maxDate = $scope.maxDate ? null : new Date(currentYear, currentMonth, currentDate + 15);
        //     };
        //     $scope.toggleMin();
        //     $scope.openToDate = false;
        //     $scope.openedStart = false;
           
        //     $scope.openStart = function($event) {

        //         $event.preventDefault();
        //         $event.stopPropagation();
        //         $scope.openedStart = true;
        //         $scope.openToDate = false;

        //     };
             

        //     $scope.openedToDate = function($event) {

        //         $event.preventDefault();
        //         $event.stopPropagation();
        //         $scope.openToDate = true;
        //         $scope.openedStart = false;

        //     };
             

        //     $scope.dateOptions = {
        //         formatYear: 'yy',
        //         startingDay: 1
        //     };

        //     $scope.ismeridian = true;
        //     $scope.toggleMode = function() {
        //         $scope.ismeridian = !$scope.ismeridian;
        //     };
        //     $scope.user = {};
        //     $scope.submitUserBtn = false;
        //     $scope.count = 0;

            $scope.closeModal = function() {
                // $rootScope.customerName = undefined;
                // $rootScope.drvRequestDetails = undefined;
                // $rootScope.drvCellNo = undefined;
                // $rootScope.applyDrvId = undefined;
                // $rootScope.applyJobId = undefined;
                $modalInstance.dismiss('cancel');
                
            };

        };

        $scope.jobRequestPopup = function(jobId, cname, jArea) {
            $localStorage.put('custJobId', jobId);
            $localStorage.put('cname', cname);
            $localStorage.put('jobArea', jArea);
            $state.go('app.otherJobsRequestReport');

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
            OtherJobsRequest.OtherJobRequestDataByJobId({
                         jobId: jobId
                         }, function(jobRequestData) {
                    console.log('job request data' + JSON.stringify(jobRequestData));


                   
                    for (var i = 0; i < jobRequestData.length; i++) {
        //                 /*if(angular.isUndefined(jobRequestData[i].licenseDate) || jobRequestData[i].licenseDate === '' || jobRequestData[i].licenseDate=== null){
        //      var Experience = 0;
        // }else{


        //            var birthday = new Date(jobRequestData[i].licenseDate);
        //               var today = new Date();
        //               var age = ((today - birthday) / (31557600000));
        //               var Experience = Math.floor( age );
                       
        //      }*/
        //      if(jobRequestData[i].license_date=== null){

        //     var Experience = 0;
               
        // }else{


        //          var exp = new Date(jobRequestData[i].license_date);
        //          var today = new Date();
        //         var Experience = ((today - exp) / (31557600000));
        //         Experience = Math.floor(Experience);
                   
                      
                       
        //      }
                        // ConUsers.findById({
                        //     id: jobRequestData[i].created_by
                        // },
                        //     function (ConUsers) {
                        //         var userName = ConUsers.firstName + ' ' + ConUsers.lastName;
                        //     }, function (error) {

                        //     }
                        // )



                        var createdDate = moment(jobRequestData[i].created_date).format('DD-MM-YYYY HH:mm:ss');

                        allJobRequestData.push({
                            id: jobRequestData[i].id,
                            jobId: jobRequestData[i].other_jobs_id,
                            driverId: jobRequestData[i].other_user_id,
                            drvName: jobRequestData[i].first_name + ' ' + jobRequestData[i].last_name,
                            date: createdDate,
                            firstName: jobRequestData[i].first_name,
                            lastName: jobRequestData[i].last_name,
                            contactNo: jobRequestData[i].mobile_number,
                            remark: jobRequestData[i].remark,
                            address: jobRequestData[i].address,
                            createdDate: jobRequestData[i].created_date,
                            createdBy: jobRequestData[i].created_by,
                            
                            status: jobRequestData[i].status,
                            createdByName:jobRequestData[i].created_by_name
                            


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
           
          

            $scope.updateRequestDetails = function(job) {
                var remark = null;
                $rootScope.loader = 1;
                if (!angular.isUndefined(job.remark) || job.remark !== null || job.remark !== '') {
                        remark = job.remark;
                    }
                    ConUsers.findById({
                                id: $rootScope.userId
                            },
                            function(ConUsers) {
                                var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                    OtherJobsRequest.findById({
                    id: job.id
                },
                function(OtherJobsRequest) {
                     var otherJobsId = OtherJobsRequest.otherJobsId;
                        
                    var remarkUpdatedDate = new Date();
                    remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                    OtherJobsRequest.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                    OtherJobsRequest.status = job.status;
                    OtherJobsRequest.updatedBy = $rootScope.userId;
                    OtherJobsRequest.updatedDate = new Date();
                    OtherJobsRequest.$save();
                    $.notify('Request updated successfully.', {
                                            status: 'success'
                                        });
        
                                        $modalInstance.dismiss('cancel');
                                        reloadFunc();
                                       // $rootScope.getJobRequest();
                                        $rootScope.loader = 0;
                    $window.history.back();
                },function(error){
                    console.log("error in OtherJobsRequest ");

                })
            },function(error){
                console.log("error in ConUsers ");

            })
                //       $rootScope.loader = 1;
                // //console.log('request data to update' + JSON.stringify(job));
                // var remark = null;
                // if (!angular.isUndefined(job.remark) || job.remark !== null || job.remark !== '') {
                //     remark = job.remark;
                // }
                //     DriverJobRequest.DriverJobRequestCheck({
                //         driverId:job.driverId,
                //         jobId:job.jobId,
                //         status:job.status
                //     },
                //     function(sssss) {
                //         if(sssss[0].check_driver_job_request_status === 'Sccess'){
                //                 ConUsers.findById({
                //         id: $rootScope.userId
                //     },
                //     function(ConUsers) {

                //         var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                //         DriverJobRequest.findById({
                //                 id: job.id
                //             },
                //             function(DriverJobRequest) {
                //                  var driverJobId = DriverJobRequest.driverJobId;
                                    
                //                 var remarkUpdatedDate = new Date();
                //                 remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');
                //                 DriverJobRequest.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                //                 DriverJobRequest.status = job.status;
                //                 DriverJobRequest.updatedBy = $rootScope.userId;
                //                 DriverJobRequest.updatedDate = new Date();
                //                 DriverJobRequest.$save();
                                
                //                 if(job.status==='Appointed')
                //                  {
                //                     DriverDetails.findOne ({
                //                         driverId: DriverJobRequest.driverId
                //                     },function(success){
                //                         success.driverStatus = 'On Job';
                //                         success.$save();
                //                     },function(err){

                //                     });
                //                  }
                //                  if(job.status === 'Left')
                //                  {
                //                     DriverDetails.findOne ({
                //                         driverId: DriverJobRequest.driverId
                //                     },function(success){
                //                         success.driverStatus = 'Free';
                //                         success.$save();
                //                     },function(err){

                //                     });
                                    
                //                  }
                //                 //console.log('Driver request updated : ' + JSON.stringify(DriverRequestData));

                //                 $.notify('Request updated successfully.', {
                //                     status: 'success'
                //                 });

                //                 $modalInstance.dismiss('cancel');
                //                 reloadFunc();
                //                 $rootScope.getJobRequest();
                //                 $rootScope.loader = 0;


                //             },
                //             function(error) {
                //                 console.log('Error updating request details : ' + JSON.stringify(error));
                //                 $modalInstance.dismiss('cancel');
                //                 if (error.status == 0) {
                //                     window.alert('Oops! You are disconnected from server.');
                //                     $state.go('page.login');
                //                 }
                //                 $rootScope.loader = 0;
                //             });

                //     },
                //     function(error) {
                //         console.log('error ' + JSON.stringify(error));
                //         $rootScope.loader = 0;
                //     });
                        
                //         }else{
                //      $.notify(sssss[0].check_driver_job_request_status, {
                //                     status: 'danger'
                //                 });

                //                 $modalInstance.dismiss('cancel');
                //                 $rootScope.loader = 0;
                //         }
                         
                //             console.log(' updating request details : ' + JSON.stringify(sssss));
                //     },function(errrr){

                //     });
                
                 


            };
            //update other user request
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
                            status: resultData[i].status,
                            createdByName:resultData[i].createdByName
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

    }
])
