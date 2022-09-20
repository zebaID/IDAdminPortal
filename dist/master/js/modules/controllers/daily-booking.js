App.controller('dailyBookingCtrl', dailyBookingCtrl)

function dailyBookingCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, BookingPaymentTransaction, DriverAllocationReport, FareMatrix, Cities, News, BookingDetails) {
    'use strict';

     
    $scope.uid = $localStorage.get('userId');
    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
    $rootScope.cityAt = [];
   
   
        for(var i = 0; i<$rootScope.cities.length; i++){
            
            if($rootScope.cities[i] !== 'All'){
                $rootScope.cityAt.push($rootScope.cities[i]);//get all cities here
            }
        }

   if($rootScope.operationCitySelect === 'Pune' || $rootScope.operationCity === 'Pune')
{
    $rootScope.operationCityOther = 'Pimpri-Chinchwad';
}else{
    $rootScope.operationCityOther = '';
}         

  $scope.news = function() { //fetch news details based on operation city
                 Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.operationCitySelect
                        } 
                        }
                        
                        },function(s){
                            $rootScope.operationCityId=s.id;
                                console.log(s);

                                News.findOne({
                        filter: {
                            where: {
                                operationCityId:$rootScope.operationCityId
                            }
                        }
                    },
                    function(rateCardsuc) {
                        $scope.newsId = rateCardsuc.id;
                        $scope.updateNewsdetails = rateCardsuc
                        $scope.newsDetail = rateCardsuc.NewsHtml;

                    },
                    function(ratecarderr) {

                    });
                        },function(r){
                    });
                
            }

            $scope.updateNews = function(newsDetail){//changes in news for news update method
        $rootScope.loader = 1;
                News.upsert({
                        id: $scope.newsId,
                        NewsHtml: newsDetail,
                        updatedBy: $scope.uid,
                        updatedDate: new Date()    
                    },
                    function(rateCardsuc) {
                         console.log('success: ' +JSON.stringify(rateCardsuc));
                            $rootScope.loader = 0; 
                    },
                    function(ratecarderr) {
                            $rootScope.loader = 0; 
                    });
            }

 $scope.verifyMobile = function(mobileNumber) {//to check mobile number allready exist
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
                $scope.verifyMobile1 = function(mobileNumber) {//to check mobile num already exists in from enquiry form
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

                                    document.getElementById("dcellNumber").style.borderColor = "red";
                                    document.getElementById("dcellNumber1").innerHTML = 'Mobile number exist';
                                   // console.log('Mobile already exists : ' + JSON.stringify(response));
                                } else {
                                    if (mobileNumber.length != 10) {
                                        $scope.MobileExist = true;
                                       // $scope.customer.cellNumber1 = 'Enter valid Mobile Number';
                                        document.getElementById("dcellNumber").style.borderColor = "red";
                                        document.getElementById("dcellNumber1").innerHTML = 'enter valid Mobile Number';
                                    } else {
                                        $scope.MobileExist = false;
                                        $scope.customer.cellNumber1 = null;
                                        document.getElementById("dcellNumber").style.borderColor = "#dde6e9";
                                        document.getElementById("dcellNumber1").innerHTML = '';
                                    }
                                }
                            } else {
                                $scope.MobileExist = true;
                                $scope.customer.cellNumber1 = 'Enter valid Mobile Number';
                                document.getElementById("dcellNumber").style.borderColor = "red";
                                document.getElementById("dcellNumber1").innerHTML = 'enter valid Mobile Number';
                            }
                        },
                        function(error) {
                            console.log('Error verifying mobile : ' + JSON.stringify(error));
                            document.getElementById("dcellNumber").style.borderColor = "red";
                            $scope.MobileExist = false;
                            if (error.status == 0) {
                                window.alert('Oops! You are disconnected from server.');
                                $state.go('page.login');
                            }
                            $modalInstance.dismiss('cancel');
                        });


                };
             $scope.addCustomer = function(customer) {
                    if(angular.isUndefined($scope.MobileExist) || $scope.MobileExist === false){
                    $scope.submitUserBtn = true;
                    $rootScope.loader = 1;

                    var count = 0;
                    if(!angular.isUndefined(customer)){
                       if (angular.isUndefined(customer.firstName) || customer.firstName === '') {
                        document.getElementById("firstName").style.borderColor = "red";
                        document.getElementById("firstName1").innerHTML = '*This value is required';
                        customer.firstName1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("firstName").style.borderColor = "#dde6e9";
                        document.getElementById("firstName1").innerHTML = '';
                        customer.firstName1 = null;
                    }
                    if (angular.isUndefined(customer.cellNumber) || customer.cellNumber === '') {
                        document.getElementById("cellNumber").style.borderColor = "red";
                        document.getElementById("cellNumber1").innerHTML = '*This value is required';
                        customer.cellNumber1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("cellNumber").style.borderColor = "#dde6e9";
                        document.getElementById("cellNumber1").innerHTML = '';
                        customer.cellNumber1 = null;
                    }
                     if (angular.isUndefined(customer.operationCity) || customer.operationCity === '' || customer.operationCity=== null) {
                    document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*This value is required';
                    customer.operationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("operationCity").style.borderColor = "#dde6e9";
                    document.getElementById("operationCity1").innerHTML = '';
                    customer.operationCity1 = null;
                }
                    if (angular.isUndefined(customer.lastName) || customer.lastName === '') {
                        document.getElementById("lastName").style.borderColor = "red";
                        document.getElementById("lastName1").innerHTML = '*This value is required';
                        customer.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("lastName").style.borderColor = "#dde6e9";
                        document.getElementById("lastName1").innerHTML = '';
                        customer.lastName1 = null;
                    } if (angular.isUndefined(customer.email) || customer.email == '' || customer.email == null) {
                        document.getElementById("email1").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = '*This value is required';
                        customer.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("email1").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        customer.lastName1 = null;
                    }
                     if (angular.isUndefined(customer.address) || customer.address == '' || customer.address == null) {
                        document.getElementById("address1").style.borderColor = "red";
                        document.getElementById("address1").innerHTML = '*This value is required';
                        customer.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("address1").style.borderColor = "#dde6e9";
                        document.getElementById("address1").innerHTML = '';
                        customer.lastName1 = null;
                    }
                    if (count > 0) {
                        $scope.count = count;
                        $scope.submitUserBtn = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $scope.count = 0;
                        ConUsers.createCustomerEnquiry({
                                firstName: customer.firstName,
                                lastName: customer.lastName,
                                mobileNumber: customer.cellNumber,
                                email: customer.email,
                                address:customer.address,
                                userId: $rootScope.userId,
                                status: 'Active',
                                password: customer.cellNumber,
                                operationCity: customer.operationCity
                                

                            }, function(customerData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                $.notify('Customer inserted successfully.', {
                                    status: 'success'
                                });
                                $scope.submitUserBtn = false;
                                $scope.customer = undefined;
                                var custmerRegistaration = customerData;
                                //customerRegistrationSMS(custmerRegistaration);
                                $rootScope.loader = 0;
                                $modalInstance.dismiss('cancel');

                                //$rootScope.getAllCustomer();
                            }, function(customerErr) {
                                console.log('customerErr ' + JSON.stringify(customerErr));
                                if (customerErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                //$modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });
                    }
                    }else{
                         $scope.submitUserBtn = false;
                        document.getElementById("firstName").style.borderColor = "red";
                        document.getElementById("firstName1").innerHTML = '*This value is required';
                         

                        document.getElementById("operationCity").style.borderColor = "red";
                    document.getElementById("operationCity1").innerHTML = '*This value is required';
                    

                      document.getElementById("lastName").style.borderColor = "red";
                        document.getElementById("lastName1").innerHTML = '*This value is required';
                         
                        document.getElementById("cellNumber").style.borderColor = "red";
                        document.getElementById("cellNumber1").innerHTML = '*This value is required';
                         

                         count++;

                         $rootScope.loader = 0;
                    }     
                    }
                    
                    
                }



                 $scope.addDriver = function(driver) {
                        if(angular.isUndefined($scope.MobileExist) || $scope.MobileExist === false){
                          $scope.submitUserBtn1 = true;
                    $rootScope.loader = 1;

                    var count = 0;
                    if(!angular.isUndefined(driver)){
                       if (angular.isUndefined(driver.firstName) || driver.firstName === '') {
                        document.getElementById("dfirstName").style.borderColor = "red";
                        document.getElementById("dfirstName1").innerHTML = '*This value is required';
                        driver.firstName1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("dfirstName").style.borderColor = "#dde6e9";
                        document.getElementById("dfirstName1").innerHTML = '';
                        driver.firstName1 = null;
                    }
                    if (angular.isUndefined(driver.cellNumber) || driver.cellNumber === '') {
                        document.getElementById("dcellNumber").style.borderColor = "red";
                        document.getElementById("dcellNumber1").innerHTML = '*This value is required';
                        driver.cellNumber1 = 'This value is required';

                        count++;
                    } else {
                        document.getElementById("dcellNumber").style.borderColor = "#dde6e9";
                        document.getElementById("dcellNumber1").innerHTML = '';
                        driver.cellNumber1 = null;
                    }
                     if (angular.isUndefined(driver.operationCity) || driver.operationCity === '' || driver.operationCity=== null) {
                    document.getElementById("doperationCity").style.borderColor = "red";
                    document.getElementById("doperationCity1").innerHTML = '*This value is required';
                    driver.operationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("doperationCity").style.borderColor = "#dde6e9";
                    document.getElementById("doperationCity1").innerHTML = '';
                    driver.operationCity1 = null;
                }
                    if (angular.isUndefined(driver.lastName) || driver.lastName === '') {
                        document.getElementById("dlastName").style.borderColor = "red";
                        document.getElementById("dlastName1").innerHTML = '*This value is required';
                        driver.lastName1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("dlastName").style.borderColor = "#dde6e9";
                        document.getElementById("dlastName1").innerHTML = '';
                        driver.lastName1 = null;
                    }if (count > 0) {
                        $scope.count = count;
                        $scope.submitUserBtn1 = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $scope.count = 0;
                        ConUsers.createDriverEnquiry({
                                firstName: driver.firstName,
                                lastName: driver.lastName,
                                mobileNumber: driver.cellNumber,
                                email: driver.cellNumber+ '@consrv-enquiry.in',
                                userId: $rootScope.userId,
                                status: 'Inactive',
                                password: driver.cellNumber,
                                operationCity: driver.operationCity

                            }, function(driverData) {
                                //console.log('customerData ' + JSON.stringify(customerData));
                                $.notify('Driver inserted successfully.', {
                                    status: 'success'
                                });
                                $scope.submitUserBtn1 = false;
                                $scope.driver = undefined;
                                //customerRegistrationSMS(custmerRegistaration);
                                $rootScope.loader = 0;
                               // $modalInstance.dismiss('cancel');

                                //$rootScope.getAllCustomer();
                            }, function(driverErr) {
                                console.log('driverErr ' + JSON.stringify(driverErr));
                                if (driverErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                //$modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });
                    }
                    }else{
                         $scope.submitUserBtn1 = false;
                        document.getElementById("dfirstName").style.borderColor = "red";
                        document.getElementById("dfirstName1").innerHTML = '*This value is required';
                         

                        document.getElementById("doperationCity").style.borderColor = "red";
                    document.getElementById("doperationCity1").innerHTML = '*This value is required';
                    

                      document.getElementById("dlastName").style.borderColor = "red";
                        document.getElementById("dlastName1").innerHTML = '*This value is required';
                         
                        document.getElementById("dcellNumber").style.borderColor = "red";
                        document.getElementById("dcellNumber1").innerHTML = '*This value is required';
                         

                         count++;

                         $rootScope.loader = 0;
                    }   
                        }
                    
                    
                }


                 var bookingHistoryDetailsCtrl = function($scope, $rootScope, $modalInstance, $state, BookingDetails) {
                    //booking estimation controller
                
                    $scope.closeModal1 = function() {
                        $modalInstance.dismiss('cancel');
                         
            
                    };
                    $scope.historyDetails = function(){
                        
                        $rootScope.data = $rootScope.bookinghist;
                        console.log("history: " +JSON.stringify($rootScope.data));
                        BookingDetails.find({
                            filter:{
                               where:{
                                bookingId: $rootScope.data.bookingId
                            } 
                            }
                             
                            },function(s){ 
                                $rootScope.BookingDetails=s;
                                console.log($rootScope.BookingDetails.description+ 'success');
                                //$scope.bookingHistoryDetails
                                //$rootScope.bookingDetails = s;
                            },
                            function(error){
                                console.log(error+ 'Failure');
                            });
                    
                    }
            
                    
                };
                

$rootScope.ConfirmBookingAmt = function()//before booking check amm
    {

        var modalInstance = $modal.open({
        templateUrl: '/confirmBoookingAmt.html',
            controller: estimatedBookingCtrl

        });
        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };
    var estimatedBookingCtrl = function($scope, $rootScope, $modalInstance, $state, Bookings) {
        //booking estimation controller
        $scope.closeModal1 = function() {
            $modalInstance.dismiss('cancel');
             

        };

        
    };







$rootScope.calculateFare = function(bookingDetails) {


            console.log('bookingDetails' + JSON.stringify(bookingDetails));
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


                    var journeyType;
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
                        

              
                    $scope.pickupLat = 0;
                    $scope.pickupLng =0;
                     
                    var count1 = 0;
 
                    $scope.dropLat = 0;
                    $scope.dropLng = 0;
                      
                    $rootScope.returnTravelTime = 0;
                   

                                console.log('returnTravelTime ' + JSON.stringify($rootScope.returnTravelTime));

                    

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
                        
                        if (angular.isDefined(bookingDetails.carType)) {
                            if (bookingDetails.carType == '1') {
                                carType = 'M';
                            } else if (bookingDetails.carType == '2') {

                                carType = 'A';
                            } else {
                                carType = 'L';
                            }


                        }

                        
                        $rootScope.nightCharge=0;
                        $rootScope.nightPickUp=0;
                        $rootScope.nightDrop=0;



                        var relDate;
                        var relTime;
                        var hours;
                        var minutes;
                        var relDuration;
                        var city;
                        var timeFormat;
                        var rptTime;
                        rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
                        if (angular.isDefined(bookingDetails.dutyType))
                        {
                            if (bookingDetails.dutyType == '2') 
                            {
                                dutyType = true;
                                relDate = $scope.mainRelDate;
                                relTime = bookingDetails.tohours + ':' + bookingDetails.tominutes + ':' + '00';
                                relDuration = '0';
                                city = bookingDetails.outstationCity;
                                city = city.replace(/, Maharashtra/g, '');
                                city = city.replace(/, India/g, '');



                                
                                if((bookingDetails.hours >= 22 || bookingDetails.hours <= 6) && (bookingDetails.tohours >= 22 || bookingDetails.tohours <= 6))
                                {
                                    $rootScope.nightPickUp=100;
                                    $rootScope.nightDrop=100;
                                }                                    
                                if((bookingDetails.hours >= 22 || bookingDetails.hours <= 6) || (bookingDetails.tohours >= 22 || bookingDetails.tohours <= 6)) 
                                {
                                    if(bookingDetails.hours >= 22 || bookingDetails.hours <= 6)
                                    {
                                        $rootScope.nightPickUp=100;
                                    }
                                    if(bookingDetails.tohours >= 22 || bookingDetails.tohours <= 6)
                                    {
                                        $rootScope.nightDrop=100;
                                    }
                                }



                                if((bookingDetails.hours < 22 && bookingDetails.hours > 6) && (bookingDetails.tohours < 22 && bookingDetails.tohours > 6))
                                {
                                    $rootScope.nightPickUp=0;
                                    $rootScope.nightDrop=0;
                                }


                            }
                            else 
                            {
                                  
                                  

                                dutyType = false;
                                var tempHour = 0;
                                var tempHour1 = 0;
                                tempHour1 = parseInt(bookingDetails.hours) + parseInt(bookingDetails.releavingHours); 

                                
                                    
                                if (tempHour1 > 23)
                                {
                                    tempHour = tempHour1 - 24;
                                    relTime = tempHour + ':' + bookingDetails.minutes + ':' + '00';

                                    var tempRelDate = new Date(
                                        $scope.mainDate.getFullYear(),
                                        $scope.mainDate.getMonth(),
                                        $scope.mainDate.getDate() + 1);


                                        if((tempHour<=6) && (bookingDetails.hours>=22))
                                        {
                                                $rootScope.nightCharge=200;
                                                
                                                if(bookingDetails.hours>=22)
                                                {
                                                        $rootScope.nightPickUp=100;                                                    
                                                }
                                                
                                                if(tempHour<=6)
                                                {
                                                        $rootScope.nightDrop=100;                                                    
                                                }

                                                console.log( $scope.nightCharge);
                                        }   
                                        else if(((tempHour<=6) || (tempHour>=22)) || ((bookingDetails.hours>=22) || (bookingDetails.hours<=6)))
                                        {
                                                $rootScope.nightCharge=100;
                                                
                                                

                                                if((tempHour<=6) || (tempHour>=22))
                                                {
                                                    $rootScope.nightDrop=100;
                                                }
                                                if((bookingDetails.hours>=22) || (bookingDetails.hours<=6))
                                                {
                                                    $rootScope.nightPickUp=100;
                                                }


                                        }
                                        else
                                        {
                                            $rootScope.nightCharge=0;
                                            
                                            
                                            $rootScope.nightPickUp=0;
                                            $rootScope.nightDrop=0;
                                        }


                                    relDate = tempRelDate;
                                } 
                                else 
                                {
                                    relTime = tempHour1 + ':' + bookingDetails.minutes + ':' + '00';

                                       
                                       if(((tempHour1<=6) || (tempHour1>=22)) || ((bookingDetails.hours>=22) || (bookingDetails.hours<=6)))
                                        {
                                            console.log( $scope.nightCharge);
                                                $rootScope.nightCharge=200;
                                                if((tempHour1<=6) || (tempHour1>=22))
                                                {
                                                    $rootScope.nightDrop=100;
                                                }
                                                if((bookingDetails.hours>=22) || (bookingDetails.hours<=6))
                                                {
                                                    $rootScope.nightPickUp=100;
                                                }

                                        }

                                        else if(((tempHour1<=6) || (tempHour1>=22)) || ((bookingDetails.hours>=22) || (bookingDetails.hours<=6)))
                                        {
                                           
                                                $rootScope.nightCharge=100;
                                                if((tempHour1<=6) || (tempHour1>=22))
                                                {
                                                    $rootScope.nightDrop=100;
                                                }
                                                if((bookingDetails.hours>=22) || (bookingDetails.hours<=6))
                                                {
                                                    $rootScope.nightPickUp=100;
                                                }
                                        }
                                        else
                                        {
                                            
                                            $rootScope.nightCharge=0;

                                             $rootScope.nightPickUp=0;
                                            $rootScope.nightDrop=0;
                                        }


                                    relDate = $scope.mainDate;
                                }

                            
                                relDuration = bookingDetails.releavingHours * 60;
                                city = null;

                            }
                        }
                        

                        var paymentMode;
                        if (angular.isDefined(bookingDetails.paymentMethod)) {
                            if (bookingDetails.paymentMethod == 'Cash By Office') {
                                paymentMode = 'C';
                            } else {
                                paymentMode = 'D';
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
                           
                        var cityLat = null;
                        var cityLng = null;
                        var totalAmt = '500';
                        
                          
                   



                    $scope.dropLat = 0;
                    $scope.dropLng = 0; 
                     
                         
                        var pickLat = 0;
                        var pickLong = 0;
            
                         if (journeyType === false && dutyType === true) {
                            Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.operationCitySelect
                        } 
                        }
                        
                        },function(s){
                            $rootScope.operationCityId=s.id;
                                console.log(s);
                        FareMatrix.calculateFare({
                                carType: 'OD',
                                isRoundTrip: journeyType,
                                isOutstation: dutyType,
                                actualReportingDate: $scope.mainDate,
                                actualReportingTime: rptTime,
                                actualReleivingDate: relDate,
                                actualReleivingTime: relTime,
                                pickupLat: pickLat,
                                pickupLng: pickLong,
                                dropLat: $scope.dropLat,
                                dropLng: $scope.dropLng,
                                operationCityId:$rootScope.operationCityId
                            },
                            function(response) {
                
                                console.log('log : ' + JSON.stringify(response));

                                $rootScope.bookingFare = [];
                                $rootScope.invoiceChargeDetail = response;

                                var totalAmount = 0;
                                var tempInvoiceHeadId = 0;
                                var tempInvoiceHeadName = '';
                                var headAmount = 0;
                                var caculate = 0;
                                
                                $rootScope.overtimehours=0;
                                $rootScope.overtimemins=0;
                                
                                

                                for (var i = 0; i < response.length; i++) {
                                    if (response[i].invoiceHeadId !== tempInvoiceHeadId) {
                                  if (response[i].invoiceHeadId ===3){
                                            
                                            caculate=(((response[i].amount)*60)/50)-Math.floor(((response[i].amount)*60)/50);
                                            $rootScope.overtimehours= Math.floor((response[i].amount)/50);
                                            $rootScope.overtimemins= Math.round(((response[i].amount%50)/0.83));
                                            if($rootScope.overtimemins>59)
                                          {
                                                $rootScope.overtimehours+=1;
                                                $rootScope.overtimemins=$rootScope.overtimemins-60;

                                          }

                                           }
                                        if (i !== 0) {
                                            $rootScope.bookingFare.push({
                                                invoiceHeadName: tempInvoiceHeadName,
                                                amount: headAmount

                                            });

                                        }

                                        headAmount = 0;
                                        headAmount = headAmount + response[i].amount;
                                        tempInvoiceHeadId = response[i].invoiceHeadId;
                                        tempInvoiceHeadName = response[i].invoiceHeadName;
                                    } else {
                                        headAmount = headAmount + response[i].amount;
                                    }
                                    totalAmount = totalAmount + response[i].amount;
                                    
                                }

                                $rootScope.bookingFare.push({
                                    invoiceHeadName: tempInvoiceHeadName,
                                    amount: headAmount
                                });

                                $rootScope.totalAmount = totalAmount;
                                $rootScope.loader = 0;
                                $scope.ConfirmBookingAmt();
                                 
                            },
                            function(error) {
                                console.log('error.', +JSON.stringify(error));
                                window.alert('Please check internet connection and try again later.');

                            });
                        },function(r){
                    });

                    } 
                    
                    else {
                         Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.operationCitySelect
                        } 
                        }
                        
                        },function(s){
                            $rootScope.operationCityId=s.id;
                                console.log(s);
                        FareMatrix.calculateFare({
                                carType: carType,
                                isRoundTrip: journeyType,
                                isOutstation: dutyType,
                                actualReportingDate: $scope.mainDate,
                                actualReportingTime: rptTime,
                                actualReleivingDate: relDate,
                                actualReleivingTime: relTime,
                                pickupLat: pickLat,
                                pickupLng: pickLong,
                                dropLat: $scope.dropLat,
                                dropLng: $scope.dropLng,
                                operationCityId:$rootScope.operationCityId
                            },
                            function(response) {
                            console.log('log', + JSON.stringify(response));

                                $rootScope.bookingFare = [];
                                $rootScope.invoiceChargeDetail = response;

                                var totalAmount = 0;
                                var tempInvoiceHeadId = 0;
                                var tempInvoiceHeadName = '';
                                var headAmount = 0;
                                var caculate=0;
                                $rootScope.overtimehours=0;
                                $rootScope.overtimemins=0;
                                

                                for (var i = 0; i < response.length; i++) {
                                    if (response[i].invoiceHeadId !== tempInvoiceHeadId) {
                                      if (response[i].invoiceHeadId ===3){



                                       
                                            caculate=(((response[i].amount)*60)/50)-Math.floor(((response[i].amount)*60)/50);
                                            $rootScope.overtimehours= Math.floor((response[i].amount)/50);
                                          $rootScope.overtimemins= Math.round(((response[i].amount%50)/0.83));
                                          if($rootScope.overtimemins>59)
                                          {
                                                $rootScope.overtimehours+=1;
                                                $rootScope.overtimemins=$rootScope.overtimemins-60;

                                          }


                                            
                                        }  
                                        if (i !== 0) {
                                            $scope.bookingFare.push({
                                                invoiceHeadName: tempInvoiceHeadName,
                                                amount: headAmount
                                            });
                                        }
                                        
                                        headAmount = 0;
                                        headAmount = headAmount + response[i].amount;
                                        tempInvoiceHeadId = response[i].invoiceHeadId;
                                        tempInvoiceHeadName = response[i].invoiceHeadName;
                                    } else {
                                        headAmount = headAmount + response[i].amount;
                                    }
                                    totalAmount = totalAmount + response[i].amount;
                                
                                }

                                $rootScope.bookingFare.push({
                                    invoiceHeadName: tempInvoiceHeadName,
                                    amount: headAmount
                                });

                                $rootScope.totalAmount = totalAmount;
                                $rootScope.loader = 0;
                                $scope.ConfirmBookingAmt();
                                 
                            },
                            function(error) {
                                 console.log('Please check internet connection and try again later.', +JSON.stringify(error));
                                window.alert('Please check internet connection and try again later.');
                                

                            });
                    },function(r){
                    });
                    }
                    

                    }

                   

            }
        };




        $rootScope.getUserforSelectedCity = function(city){//drop down selected operation city
            $rootScope.operationCitySelect = city;
          //  console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $rootScope.getBookings();
            reloadFunc(); 
             
        }
    
    

    $rootScope.fetchCancelReason = function() {//fetch the cancellation reasons
        CancellationReasons.find({},
            function(response) {
                //console.log('Cancelation reasion : ' + JSON.stringify(response));
                $rootScope.cancelationReasons1 = response;

            },
            function(error) {
                console.log('Error : ' + JSON.stringify(error));
            });
    };

    $scope.getNumber = function(num) {
        return new Array(num);
    }
    $rootScope.getBookings = function() {//get all bookings on page 
         $rootScope.loader = 1;
                if($rootScope.roleId === '1'){
                if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        $scope.tournamentList = [];
        var ONE_WEEK = 1 * 24 * 60 * 60 * 1000;
        var allBookingData = [];
        Bookings.getBookings({
             operationCity:$rootScope.operationCitySelect 
        }, function(bookingData) {
            console.log('Booking data  ' + JSON.stringify(bookingData));

            for (var i = 0; i < bookingData.length; i++) {
                var cname = '-';
                var cfName = '-';
                var cmName = '-';
                var clName = '-';
                var cid = '';
                var cellNumber = '-';
                var rateCount=0;
                    if(angular.isDefined(bookingData[i].rate_count) || bookingData[i].rate_count !== null){
                        rateCount = bookingData[i].rate_count;
                    }

              
                var drvId = '';
                 
                var driverShare = '0';
                var idShare = '0';
                var parsedDrvShare = '0';
                var parsedIdShare = '0';
                if (bookingData[i].driver_share != null && (!angular.isUndefined(bookingData[i].driver_share))) {
                    driverShare = bookingData[i].driver_share.toFixed(2);
                    
                }
                if (bookingData[i].id_share != null && (!angular.isUndefined(bookingData[i].id_share))) {
                    idShare = bookingData[i].id_share.toFixed(2);
                    
                }
                var landmark = ' ';
                if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                    landmark = bookingData[i].landmark + ', ';
                }

                var dutyType = '';
                if (!angular.isUndefined(bookingData[i].duty_type) || bookingData[i].duty_type !== null || bookingData[i].duty_type !== '') {
                    if (bookingData[i].duty_type == true) {
                        dutyType = 'O';
                    } else {
                        dutyType = 'L';
                    }
                }
                var orderStatus;
                if (!angular.isUndefined(bookingData[i].status) || bookingData[i].status !== null || bookingData[i].status !== '') {
                    if (bookingData[i].status === 'New Booking') {
                        orderStatus = 'A';
                    } else if (bookingData[i].status === 'Line Up') {
                        orderStatus = 'B';
                    } else if (bookingData[i].status === 'On Duty') {
                        orderStatus = 'C';
                    } else if (bookingData[i].status === 'Done') {
                        orderStatus = 'D';
                    } else if (bookingData[i].status === 'Paid') {
                        orderStatus = 'E';
                    } else {
                        orderStatus = 'F';
                    }
                }

                var tripType = '';
                if (!angular.isUndefined(bookingData[i].trip_type) || bookingData[i].trip_type !== null || bookingData[i].trip_type !== '') {
                    tripType = bookingData[i].trip_type;
                    if (bookingData[i].tripType === 'R') {
                        $scope.tripFlag = true;
                    } else {
                        $scope.tripFlag = false;
                    }
                }
                var role = '';
                if (!angular.isUndefined(bookingData[i].role_id) || bookingData[i].role_id !== null || bookingData[i].role_id !== '') {
                    role = bookingData[i].role_id;
                    if (bookingData[i].role_id === '2') {
                        $scope.tripRoleFlag = true;
                    } else {
                        $scope.tripRoleFlag = false;
                    }
                }

                allBookingData.push({
                    bookingId: bookingData[i].id,
                    customerId: cid,
                    custName: bookingData[i].customer_name,
                    carType: bookingData[i].car_type,
                    drvName: bookingData[i].driver_name,
                    rating: rateCount,
                    driverId: drvId, 
                    reportingLocation:  bookingData[i].reporting_location,
                    paymentMethod: bookingData[i].payment_method,
                    status: bookingData[i].status,
                    reportingDate: bookingData[i].reporting_date,
                    reportingTime: bookingData[i].reporting_time,
                    reportingDateAndTime: bookingData[i].reporting_date + ' ' + bookingData[i].reporting_time,
                    driverShare: driverShare,
                    idShare: idShare,
                    dutyType: dutyType,
                    driverPaymentStatus: bookingData[i].driverPaymentStatus,
                    bookingStatusOrder: orderStatus,
                    tripType: tripType,
                    role:role
                });
            }
            $rootScope.newBookingsData = allBookingData;
            $scope.data = allBookingData;
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
                        $scope.tournamentList = [];
        var ONE_WEEK = 3 * 24 * 60 * 60 * 1000;
        var allBookingData = [];
       Bookings.getBookings({
             operationCity:$rootScope.operationCitySelect 
        }, function(bookingData) {
            //console.log('Booking data  ' + JSON.stringify(bookingData));

            for (var i = 0; i < bookingData.length; i++) {
                var cname = '-';
                var cfName = '-';
                var cmName = '-';
                var clName = '-';
                var cid = '';
                var cellNumber = '-';
                var rateCount=0;
                    if(angular.isDefined(bookingData[i].rate_count) || bookingData[i].rate_count !== null){
                        rateCount = bookingData[i].rate_count;
                    }

               
 
                var drvId = '';
                var driverShare = '0';
                var idShare = '0';
                var parsedDrvShare = '0';
                var parsedIdShare = '0';
                if (bookingData[i].driver_share != null && (!angular.isUndefined(bookingData[i].driver_share))) {
                    driverShare = bookingData[i].driver_share.toFixed(2);
                    
                }
                if (bookingData[i].id_share != null && (!angular.isUndefined(bookingData[i].id_share))) {
                    idShare = bookingData[i].id_share.toFixed(2);
                    
                }
                var landmark = ' ';
                if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                    landmark = bookingData[i].landmark + ', ';
                }

                var dutyType = '';
                if (!angular.isUndefined(bookingData[i].duty_type) || bookingData[i].duty_type !== null || bookingData[i].duty_type !== '') {
                    if (bookingData[i].duty_type == true) {
                        dutyType = 'O';
                    } else {
                        dutyType = 'L';
                    }
                }
                var orderStatus;
                if (!angular.isUndefined(bookingData[i].status) || bookingData[i].status !== null || bookingData[i].status !== '') {
                    if (bookingData[i].status === 'New Booking') {
                        orderStatus = 'A';
                    } else if (bookingData[i].status === 'Line Up') {
                        orderStatus = 'B';
                    } else if (bookingData[i].status === 'On Duty') {
                        orderStatus = 'C';
                    } else if (bookingData[i].status === 'Done') {
                        orderStatus = 'D';
                    } else if (bookingData[i].status === 'Paid') {
                        orderStatus = 'E';
                    } else {
                        orderStatus = 'F';
                    }
                }

                var tripType = '';
                if (!angular.isUndefined(bookingData[i].trip_type) || bookingData[i].trip_type !== null || bookingData[i].trip_type !== '') {
                    tripType = bookingData[i].trip_type;
                    if (bookingData[i].tripType === 'R') {
                        $scope.tripFlag = true;
                    } else {
                        $scope.tripFlag = false;
                    }
                }
                var role = 0;
                if (!angular.isUndefined(bookingData[i].role_id) || bookingData[i].role_id !== null || bookingData[i].role_id !== '') {
                    role = bookingData[i].role_id;
                    if (bookingData[i].role_id === '2') {
                        $scope.tripRoleFlag = true;
                    } else {
                        $scope.tripRoleFlag = false;
                    }
                }

                allBookingData.push({
                    bookingId: bookingData[i].id,
                    customerId: cid,
                    custName: bookingData[i].customer_name,
                    carType: bookingData[i].car_type,
                    drvName: bookingData[i].driver_name,
                    rating: rateCount,
                    driverId: drvId, 
                    reportingLocation:  bookingData[i].reporting_location,
                    paymentMethod: bookingData[i].payment_method,
                    status: bookingData[i].status,
                    reportingDate: bookingData[i].reporting_date,
                    reportingTime: bookingData[i].reporting_time,
                    reportingDateAndTime: bookingData[i].reporting_date + ' ' + bookingData[i].reporting_time,
                    driverShare: driverShare,
                    idShare: idShare,
                    dutyType: dutyType,
                    driverPaymentStatus: bookingData[i].driverPaymentStatus,
                    bookingStatusOrder: orderStatus,
                    tripType: tripType,
                    role:role
                });
            }
            $rootScope.newBookingsData = allBookingData;
            $scope.data = allBookingData;
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
                $scope.tournamentList = [];
        var ONE_WEEK = 3 * 24 * 60 * 60 * 1000;
        var allBookingData = [];
        Bookings.getBookings({
             operationCity:$rootScope.operationCity
        }, function(bookingData) {
           // console.log('Booking data  ' + JSON.stringify(bookingData));

            for (var i = 0; i < bookingData.length; i++) {
                var cname = '-';
                var cfName = '-';
                var cmName = '-';
                var clName = '-';
                var cid = '';
                var cellNumber = '-';
                var rateCount=0;
                    if(angular.isDefined(bookingData[i].rate_count) || bookingData[i].rate_count !== null){
                        rateCount = bookingData[i].rate_count;
                    }

                
                var drvId = '';
                 
 
                var driverShare = '0';
                var idShare = '0';
                var parsedDrvShare = '0';
                var parsedIdShare = '0';
                if (bookingData[i].driver_share != null && (!angular.isUndefined(bookingData[i].driver_share))) {
                    driverShare = bookingData[i].driver_share.toFixed(2);
                    
                }
                if (bookingData[i].id_share != null && (!angular.isUndefined(bookingData[i].id_share))) {
                    idShare = bookingData[i].id_share.toFixed(2);
                    
                }
                var landmark = ' ';
                if (!angular.isUndefined(bookingData[i].landmark) || bookingData[i].landmark !== null || bookingData[i].landmark !== '') {
                    landmark = bookingData[i].landmark + ', ';
                }

                var dutyType = '';
                var dutyType = '';
                if (!angular.isUndefined(bookingData[i].duty_type) || bookingData[i].duty_type !== null || bookingData[i].duty_type !== '') {
                    if (bookingData[i].duty_type == true) {
                        dutyType = 'O';
                    } else {
                        dutyType = 'L';
                    }
                }
                var orderStatus;
                if (!angular.isUndefined(bookingData[i].status) || bookingData[i].status !== null || bookingData[i].status !== '') {
                    if (bookingData[i].status === 'New Booking') {
                        orderStatus = 'A';
                    } else if (bookingData[i].status === 'Line Up') {
                        orderStatus = 'B';
                    } else if (bookingData[i].status === 'On Duty') {
                        orderStatus = 'C';
                    } else if (bookingData[i].status === 'Done') {
                        orderStatus = 'D';
                    } else if (bookingData[i].status === 'Paid') {
                        orderStatus = 'E';
                    } else {
                        orderStatus = 'F';
                    }
                }

                var tripType = '';
                if (!angular.isUndefined(bookingData[i].trip_type) || bookingData[i].trip_type !== null || bookingData[i].trip_type !== '') {
                    tripType = bookingData[i].trip_type;
                    if (bookingData[i].tripType === 'R') {
                        $scope.tripFlag = true;
                    } else {
                        $scope.tripFlag = false;
                    }
                }
                var role = 0;
                if (!angular.isUndefined(bookingData[i].role_id) || bookingData[i].role_id !== null || bookingData[i].role_id !== '') {
                    role = bookingData[i].role_id;
                    if (bookingData[i].role_id === '2') {
                        $scope.tripRoleFlag = true;
                    } else {
                        $scope.tripRoleFlag = false;
                    }
                }

                allBookingData.push({
                    bookingId: bookingData[i].id,
                    customerId: cid,
                    custName: bookingData[i].customer_name,
                    carType: bookingData[i].car_type,
                    drvName: bookingData[i].driver_name,
                    rating: rateCount,
                    driverId: drvId, 
                    reportingLocation:  bookingData[i].reporting_location,
                    paymentMethod: bookingData[i].payment_method,
                    status: bookingData[i].status,
                    reportingDate: bookingData[i].reporting_date,
                    reportingTime: bookingData[i].reporting_time,
                    reportingDateAndTime: bookingData[i].reporting_date + ' ' + bookingData[i].reporting_time,
                    driverShare: driverShare,
                    idShare: idShare,
                    dutyType: dutyType,
                    driverPaymentStatus: bookingData[i].driverPaymentStatus,
                    bookingStatusOrder: orderStatus,
                    tripType: tripType,
                    role:role
                });
            }
            $rootScope.newBookingsData = allBookingData;
            $scope.data = allBookingData;
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

    $scope.toggleMin = function() {
        $scope.minDate;
    };
    $scope.toggleMin();
    $scope.openToDate = false;
    $scope.openedStart = false;
     $scope.openToDate1 = false;
     $scope.openedStart1 = false;
    $scope.openStart = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
        $scope.openToDate = false;

    };
    $scope.openStart1 = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart1 = true;
        $scope.openToDate1 = false;

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
    $scope.openedToDate1 = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openToDate1 = true;
        $scope.openedStart1 = false;

    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = !$scope.ismeridian;
    };

$rootScope.searchEnquiryDetails = function(searchfromData,searchToData, search) { //search enquiry from enquiry tab added

    var a = search;
    if(search ==='customer'){
        if (angular.isUndefined(searchfromData) && angular.isUndefined(searchToData)) {

                document.getElementById("fromDateId").innerHTML = 'Please select date.';

            } else {

                if(angular.isUndefined(searchfromData)  && angular.isUndefined(searchToData)){
                     document.getElementById("fromDateId").innerHTML = 'Please select date'; 

                }else if(angular.isUndefined(searchfromData)){
                       document.getElementById("fromDateId").innerHTML = 'Please select date';  
             }else if(angular.isUndefined(searchToData)){
                       document.getElementById("toDateId").innerHTML = 'Please select date';   
            } else{
                $scope.arr=[];

                $scope.arr.push(searchfromData);
                $scope.arr.push(searchToData);
                $scope.arr.push(a);
                
                $localStorage.put('EnquiryDetails', $scope.arr);
                $rootScope.setFlag2 = false;
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchEnquiry');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }
    search = undefined;
    a=undefined;
    }else{
 if (angular.isUndefined(searchfromData) && angular.isUndefined(searchToData)) {

                document.getElementById("fromDateId1").innerHTML = 'Please select date.';

            } else {

                if(angular.isUndefined(searchfromData)  && angular.isUndefined(searchToData)){
                     document.getElementById("fromDateId1").innerHTML = 'Please select date'; 

                }else if(angular.isUndefined(searchfromData)){
                       document.getElementById("fromDateId1").innerHTML = 'Please select date';  
             }else if(angular.isUndefined(searchToData)){
                       document.getElementById("toDateId1").innerHTML = 'Please select date';   
            } else{
                $scope.arr=[];

                $scope.arr.push(searchfromData);
                $scope.arr.push(searchToData);
                $scope.arr.push(a);
                $localStorage.put('EnquiryDetails', $scope.arr);
                $rootScope.setFlag2 = false;
                // console.log('create popup called.' + modelAssetId);
                $state.go('app.searchEnquiry');
                    }
                
                //$rootScope.searchPaymentCycleById(searchData);
            }
    search = undefined;
    a=undefined;
    }
            


        }
        $scope.backToEnquiry = function() {
            $localStorage.put('EnquiryDetails', undefined);
            
             
            $state.go('app.enquiry');

        }
        $rootScope.searchEnquiryData = function() {
             var EnquiryDetails = $localStorage.get('EnquiryDetails');
             var fromDate = moment(EnquiryDetails[0]).format('YYYY-MM-DD');
           var ToDate = moment(EnquiryDetails[1]).format('YYYY-MM-DD');
           var type = EnquiryDetails[2];
           if(type === 'customer'){
                 if($rootScope.roleId === '1'){
if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.enquiry');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCitySelect,
                type: type

            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

                    }else{
                        //operationcityselect
                        $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCitySelect,
                type: type

            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                    }
                }
                }else{
                    //operationcity
                    $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCity,
                type: type

            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                }
           }else{
             if($rootScope.roleId === '1'){
if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.enquiry');
                     $rootScope.loader = 0;
                }else{
                    if($rootScope.operationCitySelect === 'All'){
                        $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCitySelect,
                type: type

            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });

                    }else{
                        //operationcityselect
                        $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCitySelect,
                type: type
            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                    }
                }
                }else{
                    //operationcity
                    $rootScope.loader = 1;

            
             
             

            $rootScope.enquiryData = [];
            var allEnquiryData = [];

            ConUsers.getEnquiryDetail({
                fromDate : fromDate,
                toDate : ToDate,
                operationCity:$rootScope.operationCity,
                type: type

            }, function(enquiryData) {
                //console.log('driver data: '+JSON.stringify(driverData));

                for (var i = 0; i < enquiryData.length; i++) {
                     

                    allEnquiryData.push({
                        name: enquiryData[i].name,
                        contact: enquiryData[i].mobile_number,
                         opCity: enquiryData[i].operation_city,
                         createdBy: enquiryData[i].createdbyname
                    });


                }

                $rootScope.allEnquiryData = allEnquiryData;
                $scope.data = allEnquiryData;
                $scope.orginalData = allEnquiryData;
                //console.log('driver scope Data ' + JSON.stringify($scope.data));
                createTable();

                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error: ' + JSON.stringify(driverErr));
                $rootScope.loader = 0;
                console.log('driver error ' + JSON.stringify(driverErr));
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
            });
                }
           }

            
            


            


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

         //   console.log('Search data : ' + JSON.stringify(searchList));
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
    $scope.addBooking = function() {//open add booking popup

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
        //start addBookingCtrl sub controller
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getBookings();

        };
        $scope.paymentArray = [{
            'desc': 'Cash By Office'
        }, {
            'desc': 'Cash By Driver'
        }];
        $scope.tripArray = [{
            'desc': 'O'
        }, {
            'desc': 'R'
        }];
        $scope.dutyArray = [{
            'desc': 'Regular'
        }, {
            'desc': 'Immediate'
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
                // console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
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
            var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
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

        $scope.verifyMobile = function() {// check if mobile number exist r not if not take as new entry for booking

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

        $scope.verifyEmailFunction = function(bookingDetails) {//to check if email allready exist in system
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



          $rootScope.addBookingDetails = function(bookingDetails) {//add booking in database
            bookingDetails.address = bookingDetails.address.replace(/'/g, ' ');
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

            /*if (angular.isUndefined(bookingDetails.paymentMethod) || bookingDetails.paymentMethod === '' || bookingDetails.paymentMethod === null) {
                document.getElementById("paymentMethod").style.borderColor = "red";
                document.getElementById("paymentMethod1").innerHTML = '*required';
                bookingDetails.paymentMethod1 = 'This value is required';
                count++;
            } else {
                document.getElementById("paymentMethod").style.borderColor = "#dde6e9";
                document.getElementById("paymentMethod1").innerHTML = '';
                bookingDetails.paymentMethod1 = null;
            }*/

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
            if (angular.isUndefined(bookingDetails.landmark) || bookingDetails.landmark=== '' || bookingDetails.landmark === null)
           {
               document.getElementById("landmark").style.borderColor = "red";
               document.getElementById("landmark1").innerHTML = '*required';
               bookingDetails.landmark1 = 'This value is required';
               count++;
           }
         else
           {
                       document.getElementById("landmark").style.borderColor = "#dde6e9";
                       document.getElementById("landmark1").innerHTML = '';
                       bookingDetails.landmark1 = null;
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
/*
            if (angular.isUndefined(bookingDetails.dutyBasis) || bookingDetails.dutyBasis === '' || bookingDetails.dutyBasis === null) {
                document.getElementById("dutyBasis").style.borderColor = "red";
                document.getElementById("dutyBasis1").innerHTML = '*required';
                bookingDetails.dutyBasis1 = 'This value is required';
                count++;
            } else {
                document.getElementById("dutyBasis").style.borderColor = "#dde6e9";
                document.getElementById("dutyBasis1").innerHTML = '';
                bookingDetails.dutyBasis1 = null;
                if(bookingDetails.dutyBasis === 'Immediate'){
                  if (angular.isUndefined(bookingDetails.extraCharges) || bookingDetails.extraCharges === '' || bookingDetails.extraCharges === null) {
                document.getElementById("extraCharges").style.borderColor = "red";
                document.getElementById("extraCharges1").innerHTML = '*required';
                bookingDetails.extraCharges1 = 'This value is required';
                count++;
            } else {
                document.getElementById("extraCharges").style.borderColor = "#dde6e9";
                document.getElementById("extraCharges1").innerHTML = '';
                bookingDetails.extraCharges1 = null;
            }  
                }
            }*/


            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {
                var pickLat =null;
                var dropLat = null;
                var dropLng = null;
                var pickLong =null;
                var distance =0;
               // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText + '&types=geocode&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
                 var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + bookingDetails.address + '&types=geocode&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
                $http.post(mapUrl).success(function(result) {
                    $rootScope.pickAddressResults = result;
                     pickLat = $rootScope.pickAddressResults.results[0].geometry.location.lat;
                     pickLong = $rootScope.pickAddressResults.results[0].geometry.location.lng;
                    var mapUrl1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + bookingDetails.bookingToLocation + '&types=geocode&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
                    $http.post(mapUrl1).success(function(result1) {
                        if(result1.results.length>0){
                             dropLat = result1.results[0].geometry.location.lat;
                             dropLng = result1.results[0].geometry.location.lng;
                           
                        }
                    
                    
                  //  'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + pickLat + ',' + pickLong + '&destinations=' + dropLat + ',' + dropLng + '&language=en'
                
                  var distancemap='https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + pickLat + ',' + pickLong + '&destinations=' + dropLat + ',' + dropLng + '&mode=driving&language=en&key=AIzaSyAZVdypRwWG3MBmQXD12X1KPgt9lZDEKX4';
                $http.post(distancemap).success(function(resultresponce) {
                console.log('result' + JSON.stringify(resultresponce));
                if(dropLat!=null&&dropLng!=null){
                    if (resultresponce.rows[0].elements[0].status === 'ZERO_RESULTS') {
                         distance = 0;
                         dropLat = pickLat;
                         dropLng = pickLong; 
                    } else {
                         distance=Math.round((resultresponce['rows'][0]['elements'][0]['distance']['value'])/1000);
                     }
                }
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
                
                    var count1 = 0;
 
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
                        var pickAdd = bookingDetails.address.replace(/, Maharashtra (महाराष्ट्र)/g, '');
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
                        if (angular.isDefined(bookingDetails.tripType)) {
                            if (bookingDetails.tripType == 'R') {
                                paymentMode = 'C';
                            } else {
                                paymentMode = 'D';
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
                        // var pickupLat = null;
                        // var pickupLng = null;
                        // var dropLat = null;
                        // var dropLng = null;
                        var cityLat = null;
                        var cityLng = null;
                        var totalAmt = '500';
                        //var pickLat = $rootScope.pickAddressResults.results[0].geometry.location.lat;
                        //var pickLong = $rootScope.pickAddressResults.results[0].geometry.location.lng;
                        var d = new Date();
                    var curr_date = d.getDate();
                    var bookingDate1 = new Date(bookingDetails.reportingDate).getDate();
                    var curr_hour = d.getHours();
                    
             if((curr_date==bookingDate1) && (bookingDetails.hours-curr_hour) <=3 )
                    {
                        bookingDetails.dutyBasis = 'Regular';
                        bookingDetails.extraCharges = 50;
                        $rootScope.extraChargesforBooking =true;
                         
                    }else{
                        bookingDetails.dutyBasis = 'Regular';
                        bookingDetails.extraCharges = 0;
                        $rootScope.extraChargesforBooking =false;
                    }
                         

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
                                pickupAddress: pickAdd,
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
                                tripType: bookingDetails.tripType,
                               operationCity:$rootScope.operationCitySelect,
                               dutyBasis:bookingDetails.dutyBasis,
                               extraCharges:bookingDetails.extraCharges,
                               distance: distance

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

                                reloadFunc();
                                $rootScope.getBookings();
                                $rootScope.loader = 0;
                            }
                            }, function(bookingError) {
                                console.log('new customer booking error' + JSON.stringify(bookingError));
                                $scope.isDisabledButton = false;
                                if (bookingError.status == 0) {
                                    window.alert('Somthing Went Wrong! Try Again.');
                                   // $state.go('page.login');
                                }
                                //$modalInstance.dismiss('cancel');
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
                                        var pickAdd = bookingDetails.address.replace(/, Maharashtra (महाराष्ट्र)/g, '');
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
                                        pickupAddress: pickAdd,
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
                                        tripType: bookingDetails.tripType,
                                        operationCity:$rootScope.operationCitySelect,
                                        dutyBasis:bookingDetails.dutyBasis,
                                        extraCharges:bookingDetails.extraCharges,
                                        distance:distance

                                    }, function(bookingDataValues) {
                                        if(bookingDataValues[0].create_booking_for_admin ==='undefined'){
                                             $rootScope.loader = 0;
                                           $scope.isDisabledButton = false;
                                            window.alert('Something Went Wrong! Try Again.');  
                                        }else if(bookingDataValues[0].create_booking_for_admin === 'Unable to proceed'){
                                            $rootScope.loader = 0;
                                           $scope.isDisabledButton = false;
                                              window.alert('This Customer is Blocked in manage customer');
                                        }else{
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

                                        //console.log('bookingDataValues ' + JSON.stringify(bookingDataValues));
                                        
                                    }, function(bookingError) {
                                        console.log('bookingError ' + JSON.stringify(bookingError));
                                        $scope.isDisabledButton = false;
                                        if (bookingError.status == 0) {
                                            window.alert('Something Went Wrong! Try Again.');
                                            
                                        }
                                       // $modalInstance.dismiss('cancel');
                                        $rootScope.loader = 0;

                                    });
                                },
                                function(error) {
                                    console.log('Error updating Customer : ' + JSON.stringify(error));
                                    $scope.isDisabledButton = false;
                                    if (error.status == 0) {
                                        //window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                   // $modalInstance.dismiss('cancel');
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

              Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                               /* if($rootScope.extraChargesforBooking){
                                 var msg = 'Dear ' + smsData.firstName + ',%0aWe have taken utmost care while selecting driver, however we are not responsible for any type of losses including financial with respect to services. Need to make payment by cash immediately once trip is over. If not agree with this terms, please cancel the booking. extra Rs.50 will be charged for quick booking charges.  For queries '+ cnumber +' or info@indian-drivers.com.';
                                }else{
                                    var msg = 'Dear ' + smsData.firstName + ',%0aWe have taken utmost care while selecting driver, however we are not responsible for any type of losses including financial with respect to services. Need to make payment by cash immediately once trip is over. If not agree with this terms, please cancel the booking. For queries '+ cnumber +' or info@indian-drivers.com.';
                                }*/
                                var msg = 'Dear ' + smsData.firstName + '%0aWe have taken utmost care while selecting driver, however we are not responsible for any type of losses including financial with respect to services. Need to make payment by cash immediately once trip is over. If not agree with this terms, please cancel the booking. For queries '+ cnumber +' or info@indian-drivers.com.';
                                $rootScope.extraChargesforBooking= false;
 ConUsers.sendSMS({
                    mobileNumber: smsData.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });







                                },function(r){
                    });

           
        }
         function newBookingSMSOutstationOneway(bookingDetails, opcity) {
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', dated ' + rptDate + ' @ ' + rptTime + ' for Outstation One Way Trip has been received, driver details will be shared shortly. Driver\'s return Fare @Rs.1.75/km and return time @Rs.50/hr considering avg return speed of 35km/hr. Food allowance is included in the bill amount. For queries'+ cnumber +' or info@indian-drivers.com.';
            

ConUsers.sendSMS({
                    mobileNumber: bookingDetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });


            
                                },function(r){
                    });
             
           
        };

   function newBookingSMSOutstationRound(bookingDetails, opcity) {

             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Driver\'s food allowance is included in the bill. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: bookingDetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });                    },function(r){
                    });
             
           

        };

          function newBookingSMSLocalOneway(bookingDetails, opcity) {

              Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Oneway Trip has been received for which Rs.100/- return fare additional will be applicable , driver details will be shared two hours before the trip.For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: bookingDetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
             
            
        }

     function newBookingSMSLocalRound(bookingDetails, opcity) {

                Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                var rptTime = bookingDetails.hours + ':' + bookingDetails.minutes + ':' + '00';
            var rptDate = moment(bookingDetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + bookingDetails.firstName + ',%0aYour booking Id: ' + $rootScope.newBookingId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round Trip has been received, driver details will be shared two hours before the trip. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: bookingDetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
            
        };

       function newBookingSMSOutstaionOneway1(customerSMSdetails, opcity) {

             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
           var msg = 'Dear ' + customerSMSdetails.firstName + ', Your booking Id: ' + $rootScope.newBookId + ', dated ' + rptDate + ' @ ' + rptTime + ' for Outstation One Way Trip has been received, driver details will be shared shortly. Driver\'s return Fare @Rs.1.75/km and return time @Rs.50/hr considering avg return speed of 35km/hr. Food allowance is included in the bill amount. For queries'+ cnumber +' or info@indian-drivers.com.';
                    
            ConUsers.sendSMS({
                    mobileNumber: customerSMSdetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
           

        };

    function newBookingSMSOutstationRound1(customerSMSdetails, opcity) {
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var relTime = customerSMSdetails.tohours + ':' + customerSMSdetails.tominutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var relDate = moment(customerSMSdetails.bookingToDate).format('DD-MM-YYYY');
           var msg = '\'Dear ' + customerSMSdetails.firstName + ', Your booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Driver\'s food allowance is included in the bill. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: customerSMSdetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
            

        };

        function newBookingSMSLocalOneway1(customerSMSdetails, opcity) {
             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = 'Dear ' + customerSMSdetails.firstName + ', Your booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Oneway Trip has been received for which Rs.100/- return fare additional will be applicable , driver details will be shared two hours before the trip.For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: customerSMSdetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
             
           

        }

        function newBookingSMSLocalRound1(customerSMSdetails, opcity) {
              Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
 var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
           var msg = '\'Dear ' + customerSMSdetails.firstName + ', Your booking Id: ' + $rootScope.newBookId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round Trip has been received, driver details will be shared two hours before the trip. For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: customerSMSdetails.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
                                },function(r){
                    });
           

        };

        $scope.closeModal = function() {
            $rootScope.bookingDetails = undefined;
            $rootScope.cellNo = undefined;
            $modalInstance.dismiss('cancel');
            //$rootScope.getBookings();
        };

    }; //end of addBookingCtrl cotroller


    var newBookingCtrl = function($scope, $rootScope, $modalInstance) {
//new booking model controller starts newBookingCtrl
        $scope.searchDriver = false;
        if ($rootScope.bookingReportData.status == 'New Booking') {
            $scope.allocateDriver = true;
            $scope.cancelButton = true;
        }
         $scope.bookingHistoryDetails = function(booking) {

           // $rootScope.data = $rootScope.bookingDetailsData;

           // $scope.historyDetails()
            $rootScope.bookinghist = booking;
            var modalInstance = $modal.open({
                templateUrl: '/bookingHistoryDetails.html',
                controller: bookingHistoryDetailsCtrl
            });
            //historyDetails(booking);
        
            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

        $scope.tripArray = [{
            'desc': 'O'
        }, {
            'desc': 'R'
        }];
        $scope.dutyArray = [{
            'desc': 'Regular'
        }, {
            'desc': 'Immediate'
        }];

        $scope.CancelBookingPopUp = function() {

            console.log('cancelBooking popup');
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

                    var cancelName = ' Booking cancelled by ' + $scope.Aname + ' on ';
                    Bookings.cancelBookingForAdmin({
                            bookingId: $rootScope.cancelDetails1.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.cancelationReasons1.comment + ' ' + cancelName,
                            userId: $rootScope.userId

                        },

                        function(response) {
                            //console.log('booking for cancellation:' + JSON.stringify(response));
                             //console.log('booking for cancellation:' + JSON.stringify(response));
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
                            }else {

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

             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment(cancelSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
           
ConUsers.sendSMS({
                    mobileNumber: cancelSMS.bookingCellNumber,
                    msg: msg
                }, function(mgssuccess) {
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
            
                                 },function(r){
                    });
           

        };

        $scope.newBookingMobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                //console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $rootScope.driverId1 = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.cellNo1 = $scope.search.mobileNumber.originalObject.mobileNumber;
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
                }
                else if (dutyReport[0].accept_duty == 'Driver  blocked for this customer') {
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
 Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + customerSMS.bookingFirstName + ',%0a Driver Name: ' + driverSMS.originalObject.driverName + ' (Contact Number: ' + driverSMS.originalObject.mobileNumber + ') has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateNewBookings.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';
            
ConUsers.sendSMS({
                    mobileNumber: customerSMS.bookingCellNumber,
                    msg: msg
                }, function(mgssuccess) {
                    driverSMSFunction(customerSMS, driverSMS);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });


             
                                },function(r){
                    });
           
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
                var relHour = ' Releiving Hours:' + customerSMS.totalDuration;
            } else {
                var relDate = moment(customerSMS.bookingToDate).format('DD-MM-YYYY');
                var relHour = ' Releiving on: ' + relDate + ' @ ' + relTime
            }
            if (customerSMS.bookingToLocation === 'Round Trip') {
                var dropadd = ' ';
            } else {
                var dropadd = ' Drop Address:' + customerSMS.bookingToLocation;
            }

            var picadd = ', Pickup Address:' + landmark + ', ' + customerSMS.bookingFrmLocation;
            var reportingTime = customerSMS.hours + ':' + customerSMS.minutes + ':' + '00';
            var msg = 'Hi ' + driverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.allocateNewBookings.bookingId + ' Duty Type: ' + customerSMS.dutyType + ' ' + customerSMS.journeyType + ' Car Type: ' + customerSMS.carType + ' Dated on: ' + rptDate + ' @ ' + reportingTime + relHour + picadd + dropadd + ' Client Name: ' + customerSMS.bookingFirstName + '-' + customerSMS.bookingCellNumber;
            
ConUsers.sendSMS({
                    mobileNumber: driverSMS.originalObject.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

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
                operationCity: $rootScope.operationCity
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

         $scope.getNewBooking = function() {//get new booking selected one
            $rootScope.loader = 1;
            //console.log('called new booking ');
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
                    console.log('booking: '+JSON.stringify(bookingData));
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
                        var frommin = arr1[1];
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
                        var dutyHours = 0;
                        if (angular.isDefined(bookingData.localBookings) && bookingData.localBookings.length > 0) {
                            if (bookingData.localBookings[0].releavingDuration != null || bookingData.localBookings[0].releavingDuration != '' || (!angular.isUndefined(bookingData.localBookings[0].releavingDuration))) {
                                dutyHours = Math.round(bookingData.localBookings[0].releavingDuration / 60);
                            }
                        }

                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = arr[1];
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
                                    returnFare = (bookingData.outstationBookings[0].returnTravelTime).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime)-125).toFixed(2) + ' KM ' + '* 6)';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            if(bookingData.operationCity === 'Aurangabad'){
                              returnFare = '50';  
                            }else{
                                returnFare = '100';
                            }
                            
                            returnFareText = ' ';
                        } else {
                            returnFare = '0';
                            returnFareText = ' ';
                        }
                        var returnTravelHours = '0';
                        var returnTime = '0';
                        if (bookingData.outstationBookings.length > 0) {
                            var cancelledReleivingDate = bookingData.outstationBookings[0].releavingDate;
                            var cancelledReleivingTime = bookingData.outstationBookings[0].releavingTime;
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

                        if (bookingData.status === 'Cancelled') {
                            CancellationReasons.findById({
                                id: bookingData.cancellationId
                            }, function(cancellationData) {
                                //console.log('cancel reason in daily report new booking');
                                $rootScope.cancelReason1 = cancellationData.desc;

                            }, function(error) {
                                console.log('cancel reason fetch error' + JSON.stringify(error));
                            });
                        }
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
                                    returnFareAmt: returnFareText,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark,
                                    cancelledToDate: cancelledReleivingDate,
                                    cancelledToTime: cancelledReleivingTime,
                                    localDutyHours: dutyHours,
                                    history:history,
                                    opCity: bookingData.operationCity,
                                    tripType: bookingData.tripType,
                                    dutyBasis:bookingData.dutyBasis,
                                    extraCharges:bookingData.extraCharges

                                };
                                $rootScope.allocateNewBookings = $scope.booking;
                                $rootScope.cancelDetails1 = $scope.booking;
                                $rootScope.loader = 0;
                                $scope.getNewBookingDriverMobile();

                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
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

        $scope.updateDateAndTime = function(booking) {//update booking reporting date and time to update invoice

            //var url = 'http://192.168.1.104:3000';
            var url = 'http://65.0.186.134:3000';
            //var url = 'http://43.240.67.79:3000';
            $rootScope.loader = 1;
            var count = 0;
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
            var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
            var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
            var date1 = new Date(rptDate);
            var date2 = new Date(relDate);
            //console.log('booking details' + JSON.stringify(booking));
            if (angular.isUndefined(booking.bookingReportingDate) || booking.bookingReportingDate === '' || booking.bookingReportingDate === null) {
                document.getElementById("bookingReportingDate").style.borderColor = "red";
                document.getElementById("bookingReportingDate1").innerHTML = '*required';
                booking.bookingReportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingReportingDate1").innerHTML = '';
                booking.bookingReportingDate1 = null;
            }
            if (angular.isUndefined(booking.hours) || booking.hours === '' || booking.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                booking.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                booking.hours1 = null;
            }
            if (angular.isUndefined(booking.minutes) || booking.minutes === '' || booking.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                booking.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                booking.minutes1 = null;
            }


            if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                document.getElementById("bookingToDate").style.borderColor = "red";
                document.getElementById("bookingToDate1").innerHTML = '*required';
                booking.bookingToDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingToDate1").innerHTML = '';
                booking.bookingToDate1 = null;
                 if (booking.dutyType === 'Outstation') {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    }else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("toHours").style.borderColor = "red";
                            document.getElementById("toMinutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("toHours").style.borderColor = "#dde6e9";
                            document.getElementById("toMinutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }
                } else {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("toHours").style.borderColor = "red";
                            document.getElementById("toMinutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("toHours").style.borderColor = "#dde6e9";
                            document.getElementById("toMinutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;
                    }
                }
            }

            /*if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null) {
                document.getElementById("toHours").style.borderColor = "red";
                document.getElementById("toHours1").innerHTML = '*required';
                booking.toHours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("toHours").style.borderColor = "#dde6e9";
                document.getElementById("toHours").innerHTML = '';
                booking.toHours = null;
            }
            if (angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                document.getElementById("toMinutes").style.borderColor = "red";
                document.getElementById("toMinutes1").innerHTML = '*required';
                booking.toMinutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("toMinutes").style.borderColor = "#dde6e9";
                document.getElementById("toMinutes1").innerHTML = '';
                booking.toMinutes1 = null;
            }*/

             if(angular.isUndefined(booking.remark) || (booking.remark === '' ) || booking.remark === null || booking.remark==='undefined'){
                var remark='';
            }
            else{
                var remark=booking.remark;
            }
            var extracharges = 0;
            if(booking.dutyBasis === 'Immediate'){
                    extracharges = Number(booking.extraCharges);
            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
                var rptTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                               
                Bookings.find({
                    filter: {
                        where: {
                            id: booking.bookingId
                        },
                        include: [{
                            relation: 'invoices'

                        }, {
                            relation: 'outstationBookings'


                        }]
                    }
                }, function(success) {
                    //console.log('booking success' + JSON.stringify(success));
                    $scope.successdata = success;
                    if(booking.dutyBasis === 'Immediate'){
                     if(success[0].dutyBasis === 'Regular' && success[0].extraCharges === 0){
                            var dutyBasis = 'ID_Immediate';
                            var extraCharges = 0;
                    } else{
                       var dutyBasis = booking.dutyBasis;
                        var extraCharges = Number(booking.extraCharges);
                    }  
                    }else{
                       var dutyBasis = booking.dutyBasis;
                        var extraCharges = Number(booking.extraCharges);
                    }
                    
                    success[0].dutyBasis = dutyBasis;
                    success[0].extraCharges = extraCharges;
                    success[0].reportingDate = rptDate;
                    success[0].remark = remark;
                    success[0].tripType = booking.tripType;
                    success[0].reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';
                    success[0].updatedDate = new Date();
                    success[0].updatedBy = $rootScope.userId;
                    success[0].$save();
                    BookingDetails.create({
                        bookingId:$scope.booking.bookingId,
                        reportingDate:$scope.successdata[0].invoices[0].reportingDate,
                        reportingTime:$scope.successdata[0].invoices[0].reportingTime,
                        releavingDate:$scope.successdata[0].invoices[0].releavingDate,
                        releavingTime:$scope.successdata[0].invoices[0].releavingTime,
                        status:$scope.successdata[0].status

                    },function(success){

                    },function(er){

                    });

                    if (success[0].isOutstation === true) {
                        OutstationBookings.find({
                            filter: {
                                where: {
                                    bookingId: booking.bookingId
                                }
                            }
                        }, function(OBSuccess) {
                            //console.log('OutstationBookings details' + JSON.stringify(OBSuccess));
                            OBSuccess[0].releavingDate = relDate;
                            OBSuccess[0].releavingTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            OBSuccess[0].updatedBy = $rootScope.userId;
                            OBSuccess[0].updatedDate = new Date();
                            OBSuccess[0].$save();
                        }, function(OBErr) {
                            console.log('OutstationBookings error' + JSON.stringify(OBErr));
                        });
                    }


                    Invoices.upsert({
                        id: success[0].invoices[0].id,
                        reportingDate: rptDate,
                        reportingTime: booking.hours + ':' + booking.minutes + ':' + '00',
                        releavingDate: relDate,
                        releavingTime: booking.tohours + ':' + booking.tominutes + ':' + '00',
                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        //console.log('invoice A:' + JSON.stringify(s));
                        var obj = {
                            "bookingId": booking.bookingId,
                            "requestFrom": "ADMIN_OFF",
                            "offDutyDate": relDate,
                            "offDutyTime": relTime
                        };
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated invoices successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getBookings();
                            $rootScope.loader = 0;
                        }).
                        error(function(error) {
                            console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                        });



                    }, function(e) {
                        console.log('error:' + JSON.stringify(e));

                        if (e.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;

                    });
                }, function(error) {
                    console.log('booking error' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });

            }

        }

    };// end of newBookingCtrl


    var lineUpBookingCtrl = function($scope, $rootScope, $modalInstance, $state, BookingDetails) {
//start lineUpBookingCtrl sub controller
        $scope.searchDriver = false;
        $scope.tripArray = [{
            'desc': 'O'
        }, {
            'desc': 'R'
        }];


         $scope.bookingHistoryDetails = function(booking) {

           // $rootScope.data = $rootScope.bookingDetailsData;

           // $scope.historyDetails()
            $rootScope.bookinghist = booking;
            var modalInstance = $modal.open({
                templateUrl: '/bookingHistoryDetails.html',
                controller: bookingHistoryDetailsCtrl
            });
            //historyDetails(booking);
        
            var state = $('#modal-state');
            modalInstance.result.then(function() {
                state.text('Modal dismissed with OK status');
            }, function() {
                state.text('Modal dismissed with Cancel status');
            });
        };

                   


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
        $scope.confirmPaymentMethod1 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton1 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Online.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod1();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton1 = false;

            }
        }
        $scope.confirmPaymentMethod2 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton2 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Cash By Office.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod2();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton2 = false;

            }
        }
        $scope.confirmPaymentMethod3 = function() {
            $rootScope.loader = 1;
            $scope.paidDisabledButton3 = true;
            if ($window.confirm("Are you sure? You want to change payment method as Cash By Driver.")) {
                $scope.result = "Yes";
                $scope.savePaymentMethod3();
                $rootScope.loader = 0;
            } else {
                $scope.result = "No";
                $rootScope.loader = 0;
                $scope.paidDisabledButton3 = false;

            }
        }
        $scope.savePaymentMethod1 = function() {
            $rootScope.loader = 1;
            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'O',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));
                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
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

            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton1 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

        }

        $scope.savePaymentMethod2 = function() {
            $rootScope.loader = 1;

            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'C',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));

                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
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


            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton2 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });


        }


        $scope.savePaymentMethod3 = function() {
            $rootScope.loader = 1;

            Bookings.paidDutyFunction({
                bookingId: $rootScope.lineupBookingDetails.bookingId,
                paymentMethod: 'D',
                userId: $rootScope.userId
            }, function(paymentSuccess) {
                //console.log('save payment method success: ' + JSON.stringify(paymentSuccess));

                if (paymentSuccess[0].paid_duty_function === '0') {
                    $.notify('Payment of this duty has been done successfully.', {
                        status: 'success'
                    });
                    $modalInstance.dismiss('cancel');
                    reloadFunc();
                    $rootScope.getBookings();
                    $rootScope.loader = 0;
                } else if (paymentSuccess[0].paid_duty_function === 'Paid') {
                    $.notify('Payment of this duty has been already paid.', {
                        status: 'danger'
                    });
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


            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $scope.paidDisabledButton3 = false;
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

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
                            cancellationReason: $rootScope.cancelationReasons1.comment + ' ' + cancelName,
                            userId: $rootScope.userId

                        },

                        function(response) {
                            //console.log('response ' + JSON.stringify(response));
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

                function cancelCustomerSMS(cancelData, opcity) {
                           Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);

                                var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            //var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var msg ='Hi ' + cancelData.bookingFirstName + ', your booking Id: ' + $rootScope.lineupBookingDetails.bookingId + 'reporting date '+ rptDate+' time '+cnumber+' has been cancelled. please reach us on 020-67641000 or info@indian-drivers.com..'
            ConUsers.sendSMS({
                    mobileNumber: cancelData.bookingCellNumber,
                    msg: msg
                }, function(mgssuccess) {
                    cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
              

             

                        },function(r){
                    });


            
        };

        function cancelDriverSMS(cancelData, opcity) {
             Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                
            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            //var msg = 'Your duty dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ', has been cancelled, For queries kindly contact '+ cnumber +' or info@indian-drivers.com.';
            var msg = 'Hi ' + cancelData.driverFirstName +', Duty details assigned to you, booking Id: ' + $rootScope.lineupBookingDetails.bookingId + ' reporting date ' + rptDate +' time ' + cancelData.reportingTime +' has been cancelled. please reach us on 020-67641000 or info@indian-drivers.com..'
            ConUsers.sendSMS({
                    mobileNumber: cancelData.driverContact,
                    msg: msg
                }, function(mgssuccess) {
                    
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
            
             },function(r){
                    });
        };

         $scope.updateRemark = function(booking) {// update booking remark at any time
        if(angular.isUndefined(booking.remark) || (booking.remark === '' ) || booking.remark === null || booking.remark==='undefined')
        {
            var remark='';
        }
        else
        {
            var remark=booking.remark;
        }

        Bookings.find({
                    filter: {
                        where: {
                            id: booking.bookingId
                        }
                    }
                },function(success){
                    success[0].remark = remark;
                    success[0].tripType= booking.tripType;
                    success[0].updatedDate = new Date();
                    success[0].updatedBy = $rootScope.userId;
                    success[0].$save();
                     $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getBookings();
                            $rootScope.loader = 0;
                },function(error){

                });
    };

        $scope.monitorStartDutyDate = function() {
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/StartDutyDatePopup.html',
                controller: lineUpBookingCtrl
            });
        };
         $scope.monitorOffDutyDate = function(booking) {
            $rootScope.cityForOffDuty = booking.operationCity;
            $rootScope.dutyType = booking.dutyType;
            $rootScope.journeyType = booking.journeyType;
            $rootScope.offDutyAddress = booking.bookingToLocation;
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/OffDutyDatePopup.html',
                controller: lineUpBookingCtrl
            });
        };

        $scope.startDuty = function(booking) {
           // var url = 'http://192.168.1.104:3000';
            var url = 'http://65.0.186.134:3000';
           // var url = 'http://43.240.67.79:3000';
            $scope.isDisabledButton = true;

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
       $scope.offDuty = function(booking, offDutyAddress, journeyType) {
            $rootScope.loader = 1;
            $scope.isDisabled = true;

            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            var count = 0;
            var currentDate = new Date();

            var h = addZero(currentDate.getHours());
            var m = addZero(currentDate.getMinutes());
            var s = addZero(currentDate.getSeconds());
            var currentTime = h + ':' + m + ':' + s;
            var currentDate1 = moment(currentDate).format('YYYY-MM-DD');
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var date1 = new Date(rptDate);
            date1.setHours($rootScope.lineupBookingDetails.hours);
            date1.setMinutes($rootScope.lineupBookingDetails.minutes);
           //var url = 'http://192.168.1.104:3000';
            var url = 'http://65.0.186.134:3000';
            //var url = 'http://43.240.67.79:3000';

            if (angular.isUndefined(booking) || booking === '' || booking === null) {
                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                        document.getElementById("bookingReleivingTime").style.borderColor = "red";
                        document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                        count++;
                        $scope.isDisabled = false;
                    } else {
                        document.getElementById("bookingToDatelocal").style.borderColor = "red";
                        document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                        document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                        document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                        $scope.isDisabled = false;
                        count++;

                    }
                }
            } else {
                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType === 'Outstation') {
                        if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                            document.getElementById("bookingToDate").style.borderColor = "red";
                            document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should not be blank';
                            document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1").innerHTML = '';
                            count++;
                            $scope.isDisabled = false;
                        } else if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null || angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                            document.getElementById("bookingReleivingTime").style.borderColor = "red";
                            document.getElementById("bookingReleivingTime1").innerHTML = 'Releiving Time should not be blank ';
                            document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1").innerHTML = '';
                            count++;
                            $scope.isDisabled = false;
                        } else {
                            document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1").innerHTML = '';
                            document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1").innerHTML = '';
                            $scope.isDisabled = true;
                            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                            var relTime1 = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            var date2 = new Date(relDate);
                            date2.setHours(booking.tohours);
                            date2.setMinutes(booking.tominutes);
                            if (date2 < date1) {
                                document.getElementById("bookingToDate").style.borderColor = "red";
                                document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                count++;
                            } else if (date2.getTime() === date1.getTime()) {
                                var hour, minute, hours, minutes;

                                hour = parseInt(relTime1.split(":")[0]);
                                hours = parseInt(rptTime.split(":")[0]);

                                minute = parseInt(relTime1.split(":")[1]);
                                minutes = parseInt(rptTime.split(":")[1]);

                                var rptDay = new Date(rptDate);
                                var givenDate = new Date(relDate);
                                givenDate.setHours(hour);
                                givenDate.setMinutes(minute);
                                rptDay.setHours(hours);
                                rptDay.setMinutes(minutes);

                                if (givenDate < rptDay) {
                                    document.getElementById("bookingToDate").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                    document.getElementById("bookingToDate1").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    booking.bookingToDate1 = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    count++;

                                }  else {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTime1").innerHTML = '';
                                    // booking.bookingToDate1local = null;
                                }
                                    if(journeyType !== 'One Way'){
                                      if (givenDate > currentDate) {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime1").innerHTML = 'Not able to Off future duty';
                                    booking.bookingReleivingTime1local = 'Not able to Off future duty';
                                    count++;
                                }else {
                                    document.getElementById("bookingReleivingTime").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTime1").innerHTML = '';
                                    // booking.bookingToDate1local = null;
                                }  
                                    }
                                 


                            } else {
                                document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                                document.getElementById("bookingToDate1").innerHTML = '';
                                booking.bookingToDate1 = null;

                            }

                             if(journeyType !== 'One Way'){
                               if (date2 > currentDate) {
                                document.getElementById("bookingToDate").style.borderBottom = "1px solid red";
                                document.getElementById("bookingToDate1").innerHTML = 'Not able to Off future date duty';

                                count++;
                            } else {
                                document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                                document.getElementById("bookingToDate1").innerHTML = '';
                                booking.bookingToDate1 = null;

                            } 
                             }
                        }

                    } else {

                        if (angular.isUndefined(booking.toDate) || booking.toDate === '' || booking.toDate === null) {
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1local").innerHTML = '';
                            document.getElementById("bookingToDatelocal").style.borderColor = "red";
                            document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should not be blank';
                            count++;
                            $scope.isDisabled = false;
                        } else if (angular.isUndefined(booking.tohour1) || booking.tohour1 === '' || booking.tohour1 === null || angular.isUndefined(booking.tomin1) || booking.tomin1 === '' || booking.tomin1 === null) {
                            document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1local").innerHTML = '';
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                            document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should not be blank ';
                            count++;
                            $scope.isDisabled = false;
                        } else {
                            document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingToDate1local").innerHTML = '';
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1local").innerHTML = '';
                            $scope.isDisabled = true;
                            var relDate1 = moment(booking.toDate).format('YYYY-MM-DD');
                            var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                            var date3 = new Date(relDate1);
                            date3.setHours(booking.tohour1);
                            date3.setMinutes(booking.tomin1);
                            if (date3 < date1) {
                                document.getElementById("bookingToDatelocal").style.borderColor = "red";
                                document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                count++;
                            } else if (date3.getTime() == date1.getTime()) {
                                var hour, minute, hours, minutes;

                                hour = parseInt(relTime.split(":")[0]);
                                hours = parseInt(rptTime.split(":")[0]);

                                minute = parseInt(relTime.split(":")[1]);
                                minutes = parseInt(rptTime.split(":")[1]);

                                var rptDay = new Date(rptDate);
                                var givenDate = new Date(relDate1);
                                givenDate.setHours(hour);
                                givenDate.setMinutes(minute);
                                rptDay.setHours(hours);
                                rptDay.setMinutes(minutes);

                                if (givenDate < rptDay) {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                    document.getElementById("bookingToDatelocal").style.borderColor = "red";
                                    document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    booking.bookingToDate1local = 'Releiving Date and Time should be greater than Reporting Date and Time';
                                    count++;

                                }else if (givenDate > currentDate) {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                                    document.getElementById("bookingReleivingTime1local").innerHTML = 'Not able to Off future duty';
                                    booking.bookingReleivingTime1local = 'Not able to Off future duty';
                                    count++;
                                }   else {
                                    document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                                    document.getElementById("bookingReleivingTimelocal").innerHTML = '';
                                }

                            } else if (date3 > currentDate) {
                                document.getElementById("bookingToDatelocal").style.borderBottom = "1px solid red";
                                document.getElementById("bookingToDate1local").innerHTML = 'Not able to Off future date duty';
                                count++;
                            } else {
                                document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                                document.getElementById("bookingToDate1local").innerHTML = '';
                            }
                        }
                    }
                }

            }
            if (angular.isUndefined(offDutyAddress) || offDutyAddress === '' || offDutyAddress === null) {
                document.getElementById("bookingToLocation").style.borderColor = "red";
                document.getElementById("bookingToLocation1").innerHTML = '*required';
                $scope.isDisabled = false;
                count++;
            } else {
                document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                document.getElementById("bookingToLocation1").innerHTML = '';
            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabled = false;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                $rootScope.currentBookingoff1 = booking;
                if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                    if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {

                        var offDutyDate = moment(booking.toDate).format('YYYY-MM-DD');
                        var offDutyTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                        $scope.travelTime = null;
                    } else {
                        var travelTimeRelMin = ((parseInt(booking.tohours) * 60) + parseInt(booking.tominutes));
                        var travelTimeRepMin = ((parseInt($rootScope.lineupBookingDetails.hours) * 60) + parseInt($rootScope.lineupBookingDetails.minutes));
                        $scope.travelTime = (travelTimeRelMin - travelTimeRepMin);
                        var offDutyTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                        var offDutyDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
                    }
                }
                var obj = {
                    "bookingId": $rootScope.lineupBookingDetails.bookingId,
                    "requestFrom": "ADMIN_OFF",
                    "offDutyDate": offDutyDate,
                    "offDutyTime": offDutyTime
                };
                if(journeyType === 'One Way'){
                    
                        var dropLat1 = 0;
                    var dropLong1 = 0;
                    console.log(dropLat1);
                    console.log(dropLong1); 
                    Bookings.offDutyForAdmin({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        totalTravelTime: $scope.travelTime,
                        releivingDate: offDutyDate,
                        releivingTime: offDutyTime,
                        dropLocation: offDutyAddress,
                        dropLat: dropLat1,
                        dropLong: dropLong1,
                        updatedBy: $rootScope.userId
                    }, function(offDutySuccess) {
                        //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            if (result.length > 0) {
                                $rootScope.offDutyFlag = false;
                                $rootScope.startDutyFlag = true;
                                $scope.billedAmount = result[0].amount;
                                sendSmsToCustomerAtOff(booking);
                                sendSmsToDriverAtOff(booking);
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getBookings();
                                $rootScope.loader = 0;
                            }

                        }).
                        error(function(error) {
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                            $scope.isDisabled = false;
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });

                    }, function(offDutyError) {
                        console.log('offDutyError' + JSON.stringify(offDutyError));
                        $scope.isDisabled = false;
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });
                     $scope.isDisabled = false;
                     
                    
                      
                }else{
                    var dropLat1 = 0;
                    var dropLong1 = 0; 
                    Bookings.offDutyForAdmin({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        totalTravelTime: $scope.travelTime,
                        releivingDate: offDutyDate,
                        releivingTime: offDutyTime,
                        dropLocation: offDutyAddress,
                        dropLat: dropLat1,
                        dropLong: dropLong1,
                        updatedBy: $rootScope.userId
                    }, function(offDutySuccess) {
                        //console.log('offDutySuccess' + JSON.stringify(offDutySuccess));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            if (result.length > 0) {
                                $rootScope.offDutyFlag = false;
                                $rootScope.startDutyFlag = true;
                                $scope.billedAmount = result[0].amount;
                                sendSmsToCustomerAtOff(booking);
                                sendSmsToDriverAtOff(booking);
                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.getBookings();
                                $rootScope.loader = 0;
                            }

                        }).
                        error(function(error) {
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                            $scope.isDisabled = false;
                            $modalInstance.dismiss('cancel');
                            $rootScope.loader = 0;
                        });

                    }, function(offDutyError) {
                        console.log('offDutyError' + JSON.stringify(offDutyError));
                        $scope.isDisabled = false;
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });
                }
                

                    

               
            }

        };

         function sendSmsToCustomerAtOff(booking) {

           

            if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.toDate).format('DD-MM-YY');
                    var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.bookingToDate).format('DD-MM-YY');
                    var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';

                }
            }
           

            var customerName = $rootScope.lineupBookingDetails.bookingFirstName;
            Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.cityForOffDuty
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);

         
             /*if(rptTime>'22:00:00' || rptTime<'06:00:00' ||relTime>'22:00:00' || relTime<'06:00:00'){
                     var msg = 'Dear ' + customerName + ',%0aYour Duty(ID: ' + $rootScope.lineupBookingDetails.bookingId + ') %0aStarted on: ' + rptDate + ' @ ' + rptTime + '%0aEnded on: ' + endDate + ' @ ' + relTime + '%0aTotal billed amount Rs.' + Math.round($scope.billedAmount) + ' plus Rs.100 travel allowance if reporting or relieving between 10pm to 5:45am. %0aFor details download app (https://goo.gl/XFPFwh). %0aThank you, %0aIndian Drivers %0a'+ cnumber +'.';
                    }else
                    {
                        var msg = 'Dear ' + customerName + ',%0aYour Duty(ID: ' + $rootScope.lineupBookingDetails.bookingId + ') %0aStarted on: ' + rptDate + ' @ ' + rptTime + '%0aEnded on: ' + endDate + ' @ ' + relTime + '%0aTotal billed amount: Rs.' + Math.round($scope.billedAmount) + '/-. %0aFor details download app (https://goo.gl/XFPFwh). %0aThank you, %0aIndian Drivers.'+ cnumber +'.';
                    }*/
                    var msg = '\'Dear ' + customerName + ', Your Duty(ID: ' + $rootScope.lineupBookingDetails.bookingId + ') Started on: ' + rptDate + ' @ ' + rptTime + ' Ended on: ' + endDate + ' @ ' + relTime + ' Total billed amount Rs.' + Math.round($scope.billedAmount) + ' plus Rs.100 travel allowance if reporting or relieving between 10pm to 5:45am. For details download app (https://goo.gl/XFPFwh). %0aThank you, Indian Drivers '+ cnumber +'.';
                    $scope.num = $rootScope.lineupBookingDetails.bookingCellNumber;
           ConUsers.sendSMS({
                    mobileNumber: $rootScope.lineupBookingDetails.bookingCellNumber,
                    msg: msg
                }, function(mgssuccess) {
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
            
                },function(r){
                    });
                

        }
        function sendthanksmessage(msg,num) {
            ConUsers.sendSMS({
                    mobileNumber: num,
                    msg: msg
                }, function(mgssuccess) {
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
           
              
                

        }


       function sendSmsToDriverAtOff(booking) {
        Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.cityForOffDuty
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
              


            if (angular.isUndefined($rootScope.lineupBookingDetails.dutyType) || $rootScope.lineupBookingDetails.dutyType === '' || $rootScope.lineupBookingDetails.dutyType === null) {} else {
                if ($rootScope.lineupBookingDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.toDate).format('DD-MM-YYYY');
                    var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
                    var endDate = moment(booking.bookingToDate).format('DD-MM-YYYY');
                    var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';

                }
            }

            var driverName = $rootScope.lineupBookingDetails.driverFirstName;
            var msg = 'Dear ' + driverName + ',%0a Your journey started on: ' + rptDate + ' ' + rptTime + ' and ended at : ' + endDate + ' ' + relTime + ' of booking Id: ' + $rootScope.lineupBookingDetails.bookingId + '. Thanks for your association with Indian-Drivers. For any query or concern, please contact us on '+ cnumber +' or info@indian-drivers.com.';
            ConUsers.sendSMS({
                    mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                    msg: msg
                }, function(mgssuccess) {
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
           

               },function(r){
                    });

        }

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
                }else if (dutyReport[0].accept_duty == 'Driver  blocked for this customer') {
                    console.log('driver blocked');
                    window.alert("This driver is blocked for this customer.");
                    $scope.isDisabled = false;
                    $rootScope.loader = 0;
                } else if (dutyReport[0].accept_duty == 'License Expire Soon') {
                    window.alert("License of this Driver will expire soon.");
                    $.notify('Driver ID: ' + $rootScope.newDrvId1 + ' has been allocated to booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' successfully.', {
                        status: 'success'
                    });
                   // driverReallocateSMS();

                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        driverId: $rootScope.lineupBookingDetails.oldDrvId,
                        userId: $scope.uid,
                        allocationStatus: 'Deallocation'
                    }, function(success) {
                      //  console.log('created allocation successfully' + JSON.stringify(success));
                        DriverAllocationReport.createAllocationHistory({
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                            driverId: $rootScope.newDrvId1,
                            userId: $scope.uid,
                            allocationStatus: 'Allocation'
                        }, function(success) {
                           // console.log('created allocation successfully' + JSON.stringify(success));
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

                    //driverReallocateSMS();
                    DriverAllocationReport.createAllocationHistory({
                        bookingId: $rootScope.lineupBookingDetails.bookingId,
                        driverId: $rootScope.lineupBookingDetails.oldDrvId,
                        userId: $scope.uid,
                        allocationStatus: 'Deallocation'
                    }, function(success) {
                       // console.log('created allocation successfully' + JSON.stringify(success));
                        DriverAllocationReport.createAllocationHistory({
                            bookingId: $rootScope.lineupBookingDetails.bookingId,
                            driverId: $rootScope.newDrvId1,
                            userId: $scope.uid,
                            allocationStatus: 'Allocation'
                        }, function(success) {
                           // console.log('created allocation successfully' + JSON.stringify(success));


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
            ConUsers.sendSMS({
                    mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                    msg: msg
                }, function(mgssuccess) {
                    var newDriverSMS = $rootScope.reallocateDetails;
            customerSMS(newDriverSMS);

                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
           
               
                     };

        function customerSMS(newDriverSMS) {

             var opcity = $rootScope.allocateNewBookings.opCity;



              Cities.findOne({
                        filter:{
                           where:{
                            cityName:opcity
                        } 
                        }
                        
                        },function(s){
                            var cnumber=s.contactNumber;
                                console.log(s);
                                 var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + $rootScope.lineupBookingDetails.bookingFirstName + ',%0a Driver Name: ' + newDriverSMS.originalObject.driverName + ' (Contact Number: ' + newDriverSMS.originalObject.mobileNumber + ') ' + ' has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.lineupBookingDetails.bookingId + '. For queries, please reach us on '+ cnumber +' or info@indian-drivers.com.';
            
 ConUsers.sendSMS({
                    mobileNumber: $rootScope.lineupBookingDetails.bookingCellNumber,
                    msg: msg
                }, function(mgssuccess) {
                    newdriverSMSFunction(newDriverSMS);
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
           
             

                                },function(r){
                    });
           
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
            if ($rootScope.lineupBookingDetails.journeyType === 'Round Trip') {
                var dropadd = ' ';
            } else {
                var dropadd = ', Drop Address: ' + $rootScope.lineupBookingDetails.bookingToLocation;
            }
            var picadd = landmark + $rootScope.lineupBookingDetails.bookingFrmLocation;
            var rptDate = moment($rootScope.lineupBookingDetails.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.lineupBookingDetails.hours + ':' + $rootScope.lineupBookingDetails.minutes + ':' + '00';
            var msg = 'Hi ' + newDriverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.lineupBookingDetails.bookingId + ' Duty Type: ' + $rootScope.lineupBookingDetails.dutyType + ' ' + $rootScope.lineupBookingDetails.journeyType + ' Car Type: ' + $rootScope.lineupBookingDetails.carType + ' Dated on: ' + rptDate + ' @ ' + rptTime + relHour + ', Pickup address: ' + picadd + dropadd + ' Client Name: ' + $rootScope.lineupBookingDetails.bookingFirstName + '-' + $rootScope.lineupBookingDetails.bookingCellNumber;
            
ConUsers.sendSMS({
                    mobileNumber: newDriverSMS.originalObject.mobileNumber,
                    msg: msg
                }, function(mgssuccess) {
                    //newdriverSMSFunction(newDriverSMS);
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

                });
 
             
        };

        $scope.deallocateDriver = function() {
            $scope.isDisabled = true;
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
                            userId: $rootScope.userId 
                            
                        }, function(SuccessData) {
                            //console.log('driver deallocation success' + JSON.stringify(SuccessData)); zebs
                            $.notify('Driver removed successfully ', {
                                status: 'success'
                            });
                           driverDeallocateSMS();
                            DriverAllocationReport.createAllocationHistory({
                                bookingId: parseInt($rootScope.lineupBookingDetails.bookingId),
                                driverId: $rootScope.lineupBookingDetails.oldDrvId,
                                userId: $rootScope.userId,
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
            
ConUsers.sendSMS({
                    mobileNumber: $rootScope.lineupBookingDetails.driverContact,
                    msg: msg
                }, function(mgssuccess) {
                    //newdriverSMSFunction(newDriverSMS);
                    //cancelDriverSMS(cancelData, opcity);
                    // console.log('msg sent successfully:' + JSON.stringify(mgssuccess));
                }, function(error) {
                  //  console.log('error in sending msg: ' + JSON.stringify(error));

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

        $scope.getNumber = function(num) {
            return new Array(num);
        }
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


                            }, {
                                relation: 'bookingRating',
                                scope: {
                                    include: {
                                        relation: 'bookingRatingDetails',
                                    }
                                }
                            },{
                            relation:'driverAllocationReport',
                        }]
                        }
                    }, function(bookingData) {
                        $scope.lineFare = bookingData;
                       // console.log('bookingData ' + JSON.stringify(bookingData));
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
                                var tomin = arr[1];
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
                            /*if (bookingData.status == 'Done') {
                                //var url = 'http://192.168.2.23:3000';
                                var url = 'http://52.32.39.44:3000';
                                var relDate = moment(releavingDate).format('YYYY-MM-DD');
                                var obj = {
                                    "bookingId": bookingData.id,
                                    "requestFrom": "ADMIN_OFF",
                                    "offDutyDate": relDate,
                                    "offDutyTime": releavingTime
                                };


                                $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                                success(function(result) {
                                    //console.log('Updated Geolocation successfully' + JSON.stringify(result));

                                }).
                                error(function(error) {

                                    console.log('Error in updating driver geolocation:' + JSON.stringify(error));

                                });
                            }*/

                            var bankName = '';
                            var settlementMode = '';

                            if (angular.isDefined(bookingData.settlementMode)) {
                                settlementMode = bookingData.settlementMode;
                            }

                            if (angular.isDefined(bookingData.settlementBankName)) {
                                bankName = bookingData.settlementBankName;
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
                                        returnFare = (bookingData.outstationBookings[0].returnTravelTime).toFixed(2);
                                        returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime)-125).toFixed(2) + ' KM ' + '* 6)';
                                    }
                                }
                            } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                               if(bookingData.operationCity === 'Aurangabad'){
                              returnFare = '50';  
                            }else{
                                returnFare = '100';
                            }
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
                            var rateCount = 0;
                            if (angular.isDefined(bookingData.rateCount) || bookingData.rateCount !== null) {
                                rateCount = bookingData.rateCount;
                            }
                            var list = [];
                            if (bookingData.bookingRating.length !== 0) {
                                if (bookingData.bookingRating[0].bookingRatingDetails.length !== 0) {
                                    for (var k = 0; k < bookingData.bookingRating[0].bookingRatingDetails.length; k++) {
                                        list.push(bookingData.bookingRating[0].bookingRatingDetails[k].ratingAnswer);
                                    }

                                }
                            }
                            var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                            var history = [];
                            if (bookingData.driverAllocationReport.length !== 0) {
                                
                                   for (var k = 0; k < bookingData.driverAllocationReport.length; k++) {
                                       var status = bookingData.driverAllocationReport[k].history + moment(bookingData.driverAllocationReport[k].createdDate).format('DD-MM-YYYY | HH:mm:ss');
                                        history.push(status);
                                    }

                               
                           } 
                           if(angular.isDefined(bookingData.driverDetails)){
                            var olddrviverId = bookingData.driverDetails.id; 
                           }  
                           else{
                            olddrviverId = 0;
                           }
                            ConUsers.findById({
                                    id: bookingData.createdBy
                                },
                                function(ConUsers) {

                                    $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;

                                    BookingPaymentTransaction.find({
                                            filter: {
                                                where: {
                                                    bookingId: bookingData.id,
                                                    transactionStatus: 'Success'
                                                }
                                            }
                                        },
                                        function(transactionResponse) {
                                            //console.log('transaction response' + JSON.stringify(transactionResponse));
                                            var paymentDate = '';
                                            if (transactionResponse.length > 0) {

                                                if (!angular.isUndefined(transactionResponse[0].createdDate) || transactionResponse[0].createdDate !== null && transactionResponse[0].createdDate !== '') {
                                                    paymentDate = moment(transactionResponse[0].createdDate).format('DD-MM-YYYY HH:mm:ss');
                                                }

                                            }
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
                                                oldDrvId: olddrviverId,
                                                driverFirstName: bookingData.driverDetails.conUsers.firstName,
                                                driverMiddleName: bookingData.driverDetails.conUsers.middleName,
                                                driverLastName: bookingData.driverDetails.conUsers.lastName,
                                                driverContact: bookingData.driverDetails.conUsers.mobileNumber,
                                                driverAddress: bookingData.driverDetails.conUsers.address,
                                                driverAccNo: bookingData.driverDetails.accountNumber,
                                                bankName: bookingData.driverDetails.bankName,
                                                ifscCode: bookingData.driverDetails.ifscCode,
                                                paymentMethod: paymentMode,
                                                driverShare: drvShare,
                                                idShare: idShare,
                                                carTypeValue: carTypeText,
                                                returnFareAmt: returnFareText,
                                                driverShare: driverShare,
                                                idShare: idShare,
                                                returnTime: returnTravelHours,
                                                bookingDate: createdDate,
                                                bookBy: ' Created By ' + $scope.bookedBy,
                                                remark: bookingData.remark,
                                                status: bookingData.status,
                                                paymentStatus: bookingData.driverPaymentStatus,
                                                paymentDate: paymentDate,
                                                settlementMode: settlementMode,
                                                bankName: bankName,
                                                rating: rateCount,
                                                list: list,
                                                history:history,
                                                operationCity: bookingData.operationCity,
                                                tripType:bookingData.tripType


                                            };

                                            $rootScope.checkFare = $scope.booking;
                                            $rootScope.lineupBookingDetails = $scope.booking;
                                            //console.log('lineupBookingDetails ' + JSON.stringify($scope.booking));
                                            $scope.getLineUpDriverMobile();
                                            $rootScope.loader = 0;
                                        },
                                        function(error) {
                                            console.log('error ' + JSON.stringify(error));
                                            $rootScope.loader = 0;
                                        });
                                },
                                function(error) {
                                    console.log('error ' + JSON.stringify(error));
                                    $rootScope.loader = 0;
                                });

                        }

                    },
                    function(bookingErr) {
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


        $scope.updateDateAndTime = function(booking) {
            $rootScope.loader = 1;
            var count = 0;
            //console.log('booking details' + JSON.stringify(booking));
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
            var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
            var relTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
            var date1 = new Date(rptDate);
            var date2 = new Date(relDate);

            if (angular.isUndefined(booking.tohours) || booking.tohours === '' || booking.tohours === null) {
                document.getElementById("tohours").style.borderColor = "red";
                document.getElementById("tohours1").innerHTML = '*required';
                booking.tohours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("tohours").style.borderColor = "#dde6e9";
                document.getElementById("tohours1").innerHTML = '';
                booking.tohours1 = null;
            }
            if (angular.isUndefined(booking.tominutes) || booking.tominutes === '' || booking.tominutes === null) {
                document.getElementById("tominutes").style.borderColor = "red";
                document.getElementById("tominutes1").innerHTML = '*required';
                booking.tominutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("tominutes").style.borderColor = "#dde6e9";
                document.getElementById("tominutes1").innerHTML = '';
                booking.tominutes1 = null;
            }

            if (angular.isUndefined(booking.hours) || booking.hours === '' || booking.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                booking.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                booking.hours1 = null;
            }
            if (angular.isUndefined(booking.minutes) || booking.minutes === '' || booking.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                booking.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                booking.minutes1 = null;
            }

            if (angular.isUndefined(booking.bookingReportingDate) || booking.bookingReportingDate === '' || booking.bookingReportingDate === null) {
                document.getElementById("bookingReportingDate").style.borderColor = "red";
                document.getElementById("bookingReportingDate1").innerHTML = '*required';
                booking.bookingReportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
                document.getElementById("bookingReportingDate1").innerHTML = '';
                booking.bookingReportingDate1 = null;
            }
            if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
                document.getElementById("bookingToDate").style.borderColor = "red";
                document.getElementById("bookingToDate1").innerHTML = '*required';
                booking.bookingToDate1 = 'This value is required';
                count++;
            } else {

                if (booking.dutyType === 'Outstation') {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    }else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    }
                } else {

                    if (date2 < date1) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else if (date2.getTime() == date1.getTime()) {
                        var hour, minute, hours, minutes;
                        hour = parseInt(relTime.split(":")[0]);
                        hours = parseInt(rptTime.split(":")[0]);
                        minute = parseInt(relTime.split(":")[1]);
                        minutes = parseInt(rptTime.split(":")[1]);
                        var rptDay = new Date();
                        var givenDate = new Date();
                        givenDate.setHours(hour);
                        givenDate.setMinutes(minute);
                        rptDay.setHours(hours);
                        rptDay.setMinutes(minutes);

                        if (givenDate < rptDay) {
                            document.getElementById("tohours").style.borderColor = "red";
                            document.getElementById("tominutes").style.borderColor = "red";
                            document.getElementById("releavingTime1").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.releavingTime1 = 'Releiving time should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("tohours").style.borderColor = "#dde6e9";
                            document.getElementById("tominutes").style.borderColor = "#dde6e9";
                            document.getElementById("releavingTime1").innerHTML = '';
                            booking.releavingTime1 = null;
                        }
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;

                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;
                    }
                }

            }
             if(angular.isUndefined(booking.remark) || (booking.remark === '' ) || booking.remark === null || booking.remark==='undefined'){
                var remark='';
            }
            else{
                var remark=booking.remark;
            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;

                Bookings.find({
                    filter: {
                        where: {
                            id: booking.bookingId
                        },
                        include: {
                            relation: 'invoices'

                        }
                    }
                }, function(success) {
                    console.log('booking success' + JSON.stringify(success));
                    $scope.successdata = success;
                    success[0].reportingDate = rptDate;
                    success[0].remark = remark;
                    success[0].tripType = booking.tripType;
                    success[0].reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';
                    success[0].updatedBy = $rootScope.userId;
                    success[0].updatedDate = new Date();
                    success[0].$save();
                    BookingDetails.create({
                        bookingId:$scope.booking.bookingId,
                        reportingDate:$scope.successdata[0].invoices[0].reportingDate,
                        reportingTime:$scope.successdata[0].invoices[0].reportingTime,
                        releavingDate:$scope.successdata[0].invoices[0].releavingDate,
                        releavingTime:$scope.successdata[0].invoices[0].releavingTime,
                        status:$scope.successdata[0].status

                    },function(success){

                    },function(er){

                    });
                    //var url = 'http://43.240.67.79:3000';
                   var url = 'http://65.0.186.134:3000';
                    var obj = {
                        "bookingId": booking.bookingId,
                        "requestFrom": "ADMIN_OFF",
                        "offDutyDate": relDate,
                        "offDutyTime": booking.tohours + ':' + booking.tominutes + ':' + '00'
                    };
                    if (success[0].isOutstation === true) {
                        OutstationBookings.find({
                            filter: {
                                where: {
                                    bookingId: booking.bookingId
                                }
                            }
                        }, function(OBSuccess) {
                            //console.log('OutstationBookings details' + JSON.stringify(OBSuccess));
                            OBSuccess[0].releavingDate = relDate;
                            OBSuccess[0].releavingTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                            OBSuccess[0].updatedBy = $rootScope.userId;
                            OBSuccess[0].updatedDate = new Date();
                            OBSuccess[0].$save();
                        }, function(OBErr) {
                            console.log('OutstationBookings error' + JSON.stringify(OBErr));
                        });
                    }

                    Invoices.upsert({
                        id: success[0].invoices[0].id,
                        reportingDate: rptDate,
                        reportingTime: booking.hours + ':' + booking.minutes + ':' + '00',
                        releavingDate: relDate,
                        releavingTime: booking.tohours + ':' + booking.tominutes + ':' + '00',

                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        //console.log('invoice A:' + JSON.stringify(s));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            reloadFunc();
                            $rootScope.getBookings();
                            $rootScope.loader = 0;

                        }).
                        error(function(error) {
                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));
                        });


                    }, function(e) {
                        console.log('error:' + JSON.stringify(e));

                        if (e.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;

                    });
                }, function(error) {
                    console.log('booking error' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });

            }

        }

        $scope.checkFare = function() {
            $modalInstance.dismiss('cancel');
            $state.go('app.fareCalculator');
        };

        $scope.allocate = function() {
            $scope.isDisabled = false;
            $scope.searchDriver = true;
            $scope.allocateDriver = false;

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
        $scope.count = 0;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            $rootScope.getBookings();
        };

    };// end  sub controller lineUpBookingCtrl

    $(function() {

    });

}
App.directive('googleplace', function() {
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
