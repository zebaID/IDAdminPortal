/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('multipleBillCtrl', ['$scope', '$rootScope', '$http', '$state', 'ConUsers', '$cookieStore', '$localStorage', 'UserRoles', 'Cities', 'Company2CustomerRate', 'Company1CustomerBills', 'Company2CustomerBills', 'Company2MultipleBillDetails', 'Company2DriverDetails', function($scope, $rootScope, $http, $state, ConUsers, $cookieStore, $localStorage, UserRoles, Cities, Company2CustomerRate, Company1CustomerBills,Company2CustomerBills, Company2MultipleBillDetails, Company2DriverDetails) {

    $scope.uid = $localStorage.get('userId');
    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
    $rootScope.cityAt = [];
    $scope.backToSearchPageforbill = function(){
            $state.go('app.billingCustomerDetails');
        }
    $scope.getInfo = function(){
        $rootScope.idForGenerateBill = $localStorage.get('idForGenerateBill');
      Company2CustomerRate.find({
                    filter: {
                        where: {
                            company2CustomerId: $rootScope.idForGenerateBill
                        },
                        include: {
                            relation: 'company2DriverDetails',
                            scope: {
                                include: {
                                    relation: 'driverDetails',
                                    scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                                }
                            }
                        } 
                    }
                }, function(customerData) {
                    console.log('info : ' + JSON.stringify(customerData));
                    $rootScope.customerData= customerData;
                    $rootScope.driverArray = [];
                    for (var i = 0; i < customerData.length; i++) {

                        if (customerData[i].itemId === '1') {
                            if(angular.isDefined(customerData[i].company2DriverDetails.driverId + ' ' + customerData[i].company2DriverDetails.driverDetails.conUsers)){
                            $rootScope.driverArray.push({
                                company2driverId: customerData[i].company2driverId,
                                driverName:customerData[i].company2DriverDetails.driverId + ' ' + customerData[i].company2DriverDetails.driverDetails.conUsers.firstName + ' ' + customerData[i].company2DriverDetails.driverDetails.conUsers.lastName
                            });    
                            }
                            
                        }

                    }
   
                           }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
    }
    $scope.manageUnitRate = function(driverId){
            var company2driverId;
            for(i=0;i<$rootScope.driverArray.length;i++){
                if($rootScope.driverArray[i].driverName==driverId){
                    company2driverId=$rootScope.driverArray[i].company2driverId;
                }

            }
            var driverId = driverId.replace(/\D/g,'');
            
            
                $scope.Advance = 0;
            $rootScope.adminChargeRate = undefined;
            $rootScope.adminChargeUnit = undefined;
            $scope.isDisabledButtongen = false;
            $rootScope.AdminCharge = undefined;
             $rootScope.Salary = undefined;
            $rootScope.Overtime = undefined;
            $rootScope.Outstation = undefined;
            $rootScope.Night = undefined;
            $rootScope.Extra = undefined;
            $rootScope.Admin = undefined;
            $rootScope.AdminCharge = undefined;
            $scope.number = [{
                'dec': 1
            }, {
                'desc': 2
            }];
            $rootScope.invoice1 = [];
            $rootScope.Description = [];
            $rootScope.rate = [];
            $rootScope.unit = [];
            $rootScope.itemId = [];

                Company2DriverDetails.findOne({
                    filter: {
                        where: {
                            company2CustomerId: $rootScope.idForGenerateBill,
                            id:company2driverId

                        },include: {
                                    relation: 'company2CustomerRate'
                               }
                    }
                }, function(info) {
                    $rootScope.info = info.company2CustomerRate;
                    //console.log('info: ' + JSON.stringify(info));

                    for (var i = 0; i < $rootScope.info.length; i++) {

                        if ($rootScope.info[i].itemId === '1') {

                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Salary Charged',
                                'rate': $rootScope.info[i].value.toFixed(2),
                                'unit': $rootScope.info[i].unit
                            });

                        }
                        if ($rootScope.info[i].itemId === '2') {
                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Overtime Rate',
                                'rate': $rootScope.info[i].value.toFixed(2),
                                'unit': $rootScope.info[i].unit
                            });

                        }
                        if ($rootScope.info[i].itemId === '3') {
                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Outstation Rate',
                                'rate': $rootScope.info[i].value.toFixed(2),
                                'unit': $rootScope.info[i].unit
                            });


                        }
                        if ($rootScope.info[i].itemId === '4') {
                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Night Stay Rate',
                                'rate': $rootScope.info[i].value.toFixed(2),
                                'unit': $rootScope.info[i].unit
                            });

                        }
                        if ($rootScope.info[i].itemId === '5') {
                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Extra Day Rate',
                                'rate': $rootScope.info[i].value.toFixed(2),
                                'unit': $rootScope.info[i].unit
                            });

                        }
                        if ($rootScope.info[i].itemId === '6') {

                            $rootScope.invoice1.push({
                                'itemId': $rootScope.info[i].itemId,
                                'description': 'Admin Charge',
                                'rate': $rootScope.info[i].value,
                                'unit': $rootScope.info[i].unit
                            });
                            $rootScope.adminChargeRate = $rootScope.info[i].value;
                            $rootScope.adminChargeUnit = $rootScope.info[i].unit;

                        }

                    }
                    //console.log('desc: ' + JSON.stringify($rootScope.Description));

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
                $rootScope.assigns=[0];
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
        $scope.openBillStart = false;
        $scope.openStart = function($event) {//open date

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStart = true;
            $scope.openToDate = false;
            $scope.openBillStart = false;

        };
        
        $scope.openBillDate = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openBillStart = true;
            $scope.openedStart = false;
            $scope.openToDate = false;

        };


        $scope.openedToDate = function($event) {

            $event.preventDefault();
            $event.stopPropagation();
            $scope.openToDate = true;
            $scope.openBillStart = false;
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

        };
        $scope.addNextDriver = function(date, driverName){
            if(angular.isUndefined(driverName)){
               document.getElementById("drilist").style.borderColor = "red";
                document.getElementById("drilist1").innerHTML = '*required';  
            }else{
             var driverId = driverName.replace(/\D/g,'');   
            }
            
            //$rootScope.idForGenerateBill
        $scope.generateBillSubmit(date,driverId);
               
         
        }
        $scope.statusArray = [{
            'desc': 'P'
        }, {
            'desc': 'R'
        }, {
            'desc': 'C'
        }];


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

        $scope.adminChargeArray = [{
            'desc': 'Amount'
        }, {
            'desc': 'Percentage'
        }];

        $scope.companyNameArray = [{
            'desc': 'ID Services'
        }, {
            'desc': 'ID Car Drivers Pvt Ltd'
        }];

        $scope.selectRateAndUnit = function(description) {//select description for generate bill 
            for (var i = 0; i < $rootScope.invoice1.length; i++) {
                if (description === $rootScope.invoice1[i].description) {
                    $scope.infodata = {
                        rate: $rootScope.invoice1[i].rate,
                        unit: $rootScope.invoice1[i].unit,
                        Description: $rootScope.invoice1[i].description,
                        quantity: $rootScope.invoice1[i].quantity

                    };

                    if (description === 'Salary Charged') {
                        $rootScope.ot = false;
                        $rootScope.Percentage = false;
                        $scope.quantity = [{
                            'desc': 1
                        }, {
                            'desc': 2
                        }, {
                            'desc': 3
                        }, {
                            'desc': 4
                        }, {
                            'desc': 5
                        }, {
                            'desc': 6
                        }, {
                            'desc': 7
                        }, {
                            'desc': 8
                        }, {
                            'desc': 9
                        }, {
                            'desc': 10
                        }, {
                            'desc': 11
                        }, {
                            'desc': 12
                        }, {
                            'desc': 13
                        }, {
                            'desc': 14
                        }, {
                            'desc': 15
                        }, {
                            'desc': 16
                        }, {
                            'desc': 17
                        }, {
                            'desc': 18
                        }, {
                            'desc': 19
                        }, {
                            'desc': 20
                        }, {
                            'desc': 21
                        }, {
                            'desc': 22
                        }, {
                            'desc': 23
                        }, {
                            'desc': 24
                        }, {
                            'desc': 25
                        }, {
                            'desc': 26
                        }, {
                            'desc': 27
                        }, {
                            'desc': 28
                        }, {
                            'desc': 29
                        }, {
                            'desc': 30
                        }];

                    } else if (description === 'Overtime Rate') {
                        $rootScope.ot = true;
                        $rootScope.Percentage = true;

                    } else if (description === 'Outstation Rate') {
                        $rootScope.Percentage = false;
                        $rootScope.ot = false;
                        $scope.quantity = [{
                            'desc': 1
                        }, {
                            'desc': 2
                        }, {
                            'desc': 3
                        }, {
                            'desc': 4
                        }, {
                            'desc': 5
                        }, {
                            'desc': 6
                        }, {
                            'desc': 7
                        }, {
                            'desc': 8
                        }, {
                            'desc': 9
                        }, {
                            'desc': 10
                        }, {
                            'desc': 11
                        }, {
                            'desc': 12
                        }, {
                            'desc': 13
                        }, {
                            'desc': 14
                        }, {
                            'desc': 15
                        }, {
                            'desc': 16
                        }, {
                            'desc': 17
                        }, {
                            'desc': 18
                        }, {
                            'desc': 19
                        }, {
                            'desc': 20
                        }, {
                            'desc': 21
                        }, {
                            'desc': 22
                        }, {
                            'desc': 23
                        }, {
                            'desc': 24
                        }, {
                            'desc': 25
                        }, {
                            'desc': 26
                        }, {
                            'desc': 27
                        }, {
                            'desc': 28
                        }, {
                            'desc': 29
                        }, {
                            'desc': 30
                        }];

                    } else if (description === 'Night Stay Rate') {
                        $rootScope.ot = false;
                        $rootScope.Percentage = false;
                        $scope.quantity = [{
                            'desc': 1
                        }, {
                            'desc': 2
                        }, {
                            'desc': 3
                        }, {
                            'desc': 4
                        }, {
                            'desc': 5
                        }, {
                            'desc': 6
                        }, {
                            'desc': 7
                        }, {
                            'desc': 8
                        }, {
                            'desc': 9
                        }, {
                            'desc': 10
                        }, {
                            'desc': 11
                        }, {
                            'desc': 12
                        }, {
                            'desc': 13
                        }, {
                            'desc': 14
                        }, {
                            'desc': 15
                        }, {
                            'desc': 16
                        }, {
                            'desc': 17
                        }, {
                            'desc': 18
                        }, {
                            'desc': 19
                        }, {
                            'desc': 20
                        }, {
                            'desc': 21
                        }, {
                            'desc': 22
                        }, {
                            'desc': 23
                        }, {
                            'desc': 24
                        }, {
                            'desc': 25
                        }, {
                            'desc': 26
                        }, {
                            'desc': 27
                        }, {
                            'desc': 28
                        }, {
                            'desc': 29
                        }, {
                            'desc': 30
                        }];

                    } else if (description === 'Extra Day Rate') {
                        $rootScope.Percentage = false;
                        $rootScope.ot = false;
                        $scope.quantity = [{
                            'desc': 1
                        }, {
                            'desc': 2
                        }, {
                            'desc': 3
                        }, {
                            'desc': 4
                        }, {
                            'desc': 5
                        }, {
                            'desc': 6
                        }, {
                            'desc': 7
                        }, {
                            'desc': 8
                        }, {
                            'desc': 9
                        }, {
                            'desc': 10
                        }, {
                            'desc': 11
                        }, {
                            'desc': 12
                        }, {
                            'desc': 13
                        }, {
                            'desc': 14
                        }, {
                            'desc': 15
                        }, {
                            'desc': 16
                        }, {
                            'desc': 17
                        }, {
                            'desc': 18
                        }, {
                            'desc': 19
                        }, {
                            'desc': 20
                        }, {
                            'desc': 21
                        }, {
                            'desc': 22
                        }, {
                            'desc': 23
                        }, {
                            'desc': 24
                        }, {
                            'desc': 25
                        }, {
                            'desc': 26
                        }, {
                            'desc': 27
                        }, {
                            'desc': 28
                        }, {
                            'desc': 29
                        }, {
                            'desc': 30
                        }];
                    } else if (description === 'Admin Charge') {
                        $rootScope.Percentage = true;
                        $rootScope.ot = false;
                    } else {

                    }
                }

            }
        };
        $scope.reverseCarged = [{
            'rc': 'Y'
        }, {
            'rc': 'N'
        }];
        $scope.invoice = [];
        $scope.add = function(user1) {//while generating bill add in list with calculation
                var count = 0;
                //console.log('user1: ' + JSON.stringify(user1));
                if (angular.isUndefined(user1)) {
                    document.getElementById("Description").style.borderColor = "red";
                    document.getElementById("Description1").innerHTML = '*required';
                    document.getElementById("rate").style.borderColor = "red";
                    document.getElementById("rate1").innerHTML = '*required';
                    document.getElementById("unit").style.borderColor = "red";
                    document.getElementById("unit1").innerHTML = '*required';
                    document.getElementById("quantity").style.borderColor = "red";
                    document.getElementById("quantity1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("Description").style.borderColor = "#dde6e9";
                    document.getElementById("Description1").innerHTML = '';
                    document.getElementById("rate").style.borderColor = "#dde6e9";
                    document.getElementById("rate1").innerHTML = '';
                    document.getElementById("unit").style.borderColor = "#dde6e9";
                    document.getElementById("unit1").innerHTML = '';
                    document.getElementById("quantity").style.borderColor = "#dde6e9";
                    document.getElementById("quantity1").innerHTML = '';
                    for (var i = 0; i < $scope.invoice.length; i++) {
                        if ($scope.invoice[i].description === user1.Description) {
                            document.getElementById("Description").style.borderColor = "red";
                            document.getElementById("Description1").innerHTML = '*Duplicate Entry';
                            count++;
                        }

                    }
                    if (angular.isUndefined(user1.quantity) && user1.Description !== 'Admin Charge') {
                        document.getElementById("quantity").style.borderColor = "red";
                        document.getElementById("quantity1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("quantity").style.borderColor = "#dde6e9";
                        document.getElementById("quantity1").innerHTML = '';
                    }


                }

                if (count === 0) {
                    for (var i = 0; i < $scope.invoice.length; i++) {
                        if ($scope.invoice[i].description === 'Admin Charge') {
                            if ($scope.invoice[i].unit === 'Percentage') {
                                var exacttotal = $rootScope.total - $scope.invoice[i].rate;
                                exacttotal = exacttotal + (user1.rate * user1.quantity);
                                var rate = ((exacttotal * $scope.invoice[i].percent) / 100);
                                var desc = $scope.invoice[i].description;
                                var per = $scope.invoice[i].percent;
                                var uni = $scope.invoice[i].unit;

                                $scope.invoice[i].rate = rate;

                            }
                        }
                    }


                    //console.log('user1: ' + JSON.stringify(user1));
                    if (user1.unit === 'Percentage') {
                        $rootScope.AdminCharge = undefined;
                        $scope.invoice.push({
                            description: user1.Description,
                            rate: $rootScope.total * user1.rate / 100,
                            percent: user1.rate,
                            unit: user1.unit,
                            quantity: 1
                        });
                        $rootScope.AdminCharge = $rootScope.total * user1.rate / 100;
                    } else if (user1.unit === 'Amount') {
                        $rootScope.AdminCharge = undefined;
                        $scope.invoice.push({
                            description: user1.Description,
                            rate: user1.rate,
                            unit: user1.unit,
                            quantity: 1
                        });
                        $rootScope.AdminCharge = user1.rate;
                    } else {
                        $scope.invoice.push({
                            description: user1.Description,
                            rate: user1.rate,
                            unit: user1.unit,
                            quantity: user1.quantity
                        });
                    }
                }



            },
            $scope.addOther = function(user1) {//add for other bill

                var count = 0;
                console.log('user1: ' + JSON.stringify(user1));
                if (angular.isUndefined(user1)) {
                    document.getElementById("Description").style.borderColor = "red";
                    document.getElementById("Description1").innerHTML = '*required';
                    document.getElementById("amount").style.borderColor = "red";
                    document.getElementById("amount1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("Description").style.borderColor = "#dde6e9";
                    document.getElementById("Description1").innerHTML = '';
                    document.getElementById("amount").style.borderColor = "#dde6e9";
                    document.getElementById("amount1").innerHTML = '';
                    for (var i = 0; i < $scope.invoice.length; i++) {
                        if ($scope.invoice[i].description === user1.Description) {
                            document.getElementById("Description").style.borderColor = "red";
                            document.getElementById("Description1").innerHTML = '*Duplicate Entry';
                            count++;
                        }

                    }
                    if (angular.isUndefined(user1.amount) && user1.Description !== 'Admin Charge') {
                        document.getElementById("amount").style.borderColor = "red";
                        document.getElementById("amount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("amount").style.borderColor = "#dde6e9";
                        document.getElementById("amount1").innerHTML = '';
                    }


                }
                if ($scope.invoice.length > 0) {
                    document.getElementById("Description").style.borderColor = "red";
                    document.getElementById("Description1").innerHTML = '*Can not add more than one';
                    count++;
                } else {
                    document.getElementById("Description").style.borderColor = "#dde6e9";
                    document.getElementById("Description1").innerHTML = '';
                }
                if (count === 0) {
                    if (user1.Description === 'Professional Fees') {
                        var itemId = 7;
                    }
                    if (user1.Description === 'Bonus') {
                        var itemId = 8;
                    }
                    if (user1.Description === 'Arrears') {
                        var itemId = 9;
                    }
                    if (user1.Description === 'On_Call/Replacement') {
                        var itemId = 10;
                    }
                    $scope.invoice.push({
                        id: itemId,
                        description: user1.Description,
                        amount: user1.amount
                    });

                }



            },
            $scope.remove = function(index) {//remove from list
                for (var i = 0; i < $scope.invoice.length; i++) {
                    if ($scope.invoice[i].description === 'Admin Charge') {
                        if ($scope.invoice[i].unit === 'Percentage') {
                            if (i === index) {
                                var exacttotal = $rootScope.total - $scope.invoice[i].rate;

                            } else {
                                var exacttotal = $rootScope.total - $scope.invoice[i].rate - ($scope.invoice[index].rate * $scope.invoice[index].quantity);
                                var rate = exacttotal * $scope.invoice[i].percent / 100;
                                $scope.invoice[i].rate = rate;
                            }


                        }
                    }
                }
                $scope.invoice.splice(index, 1);
            },
            $scope.subTotal = function() {//calculate sub total
                var total = 0;
                var acharge = 0;
                for (var i = 0; i < $scope.invoice.length; i++) {


                    total = total + $scope.invoice[i].rate * $scope.invoice[i].quantity;


                }
                $rootScope.total = total;
                return total;

            }
        $scope.grandTotal = function() {//grand total
            var grandTotal = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {

                grandTotal = grandTotal + $scope.invoice[i].rate * $scope.invoice[i].quantity + ($scope.invoice[i].rate * $scope.invoice[i].quantity) * 9 / 100 + ($scope.invoice[i].rate * $scope.invoice[i].quantity) * 9 / 100;

            }
            $rootScope.grandTotal = grandTotal;
            return grandTotal;
        }

        $scope.cgst = function() {//gst cxalculation 9%
            var cgst = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {
                cgst = cgst + ($scope.invoice[i].rate * $scope.invoice[i].quantity) * 9 / 100;
            }
            $rootScope.cgst = cgst;
            return cgst;
        }
        $scope.sgst = function() {//sgst calculation 9%
            var sgst = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {
                sgst = sgst + ($scope.invoice[i].rate * $scope.invoice[i].quantity) * 9 / 100;
            }
            $rootScope.sgst = sgst;
            return sgst;
        }
        $scope.removeOther = function(index) {//remove other

                $scope.invoice.splice(index, 1);
            },
            $scope.subTotalOther = function() {//other bill sub total
                var total = 0;
                var acharge = 0;
                for (var i = 0; i < $scope.invoice.length; i++) {


                    total = total + Number($scope.invoice[i].amount);


                }
                $rootScope.total = total;
                return total;

            }
        $scope.grandTotalOther = function() {//other bill grand total
            var grandTotal = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {

                grandTotal = grandTotal + Number($scope.invoice[i].amount) + ((Number($scope.invoice[i].amount) * 9) / 100) + ((Number($scope.invoice[i].amount) * 9) / 100);

            }
            $rootScope.grandTotal = grandTotal;
            return grandTotal;
        }

        $scope.cgstOther = function() {//other cgst
            var cgst = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {
                cgst = cgst + (Number($scope.invoice[i].amount) * 9) / 100;
            }
            $rootScope.cgst = cgst;
            return cgst;
        }
        $scope.sgstOther = function() {//sgst other calculation
            var sgst = 0;
            for (var i = 0; i < $scope.invoice.length; i++) {
                sgst = sgst + (Number($scope.invoice[i].amount) * 9) / 100;
            }
            $rootScope.sgst = sgst;
            return sgst;
        }
        $scope.generateBillSubmit = function(date,driverId) {//generate bill submit

            $rootScope.loader = 1;


            var count = 0;
            if (angular.isUndefined($scope.Advance) || $scope.Advance === null || $scope.Advance === '') {

                $scope.Advance = 0;
                var grandTotal = $rootScope.grandTotal - $scope.Advance;
            } else {
                var grandTotal = $rootScope.grandTotal - $scope.Advance;


            }
            if ($scope.invoice.length === 0) {
                document.getElementById("Description").style.borderColor = "red";
                document.getElementById("Description1").innerHTML = '*required';
                document.getElementById("rate").style.borderColor = "red";
                document.getElementById("rate1").innerHTML = '*required';
                document.getElementById("unit").style.borderColor = "red";
                document.getElementById("unit1").innerHTML = '*required';
                document.getElementById("quantity").style.borderColor = "red";
                document.getElementById("quantity1").innerHTML = '*required';
                count++;
            } else {


                document.getElementById("Description").style.borderColor = "#dde6e9";
                document.getElementById("Description1").innerHTML = '';
                document.getElementById("rate").style.borderColor = "#dde6e9";
                document.getElementById("rate1").innerHTML = '';
                document.getElementById("unit").style.borderColor = "#dde6e9";
                document.getElementById("unit1").innerHTML = '';
                document.getElementById("quantity").style.borderColor = "#dde6e9";
                document.getElementById("quantity1").innerHTML = '';

            }
            if (angular.isUndefined(date)) {

                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required';
                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate1").innerHTML = '*required';
                document.getElementById("rcy").style.borderColor = "red";
                document.getElementById("rcy1").innerHTML = '*required';
                count++;
            } else {
                if (angular.isUndefined(date.frmDate) || date.frmDate === null || date.frmDate === '') {
                    document.getElementById("frmDate").style.borderColor = "red";
                    document.getElementById("frmDate1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("frmDate").style.borderColor = "#dde6e9";
                    document.getElementById("frmDate1").innerHTML = '';
                }
                if (angular.isUndefined(date.toDate) || date.toDate === null || date.toDate === '') {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("toDate").style.borderColor = "#dde6e9";
                    document.getElementById("toDate1").innerHTML = '';
                }
                if (angular.isUndefined(date.reverseCharged) || date.reverseCharged === null || date.reverseCharged === '') {
                    document.getElementById("rcy").style.borderColor = "red";
                    document.getElementById("rcy1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("rcy").style.borderColor = "#dde6e9";
                    document.getElementById("rcy1").innerHTML = '';
                }

            }
            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.isDisabledButtongen = true;
                //console.log('date : ' + JSON.stringify(date));
                //console.log('date : ' + JSON.stringify($scope.invoice));
                var Salary = 0;
                var salaryChargedQuantity = 0;
                var Overtime = 0;
                var overtimeQuantity = 0;
                var Outstation = 0;
                var outstationQuantity = 0;
                var Night = 0;
                var nightStayQuantity = 0;
                var Extra = 0;
                var extraDayQuantity = 0;
                var Admin = 0;
                //$scope.Advance;

                for (var i = 0; i < $scope.invoice.length; i++) {

                    if ($scope.invoice[i].description === 'Salary Charged') {
                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Salary = $scope.invoice[i].rate;
                        } else {
                            Salary = 0;
                        }
                        if (!angular.isUndefined($scope.invoice[i].quantity) || $scope.invoice[i].quantity !== null || $scope.invoice[i].quantity !== 0) {
                            salaryChargedQuantity = $scope.invoice[i].quantity;
                        } else {
                            salaryChargedQuantity = 0;
                        }

                        //salaryTotalAmount = Salary * salaryChargedQuantity;
                    } else if ($scope.invoice[i].description === 'Overtime Rate') {
                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Overtime = $scope.invoice[i].rate;
                        } else {
                            Overtime = 0;
                        }
                        if (!angular.isUndefined($scope.invoice[i].quantity) || $scope.invoice[i].quantity !== null || $scope.invoice[i].quantity !== 0) {
                            overtimeQuantity = $scope.invoice[i].quantity;
                        } else {
                            overtimeQuantity = 0;
                        }
                        //overtimeTotalAmount = Overtime * overtimeQuantity;
                    } else if ($scope.invoice[i].description === 'Outstation Rate') {
                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Outstation = $scope.invoice[i].rate;
                        } else {
                            Outstation = 0;
                        }
                        if (!angular.isUndefined($scope.invoice[i].quantity) || $scope.invoice[i].quantity !== null || $scope.invoice[i].quantity !== 0) {
                            outstationQuantity = $scope.invoice[i].quantity;
                        } else {
                            outstationQuantity = 0;
                        }
                        //outstationTotalAmount = Outstation * outstationQuantity;
                    } else if ($scope.invoice[i].description === 'Night Stay Rate') {

                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Night = $scope.invoice[i].rate;
                        } else {
                            Night = 0;
                        }
                        if (!angular.isUndefined($scope.invoice[i].quantity) || $scope.invoice[i].quantity !== null || $scope.invoice[i].quantity !== 0) {
                            nightStayQuantity = $scope.invoice[i].quantity;
                        } else {
                            nightStayQuantity = 0;
                        }
                        //nightStayTotalAmount = Night * nightStayQuantity;
                    } else if ($scope.invoice[i].description === 'Extra Day Rate') {
                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Extra = $scope.invoice[i].rate;
                        } else {
                            Extra = 0;
                        }
                        if (!angular.isUndefined($scope.invoice[i].quantity) || $scope.invoice[i].quantity !== null || $scope.invoice[i].quantity !== 0) {
                            extraDayQuantity = $scope.invoice[i].quantity;
                        } else {
                            extraDayQuantity = 0;
                        }

                        //extraDayTotalAmount = Extra * extraDayQuantity;

                    } else if ($scope.invoice[i].description === 'Admin Charge') {
                        if (!angular.isUndefined($scope.invoice[i].rate) || $scope.invoice[i].rate !== null || $scope.invoice[i].rate !== 0) {
                            Admin = $scope.invoice[i].rate;
                        } else {
                            Admin = 0;
                        }

                    } else {
                        Salary = 0;
                        salaryChargedQuantity = 0;
                        Overtime = 0;
                        overtimeQuantity = 0;
                        Outstation = 0;
                        outstationQuantity = 0;
                        Night = 0;
                        nightStayQuantity = 0;
                        Extra = 0;
                        extraDayQuantity = 0;
                        Admin = 0;

                    }
                }
                var compName = $localStorage.get('selectedCompanyName');
                var billSDate = new Date(
                    date.frmDate.getFullYear(),
                    date.frmDate.getMonth(),
                    date.frmDate.getDate() + 1);
                var billEDate = new Date(
                    date.toDate.getFullYear(),
                    date.toDate.getMonth(),
                    date.toDate.getDate() + 1);

                Company1CustomerBills.generateCustomerMultipleBills({
                    customerId: $rootScope.idForGenerateBill,
                    billFromDate: billSDate,
                    billTodate: billEDate,
                    grandTotal: $rootScope.grandTotal,
                    userId: $rootScope.userId,
                    subTotal: $rootScope.total,
                    cgst: $rootScope.cgst,
                    sgst: $rootScope.sgst,
                    status: 'P',
                    companyName: compName,
                    salaryChargedAmount: Salary,
                    overtimeAmount: Overtime,
                    outstationAmount: Outstation,
                    nightStayAmount: Night,
                    extraDayAmount: Extra,
                    adminCharge: Admin,
                    salaryChargedQuantity: salaryChargedQuantity,
                    overtimeQuantity: overtimeQuantity,
                    outstationQuantity: outstationQuantity,
                    nightStayQuantity: nightStayQuantity,
                    extraDayQuantity: extraDayQuantity,
                    reverseCharge: date.reverseCharged,
                    adminChargeRate: $rootScope.adminChargeRate,
                    adminChargeUnit: $rootScope.adminChargeUnit,
                    advanceAmount: $scope.Advance,
                    netAmount: grandTotal,
                    remark:date.remark,
                    driverId:driverId
                }, function(generatesunccess) {
                    for (var i = 0; i<$rootScope.driverArray.length; i++) {
        if(date.driverName === $rootScope.driverArray[i].driverName){
        var index = $rootScope.driverArray.indexOf($rootScope.driverArray[i]);
        $rootScope.driverArray.splice(index, 1);
        $scope.isDisabledButtongen = false;

                   // $modalInstance.dismiss('cancel');
                    var genBId = parseInt(generatesunccess[0].generate_customer_multiplebills);

                    $localStorage.put('localStoragePrintBillId', genBId);
                    //$state.go('app.billPrintPage');
                    $rootScope.loader = 0;
                    $rootScope.total = undefined;
            $rootScope.grandTotal = undefined;
            $rootScope.cgst = undefined;
            $rootScope.sgst = undefined;
             $scope.Advance = 0;
            $rootScope.adminChargeRate = undefined;
            $rootScope.adminChargeUnit = undefined;
            $scope.isDisabledButtongen = false;
            $rootScope.AdminCharge = undefined;
             $rootScope.Salary = undefined;
            $rootScope.Overtime = undefined;
            $rootScope.Outstation = undefined;
            $rootScope.Night = undefined;
            $rootScope.Extra = undefined;
            $rootScope.Admin = undefined;
            $rootScope.AdminCharge = undefined;
            $scope.invoice = [];
                $rootScope.invoice1 = [];
        //$scope.generateBillSubmit(date,driverId);
               
        }
        }
                    
                }, function(generateerror) {
                    $rootScope.loader = 0;
                    $scope.isDisabledButtongen = false;
                   // $modalInstance.dismiss('cancel');
                    console.log('generate error: ' + JSON.stringify(generateerror));
                });
                $rootScope.loader = 0;
            }


        }
        
        $scope.SubmitAndPrint = function(){
          var printBillId = $localStorage.get('localStoragePrintBillId');  
          Company2CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    }
                }
            },function(suc){
                suc.isInitiated = false;
                suc.$save();
                $state.go('app.multiplebillPrintPage');

            },function(r){

            });
            
        }
            $rootScope.getmultiplePrintBillDetails = function() {//bill print page

        $rootScope.loader = 1;

        //$rootScope.customerData = [];
        $scope.adminChargeAmount = 0;
        var allBillData = [];
        var salaryChargedAmt = [];
        var drivers = [];
       var DriverNames = [];
       var monthlySalary1 = [];
       var salaryChargedQty = [];
  var salaryChargedRate1 = [];
  var salaryChargedUnit1 = [];
       $rootScope.multipleDetails= [];
        $rootScope.printBillDetails = [];
        var salaryChargedAmt = [];
        var driverName1 = [];
        var compName = $localStorage.get('selectedCompanyName');
        var printBillId = $localStorage.get('localStoragePrintBillId');
Company2CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    },
                    include: [{
                        relation: 'company2MultipleBillDetails',
                        scope:{
                            include:{
                              relation:'company2DriverDetails',
                            scope:{
                            include: {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                            }
                            }  
                            }
                            
                        }
                    }, {
                        relation: 'company2CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company2CustomerRate' 
                                
                            }]
                        }
                    },]
                }
            }, function(printBillData) {
                console.log('print bill Data ' + JSON.stringify(printBillData));
                
                if (angular.isDefined(printBillData)) {

                    var billDate = moment(printBillData.billDate).format('YYYY-MM-DD');
                    var billStartDate = moment(printBillData.billFromDate).format('YYYY-MM-DD');
                    var billEndDate = moment(printBillData.billToDate).format('YYYY-MM-DD');
                    var name;
                    if (angular.isUndefined(printBillData.company2CustomerDetails.conUsers.middleName) || printBillData.company2CustomerDetails.conUsers.middleName == null) {
                        name = printBillData.company2CustomerDetails.conUsers.firstName + ' ' + printBillData.company2CustomerDetails.conUsers.lastName;
                    } else {
                        name = printBillData.company2CustomerDetails.conUsers.firstName + ' ' + printBillData.company2CustomerDetails.conUsers.middleName + ' ' + printBillData.company2CustomerDetails.conUsers.lastName;
                    }
                    var note = null;
                    if (!angular.isUndefined(printBillData.company2CustomerDetails.note) || printBillData.company2CustomerDetails.note !== null || printBillData.company2CustomerDetails.note !== '') {
                        note = printBillData.company2CustomerDetails.note;
                    }

                    if (printBillData.company2MultipleBillDetails.length > 0) {
                        for (var i = 0; i < printBillData.company2MultipleBillDetails.length; i++) {

                            if (printBillData.company2MultipleBillDetails[i].itemId === '1') {

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var salaryChargedAmount = printBillData.company2MultipleBillDetails[i].amount;
                                } else {
                                    var salaryChargedAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var salaryChargedQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var salaryChargedQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var salaryChargedRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var salaryChargedRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2MultipleBillDetails[i].unit !== null || printBillData.company2MultipleBillDetails[i].unit !== 0) {
                                    var salaryChargedUnit = printBillData.company2MultipleBillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2MultipleBillDetails[i].itemId === '2') {
                                
                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var overTimeAmount = printBillData.company2MultipleBillDetails[i].amount;
                                } else {
                                    var overTimeAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var overTimeQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var overTimeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var overTimeRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var overTimeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2MultipleBillDetails[i].unit !== null || printBillData.company2MultipleBillDetails[i].unit !== 0) {
                                    var overTimeUnit = printBillData.company2MultipleBillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2MultipleBillDetails[i].itemId === '3') {


                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var outstationAmount = printBillData.company2MultipleBillDetails[i].amount;
                                } else {
                                    var outstationAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var outstationQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var outstationQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var outstationRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var outstationRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2MultipleBillDetails[i].unit !== null || printBillData.company2MultipleBillDetails[i].unit !== 0) {
                                    var outstationUnit = printBillData.company2MultipleBillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2MultipleBillDetails[i].itemId === '4') {

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var nightStayAmount = printBillData.company2MultipleBillDetails[i].amount;
                                } else {
                                    var nightStayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var nightStayQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var nightStayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var nightStayRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var nightStayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2MultipleBillDetails[i].unit !== null || printBillData.company2MultipleBillDetails[i].unit !== 0) {
                                    var nightStayUnit = printBillData.company2MultipleBillDetails[i].unit;
                                } 
                            }
                            if (printBillData.company2MultipleBillDetails[i].itemId === '5') {

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var extraDayAmount = printBillData.company2MultipleBillDetails[i].amount;
                                } else {
                                    var extraDayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var extraDayQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var extraDayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var extraDayRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var extraDayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2MultipleBillDetails[i].unit !== null || printBillData.company2MultipleBillDetails[i].unit !== 0) {
                                    var extraDayUnit = printBillData.company2MultipleBillDetails[i].unit;
                                } 
                            }
                            if (printBillData.company2MultipleBillDetails[i].itemId === '6') {

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].amount) || printBillData.company2MultipleBillDetails[i].amount !== null || printBillData.company2MultipleBillDetails[i].amount !== 0) {
                                    var adminChargeAmount = printBillData.company2MultipleBillDetails[i].amount;
                                    $scope.adminChargeAmount = adminChargeAmount+$scope.adminChargeAmount
                                } else {
                                    var adminChargeAmount = 0;
                                    $scope.adminChargeAmount = $scope.adminChargeAmount+0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].quantity) || printBillData.company2MultipleBillDetails[i].quantity !== null || printBillData.company2MultipleBillDetails[i].quantity !== 0) {
                                    var adminChargeQuantity = printBillData.company2MultipleBillDetails[i].quantity;
                                } else {
                                    var adminChargeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].rate) || printBillData.company2MultipleBillDetails[i].rate !== null || printBillData.company2MultipleBillDetails[i].rate !== 0) {
                                    var adminChargeRate = printBillData.company2MultipleBillDetails[i].rate;
                                } else {
                                    var adminChargeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2MultipleBillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var adminChargeUnit = printBillData.company2MultipleBillDetails[i].unit;

                                }
                                var adminChargeText = null;
                                if (adminChargeUnit === 'Percentage') {
                                    adminChargeText = adminChargeRate + '%';
                                } else {
                                    adminChargeText = '';
                                }
                                   
$rootScope.multipleDetails.push({
driverName:printBillData.company2MultipleBillDetails[i].company2DriverDetails.driverDetails.conUsers.firstName + ' ' + printBillData.company2MultipleBillDetails[i].company2DriverDetails.driverDetails.conUsers.lastName,
monthlySalary:printBillData.company2MultipleBillDetails[i].company2DriverDetails.monthlySalary,
salaryChargedAmt:Math.round(salaryChargedAmount),
salaryChargedQty: salaryChargedQuantity,
salaryChargedRate: Math.round(salaryChargedRate),
salaryChargedUnit: salaryChargedUnit,
overTimeAmt: Math.round(overTimeAmount),
overTimeQty: overTimeQuantity,
overTimeRate: Math.round(overTimeRate),
overTimeUnit: overTimeUnit,
outstationAmt: Math.round(outstationAmount),
outstationQty: outstationQuantity,
outstationRate: Math.round(outstationRate),
outstationUnit: outstationUnit,
nightStayAmt: Math.round(nightStayAmount),
nightStayQty: nightStayQuantity,
nightStayRate: Math.round(nightStayRate),
nightStayUnit: nightStayUnit,
extraDayAmt: Math.round(extraDayAmount),
extraDayQty: extraDayQuantity,
extraDayRate: Math.round(extraDayRate),
extraDayUnit: extraDayUnit,
adminChargeAmt: Math.round(adminChargeAmount),
adminChargeQty: adminChargeQuantity,
adminChargeRate: Math.round(adminChargeRate),
adminChargeUnit: adminChargeUnit,
adminChargeTxt: adminChargeText,
total: Math.round(salaryChargedAmount + overTimeAmount + outstationAmount + nightStayAmount + extraDayAmount)

                    });
                            }
                        }

    
                    }

                    var netAmount = 0;
                    var advance = 0;
                    if (angular.isUndefined(printBillData.advanceAmount) || printBillData.advanceAmount === null || printBillData.advanceAmount === '') {
                        advance = 0;
                    } else {
                        advance = printBillData.advanceAmount;
                    }

                    if (angular.isUndefined(printBillData.netAmount) || printBillData.netAmount === null || printBillData.netAmount === '') {
                        netAmount = 0;
                    } else {
                        netAmount = printBillData.netAmount;
                    }

                    allBillData.push({
                        id: printBillData.id,
                        customerBillDate: billDate,
                        grandTotal: Math.round(printBillData.total),
                        total: Math.round(salaryChargedAmount + overTimeAmount + outstationAmount + nightStayAmount + extraDayAmount),
                        note: note,
                        subTotal: Math.round(printBillData.subTotal),
                        cgst: Math.round(printBillData.cgst),
                        sgst: Math.round(printBillData.sgst),
                        status: printBillData.status,
                        billFromDate: billStartDate,
                        billToDate: billEndDate,
                        reverseCharge: printBillData.reverseCharge,
                        gstnNumber: printBillData.company2CustomerDetails.gstinNumber,
                        hsaNumber: printBillData.company2CustomerDetails.hsaNumber,
                        companyName: printBillData.company2CustomerDetails.companyName,
                        monthlySalary: Math.round(salaryChargedRate * 30),
                        customerName: name,
                        firstName: printBillData.company2CustomerDetails.conUsers.firstName,
                        lastName: printBillData.company2CustomerDetails.conUsers.lastName,
                        email: printBillData.company2CustomerDetails.conUsers.email,
                        mobileNumber: printBillData.company2CustomerDetails.conUsers.mobileNumber,
                        address: printBillData.company2CustomerDetails.conUsers.address,
                        contactPersonName: printBillData.company2CustomerDetails.contactPersonName,
                        salaryChargedAmt: salaryChargedAmt,
                        salaryChargedQty: salaryChargedQuantity,
                        overTimeAmt: Math.round(overTimeAmount),
                        overTimeQty: overTimeQuantity,
                        outstationAmt: Math.round(outstationAmount),
                        outstationQty: outstationQuantity,
                        nightStayAmt: Math.round(nightStayAmount),
                        nightStayQty: nightStayQuantity,
                        extraDayAmt: Math.round(extraDayAmount),
                        extraDayQty: extraDayQuantity,
                        adminChargeAmt: Math.round($scope.adminChargeAmount),
                        adminChargeQty: adminChargeQuantity,
                        salaryChargedRate: Math.round(salaryChargedRate),
                        salaryChargedUnit: salaryChargedUnit,
                        overTimeRate: Math.round(overTimeRate),
                        overTimeUnit: overTimeUnit,
                        outstationRate: Math.round(outstationRate),
                        outstationUnit: outstationUnit,
                        extraDayRate: Math.round(extraDayRate),
                        extraDayUnit: extraDayUnit,
                        nightStayRate: Math.round(nightStayRate),
                        nightStayUnit: nightStayUnit,
                        adminChargeRate: Math.round(adminChargeRate),
                        adminChargeUnit: adminChargeUnit,
                        adminChargeTxt: adminChargeText,
                        advanceAmount: advance,
                        netAmount: Math.round(netAmount),
                        companyGstn: '27AAECI1252K1ZL',
                        panNumber:'AAECI1252K',
                        driverName:printBillData.driverName,
                        remark:printBillData.remark,
                        driverDetails:DriverNames


                    });
                    
                }


                $rootScope.printBillDetails = allBillData;

                //console.log('customer scope Data ' + JSON.stringify($rootScope.printBillDetails));

                $rootScope.loader = 0;


            }, function(printBillErr) {

                console.log('bill error ' + JSON.stringify(printBillErr));
                if (customerErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
};
$scope.backFromPrintPage = function() {
            var billId = $localStorage.get('billId');
            if(angular.isUndefined(billId) || billId === null || billId === ''){
               $rootScope.printBillDetails = [];
        $rootScope.otherPrintBillDetails = [];
        $localStorage.put('localStoragePrintBillId', undefined);
        $state.go('app.billingCustomerDetails');      
            }else{
                $rootScope.printBillDetails = [];
        $rootScope.otherPrintBillDetails = [];
        $localStorage.put('localStoragePrintBillId', undefined);
              $state.go('app.searchBillById');   
            }
       

    }
    $rootScope.printBill = function() {//print bill

        printElement(document.getElementById("printThis"));
        var modThis = document.querySelector("#printSection");
        //modThis.appendChild(document.createTextNode(" new"));
        window.print();

    };

    function printElement(elem) { 
        var domClone = elem.cloneNode(true);

        var $printSection = document.getElementById("printSection");

        if (!$printSection) {
            var $printSection = document.createElement("div");
            $printSection.id = "printSection";
            document.body.appendChild($printSection);
        }

        $printSection.innerHTML = "";

        $printSection.appendChild(domClone);
    }



        $scope.generateOtherBillSubmit = function(date) {//generate other bill
            $rootScope.loader = 1;


            var count = 0;
            if (angular.isUndefined($scope.Advance) || $scope.Advance === null || $scope.Advance === '') {

                $scope.Advance = 0;
                var grandTotal = $rootScope.grandTotal - $scope.Advance;
            } else {
                var grandTotal = $rootScope.grandTotal - $scope.Advance;


            }
            if ($scope.invoice.length === 0) {
                document.getElementById("Description").style.borderColor = "red";
                document.getElementById("Description1").innerHTML = '*required';

                document.getElementById("amount").style.borderColor = "red";
                document.getElementById("amount1").innerHTML = '*required';
                count++;
            } else {


                document.getElementById("Description").style.borderColor = "#dde6e9";
                document.getElementById("Description1").innerHTML = '';

                document.getElementById("amount").style.borderColor = "#dde6e9";
                document.getElementById("amount1").innerHTML = '';

            }
            if (angular.isUndefined(date)) {

                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required';
                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate1").innerHTML = '*required';
                document.getElementById("rcy").style.borderColor = "red";
                document.getElementById("rcy1").innerHTML = '*required';
                count++;
            } else {
                if (angular.isUndefined(date.frmDate) || date.frmDate === null || date.frmDate === '') {
                    document.getElementById("frmDate").style.borderColor = "red";
                    document.getElementById("frmDate1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("frmDate").style.borderColor = "#dde6e9";
                    document.getElementById("frmDate1").innerHTML = '';
                }
                if (angular.isUndefined(date.toDate) || date.toDate === null || date.toDate === '') {
                    document.getElementById("toDate").style.borderColor = "red";
                    document.getElementById("toDate1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("toDate").style.borderColor = "#dde6e9";
                    document.getElementById("toDate1").innerHTML = '';
                }
                if (angular.isUndefined(date.reverseCharged) || date.reverseCharged === null || date.reverseCharged === '') {
                    document.getElementById("rcy").style.borderColor = "red";
                    document.getElementById("rcy1").innerHTML = '*required';
                    count++;
                } else {
                    document.getElementById("rcy").style.borderColor = "#dde6e9";
                    document.getElementById("rcy1").innerHTML = '';
                }

            }
            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {
                $scope.isDisabledButtongen = true;

                var compName = $localStorage.get('selectedCompanyName');
                var billSDate = new Date(
                    date.frmDate.getFullYear(),
                    date.frmDate.getMonth(),
                    date.frmDate.getDate() + 1);
                var billEDate = new Date(
                    date.toDate.getFullYear(),
                    date.toDate.getMonth(),
                    date.toDate.getDate() + 1);

                Company1CustomerBills.generateCustomerOtherBills({
                    customerId: $rootScope.idForGenerateOtherBill,
                    billFromDate: billSDate,
                    billTodate: billEDate,
                    grandTotal: $rootScope.grandTotal,
                    userId: $rootScope.userId,
                    subTotal: $rootScope.total,
                    cgst: $rootScope.cgst,
                    sgst: $rootScope.sgst,
                    companyName: compName,
                    reverseCharge: date.reverseCharged,
                    advanceAmount: $scope.Advance,
                    netAmount: grandTotal,
                    itemId: $scope.invoice[0].id,
                    amount: $scope.invoice[0].amount,
                    remark:date.remark
                    
                }, function(generatesunccess) {

                    $scope.isDisabledButtongen = false;

                    $modalInstance.dismiss('cancel');
                    var genBId = parseInt(generatesunccess[0].generate_customer_other_bills);

                    $localStorage.put('localStoragePrintBillId', genBId);
                    $state.go('app.otherBillPrintPage');
                    $rootScope.loader = 0;

                }, function(generateerror) {
                    $rootScope.loader = 0;
                    $scope.isDisabledButtongen = false;
                    $modalInstance.dismiss('cancel');
                    console.log('generate error: ' + JSON.stringify(generateerror));
                });
                $rootScope.loader = 0;
            }


        }
        $rootScope.dateDay = [{
            'desc': 1
        }, {
            'desc': 2
        }, {
            'desc': 3
        }, {
            'desc': 4
        }, {
            'desc': 5
        }, {
            'desc': 6
        }, {
            'desc': 7
        }, {
            'desc': 8
        }, {
            'desc': 9
        }, {
            'desc': 10
        }, {
            'desc': 11
        }, {
            'desc': 12
        }, {
            'desc': 13
        }, {
            'desc': 14
        }, {
            'desc': 15
        }, {
            'desc': 16
        }, {
            'desc': 17
        }, {
            'desc': 18
        }, {
            'desc': 19
        }, {
            'desc': 20
        }, {
            'desc': 21
        }, {
            'desc': 22
        }, {
            'desc': 23
        }, {
            'desc': 24
        }, {
            'desc': 25
        }, {
            'desc': 26
        }, {
            'desc': 27
        }, {
            'desc': 28
        }, {
            'desc': 29
        }, {
            'desc': 30
        }, {
            'desc': 31
        }];
        

    $scope.allocatedDriverList = function()
    {   $rootScope.allAllocatedDriversId=[];
        $rootScope.driverInfo=[];
        var customerId = $localStorage.get('billingCustomerId');
        Company2CustomerRate.find({
            filter:{

                where:{

                    company2CustomerId:customerId
                },include:{

                    relation: 'company2DriverDetails',
                    scope: {
                        include: {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                              
                    }
                    
                }
            } 
            }                           

             }, 
             function(success){
                for (var i = 0; i < success.length; i++) {
                  if(success[i].itemId === '1'){
                    if(angular.isDefined(success[i].company2DriverDetails.driverDetails.conUsers)){
                      $rootScope.driverInfo.push({
                        driverName: success[i].company2DriverDetails.driverDetails.conUsers.firstName + ' ' +success[i].company2DriverDetails.driverDetails.conUsers.lastName,
                        driverId:success[i].company2DriverDetails.driverId,
                        customerId:success[i].company2CustomerId,
                        company2driverId:success[i].company2driverId
                    });   
                    }
                    
                  }  
                }
                 
                 //$rootScope.driverInfo = success;
                 console.log($rootScope.driverInfo);
             },
             function(error){

             });
            }
$scope.getInfoForUpdateBill = function() {//info for update bill
             $scope.allocatedDriverList();
             var char=0;
             var n=0;
            var updateBillId = $localStorage.get('updateMultipleBillId');
            $rootScope.updateInfo = null;
            var updateBillData = null;
              $scope.driverDetails = [];
            var compName = $localStorage.get('selectedCompanyName');
             
                Company2CustomerBills.findOne({
                filter: {
                    where: {
                        id: updateBillId
                    },
                    include: [{
                        relation: 'company2MultipleBillDetails',
                        scope:{
                            include:{
                              relation:'company2DriverDetails',
                            scope:{
                            include: {
                            relation: 'driverDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                            }
                            }  
                            }
                            
                        }
                    }, {
                        relation: 'company2CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company2CustomerRate' 
                                
                            }]
                        }
                    },]
                }
                }, function(info) {

                    for(i=0;i<info.company2MultipleBillDetails.length;i=i+6){
                        n=n+1;
                        for(k=0;k<$rootScope.driverInfo.length;k++){

                        if( $rootScope.driverInfo[k].driverId.includes(info.company2MultipleBillDetails[i].company2DriverDetails.driverId)){
                            char=char+1;
                            break;
                        }
                        console.log(n,char);
                    }

                    // for(j=0;j<$rootScope.driverInfo.length;j++){
                    //     // if(info.company2MultipleBillDetails[i].company2DriverId == $rootScope.driverInfo[i].company2driverId){
                    //     //      char =+  1;
                    //     // }

                    // }

                    }


                    console.log('info: ' + JSON.stringify(info));
                   

                    if(char==n){
                    if (angular.isDefined(info) && info !== null) {
                        var salDesc = null;
                        var salRate = 0;
                        var salUnit = null;
                        var salQty = 0;
                        var ovtDesc = null;
                        var ovtRate = 0;
                        var ovtUnit = null;
                        var ovtQty = 0;
                        var otDesc = null;
                        var otRate = 0;
                        var otUnit = null;
                        var otQty = 0;
                        var nsDesc = null;
                        var nsRate = 0;
                        var nsUnit = null;
                        var nsQty = 0;
                        var edDesc = null;
                        var edRate = 0;
                        var edUnit = null;
                        var edQty = 0;
                        var acDesc = null;
                        var acRate = 0;
                        var acUnit = null;
                        var pfDesc = null
                        var pfAmt = 0;
                        var bsDesc = null
                        var bsAmt = 0;
                        var arDesc = null
                        var arAmt = 0;
                        var prDesc = null
                        var prAmt = 0;

                        

                        for (var i = 0; i < info.company2MultipleBillDetails.length; i++) {

                            if (info.company2MultipleBillDetails[i].itemId === '1') {
                                salQty = info.company2MultipleBillDetails[i].quantity;
                                

                            }
                            if (info.company2MultipleBillDetails[i].itemId === '2') {
                                ovtQty = info.company2MultipleBillDetails[i].quantity;


                            }
                            if (info.company2MultipleBillDetails[i].itemId === '3') {
                                otQty = info.company2MultipleBillDetails[i].quantity;

                            }
                            if (info.company2MultipleBillDetails[i].itemId === '4') {
                                nsQty = info.company2MultipleBillDetails[i].quantity;

                            }
                            if (info.company2MultipleBillDetails[i].itemId === '5') {
                                edQty = info.company2MultipleBillDetails[i].quantity;

                            }
                             
                            

                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '1') {
                                salDesc = 'Salary Charged';
                                salRate = info.company2CustomerDetails.company2CustomerRate[i].value.toFixed(2);
                                salUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;


                            }
                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '2') {
                                ovtDesc = 'Overtime Rate';
                                ovtRate = info.company2CustomerDetails.company2CustomerRate[i].value.toFixed(2);
                                ovtUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;


                            }
                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '3') {
                                otDesc = 'Outstation Rate';
                                otRate = info.company2CustomerDetails.company2CustomerRate[i].value.toFixed(2);
                                otUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;


                            }
                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '4') {
                                nsDesc = 'Night Stay Rate';
                                nsRate = info.company2CustomerDetails.company2CustomerRate[i].value.toFixed(2);
                                nsUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;


                            }
                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '5') {
                                edDesc = 'Extra Day Rate';
                                edRate = info.company2CustomerDetails.company2CustomerRate[i].value.toFixed(2);
                                edUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;


                            }
                            if (info.company2CustomerDetails.company2CustomerRate[i].itemId === '6') {

                                acDesc = 'Admin Charge';
                                acRate = info.company2CustomerDetails.company2CustomerRate[i].value;
                                acUnit = info.company2CustomerDetails.company2CustomerRate[i].unit;
                             $scope.driverDetails.push({
                                driverName:info.company2MultipleBillDetails[i].company2DriverDetails.driverDetails.conUsers.firstName + ' ' + info.company2MultipleBillDetails[i].company2DriverDetails.driverDetails.conUsers.lastName,
                                driverId:info.company2MultipleBillDetails[i].company2DriverId,
                                salaryDesc: salDesc,
                                salaryRate: salRate,
                                salaryUnit: salUnit,
                                salaryQty: salQty,
                                overtimeDesc: ovtDesc,
                                overtimeRate: ovtRate,
                                overtimeUnit: ovtUnit,
                                overtimeQty: ovtQty,
                                outstationDesc: otDesc,
                                outstationRate: otRate,
                                outstationUnit: otUnit,
                                outstationQty: otQty,
                                nightStayDesc: nsDesc,
                                nightStayRate: nsRate,
                                nightStayUnit: nsUnit,
                                nightStayQty: nsQty,
                                extraDayDesc: edDesc,
                                extraDayRate: edRate,
                                extraDayUnit: edUnit,
                                extraDayQty: edQty,
                                adminChargeDesc: acDesc,
                                adminChargeRate: acRate,
                                adminChargeUnit: acUnit,
                                prDescription: prDesc,
                                prAmount: prAmt
                                                
                             });

                            }

                        


                        }



                        var createdDate = moment(info.createdDate).format('DD-MM-YYYY');

                        if (angular.isDefined(info.updatedDate)) {
                            var updatedDate = moment(info.updatedDate).format('DD-MM-YYYY');
                        }

                        ConUsers.findById({
                                id: info.createdBy
                            },
                            function(createdData) {
                                var createdByName = createdData.firstName + ' ' + createdData.lastName;
                                if (info.updatedBy !== null) {
                                    ConUsers.findById({
                                            id: info.updatedBy
                                        },
                                        function(updatedData) {
                                            var updatedByName = updatedData.firstName + ' ' + updatedData.lastName;

                                            updateBillData = {
                                                billId: info.id,
                                                billCustId: info.company2CustomerId,
                                                custName: info.company2CustomerDetails.conUsers.firstName + ' ' + info.company2CustomerDetails.conUsers.lastName,
                                                mobileNumber: info.company2CustomerDetails.conUsers.mobileNumber,
                                                billFromDate: info.billFromDate,
                                                billToDate: info.billToDate,
                                                billDate: info.billDate,
                                                reverseCharge: info.reverseCharge,
                                                advanceAmount: info.advanceAmount,
                                                salaryDesc: salDesc,
                                                salaryRate: salRate,
                                                salaryUnit: salUnit,
                                                salaryQty: salQty,
                                                overtimeDesc: ovtDesc,
                                                overtimeRate: ovtRate,
                                                overtimeUnit: ovtUnit,
                                                overtimeQty: ovtQty,
                                                outstationDesc: otDesc,
                                                outstationRate: otRate,
                                                outstationUnit: otUnit,
                                                outstationQty: otQty,
                                                nightStayDesc: nsDesc,
                                                nightStayRate: nsRate,
                                                nightStayUnit: nsUnit,
                                                nightStayQty: nsQty,
                                                extraDayDesc: edDesc,
                                                extraDayRate: edRate,
                                                extraDayUnit: edUnit,
                                                extraDayQty: edQty,
                                                adminChargeDesc: acDesc,
                                                adminChargeRate: acRate,
                                                adminChargeUnit: acUnit,
                                                prDescription: prDesc,
                                                prAmount: prAmt,
                                                createdDate: createdDate,
                                                createdByName: 'Created by ' + createdByName + ' on',
                                                updatedDate: updatedDate,
                                                updatedByName: 'Updated by ' + updatedByName + ' on',
                                                status: info.status,
                                                remark:info.remark

                                            };
                                            $rootScope.updateInfo = updateBillData;
                                          console.log('updateInfo with h update: ' + JSON.stringify($scope.driverDetails));
                                            console.log('updateInfo with no update: ' + JSON.stringify($rootScope.updateInfo));
                                        },
                                        function(error) {
                                            console.log('error ' + JSON.stringify(error));
                                            $rootScope.loader = 0;
                                        });
                                } else {
                                    updateBillData = {
                                        billId: info.id,
                                        billCustId: info.company2CustomerId,
                                        custName: info.company2CustomerDetails.conUsers.firstName + ' ' + info.company2CustomerDetails.conUsers.lastName,
                                        mobileNumber: info.company2CustomerDetails.conUsers.mobileNumber,
                                        billFromDate: info.billFromDate,
                                        billToDate: info.billToDate,
                                        billDate: info.billDate,
                                        reverseCharge: info.reverseCharge,
                                        advanceAmount: info.advanceAmount,
                                        salaryDesc: salDesc,
                                        salaryRate: salRate,
                                        salaryUnit: salUnit,
                                        salaryQty: salQty,
                                        overtimeDesc: ovtDesc,
                                        overtimeRate: ovtRate,
                                        overtimeUnit: ovtUnit,
                                        overtimeQty: ovtQty,
                                        outstationDesc: otDesc,
                                        outstationRate: otRate,
                                        outstationUnit: otUnit,
                                        outstationQty: otQty,
                                        nightStayDesc: nsDesc,
                                        nightStayRate: nsRate,
                                        nightStayUnit: nsUnit,
                                        nightStayQty: nsQty,
                                        extraDayDesc: edDesc,
                                        extraDayRate: edRate,
                                        extraDayUnit: edUnit,
                                        extraDayQty: edQty,
                                        adminChargeDesc: acDesc,
                                        adminChargeRate: acRate,
                                        adminChargeUnit: acUnit,
                                        prDescription: prDesc,
                                        prAmount: prAmt,
                                        createdDate: createdDate,
                                        createdByName: 'Created by ' + createdByName + ' on',
                                        status: info.status,
                                        remark:info.remark

                                    };
                                    $rootScope.updateInfo = updateBillData;
                                    console.log('updateInfo with update: ' + JSON.stringify($rootScope.updateInfo));
                                }

                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });
                    }
                }else{
                    // alert("Driver is Deleted so Bill is not Available for Edit");
                    // $state.go('app.billingCustomerDetails');
                    $state.go('app.billingCustomerDetails');
                    $.notify(' Driver is Deleted so Bill is not Available for Edit.', {
                        status: 'danger'
                    });
                    $state.go('app.billingCustomerDetails');
                }

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            
            

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
        $scope.updateBill = function(driver, updateInfo) {//update bill
        console.log('updateInfo for update: ' + JSON.stringify(driver));
            $rootScope.loader = 1;
            $scope.isDisabledButtonUpdate = true;
            var count = 0;

            if (angular.isUndefined(updateInfo.billFromDate) || updateInfo.billFromDate === null || updateInfo.billFromDate === '') {
                document.getElementById("billFromDate").style.borderColor = "red";
                document.getElementById("billFromDate1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("billFromDate").style.borderColor = "#dde6e9";
                document.getElementById("billFromDate1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.billToDate) || updateInfo.billToDate === null || updateInfo.billToDate === '') {
                document.getElementById("billToDate").style.borderColor = "red";
                document.getElementById("billToDate1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("billToDate").style.borderColor = "#dde6e9";
                document.getElementById("billToDate1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.billDate) || updateInfo.billDate === null || updateInfo.billDate === '') {
                document.getElementById("billDate").style.borderColor = "red";
                document.getElementById("billDate1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("billDate").style.borderColor = "#dde6e9";
                document.getElementById("billDate1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.reverseCharge) || updateInfo.reverseCharge === null || updateInfo.reverseCharge === '') {
                document.getElementById("reverseCharge").style.borderColor = "red";
                document.getElementById("reverseCharge1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("reverseCharge").style.borderColor = "#dde6e9";
                document.getElementById("reverseCharge1").innerHTML = '';
            }


            if (angular.isUndefined(driver.salaryQty) || driver.salaryQty === null || driver.salaryQty === '') {
                document.getElementById("salaryQty").style.borderColor = "red";
                document.getElementById("salaryQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("salaryQty").style.borderColor = "#dde6e9";
                document.getElementById("salaryQty1").innerHTML = '';
            }
            if (angular.isUndefined(driver.overtimeQty) || driver.overtimeQty === null || driver.overtimeQty === '') {
                document.getElementById("overtimeQty").style.borderColor = "red";
                document.getElementById("overtimeQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("overtimeQty").style.borderColor = "#dde6e9";
                document.getElementById("overtimeQty1").innerHTML = '';
            }
            if (angular.isUndefined(driver.outstationQty) || driver.outstationQty === null || driver.outstationQty === '') {
                document.getElementById("outstationQty").style.borderColor = "red";
                document.getElementById("outstationQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("outstationQty").style.borderColor = "#dde6e9";
                document.getElementById("outstationQty1").innerHTML = '';
            }
            if (angular.isUndefined(driver.nightStayQty) || driver.nightStayQty === null || driver.nightStayQty === '') {
                document.getElementById("nightStayQty").style.borderColor = "red";
                document.getElementById("nightStayQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("nightStayQty").style.borderColor = "#dde6e9";
                document.getElementById("nightStayQty1").innerHTML = '';
            }
            if (angular.isUndefined(driver.extraDayQty) || driver.extraDayQty === null || driver.extraDayQty === '') {
                document.getElementById("extraDayQty").style.borderColor = "red";
                document.getElementById("extraDayQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("extraDayQty").style.borderColor = "#dde6e9";
                document.getElementById("extraDayQty1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.advanceAmount) || updateInfo.advanceAmount === null || updateInfo.advanceAmount === '') {
                document.getElementById("advanceAmount").style.borderColor = "red";
                document.getElementById("advanceAmount1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("advanceAmount").style.borderColor = "#dde6e9";
                document.getElementById("advanceAmount1").innerHTML = '';
            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButtonUpdate = false;
                $rootScope.loader = 0;

                return false;
            } else {
                $scope.count = 0;
                var adminChargeFlag = false;
                if (angular.isDefined(driver.adminCheck)) {
                    adminChargeFlag = driver.adminCheck;
                }
                var salaryChargeAmt = driver.salaryRate * driver.salaryQty;
                var overtimeAmt = driver.overtimeRate * driver.overtimeQty;
                var outstationAmt = driver.outstationRate * driver.outstationQty;
                var nightStayAmt = driver.nightStayRate * driver.nightStayQty;
                var extraDayAmt = driver.extraDayRate * driver.extraDayQty;
                var subTotal = salaryChargeAmt + overtimeAmt + outstationAmt + nightStayAmt + extraDayAmt;
                var adminChargeAmount = 0;
                if (adminChargeFlag === true) {
                    if (driver.adminChargeUnit === 'Percentage') {
                        adminChargeAmount = (subTotal * driver.adminChargeRate / 100);
                        subTotal = subTotal + adminChargeAmount;
                    } else {
                        adminChargeAmount = driver.adminChargeRate;
                        subTotal = subTotal + adminChargeAmount;
                    }
                }
                // var cgst = subTotal * 9 / 100;
                // var sgst = subTotal * 9 / 100;

                // var total = subTotal + cgst + sgst;
                // var netAmt = total - updateInfo.advanceAmount;

                // var compName = $localStorage.get('selectedCompanyName');
                 var amount=0;

                 
                    // Company2CustomerBills.findOne({
                    //     filter: {
                    //         where: {
                    //             id: updateInfo.billId

                    //         }
                    //     }
                    // }, function(BillSuccess) {
                    //     console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
                    //     // BillSuccess.billDate = updateInfo.billDate;
                    //     // BillSuccess.total = total;
                    //     // BillSuccess.remark = updateInfo.remark;
                    //     // BillSuccess.subTotal = subTotal;
                    //     // BillSuccess.cgst = cgst;
                    //     // BillSuccess.sgst = sgst;
                    //     // BillSuccess.billFromDate = updateInfo.billFromDate;
                    //     // BillSuccess.billToDate = updateInfo.billToDate;
                    //     // BillSuccess.reverseCharge = updateInfo.reverseCharge;
                    //     // BillSuccess.advanceAmount = updateInfo.advanceAmount;
                    //     // BillSuccess.netAmount = netAmt;
                    //     // BillSuccess.updatedBy = $rootScope.userId;
                    //     // BillSuccess.updatedDate = new Date();
                    //     // BillSuccess.$save();

                        Company2MultipleBillDetails.find({
                            filter: {
                                where: {
                                    billId: updateInfo.billId,
                                    company2DriverId:driver.driverId

                                }
                            }
                        }, function(BillDetailsSuccess) {
                            //console.log('BillDetailsSuccess: ' + JSON.stringify(BillDetailsSuccess));
                            if (BillDetailsSuccess.length > 0) {
                                for (var i = 0; i < BillDetailsSuccess.length; i++) {
                                    if (BillDetailsSuccess[i].itemId === '1') {
                                        amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = driver.salaryRate * driver.salaryQty;
                                        BillDetailsSuccess[i].quantity = driver.salaryQty;
                                        BillDetailsSuccess[i].rate = driver.salaryRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '2') {
                                        amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = driver.overtimeRate * driver.overtimeQty;
                                        BillDetailsSuccess[i].quantity = driver.overtimeQty;
                                        BillDetailsSuccess[i].rate = driver.overtimeRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '3') {
                                         amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = driver.outstationRate * driver.outstationQty;
                                        BillDetailsSuccess[i].quantity = driver.outstationQty;
                                        BillDetailsSuccess[i].rate = driver.outstationRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '4') {
                                        amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = driver.nightStayRate * driver.nightStayQty;
                                        BillDetailsSuccess[i].quantity = driver.nightStayQty;
                                        BillDetailsSuccess[i].rate = driver.nightStayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '5') {
                                        amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = driver.extraDayRate * driver.extraDayQty;
                                        BillDetailsSuccess[i].quantity = driver.extraDayQty;
                                        BillDetailsSuccess[i].rate = driver.extraDayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '6') {
                                        amount = amount+BillDetailsSuccess[i].amount;
                                        BillDetailsSuccess[i].amount = adminChargeAmount;
                                        BillDetailsSuccess[i].rate = driver.adminChargeRate;
                                        BillDetailsSuccess[i].unit = driver.adminChargeUnit;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();
                                        BillDetailsSuccess[i].$save();

                                       
                                    }
                                }
                            }
                            //$modalInstance.dismiss('cancel');
                            //$localStorage.put('localStoragePrintBillId', updateInfo.billId);
                            //$state.go('app.billPrintPage');
                            Company2CustomerBills.findOne({
                                filter: {
                                    where: {
                                        id: updateInfo.billId
        
                                    }
                                }
                            }, function(BillSuccess) {
                                console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
                                BillSuccess.subTotal = BillSuccess.subTotal+subTotal-amount;
                                subTotal=BillSuccess.subTotal;
                                
                                var cgst = subTotal * 9 / 100;
                                var sgst = subTotal * 9 / 100;
                
                                var total = subTotal + cgst + sgst;
                                var netAmt = total - updateInfo.advanceAmount;
        
                                BillSuccess.billDate = updateInfo.billDate;
                                BillSuccess.total = total;
                                BillSuccess.remark = updateInfo.remark;
                                BillSuccess.subTotal = subTotal;
                                BillSuccess.cgst = cgst;
                                BillSuccess.sgst = sgst;
                                BillSuccess.billFromDate = updateInfo.billFromDate;
                                BillSuccess.billToDate = updateInfo.billToDate;
                                BillSuccess.reverseCharge = updateInfo.reverseCharge;
                                BillSuccess.advanceAmount = updateInfo.advanceAmount;
                                BillSuccess.netAmount = netAmt;
                                BillSuccess.updatedBy = $rootScope.userId;
                                BillSuccess.updatedDate = new Date();
                                BillSuccess.$save();
                                reloadFunc();
                            $scope.getInfoForUpdateBill();
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                                
                            }, function(BillErr) {
                                console.log('BillErr: ' + JSON.stringify(BillErr));
                               // $modalInstance.dismiss('cancel');
                                $scope.isDisabledButtonUpdate = false;
                                $rootScope.loader = 0;
                            });
        
                            
                        }, function(BillDetailsErr) {
                            console.log('BillDetailsErr: ' + JSON.stringify(BillDetailsErr));
                           // $modalInstance.dismiss('cancel');
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        });


                   
                       
            }


        }

     
}]);
