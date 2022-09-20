App.controller('idLedgerCtrl', idLedgerCtrl)

function idLedgerCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, orderByFilter, $modal, DriverDetails, ConUsers, Bookings, Invoices) {
    'use strict';



    $scope.getBookings = function() {

        $rootScope.loader = 1;

        // clubData = orderByFilter(clubData, '-startingDate');
        ///clubData = orderByFilter(clubData, '-endingDate');
        $scope.tournamentList = [];
        var allDriverData = [];

        DriverDetails.find({
            filter: {
                include: [{
                    relation: 'conUsers'

                }, {
                    relation: 'bookings'
                }]
            }

        }, function(driverData) {
            console.log('driver data ' + JSON.stringify(driverData));
            var relDate = '-';
            for (var i = 0; i < driverData.length; i++) {
                var name;
                if (driverData[i].conUsers.middleName == null) {
                    name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.lastName;
                } else {
                    name = driverData[i].conUsers.firstName + ' ' + driverData[i].conUsers.middleName + ' ' + driverData[i].conUsers.lastName;
                }

                if (driverData[i].bookings.length > 0) {
                    relDate = driverData[i].bookings[0].reportingDate;
                }
                console.log('date ' + driverData[0].bookings[0].reportingDate);
                allDriverData.push({
                    id: driverData[i].id,
                    conuserId: driverData[i].conUsers.id,
                    name: name,
                    firstName: driverData[i].conUsers.firstName,
                    middleName: driverData[i].conUsers.middleName,
                    lastName: driverData[i].conUsers.lastName,
                    email: driverData[i].conUsers.email,
                    address: driverData[i].conUsers.address,
                    contactNo: driverData[i].conUsers.mobileNumber,
                    isLuxury: driverData[i].isLuxury,
                    status: driverData[i].conUsers.status,
                    accountNumber: driverData[i].accountNumber,
                    bankName: driverData[i].bankName,
                    ifscCode: driverData[i].ifscCode,
                    permanentAddress: driverData[i].permanentAddress,
                    reportingDate: relDate
                });

            }
            console.log('allDriverData' + JSON.stringify(allDriverData));

            $scope.data = allDriverData;
            $scope.orginalData = allDriverData;
            createTable();
            //processResults($scope.tournamentList, '');

            $rootScope.loader = 0;
        }, function(drvError) {
            console.log('Error ' + JSON.stringify(drvError));
        });
        /*allClubData.push({
            id: 1,
            driverName: 'Santosh Ghule',
            driverAddress: 'Hadapsar',
            driverLicenseNo: '12H905',
            frmDate: new Date('03-25-2016 11:00 AM'),
            toDate: new Date('03-27-2016 09:00 AM'),
            amount: 1200
        });

        allClubData.push({
            id: 1,
            driverName: 'Mahesh Ghule',
            driverAddress: 'Hadapsar',
            driverLicenseNo: '12H945',
            frmDate: new Date('03-22-2016 11:00 AM'),
            toDate: new Date('03-25-2016 09:00 AM'),
            amount: 1300
        });
        allClubData.push({
            id: 1,
            driverName: 'Ramesh Sasane',
            driverAddress: 'Aundh',
            driverLicenseNo: '12H999',
            frmDate: new Date('03-23-2016 11:00 AM'),
            toDate: new Date('03-25-2016 10:00 AM'),
            amount: 1200
        });
        allClubData.push({
            id: 1,
            driverName: 'Ashok More',
            driverAddress: 'Kondhwa',
            driverLicenseNo: '12H888',
            frmDate: new Date('03-23-2016 12:30 AM'),
            toDate: new Date('03-26-2016 12:00 AM'),
            amount: 1800
        });
*/



    };

    $scope.getBookings();

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
                var searchFromDate = new Date(searchList.frmDate);
                var searchToDate = new Date(searchList.toDate);

                if (searchFromDate >= start_date && searchToDate <= end_date) {
                    result.push(searchList);
                }
            });

            $scope.data = result;
        }

        /* if (fmDate !== '') {
             var users = $scope.orginalData;
             var searchList = $filter('filter')(users, {
                 name: searchData
             });

             console.log('Search data : ' + JSON.stringify(searchList));
             if (searchList.length > 0) {
                 $scope.recordFlag = true;
             }
             else {
                 $scope.recordFlag = false;
             }
             $scope.data = searchList;

         }*/
        else {

            $scope.data = $scope.orginalData;

        }


        $scope.tableParams3.reload();
    };

    $scope.submitTournament = function(tournamentId, tournamentName) {

        $rootScope.loader = 1;



        $rootScope.loader = 0;


    };

    $(function() {

    });

}
