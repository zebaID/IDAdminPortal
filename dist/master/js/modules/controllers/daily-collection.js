App.controller('dailyCollectionCtrl', dailyCollectionCtrl)

function dailyCollectionCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, orderByFilter, $modal) {
    'use strict';



    $scope.getBookings = function() {

        $rootScope.loader = 1;

        // clubData = orderByFilter(clubData, '-startingDate');
        ///clubData = orderByFilter(clubData, '-endingDate');
        $scope.tournamentList = [];
        var allClubData = [];

        allClubData.push({
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

        $scope.data = allClubData;
        $scope.orginalData = allClubData;
        createTable();
        //processResults($scope.tournamentList, '');

        $rootScope.loader = 0;


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
    $scope.searchRecords = function(s_date, e_date) {

        var start_date = (s_date && !isNaN(Date.parse(s_date))) ? Date.parse(s_date) : 0;
        var end_date = (e_date && !isNaN(Date.parse(e_date))) ? Date.parse(getCurrentDateTime(e_date)) : new Date().getTime();
        var result = [];
        var searchList = $scope.orginalData;
        if (searchList && searchList.length > 0) {
            $.each(searchList, function(index, searchList) {
                var frmDate = new Date(searchList.frmDate);
                if (start_date <= frmDate && frmDate <= end_date) {
                    result.push(searchList);
                }
            });
            $scope.data = result;

        }

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
