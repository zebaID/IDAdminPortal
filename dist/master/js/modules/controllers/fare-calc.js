App.controller('fareCalcCtrl', ['$scope', '$state', '$rootScope', '$filter', 'ngTableParams', '$resource', '$timeout', //ngTableDataService,
    '$cookieStore', 'orderByFilter','$modal',
    function($scope, $state, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, orderByFilter, $modal) {
        'use strict';

    $scope.booking = {

        /*   bookingCustomerName: 'Laxmikant',
       bookingFirstName: 'Vikrant',
       bookingMiddleName: 'Kumar',
       bookingLastName: 'Shukla',
       bookingCellNumber: '9090909090',
       bookingReportingDate: '28-03-2016',
       bookingToDate: '28-03-2016',
       bookingFrmLocation: 'Food Stall Chaupati, Deccan Gymkhana, Pune',
       bookingToLocation: 'Green Park, Ahmednagar',
       dutyType: '2',
       carType: '2',
       outstationAmt: '100',
       outstationCity: '1',
       journeyType: '1',
       estimatedAmt: '1200',
       serviceTax: '200',
       totalAmt: '1500'
*/

    };

    $scope.closeModel = function() {
            $state.go('app.manageBooking');

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
    $scope.calculate = function(booking) {

        $rootScope.loader = 1;


        var count = 0;

        if (angular.isUndefined(booking.bookingReportingDate) || booking.bookingReportingDate === '' || booking.bookingReportingDate === null) {
            document.getElementById("bookingReportingDate").style.borderBottom = "1px solid red";
            document.getElementById("bookingReportingDate1").innerHTML = '*required';
            booking.bookingReportingDate1 = 'This value is required';
            count++;
        } else {
            document.getElementById("bookingReportingDate").style.borderColor = "#dde6e9";
            document.getElementById("bookingReportingDate1").innerHTML = '';
            booking.bookingReportingDate1 = null;

        }


        if (angular.isUndefined(booking.bookingFrmLocation) || booking.bookingFrmLocation === '') {
            document.getElementById("bookingFrmLocation").style.borderBottom = "1px solid red";
            document.getElementById("bookingFrmLocation1").innerHTML = '*required';
            booking.bookingFrmLocation1 = 'This value is required';
            count++;
        } else {
            document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
            document.getElementById("bookingFrmLocation1").innerHTML = '';
            booking.bookingFrmLocation1 = null;
        }



        if (angular.isUndefined(booking.dutyType) || booking.dutyType === '' || booking.dutyType === null) {
            document.getElementById("dutyType").style.borderBottom = "1px solid red";
            document.getElementById("dutyType1").innerHTML = '*required';
            booking.dutyType1 = 'This value is required';
            count++;
        } else {
            document.getElementById("dutyType").style.borderColor = "#dde6e9";
            document.getElementById("dutyType1").innerHTML = '';
            booking.dutyType1 = null;
        }

        if (angular.isUndefined(booking.hours) || booking.hours === '' || booking.hours === null) {
            document.getElementById("hours").style.borderBottom = "1px solid red";
            document.getElementById("bookingFromTime1").innerHTML = '*required';
            booking.bookingFromTime1 = 'This value is required';
            count++;
        } else {
            document.getElementById("hours").style.borderColor = "#dde6e9";
            document.getElementById("bookingFromTime1").innerHTML = '';
            booking.bookingFromTime1 = null;
        }
        if (angular.isUndefined(booking.minutes) || booking.minutes === '' || booking.minutes === null) {
            document.getElementById("minutes").style.borderBottom = "1px solid red";
            document.getElementById("bookingFromTime1").innerHTML = '*required';
            booking.bookingFromTime1 = 'This value is required';
            count++;
        } else {
            document.getElementById("minutes").style.borderColor = "#dde6e9";
            document.getElementById("bookingFromTime1").innerHTML = '';
            booking.bookingFromTime1 = null;
        }

        if (angular.isUndefined(booking.toHours) || booking.toHours === '' || booking.toHours === null) {
            document.getElementById("toHours").style.borderBottom = "1px solid red";
            document.getElementById("bookingToTime1").innerHTML = '*required';
            booking.bookingToTime1 = 'This value is required';
            count++;
        } else {
            document.getElementById("toHours").style.borderColor = "#dde6e9";
            document.getElementById("bookingToTime1").innerHTML = '';
            booking.bookingToTime1 = null;
        }
        if (angular.isUndefined(booking.toMinutes) || booking.toMinutes === '' || booking.toMinutes === null) {
            document.getElementById("toMinutes").style.borderBottom = "1px solid red";
            document.getElementById("bookingToTime1").innerHTML = '*required';
            booking.bookingToTime1 = 'This value is required';
            count++;
        } else {
            document.getElementById("toMinutes").style.borderColor = "#dde6e9";
            document.getElementById("bookingToTime1").innerHTML = '';
            booking.bookingToTime1 = null;
        }



        if (angular.isUndefined(booking.dutyType) || booking.dutyType === '' || booking.dutyType === null) {} else {
            if (booking.dutyType == '2') {
                if (angular.isUndefined(booking.outstationCity) || booking.outstationCity === '' || booking.outstationCity === null) {


                    document.getElementById("outstationCity").style.borderBottom = "1px solid red";
                    document.getElementById("outstationCity1").innerHTML = '*required';
                    booking.outstationCity1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("outstationCity").style.borderColor = "#dde6e9";
                    document.getElementById("outstationCity1").innerHTML = '';
                    booking.outstationCity1 = null;
                }

            }
        }


        if (angular.isUndefined(booking.bookingToDate) || booking.bookingToDate === '' || booking.bookingToDate === null) {
            document.getElementById("bookingToDate").style.borderBottom = "1px solid red";
            document.getElementById("bookingToDate1").innerHTML = '*required';
            booking.bookingToDate1 = 'This value is required';
            count++;
        } else {
            document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
            document.getElementById("bookingToDate1").innerHTML = '';
            booking.bookingToDate1 = null;

        }
        if (angular.isUndefined(booking.carType) || booking.carType === '' || booking.carType === null) {
            document.getElementById("carType").style.borderBottom = "1px solid red";
            document.getElementById("carType1").innerHTML = '*required';
            booking.carType1 = 'This value is required';
            count++;
        } else {
            document.getElementById("carType").style.borderColor = "#dde6e9";
            document.getElementById("carType1").innerHTML = '';
            booking.carType1 = null;
        }
        if (angular.isUndefined(booking.journeyType) || booking.journeyType === '' || booking.journeyType === null) {
            document.getElementById("journeyType").style.borderBottom = "1px solid red";
            document.getElementById("journeyType1").innerHTML = '*required';
            booking.journeyType1 = 'This value is required';
            count++;
        } else {
            document.getElementById("journeyType").style.borderColor = "#dde6e9";
            document.getElementById("journeyType1").innerHTML = '';
            booking.journeyType1 = null;
        }
        if (angular.isUndefined(booking.journeyType) || booking.journeyType === '' || booking.journeyType === null) {} else {
            if (booking.journeyType == '1') {

                if (angular.isUndefined(booking.bookingToLocation) || booking.bookingToLocation === '' || booking.status === null) {
                    document.getElementById("bookingToLocation").style.borderBottom = "1px solid red";
                    document.getElementById("bookingToLocation1").innerHTML = '*required';
                    booking.bookingToLocation1 = 'This value is required';
                    count++;
                } else {
                    document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                    document.getElementById("bookingToLocation1").innerHTML = '';
                    booking.bookingToLocation1 = null;
                }

            }

        }


        if (count > 0) {
            $scope.count = count;

            $rootScope.loader = 0;
            return false;
        } else {
            $rootScope.loader = 0;

            $scope.count = 0;


        }

    };


    $(function() {

    });

}]).directive('googleplace', function() {
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
       });


