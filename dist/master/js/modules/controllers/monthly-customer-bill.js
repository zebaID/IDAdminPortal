App.controller('customerBillCtrl', customerBillCtrl)

function customerBillCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, Company2DriverDetails, Company1CustomerDetails, Company1CustomerRate, Company2CustomerDetails, Company1CustomerBills, Company2CustomerBills, Company2CustomerRate, Company1BillDetails, Company2BillDetails, Company1Items, Company2Items) {
    'use strict';

    $rootScope.userId = $localStorage.get('userId');

    

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
                    if(angular.isDefined(success[i].company2DriverDetails)){
                            
                    
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
                }
                 
                $rootScope.getBillingCustomerDetails();
                 
             },
             function(error){

             });

            //  Company2DriverDetails.find({
            //     filter:{

            //         where:{
    
            //             company2CustomerId:customerId
            //         }
            //     }
            //  },function(success){
            //     for (var i = 0; i < success.length; i++) {

            //         $rootScope.allAllocatedDriversId.push({
            //             driverId:success[i].id
            //         })
            //     }
            //     console.log($rootScope.allAllocatedDriversId.length);

            //  },function(error){
            //      console.log(error);

            //  })

             
    }


    $scope.setCompany = function() {// on innit set the company name
        $rootScope.company = 'ID Car Drivers Pvt Ltd';
        $localStorage.put('selectedCompanyName', $rootScope.company);
        //console.log($rootScope.company);
        //$state.go('app.monthlyCustomerBilling');
    }

    $scope.setBillId = function(billId) { // to search bill by billid
         
        $localStorage.put('billId', billId);
        //console.log($rootScope.company);
        $state.go('app.searchBillById');
    }


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

    $rootScope.searchCustomerBillsPast = function(fromDate,ToDate) {//search bill by date
         $rootScope.loader = 1;

        //$rootScope.customerData = [];
        var allBillingCustomerData = [];
        var allCustomerBills = [];
        var fromDate = moment(fromDate).format('YYYY-MM-DD');
            var ToDate = moment(ToDate).format('YYYY-MM-DD');
        var bCId = $localStorage.get('billingCustomerId');
        var compName = $localStorage.get('selectedCompanyName');
        //console.log('id * ' + bCId);
         if (compName === 'ID Services') {
            Company1CustomerBills.getCompany1CustomerBills({
                        company2CustomerId: bCId,
                        fromDate:'2015-06-04',
                        ToDate:'2018-06-04'
            }, function(customerData) {


            }, function(customerErr) {

                console.log('customer error ' + JSON.stringify(customerErr));
                if (customerErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
         }else{
            Company2CustomerBills.getCompany2CustomerBills({
                        company2CustomerId: bCId,
                        fromDate:fromDate,
                        ToDate:ToDate
            }, function(customerData) {
console.log('customer all Data ' + JSON.stringify(customerData));
               if (!angular.isUndefined(customerData)) {
                        for (var i = 0; i < customerData.length; i++) {
                            var billDate = moment(customerData[i].bill_date).format('YYYY-MM-DD');
                            allCustomerBills.push({
                                id: customerData[i].id,
                                customerId: customerData[i].company2_customer_id,
                               // conuserId: customerData.conUsers.id,
                                customerBillDate: billDate,
                                billFromDate: customerData[i].bill_from_date,
                                billToDate: customerData[i].bill_to_date,
                                total: Math.round(customerData[i].total),
                                note: customerData[i].note,
                                subTotal: Math.round(customerData[i].sub_total),
                                cgst: Math.round(customerData[i].cgst),
                                sgst: Math.round(customerData[i].sgst),
                                gst: Math.round(customerData[i].cgst + customerData[i].sgst),
                                grandTotal:Math.round((customerData[i].sub_total*98/100)+(customerData[i].cgst)+(customerData[i].sgst)),
                                status: customerData[i].status,
                                billType: customerData[i].bill_type
                            });
                        }
                    }

                
                //$rootScope.address2 = landmark;
                //$rootScope.customerData = allCustomerData;
                $scope.data = allCustomerBills;
              //$state.go('app.billingCustomerDetails1');
               // $rootScope.companyCustomerData = allBillingCustomerData;
                //$rootScope.company1Cid = allBillingCustomerData[0].id;
               // $rootScope.cName = allBillingCustomerData[0].firstName + ' ' + allBillingCustomerData[0].lastName;
                //$rootScope.address = allBillingCustomerData[0].address;
               // $rootScope.contactNo = allBillingCustomerData[0].contactNo;


                 
                $scope.tableParams3.total($scope.data.length);
                $scope.tableParams3.reload();
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
     
    $rootScope.searchCustomerBillsById = function(id) {// serch customer bill by bill id
         $rootScope.loader = 1;

        //$rootScope.customerData = [];
        var allBillingCustomerData = [];
        var allCustomerBills = [];
        var compName = $localStorage.get('selectedCompanyName');
        var billId = $localStorage.get('billId');
        //console.log('id * ' + bCId);
         if (compName === 'ID Services') {
            Company1CustomerBills.getCompany2CustomerBillsById({
                        company2CustomerBillId: id 
            }, function(customerData) {


            }, function(customerErr) {

                console.log('customer error ' + JSON.stringify(customerErr));
                if (customerErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
         }else{
            Company2CustomerBills.getCompany2CustomerBillsById({
                        company2CustomerBillId: billId
            }, function(customerData) {
console.log('customer all Data ' + JSON.stringify(customerData));
               if (!angular.isUndefined(customerData)) {
                        for (var i = 0; i < customerData.length; i++) {
                            var billDate = moment(customerData[i].bill_date).format('YYYY-MM-DD');
                            allCustomerBills.push({
                                id: customerData[i].id,
                                customerId: customerData[i].company2_customer_id,
                               // conuserId: customerData.conUsers.id,
                                customerBillDate: billDate,
                                billFromDate: customerData[i].bill_from_date,
                                billToDate: customerData[i].bill_to_date,
                                total: Math.round(customerData[i].total),
                                note: customerData[i].note,
                                subTotal: Math.round(customerData[i].sub_total),
                                cgst: Math.round(customerData[i].cgst),
                                sgst: Math.round(customerData[i].sgst),
                                gst: Math.round(customerData[i].cgst + customerData[i].sgst),
                                status: customerData[i].status,
                                billType: customerData[i].bill_type
                            });
                        }
                    }

                
                //$rootScope.address2 = landmark;
                //$rootScope.customerData = allCustomerData;
                $scope.data = allCustomerBills;
                createTable();
              //$state.go('app.billingCustomerDetails1');
               // $rootScope.companyCustomerData = allBillingCustomerData;
                //$rootScope.company1Cid = allBillingCustomerData[0].id;
               // $rootScope.cName = allBillingCustomerData[0].firstName + ' ' + allBillingCustomerData[0].lastName;
                //$rootScope.address = allBillingCustomerData[0].address;
               // $rootScope.contactNo = allBillingCustomerData[0].contactNo;


                 
                /*$scope.tableParams3.total($scope.data.length);
                $scope.tableParams3.reload();*/
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
                            createdDate: customerData.conUsers.createdDate,

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
                 
                        company2CustomerId:bCId,
                     
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
                            createdDate: customerData[0].created_date,
                            billType: customerData[0].bill_type

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
                $rootScope.billType = allBillingCustomerData[0].billType;

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

    $scope.searchCustomerBills = function(fromDate, toDate) {//search bill by date validation
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
            $localStorage.put('searchBillFromDate', fromDate);
            $localStorage.put('searchBillToDate', toDate);
            $state.go('app.customerBillReport');
            $rootScope.loader = 0;
        }



    }

    $rootScope.fetchCustomerBills = function() {//search customer bill by date

        $rootScope.loader = 1;
        var allBillData = [];
        var fromDate = $localStorage.get('searchBillFromDate');
        var toDate = $localStorage.get('searchBillToDate');

        fromDate = (fromDate && !isNaN(Date.parse(fromDate))) ? Date.parse(fromDate) : 0;
        toDate = (toDate && !isNaN(Date.parse(toDate))) ? Date.parse(getCurrentDateTime(toDate)) : new Date().getTime();
        var compName = $localStorage.get('selectedCompanyName');
        if (compName === 'ID Services') {
            Company1CustomerBills.find({
                    filter: {
                        where: {
                            and: [{
                                billDate: {
                                    gte: fromDate
                                }
                            }, {
                                billDate: {
                                    lte: toDate
                                }
                            }]

                        },
                        include: {
                            relation: 'company1CustomerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                        }
                    }

                },
                function(billData) {
                    //console.log('bill data' + JSON.stringify(billData));
                    for (var i = 0; i < billData.length; i++) {


                        allBillData.push({
                            id: billData[i].id,
                            gstnNumber: billData[i].company1CustomerDetails.gstinNumber,
                            clientName: billData[i].company1CustomerDetails.conUsers.firstName + ' ' + billData[i].company1CustomerDetails.conUsers.lastName,
                            mobileNumber: billData[i].company1CustomerDetails.conUsers.mobileNumber,
                            billDate: billData[i].billDate,
                            subTotal: Math.round(billData[i].subTotal),
                            cgst: Math.round(billData[i].cgst),
                            sgst: Math.round(billData[i].sgst),
                            gst: Math.round(billData[i].cgst) + Math.round(billData[i].sgst),
                            total: Math.round(billData[i].total),
                            receivedAmount: Math.round(billData[i].receivedAmount),
                            diff:  Math.round(billData[i].receivedAmount - billData[i].total),
                            billType: billData[i].billType,
                            status: billData[i].status,
                            receivedBillDate: billData[i].receivedBillDate,
                            grandTotal:Math.round((billData[i].sub_total*98/100)+(billData[i].cgst)+(billData[i].sgst)),
                            remark: billData[i].remark
                        });


                    }

                    $scope.data = allBillData;

                    createTable();

                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        } else {
            Company2CustomerBills.find({
                    filter: {
                        where: {
                            and: [{
                                billDate: {
                                    gte: fromDate
                                }
                            }, {
                                billDate: {
                                    lte: toDate
                                }
                            }]

                        },
                        include: {
                            relation: 'company2CustomerDetails',
                            scope: {
                                include: {
                                    relation: 'conUsers'
                                }
                            }
                        }
                    }

                },
                function(billData) {
                    //console.log('bill data' + JSON.stringify(billData));
                    for (var i = 0; i < billData.length; i++) {


                        allBillData.push({
                            id: billData[i].id,
                            gstnNumber: billData[i].company2CustomerDetails.gstinNumber,
                            clientName: billData[i].company2CustomerDetails.conUsers.firstName + ' ' + billData[i].company2CustomerDetails.conUsers.lastName,
                            mobileNumber: billData[i].company2CustomerDetails.conUsers.mobileNumber,
                            billDate: billData[i].billDate,
                            subTotal: Math.round(billData[i].subTotal),
                            cgst: Math.round(billData[i].cgst),
                            sgst: Math.round(billData[i].sgst),
                            gst: Math.round(billData[i].cgst) + Math.round(billData[i].sgst),
                            total: Math.round(billData[i].total),
                            receivedAmount: Math.round(billData[i].receivedAmount),
                            diff:  Math.round(billData[i].receivedAmount - billData[i].total),
                            billType: billData[i].billType,
                            grandTotal:Math.round((billData[i].subTotal*98/100)+(billData[i].cgst)+(billData[i].sgst)),
                            status: billData[i].status,
                            receivedBillDate: billData[i].receivedBillDate,
                            remark: billData[i].remark
                        });


                    }

                    $scope.data = allBillData;

                    createTable();

                    $rootScope.loader = 0;
                },
                function(transactionErr) {

                    console.log('transaction error ' + JSON.stringify(transactionErr));
                    if (transactionErr.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }

                    $rootScope.loader = 0;
                });
        }

    }

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
                        $state.go('app.billingCustomerDetails');

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
                        $state.go('app.billingCustomerDetails');

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
            $state.go('app.billingCustomerDetails');
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


    $rootScope.updateExistingUser = function() {// to add new bill with new customer


        $rootScope.createButtonDisable = true;
        //var cellNumber = document.getElementById('billingMobileNo_value').value;

        var modalInstance = $modal.open({
            templateUrl: '/addNewBillingCustomer.html',
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
    $scope.removeAppointDriver = function(removeDriver) { // popup to edit allocated driver details
       
       
        var modalInstance = $modal.open({
            templateUrl: '/removeDriver.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });

        $rootScope.removeDriver={
            driverId:removeDriver.driverId,
            customerId:removeDriver.customerId

        }
    }
    $scope.driverEdit = function(driverInfo1) { // popup to edit allocated driver details
        $rootScope.invoice1 = [];
        var otRate;
        var nsaRate;
        var edRate;
        var osaRate;
        var adminChargeType;
        var adminCharge;
       
       
        var modalInstance = $modal.open({
            templateUrl: '/driverInfoEdit.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });



       
       var company2driverId= driverInfo1.company2driverId;
           
            Company2DriverDetails.find({
                filter:{
                    where:{
                        
                        id:company2driverId
                    },include:{
                                    relation:'company2CustomerRate'
                                }
                }
            
            }, 
                 function(success){

                     
                     
                     $rootScope.driverInfo1 = success;
                     
                     console.log($rootScope.driverInfo1);
                     $rootScope.info =   $rootScope.driverInfo1[0].company2CustomerRate;
                     
                                 //console.log('info: ' + JSON.stringify(info));
             
                             for (var i = 0; i < $rootScope.driverInfo1[0].company2CustomerRate.length; i++) {
             
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '1') {
             
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Salary Charged',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
             
                                     }
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '2') {
                                         otRate= $rootScope.driverInfo1[0].company2CustomerRate[i].value.toFixed(2);
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Overtime Rate',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
             
                                     }
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '3') {
                                         osaRate=$rootScope.driverInfo1[0].company2CustomerRate[i].value.toFixed(2);
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Outstation Rate',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
             
             
                                     }
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '4') {
                                         nsaRate= $rootScope.driverInfo1[0].company2CustomerRate[i].value.toFixed(2);
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Night Stay Rate',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
             
                                     }
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '5') {
                                         edRate= $rootScope.driverInfo1[0].company2CustomerRate[i].value.toFixed(2);
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Extra Day Rate',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
             
                                     }
                                     if ($rootScope.driverInfo1[0].company2CustomerRate[i].itemId === '6') {
             
                                         // $rootScope.invoice1.push({
                                         //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
                                         //     'description': 'Admin Charge',
                                         //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value,
                                         //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
                                         // });
                                         adminCharge = $rootScope.driverInfo1[0].company2CustomerRate[i].value;
                                         adminChargeType = $rootScope.driverInfo1[0].company2CustomerRate[i].unit;
             
                                     }
             
                                 }
                     $rootScope.driverAppointInfoEdit = 
                     {
                         driverName:driverInfo1.driverName,
                         dutyHours: $rootScope.driverInfo1[0].dutyHours,
                         weeklyOff: $rootScope.driverInfo1[0].weeklyOff,
                         otRate: otRate,
                         nsaRate:nsaRate,
                         edRate: edRate,
                         monthlySalary: $rootScope.driverInfo1[0].monthlySalary,
                         drivercycle: $rootScope.driverInfo1[0].cycle,
                         appointedDate: $rootScope.driverInfo1[0].reportingDate,
                         osaRate:osaRate,
                        
                         adminCharge:adminCharge,
                         adminChargeType:adminChargeType,
                         company2CustomerId:$rootScope.driverInfo1[0].company2CustomerId,
                         company2DriverId:$rootScope.driverInfo1[0].id,
                         
                         driverId:$rootScope.driverInfo1[0].driverId
                      }
                 },
                 function(error){

                 })

        // $rootScope.info =   $rootScope.driverInfo1.driverDetails.company2CustomerRate;
        // var driverInfo = $rootScope.driverInfo1;
        //             //console.log('info: ' + JSON.stringify(info));

        //         for (var i = 0; i < driverInfo.driverDetails.company2CustomerRate.length; i++) {

        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '1') {

        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Salary Charged',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });

        //                 }
        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '2') {
        //                     otRate= driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2);
        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Overtime Rate',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });

        //                 }
        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '3') {
        //                     osaRate=driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2);
        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Outstation Rate',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });


        //                 }
        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '4') {
        //                     nsaRate= driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2);
        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Night Stay Rate',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });

        //                 }
        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '5') {
        //                     edRate= driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2);
        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Extra Day Rate',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value.toFixed(2),
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });

        //                 }
        //                 if (driverInfo.driverDetails.company2CustomerRate[i].itemId === '6') {

        //                     // $rootScope.invoice1.push({
        //                     //     'itemId': driverInfo.driverDetails.company2CustomerRate[i].itemId,
        //                     //     'description': 'Admin Charge',
        //                     //     'rate': driverInfo.driverDetails.company2CustomerRate[i].value,
        //                     //     'unit': driverInfo.driverDetails.company2CustomerRate[i].unit
        //                     // });
        //                     adminCharge = driverInfo.driverDetails.company2CustomerRate[i].value;
        //                     adminChargeType = driverInfo.driverDetails.company2CustomerRate[i].unit;

        //                 }

        //             }
        // $rootScope.driverAppointInfoEdit = 
        // {
        //     driverName:driverInfo.driverDetails.conUsers.firstName + driverInfo.driverDetails.conUsers.lastName,
        //     dutyHours: driverInfo.dutyHours,
        //     weeklyOff: driverInfo.weeklyOff,
        //     otRate: otRate,
        //     nsaRate:nsaRate,
        //     edRate: edRate,
        //     monthlySalary: driverInfo.monthlySalary,
        //     drivercycle: driverInfo.cycle,
        //     appointedDate: driverInfo.reportingDate,
        //     osaRate:osaRate,
           
        //     adminCharge:adminCharge,
        //     adminChargeType:adminChargeType,
        //     company2CustomerId:driverInfo.company2CustomerId,
        //     company2DriverId:driverInfo.id,
            
        //     driverId:driverInfo.driverId
        //  }
    }
    
    $scope.updateCompanyCustomerPopup = function(cid, uid) { // popup to update customer for company
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
    $scope.generateBill = function(cid) {//popup to generate bill
        $rootScope.idForGenerateBill = cid;
        $localStorage.put('idForGenerateBill', cid);
        //console.log('customer ID' + JSON.stringify($rootScope.idForGenerateBill));
if($rootScope.billType === 'Multiple'){
            $state.go('app.multipleBill');
        }else{
            window.alert('Please Change bill type first to multiple.');
       /* var modalInstance = $modal.open({
            templateUrl: '/billingPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });*/
    }
    }

    $scope.generateOtherBill = function(cid) {// generate other bill popupp
        $rootScope.idForGenerateOtherBill = cid;
        //console.log('customer ID' + JSON.stringify($rootScope.idForGenerateBill));

        var modalInstance = $modal.open({
            templateUrl: '/billingOtherPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
    $scope.updateBillFunction = function(bill) {//update bill based on monthly and
        if (bill.billType === 'Monthly') {
            $scope.updateBillPopup(bill);

        } else if(bill.billType === 'Multiple Driver Monthly'){
            $localStorage.put('updateMultipleBillId',bill.id)
            $state.go('app.updateMultipleBill');
        }else {
            $scope.updateOtherBillPopup(bill);
        }
    }

    $scope.updateBillPopup = function(bill) {//update bill popupp
        $rootScope.idForUpdateBill = bill.id;
        //console.log('customer ID' + JSON.stringify($rootScope.idForGenerateBill));

        var modalInstance = $modal.open({
            templateUrl: '/updateBillPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }

    $scope.updateOtherBillPopup = function(bill) {//update other bill
        $rootScope.idForUpdateBill = bill.id;
        //console.log('customer ID' + JSON.stringify($rootScope.idForGenerateBill));

        var modalInstance = $modal.open({
            templateUrl: '/updateOtherBillPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
    $scope.updateStatus = function(bill) {//update bill status
        $rootScope.idForUpdateBillStatus = bill.id;
        console.log('bill ID' + JSON.stringify($rootScope.idForUpdateBillStatus));

        var modalInstance = $modal.open({
            templateUrl: '/updateStatusPopup.html',
            controller: billingCustomerModalCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    }
    var billingCustomerModalCtrl = function($scope, $rootScope, $modalInstance, $state) {

        //appoint driver condition set
        $scope.driverappoint=function(){
            $scope.driverappointset = 'true';
            console.log( $scope.driverappointset);  
        }

        //update Appointed driver information 

        $scope.updateCompany2DriverDetails = function(billCustomer){
            var company2Rates;
            var unit;
            
            
            var count=0;
            if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
                document.getElementById("dutyHours").style.borderBottom = "1px solid red";
                document.getElementById("dutyHours1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                document.getElementById("dutyHours1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                document.getElementById("monthlySalary1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                document.getElementById("monthlySalary1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                document.getElementById("monthlySalary1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                document.getElementById("monthlySalary1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
                document.getElementById("otRate").style.borderBottom = "1px solid red";
                document.getElementById("otRate1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("otRate").style.borderColor = "#dde6e9";
                document.getElementById("otRate1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
                document.getElementById("osaRate").style.borderBottom = "1px solid red";
                document.getElementById("osaRate1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("osaRate").style.borderColor = "#dde6e9";
                document.getElementById("osaRate1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
                document.getElementById("nsaRate").style.borderBottom = "1px solid red";
                document.getElementById("nsaRate1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("nsaRate").style.borderColor = "#dde6e9";
                document.getElementById("nsaRate1").innerHTML = '';
    
    
            }
    
            if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
                document.getElementById("edRate").style.borderBottom = "1px solid red";
                document.getElementById("edRate1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("edRate").style.borderColor = "#dde6e9";
                document.getElementById("edRate1").innerHTML = '';
    
    
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
            if (angular.isUndefined(billCustomer.appointedDate) || billCustomer.appointedDate === '' || billCustomer.appointedDate === null) {
                document.getElementById("appointedDate").style.borderBottom = "1px solid red";
                document.getElementById("appointedDate1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("appointedDate").style.borderColor = "#dde6e9";
                document.getElementById("appointedDate1").innerHTML = '';
    
    
            }
            if (angular.isUndefined(billCustomer.drivercycle) || billCustomer.drivercycle === '' || billCustomer.drivercycle === null) {
                document.getElementById("drivercycle").style.borderBottom = "1px solid red";
                document.getElementById("drivercycle1").innerHTML = '*required';
    
                count++;
            } else {
                document.getElementById("drivercycle").style.borderColor = "#dde6e9";
                document.getElementById("drivercycle1").innerHTML = '';
    
    
            }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {

                var weeklyOff = null;
                if (!angular.isUndefined(billCustomer.weeklyOff) ) {
                    weeklyOff = billCustomer.weeklyOff;
                }else{
                    weeklyOff='';
                }
                // var appointedDate = new Date(
                //     billCustomer.appointedDate.getFullYear(),
                //     billCustomer.appointedDate.getMonth(),
                //     billCustomer.appointedDate.getDate() + 1);
                Company2DriverDetails.findById({
                   
                            id:billCustomer.company2DriverId
                                              
    
                    
                    }, 
                     function(success){

                        success.dutyHours = billCustomer.dutyHours,
                        success.cycle = billCustomer.drivercycle,
                        success.monthlySalary = billCustomer.monthlySalary,
                        success.reportingDate = billCustomer.appointedDate,
                        success.weeklyOff=weeklyOff,
                        success.$save();
                        
                        // Company2CustomerRate.find({
                        //     filter: {
                        //         where: {
                        //             driverId: billCustomer.driverId
                        //         }
                        //     }
                        //     },function(success){
                        //         for (var i = 0; i <success.length; i++) {

                        //             if(success[i].itemId==1){
                        //                 company2Rates=success[i].value;
                        //                 unit = success[i].unit;

                        //             }
                        //             if(success[i].itemId==1){
                        //                 company2Rates=billCustomer.otRate;
                        //                 unit = success[i].unit;
                        //             }
                        //             if(success[i].itemId==3){
                        //                 company2Rates=billCustomer.osaRate;
                        //                 unit = success[i].unit;
                        //             }
                        //             if(success[i].itemId==4){
                        //                 company2Rates=billCustomer.nsaRate;
                        //                 unit = success[i].unit;
                        //             }
                        //             if(success[i].itemId==5){
                        //                 company2Rates=billCustomer.edRate;
                        //                 unit = success[i].unit;
                        //             }
                        //             if(success[i].itemId==6){

                        //                 company2Rates=billCustomer.adminCharge
                        //                 unit = success[i].unit;
                        //             }
                        //             Company2CustomerRate.findById({
                        //                 id:success[i].id

                        //             },function(success){
                        //                 success.unit=unit;
                        //                 success.value=company2Rates;
                        //                 success.$save();


                        //             },function(error){

                        //                 console.log("error in Company2CustomerRate findbyid ");

                        //             }
                        //             )

                                
                        //         }
                        //         console.log(success)

                        //     },
                        //     function(error){
                        //         console.log("error in Company2CustomerRate find ");

                        //     }
                        //     )


                                             Company2CustomerRate.find({
                                                    filter: {
                                                        where: {
                                                            
                                                            company2driverId: billCustomer.company2DriverId
                                                        }
                                                    }
                                                }, function(succesCR) {
                                                    //console.log('fetch customer rate for update: ' + JSON.stringify(succesCR));
                                                    if (succesCR.length > 0) {
                                                        for (var i = 0; i < succesCR.length; i++) {
                                                            if (succesCR[i].itemId === '1') {
            
                                                                succesCR[i].value = (billCustomer.monthlySalary / billCustomer.drivercycle);
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
                                                    reloadFunc();
                                                    $.notify(' driver Information Updated Successfully.', {
                                                        status: 'success'
                                                    });
                                                    $rootScope.getBillingCustomerDetails();
                                                    $rootScope.loader = 0;
            
            
                                                }, function(error) {
                                                    console.log('Error updating driver details : ' + JSON.stringify(error));
                                                    $scope.isDisabledButton = false;
                                                    $rootScope.loader = 0;
                                                });

                        
                         
                         
                     },
                     function(error){
                        console.log("error in Company2DriverDetails findbyid ");
    
                     })


            }
    
    
        }


        //remove Appoint driver

        $scope.removeAppointDriver = function(removeDriver){

            Company2DriverDetails.removeDriver({


                customerId:removeDriver.customerId,
                driverId:removeDriver.driverId,
                dol:new Date(Date.now()),
                reason:removeDriver.remark,
                updatedBy:$rootScope.userId


            },function(success){

                $modalInstance.dismiss('cancel');
                 reloadFunc();
                $.notify(' driver deleted Succesfully.', {
                 status: 'success'
                });
                $rootScope.getBillingCustomerDetails();
                $rootScope.loader = 0;

            },function(error){

            });



        }
        //start sub controller billingCustomerModalCtrl
        $scope.statusArray = [{
            'desc': 'P'
        }, {
            'desc': 'R'
        }, {
            'desc': 'C'
        }];
        $scope.billTypeArray = [{
            'desc': 'Single'
        }, {
            'desc': 'Multiple'
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


        $scope.drivercycleArray= [{
            'desc':'30'
        }, {
            'desc':'26'
        },
        {
            'desc':'31'
        },{
            'desc':'28'
        }
    ];

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
        $scope.generateBillSubmit = function(date) {//generate bill submit

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

                Company1CustomerBills.generateCustomerBills({
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
                    remark:date.remark
                }, function(generatesunccess) {

                    $scope.isDisabledButtongen = false;

                    $modalInstance.dismiss('cancel');
                    var genBId = parseInt(generatesunccess[0].generate_customer_bills);

                    $localStorage.put('localStoragePrintBillId', genBId);
                    $state.go('app.billPrintPage');
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
         $scope.getInfo = function() {//get info for bill creation
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
            var compName = $localStorage.get('selectedCompanyName');
         
                if($rootScope.billType === 'Single'){
                    Company2CustomerDetails.find({
                    filter: {
                        where: {
                            Id: $rootScope.idForGenerateBill,
                            billType:'Single' 

                        },
                        include: {
                            relation: 'company2CustomerRate',
                            scope: {
                                filter:{
                                    where:{
                                        driverId:null
                                    }
                                }
                            }
                        }
                    }
                }, function(info) {
                    $rootScope.info = info[0].company2CustomerRate;
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
                }else{
                  
                state.go('app.multileBill');
            }
        }
        $scope.getInfoForOtherBill = function() {//get info for other bill
            $scope.Advance = 0;
            $rootScope.adminChargeRate = undefined;
            $rootScope.adminChargeUnit = undefined;
            $scope.isDisabledButtongen = false;
            $rootScope.AdminCharge = undefined;
            $rootScope.total = undefined;
            $rootScope.grandTotal = undefined;
            $rootScope.cgst = undefined;
            $rootScope.sgst = undefined;
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
            var compName = $localStorage.get('selectedCompanyName');
            if (compName === 'ID Services') {
                Company1Items.find({

                }, function(info) {
                    $rootScope.info = info;
                    console.log('info: ' + JSON.stringify(info));

                    for (var i = 0; i < info.length; i++) {

                        if (info[i].id === 7) {

                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Professional Fees'
                            });

                        } else if (info[i].id === 8) {
                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Bonus'
                            });

                        } else if (info[i].id === 9) {
                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Arrears'
                            });


                        }

                    }
                    //console.log('desc: ' + JSON.stringify($rootScope.Description));

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            } else {
                Company2Items.find({

                }, function(info) {
                    $rootScope.info = info;
                    console.log('info: ' + JSON.stringify(info));

                    for (var i = 0; i < info.length; i++) {

                        if (info[i].id === 7) {

                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Professional Fees'
                            });

                        } else if (info[i].id === 8) {
                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Bonus'
                            });

                        } else if (info[i].id === 9) {
                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'Arrears'
                            });


                        }
                        else if (info[i].id === 10) {
                            $rootScope.invoice1.push({
                                'itemId': info[i].id,
                                'description': 'On_Call/Replacement'
                            });


                        }

                    }
                    //console.log('desc: ' + JSON.stringify($rootScope.Description));

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            }

        }

        $scope.getInfoForUpdateBill = function() {//info for update bill

            $rootScope.updateInfo = null;
            var updateBillData = null;
            var compName = $localStorage.get('selectedCompanyName');
            if (compName === 'ID Services') {
                Company1CustomerBills.findOne({
                    filter: {
                        where: {
                            id: $rootScope.idForUpdateBill

                        },
                        include: [{
                            relation: 'company1BillDetails'
                        }, {
                            relation: 'company1CustomerDetails',
                            scope: {
                                include: [{
                                    relation: 'conUsers'
                                }, {
                                    relation: 'company1CustomerRate'
                                }]
                            }
                        }]
                    }
                }, function(info) {

                    //console.log('info: ' + JSON.stringify(info));
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
                        var prDesc = null
                        var prAmt = 0;

                        for (var i = 0; i < info.company1BillDetails.length; i++) {

                            if (info.company1BillDetails[i].itemId === '1') {
                                salQty = info.company1BillDetails[i].quantity;


                            }
                            if (info.company1BillDetails[i].itemId === '2') {
                                ovtQty = info.company1BillDetails[i].quantity;


                            }
                            if (info.company1BillDetails[i].itemId === '3') {
                                otQty = info.company1BillDetails[i].quantity;

                            }
                            if (info.company1BillDetails[i].itemId === '4') {
                                nsQty = info.company1BillDetails[i].quantity;

                            }
                            if (info.company1BillDetails[i].itemId === '5') {
                                edQty = info.company1BillDetails[i].quantity;

                            }
                            if (info.company1BillDetails[i].itemId === '7') {
                                prDesc = 'Professional Fees';
                                prAmt = info.company1BillDetails[i].amount;

                            }
                            if (info.company1BillDetails[i].itemId === '8') {
                                prDesc = 'Bonus';
                                prAmt = info.company1BillDetails[i].amount;

                            }
                            if (info.company1BillDetails[i].itemId === '9') {
                                prDesc = 'Arrears';
                                prAmt = info.company1BillDetails[i].amount;

                            }


                        }

                        for (var i = 0; i < info.company1CustomerDetails.company1CustomerRate.length; i++) {

                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '1') {
                                salDesc = 'Salary Charged';
                                salRate = info.company1CustomerDetails.company1CustomerRate[i].value.toFixed(2);
                                salUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;


                            }
                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '2') {
                                ovtDesc = 'Overtime Rate';
                                ovtRate = info.company1CustomerDetails.company1CustomerRate[i].value.toFixed(2);
                                ovtUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;


                            }
                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '3') {
                                otDesc = 'Outstation Rate';
                                otRate = info.company1CustomerDetails.company1CustomerRate[i].value.toFixed(2);
                                otUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;


                            }
                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '4') {
                                nsDesc = 'Night Stay Rate';
                                nsRate = info.company1CustomerDetails.company1CustomerRate[i].value.toFixed(2);
                                nsUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;


                            }
                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '5') {
                                edDesc = 'Extra Day Rate';
                                edRate = info.company1CustomerDetails.company1CustomerRate[i].value.toFixed(2);
                                edUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;


                            }
                            if (info.company1CustomerDetails.company1CustomerRate[i].itemId === '6') {

                                acDesc = 'Admin Charge';
                                acRate = info.company1CustomerDetails.company1CustomerRate[i].value;
                                acUnit = info.company1CustomerDetails.company1CustomerRate[i].unit;

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
                                                billCustId: info.company1CustomerId,
                                                custName: info.company1CustomerDetails.conUsers.firstName + ' ' + info.company1CustomerDetails.conUsers.lastName,
                                                mobileNumber: info.company1CustomerDetails.conUsers.mobileNumber,
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
                                            //console.log('updateInfo: ' + JSON.stringify($rootScope.updateInfo));
                                        },
                                        function(error) {
                                            console.log('error ' + JSON.stringify(error));
                                            $rootScope.loader = 0;
                                        });
                                } else {
                                    updateBillData = {
                                        billId: info.id,
                                        billCustId: info.company1CustomerId,
                                        custName: info.company1CustomerDetails.conUsers.firstName + ' ' + info.company1CustomerDetails.conUsers.lastName,
                                        mobileNumber: info.company1CustomerDetails.conUsers.mobileNumber,
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
                                    //console.log('updateInfo: ' + JSON.stringify($rootScope.updateInfo));
                                }

                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });




                    }

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            } else {
                Company2CustomerBills.findOne({
                    filter: {
                        where: {
                            id: $rootScope.idForUpdateBill

                        },
                        include: [{
                            relation: 'company2BillDetails'
                        }, {
                            relation: 'company2CustomerDetails',
                            scope: {
                                include: [{
                                    relation: 'conUsers'
                                }, {
                                    relation: 'company2CustomerRate'
                                }]
                            }
                        }]
                    }
                }, function(info) {

                    //console.log('info: ' + JSON.stringify(info));
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

                        for (var i = 0; i < info.company2BillDetails.length; i++) {

                            if (info.company2BillDetails[i].itemId === '1') {
                                salQty = info.company2BillDetails[i].quantity;


                            }
                            if (info.company2BillDetails[i].itemId === '2') {
                                ovtQty = info.company2BillDetails[i].quantity;


                            }
                            if (info.company2BillDetails[i].itemId === '3') {
                                otQty = info.company2BillDetails[i].quantity;

                            }
                            if (info.company2BillDetails[i].itemId === '4') {
                                nsQty = info.company2BillDetails[i].quantity;

                            }
                            if (info.company2BillDetails[i].itemId === '5') {
                                edQty = info.company2BillDetails[i].quantity;

                            }
                            if (info.company2BillDetails[i].itemId === '7') {
                                prDesc = 'Professional Fees';
                                prAmt = info.company2BillDetails[i].amount;

                            }
                            if (info.company2BillDetails[i].itemId === '8') {
                                prDesc = 'Bonus';
                                prAmt = info.company2BillDetails[i].amount;

                            }
                            if (info.company2BillDetails[i].itemId === '9') {
                                prDesc = 'Arrears';
                                prAmt = info.company2BillDetails[i].amount;

                            }
                            if (info.company2BillDetails[i].itemId === '10') {
                                prDesc = 'On_Call/Replacement';
                                prAmt = info.company2BillDetails[i].amount;

                            }


                        }

                        for (var i = 0; i < info.company2CustomerDetails.company2CustomerRate.length; i++) {

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
                                            //console.log('updateInfo: ' + JSON.stringify($rootScope.updateInfo));
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
                                    //console.log('updateInfo: ' + JSON.stringify($rootScope.updateInfo));
                                }

                            },
                            function(error) {
                                console.log('error ' + JSON.stringify(error));
                                $rootScope.loader = 0;
                            });
                    }

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            }

        }
        $scope.updateBill = function(updateInfo) {//update bill
            //console.log('updateInfo for update: ' + JSON.stringify(updateInfo));
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


            if (angular.isUndefined(updateInfo.salaryQty) || updateInfo.salaryQty === null || updateInfo.salaryQty === '') {
                document.getElementById("salaryQty").style.borderColor = "red";
                document.getElementById("salaryQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("salaryQty").style.borderColor = "#dde6e9";
                document.getElementById("salaryQty1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.overtimeQty) || updateInfo.overtimeQty === null || updateInfo.overtimeQty === '') {
                document.getElementById("overtimeQty").style.borderColor = "red";
                document.getElementById("overtimeQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("overtimeQty").style.borderColor = "#dde6e9";
                document.getElementById("overtimeQty1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.outstationQty) || updateInfo.outstationQty === null || updateInfo.outstationQty === '') {
                document.getElementById("outstationQty").style.borderColor = "red";
                document.getElementById("outstationQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("outstationQty").style.borderColor = "#dde6e9";
                document.getElementById("outstationQty1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.nightStayQty) || updateInfo.nightStayQty === null || updateInfo.nightStayQty === '') {
                document.getElementById("nightStayQty").style.borderColor = "red";
                document.getElementById("nightStayQty1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("nightStayQty").style.borderColor = "#dde6e9";
                document.getElementById("nightStayQty1").innerHTML = '';
            }
            if (angular.isUndefined(updateInfo.extraDayQty) || updateInfo.extraDayQty === null || updateInfo.extraDayQty === '') {
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
                if (angular.isDefined(updateInfo.adminCheck)) {
                    adminChargeFlag = updateInfo.adminCheck;
                }
                var salaryChargeAmt = updateInfo.salaryRate * updateInfo.salaryQty;
                var overtimeAmt = updateInfo.overtimeRate * updateInfo.overtimeQty;
                var outstationAmt = updateInfo.outstationRate * updateInfo.outstationQty;
                var nightStayAmt = updateInfo.nightStayRate * updateInfo.nightStayQty;
                var extraDayAmt = updateInfo.extraDayRate * updateInfo.extraDayQty;
                var subTotal = salaryChargeAmt + overtimeAmt + outstationAmt + nightStayAmt + extraDayAmt;
                var adminChargeAmount = 0;
                if (adminChargeFlag === true) {
                    if (updateInfo.adminChargeUnit === 'Percentage') {
                        adminChargeAmount = (subTotal * updateInfo.adminChargeRate / 100);
                        subTotal = subTotal + adminChargeAmount;
                    } else {
                        adminChargeAmount = updateInfo.adminChargeRate;
                        subTotal = subTotal + adminChargeAmount;
                    }
                }
                var cgst = subTotal * 9 / 100;
                var sgst = subTotal * 9 / 100;

                var total = subTotal + cgst + sgst;
                var netAmt = total - updateInfo.advanceAmount;

                var compName = $localStorage.get('selectedCompanyName');

                if (compName === 'ID Services') {
                    Company1CustomerBills.findOne({
                        filter: {
                            where: {
                                id: updateInfo.billId

                            }
                        }
                    }, function(BillSuccess) {
                        //console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
                        BillSuccess.billDate = updateInfo.billDate;
                        BillSuccess.remark = updateInfo.remark;
                        BillSuccess.total = total;
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

                        Company1BillDetails.find({
                            filter: {
                                where: {
                                    billId: updateInfo.billId

                                }
                            }
                        }, function(BillDetailsSuccess) {
                            //console.log('BillDetailsSuccess: ' + JSON.stringify(BillDetailsSuccess));
                            if (BillDetailsSuccess.length > 0) {
                                for (var i = 0; i < BillDetailsSuccess.length; i++) {
                                    if (BillDetailsSuccess[i].itemId === '1') {
                                        BillDetailsSuccess[i].amount = updateInfo.salaryRate * updateInfo.salaryQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.salaryQty;
                                        BillDetailsSuccess[i].rate = updateInfo.salaryRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '2') {
                                        BillDetailsSuccess[i].amount = updateInfo.overtimeRate * updateInfo.overtimeQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.overtimeQty;
                                        BillDetailsSuccess[i].rate = updateInfo.overtimeRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '3') {
                                        BillDetailsSuccess[i].amount = updateInfo.outstationRate * updateInfo.outstationQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.outstationQty;
                                        BillDetailsSuccess[i].rate = updateInfo.outstationRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '4') {
                                        BillDetailsSuccess[i].amount = updateInfo.nightStayRate * updateInfo.nightStayQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.nightStayQty;
                                        BillDetailsSuccess[i].rate = updateInfo.nightStayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '5') {
                                        BillDetailsSuccess[i].amount = updateInfo.extraDayRate * updateInfo.extraDayQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.extraDayQty;
                                        BillDetailsSuccess[i].rate = updateInfo.extraDayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '6') {

                                        BillDetailsSuccess[i].amount = adminChargeAmount;
                                        BillDetailsSuccess[i].rate = updateInfo.adminChargeRate;
                                        BillDetailsSuccess[i].unit = updateInfo.adminChargeUnit;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                }
                            }
                            $modalInstance.dismiss('cancel');
                            //$localStorage.put('localStoragePrintBillId', updateInfo.billId);
                            //$state.go('app.billPrintPage');
                            reloadFunc();
                            $rootScope.getBillingCustomerDetails();
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        }, function(BillDetailsErr) {
                            console.log('BillDetailsErr: ' + JSON.stringify(BillDetailsErr));
                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        });


                    }, function(BillErr) {
                        console.log('BillErr: ' + JSON.stringify(BillErr));
                        $modalInstance.dismiss('cancel');
                        $scope.isDisabledButtonUpdate = false;
                        $rootScope.loader = 0;
                    });
                } else {
                    Company2CustomerBills.findOne({
                        filter: {
                            where: {
                                id: updateInfo.billId

                            }
                        }
                    }, function(BillSuccess) {
                        //console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
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

                        Company2BillDetails.find({
                            filter: {
                                where: {
                                    billId: updateInfo.billId

                                }
                            }
                        }, function(BillDetailsSuccess) {
                            //console.log('BillDetailsSuccess: ' + JSON.stringify(BillDetailsSuccess));
                            if (BillDetailsSuccess.length > 0) {
                                for (var i = 0; i < BillDetailsSuccess.length; i++) {
                                    if (BillDetailsSuccess[i].itemId === '1') {
                                        BillDetailsSuccess[i].amount = updateInfo.salaryRate * updateInfo.salaryQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.salaryQty;
                                        BillDetailsSuccess[i].rate = updateInfo.salaryRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '2') {
                                        BillDetailsSuccess[i].amount = updateInfo.overtimeRate * updateInfo.overtimeQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.overtimeQty;
                                        BillDetailsSuccess[i].rate = updateInfo.overtimeRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '3') {
                                        BillDetailsSuccess[i].amount = updateInfo.outstationRate * updateInfo.outstationQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.outstationQty;
                                        BillDetailsSuccess[i].rate = updateInfo.outstationRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '4') {
                                        BillDetailsSuccess[i].amount = updateInfo.nightStayRate * updateInfo.nightStayQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.nightStayQty;
                                        BillDetailsSuccess[i].rate = updateInfo.nightStayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '5') {
                                        BillDetailsSuccess[i].amount = updateInfo.extraDayRate * updateInfo.extraDayQty;
                                        BillDetailsSuccess[i].quantity = updateInfo.extraDayQty;
                                        BillDetailsSuccess[i].rate = updateInfo.extraDayRate;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '6') {

                                        BillDetailsSuccess[i].amount = adminChargeAmount;
                                        BillDetailsSuccess[i].rate = updateInfo.adminChargeRate;
                                        BillDetailsSuccess[i].unit = updateInfo.adminChargeUnit;
                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                }
                            }
                            $modalInstance.dismiss('cancel');
                            //$localStorage.put('localStoragePrintBillId', updateInfo.billId);
                            //$state.go('app.billPrintPage');
                            reloadFunc();
                            $rootScope.getBillingCustomerDetails();
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        }, function(BillDetailsErr) {
                            console.log('BillDetailsErr: ' + JSON.stringify(BillDetailsErr));
                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        });


                    }, function(BillErr) {
                        console.log('BillErr: ' + JSON.stringify(BillErr));
                        $modalInstance.dismiss('cancel');
                        $scope.isDisabledButtonUpdate = false;
                        $rootScope.loader = 0;
                    });
                }


            }


        }

        $scope.updateOtherBill = function(updateInfo) {//update function for other bill
            //console.log('updateInfo for update: ' + JSON.stringify(updateInfo));
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

            if (angular.isUndefined(updateInfo.prAmount) || updateInfo.prAmount === null || updateInfo.prAmount === '') {
                document.getElementById("prAmount").style.borderColor = "red";
                document.getElementById("prAmount1").innerHTML = '*required';
                count++;

            } else {
                document.getElementById("prAmount").style.borderColor = "#dde6e9";
                document.getElementById("prAmount1").innerHTML = '';
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

                var subTotal = updateInfo.prAmount;

                var cgst = subTotal * 9 / 100;
                var sgst = subTotal * 9 / 100;

                var total = subTotal + cgst + sgst;
                var netAmt = total - updateInfo.advanceAmount;

                var compName = $localStorage.get('selectedCompanyName');

                if (compName === 'ID Services') {
                    Company1CustomerBills.findOne({
                        filter: {
                            where: {
                                id: updateInfo.billId

                            }
                        }
                    }, function(BillSuccess) {
                        //console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
                        BillSuccess.billDate = updateInfo.billDate;
                        BillSuccess.remark = updateInfo.remark;
                        BillSuccess.total = total;
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

                        Company1BillDetails.find({
                            filter: {
                                where: {
                                    billId: updateInfo.billId

                                }
                            }
                        }, function(BillDetailsSuccess) {
                            //console.log('BillDetailsSuccess: ' + JSON.stringify(BillDetailsSuccess));
                            if (BillDetailsSuccess.length > 0) {
                                for (var i = 0; i < BillDetailsSuccess.length; i++) {

                                    if (BillDetailsSuccess[i].itemId === '7') {
                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '8') {
                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '9') {

                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                }
                            }
                            $modalInstance.dismiss('cancel');
                            //$localStorage.put('localStoragePrintBillId', updateInfo.billId);
                            //$state.go('app.billPrintPage');
                            reloadFunc();
                            $rootScope.getBillingCustomerDetails();
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        }, function(BillDetailsErr) {
                            console.log('BillDetailsErr: ' + JSON.stringify(BillDetailsErr));
                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        });


                    }, function(BillErr) {
                        console.log('BillErr: ' + JSON.stringify(BillErr));
                        $modalInstance.dismiss('cancel');
                        $scope.isDisabledButtonUpdate = false;
                        $rootScope.loader = 0;
                    });
                } else {
                    Company2CustomerBills.findOne({
                        filter: {
                            where: {
                                id: updateInfo.billId

                            }
                        }
                    }, function(BillSuccess) {
                        //console.log('BillSuccess: ' + JSON.stringify(BillSuccess));
                        BillSuccess.billDate = updateInfo.billDate;
                        BillSuccess.remark = updateInfo.remark;
                        BillSuccess.total = total;
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

                        Company2BillDetails.find({
                            filter: {
                                where: {
                                    billId: updateInfo.billId

                                }
                            }
                        }, function(BillDetailsSuccess) {
                            //console.log('BillDetailsSuccess: ' + JSON.stringify(BillDetailsSuccess));
                            if (BillDetailsSuccess.length > 0) {
                                for (var i = 0; i < BillDetailsSuccess.length; i++) {
                                    if (BillDetailsSuccess[i].itemId === '7') {
                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '8') {
                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '9') {

                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                    if (BillDetailsSuccess[i].itemId === '10') {

                                        BillDetailsSuccess[i].amount = updateInfo.prAmount;

                                        BillDetailsSuccess[i].updatedBy = $rootScope.userId;
                                        BillDetailsSuccess[i].updatedDate = new Date();

                                        BillDetailsSuccess[i].$save();
                                    }
                                }
                            }
                            $modalInstance.dismiss('cancel');
                            //$localStorage.put('localStoragePrintBillId', updateInfo.billId);
                            //$state.go('app.billPrintPage');
                            reloadFunc();
                            $rootScope.getBillingCustomerDetails();
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        }, function(BillDetailsErr) {
                            console.log('BillDetailsErr: ' + JSON.stringify(BillDetailsErr));
                            $modalInstance.dismiss('cancel');
                            $scope.isDisabledButtonUpdate = false;
                            $rootScope.loader = 0;
                        });


                    }, function(BillErr) {
                        console.log('BillErr: ' + JSON.stringify(BillErr));
                        $modalInstance.dismiss('cancel');
                        $scope.isDisabledButtonUpdate = false;
                        $rootScope.loader = 0;
                    });
                }


            }


        }

        $scope.getInfoForUpdateBillStatus = function() {//update bill status

            $rootScope.updateStatusInfo = null;
            var updateBillStatusData = null;
            var compName = $localStorage.get('selectedCompanyName');
            if (compName === 'ID Services') {
                Company1CustomerBills.findOne({
                    filter: {
                        where: {
                            id: $rootScope.idForUpdateBillStatus

                        },
                        include: [{
                            relation: 'company1BillDetails'
                        }, {
                            relation: 'company1CustomerDetails',
                            scope: {
                                include: [{
                                    relation: 'conUsers'
                                }, {
                                    relation: 'company1CustomerRate'
                                }]
                            }
                        }]
                    }
                }, function(Company1CustomerBillsStatusSuccess) {

                    //console.log('Company1CustomerBillsStatusSuccess: ' + JSON.stringify(Company1CustomerBillsStatusSuccess));
                    if (angular.isDefined(Company1CustomerBillsStatusSuccess) && Company1CustomerBillsStatusSuccess !== null) {

                        updateBillStatusData = {
                            billId: Company1CustomerBillsStatusSuccess.id,
                            billCustId: Company1CustomerBillsStatusSuccess.company1CustomerId,
                            clientName: Company1CustomerBillsStatusSuccess.company1CustomerDetails.conUsers.firstName + ' ' + Company1CustomerBillsStatusSuccess.company1CustomerDetails.conUsers.lastName,
                            mobileNumber: Company1CustomerBillsStatusSuccess.company1CustomerDetails.conUsers.mobileNumber,
                            status: Company1CustomerBillsStatusSuccess.status,
                            receivedBillDate: Company1CustomerBillsStatusSuccess.receivedBillDate,
                            receivedAmount: Company1CustomerBillsStatusSuccess.receivedAmount,
                            remark: Company1CustomerBillsStatusSuccess.remark

                        };
                        $rootScope.updateStatusInfo = updateBillStatusData;

                    }
                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            } else {
                Company2CustomerBills.findOne({
                    filter: {
                        where: {
                            id: $rootScope.idForUpdateBillStatus

                        },
                        include: [{
                            relation: 'company2BillDetails'
                        }, {
                            relation: 'company2CustomerDetails',
                            scope: {
                                include: [{
                                    relation: 'conUsers'
                                }, {
                                    relation: 'company2CustomerRate'
                                }]
                            }
                        }]
                    }
                }, function(Company2CustomerBillsStatusSuccess) {

                    //console.log('Company2CustomerBillsStatusSuccess: ' + JSON.stringify(Company2CustomerBillsStatusSuccess));
                    if (angular.isDefined(Company2CustomerBillsStatusSuccess) && Company2CustomerBillsStatusSuccess !== null) {

                        updateBillStatusData = {
                            billId: Company2CustomerBillsStatusSuccess.id,
                            billCustId: Company2CustomerBillsStatusSuccess.company2CustomerId,
                            clientName: Company2CustomerBillsStatusSuccess.company2CustomerDetails.conUsers.firstName + ' ' + Company2CustomerBillsStatusSuccess.company2CustomerDetails.conUsers.lastName,
                            mobileNumber: Company2CustomerBillsStatusSuccess.company2CustomerDetails.conUsers.mobileNumber,
                            status: Company2CustomerBillsStatusSuccess.status,
                            receivedBillDate: Company2CustomerBillsStatusSuccess.receivedBillDate,
                            receivedAmount: Company2CustomerBillsStatusSuccess.receivedAmount,
                            remark: Company2CustomerBillsStatusSuccess.remark

                        };
                        $rootScope.updateStatusInfo = updateBillStatusData;

                    }

                }, function(er) {
                    console.log('info er: ' + JSON.stringify(er));

                });
            }

        }

        $scope.updateBillStatusFunction = function(updateStatusInfo) {//update bill status
            //console.log('data to update status ' + JSON.stringify(updateStatusInfo));
            $rootScope.loader = 1;
            var count = 0;
            if (angular.isUndefined(updateStatusInfo.status) || updateStatusInfo.status === '' || updateStatusInfo.status === null) {
                document.getElementById("status").style.borderColor = "red";
                document.getElementById("status1").innerHTML = '*required';
                count++;
            } else {
                document.getElementById("status").style.borderColor = "#dde6e9";
                document.getElementById("status1").innerHTML = '';

            }

            if (angular.isUndefined(updateStatusInfo.status) || updateStatusInfo.status === '' || updateStatusInfo.status === null) {} else {
                if (updateStatusInfo.status === 'R') {
                    if (angular.isUndefined(updateStatusInfo.receivedBillDate) || updateStatusInfo.receivedBillDate === '' || updateStatusInfo.receivedBillDate === null) {
                        document.getElementById("receivedBillDate").style.borderColor = "red";
                        document.getElementById("receivedBillDate1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("receivedBillDate").style.borderColor = "#dde6e9";
                        document.getElementById("receivedBillDate1").innerHTML = '';

                    }

                    if (angular.isUndefined(updateStatusInfo.receivedAmount) || updateStatusInfo.receivedAmount === '' || updateStatusInfo.receivedAmount === null) {
                        document.getElementById("receivedAmount").style.borderColor = "red";
                        document.getElementById("receivedAmount1").innerHTML = '*required';
                        count++;
                    } else {
                        document.getElementById("receivedAmount").style.borderColor = "#dde6e9";
                        document.getElementById("receivedAmount1").innerHTML = '';

                    }
                }
            }

            if (count > 0) {
                $scope.count = count;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;

                var compName = $localStorage.get('selectedCompanyName');
                if (compName === 'ID Services') {
                    var remark = null;
                    if (!angular.isUndefined(updateStatusInfo.remark) || updateStatusInfo.remark !== null || updateStatusInfo.remark !== '') {
                        remark = updateStatusInfo.remark;
                    }
                    ConUsers.findById({
                            id: $rootScope.userId
                        },
                        function(ConUsers) {

                            var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                            Company1CustomerBills.findOne({
                                filter: {
                                    where: {
                                        id: updateStatusInfo.billId

                                    }
                                }
                            }, function(Company1CustomerBills) {
                                var remarkUpdatedDate = new Date();
                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');

                                //console.log('Company1CustomerBills: ' + JSON.stringify(Company1CustomerBills));
                                Company1CustomerBills.status = updateStatusInfo.status;
                                Company1CustomerBills.receivedBillDate = updateStatusInfo.receivedBillDate;
                                Company1CustomerBills.receivedAmount = updateStatusInfo.receivedAmount;
                                Company1CustomerBills.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                Company1CustomerBills.updatedBy = $rootScope.userId;
                                Company1CustomerBills.updatedDate = new Date();

                                Company1CustomerBills.$save();

                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.fetchCustomerBills();
                                $rootScope.loader = 0;
                            }, function(err) {
                                console.log('Company1CustomerBills err: ' + JSON.stringify(err));
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });
                        },
                        function(error) {
                            console.log('error ' + JSON.stringify(error));
                            $rootScope.loader = 0;
                        });
                } else {

                    var remark = null;
                    if (!angular.isUndefined(updateStatusInfo.remark) || updateStatusInfo.remark !== null || updateStatusInfo.remark !== '') {
                        remark = updateStatusInfo.remark;
                    }
                    ConUsers.findById({
                            id: $rootScope.userId
                        },
                        function(ConUsers) {

                            var userName = ConUsers.firstName + ' ' + ConUsers.lastName;

                            Company2CustomerBills.findOne({
                                filter: {
                                    where: {
                                        id: updateStatusInfo.billId

                                    }
                                }
                            }, function(Company2CustomerBills) {
                                var remarkUpdatedDate = new Date();
                                remarkUpdatedDate = moment(remarkUpdatedDate).format('DD-MM-YYYY HH:mm:ss');

                                //console.log('Company2CustomerBills: ' + JSON.stringify(Company2CustomerBills));
                                Company2CustomerBills.status = updateStatusInfo.status;
                                Company2CustomerBills.receivedBillDate = updateStatusInfo.receivedBillDate;
                                Company2CustomerBills.receivedAmount = updateStatusInfo.receivedAmount;
                                Company2CustomerBills.remark = remark + ' By ' + userName + '(' + remarkUpdatedDate + ').';
                                Company2CustomerBills.updatedBy = $rootScope.userId;
                                Company2CustomerBills.updatedDate = new Date();
                                Company2CustomerBills.$save();

                                $modalInstance.dismiss('cancel');
                                reloadFunc();
                                $rootScope.fetchCustomerBills();
                                $rootScope.loader = 0;
                            }, function(err) {
                                console.log('Company2CustomerBills err: ' + JSON.stringify(err));
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });
                        },
                        function(error) {
                            console.log('error ' + JSON.stringify(error));
                            $rootScope.loader = 0;
                        });
                }

            }
        }
        $scope.fetchCompanyCustomerDetails = function() {//fetch company customer for update
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
                                contactPerson2Email:customerData.contactPerson2Email,
                                contactPerson2MobileNumber:customerData.contactPerson2MobileNumber,
                                contactPerson2Name:customerData.contactPerson2Name,
                                billType:customerData.billType

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
        $scope.verifyEmailFunction1 = function(billCustomer) {//email verify for update customer
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

        $scope.updateCompanyCustomerDetails = function(billCustomer) {//update customer details
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

            if (angular.isUndefined(billCustomer.lastName) || billCustomer.lastName === '' || billCustomer.lastName === null) {
                document.getElementById("lastName").style.borderBottom = "1px solid red";
                document.getElementById("lastName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("lastName").style.borderColor = "#dde6e9";
                document.getElementById("lastName1").innerHTML = '';


            }
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
            if (angular.isUndefined(billCustomer.billType) || billCustomer.billType === '' || billCustomer.billType === null) {
                document.getElementById("billType").style.borderBottom = "1px solid red";
                document.getElementById("billType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("billType").style.borderColor = "#dde6e9";
                document.getElementById("billType1").innerHTML = '';


            }
            if($scope.driverappointset ){

            

            if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
                document.getElementById("dutyHours").style.borderBottom = "1px solid red";
                document.getElementById("dutyHours1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                document.getElementById("dutyHours1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                document.getElementById("monthlySalary1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                document.getElementById("monthlySalary1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                document.getElementById("monthlySalary1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                document.getElementById("monthlySalary1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
                document.getElementById("otRate").style.borderBottom = "1px solid red";
                document.getElementById("otRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("otRate").style.borderColor = "#dde6e9";
                document.getElementById("otRate1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
                document.getElementById("osaRate").style.borderBottom = "1px solid red";
                document.getElementById("osaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("osaRate").style.borderColor = "#dde6e9";
                document.getElementById("osaRate1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
                document.getElementById("nsaRate").style.borderBottom = "1px solid red";
                document.getElementById("nsaRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("nsaRate").style.borderColor = "#dde6e9";
                document.getElementById("nsaRate1").innerHTML = '';


            }

            if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
                document.getElementById("edRate").style.borderBottom = "1px solid red";
                document.getElementById("edRate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("edRate").style.borderColor = "#dde6e9";
                document.getElementById("edRate1").innerHTML = '';


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
            if (angular.isUndefined(billCustomer.appointedDate) || billCustomer.appointedDate === '' || billCustomer.appointedDate === null) {
                document.getElementById("appointedDate").style.borderBottom = "1px solid red";
                document.getElementById("appointedDate1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("appointedDate").style.borderColor = "#dde6e9";
                document.getElementById("appointedDate1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.drivercycle) || billCustomer.drivercycle === '' || billCustomer.drivercycle === null) {
                document.getElementById("drivercycle").style.borderBottom = "1px solid red";
                document.getElementById("drivercycle1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("drivercycle").style.borderColor = "#dde6e9";
                document.getElementById("drivercycle1").innerHTML = '';


            }
            if (angular.isUndefined(billCustomer.driverName) || billCustomer.driverName === '' || billCustomer.driverName === null) {
                document.getElementById("driverName").style.borderBottom = "1px solid red";
                //document.getElementById("driverName").innerHTML = '';

                count++;
            } else {
                document.getElementById("driverName").style.borderColor = "#dde6e9";
                //document.getElementById("driverName").innerHTML = '';


            }
           

           
        }
            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                return false;
            } else {

                var landlineNo = null;
                if (!angular.isUndefined(billCustomer.landline)) {
                    landlineNo=billCustomer.landline;
                }else{
                    
                    landlineNo = '';
                }
                var hsaNo = null;
                if (!angular.isUndefined(billCustomer.hsaNumber) ) {
                    hsaNo= billCustomer.hsaNumber;
                }else{
                    hsaNo = '';
                    
                }
                var contactPerson2Name = null;
                if (!angular.isUndefined(billCustomer.contactPerson2Name)) {
                    contactPerson2Name= billCustomer.contactPerson2Name;
                }else{
                    contactPerson2Name = '';
                    
                }
                var contactPerson2Email = null;
                if (!angular.isUndefined(billCustomer.contactPerson2Email)) {
                    contactPerson2Email = billCustomer.contactPerson2Email;
                }else{
                    contactPerson2Email = '';
                    
                }
                var contactPerson2MobileNumber = null;
                if (!angular.isUndefined(billCustomer.contactPerson2MobileNumber) ) {
                    contactPerson2MobileNumber=billCustomer.contactPerson2MobileNumber;
                }else{
                    contactPerson2MobileNumber = '';
                    
                }
                if($scope.driverappointset ){

                
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
                                    customerData.landline = customerData.landline;
                                    customerData.contactPersonName = billCustomer.contactPersonName;
                                    customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                                    customerData.vehicleName = billCustomer.vehicleName;
                                    customerData.vehicleType = billCustomer.vehicleType;
                                    customerData.hsaNumber = billCustomer.hsaNumber;
                                    customerData.dutyHours = billCustomer.dutyHours;
                                    customerData.weeklyOff = weeklyOff;
                                    customerData.agreementStartDate = billCustomer.agreementStartDate;
                                    customerData.agreementEndDate = billCustomer.agreementEndDate;
                                    customerData.monthlySalary = billCustomer.monthlySalary;
                                    customerData.updatedBy = $rootScope.userId;
                                    customerData.driverName = billCustomer.driverName;
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
                                        reloadFunc();
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
                    
                    var weeklyOff = null;
                if (!angular.isUndefined(billCustomer.weeklyOff) ) {
                    weeklyOff = billCustomer.weeklyOff;
                }else{
                    weeklyOff='';
                }
                var appointedDate = new Date(
                    billCustomer.appointedDate.getFullYear(),
                    billCustomer.appointedDate.getMonth(),
                    billCustomer.appointedDate.getDate() + 1);

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
                Company2CustomerDetails.findById({
                    id: $rootScope.custID
                },
                function(customerData) {

                    //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                    customerData.landline = landlineNo;
                    customerData.contactPersonName = billCustomer.contactPersonName;
                    customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                    customerData.vehicleName = billCustomer.vehicleName;
                    customerData.vehicleType = billCustomer.vehicleType;
                    customerData.hsaNumber = hsaNo;
                   
                    customerData.agreementStartDate = billCustomer.agreementStartDate;
                    customerData.agreementEndDate = billCustomer.agreementEndDate;
                    customerData.billType = billCustomer.billType;
                    customerData.contactPerson2Name = contactPerson2Name;
                    customerData.contactPerson2Email = contactPerson2Email;
                    customerData.contactPerson2MobileNumber = contactPerson2MobileNumber;
                    customerData.updatedDate = new Date();
                     customerData.$save();
                     Company2CustomerDetails.AppointDriverforBilling({
                        customerId: billCustomer.id,
                        driverName: billCustomer.driverName.description.driverName,
                        driverId: billCustomer.driverName.description.id,
                        driverHours: billCustomer.dutyHours,
                        weeklyOff: weeklyOff,
                        otRate: billCustomer.otRate,
                        nsaRate: billCustomer.nsaRate,
                        edRate: billCustomer.edRate,
                        monthlySalary: billCustomer.monthlySalary,
                        driverCycle: billCustomer.drivercycle,
                        appointedDate: appointedDate,
                        osaRate: billCustomer.osaRate,
                        createdBy: $rootScope.userId,
                        adminCharge: billCustomer.adminCharge,
                        adminChargeType: billCustomer.adminChargeType,
                        
                        // agreementStartDate: agreementSDate,
                        // agreementEndDate: agreementEDate,
                        // userId: $rootScope.userId,
                        // contactPerson2Name: billCustomer.contactPerson2Name,
                        // contactPerson2Email: billCustomer.contactPerson2Email,
                        // contactPerson2MobileNumber: billCustomer.contactPerson2MobileNumber,
                        // adminChargeType: billCustomer.adminChargeType,
                        //driverName: note
                    }, function(createSuccess) {
                        if (createSuccess[0].apoint_driver_to_billing_customer === 'Driver Allready Appointed') {
                            $modalInstance.dismiss('cancel');
                            $.notify(' driver Already Appointed.', {
                                status: 'danger'
                            });
                            $rootScope.getBillingCustomerDetails();

                        }else if(createSuccess[0].apoint_driver_to_billing_customer ==='Driver appointed to someone else'){

                                $modalInstance.dismiss('cancel');
                                $.notify(' driver appointed to someone else', {
                                 status: 'danger'
                                 });
                                 $rootScope.getBillingCustomerDetails();
                        }else{

                        
                        $modalInstance.dismiss('cancel');
                     reloadFunc();
                     $rootScope.getBillingCustomerDetails();
                     $rootScope.loader = 0;
                     $.notify(' driver Appointed successfully.', {
                        status: 'success'
                    });
                }
                    },
                    function(error){
    
                        window.alert('error in driver Appointing');

                    })
    

                    //  $modalInstance.dismiss('cancel');
                    //  reloadFunc();
                    //  $rootScope.getBillingCustomerDetails();
                    //  $rootScope.loader = 0;
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

                   
                //     ConUsers.findById({
                //             id: $rootScope.cuid
                //         },
                //         function(ConUsers) {
                //             //console.log('fetch conuser for update' + JSON.stringify(ConUsers));
                //             ConUsers.firstName = billCustomer.firstName;
                //             ConUsers.lastName = billCustomer.lastName;
                //             ConUsers.email = billCustomer.email;
                //             ConUsers.mobileNumber = billCustomer.contactNo;
                //             ConUsers.username = billCustomer.contactNo;
                //             ConUsers.password = billCustomer.contactNo;
                //             ConUsers.address = billCustomer.address;
                //             ConUsers.updatedBy = $rootScope.userId;
                //             ConUsers.updatedDate = new Date();
                //             ConUsers.$save();
                //             //console.log('ConUsers updated : ' + JSON.stringify(ConUsers));
                //             Company2CustomerDetails.findById({
                //                     id: $rootScope.custID
                //                 },
                //                 function(customerData) {

                //                     //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                //                     customerData.landline = billCustomer.landline;
                //                     customerData.contactPersonName = billCustomer.contactPersonName;
                //                     customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                //                     customerData.vehicleName = billCustomer.vehicleName;
                //                     customerData.vehicleType = billCustomer.vehicleType;
                //                     customerData.hsaNumber = billCustomer.hsaNumber;
                //                     customerData.dutyHours = billCustomer.dutyHours;
                //                     customerData.weeklyOff = billCustomer.weeklyOff;
                //                     customerData.agreementStartDate = billCustomer.agreementStartDate;
                //                     customerData.agreementEndDate = billCustomer.agreementEndDate;
                //                     customerData.monthlySalary = billCustomer.monthlySalary;
                //                     customerData.updatedBy = $rootScope.userId;
                //                     customerData.driverName = billCustomer.driverName;
                //                     customerData.updatedDate = new Date();
                //                     customerData.$save();
                //                     //console.log('customer updated: ' + JSON.stringify(customerData));
                //                     Company2CustomerRate.find({
                //                         filter: {
                //                             where: {
                //                                 company2CustomerId: customerData.id
                //                             }
                //                         }
                //                     }, function(succesCR) {
                //                         //console.log('fetch customer rate for update: ' + JSON.stringify(succesCR));
                //                         if (succesCR.length > 0) {
                //                             for (var i = 0; i < succesCR.length; i++) {
                //                                 if (succesCR[i].itemId === '1') {

                //                                     succesCR[i].value = (billCustomer.monthlySalary / 30);
                //                                     succesCR[i].$save();
                //                                 }
                //                                 if (succesCR[i].itemId === '2') {

                //                                     succesCR[i].value = billCustomer.otRate;
                //                                     succesCR[i].$save();
                //                                 }
                //                                 if (succesCR[i].itemId === '3') {

                //                                     succesCR[i].value = billCustomer.osaRate;
                //                                     succesCR[i].$save();

                //                                 }
                //                                 if (succesCR[i].itemId === '4') {

                //                                     succesCR[i].value = billCustomer.nsaRate;
                //                                     succesCR[i].$save();

                //                                 }
                //                                 if (succesCR[i].itemId === '5') {

                //                                     succesCR[i].value = billCustomer.edRate;
                //                                     succesCR[i].$save();

                //                                 }
                //                                 if (succesCR[i].itemId === '6') {

                //                                     succesCR[i].value = billCustomer.adminCharge;
                //                                     succesCR[i].unit = billCustomer.adminChargeType;
                //                                     succesCR[i].$save();

                //                                 }
                //                             }
                //                             //console.log('updated customer rate: ' + JSON.stringify(succesCR));
                //                         }
                //                         $modalInstance.dismiss('cancel');
                //                         reloadFunc();
                //                         $rootScope.getBillingCustomerDetails();
                //                         $rootScope.loader = 0;


                //                     }, function(error) {
                //                         console.log('Error updating customer details : ' + JSON.stringify(error));
                //                         $scope.isDisabledButton = false;
                //                         $rootScope.loader = 0;
                //                     });

                //                 },
                //                 function(error) {
                //                     console.log('Error updating customer details : ' + JSON.stringify(error));
                //                     $scope.isDisabledButton = false;
                //                     $rootScope.loader = 0;
                //                 });

                //         },
                //         function(error) {
                //             console.log('Error updating Customer : ' + JSON.stringify(error));
                //             $scope.isDisabledButton = false;
                //             $rootScope.loader = 0;
                //         });
                }
                }
        else{

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
                Company2CustomerDetails.findById({
                    id: $rootScope.custID
                },
                function(customerData) {

                    //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                    customerData.landline = landlineNo;
                    customerData.contactPersonName = billCustomer.contactPersonName;
                    customerData.contactPersonEmail = billCustomer.contactPersonEmail;
                    customerData.vehicleName = billCustomer.vehicleName;
                    customerData.vehicleType = billCustomer.vehicleType;
                    customerData.hsaNumber = hsaNo;
                    
                    customerData.agreementStartDate = billCustomer.agreementStartDate;
                    customerData.agreementEndDate = billCustomer.agreementEndDate;
                    customerData.billType = billCustomer.billType;
                    customerData.contactPerson2Name = contactPerson2Name;
                    customerData.contactPerson2Email = contactPerson2Email;
                    customerData.contactPerson2MobileNumber = contactPerson2MobileNumber;
                    customerData.updatedDate = new Date();
                     customerData.$save();
                     $modalInstance.dismiss('cancel');
                     reloadFunc();
                     $rootScope.getBillingCustomerDetails();
                     $rootScope.loader = 0;
                     $.notify(' Billing Customer updated successfully.', {
                        status: 'success'
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

        $rootScope.addNewCustomer = function(billCustomer) {// add new customer
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

            if (angular.isUndefined(billCustomer.lastName) || billCustomer.lastName === '' || billCustomer.lastName === null) {
                document.getElementById("lastName").style.borderBottom = "1px solid red";
                document.getElementById("lastName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("lastName").style.borderColor = "#dde6e9";
                document.getElementById("lastName1").innerHTML = '';


            }
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

            // if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
            //     document.getElementById("dutyHours").style.borderBottom = "1px solid red";
            //     document.getElementById("dutyHours1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("dutyHours").style.borderColor = "#dde6e9";
            //     document.getElementById("dutyHours1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
            //     document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
            //     document.getElementById("monthlySalary1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
            //     document.getElementById("monthlySalary1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
            //     document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
            //     document.getElementById("monthlySalary1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
            //     document.getElementById("monthlySalary1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
            //     document.getElementById("otRate").style.borderBottom = "1px solid red";
            //     document.getElementById("otRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("otRate").style.borderColor = "#dde6e9";
            //     document.getElementById("otRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
            //     document.getElementById("osaRate").style.borderBottom = "1px solid red";
            //     document.getElementById("osaRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("osaRate").style.borderColor = "#dde6e9";
            //     document.getElementById("osaRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
            //     document.getElementById("nsaRate").style.borderBottom = "1px solid red";
            //     document.getElementById("nsaRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("nsaRate").style.borderColor = "#dde6e9";
            //     document.getElementById("nsaRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
            //     document.getElementById("edRate").style.borderBottom = "1px solid red";
            //     document.getElementById("edRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("edRate").style.borderColor = "#dde6e9";
            //     document.getElementById("edRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.adminCharge) || billCustomer.adminCharge === '' || billCustomer.adminCharge === null) {
            //     document.getElementById("adminCharge").style.borderBottom = "1px solid red";
            //     document.getElementById("adminCharge1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("adminCharge").style.borderColor = "#dde6e9";
            //     document.getElementById("adminCharge1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.companyName) || billCustomer.companyName === '' || billCustomer.companyName === null) {
            //     document.getElementById("companyName").style.borderBottom = "1px solid red";
            //     document.getElementById("companyName1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("companyName").style.borderColor = "#dde6e9";
            //     document.getElementById("companyName1").innerHTML = '';


            // } 
            if (angular.isUndefined(billCustomer.billType) || billCustomer.billType === '' || billCustomer.billType === null) {
                document.getElementById("billType").style.borderBottom = "1px solid red";
                document.getElementById("billType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("billType").style.borderColor = "#dde6e9";
                document.getElementById("billType1").innerHTML = '';


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
            if(billCustomer.billType == 'Single'){

            

                if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
                    document.getElementById("dutyHours").style.borderBottom = "1px solid red";
                    document.getElementById("dutyHours1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                    document.getElementById("dutyHours1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                    document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                    document.getElementById("monthlySalary1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                    document.getElementById("monthlySalary1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                    document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                    document.getElementById("monthlySalary1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                    document.getElementById("monthlySalary1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
                    document.getElementById("otRate").style.borderBottom = "1px solid red";
                    document.getElementById("otRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("otRate").style.borderColor = "#dde6e9";
                    document.getElementById("otRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
                    document.getElementById("osaRate").style.borderBottom = "1px solid red";
                    document.getElementById("osaRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("osaRate").style.borderColor = "#dde6e9";
                    document.getElementById("osaRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
                    document.getElementById("nsaRate").style.borderBottom = "1px solid red";
                    document.getElementById("nsaRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("nsaRate").style.borderColor = "#dde6e9";
                    document.getElementById("nsaRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
                    document.getElementById("edRate").style.borderBottom = "1px solid red";
                    document.getElementById("edRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("edRate").style.borderColor = "#dde6e9";
                    document.getElementById("edRate1").innerHTML = '';
    
    
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
                if (angular.isUndefined(billCustomer.appointedDate) || billCustomer.appointedDate === '' || billCustomer.appointedDate === null) {
                    document.getElementById("appointedDate").style.borderBottom = "1px solid red";
                    document.getElementById("appointedDate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("appointedDate").style.borderColor = "#dde6e9";
                    document.getElementById("appointedDate1").innerHTML = '';
    
    
                }
                if (angular.isUndefined(billCustomer.drivercycle) || billCustomer.drivercycle === '' || billCustomer.drivercycle === null) {
                    document.getElementById("drivercycle").style.borderBottom = "1px solid red";
                    document.getElementById("drivercycle1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("drivercycle").style.borderColor = "#dde6e9";
                    document.getElementById("drivercycle1").innerHTML = '';
    
    
                }
                if (angular.isUndefined(billCustomer.driverName) || billCustomer.driverName === '' || billCustomer.driverName === null) {
                    document.getElementById("driverName").style.borderBottom = "1px solid red";
                    //document.getElementById("driverName").innerHTML = '';
    
                    count++;
                } else {
                    document.getElementById("driverName").style.borderColor = "#dde6e9";
                    //document.getElementById("driverName").innerHTML = '';
    
    
                }
            }


            // if (angular.isUndefined(billCustomer.adminChargeType) || billCustomer.adminChargeType === '' || billCustomer.adminChargeType === null) {
            //     document.getElementById("adminChargeType").style.borderBottom = "1px solid red";
            //     document.getElementById("adminChargeType1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("adminChargeType").style.borderColor = "#dde6e9";
            //     document.getElementById("adminChargeType1").innerHTML = '';


            // }
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
                    billCustomer.agreementStartDate.getDate());
                var agreementEDate = new Date(
                    billCustomer.agreementEndDate.getFullYear(),
                    billCustomer.agreementEndDate.getMonth(),
                    billCustomer.agreementEndDate.getDate());
               

                    var landlineNo = null;
                    if (!angular.isUndefined(billCustomer.landlineNumber)) {
                        landlineNo=billCustomer.landlineNumber;
                    }else{
                        
                        landlineNo = '';
                    }
                    var hsaNo = null;
                    if (!angular.isUndefined(billCustomer.hsaNumber) ) {
                        hsaNo= billCustomer.hsaNumber;
                    }else{
                        hsaNo = '';
                        
                    }
                    var contactPerson2Name = null;
                    if (!angular.isUndefined(billCustomer.contactPerson2Name) ) {
                        contactPerson2Name= billCustomer.contactPerson2Name;
                    }else{
                        contactPerson2Name = '';
                        
                    }
                    var contactPerson2Email = null;
                    if (!angular.isUndefined(billCustomer.contactPerson2Email) ) {
                        contactPerson2Email = billCustomer.contactPerson2Email;
                    }else{
                        contactPerson2Email = '';
                        
                    }
                    var contactPerson2MobileNumber = null;
                    if (!angular.isUndefined(billCustomer.contactPerson2MobileNumber)) {
                        contactPerson2MobileNumber=billCustomer.contactPerson2MobileNumber;
                    }else{
                        contactPerson2MobileNumber = '';
                        
                    }
                // var weeklyOff = null;
                // if (!angular.isUndefined(billCustomer.weeklyOff) || billCustomer.weeklyOff !== null || billCustomer.weeklyOff !== '') {
                //     weeklyOff = billCustomer.weeklyOff;
                // }
                // var note = null;
                // if (!angular.isUndefined(billCustomer.driverName) || billCustomer.driverName !== null || billCustomer.driverName !== '') {
                //     note = billCustomer.driverName;

                // }
                if(billCustomer.billType != 'Single'){
                Company2CustomerDetails.createBillingCustomerMDrivers({
                    firstName: billCustomer.firstName,
                    lastName: billCustomer.lastName,
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
                    // dutyHours: billCustomer.dutyHours,
                    // weeklyOff: weeklyOff,
                    // monthlySalary: billCustomer.monthlySalary,
                    // otRate: billCustomer.otRate,
                    // osaRate: billCustomer.osaRate,
                    // nsaRate: billCustomer.nsaRate,
                    // edRate: billCustomer.edRate,
                    // adminCharge: billCustomer.adminCharge,
                    // companyName: billCustomer.companyName,
                    agreementStartDate: agreementSDate,
                    agreementEndDate: agreementEDate,
                    billType:billCustomer.billType,
                    userId: $rootScope.userId,
                    contactPerson2Name: contactPerson2Name,
                    contactPerson2Email: contactPerson2Email,
                    contactPerson2MobileNumber:contactPerson2MobileNumber
                    //adminChargeType: billCustomer.adminChargeType,
                    //driverName: note
                },
            //     }, function(createSuccess) {
            //         console.log('create customer data: ' + JSON.stringify(createSuccess));
            //         $scope.isDisabledButton = false;
            //         $modalInstance.dismiss('cancel');
            //         // $localStorage.put('billingCustomerId', createSuccess[0].create_billing_customer);
            //         // var id =createSuccess[0].create_billing_customer;
            //         //  Company2CustomerDetails.findById({
            //         //                 id: id,
                                    
            //         //     },function(s){
            //         //         ConUsers.findById({
            //         //             id:s.conuserId,
            //         //         },function(ConUsers){
            //         //         ConUsers.password = billCustomer.mobileNumber;
            //         //         ConUsers.updatedBy = $localStorage.get('userId');
            //         //         ConUsers.updatedDate = new Date();
            //         //         ConUsers.$save();
            //         //         $rootScope.loader = 0;
            //         //          $state.go('app.billingCustomerDetails');
            //         //         },function(error){

            //         //         });
            //         //     },function(error){
            //         //     });
            // }, 
            function(customerData) {
                $localStorage.put('billingCustomerId', customerData[0].create_billing_customer_for_mdrivers);
                $modalInstance.dismiss('cancel');
                $.notify('Billing Customer Added successfully.', {
                    status: 'success'
                })
                $scope.isDisabledButton = false;
                $rootScope.loader = 0;
                $state.go('app.billingCustomerDetails');
                }, function(createErr) {
                    console.log('create customer error: ' + JSON.stringify(createErr));
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;
                    $modalInstance.dismiss('cancel');
                   
                });
            }else{

                
                var appointedDate = new Date(
                    billCustomer.appointedDate.getFullYear(),
                    billCustomer.appointedDate.getMonth(),
                    billCustomer.appointedDate.getDate() + 1);
              

                Company2CustomerDetails.createBillingCustomerMDrivers({
                    firstName: billCustomer.firstName,
                    lastName: billCustomer.lastName,
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
                    // dutyHours: billCustomer.dutyHours,
                    // weeklyOff: weeklyOff,
                    // monthlySalary: billCustomer.monthlySalary,
                    // otRate: billCustomer.otRate,
                    // osaRate: billCustomer.osaRate,
                    // nsaRate: billCustomer.nsaRate,
                    // edRate: billCustomer.edRate,
                    // adminCharge: billCustomer.adminCharge,
                    // companyName: billCustomer.companyName,
                    agreementStartDate: agreementSDate,
                    agreementEndDate: agreementEDate,
                    billType:billCustomer.billType,
                    userId: $rootScope.userId,
                    contactPerson2Name: contactPerson2Name,
                    contactPerson2Email: contactPerson2Email,
                    contactPerson2MobileNumber: contactPerson2MobileNumber
                    //adminChargeType: billCustomer.adminChargeType,
                    //driverName: note
                }, function(createSuccess) {
                    $localStorage.put('billingCustomerId', createSuccess[0].create_billing_customer_for_mdrivers);
                    console.log('create customer data: ' + JSON.stringify(createSuccess));
                    $scope.isDisabledButton = false;
                    Company2CustomerDetails.AppointDriverforBilling({
                        customerId: createSuccess[0].create_billing_customer_for_mdrivers,
                        driverName: billCustomer.driverName.description.driverName,
                        driverId: billCustomer.driverName.description.id,
                        driverHours: billCustomer.dutyHours,
                        weeklyOff: weeklyOff,
                        otRate: billCustomer.otRate,
                        nsaRate: billCustomer.nsaRate,
                        edRate: billCustomer.edRate,
                        monthlySalary: billCustomer.monthlySalary,
                        driverCycle: billCustomer.drivercycle,
                        appointedDate: appointedDate,
                        osaRate: billCustomer.osaRate,
                        createdBy: $rootScope.userId,
                        adminCharge: billCustomer.adminCharge,
                        adminChargeType: billCustomer.adminChargeType,
                        
                        // agreementStartDate: agreementSDate,
                        // agreementEndDate: agreementEDate,
                        // userId: $rootScope.userId,
                        // contactPerson2Name: billCustomer.contactPerson2Name,
                        // contactPerson2Email: billCustomer.contactPerson2Email,
                        // contactPerson2MobileNumber: billCustomer.contactPerson2MobileNumber,
                        // adminChargeType: billCustomer.adminChargeType,
                        //driverName: note
                    }, function(createSuccess) {
                        if (createSuccess[0].apoint_driver_to_billing_customer === 'Driver Allready Appointed') {
                            $modalInstance.dismiss('cancel');
                            $.notify(' driver Already Appointed.', {
                                status: 'danger'
                            });
                            $modalInstance.dismiss('cancel');
                            $state.go('app.billingCustomerDetails');
                            //$rootScope.getBillingCustomerDetails();
                            

                        }else if(createSuccess[0].apoint_driver_to_billing_customer ==='Driver appointed to someone else'){

                                $modalInstance.dismiss('cancel');
                                $.notify(' driver appointed to someone else', {
                                 status: 'danger'
                                 });
                                 $modalInstance.dismiss('cancel');
                                 $state.go('app.billingCustomerDetails');
                                // $rootScope.getBillingCustomerDetails();
                        }else{

                        
                        $modalInstance.dismiss('cancel');
                     reloadFunc();
                     
                     $rootScope.loader = 0;
                     $.notify(' driver Appointed successfully.', {
                        status: 'success'
                    });
                    $state.go('app.billingCustomerDetails');
                    //$rootScope.getBillingCustomerDetails();
                }
                    },
                    function(error){
    
                        window.alert('error in driver Appointing');

                    })
                    
                    
                    // var id =createSuccess[0].create_billing_customer;


                },function(createErr){
                    console.log('create customer error: ' + JSON.stringify(createErr));
                    $scope.isDisabledButton = false;
                    $rootScope.loader = 0;

                })

            }
            }
        };

        $rootScope.addExistingCustomer = function(billCustomer) {//add bill for existing customer
            //console.log('exist billCustomer' + JSON.stringify(billCustomer));
           // $rootScope.cu = billCustomer.conuserId;
            $rootScope.loader = 1;
            $scope.isDisabledButton = true;
            var count = 0;
            var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
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


            // if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
            //     document.getElementById("dutyHours").style.borderBottom = "1px solid red";
            //     document.getElementById("dutyHours1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("dutyHours").style.borderColor = "#dde6e9";
            //     document.getElementById("dutyHours1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
            //     document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
            //     document.getElementById("monthlySalary1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
            //     document.getElementById("monthlySalary1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
            //     document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
            //     document.getElementById("monthlySalary1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
            //     document.getElementById("monthlySalary1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
            //     document.getElementById("otRate").style.borderBottom = "1px solid red";
            //     document.getElementById("otRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("otRate").style.borderColor = "#dde6e9";
            //     document.getElementById("otRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
            //     document.getElementById("osaRate").style.borderBottom = "1px solid red";
            //     document.getElementById("osaRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("osaRate").style.borderColor = "#dde6e9";
            //     document.getElementById("osaRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
            //     document.getElementById("nsaRate").style.borderBottom = "1px solid red";
            //     document.getElementById("nsaRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("nsaRate").style.borderColor = "#dde6e9";
            //     document.getElementById("nsaRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
            //     document.getElementById("edRate").style.borderBottom = "1px solid red";
            //     document.getElementById("edRate1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("edRate").style.borderColor = "#dde6e9";
            //     document.getElementById("edRate1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.adminCharge) || billCustomer.adminCharge === '' || billCustomer.adminCharge === null) {
            //     document.getElementById("adminCharge").style.borderBottom = "1px solid red";
            //     document.getElementById("adminCharge1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("adminCharge").style.borderColor = "#dde6e9";
            //     document.getElementById("adminCharge1").innerHTML = '';


            // }

            // if (angular.isUndefined(billCustomer.companyName) || billCustomer.companyName === '' || billCustomer.companyName === null) {
            //     document.getElementById("companyName").style.borderBottom = "1px solid red";
            //     document.getElementById("companyName1").innerHTML = '*required';

            //     count++;
            // } else {
            //     document.getElementById("companyName").style.borderColor = "#dde6e9";
            //     document.getElementById("companyName1").innerHTML = '';


            // }
            if (angular.isUndefined(billCustomer.billType) || billCustomer.billType === '' || billCustomer.billType === null) {
                document.getElementById("billType").style.borderBottom = "1px solid red";
                document.getElementById("billType1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("billType").style.borderColor = "#dde6e9";
                document.getElementById("billType1").innerHTML = '';


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

            if(billCustomer.billType == 'Single'){

            

                if (angular.isUndefined(billCustomer.dutyHours) || billCustomer.dutyHours === '' || billCustomer.dutyHours === null) {
                    document.getElementById("dutyHours").style.borderBottom = "1px solid red";
                    document.getElementById("dutyHours1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("dutyHours").style.borderColor = "#dde6e9";
                    document.getElementById("dutyHours1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                    document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                    document.getElementById("monthlySalary1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                    document.getElementById("monthlySalary1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.monthlySalary) || billCustomer.monthlySalary === '' || billCustomer.monthlySalary === null) {
                    document.getElementById("monthlySalary").style.borderBottom = "1px solid red";
                    document.getElementById("monthlySalary1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("monthlySalary").style.borderColor = "#dde6e9";
                    document.getElementById("monthlySalary1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.otRate) || billCustomer.otRate === '' || billCustomer.otRate === null) {
                    document.getElementById("otRate").style.borderBottom = "1px solid red";
                    document.getElementById("otRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("otRate").style.borderColor = "#dde6e9";
                    document.getElementById("otRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.osaRate) || billCustomer.osaRate === '' || billCustomer.osaRate === null) {
                    document.getElementById("osaRate").style.borderBottom = "1px solid red";
                    document.getElementById("osaRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("osaRate").style.borderColor = "#dde6e9";
                    document.getElementById("osaRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.nsaRate) || billCustomer.nsaRate === '' || billCustomer.nsaRate === null) {
                    document.getElementById("nsaRate").style.borderBottom = "1px solid red";
                    document.getElementById("nsaRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("nsaRate").style.borderColor = "#dde6e9";
                    document.getElementById("nsaRate1").innerHTML = '';
    
    
                }
    
                if (angular.isUndefined(billCustomer.edRate) || billCustomer.edRate === '' || billCustomer.edRate === null) {
                    document.getElementById("edRate").style.borderBottom = "1px solid red";
                    document.getElementById("edRate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("edRate").style.borderColor = "#dde6e9";
                    document.getElementById("edRate1").innerHTML = '';
    
    
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
                if (angular.isUndefined(billCustomer.appointedDate) || billCustomer.appointedDate === '' || billCustomer.appointedDate === null) {
                    document.getElementById("appointedDate").style.borderBottom = "1px solid red";
                    document.getElementById("appointedDate1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("appointedDate").style.borderColor = "#dde6e9";
                    document.getElementById("appointedDate1").innerHTML = '';
    
    
                }
                if (angular.isUndefined(billCustomer.drivercycle) || billCustomer.drivercycle === '' || billCustomer.drivercycle === null) {
                    document.getElementById("drivercycle").style.borderBottom = "1px solid red";
                    document.getElementById("drivercycle1").innerHTML = '*required';
    
                    count++;
                } else {
                    document.getElementById("drivercycle").style.borderColor = "#dde6e9";
                    document.getElementById("drivercycle1").innerHTML = '';
    
    
                }
                if (angular.isUndefined(billCustomer.driverName) || billCustomer.driverName === '' || billCustomer.driverName === null) {
                    document.getElementById("driverName").style.borderBottom = "1px solid red";
                    //document.getElementById("driverName").innerHTML = '';
    
                    count++;
                } else {
                    document.getElementById("driverName").style.borderColor = "#dde6e9";
                    //document.getElementById("driverName").innerHTML = '';
    
    
                }
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
                    billCustomer.agreementStartDate.getDate());
                var agreementEDate = new Date(
                    billCustomer.agreementEndDate.getFullYear(),
                    billCustomer.agreementEndDate.getMonth(),
                    billCustomer.agreementEndDate.getDate());

                var landlineNo = null;
                    if (!angular.isUndefined(billCustomer.landlineNumber)) {
                            landlineNo=billCustomer.landlineNumber;
                    }else{
                        
                            landlineNo = '';
                    }

                var hsaNo = null;
                    if (!angular.isUndefined(billCustomer.hsaNumber) ) {
                            hsaNo= billCustomer.hsaNumber;
                    }else{
                            hsaNo = '';
                        
                    }
                var contactPerson2Name = null;
                    if (!angular.isUndefined(billCustomer.contactPersonName2) ) {
                        contactPerson2Name= billCustomer.contactPersonName2;
                    }else{
                        contactPerson2Name = '';
                        
                    }
                var contactPerson2Email = null;
                    if (!angular.isUndefined(billCustomer.contactPerson2Email) ) {
                             contactPerson2Email = billCustomer.contactPerson2Email;
                    }else{
                            contactPerson2Email = '';
                        
                    }
                var contactPerson2MobileNumber = null;
                    if (!angular.isUndefined(billCustomer.contactPerson2MobileNumber)) {
                            contactPerson2MobileNumber=billCustomer.contactPerson2MobileNumber;
                    }else{
                            contactPerson2MobileNumber = '';
                        
                    }
                ConUsers.findById({
                    id:  billCustomer.conuserId
                },
                function(ConUsers) {
                    //console.log('fetch conuser for update' + JSON.stringify(ConUsers));
                    ConUsers.firstName = billCustomer.firstName;
                    ConUsers.lastName = billCustomer.lastName;
                    ConUsers.email = billCustomer.email;
                    ConUsers.mobileNumber = billCustomer.mobileNumber;
                    ConUsers.username = billCustomer.mobileNumber;
                    ConUsers.password = billCustomer.mobileNumber;
                    ConUsers.address = billCustomer.address;
                    ConUsers.updatedBy = $rootScope.userId;
                    ConUsers.updatedDate = new Date();
                    ConUsers.$save();
                    Company2CustomerDetails.create({
                        conuserId: billCustomer.conuserId,
                        agreementNumber: billCustomer.agreementNumber,
                        landline : landlineNo,
                        contactPersonName : billCustomer.contactPersonName,
                        contactPersonEmail : billCustomer.contactPersonEmail,
                        vehicleName : billCustomer.vehicleName,
                        vehicleType : billCustomer.vehicleType,
                        hsaNumber : hsaNo,
                        gstinNumber:billCustomer.gstnNumber,
                        agreementStartDate: agreementSDate,
                        agreementEndDate : agreementEDate,
                        billType : billCustomer.billType,
                        contactPerson2Name:contactPerson2Name,
                        contactPerson2MobileNumber:contactPerson2MobileNumber,
                        contactPerson2Email:contactPerson2Email,
                        companyName:'ID Car Drivers Pvt Ltd',
                        
                    },
                    function(customerData) {
                        $localStorage.put('billingCustomerId',customerData.id);
                        //console.log('fetch customer for update: ' + JSON.stringify(customerData));
                       var company2CustomerId=customerData.id;
                        
                         
                         $.notify(' customer created  successfully.', {
                            status: 'success'
                        });
                        if(billCustomer.billType == 'Single'){
                            var weeklyOff = null;
                            if (!angular.isUndefined(billCustomer.weeklyOff) ) {
                                weeklyOff = billCustomer.weeklyOff;
                            }else{
                                weeklyOff='';
                            }
                            var appointedDate = new Date(
                                billCustomer.appointedDate.getFullYear(),
                                billCustomer.appointedDate.getMonth(),
                                billCustomer.appointedDate.getDate()+1);


                                Company2CustomerDetails.AppointDriverforBilling({
                                    customerId: company2CustomerId,
                                    driverName: billCustomer.driverName.description.driverName,
                                    driverId: billCustomer.driverName.description.id,
                                    driverHours: billCustomer.dutyHours,
                                    weeklyOff: weeklyOff,
                                    otRate: billCustomer.otRate,
                                    nsaRate: billCustomer.nsaRate,
                                    edRate: billCustomer.edRate,
                                    monthlySalary: billCustomer.monthlySalary,
                                    driverCycle: billCustomer.drivercycle,
                                    appointedDate: appointedDate,
                                    osaRate: billCustomer.osaRate,
                                    createdBy: $rootScope.userId,
                                    adminCharge: billCustomer.adminCharge,
                                    adminChargeType: billCustomer.adminChargeType,
                                    
                                    // agreementStartDate: agreementSDate,
                                    // agreementEndDate: agreementEDate,
                                    // userId: $rootScope.userId,
                                    // contactPerson2Name: billCustomer.contactPerson2Name,
                                    // contactPerson2Email: billCustomer.contactPerson2Email,
                                    // contactPerson2MobileNumber: billCustomer.contactPerson2MobileNumber,
                                    // adminChargeType: billCustomer.adminChargeType,
                                    //driverName: note
                                }, function(createSuccess) {
                                    if (createSuccess[0].apoint_driver_to_billing_customer === 'Driver Allready Appointed') {
                                        $modalInstance.dismiss('cancel');
                                        $.notify(' driver Already Appointed.', {
                                            status: 'danger'
                                        });
                                        $state.go('app.billingCustomerDetails');
                                        //$rootScope.getBillingCustomerDetails();
                                       
            
                                    }else if(createSuccess[0].apoint_driver_to_billing_customer ==='Driver appointed to someone else'){
            
                                            $modalInstance.dismiss('cancel');
                                            $.notify(' driver already appointed to someone else', {
                                             status: 'danger'
                                             });
                                             //$rootScope.getBillingCustomerDetails();
                                             $state.go('app.billingCustomerDetails');
                                    }else{
            
                                    
                                    $modalInstance.dismiss('cancel');
                                 reloadFunc();
                                
                                 $rootScope.loader = 0;
                                 $.notify(' driver Appointed successfully.', {
                                    status: 'success'
                                });
                                $state.go('app.billingCustomerDetails');
                                //$rootScope.getBillingCustomerDetails();
                            }
                                },
                                function(error){
                
                                    window.alert('error in driver Appointing');
            
                                })




                        }
                        $modalInstance.dismiss('cancel');
                        $state.go('app.billingCustomerDetails');
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
                })
    

                // var weeklyOff = null;
                // if (!angular.isUndefined(billCustomer.weeklyOff) || billCustomer.weeklyOff !== null || billCustomer.weeklyOff !== '') {
                //     weeklyOff = billCustomer.weeklyOff;
                // }
                // var note = null;
                // if (!angular.isUndefined(billCustomer.driverName) || billCustomer.driverName !== null || billCustomer.driverName !== '') {
                //     note = billCustomer.driverName;
                // }
                // Company1CustomerDetails.createExistingBillingCustomer({
                //     conuserId: billCustomer.conuserId,
                //     agreementNumber: billCustomer.agreementNumber,
                //     landline: landlineNo,
                //     contactPersonName: billCustomer.contactPersonName,
                //     contactPersonEmail: billCustomer.contactPersonEmail,
                //     vehicleName: billCustomer.vehicleName,
                //     vehicleType: billCustomer.vehicleType,
                //     gstnNumber: billCustomer.gstnNumber,
                //     hsaNumber: hsaNo,
                //     dutyHours: billCustomer.dutyHours,
                //     weeklyOff: billCustomer.weeklyOff,
                //     monthlySalary: billCustomer.monthlySalary,
                //     otRate: billCustomer.otRate,
                //     osaRate: billCustomer.osaRate,
                //     nsaRate: billCustomer.nsaRate,
                //     edRate: billCustomer.edRate,
                //     adminCharge: billCustomer.adminCharge,
                //     companyName: billCustomer.companyName,
                //     agreementStartDate: agreementSDate,
                //     agreementEndDate: agreementEDate,
                //     userId: $rootScope.userId,
                //     adminChargeType: billCustomer.adminChargeType,
                //     driverName: note
                // }, function(createSuccess) {
                //     //console.log('create customer data: ' + JSON.stringify(createSuccess));
                //     $scope.isDisabledButton = false;
                //     $modalInstance.dismiss('cancel');
                //     $localStorage.put('billingCustomerId', createSuccess[0].create_existing_billing_customer);
                //     $state.go('app.billingCustomerDetails');
                //     $rootScope.loader = 0;
                // }, function(createErr) {
                //     console.log('create customer error: ' + JSON.stringify(createErr));
                //     $scope.isDisabledButton = false;
                //     $modalInstance.dismiss('cancel');
                //     $rootScope.loader = 0;
                // });


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
        $scope.openBillStart = false;
       
        $scope.driverAppointdate=false;

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
        $scope.driverAppointDateOpen = function($event) {
            console.log("hi");
            $event.preventDefault();
            $event.stopPropagation();
            $scope.driverAppointdate= true;
            $scope.openToDate = false;
            $scope.openBillStart = false;
            $scope.openedStart = false;
            
        }
        

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

    };


    $rootScope.cancelCustomerBill = function(billId) {//cancel customer bill
        $rootScope.loader = 1;
        //console.log('billId for cancel: ' + billId);
        var compName = $localStorage.get('selectedCompanyName');
        if ($window.confirm("Are you sure? You want to cancel this Bill!")) {
            $scope.result = "Yes";
            if (compName === 'ID Services') {
                Company1CustomerBills.findById({
                    id: billId
                }, function(Company1CustomerBills) {
                    //console.log('Company1CustomerBills details: ' + JSON.stringify(Company1CustomerBills));
                    Company1CustomerBills.status = 'C';
                    Company1CustomerBills.$save();
                    reloadFunc();
                    $rootScope.getBillingCustomerDetails();

                }, function(error) {
                    console.log('Company1CustomerBills error: ' + JSON.stringify(error));
                });
            } else {
                Company2CustomerBills.findById({
                    id: billId
                }, function(Company2CustomerBills) {
                    //console.log('Company2CustomerBills details: ' + JSON.stringify(Company2CustomerBills));
                    Company2CustomerBills.status = 'C';
                    Company2CustomerBills.$save();
                    reloadFunc();
                    $rootScope.getBillingCustomerDetails();

                }, function(error) {
                    console.log('Company2CustomerBills error: ' + JSON.stringify(error));
                });
            }
            $rootScope.loader = 0;
        } else {
            $scope.result = "No";
            $rootScope.loader = 0;

        }



    }


    $scope.printBillPopup = function(bill) {//bii popup
        //console.log('print bill ID' + JSON.stringify(bId));

        $localStorage.put('localStoragePrintBillId', bill.id);
        if (bill.billType === 'Monthly') {
            $state.go('app.billPrintPage');
        }else if(bill.billType === 'Multiple Driver Monthly'){
            $state.go('app.multiplebillPrintPage');
        } else {
            $state.go('app.otherBillPrintPage');
        }


    }

    $rootScope.getPrintBillDetails = function() {//bill print page

        $rootScope.loader = 1;

        //$rootScope.customerData = [];
        var allBillData = [];

        $rootScope.printBillDetails = [];
        var compName = $localStorage.get('selectedCompanyName');
        var printBillId = $localStorage.get('localStoragePrintBillId');
        if (compName === 'ID Services') {
            Company1CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    },
                    include: [{
                        relation: 'company1BillDetails'
                    }, {
                        relation: 'company1CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company1CustomerRate'
                            }]
                        }
                    }]
                }
            }, function(printBillData) {
                //console.log('print bill Data ' + JSON.stringify(printBillData));

                if (angular.isDefined(printBillData)) {

                    var billDate = moment(printBillData.billDate).format('YYYY-MM-DD');
                    var billStartDate = moment(printBillData.billFromDate).format('YYYY-MM-DD');
                    var billEndDate = moment(printBillData.billToDate).format('YYYY-MM-DD');
                    var name;
                    if (angular.isUndefined(printBillData.company1CustomerDetails.conUsers.middleName) || printBillData.company1CustomerDetails.conUsers.middleName == null) {
                        name = printBillData.company1CustomerDetails.conUsers.firstName + ' ' + printBillData.company1CustomerDetails.conUsers.lastName;
                    } else {
                        name = printBillData.company1CustomerDetails.conUsers.firstName + ' ' + printBillData.company1CustomerDetails.conUsers.middleName + ' ' + printBillData.company1CustomerDetails.conUsers.lastName;
                    }
                    var note = null;
                    if (!angular.isUndefined(printBillData.company1CustomerDetails.note) || printBillData.company1CustomerDetails.note !== null || printBillData.company1CustomerDetails.note !== '') {
                        note = printBillData.company1CustomerDetails.note;
                    }
                    if (printBillData.company1BillDetails.length > 0) {
                        for (var i = 0; i < printBillData.company1BillDetails.length; i++) {

                            if (printBillData.company1BillDetails[i].itemId === '1') {

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var salaryChargedAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var salaryChargedAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var salaryChargedQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var salaryChargedQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var salaryChargedRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var salaryChargedRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var salaryChargedUnit = printBillData.company1BillDetails[i].unit;
                                }


                            }
                            if (printBillData.company1BillDetails[i].itemId === '2') {
                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var overTimeAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var overTimeAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var overTimeQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var overTimeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var overTimeRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var overTimeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var overTimeUnit = printBillData.company1BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company1BillDetails[i].itemId === '3') {


                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var outstationAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var outstationAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var outstationQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var outstationQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var outstationRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var outstationRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var outstationUnit = printBillData.company1BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company1BillDetails[i].itemId === '4') {

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var nightStayAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var nightStayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var nightStayQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var nightStayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var nightStayRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var nightStayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var nightStayUnit = printBillData.company1BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company1BillDetails[i].itemId === '5') {

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var extraDayAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var extraDayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var extraDayQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var extraDayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var extraDayRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var extraDayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var extraDayUnit = printBillData.company1BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company1BillDetails[i].itemId === '6') {

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    var adminChargeAmount = printBillData.company1BillDetails[i].amount;
                                } else {
                                    var adminChargeAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].quantity) || printBillData.company1BillDetails[i].quantity !== null || printBillData.company1BillDetails[i].quantity !== 0) {
                                    var adminChargeQuantity = printBillData.company1BillDetails[i].quantity;
                                } else {
                                    var adminChargeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].rate) || printBillData.company1BillDetails[i].rate !== null || printBillData.company1BillDetails[i].rate !== 0) {
                                    var adminChargeRate = printBillData.company1BillDetails[i].rate;
                                } else {
                                    var adminChargeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].unit) || printBillData.company1BillDetails[i].unit !== null || printBillData.company1BillDetails[i].unit !== 0) {
                                    var adminChargeUnit = printBillData.company1BillDetails[i].unit;

                                }
                                var adminChargeText = null;
                                if (adminChargeUnit === 'Percentage') {
                                    adminChargeText = adminChargeRate + '%';
                                } else {
                                    adminChargeText = '';
                                }
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
                        gstnNumber: printBillData.company1CustomerDetails.gstinNumber,
                        hsaNumber: printBillData.company1CustomerDetails.hsaNumber,
                        companyName: printBillData.company1CustomerDetails.companyName,
                        monthlySalary: Math.round(salaryChargedRate * 30),
                        customerName: name,
                        firstName: printBillData.company1CustomerDetails.conUsers.firstName,
                        lastName: printBillData.company1CustomerDetails.conUsers.lastName,
                        email: printBillData.company1CustomerDetails.conUsers.email,
                        mobileNumber: printBillData.company1CustomerDetails.conUsers.mobileNumber,
                        address: printBillData.company1CustomerDetails.conUsers.address,
                        contactPersonName: printBillData.company1CustomerDetails.contactPersonName,
                        salaryChargedAmt: Math.round(salaryChargedAmount),
                        salaryChargedQty: salaryChargedQuantity,
                        overTimeAmt: Math.round(overTimeAmount),
                        overTimeQty: overTimeQuantity,
                        outstationAmt: Math.round(outstationAmount),
                        outstationQty: outstationQuantity,
                        nightStayAmt: Math.round(nightStayAmount),
                        nightStayQty: nightStayQuantity,
                        extraDayAmt: Math.round(extraDayAmount),
                        extraDayQty: extraDayQuantity,
                        adminChargeAmt: Math.round(adminChargeAmount),
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
                        companyGstn: '27AADFI2338E1ZO',
                        panNumber:'AADFI2338E',
                        driverName:printBillData.company1CustomerDetails.driverName,
                        remark:printBillData.remark


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
        } else {
            Company2CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    },
                    include: [{
                        relation: 'company2BillDetails'
                    }, {
                        relation: 'company2CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company2CustomerRate'
                            }]
                        }
                    }]
                }
            }, function(printBillData) {
                //console.log('print bill Data ' + JSON.stringify(printBillData));

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

                    if (printBillData.company2BillDetails.length > 0) {
                        for (var i = 0; i < printBillData.company2BillDetails.length; i++) {

                            if (printBillData.company2BillDetails[i].itemId === '1') {

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var salaryChargedAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var salaryChargedAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var salaryChargedQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var salaryChargedQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var salaryChargedRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var salaryChargedRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var salaryChargedUnit = printBillData.company2BillDetails[i].unit;
                                }


                            }
                            if (printBillData.company2BillDetails[i].itemId === '2') {
                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var overTimeAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var overTimeAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var overTimeQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var overTimeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var overTimeRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var overTimeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var overTimeUnit = printBillData.company2BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2BillDetails[i].itemId === '3') {


                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var outstationAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var outstationAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var outstationQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var outstationQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var outstationRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var outstationRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var outstationUnit = printBillData.company2BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2BillDetails[i].itemId === '4') {

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var nightStayAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var nightStayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var nightStayQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var nightStayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var nightStayRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var nightStayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var nightStayUnit = printBillData.company2BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2BillDetails[i].itemId === '5') {

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var extraDayAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var extraDayAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var extraDayQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var extraDayQuantity = 0;
                                }
                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var extraDayRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var extraDayRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var extraDayUnit = printBillData.company2BillDetails[i].unit;
                                }
                            }
                            if (printBillData.company2BillDetails[i].itemId === '6') {

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    var adminChargeAmount = printBillData.company2BillDetails[i].amount;
                                } else {
                                    var adminChargeAmount = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].quantity) || printBillData.company2BillDetails[i].quantity !== null || printBillData.company2BillDetails[i].quantity !== 0) {
                                    var adminChargeQuantity = printBillData.company2BillDetails[i].quantity;
                                } else {
                                    var adminChargeQuantity = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].rate) || printBillData.company2BillDetails[i].rate !== null || printBillData.company2BillDetails[i].rate !== 0) {
                                    var adminChargeRate = printBillData.company2BillDetails[i].rate;
                                } else {
                                    var adminChargeRate = 0;
                                }

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].unit) || printBillData.company2BillDetails[i].unit !== null || printBillData.company2BillDetails[i].unit !== 0) {
                                    var adminChargeUnit = printBillData.company2BillDetails[i].unit;

                                }
                                var adminChargeText = null;
                                if (adminChargeUnit === 'Percentage') {
                                    adminChargeText = adminChargeRate + '%';
                                } else {
                                    adminChargeText = '';
                                }
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
                        salaryChargedAmt: Math.round(salaryChargedAmount),
                        salaryChargedQty: salaryChargedQuantity,
                        overTimeAmt: Math.round(overTimeAmount),
                        overTimeQty: overTimeQuantity,
                        outstationAmt: Math.round(outstationAmount),
                        outstationQty: outstationQuantity,
                        nightStayAmt: Math.round(nightStayAmount),
                        nightStayQty: nightStayQuantity,
                        extraDayAmt: Math.round(extraDayAmount),
                        extraDayQty: extraDayQuantity,
                        adminChargeAmt: Math.round(adminChargeAmount),
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
                        remark:printBillData.remark


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
        }


    };

    $rootScope.getOtherPrintBillDetails = function() {//other bill print page

        $rootScope.loader = 1;

        //$rootScope.customerData = [];
        var allBillData = [];

        $rootScope.otherPrintBillDetails = [];
        var compName = $localStorage.get('selectedCompanyName');
        var printBillId = $localStorage.get('localStoragePrintBillId');
        if (compName === 'ID Services') {
            Company1CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    },
                    include: [{
                        relation: 'company1BillDetails'
                    }, {
                        relation: 'company1CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company1CustomerRate'
                            }]
                        }
                    }]
                }
            }, function(printBillData) {
                //console.log('print bill Data ' + JSON.stringify(printBillData));

                if (angular.isDefined(printBillData)) {

                    var billDate = moment(printBillData.billDate).format('YYYY-MM-DD');
                    var billStartDate = moment(printBillData.billFromDate).format('YYYY-MM-DD');
                    var billEndDate = moment(printBillData.billToDate).format('YYYY-MM-DD');
                    var name;
                    if (angular.isUndefined(printBillData.company1CustomerDetails.conUsers.middleName) || printBillData.company1CustomerDetails.conUsers.middleName == null) {
                        name = printBillData.company1CustomerDetails.conUsers.firstName + ' ' + printBillData.company1CustomerDetails.conUsers.lastName;
                    } else {
                        name = printBillData.company1CustomerDetails.conUsers.firstName + ' ' + printBillData.company1CustomerDetails.conUsers.middleName + ' ' + printBillData.company1CustomerDetails.conUsers.lastName;
                    }
                    var note = null;
                    if (!angular.isUndefined(printBillData.company1CustomerDetails.note) || printBillData.company1CustomerDetails.note !== null || printBillData.company1CustomerDetails.note !== '') {
                        note = printBillData.company1CustomerDetails.note;
                    }
                    var descName = null;
                    var descAmt = 0;
                    if (printBillData.company1BillDetails.length > 0) {
                        for (var i = 0; i < printBillData.company1BillDetails.length; i++) {

                            if (printBillData.company1BillDetails[i].itemId === '7') {
                                descName = 'Professional Fees';

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company1BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }


                            }
                            if (printBillData.company1BillDetails[i].itemId === '8') {
                                descName = 'Bonus';
                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company1BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }

                            }
                            if (printBillData.company1BillDetails[i].itemId === '9') {
                                descName = 'Arrears';

                                if (!angular.isUndefined(printBillData.company1BillDetails[i].amount) || printBillData.company1BillDetails[i].amount !== null || printBillData.company1BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company1BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }

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
                        total: Math.round(descAmt),
                        note: note,
                        subTotal: Math.round(printBillData.subTotal),
                        cgst: Math.round(printBillData.cgst),
                        sgst: Math.round(printBillData.sgst),
                        status: printBillData.status,
                        billFromDate: billStartDate,
                        billToDate: billEndDate,
                        reverseCharge: printBillData.reverseCharge,
                        gstnNumber: printBillData.company1CustomerDetails.gstinNumber,
                        hsaNumber: printBillData.company1CustomerDetails.hsaNumber,
                        companyName: printBillData.company1CustomerDetails.companyName,
                        customerName: name,
                        firstName: printBillData.company1CustomerDetails.conUsers.firstName,
                        lastName: printBillData.company1CustomerDetails.conUsers.lastName,
                        email: printBillData.company1CustomerDetails.conUsers.email,
                        mobileNumber: printBillData.company1CustomerDetails.conUsers.mobileNumber,
                        address: printBillData.company1CustomerDetails.conUsers.address,
                        contactPersonName: printBillData.company1CustomerDetails.contactPersonName,
                        advanceAmount: advance,
                        netAmount: Math.round(netAmount),
                        companyGstn: '27AADFI2338E1ZO',
                        panNumber:'AADFI2338E',
                        descriptionName: descName,
                        descriptionAmount: descAmt,
                        remark:printBillData.remark,
                        driverName:printBillData.company1CustomerDetails.driverName


                    });



                }

                $rootScope.otherPrintBillDetails = allBillData;

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
        } else {
            Company2CustomerBills.findOne({
                filter: {
                    where: {
                        id: printBillId
                    },
                    include: [{
                        relation: 'company2BillDetails'
                    }, {
                        relation: 'company2CustomerDetails',
                        scope: {
                            include: [{

                                relation: 'conUsers'
                            }, {

                                relation: 'company2CustomerRate'
                            }]
                        }
                    }]
                }
            }, function(printBillData) {
                //console.log('print bill Data ' + JSON.stringify(printBillData));

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

                    var descName = null;
                    var descAmt = 0;
                    if (printBillData.company2BillDetails.length > 0) {
                        for (var i = 0; i < printBillData.company2BillDetails.length; i++) {

                            if (printBillData.company2BillDetails[i].itemId === '7') {
                                descName = 'Professional Fees';

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company2BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }


                            }
                            if (printBillData.company2BillDetails[i].itemId === '8') {
                                descName = 'Bonus';
                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company2BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }

                            }
                            if (printBillData.company2BillDetails[i].itemId === '9') {
                                descName = 'Arrears';

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company2BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }

                            }

                            if (printBillData.company2BillDetails[i].itemId === '10') {
                                descName = 'On_Call/Replacement';

                                if (!angular.isUndefined(printBillData.company2BillDetails[i].amount) || printBillData.company2BillDetails[i].amount !== null || printBillData.company2BillDetails[i].amount !== 0) {
                                    descAmt = printBillData.company2BillDetails[i].amount;
                                } else {
                                    descAmt = 0;
                                }

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
                        total: Math.round(descAmt),
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
                        customerName: name,
                        firstName: printBillData.company2CustomerDetails.conUsers.firstName,
                        lastName: printBillData.company2CustomerDetails.conUsers.lastName,
                        email: printBillData.company2CustomerDetails.conUsers.email,
                        mobileNumber: printBillData.company2CustomerDetails.conUsers.mobileNumber,
                        address: printBillData.company2CustomerDetails.conUsers.address,
                        contactPersonName: printBillData.company2CustomerDetails.contactPersonName,
                        advanceAmount: advance,
                        netAmount: Math.round(netAmount),
                        companyGstn: '27AAECI1252K1ZL',
                        panNumber:'AAECI1252K',
                        descriptionName: descName,
                        descriptionAmount: descAmt,
                        remark:printBillData.remark,
                        driverName:printBillData.company2CustomerDetails.driverName


                    });



                }


                $rootScope.otherPrintBillDetails = allBillData;

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
        }


    };
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


    $scope.backToSelectCompany = function() {
        $localStorage.put('selectedCompanyName', undefined);
        $state.go('app.selectCompany');
    }

    $scope.backToSearchPage = function() {
        $scope.billingCustId = undefined;
        $rootScope.billingCustNumber = undefined;
        $localStorage.put('billingCustomerId', undefined);
        $localStorage.put('searchBillFromDate', undefined);
        $localStorage.put('searchBillToDate', undefined);
        //console.log('id **** ' + $localStorage.get('billingCustomerId'));
        $state.go('app.monthlyCustomerBilling');
    };
 $scope.backToSearchPagemain = function() {
        $scope.billingCustId = undefined;
        $rootScope.billingCustNumber = undefined;
        $localStorage.put('billingCustomerId', undefined);
        $localStorage.put('searchBillFromDate', undefined);
        $localStorage.put('searchBillToDate', undefined);
        $localStorage.put('billId', undefined);
        //console.log('id **** ' + $localStorage.get('billingCustomerId'));
        $state.go('app.monthlyCustomerBilling');
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

        $scope.start_date = (s_date && !isNaN(Date.parse(s_date))) ? Date.parse(s_date) : 0;
        $scope.end_date = (e_date && !isNaN(Date.parse(e_date))) ? Date.parse(getCurrentDateTime(e_date)) : new Date().getTime();
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


        //  $scope.tableParams3.reload();
    };



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

    }//end sub controller billingCustomerModalCtrl

    /*controller end*/
}
