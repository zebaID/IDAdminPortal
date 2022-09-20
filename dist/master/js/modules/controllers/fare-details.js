App.controller('fareDetailsCtrl', fareDetailsCtrl)

function fareDetailsCtrl($scope, $rootScope,$filter, ngTableParams) {
    'use strict';


    $scope.getFareDetails = function() {
        $rootScope.loader = 1;
        $scope.fareList = [];
        var allClubData = [];

        allClubData.push({
            id: 1,
            invoiceHeadName: 'Local Day Charges',
            invoiceHeadType: 'Manual',
            amount: 360
        });
        allClubData.push({
            id: 2,
            invoiceHeadName: 'Local Over Time',
            invoiceHeadType: 'Manual',
            amount: 250
        });
        allClubData.push({
            id: 3,
            invoiceHeadName: 'Return Charges',
            invoiceHeadType: '100 KM',
            amount: 225
        });
        $scope.data = allClubData;
        $scope.orginalData = allClubData;
        createTable();
       $rootScope.loader = 0;

    };
    $scope.fareData = {
        custName: 'Vikrant Shetty',
        custContact:'9898989898',
        driverName: 'Amar More',
        driverContact: '9797977777',
    	dutyType: 'local',
    	carType: 'Manual',
        journeyType: 'One Way',
    	reportingDate: '10/04/2016',
    	relievingDate: '10/04/2016',
    	reportingTime: '10:00 AM',
    	relievingTime: '04:00 PM',
    	pickupLocation: 'Bhawani peth,camp,Pune',
    	dropLocation: 'Chinchwad,Pune'
    };
    $scope.getFareDetails();

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

}
