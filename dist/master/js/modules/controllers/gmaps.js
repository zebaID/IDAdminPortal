/**=========================================================
      * Module: gmaps.js
      * Demo for map api
      =========================================================*/
App.controller('GMapController', function($scope, $timeout, $modal, $rootScope, $state, $localStorage, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, $http, OutstationBookings, Invoices, $route, $window, InvoiceDetails) {
    $scope.mapLoading = true;
    var assetId = 1;
    var map;
    $rootScope.userId = $localStorage.get('userId');

    var markerArray = [];
    var marker = null;



    function initMap() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: {
                lat: 18.5253941,
                lng: 73.864448
            },
            zoom: 12
        });
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

        $rootScope.map = map;
        $rootScope.refreshMap();


    }

    $scope.search = "";
    $rootScope.changeLocation = function(search) {
        console.log('Hello' + search);
        var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + search + '';
        $http.post(mapUrl).success(function(result) {
            console.log('result' + JSON.stringify(result));
            var lat = result.results[0].geometry.location.lat;
            var lng = result.results[0].geometry.location.lng;

            console.log('***' + lat);
            console.log('***' + lng);
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: {
                    lat: lat,
                    lng: lng
                },
                zoom: 16
            });
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

            $rootScope.map = map;
            $rootScope.refreshMap();
        }).error(function(error) {
            console.log('error' + JSON.stringify(error));
            if (error == null) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }
        });
        console.log('mapUrl' + JSON.stringify(mapUrl));



    }


    assetId = 3;


    $rootScope.refreshMap = function() {

        var i = 0;
        var gm = google.maps;
        var oms = new OverlappingMarkerSpiderfier(map, {
            markersWontMove: true,
            markersWontHide: true
        });
        for (i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }
        markerArray = [];

        // var url = 'http://192.168.0.109:3000';
        var url = 'http://52.32.39.44:3000';
        /*var url = 'http://103.38.8.39:3000';*/
        $http.post(url + '/cronJobForAdminApp', null).
        success(function(data) {
            var bounds = new gm.LatLngBounds();
            console.log('+++++Object is +++++' + JSON.stringify(data));
            for (i = 0; i < data[0].driver.length; i++) {
                if (data[0].driver[i].booking_id == null) {
                    //alert('Free Driver');
                    myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                    bounds.extend(myLatLng);
                    var label1;
                    if (data[0].driver[i].is_luxury == 'Manual') {
                        label1 = '<i class="fa fa-male fa-2x" style="color:#27c24c"></i>';
                    } else if (data[0].driver[i].is_luxury == 'Luxury') {
                        label1 = '<i class="fa fa-male fa-2x" style="color:#f532e5"></i>';
                    } else {
                        label1 = '<i class="fa fa-male fa-2x" style="color:#5d9cec"></i>';
                    }

                    marker = new MarkerWithLabel({
                        position: myLatLng,

                        icon: ' ',
                        map: map,
                        labelContent: label1,
                        labelAnchor: new google.maps.Point(10, 30),
                        labelClass: "labels" // the CSS class for the label
                    });

                    oms.addMarker(marker);
                    //var markersNear = oms.markersNearMarker(marker, false);
                    /*marker.setLabel("" + (markersNear.length + 1));
                    marker.setOptions({
                      zIndex: markersNear.length
                    });  */
                    $scope.flag1 = 0;
                    oms.addListener('click', function(marker) {
                        $scope.flag1 = 1;
                        //iw.setContent(marker.desc);
                        //iw.open(map, marker);
                    });
                    oms.addListener('spiderfy', function(markers) {

                        //iw.close();
                    });
                    oms.addMarker(marker);



                    //  console.log('count ' + (markersNear.length + 1));
                    attachSecretMessageDriver(marker, data[0].driver[i]);
                }


                if (!angular.isUndefined(data[0].driver[i].start_off_duty)) {
                    if (data[0].driver[i].start_off_duty == true) {
                        //  alert('On Duty');
                        myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                        bounds.extend(myLatLng);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<img src="app/img/lineup.png" style="width:50%"></i>',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        // var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag3 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag3 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);



                        // console.log('count ' + (markersNear.length + 1));
                        attachSecretMessageOnDuty(marker, data[0].driver[i]);
                    }
                }


                if (!angular.isUndefined(data[0].driver[i].start_off_duty)) {
                    if (data[0].driver[i].start_off_duty == false && data[0].driver[i].status == 'Line Up' && data[0].driver[i].driver_id != null) {
                        //alert('Line-Up Driver');
                        myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                        bounds.extend(myLatLng);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<i class="fa fa-male fa-2x" style="color:red"></i>',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        // var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag2 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag2 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);
                        attachSecretMessageLineUpDriver(marker, data[0].driver[i]);
                    }
                }

                if (!angular.isUndefined(data[0].driver[i].start_off_duty)) {
                    if (data[0].driver[i].start_off_duty == false && data[0].driver[i].status == 'Done' && data[0].driver[i].driver_id != null) {
                        //alert('Done');
                        myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                        bounds.extend(myLatLng);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<i class="fa fa-male fa-2x" style="color:yellow"></i>',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        //var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag2 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag2 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);



                        //console.log('count ' + (markersNear.length + 1));
                        attachSecretMessageLineUpDriver(marker, data[0].driver[i]);
                    }
                }
                if (!angular.isUndefined(data[0].driver[i].start_off_duty)) {
                    if (data[0].driver[i].start_off_duty == false && data[0].driver[i].status == 'Cancelled' && data[0].driver[i].driver_id != null) {
                        //alert('Done');
                        myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<i class="fa fa-male fa-2x" style="color:white"></i>',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        attachSecretMessageLineUpDriver(marker, data[0].driver[i]);
                    }
                }

                if (!angular.isUndefined(data[0].driver[i].start_off_duty)) {
                    if (data[0].driver[i].status == 'Paid') {
                        //alert('Free Driver');
                        myLatLng = new google.maps.LatLng(data[0].driver[i].address_lat, data[0].driver[i].address_long);
                        bounds.extend(myLatLng);
                        var label3;
                        if (data[0].driver[i].is_luxury == 'Manual') {
                            label3 = '<i class="fa fa-male fa-2x" style="color:#27c24c"></i>';
                        } else if (data[0].driver[i].is_luxury == 'Luxury') {
                            label3 = '<i class="fa fa-male fa-2x" style="color:#f532e5"></i>';
                        } else {
                            label3 = '<i class="fa fa-male fa-2x" style="color:#5d9cec"></i>';
                        }
                        marker = new MarkerWithLabel({
                            position: myLatLng,

                            icon: ' ',
                            map: map,
                            labelContent: label3,
                            labelAnchor: new google.maps.Point(10, 30),
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        //var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag1 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag1 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);



                        //console.log('count ' + (markersNear.length + 1));

                        attachSecretMessageDriver(marker, data[0].driver[i]);
                    }
                }

                //console.log('Object is: ' + JSON.stringify(data[0].driver[i]) + 'marker is' + marker + '' + i);

                marker.setMap(map);
                markerArray.push(marker);
            }

            for (i = 0; i < data[0].booking.length; i++) {

                if (!angular.isUndefined(data[0].booking[i].start_off_duty)) {
                    if (data[0].booking[i].status == 'New Booking' && data[0].booking[i].start_off_duty == false) {
                        //alert('New Booking');
                        myLatLng = new google.maps.LatLng(data[0].booking[i].from_lat, data[0].booking[i].from_long);
                        bounds.extend(myLatLng);
                        var label2;
                        if (data[0].booking[i].car_type == 'M') {
                            label2 = '<i class="fa fa-car fa-2x" style="color:#27c24c"></i>';
                        } else if (data[0].booking[i].car_type == 'L') {
                            label2 = '<i class="fa fa-car fa-2x" style="color:#f532e5"></i>';
                        } else {
                            label2 = '<i class="fa fa-car fa-2x" style="color:#5d9cec"></i>';
                        }
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: label2,
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        //var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);



                        //console.log('count ' + (markersNear.length + 1));
                        attachSecretMessageNew(marker, data[0].booking[i]);
                    }
                }
                if (!angular.isUndefined(data[0].booking[i].start_off_duty)) {
                    if (data[0].booking[i].status == 'Line Up' && data[0].booking[i].start_off_duty == false) {
                        // alert('Line Up Booking');
                        myLatLng = new google.maps.LatLng(data[0].booking[i].from_lat, data[0].booking[i].from_long);
                        bounds.extend(myLatLng);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<i class="fa fa-car fa-2x" style="color:red;">',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        //var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag4 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag4 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);
                        attachSecretMessageLine(marker, data[0].booking[i]);
                    }
                }
                if (!angular.isUndefined(data[0].booking[i].start_off_duty)) {
                    if (data[0].booking[i].start_off_duty == false && data[0].booking[i].status == 'Done' && data[0].booking[i].driver_id != null) {
                        //alert('Done');
                        myLatLng = new google.maps.LatLng(data[0].booking[i].from_lat, data[0].booking[i].from_long);
                        bounds.extend(myLatLng);
                        marker = new MarkerWithLabel({
                            position: myLatLng,
                            icon: ' ',
                            map: map,
                            labelContent: '<i class="fa fa-car fa-2x" style="color:yellow"></i>',
                            labelAnchor: new google.maps.Point(10, 30), //icon-users
                            labelClass: "labels" // the CSS class for the label
                        });
                        oms.addMarker(marker);
                        //var markersNear = oms.markersNearMarker(marker, false);
                        /*marker.setLabel("" + (markersNear.length + 1));
                        marker.setOptions({
                          zIndex: markersNear.length
                        });  */
                        $scope.flag5 = 0;
                        oms.addListener('click', function(marker) {
                            $scope.flag5 = 1;
                            //iw.setContent(marker.desc);
                            //iw.open(map, marker);
                        });
                        oms.addListener('spiderfy', function(markers) {

                            //iw.close();
                        });
                        oms.addMarker(marker);
                        attachSecretMessageDone(marker, data[0].booking[i]);
                    }
                }
                marker.setMap(map);
                markerArray.push(marker);
            }
            //map.fitBounds(bounds);

            // for debugging/exploratory use in console
            window.map = map;
            window.oms = oms;
            //alert('Marker Array size is ' + markerArray.length);

        }).error(function(error) {
            console.log('Error:' + JSON.stringify(error));
            if (error == null) {
                window.alert('Oops! You are disconnected from server.');
                $state.go('page.login');
            }
        });
    };




    function attachSecretMessageDriver(marker, data) {

        marker.addListener('click', function() {
            if ($scope.flag1 === 1) {
                $scope.monitorDriver(data);
                $scope.flag1 = 0;
            }
        });
    }

    function attachSecretMessageLine(marker, data) {

        marker.addListener('click', function() {
            if ($scope.flag4 === 1) {
                $scope.monitorLineUp(data);
                $scope.flag4 = 0;
            }

        });
    }

    function attachSecretMessageNew(marker, data) {
        marker.addListener('click', function() {
            if ($scope.flag === 1) {
                $scope.moniterPopup(data);
                $scope.flag = 0;
            }
        });
    }

    function attachSecretMessageOnDuty(marker, data) {
        marker.addListener('click', function() {
            if ($scope.flag3 === 1) {
                $scope.monitorOnDuty(data);
                $scope.flag3 = 0;
            }

        });
    }

    function attachSecretMessageLineUpDriver(marker, data) {
        marker.addListener('click', function() {
            if ($scope.flag2 === 1) {
                $scope.monitorLineUpDriver(data);
                $scope.flag2 = 0;
            }

        });
    }

    function attachSecretMessageDone(marker, data) {
        marker.addListener('click', function() {
            if ($scope.flag5 === 1) {
                $scope.monitorDone(data);
                $scope.flag5 = 0;
            }

        });
    }

    $scope.moniterPopup = function(data) {
        console.log('new booking popup called.' + JSON.stringify(data));
        $rootScope.newBookingData = data;

        var modalInstance = $modal.open({
            templateUrl: '/newBookingPopup.html',
            controller: newBookingController,
            windowClass: 'app-modal-window'
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });



    };


    $scope.monitorLineUp = function(data) {
        console.log('monitor popup called.' + JSON.stringify(data));
        $rootScope.lineUpBookingData = data;
        var modalInstance = $modal.open({
            templateUrl: '/lineUpBookingPopup.html',
            controller: lineUpController,
            windowClass: 'app-modal-window'
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    $scope.monitorDriver = function(data) {
        console.log('monitor driver called.' + JSON.stringify(data));

        $rootScope.driverData = data;

        var modalInstance = $modal.open({
            templateUrl: '/moniterDriver.html',
            controller: ModalDriverCtrl
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    $scope.monitorOnDuty = function(data) {
        console.log('monitor On Duty called.' + JSON.stringify(data));

        $rootScope.onDutyData = data;

        var modalInstance = $modal.open({
            templateUrl: '/onDutyBookingPopup.html',
            controller: OnDutyController,
            windowClass: 'app-modal-window'
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };

    $scope.monitorLineUpDriver = function(data) {
        console.log('monitor lineup driver called.' + JSON.stringify(data));

        $rootScope.lineupdriverData = data;

        var modalInstance = $modal.open({
            templateUrl: '/lineupDriverPopup.html',
            controller: LineUpDriverController
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });
    };
    $scope.monitorDone = function(data) {
        console.log('done popup called.' + JSON.stringify(data));
        $rootScope.doneBookingData = data;

        var modalInstance = $modal.open({
            templateUrl: '/doneBookingPopup.html',
            controller: doneBookingController,
            windowClass: 'app-modal-window'
        });


        var state = $('#modal-state');
        modalInstance.result.then(function() {
            state.text('Modal dismissed with OK status');
        }, function() {
            state.text('Modal dismissed with Cancel status');
        });



    };


    $rootScope.fetchCancelReason = function() {
        console.log('I am in cancel Booking');
        CancellationReasons.find({},
            function(response) {
                console.log('Cancelation reasion : ' + JSON.stringify(response));

                $rootScope.cancelationReasons = response;
                console.log('cancellation id:' + JSON.stringify($rootScope.cancelationReasons[0].id));
            },
            function(error) {
                console.log('Error : ' + JSON.stringify(error));

            });
    };


    var lineUpController = function($scope, $rootScope, $modalInstance, $state) {

        $scope.searchDriver = false;
        $scope.allocateDriver = true;

        $scope.monitorStartDutyDate = function() {

            console.log('startduty popup called');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/StartDutyDatePopup.html',
                controller: lineUpController
            });
        };


        $scope.startDuty = function(booking) {
            // var url = 'http://192.168.0.109:3000';
            var url = 'http://52.32.39.44:3000';
            /*var url = 'http://103.38.8.39:3000';*/
            $scope.isDisabledButton = true;

            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            console.log('reportingDate :' + JSON.stringify(booking.bookingReportingDate));
            console.log('booking:' + JSON.stringify(booking));
            $rootScope.loader = 0;
            var currentDate = new Date();
            var count = 0;
            var startDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var startDate1 = new Date(startDate);
            var reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';

            var h = addZero(currentDate.getHours());
            var m = addZero(currentDate.getMinutes());
            var s = addZero(currentDate.getSeconds());
            var currentTime = h + ':' + m + ':' + s;
            var currentDate1 = moment(currentDate).format('YYYY-MM-DD');
            console.log('reporting time***' + reportingTime);
            console.log('current time***' + currentTime);
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
                $rootScope.loader = 0;
                $scope.count = 0;

                var rptTime = booking.hours + ':' + booking.minutes + ':' + '00';
                $rootScope.currentBookingstart = booking;
                console.log('i am in star duty mudule');
                Bookings.find({

                    filter: {
                        where: {
                            id: $rootScope.currentBookingstart.bookingId,
                            driverId: $rootScope.currentBookingstart.oldDrvId,
                            status: 'Line Up'
                        },
                        include: {
                            relation: 'invoices'

                        }
                    }
                }, function(response) {
                    console.log('start duty fetch bookings: ' + JSON.stringify(response));
                    console.log('Booking Id :' + JSON.stringify(response[0].id));
                    console.log('invoice type:' + JSON.stringify(booking.invoiceType));
                    console.log('User id :' + JSON.stringify($rootScope.userId));
                    Invoices.upsert({
                        id: response[0].invoices[0].id,
                        reportingDate: booking.bookingReportingDate,
                        reportingTime: rptTime,
                        invoiceType: 'a'
                    }, function(s) {
                        console.log('invoice A:' + JSON.stringify(s));
                        $rootScope.refreshMap();
                    }, function(e) {
                        console.log('error:' + JSON.stringify(e));


                    });

                    response[0].status = 'On Duty';
                    response[0].reportingDate = booking.bookingReportingDate;
                    response[0].reportingTime = rptTime;
                    response[0].startOffDuty = true;
                    response[0].updatedDate = new Date();
                    response[0].updatedBy = $rootScope.userId;
                    response[0].$save();
                    $modalInstance.dismiss('cancel');
                    $rootScope.refreshMap();
                    $rootScope.offDutyFlag = true;
                    $rootScope.startDutyFlag = false;
                    var obj = {
                        "bookingId": $rootScope.currentBookingstart.bookingId,
                        "requestFrom": "ADMIN_START",
                        "offDutyDate": null,
                        "offDutyTime": null
                    };
                    $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                    success(function(result) {

                        //$cordovaDialogs.alert('lat long change');
                        console.log('Updated invoices successfully' + JSON.stringify(result));
                    }).
                    error(function(error) {
                        // $cordovaDialogs.alert('Error......');
                        console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                    });

                }, function(error) {
                    console.log('fail' + JSON.stringify(error));
                    if (error.status == 0) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                });
            }

        };


        $scope.lineUpmobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.newDrvId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.newCellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
                $rootScope.newDriverSMS = $scope.search.mobileNumber;

            }
        };

        $rootScope.allocateNewDrv = function() {
            $rootScope.loader = 1;
            Bookings.acceptDuty({

                driverId: $scope.newDrvId,
                bookingId: $rootScope.allocateDriver.bookingId,
                oldDriverId: $rootScope.allocateDriver.oldDrvId

            }, function(success) {
                console.log('driver report' + JSON.stringify(success));

                if (success[0].accept_duty == 'Already Allocated to other duty on the same day') {
                    $.notify('Driver already allocated ', {
                        status: 'danger'
                    });

                } else {
                    $.notify('Driver ID: ' + $scope.newDrvId + ' has been allocated to booking ID: ' + $rootScope.allocateDriver.bookingId + ' successfully.', {
                        status: 'success'
                    });

                    driverReallocateSMS();

                }
                $rootScope.refreshMap();
                $rootScope.loader = 0;

            }, function(error) {
                console.log('error in accepting duty');
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });

            $modalInstance.dismiss('cancel');

        }

        function driverReallocateSMS() {
            var rptDate = moment($rootScope.allocateDriver.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.allocateDriver.hours + ':' + $rootScope.allocateDriver.minutes + ':' + '00';
            var msg = 'Hi ' + $rootScope.allocateDriver.driverFirstName + ',%0a Duty details assigned to you, Booking Id: ' + $rootScope.allocateDriver.bookingId + ', reporting date ' + rptDate + ' time ' + reportingTime + ' has been cancelled. Please contact customer desk for details.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.allocateDriver.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            var newDriverSMS = $rootScope.newDriverSMS;
            customerSMS(newDriverSMS);
        };

        function customerSMS(newDriverSMS) {
            var rptDate = moment($rootScope.allocateDriver.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + $rootScope.allocateDriver.bookingFirstName + ',%0a Driver Name: ' + newDriverSMS.originalObject.driverName + ' (Mobile No.' + newDriverSMS.originalObject.mobileNumber + ')' + ' has been allocated to you for the Booking Id: ' + $rootScope.allocateDriver.bookingId + ', booking date ' + rptDate + '. For queries, please reach us on 020-69400400 or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.allocateDriver.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            newdriverSMSFunction(newDriverSMS);
        };

        function newdriverSMSFunction(newDriverSMS) {
            var relTime = $rootScope.allocateDriver.tohours + ':' + $rootScope.allocateDriver.tominutes + ':' + '00';
            var rptTime = $rootScope.allocateDriver.hours + ':' + $rootScope.allocateDriver.minutes + ':' + '00';
            if ($rootScope.allocateDriver.landmark === null) {
                var landmark = '';
            } else {
                var landmark = $rootScope.allocateDriver.landmark + ', ';
            }

            if ($rootScope.allocateDriver.dutyType !== 'Outstation') {
                var relHour = ' Releiving Hours:' + $rootScope.allocateDriver.totalDuration;
            } else {
                var relDate = moment($rootScope.allocateDriver.bookingToDate).format('DD-MM-YYYY');
                var relHour = ' Releiving date and Time:' + relDate + ' ' + relTime;
            }
            var picadd = landmark + $rootScope.allocateDriver.bookingFrmLocation;
            var rptDate = moment($rootScope.allocateDriver.bookingReportingDate).format('DD-MM-YYYY')
            var reportingTime = $rootScope.allocateDriver.hours + ':' + $rootScope.allocateDriver.minutes + ':' + '00';
            var msg = 'Hi ' + newDriverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.allocateDriver.bookingId + ', Duty Type: ' + $rootScope.allocateDriver.dutyType + ', Trip: ' + $rootScope.allocateDriver.journeyType + ', Car Type: ' + $rootScope.allocateDriver.carType + ', Reporting Date And Time: ' + rptDate + ' ' + rptTime + relHour + ', Pick up Address: ' + picadd + ', Drop Address: ' + $rootScope.allocateDriver.bookingToLocation + ', Customer Name: ' + $rootScope.allocateDriver.bookingFirstName + ', Mobile No: ' + $rootScope.allocateDriver.bookingCellNumber;
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + newDriverSMS.originalObject.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        };

        $scope.deallocateDriver = function(){
            $rootScope.loader = 1;
            Bookings.driverCancelDuty({
                driverId: $rootScope.allocateDriver.oldDrvId,
                bookingId: $rootScope.allocateDriver.bookingId
            },function(SuccessData){
                console.log('driver deallocation success' + JSON.stringify(SuccessData));
                 $.notify('Driver removed successfully ', {
                        status: 'success'
                    });
                    driverDeallocateSMS4();
                  $modalInstance.dismiss('cancel');
                   $rootScope.refreshMap();
                    $rootScope.loader = 0;
            },function(error){
                console.log('driver deallocation error' + JSON.stringify(error));
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;
            });
        }

        function driverDeallocateSMS4() {
            var rptDate = moment($rootScope.allocateDriver.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = $rootScope.allocateDriver.hours + ':' + $rootScope.allocateDriver.minutes + ':' + '00';
            var msg = 'Hi ' + $rootScope.allocateDriver.driverFirstName + ',%0a Duty details assigned to you, Booking Id: ' + $rootScope.allocateDriver.bookingId + ', reporting date ' + rptDate + ' time ' + reportingTime + ' has been cancelled. Please contact customer desk for details.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + $rootScope.allocateDriver.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            
        };


        $scope.getLineUpDriverMobile = function() {
            $rootScope.loader = 1;

            Bookings.getDriverList({
                bookingId: $rootScope.allocateDriver.bookingId
            }, function(driverData) {
                console.log('driver Data' + JSON.stringify(driverData));
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
                $rootScope.loader = 0;
                $modalInstance.dismiss('cancel');

            });


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

        $scope.getLineUpData = function() {
            $rootScope.loader = 1;
            console.log('called get lineup booking ');
            if (angular.isDefined($rootScope.lineUpBookingData.id) && $rootScope.lineUpBookingData.id !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.lineUpBookingData.id
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


                        }]
                    }
                }, function(bookingData) {
                    $scope.lineupFare = bookingData;
                    console.log('bookingData ' + JSON.stringify(bookingData));
                    if (angular.isDefined(bookingData) && bookingData !== null) {
                        var cityName;
                        var carType;
                        var dutyType;
                        var journeyType;
                        var releavingDate;
                        var releavingTime;

                        if (angular.isDefined(bookingData.outstationBookings) && bookingData.outstationBookings.length > 0) {
                            cityName = bookingData.outstationBookings[0].cityName;
                            $rootScope.releavingTimeAtOffDuty = bookingData.outstationBookings[0].releavingTime;
                        }

                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;

                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = parseInt(arr[1]);
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


                        var duration;
                        var grossAmt;
                        var netAmt;
                        var invoiceType;
                        if (!angular.isUndefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            if (!angular.isUndefined(bookingData.invoices[0].totalTravelTime) || bookingData.invoices[0].totalTravelTime != null || bookingData.invoices[0].totalTravelTime != '') {
                                duration = bookingData.invoices[0].totalTravelTime / 60;
                            }
                            if (!angular.isUndefined(bookingData.invoices[0].grossAmount) || bookingData.invoices[0].grossAmount != null || bookingData.invoices[0].grossAmount != '') {
                                grossAmt = bookingData.invoices[0].grossAmount;
                            }
                            if (!angular.isUndefined(bookingData.invoices[0].netAmount) || bookingData.invoices[0].netAmount != null || bookingData.invoices[0].netAmount != '') {
                                netAmt = bookingData.invoices[0].netAmount;
                            }
                            if (!angular.isUndefined(bookingData.invoices[0].invoiceType) || bookingData.invoices[0].invoiceType != null || bookingData.invoices[0].invoiceType != '') {
                                invoiceType = bookingData.invoices[0].invoiceType;
                            }

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
                                    returnFare = ((bookingData.outstationBookings[0].returnTravelTime) * 35 * 1.75).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime) * 35).toFixed(2) + ' KM ' + '* 1.75 Rs.) = ';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
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

                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);
                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }
                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;
                                console.log('BookedBy' + JSON.stringify($scope.bookedBy));
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
                                    reportingDate: bookingData.reportingDate,
                                    reportingTime: reportingTime,
                                    releivingDate: releavingDate,
                                    releivingTime: releavingTime,
                                    bookingReportingTime: bookingData.reportingTime,
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
                                    totalDuration: duration,
                                    oldDrvId: bookingData.driverDetails.id,
                                    driverFirstName: bookingData.driverDetails.conUsers.firstName,
                                    driverMiddleName: bookingData.driverDetails.conUsers.middleName,
                                    driverLastName: bookingData.driverDetails.conUsers.lastName,
                                    driverContact: bookingData.driverDetails.conUsers.mobileNumber,
                                    driverAddress: bookingData.driverDetails.conUsers.address,
                                    paymentMethod: paymentMode,
                                    invoiceType: invoiceType,
                                    carTypeValue: carTypeText,
                                    returnFareAmount: returnFareText + returnFare,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark

                                };
                                $rootScope.cancelDetails = $scope.booking;
                                $rootScope.allocateDriver = $scope.booking;
                                console.log('booking details' + JSON.stringify($rootScope.allocateDriver));
                                $scope.getLineUpDriverMobile();
                                $rootScope.loader = 0;
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

        $scope.CancelBookingPopUp = function() {

            console.log('cancelBooking popup');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: lineUpController
            });

        }




        $scope.submitCancellationReason = function(cancelationReason, comment) {
            $rootScope.loader = 1;
            ConUsers.findById({
                    id: $rootScope.userId
                },
                function(ConUsers) {
                    console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers.firstName));
                    console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers.lastName));
                    $rootScope.cancelByName = ConUsers.firstName + ' ' + ConUsers.lastName;
                    console.log('Admin Name is:' + JSON.stringify($rootScope.cancelByName));

                    var cancelName = ' Booking cancelled by ' + $rootScope.cancelByName + ' on ';
                    console.log('i am in cancel booking ');

                    console.log('booking id:' + JSON.stringify($rootScope.cancelDetails.bookingId));
                    console.log('Cancelation Id: ' + JSON.stringify(cancelationReason.id));
                    console.log('Cancelation Reason: ' + JSON.stringify($rootScope.cancelationReasons.comment));

                    Bookings.cancelBooking({
                            bookingId: $rootScope.cancelDetails.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.cancelationReasons.comment + ' ' + cancelName

                        },

                        function(response) {
                            console.log('booking for cancellation:' + JSON.stringify(response));

                            if (response[0].cancel_booking === 'Cancelled') {

                                var cancelData = $rootScope.cancelDetails;
                                cancelCustomerSMS(cancelData);
                                $.notify('This duty has been cancelled successfully.', {
                                    status: 'success'
                                });


                            } else if (response[0].cancel_booking === 'On Duty') {
                                $.notify('This duty has already started', {
                                    status: 'danger'
                                });
                            } else if (response[0].cancel_booking === 'Done') {
                                $.notify('This duty has already done ', {
                                    status: 'danger'
                                });
                            } else if (response[0].cancel_booking === 'Paid') {
                                $.notify('This duty has already paid', {
                                    status: 'danger'
                                });
                            } else {

                            }
                            $modalInstance.dismiss('cancel');
                            $rootScope.refreshMap();
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


        function cancelCustomerSMS(cancelData) {
            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking details: Booking Id: ' + $rootScope.allocateDriver.bookingId + ', reporting date ' + rptDate + ' has been cancelled, For queries kindly contact 020-69400400 or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelData.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            cancelDriverSMS(cancelData);
        };

        function cancelDriverSMS(cancelData) {
            var rptDate = moment(cancelData.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your Duty dated ' + rptDate + ', Booking Id: ' + $rootScope.allocateDriver.bookingId + ', has been cancelled, For queries kindly contact 020-69400400 or info@indian-drivers.com.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelData.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        };


        $scope.checkFare = function() {
            $modalInstance.dismiss('cancel');
            $state.go('app.fareCalculator');
        };

        $scope.allocate = function() {

            $scope.searchDriver = true;
            $scope.allocateDriver = false;

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
        $scope.count = 0;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

    };

    var OnDutyController = function($scope, $rootScope, $modalInstance, $state) {

        $scope.searchDriver = false;
        $scope.allocateDriver = true;

        $scope.monitorOffDutyDate = function() {

            console.log('offDuty popup');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/OffDutyDatePopup.html',
                controller: OnDutyController
            });
        };


        $scope.offDuty = function(booking) {
            $rootScope.loader = 1;
            console.log('off duty booking****' + JSON.stringify(booking));
            // var url = 'http://192.168.0.109:3000';
            var url = 'http://52.32.39.44:3000';
            /*var url = 'http://103.38.8.39:3000';*/
            console.log("off duty booking****" + JSON.stringify(booking));
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');

            var rptDate = moment($rootScope.onDutyDetails.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = $rootScope.onDutyDetails.hours + ':' + $rootScope.onDutyDetails.minutes + ':' + '00';
            var relTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
            var relTime1 = booking.tohours + ':' + booking.tominutes + ':' + '00';
            console.log('rel date:' + JSON.stringify(booking.bookingToDate));

            console.log('rpt date:' + JSON.stringify($rootScope.onDutyDetails.bookingReportingDate));
            var date1 = new Date(rptDate);
            var date2 = new Date(relDate);



            var count = 0;
            if (angular.isUndefined($rootScope.onDutyDetails.dutyType) || $rootScope.onDutyDetails.dutyType === '' || $rootScope.onDutyDetails.dutyType === null) {} else {
                if ($rootScope.onDutyDetails.dutyType === 'Outstation') {
                    if (booking.bookingToDate < $rootScope.onDutyDetails.bookingReportingDate) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        booking.bookingToDate1 = null;
                    }
                }
            }
            if (angular.isUndefined($rootScope.onDutyDetails.dutyType) || $rootScope.onDutyDetails.dutyType === '' || $rootScope.onDutyDetails.dutyType === null) {} else {
                if ($rootScope.onDutyDetails.dutyType !== 'Outstation') {
                    var relDate1 = moment(booking.toDate).format('YYYY-MM-DD');
                    var date3 = new Date(booking.toDate);

                    if (date3 < date1) {
                        document.getElementById("bookingToDatelocal").style.borderColor = "red";
                        document.getElementById("bookingToDate1local").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        booking.bookingToDate1local = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else if (date3.getTime() == date1.getTime()) {
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
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "red";
                            document.getElementById("bookingReleivingTime1local").innerHTML = 'Releiving Time should be greater than Reporting Time';
                            booking.bookingReleivingTime1local = 'Releiving Date should be greater than Reporting Time';
                            count++;

                        } else {
                            document.getElementById("bookingReleivingTimelocal").style.borderColor = "#dde6e9";
                            document.getElementById("bookingReleivingTime1local").innerHTML = '';
                            booking.bookingReleivingTime1local = null;

                        }
                    } else {
                        document.getElementById("bookingToDatelocal").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1local").innerHTML = '';
                        booking.bookingToDate1local = null;
                    }



                }
            }
            if (angular.isUndefined(booking.bookingToLocation) || booking.bookingToLocation === '' || booking.bookingToLocation === null) {
                document.getElementById("bookingToLocation").style.borderColor = "red";
                document.getElementById("bookingToLocation1").innerHTML = '*required';
                booking.bookingToLocation1 = 'This value is required';
                count++;
            } else {
                document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                document.getElementById("bookingToLocation1").innerHTML = '';
                booking.bookingToLocation1 = null;
            }


            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = true;
                $rootScope.loader = 0;
                return false;
            } else {

                $scope.count = 0;
                $scope.isDisabled = true;
                var travelTimeRelMin = ((parseInt(booking.tohour1) * 60) + parseInt(booking.tomin1));
                var travelTimeRepMin = ((parseInt($rootScope.onDutyDetails.hours) * 60) + parseInt($rootScope.onDutyDetails.minutes));
                $scope.travelTime = (travelTimeRelMin - travelTimeRepMin);

                //$scope.travelTime = (parseInt(booking.tohour1) - parseInt(booking.hours)) * 60;
                if (angular.isUndefined($rootScope.onDutyDetails.dutyType) || $rootScope.onDutyDetails.dutyType === '' || $rootScope.onDutyDetails.dutyType === null) {} else {
                    if ($rootScope.onDutyDetails.dutyType !== 'Outstation') {
                        var offDutyDate = booking.toDate;
                        console.log('toDate : ' + JSON.stringify(booking.toDate));
                        var offDutyTime = booking.tohour1 + ':' + booking.tomin1 + ':' + '00';
                    } else {
                        var offDutyTime = booking.tohours + ':' + booking.tominutes + ':' + '00';
                        var offDutyDate = booking.bookingToDate;
                    }
                }

                console.log('time ' + JSON.stringify(relTime));

                var obj = {
                    "bookingId": $rootScope.onDutyDetails.bookingId,
                    "requestFrom": "ADMIN_OFF",
                    "offDutyDate": offDutyDate,
                    "offDutyTime": offDutyTime
                };


                var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + booking.bookingToLocation + '';
                $http.post(mapUrl).success(function(latLongResult) {
                    console.log('drop latLong result' + JSON.stringify(latLongResult));

                    var dropLat1 = latLongResult.results[0].geometry.location.lat;
                    var dropLong1 = latLongResult.results[0].geometry.location.lng;
                    console.log(dropLat1);
                    console.log(dropLong1);

                    /*Bookings.find({

                                filter: {
                                    where: {
                                        id: $rootScope.onDutyDetails.bookingId,
                                        driverId: $rootScope.onDutyDetails.oldDrvId,
                                        status: 'On Duty'

                                    },

                                    include: [{
                                        relation: 'outstationBookings'
                                    }, {
                                        relation: 'invoices'
                                    }]
                                }
                            }, function(response) {
                                console.log('data:' + JSON.stringify(response));

                                if (angular.isDefined(response[0].isOutstation)) {
                                    if (response[0].isOutstation == false) {

                                        Invoices.upsert({
                                            id: response[0].invoices[0].id,
                                            totalTravelTime: $scope.travelTime,
                                            releavingDate: booking.toDate,
                                            releavingTime: relTime,
                                            dropLocation: booking.bookingToLocation,
                                            dropLat: dropLat1,
                                            dropLong: dropLong1,
                                            updatedDate: new Date(),
                                            updatedBy: $rootScope.userId
                                        }, function(s1) {
                                            console.log('updated invoice time:' + JSON.stringify(s1));
                                        }, function(e1) {
                                            console.log('error updating invoice:' + JSON.stringify(e1));
                                            $rootScope.loader = 0;
                                        });



                                    } else {
                                        OutstationBookings.upsert({
                                            id: response[0].outstationBookings[0].id,
                                            releavingDate: booking.bookingToDate,
                                            releavingTime: relTime1,
                                            updatedDate: new Date(),
                                            updatedBy: $rootScope.userId
                                        }, function(s2) {
                                            console.log('outstation updated:' + JSON.stringify(s2));
                                            Invoices.upsert({
                                                id: response[0].invoices[0].id,
                                                releavingDate: booking.bookingToDate,
                                                releavingTime: relTime1,
                                                dropLocation: booking.bookingToLocation,
                                                dropLat: dropLat1,
                                                dropLong: dropLong1,
                                                updatedDate: new Date(),
                                                updatedBy: $rootScope.userId
                                            }, function(s1) {
                                                console.log('updated invoice time:' + JSON.stringify(s1));
                                            }, function(e1) {
                                                console.log('error updating invoice:' + JSON.stringify(e1));
                                                $rootScope.loader = 0;
                                            });
                                        }, function(e2) {
                                            console.log('error updating outstation:' + JSON.stringify(e2));

                                            $rootScope.loader = 0;

                                        });

                                    }
                                }

                                console.log('Booking at off duty ' + JSON.stringify(response));
                                //$rootScope.offDutyFlag = true;
                                response[0].updatedBy = $rootScope.userId;
                                response[0].updatedDate = new Date();
                                response[0].startOffDuty = false;
                                response[0].status = 'Done';
                                response[0].dropAddress = booking.bookingToLocation;
                                response[0].dropLat = dropLat1;
                                response[0].dropLong = dropLong1;
                                response[0].$save();
                                BookingInvites.find({
                                        filter: {
                                            where: {
                                                driverId: $rootScope.onDutyDetails.oldDrvId,
                                                bookingId: $rootScope.onDutyDetails.bookingId

                                            }
                                        }
                                    },
                                    function(successblc) {
                                        console.log('success block:' + JSON.stringify(successblc));
                                        successblc[0].status = 'Done';
                                        successblc[0].updatedDate = new Date();
                                        successblc[0].updatedBy = $rootScope.userId;
                                        successblc[0].$save();
                                        $rootScope.offDutyFlag = false;
                                        $rootScope.startDutyFlag = true;
                                        $scope.isDisabled = false;
                                        sendSmsToCustomerAtOff(booking);
                                        sendSmsToDriverAtOff(booking);
                                        $scope.isDisabled = false;
                                        $rootScope.loader = 0;
                                        $modalInstance.dismiss('cancel');
                                        $rootScope.refreshMap();

                                    },
                                    function(errorblc) {
                                        console.log('error block:' + JSON.stringify(errorblc));
                                        if (errorblc.status == 0) {
                                            window.alert('Oops! You are disconnected from server.');
                                            $state.go('page.login');
                                        }
                                        $modalInstance.dismiss('cancel');
                                        $rootScope.loader = 0;

                                    });


                            },
                            function(error) {
                                console.log('fail' + JSON.stringify(error));
                                if (error.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });*/
                    Bookings.offDutyForAdmin({
                        bookingId: $rootScope.onDutyDetails.bookingId,
                        totalTravelTime: $scope.travelTime,
                        releivingDate: offDutyDate,
                        releivingTime: offDutyTime,
                        dropLocation: booking.bookingToLocation,
                        dropLat: dropLat1,
                        dropLong: dropLong1,
                        updatedBy: $rootScope.userId
                    }, function(offDutySuccess) {
                        console.log('offDutySuccess' + JSON.stringify(offDutySuccess));

                        $rootScope.offDutyFlag = false;
                        $rootScope.startDutyFlag = true;
                        $scope.isDisabled = false;
                        sendSmsToCustomerAtOff(booking);
                        sendSmsToDriverAtOff(booking);
                        $scope.isDisabled = false;


                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //$cordovaDialogs.alert('lat long change');
                            console.log('Updated Geolocation successfully' + JSON.stringify(result));

                        }).
                        error(function(error) {

                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));

                        });

                        $modalInstance.dismiss('cancel');
                        $rootScope.refreshMap();
                        $rootScope.loader = 0;
                    }, function(offDutyError) {
                        console.log('offDutyError' + JSON.stringify(offDutyError));

                        $modalInstance.dismiss('cancel');
                        $rootScope.loader = 0;
                    });


                }).error(function(error) {
                    console.log('error' + JSON.stringify(error));
                    if (error == null) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });

            }
        };





        function sendSmsToCustomerAtOff(booking) {
            if (angular.isUndefined($rootScope.onDutyDetails.dutyType) || $rootScope.onDutyDetails.dutyType === '' || $rootScope.onDutyDetails.dutyType === null) {} else {
                if ($rootScope.onDutyDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.onDutyDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.onDutyDetails.hours + ':' + $rootScope.onDutyDetails.minutes + ':' + '00';
                    var endDate = moment($scope.booking.toDate).format('DD-MM-YYYY');
                    var relTime = $scope.booking.tohour1 + ':' + $scope.booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.onDutyDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.onDutyDetails.hours + ':' + $rootScope.onDutyDetails.minutes + ':' + '00';
                    var endDate = moment($scope.booking.bookingToDate).format('DD-MM-YYYY');
                    var relTime = $scope.booking.tohours + ':' + $scope.booking.tominutes + ':' + '00';

                }

            }
            var customerName = booking.bookingFirstName;
            var msg = 'Hi ' + customerName + ',%0a Your journey started on: ' + rptDate + ' ' + rptTime + ' and ended at : ' + endDate + ' ' + relTime + ' of Booking Id: ' + $rootScope.onDutyDetails.bookingId + '.  Thanks for your association with Indian-Drivers. For any query or concern, please contact us on 020-69400400 or info@indian-drivers.com';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + booking.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);
            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        }

        function sendSmsToDriverAtOff(booking) {
            if (angular.isUndefined($rootScope.onDutyDetails.dutyType) || $rootScope.onDutyDetails.dutyType === '' || $rootScope.onDutyDetails.dutyType === null) {} else {
                if ($rootScope.onDutyDetails.dutyType !== 'Outstation') {
                    var rptDate = moment($rootScope.onDutyDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.onDutyDetails.hours + ':' + $rootScope.onDutyDetails.minutes + ':' + '00';
                    var endDate = moment($scope.booking.toDate).format('YYYY-MM-DD');
                    var relTime = $scope.booking.tohour1 + ':' + $scope.booking.tomin1 + ':' + '00';
                } else {
                    var rptDate = moment($rootScope.onDutyDetails.bookingReportingDate).format('DD-MM-YYYY');
                    var rptTime = $rootScope.onDutyDetails.hours + ':' + $rootScope.onDutyDetails.minutes + ':' + '00';
                    var endDate = moment($scope.booking.bookingToDate).format('YYYY-MM-DD');
                    var relTime = $scope.booking.tohours + ':' + $scope.booking.tominutes + ':' + '00';

                }
            }
            var driverName = booking.driverFirstName;
            var msg = 'Hi ' + driverName + ',%0a Your journey started on: ' + rptDate + ' ' + rptTime + ' and ended at : ' + endDate + ' ' + relTime + ' of Booking Id: ' + $rootScope.onDutyDetails.bookingId + '.  Thanks for your association with Indian-Drivers. For any query or concern, please contact us on 020-69400400 or info@indian-drivers.com.';
            var data = "";


            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + booking.driverContact;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);
            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        }




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

        $scope.getOnDutyData = function() {
            $rootScope.loader = 1;
            console.log('called get onDuty booking ');
            if (angular.isDefined($rootScope.onDutyData.booking_id) && $rootScope.onDutyData.booking_id !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.onDutyData.booking_id
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


                        }]
                    }
                }, function(bookingData) {
                    $scope.onDutyFare = bookingData;
                    console.log('bookingData ' + JSON.stringify(bookingData));
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
                            $rootScope.releavingTimeAtOffDuty1 = bookingData.outstationBookings[0].releavingTime;
                        }

                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = parseInt(arr[1]);
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

                        var duration;
                        if (!angular.isUndefined(bookingData.invoices)) {
                            if (!angular.isUndefined(bookingData.invoices[0].totalTravelTime)) {
                                duration = bookingData.invoices[0].totalTravelTime / 60;
                            }

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
                                    returnFare = ((bookingData.outstationBookings[0].returnTravelTime) * 35 * 1.75).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime) * 35).toFixed(2) + ' KM ' + '* 1.75 Rs.) = ';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
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

                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);
                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }

                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;
                                console.log('BookedBy' + JSON.stringify($scope.bookedBy));
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
                                    bookingReportingTime: bookingData.reportingTime,
                                    bookingReleivingTime: $rootScope.releavingTimeAtOffDuty1,
                                    releivingTime: releavingTime,
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
                                    estimatedAmt: bookingData.invoices[0].grossAmount,
                                    totalAmt: bookingData.invoices[0].netAmount,
                                    totalDuration: duration,
                                    oldDrvId: bookingData.driverDetails.id,
                                    driverFirstName: bookingData.driverDetails.conUsers.firstName,
                                    driverMiddleName: bookingData.driverDetails.conUsers.middleName,
                                    driverLastName: bookingData.driverDetails.conUsers.lastName,
                                    driverContact: bookingData.driverDetails.conUsers.mobileNumber,
                                    driverAddress: bookingData.driverDetails.conUsers.address,
                                    paymentMethod: paymentMode,
                                    invoiceType: bookingData.invoices[0].invoiceType,
                                    carTypeValue: carTypeText,
                                    returnFareAmount: returnFareText + returnFare,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark

                                };
                                $rootScope.onDutyDetails = $scope.booking;
                                console.log('onDuty booking details *****' + JSON.stringify($scope.booking));
                                $rootScope.loader = 0;
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
        $scope.count = 0;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

    };

    var doneBookingController = function($scope, $rootScope, $modalInstance, $state) {

        $scope.searchDriver = false;
        $scope.allocateDriver = true;


        $scope.savePaymentMethod1 = function() {
            $rootScope.loader = 1;
            Bookings.find({

                filter: {
                    where: {
                        id: $rootScope.doneBookingDetails.bookingId,
                        driverId: $rootScope.doneBookingDetails.oldDrvId,
                        status: 'Done'
                    }
                }
            }, function(suc) {
                console.log('save payment method success: ' + JSON.stringify(suc));

                suc[0].paymentMethod = 'O';
                suc[0].status = 'Paid';
                suc[0].driverPaymentStatus = 'Unsettled';
                suc[0].$save();
                $.notify('Your Payment has been Done successfully.', {
                    status: 'success'
                });
                $modalInstance.dismiss('cancel');
                $rootScope.refreshMap();
                $rootScope.loader = 0;

            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

        }
        $scope.savePaymentMethod2 = function() {
            $rootScope.loader = 1;
            Bookings.find({

                filter: {
                    where: {
                        id: $rootScope.doneBookingDetails.bookingId,
                        driverId: $rootScope.doneBookingDetails.oldDrvId,
                        status: 'Done'
                    }
                }
            }, function(suc) {
                console.log('save payment method success: ' + JSON.stringify(suc));

                suc[0].paymentMethod = 'C';
                suc[0].status = 'Paid';
                suc[0].driverPaymentStatus = 'Unsettled';
                suc[0].$save();
                $.notify('Your Payment has been Done successfully.', {
                    status: 'success'
                });
                $modalInstance.dismiss('cancel');
                $rootScope.refreshMap();
                $rootScope.loader = 0;

            }, function(er) {
                console.log('error in save payment method: ' + JSON.stringify(er));
                if (er.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
                $rootScope.loader = 0;

            });

        }

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

        $scope.getDoneData = function() {
            $rootScope.loader = 1;
            console.log('called get done booking ');
            if (angular.isDefined($rootScope.doneBookingData.id) && $rootScope.doneBookingData.id !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.doneBookingData.id
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


                        }]
                    }
                }, function(bookingData) {
                    $scope.doneFare = bookingData;
                    console.log('bookingData ' + JSON.stringify(bookingData));
                    if (angular.isDefined(bookingData) && bookingData !== null) {
                        var cityName;
                        var carType;
                        var dutyType;
                        var journeyType;
                        var releavingDate;
                        var releavingTime;

                        if (angular.isDefined(bookingData.outstationBookings) && bookingData.outstationBookings.length > 0) {
                            cityName = bookingData.outstationBookings[0].cityName;
                            $rootScope.releavingTimeAtOffDuty1 = bookingData.outstationBookings[0].releavingTime;
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
                        var relDate = moment(releavingDate).format('YYYY-MM-DD');
                        var url = 'http://52.32.39.44:3000';
                        var obj = {
                            "bookingId": bookingData.id,
                            "requestFrom": "ADMIN_OFF",
                            "offDutyDate": relDate,
                            "offDutyTime": releavingTime
                        };


                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //$cordovaDialogs.alert('lat long change');
                            console.log('Updated Geolocation successfully' + JSON.stringify(result));

                        }).
                        error(function(error) {

                            console.log('Error in updating driver geolocation:' + JSON.stringify(error));

                        });


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

                        var duration;
                        if (!angular.isUndefined(bookingData.invoices)) {
                            if (!angular.isUndefined(bookingData.invoices[0].totalTravelTime)) {
                                duration = bookingData.invoices[0].totalTravelTime / 60;
                            }

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
                                    returnFare = ((bookingData.outstationBookings[0].returnTravelTime) * 35 * 1.75).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime) * 35).toFixed(2) + ' KM ' + '* 1.75 Rs.) = ';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
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

                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);
                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }
                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;
                                console.log('BookedBy' + JSON.stringify($scope.bookedBy));
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
                                    reportingDate: bookingData.reportingDate,
                                    releivingDate: releavingDate,
                                    bookingReportingTime: bookingData.reportingTime,
                                    bookingReleivingTime: $rootScope.releavingTimeAtOffDuty1,
                                    releivingTime: releavingTime,
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
                                    outstationAmt: '100',
                                    outstationCity: cityName,
                                    journeyType: journeyType,
                                    estimatedAmt: bookingData.invoices[0].grossAmount,
                                    serviceTax: '200',
                                    totalAmt: bookingData.invoices[0].netAmount,
                                    totalDuration: duration,
                                    oldDrvId: bookingData.driverDetails.id,
                                    driverFirstName: bookingData.driverDetails.conUsers.firstName,
                                    driverMiddleName: bookingData.driverDetails.conUsers.middleName,
                                    driverLastName: bookingData.driverDetails.conUsers.lastName,
                                    driverContact: bookingData.driverDetails.conUsers.mobileNumber,
                                    driverAddress: bookingData.driverDetails.conUsers.address,
                                    paymentMethod: paymentMode,
                                    invoiceType: bookingData.invoices[0].invoiceType,
                                    carTypeValue: carTypeText,
                                    returnFareAmount: returnFareText + returnFare,
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark

                                };
                                $rootScope.doneBookingDetails = $scope.booking;
                                console.log('done booking details' + JSON.stringify($scope.booking));
                                $rootScope.loader = 0;
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

        $scope.updateDateAndTime = function(booking) {
            $rootScope.loader = 1;
            var count = 0;
            console.log('booking details' + JSON.stringify(booking));
            var relDate = moment(booking.bookingToDate).format('YYYY-MM-DD');
            var rptDate = moment(booking.bookingReportingDate).format('YYYY-MM-DD');
            var rptTime = booking.bookingReportingTime;
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
                    var url = 'http://52.32.39.44:3000';
                    var obj = {
                        "bookingId": booking.bookingId,
                        "requestFrom": "ADMIN_OFF",
                        "offDutyDate": booking.bookingToDate,
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
                            console.log('OutstationBookings details' + JSON.stringify(OBSuccess));
                            OBSuccess[0].releavingDate = booking.bookingToDate;
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
                        releavingDate: booking.bookingToDate,
                        releavingTime: booking.tohours + ':' + booking.tominutes + ':' + '00',

                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        console.log('invoice A:' + JSON.stringify(s));
                        $http.post(url + '/updateInvoiceOnStartAndOffDuty', obj).
                        success(function(result) {
                            //$cordovaDialogs.alert('lat long change');
                            console.log('Updated Geolocation successfully' + JSON.stringify(result));
                            $modalInstance.dismiss('cancel');
                            $.notify('Booking updated successfully', {
                                status: 'success'
                            });
                            $rootScope.refreshMap();
                            $rootScope.loader = 0;

                        }).
                        error(function(error) {
                            //$cordovaDialogs.alert('Error......');
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
        $scope.count = 0;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

    };

    var newBookingController = function($scope, $rootScope, $modalInstance) {

        $scope.searchDriver = false;
        $scope.allocateDriver = true;

        $scope.newBookingMobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $rootScope.drvId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.cellNo = $scope.search.mobileNumber.originalObject.mobileNumber;
                $rootScope.driverSMS = $scope.search.mobileNumber;
            }
        };

        $rootScope.allocateDrv = function() {


            Bookings.acceptDuty({

                driverId: $rootScope.drvId,
                bookingId: $rootScope.allocateBook.bookingId,
                oldDriverId: '0'

            }, function(dutyReport) {
                console.log('driver report' + JSON.stringify(dutyReport));

                if ((dutyReport[0].accept_duty == 'Already Allocated to other duty on the same day') || (dutyReport[0].accept_duty == 'Allocation Error')) {
                    $.notify('Driver already allocated ', {
                        status: 'danger'
                    });

                } else {
                    $.notify('Driver ID: ' + $rootScope.drvId + ' has been allocated to booking ID: ' + $rootScope.allocateBook.bookingId + ' successfully.', {
                        status: 'success'
                    });
                    var customerSMS = $rootScope.customerSMSData;
                    var driverSMS = $rootScope.driverSMS;
                    customerSMSFunction(customerSMS, driverSMS);

                }
                $modalInstance.dismiss('cancel');
                $rootScope.refreshMap();
            }, function(error) {
                console.log('error in accepting duty' + JSON.stringify(error));
                if (error.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });


        }

        function customerSMSFunction(customerSMS, driverSMS) {
            var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Hi ' + customerSMS.bookingFirstName + ',%0a Driver Name: ' + driverSMS.originalObject.driverName + ' (Mobile No.' + driverSMS.originalObject.mobileNumber + ')' + ' has been allocated to you for the booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateBook.bookingId + '. For queries, please reach us on 020-69400400 or info@indian-drivers.com.';
            var data = "";
            console.log('cust message' + msg);
            console.log('cust mobileNumber' + customerSMS.bookingCellNumber);
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMS.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;



            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
            driverSMSFunction(customerSMS, driverSMS);
        };

        function driverSMSFunction(customerSMS, driverSMS) {
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
                var relHour = ' Releiving Date And Time :' + relDate + ' ' + relTime;
            }
            var picadd = landmark + ', ' + customerSMS.bookingFrmLocation;
            var rptDate = moment(customerSMS.bookingReportingDate).format('DD-MM-YYYY');
            var reportingTime = customerSMS.hours + ':' + customerSMS.minutes + ':' + '00';
            var msg = 'Hi ' + driverSMS.originalObject.driverName + ',%0a Your allotted duty details: %0a Booking ID: ' + $rootScope.allocateBook.bookingId + ', Duty Type: ' + customerSMS.dutyType + ', Trip: ' + customerSMS.journeyType + ', Car Type: ' + customerSMS.carType + ', Reporting Date And Time: ' + rptDate + ' ' + rptTime + relHour + ', Pick up Address: ' + picadd + ', Drop Address: ' + customerSMS.bookingToLocation + ', Customer Name: ' + customerSMS.bookingFirstName + ', Mobile No: ' + customerSMS.bookingCellNumber;
            var data = "";

            console.log('cust message' + msg);
            console.log('cust mobileNumber' + driverSMS.originalObject.mobileNumber);
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + driverSMS.originalObject.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });
        };


        $scope.getNewBookingDriverMobile = function() {

            $rootScope.loader = 1;

            Bookings.getDriverList({
                bookingId: $rootScope.allocateBook.bookingId
            }, function(driverList) {
                console.log('driver list' + JSON.stringify(driverList));
                $scope.driverMobileList = [];

                for (var i = 0; i < driverList.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';


                    if (!angular.isUndefined(driverList[i].mobile_number) || driverList[i].mobile_number !== '' || driverList[i].mobile_number !== null) {
                        mobNo = driverList[i].mobile_number;
                    }
                    if (!angular.isUndefined(driverList[i].first_name) || driverList[i].first_name !== '' || driverList[i].first_name !== null) {
                        firstName = driverList[i].first_name;
                    }
                    if (!angular.isUndefined(driverList[i].last_name) || driverList[i].last_name !== '' || driverList[i].last_name !== null) {
                        lastName = driverList[i].last_name;
                    }

                    $scope.driverMobileList.push({
                        id: driverList[i].driver_id,
                        mobileNumber: mobNo,
                        driverName: firstName + ' ' + lastName,
                        driverSearchData: firstName + ' ' + lastName + ' - ' + mobNo

                    });
                }


                $rootScope.loader = 0;
            }, function(driverErr) {
                console.log('driver error' + JSON.stringify(driverErr));
                $modalInstance.dismiss('cancel');
                if (driverErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $rootScope.loader = 0;
            });
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
        };
        $scope.allocate = function() {

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

        $scope.getNewBooking = function() {
            console.log('called new booking ');
            if (angular.isDefined($rootScope.newBookingData.id) && $rootScope.newBookingData.id !== null) {
                Bookings.findOne({
                    filter: {
                        where: {
                            id: $rootScope.newBookingData.id
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


                        }]
                    }
                }, function(bookingData) {
                    $scope.bookingData = bookingData;
                    console.log('New Booking Detail Is ' + JSON.stringify(bookingData));
                    if (angular.isDefined(bookingData) && bookingData !== null) {

                        var cityName;
                        var carType;
                        var dutyType;
                        var journeyType;
                        var releavingDate;
                        var releavingTime;
                        var reportingTime;
                        var reportingTime1 = '';
                        var releivingTime = '';
                        var reportingDate = '';
                        var releavingDate = '';
                        var parsedReportingDate = '';
                        var parsedReleivingDate = '';

                        if (!angular.isUndefined(bookingData.invoices) || bookingData.invoices.length > 0) {

                            $scope.reptDate = bookingData.invoices[0].reportingDate;
                            $scope.startDate = new Date($scope.reptDate);
                            var year = $scope.startDate.getFullYear();
                            var month = $scope.startDate.getMonth();
                            var day = $scope.startDate.getDate();
                            if (month < 10) {
                                month = '0' + month;
                            }
                            parsedReportingDate = day + '/' + month + '/' + year;
                            $scope.releiveDate = bookingData.invoices[0].releavingDate;
                            $scope.endDate = new Date($scope.releiveDate);
                            var year1 = $scope.endDate.getFullYear();
                            var month1 = $scope.endDate.getMonth();
                            var day1 = $scope.endDate.getDate();
                            if (month1 < 10) {
                                month1 = '0' + month1;
                            }
                            parsedReleivingDate = day1 + '/' + month1 + '/' + year1;

                            if (!angular.isUndefined(bookingData.invoices[0].reportingTime) || bookingData.invoices[0].reportingTime != null || bookingData.invoices[0].reportingTime != '') {
                                reportingTime1 = bookingData.invoices[0].reportingTime;
                            }

                            if (!angular.isUndefined(bookingData.invoices[0].releavingTime) || bookingData.invoices[0].releavingTime != null || bookingData.invoices[0].releavingTime != '') {
                                releivingTime = bookingData.invoices[0].releavingTime;
                            }

                        }
                        var reportingDateAndTime = '';
                        var releivingDateAndTime = '';
                        reportingDateAndTime = parsedReportingDate + ' ' + reportingTime1;
                        releivingDateAndTime = parsedReleivingDate + ' ' + releivingTime;
                        var now = moment(reportingDateAndTime);
                        var then = moment(releivingDateAndTime);
                        var ms = moment(reportingDateAndTime, "DD/MM/YYYY HH:mm:ss").diff(moment(releivingDateAndTime, "DD/MM/YYYY HH:mm:ss"));
                        var d = moment.duration(ms);
                        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                        console.log('difference****' + s);

                        var ab = s.replace('-', '');

                        console.log('ab****' + ab);
                        var estimatedDuration = ab.split(':');
                        var durationHour = estimatedDuration[0];
                        var durationMin = estimatedDuration[1];
                        var durationSec = estimatedDuration[2];
                        if (durationHour < 10 && durationHour != 00) {
                            durationHour = '0' + durationHour;
                        }
                        if (durationMin < 10 && durationMin != 00) {
                            durationMin = '0' + durationMin;
                        }
                        console.log('durationHour****' + durationHour);
                        console.log('durationMin****' + durationMin);

                        reportingTime = bookingData.reportingTime;
                        var arr1 = reportingTime.split(':');
                        var fromhour = parseInt(arr1[0]);
                        var fromhour1 = parseInt(arr1[0]);
                        var frommin = arr1[1];
                        var fromsec = parseInt(arr1[2]);
                        var fromFormat;
                        if (fromhour <= 12) {
                            fromFormat = "AM";
                        } else {
                            fromFormat = "PM";
                        }

                        if (fromhour1 < 10) {
                            fromhour1 = '0' + fromhour1;
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

                        if (angular.isDefined(bookingData.invoices) && bookingData.invoices.length > 0) {
                            releavingDate = bookingData.invoices[0].releavingDate;
                            releavingTime = bookingData.invoices[0].releavingTime;
                            var arr = releavingTime.split(':');
                            var tohour = parseInt(arr[0]);
                            var tomin = parseInt(arr[1]);
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
                        var duration;
                        if (!angular.isUndefined(bookingData.invoices)) {
                            if (!angular.isUndefined(bookingData.invoices[0].totalTravelTime)) {
                                duration = bookingData.invoices[0].totalTravelTime / 60;
                            }

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
                                    returnFare = ((bookingData.outstationBookings[0].returnTravelTime) * 35 * 1.75).toFixed(2);
                                    returnFareText = ' (' + ((bookingData.outstationBookings[0].returnTravelTime) * 35).toFixed(2) + ' KM ' + '* 1.75 Rs.) = ';
                                }
                            }
                        } else if (bookingData.isOutstation == false && bookingData.isRoundTrip == false) {
                            returnFare = '100';
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

                        if (bookingData.driverShare != null && (!angular.isUndefined(bookingData.driverShare))) {
                            driverShare = bookingData.driverShare.toFixed(2);
                            //parsedDrvShare = driverShare.toFixed(2);
                            //anis
                        }
                        if (bookingData.idShare != null && (!angular.isUndefined(bookingData.idShare))) {
                            idShare = bookingData.idShare.toFixed(2);
                            //parsedIdShare = idShare.toFixed(2);
                        }

                        var createdDate = moment(bookingData.createdDate).format('DD-MM-YYYY | HH:mm:ss');
                        ConUsers.findById({
                                id: bookingData.createdBy
                            },
                            function(ConUsers) {

                                $scope.bookedBy = ConUsers.firstName + ' ' + ConUsers.lastName;
                                console.log('BookedBy' + JSON.stringify($scope.bookedBy));
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
                                    reportingTime: reportingTime,
                                    bookingToDate: releavingDate,
                                    releivingTime: releavingTime,
                                    bookingFrmLocation: bookingData.pickAddress,
                                    bookingToLocation: bookingData.dropAddress,
                                    dutyType: dutyType,
                                    carType: carType,
                                    hours: fromhour1,
                                    minutes: frommin,
                                    timeformat: fromFormat,
                                    tohours: tohour,
                                    tominutes: tomin,
                                    totimeformat: toFormat,
                                    outstationCity: cityName,
                                    journeyType: journeyType,
                                    totalDuration: duration,
                                    estimatedAmt: bookingData.invoices[0].grossAmount,
                                    serviceTax: bookingData.invoices[0].invoiceDetails[0].amount,
                                    totalAmt: bookingData.invoices[0].netAmount,
                                    landmark: bookingData.landmark,
                                    paymentMethod: paymentMode,
                                    carTypeValue: carTypeText,
                                    returnFareAmount: returnFareText + returnFare,
                                    calculatedDuratuion: durationHour + 'HH' + durationMin + 'MM',
                                    driverShare: driverShare,
                                    idShare: idShare,
                                    returnTime: returnTravelHours,
                                    bookingDate: createdDate,
                                    bookBy: ' Created By ' + $scope.bookedBy,
                                    remark: bookingData.remark

                                };
                                console.log('booking :' + JSON.stringify($scope.booking));
                                $rootScope.allocateBook = $scope.booking;
                                $rootScope.cancelData = $scope.booking;
                                $rootScope.customerSMSData = $scope.booking;
                                $scope.getNewBookingDriverMobile();
                                $rootScope.loader = 0;

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
                });
            }


        };

         $scope.updateDateAndTime = function(booking) {
            $rootScope.loader = 1;
            var count = 0;
            console.log('booking details' + JSON.stringify(booking));
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
                    success[0].reportingDate = booking.bookingReportingDate;
                    success[0].reportingTime = booking.hours + ':' + booking.minutes + ':' + '00';
                    success[0].updatedDate = new Date();
                    success[0].updatedBy = $rootScope.userId;
                    success[0].$save();

                    Invoices.upsert({
                        id: success[0].invoices[0].id,
                        reportingDate: booking.bookingReportingDate,
                        reportingTime: booking.hours + ':' + booking.minutes + ':' + '00',

                        updatedDate: new Date(),
                        updatedBy: $rootScope.userId
                    }, function(s) {
                        console.log('invoice A:' + JSON.stringify(s));

                        $modalInstance.dismiss('cancel');
                        $.notify('Booking updated successfully', {
                            status: 'success'
                        });
                        $rootScope.refreshMap();
                        $rootScope.loader = 0;


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
                })



            }



        }

        $scope.CancelBookingPopUp = function() {

            console.log('cancelBooking popup');
            $modalInstance.dismiss('cancel');

            var modalInstance = $modal.open({
                templateUrl: '/cancelBookingPopup.html',
                controller: newBookingController
            });

        }


        $scope.submitCancellationReason = function(cancelationReason, comment) {

            $rootScope.loader = 1;
            ConUsers.findById({
                    id: $rootScope.userId
                },
                function(ConUsers) {
                    console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers.firstName));
                    console.log('ConUsers updated for id : ' + JSON.stringify(ConUsers.lastName));
                    $rootScope.cancelByName = ConUsers.firstName + ' ' + ConUsers.lastName;
                    console.log('Admin Name is:' + JSON.stringify($rootScope.cancelByName));

                    var cancelName = ' Booking cancelled by ' + $rootScope.cancelByName + ' on ';
                    console.log('i am in cancel booking ');

                    console.log('booking id:' + JSON.stringify($rootScope.cancelData.bookingId));
                    console.log('Cancelation Id: ' + JSON.stringify(cancelationReason.id));
                    console.log('Cancelation Reason: ' + JSON.stringify($rootScope.cancelationReasons.comment));

                    Bookings.cancelBooking({
                            bookingId: $rootScope.cancelData.bookingId,
                            cancellationId: cancelationReason.id,
                            cancellationReason: $rootScope.cancelationReasons.comment + ' ' + cancelName

                        },

                        function(response) {
                            console.log('booking for cancellation:' + JSON.stringify(response));


                            if (response[0].cancel_booking === 'Cancelled') {

                                var cancelSMS = $rootScope.cancelData;
                                cancelBookingSMS(cancelSMS);
                                $.notify('This duty has been cancelled successfully.', {
                                    status: 'success'
                                });


                            } else if (response[0].cancel_booking === 'On Duty') {
                                $.notify('This duty has already started', {
                                    status: 'danger'
                                });
                            } else if (response[0].cancel_booking === 'Done') {
                                $.notify('This duty has already done ', {
                                    status: 'danger'
                                });
                            } else if (response[0].cancel_booking === 'Paid') {
                                $.notify('This duty has already paid', {
                                    status: 'danger'
                                });
                            } else {

                            }
                            $rootScope.refreshMap();
                            $modalInstance.dismiss('cancel');
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

        function cancelBookingSMS(cancelSMS) {
            var rptDate = moment(cancelSMS.bookingReportingDate).format('DD-MM-YYYY');
            var msg = 'Your booking dated ' + rptDate + ', booking Id: ' + $rootScope.allocateBook.bookingId + ', has been cancelled, For queries kindly contact 020-69400400 or info@indian-drivers.com.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + cancelSMS.bookingCellNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };


    };

    var ModalDriverCtrl = function($scope, $rootScope, $modalInstance, $state) {

        $scope.booking = {

            driverName: $rootScope.driverData.first_name + ' ' + $rootScope.driverData.last_name,
            driverCellNumber: $rootScope.driverData.mobile_number,
            driverAddress: $rootScope.driverData.address

        };

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

    };

    var LineUpDriverController = function($scope, $rootScope, $modalInstance) {

        $scope.booking = {

            driverName: $rootScope.lineupdriverData.first_name + ' ' + $rootScope.lineupdriverData.last_name,
            driverCellNumber: $rootScope.lineupdriverData.mobile_number,
            driverAddress: $rootScope.lineupdriverData.address

        };

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');

        };

    };

    $scope.newBooking = function() {
        $scope.addBooking();
    };
    $scope.addBooking = function() {

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
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');

        };

        $scope.paymentArray = [{
            'desc': 'Online'
        }, {
            'desc': 'Cash By Office'
        }];

        $scope.addNewBooking = function() {
            var count = 0;
            $rootScope.mobDisable = true;
            var cellNumber = document.getElementById('mobileNo_value').value;
            $rootScope.mobNumber = cellNumber;

            if (angular.isUndefined($rootScope.mobileNumber) || $rootScope.mobileNumber == null || $rootScope.mobileNumber == '') {
                if (angular.isUndefined(cellNumber) || cellNumber === '' || cellNumber === null) {
                    document.getElementById("mobileNo").style.borderBottom = "1px solid red";
                    document.getElementById("mobileNo1").innerHTML = '*required';
                    count++;
                } else {
                    /*document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                    document.getElementById("mobileNo1").innerHTML = '';*/
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

                if (!angular.isUndefined($rootScope.mobileNumber)) {
                    getCustomerData($rootScope.mobileNumber);
                } else {
                    getCustomerData(cellNumber);
                }
            }
        };
        $scope.customerMobileSelect = function() {

            if ($scope.search !== undefined && $scope.search.mobileNumber !== undefined && $scope.search.mobileNumber !== null) {
                console.log('Search mobile : ' + JSON.stringify($scope.search.mobileNumber));
                $scope.mobileId = parseInt($scope.search.mobileNumber.originalObject.id);
                $rootScope.mobileNumber = $scope.search.mobileNumber.originalObject.mobileNumber;

            }
        };

        function getCustomerData(cellNumber) {
            var cellphoneNumber = cellNumber;
            ConUsers.mobileNoDetails({
                    mobileNumber: cellNumber
                },
                function(custData) {
                    console.log('custData ' + JSON.stringify(custData));
                    if (custData.length > 0) {
                        $rootScope.exist = true;
                        $rootScope.custExist = 0;
                        $rootScope.customerDetails1 = {
                            customerId: custData[0].id,
                            conUserId: custData[0].conuser_id,
                            firstName: custData[0].first_name,
                            middleName: custData[0].middle_name,
                            lastName: custData[0].last_name,
                            mobileNumber: cellphoneNumber,
                            address: custData[0].address_line_2,
                            landmark: custData[0].address,
                            email: custData[0].email
                        };

                    } else {
                        $rootScope.exist = false;
                        $rootScope.custExist = 1;
                        $rootScope.customerDetails1 = {
                            customerId: '',
                            conUserId: '',
                            firstName: '',
                            middleName: '',
                            lastName: '',
                            address: '',
                            landmark: '',
                            mobileNumber: cellphoneNumber,
                            email: ''
                        };
                    }

                    console.log('customer details' + JSON.stringify($rootScope.customerDetails1));
                    $modalInstance.dismiss('cancel');

                },
                function(error) {
                    console.log('error ' + JSON.stringify(error));
                });
        };

        $scope.getCustomerMobile = function(custMobileNumber) {

            $rootScope.loader = 1;
            CustomerDetails.find({
                    filter: {
                        include: {
                            relation: 'conUsers',
                            scope: {
                                where: {
                                    mobileNumber: custMobileNumber,
                                    status: 'Active'

                                }
                            }
                        }

                    }
                }, function(customerData) {
                    console.log('customerData' + JSON.stringify(customerData));
                    $scope.customerList = [];

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

                        $scope.customerList.push({
                            id: customerData[i].id,
                            mobileNumber: mobNo,
                            customerName: firstName + ' ' + lastName,
                            custDetails: firstName + ' ' + lastName + ' - ' + mobNo
                        });
                    }


                    console.log('customer List = ' + JSON.stringify($scope.customerList));

                    $rootScope.loader = 0;

                },
                function(bookErr) {
                    console.log('Error fetching existing mobile number : ' + JSON.stringify(bookErr));
                    $rootScope.loader = 0;
                });
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
        $rootScope.myDate = new Date();

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

        $scope.verifyMobile = function() {

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
                console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {
                    console.log('not null');
                    if ((custSuccess[0].mobileNumber === cellNumber) && (custSuccess[0].userRoles[0].roleId === '2')) {
                        document.getElementById("mobileNo").style.borderColor = "#dde6e9";
                        document.getElementById("mobileNo1").innerHTML = '';
                        $scope.addNewBooking();
                    } else {
                        document.getElementById("mobileNo").style.borderColor = "red";
                        document.getElementById("mobileNo1").innerHTML = 'Can not book,This number belongs to driver or staff.';
                    }
                } else {
                    console.log('null');
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

        $scope.verifyEmailFunction = function(customerDetails1) {
            var currentUserId = parseInt($rootScope.customerDetails1.conUserId);
            $scope.isDisabled = true;
            ConUsers.find({
                filter: {
                    where: {
                        email: customerDetails1.email
                    }

                }
            }, function(custSuccess) {
                console.log('custSuccess***' + JSON.stringify(custSuccess));
                if (custSuccess.length > 0) {

                    if (custSuccess[0].id === currentUserId) {
                        document.getElementById("email").style.borderColor = "#dde6e9";
                        document.getElementById("email1").innerHTML = '';
                        $rootScope.addBookingDetails(customerDetails1);
                    } else {
                        document.getElementById("email").style.borderColor = "red";
                        document.getElementById("email1").innerHTML = 'Email exist';
                        $scope.isDisabled = false;
                        return false;
                    }

                } else {
                    document.getElementById("email").style.borderColor = "#dde6e9";
                    document.getElementById("email1").innerHTML = '';
                    $rootScope.addBookingDetails(customerDetails1);
                }

            }, function(custErr) {
                console.log('custErr***' + JSON.stringify(custErr));
                $scope.isDisabled = false;
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }
                $modalInstance.dismiss('cancel');
            });
        }

        /*$scope.emailExist == false;
        $scope.verifyEmail = function(email) {


            $scope.emailExist = false;
            if ((!angular.isUndefined(email)) && email !== '') {

                var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (!mailTest.test(email)) {
                    document.getElementById("email").style.borderColor = "red";
                    document.getElementById("email1").innerHTML = 'Enter valid email';
                    $scope.emailExist = true;
                    return false;
                }

                ConUsers.count({
                        where: {
                            email: email
                        }
                    },
                    function(response) {
                        if (response.count > 0) {

                            $scope.emailExist = true;

                            document.getElementById("email").style.borderColor = "red";
                            document.getElementById("email1").innerHTML = 'Email exist';
                            console.log('Email already exists : ' + JSON.stringify(response));
                        } else {
                            $scope.emailExist = false;
                            document.getElementById("email").style.borderColor = "#dde6e9";
                            document.getElementById("email1").innerHTML = '';
                        }
                    },
                    function(error) {
                        console.log('Error verifying mobile : ' + JSON.stringify(error));
                        document.getElementById("email").style.borderColor = "red";
                        $scope.emailExist = false;
                        if (error.status == 0) {
                            window.alert('Oops! You are disconnected from server.');
                            $state.go('page.login');
                        }
                        $modalInstance.dismiss('cancel');
                    });
            } else {
                $scope.emailExist = false;
            }


        };*/




        $rootScope.addBookingDetails = function(customerDetails1) {
            console.log('customerDetails1' + JSON.stringify(customerDetails1));

            $scope.isDisabledButton = true;
            
            $rootScope.loader = 1;
            var count = 0;
            var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (angular.isUndefined(customerDetails1.firstName) || customerDetails1.firstName === '') {
                document.getElementById("firstName").style.borderBottom = "1px solid red";
                document.getElementById("firstName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("firstName").style.borderColor = "#dde6e9";
                document.getElementById("firstName1").innerHTML = '';

            }

            if (angular.isUndefined(customerDetails1.lastName) || customerDetails1.lastName === '' || customerDetails1.lastName === null) {
                document.getElementById("lastName").style.borderBottom = "1px solid red";
                document.getElementById("lastName1").innerHTML = '*required';

                count++;
            } else {
                document.getElementById("lastName").style.borderColor = "#dde6e9";
                document.getElementById("lastName1").innerHTML = '';
            }
            if (angular.isUndefined(customerDetails1.email) || customerDetails1.email === '' || customerDetails1.email === null) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';
                count++;
            } else if (!mailTest.test(customerDetails1.email) && customerDetails1.email.length > 0) {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter valid email';
                count++;
            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
            }
            if (angular.isUndefined(customerDetails1.dutyType) || customerDetails1.dutyType === '' || customerDetails1.dutyType === null) {
                document.getElementById("dutyType").style.borderColor = "red";
                document.getElementById("dutyType1").innerHTML = '*required';
                customerDetails1.dutyType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("dutyType").style.borderColor = "#dde6e9";
                document.getElementById("dutyType1").innerHTML = '';
                customerDetails1.dutyType1 = null;
            }

            if (angular.isUndefined(customerDetails1.carType) || customerDetails1.carType === '' || customerDetails1.carType === null) {
                document.getElementById("carType").style.borderColor = "red";
                document.getElementById("carType1").innerHTML = '*required';
                customerDetails1.carType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("carType").style.borderColor = "#dde6e9";
                document.getElementById("carType1").innerHTML = '';
                customerDetails1.carType1 = null;
            }

            if (angular.isUndefined(customerDetails1.journeyType) || customerDetails1.journeyType === '' || customerDetails1.journeyType === null) {
                document.getElementById("journeyType").style.borderColor = "red";
                document.getElementById("journeyType1").innerHTML = '*required';
                customerDetails1.journeyType1 = 'This value is required';
                count++;
            } else {
                document.getElementById("journeyType").style.borderColor = "#dde6e9";
                document.getElementById("journeyType1").innerHTML = '';
                customerDetails1.journeyType1 = null;
            }

            if (angular.isUndefined(customerDetails1.reportingDate) || customerDetails1.reportingDate === '' || customerDetails1.reportingDate === null) {
                document.getElementById("reportingDate").style.borderColor = "red";
                document.getElementById("reportingDate1").innerHTML = '*required';
                customerDetails1.reportingDate1 = 'This value is required';
                count++;
            } else {
                document.getElementById("reportingDate").style.borderColor = "#dde6e9";
                document.getElementById("reportingDate1").innerHTML = '';
                customerDetails1.reportingDate1 = null;
            }

            if (angular.isUndefined(customerDetails1.paymentMethod) || customerDetails1.paymentMethod === '' || customerDetails1.paymentMethod === null) {
                document.getElementById("paymentMethod").style.borderColor = "red";
                document.getElementById("paymentMethod1").innerHTML = '*required';
                customerDetails1.paymentMethod1 = 'This value is required';
                count++;
            } else {
                document.getElementById("paymentMethod").style.borderColor = "#dde6e9";
                document.getElementById("paymentMethod1").innerHTML = '';
                customerDetails1.paymentMethod1 = null;
            }

            if (angular.isUndefined(customerDetails1.address) || customerDetails1.address === '' || customerDetails1.address === null) {
                document.getElementById("bookingFrmLocation").style.borderColor = "red";
                document.getElementById("bookingFrmLocation1").innerHTML = '*required';
                customerDetails1.bookingFrmLocation1 = 'This value is required';
                count++;
            } else {
                /*if ($rootScope.addressResults.results.length == '0') {
                    document.getElementById("bookingFrmLocation").style.borderColor = "red";
                    document.getElementById("bookingFrmLocation1").innerHTML = 'Invalid address';
                    customerDetails1.bookingFrmLocation1 = 'Invalid address';
                    count++;
                } else {
                    document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
                    document.getElementById("bookingFrmLocation1").innerHTML = '';
                    customerDetails1.bookingFrmLocation1 = null;
                }*/
                document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
                document.getElementById("bookingFrmLocation1").innerHTML = '';
                customerDetails1.bookingFrmLocation1 = null;

            }
            if (angular.isUndefined(customerDetails1.dutyType) || customerDetails1.dutyType === '' || customerDetails1.dutyType === null) {} else {
                if (customerDetails1.dutyType !== '2') {
                    if (angular.isUndefined(customerDetails1.releavingHours) || customerDetails1.releavingHours === '' || customerDetails1.releavingHours === null) {
                        document.getElementById("releavingHours").style.borderColor = "red";
                        document.getElementById("releavingHours1").innerHTML = '*required';
                        customerDetails1.releavingHours1 = 'This value is required';
                        count++;
                    } else if (parseInt(customerDetails1.releavingHours) > 12) {
                        document.getElementById("releavingHours").style.borderColor = "red";
                        document.getElementById("releavingHours1").innerHTML = 'Releiving Hours cannot be more than 12 hours.';
                        count++;
                    } else {
                        document.getElementById("releavingHours").style.borderColor = "#dde6e9";
                        document.getElementById("releavingHours1").innerHTML = '';
                        customerDetails1.releavingHours1 = null;
                    }
                }
            }
            if (angular.isUndefined(customerDetails1.dutyType) || customerDetails1.dutyType === '' || customerDetails1.dutyType === null) {} else {
                if (customerDetails1.dutyType === '2') {
                    if (angular.isUndefined(customerDetails1.outstationCity) || customerDetails1.outstationCity === '' || customerDetails1.outstationCity === null) {
                        document.getElementById("outstationCity").style.borderColor = "red";
                        document.getElementById("outstationCity1").innerHTML = '*required';
                        customerDetails1.outstationCity1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("outstationCity").style.borderColor = "#dde6e9";
                        document.getElementById("outstationCity1").innerHTML = '';
                        customerDetails1.outstationCity1 = null;
                    }
                }
            }

            if (angular.isUndefined(customerDetails1.dutyType) || customerDetails1.dutyType === '' || customerDetails1.dutyType === null) {} else {
                if (customerDetails1.dutyType === '2') {
                    if (angular.isUndefined(customerDetails1.bookingToDate) || customerDetails1.bookingToDate === '' || customerDetails1.bookingToDate === null) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = '*required';
                        customerDetails1.bookingToDate1 = 'This value is required';
                        count++;
                    } else if (customerDetails1.bookingToDate < customerDetails1.reportingDate) {
                        document.getElementById("bookingToDate").style.borderColor = "red";
                        document.getElementById("bookingToDate1").innerHTML = 'Releiving Date should be greater than Reporting Date';
                        customerDetails1.bookingToDate1 = 'Releiving Date should be greater than Reporting Date';
                        count++;
                    } else {
                        document.getElementById("bookingToDate").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToDate1").innerHTML = '';
                        customerDetails1.bookingToDate1 = null;
                    }
                    var startDate = moment(customerDetails1.reportingDate).format('YYYY-MM-DD');
                    var endDate = moment(customerDetails1.bookingToDate).format('YYYY-MM-DD');
                    if (startDate === endDate) {
                        if ((!angular.isUndefined(customerDetails1.hours) || customerDetails1.hours != null || customerDetails1.hours != '') && (!angular.isUndefined(customerDetails1.tohours) || customerDetails1.tohours != null || customerDetails1.tohours != '')) {
                            if (customerDetails1.tohours < customerDetails1.hours) {
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

                    if (angular.isUndefined(customerDetails1.tohours) || customerDetails1.tohours === '' || customerDetails1.tohours === null) {
                        document.getElementById("tohours").style.borderColor = "red";
                        document.getElementById("tohours1").innerHTML = '*required';
                        customerDetails1.tohours1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("tohours").style.borderColor = "#dde6e9";
                        document.getElementById("tohours1").innerHTML = '';
                        customerDetails1.tohours1 = null;
                    }

                    if (angular.isUndefined(customerDetails1.tominutes) || customerDetails1.tominutes === '' || customerDetails1.tominutes === null) {
                        document.getElementById("tominutes").style.borderColor = "red";
                        document.getElementById("tominutes1").innerHTML = '*required';
                        customerDetails1.tominutes1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("tominutes").style.borderColor = "#dde6e9";
                        document.getElementById("tominutes1").innerHTML = '';
                        customerDetails1.tominutes1 = null;
                    }

                }
            }

            if (angular.isUndefined(customerDetails1.journeyType) || customerDetails1.journeyType === '' || customerDetails1.journeyType === null) {} else {
                if (customerDetails1.journeyType === '1') {
                    if (angular.isUndefined(customerDetails1.bookingToLocation) || customerDetails1.bookingToLocation === '' || customerDetails1.bookingToLocation === null) {
                        document.getElementById("bookingToLocation").style.borderColor = "red";
                        document.getElementById("bookingToLocation1").innerHTML = '*required';
                        customerDetails1.bookingToLocation1 = 'This value is required';
                        count++;
                    } else {
                        document.getElementById("bookingToLocation").style.borderColor = "#dde6e9";
                        document.getElementById("bookingToLocation1").innerHTML = '';
                        customerDetails1.bookingToLocation1 = null;
                    }
                }
            }

            if (angular.isUndefined(customerDetails1.hours) || customerDetails1.hours === '' || customerDetails1.hours === null) {
                document.getElementById("hours").style.borderColor = "red";
                document.getElementById("hours1").innerHTML = '*required';
                customerDetails1.hours1 = 'This value is required';
                count++;
            } else {
                document.getElementById("hours").style.borderColor = "#dde6e9";
                document.getElementById("hours1").innerHTML = '';
                customerDetails1.hours1 = null;
            }
            if (angular.isUndefined(customerDetails1.minutes) || customerDetails1.minutes === '' || customerDetails1.minutes === null) {
                document.getElementById("minutes").style.borderColor = "red";
                document.getElementById("minutes1").innerHTML = '*required';
                customerDetails1.minutes1 = 'This value is required';
                count++;
            } else {
                document.getElementById("minutes").style.borderColor = "#dde6e9";
                document.getElementById("minutes1").innerHTML = '';
                customerDetails1.minutes1 = null;
            }

            if (count > 0) {
                $scope.count = count;
                $scope.isDisabledButton = false;
                $scope.isDisabled = false;
                $rootScope.loader = 0;
                return false;
            } else {

                var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + customerDetails1.address + '';
                $http.post(mapUrl).success(function(result) {
                    console.log('result' + JSON.stringify(result));
                    $rootScope.addressResults = result;
                    console.log('address result' + JSON.stringify($rootScope.addressResults));
                    console.log('address results length' + JSON.stringify($rootScope.addressResults.results.length));
                    var count1 = 0;
                    if ($rootScope.addressResults.results.length == '0') {
                        document.getElementById("bookingFrmLocation").style.borderColor = "red";
                        document.getElementById("bookingFrmLocation1").innerHTML = 'Invalid address';
                        customerDetails1.bookingFrmLocation1 = 'Invalid address';
                        count1++;
                    } else {
                        document.getElementById("bookingFrmLocation").style.borderColor = "#dde6e9";
                        document.getElementById("bookingFrmLocation1").innerHTML = '';
                        customerDetails1.bookingFrmLocation1 = null;
                    }
                    if (count1 > 0) {
                        $scope.count1 = count1;
                        $scope.isDisabledButton = false;
                        $scope.isDisabled = false;
                        $rootScope.loader = 0;
                        return false;
                    } else {
                        $rootScope.loader = 0;
                        $scope.count1 = 0;
                        $scope.count = 0;

                        $scope.repDate = customerDetails1.reportingDate;

                        $scope.mainDate = new Date(
                            $scope.repDate.getFullYear(),
                            $scope.repDate.getMonth(),
                            $scope.repDate.getDate() + 1);

                        console.log('main date' + JSON.stringify($scope.mainDate));
                        $scope.releDate = '';
                        if (angular.isDefined(customerDetails1.bookingToDate)) {
                            $scope.releDate = customerDetails1.bookingToDate;

                            $scope.mainRelDate = new Date(
                                $scope.releDate.getFullYear(),
                                $scope.releDate.getMonth(),
                                $scope.releDate.getDate() + 1);

                            console.log('main date' + JSON.stringify($scope.mainRelDate));
                        }


                        var carType;
                        var dutyType;
                        var journeyType;
                        if (angular.isDefined(customerDetails1.carType)) {
                            if (customerDetails1.carType == '1') {
                                carType = 'M';
                            } else if (customerDetails1.carType == '2') {

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
                        rptTime = customerDetails1.hours + ':' + customerDetails1.minutes + ':' + '00';
                        if (angular.isDefined(customerDetails1.dutyType)) {
                            if (customerDetails1.dutyType == '2') {
                                dutyType = true;
                                relDate = $scope.mainRelDate;
                                relTime = customerDetails1.tohours + ':' + customerDetails1.tominutes + ':' + '00';
                                relDuration = '0';
                                city = customerDetails1.outstationCity;

                            } else {

                                dutyType = false;
                                var tempHour = 0;
                                var tempHour1 = 0;
                                tempHour1 = parseInt(customerDetails1.hours) + parseInt(customerDetails1.releavingHours);

                                if (tempHour1 > 23) {
                                    tempHour = tempHour1 - 24;
                                    relTime = tempHour + ':' + customerDetails1.minutes + ':' + '00';

                                    var tempRelDate = new Date(
                                        $scope.mainDate.getFullYear(),
                                        $scope.mainDate.getMonth(),
                                        $scope.mainDate.getDate() + 1);

                                    relDate = tempRelDate;
                                } else {
                                    relTime = tempHour1 + ':' + customerDetails1.minutes + ':' + '00';
                                    relDate = $scope.mainDate;
                                }

                                relDuration = customerDetails1.releavingHours * 60;
                                city = null;

                            }
                        }
                        var relLoc;
                        if (angular.isDefined(customerDetails1.journeyType)) {
                            if (customerDetails1.journeyType == '2') {
                                journeyType = true;
                                relLoc = customerDetails1.address;
                            } else {
                                journeyType = false;
                                relLoc = customerDetails1.bookingToLocation;
                            }
                        }

                        var paymentMode;
                        if (angular.isDefined(customerDetails1.paymentMethod)) {
                            if (customerDetails1.paymentMethod == 'Cash By Office') {
                                paymentMode = 'C';
                            } else if (customerDetails1.paymentMethod == 'Cash By Driver') {
                                paymentMode = 'D';
                            } else {
                                paymentMode = 'O';
                            }
                        }
                        var landmark = '';
                        if (!angular.isUndefined(customerDetails1.landmark) || customerDetails1.landmark != null || customerDetails1.landmark != '') {
                            landmark = customerDetails1.landmark;
                        }
                        // var lastIndex = customerDetails1.address.lastIndexOf(" ");
                        //var custAddress = customerDetails1.address.substring(0, lastIndex - 3);

                        var pickupLat = null;
                        var pickupLng = null;
                        var dropLat = null;
                        var dropLng = null;
                        var cityLat = null;
                        var cityLng = null;
                        var totalAmt = '500';
                        var pickLat = $rootScope.addressResults.results[0].geometry.location.lat;
                        var pickLong = $rootScope.addressResults.results[0].geometry.location.lng;
                        console.log(pickLat);
                        console.log(pickLong);
                        if ($rootScope.custExist == 1) {
                            ConUsers.create({
                                email: customerDetails1.email,
                                username: customerDetails1.mobileNumber,
                                password: customerDetails1.mobileNumber,
                                createdBy: $rootScope.userId

                            }, function(ConUsersData) {
                                console.log('ConUsersData' + JSON.stringify(ConUsersData));

                                Bookings.newCustomerCreateBooking({
                                    conuserId: ConUsersData.id,
                                    firstName: customerDetails1.firstName,
                                    middleName: customerDetails1.middleName,
                                    lastName: customerDetails1.lastName,
                                    mobileNumber: customerDetails1.mobileNumber,
                                    status: 'Active',
                                    addressLandmark: landmark,
                                    address: customerDetails1.address,
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
                                    pickupAddress: customerDetails1.address,
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
                                    remark: customerDetails1.remark

                                }, function(bookingSuccess) {
                                    console.log('new customer booking created' + JSON.stringify(bookingSuccess));


                                    $rootScope.bookingDataId = bookingSuccess[0].new_customer_create_booking;

                                    $.notify('Successfully created booking with booking ID: ' + $rootScope.bookingDataId + '.', {
                                        status: 'success'
                                    });
                                    console.log('customer details*****' + JSON.stringify(customerDetails1));
                                    if (customerDetails1.dutyType !== '2' && customerDetails1.journeyType === '2') {

                                        newBookingSMSLocalRound(customerDetails1);
                                    } else if (customerDetails1.dutyType !== '2' && customerDetails1.journeyType === '1') {
                                        newBookingSMSLocalOneway(customerDetails1);
                                    } else if (customerDetails1.dutyType === '2' && customerDetails1.journeyType === '2') {
                                        newBookingSMSOutstationRound(customerDetails1);
                                    } else {
                                        newBookingSMSOutstationOneway(customerDetails1);
                                    }
                                    $rootScope.customerDetails1 = undefined;
                                    $rootScope.mobileNumber = undefined;
                                    $rootScope.loader = 0;
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.refreshMap();
                                    $scope.isDisabled = false;
                                }, function(bookingError) {
                                    console.log('new customer booking error' + JSON.stringify(bookingError));
                                    if (bookingError.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $scope.isDisabled = false;
                                    $rootScope.loader = 0;

                                });
                            }, function(ConUsersErr) {
                                console.log('ConUsersErr' + JSON.stringify(ConUsersErr));
                                $scope.isDisabledButton = false;
                                $scope.isDisabled = false;
                                if (ConUsersErr.status == 0) {
                                    window.alert('Oops! You are disconnected from server.');
                                    $state.go('page.login');
                                }
                                $modalInstance.dismiss('cancel');
                                $rootScope.loader = 0;
                            });


                        } else {

                            ConUsers.findById({
                                    id: $rootScope.customerDetails1.conUserId
                                },
                                function(ConUsers) {
                                    console.log('fetch customer for update' + JSON.stringify(ConUsers));

                                    ConUsers.email = customerDetails1.email;
                                    ConUsers.updatedBy = $localStorage.get('userId');
                                    ConUsers.updatedDate = new Date();
                                    ConUsers.$save();

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
                                        pickupAddress: customerDetails1.address,
                                        pickupLat: pickLat,
                                        pickupLng: pickLong,
                                        dropAddress: relLoc,
                                        dropLat: dropLat,
                                        dropLng: dropLng,
                                        cityName: city,
                                        cityLat: cityLat,
                                        cityLng: cityLng,
                                        totalAmount: totalAmt,
                                        customerId: $rootScope.customerDetails1.customerId,
                                        userId: $rootScope.userId,
                                        paymentMethod: paymentMode,
                                        remark: customerDetails1.remark

                                    }, function(bookingDataValues1) {
                                        console.log('bookingDataValues ' + JSON.stringify(bookingDataValues1));


                                        $rootScope.bookingDataId1 = bookingDataValues1[0].create_booking_for_admin;
                                        $.notify('Successfully created booking with booking ID: ' + $rootScope.bookingDataId1 + '.', {
                                            status: 'success'
                                        });

                                        var customerSMSdetails = $rootScope.customerDetails1;
                                        if (customerDetails1.dutyType !== '2' && customerDetails1.journeyType === '2') {

                                            newBookingSMSLocalRound1(customerSMSdetails);
                                        } else if (customerDetails1.dutyType !== '2' && customerDetails1.journeyType === '1') {
                                            newBookingSMSLocalOneway1(customerSMSdetails);
                                        } else if (customerDetails1.dutyType === '2' && customerDetails1.journeyType === '2') {
                                            newBookingSMSOutstationRound1(customerSMSdetails);
                                        } else {
                                            newBookingSMSOutstaionOneway1(customerSMSdetails);
                                        }
                                        $rootScope.customerDetails1 = undefined;
                                        $rootScope.mobileNumber = undefined;
                                        $rootScope.loader = 0;
                                        $modalInstance.dismiss('cancel');
                                        $rootScope.refreshMap();
                                        $scope.isDisabled = false;
                                    }, function(bookingError) {
                                        console.log('bookingError ' + JSON.stringify(bookingError));
                                        $scope.isDisabled = false;
                                        $rootScope.loader = 0;

                                    });


                                },
                                function(error) {
                                    console.log('Error updating Customer : ' + JSON.stringify(error));
                                    $scope.isDisabled = false;
                                    if (error.status == 0) {
                                        window.alert('Oops! You are disconnected from server.');
                                        $state.go('page.login');
                                    }
                                    $modalInstance.dismiss('cancel');
                                    $rootScope.loader = 0;
                                });


                        }
                    }

                }).error(function(error) {
                    console.log('error' + JSON.stringify(error));
                    $scope.isDisabled = false;
                    if (error == null) {
                        window.alert('Oops! You are disconnected from server.');
                        $state.go('page.login');
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.loader = 0;
                });

            }


        };

        $scope.closeModal = function() {
            $rootScope.customerDetails1 = undefined;
            $rootScope.mobileNumber = undefined;
            $modalInstance.dismiss('cancel');
        };

        function newBookingSMSOutstationOneway(customerDetails1) {
            var rptTime = customerDetails1.hours + ':' + customerDetails1.minutes + ':' + '00';
            var rptDate = moment(customerDetails1.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerDetails1.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation OneWay Trip has been received, driver details will be shared two hours before the trip. Return fare and food allowance of the driver is not included in the bill. It is to be paid in cash (as per rate card) to the driver.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerDetails1.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSOutstationRound(customerDetails1) {
            var rptTime = customerDetails1.hours + ':' + customerDetails1.minutes + ':' + '00';
            var rptDate = moment(customerDetails1.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerDetails1.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Food allowance of the Driver is not included in the bill. It is to be paid in cash (as per rate card) to the driver.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerDetails1.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSLocalOneway(customerDetails1) {
            var rptTime = customerDetails1.hours + ':' + customerDetails1.minutes + ':' + '00';
            var rptDate = moment(customerDetails1.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerDetails1.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Oneway Trip has been received, driver details will be shared two hours before the trip. Return fare of the Driver is not included in the bill. It is to be paid in cash (as per rate card)  to the driver.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerDetails1.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        }

        function newBookingSMSLocalRound(customerDetails1) {
            var rptTime = customerDetails1.hours + ':' + customerDetails1.minutes + ':' + '00';
            var rptDate = moment(customerDetails1.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerDetails1.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round Trip has been received, driver details will be shared two hours before the trip.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerDetails1.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSOutstaionOneway1(customerSMSdetails) {
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerSMSdetails.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId1 + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation OneWay Trip has been received, driver details will be shared two hours before the trip. Return fare and food allowance of the Driver is not included in the bill. It is to be paid in cash (as per rate card) to the driver.';
            var data = "";

            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;


            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSOutstationRound1(customerSMSdetails) {
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerSMSdetails.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId1 + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Outstation Round Trip has been received, driver details will be shared two hours before the trip. Food allowance of the Driver is not included in the bill. It is to be paid in cash (as per rate card) to the driver.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };

        function newBookingSMSLocalOneway1(customerSMSdetails) {
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerSMSdetails.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId1 + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local One way trip has been received, driver details will be shared two hours before the trip. Return fare of the Driver is not included in the bill. It is to be paid in cash (as per rate card)  to the driver.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        }

        function newBookingSMSLocalRound1(customerSMSdetails) {
            var rptTime = customerSMSdetails.hours + ':' + customerSMSdetails.minutes + ':' + '00';
            var rptDate = moment(customerSMSdetails.reportingDate).format('DD-MM-YYYY');
            var msg = ' Hi ' + customerSMSdetails.firstName + ',%0a Your booking Id: ' + $rootScope.bookingDataId1 + ', reporting date ' + rptDate + ' @ ' + rptTime + ' for a Local Round trip has been received, driver details will be shared two hours before the trip.';
            var data = "";
            data += "username=msgs-driver";
            data += "&password=driver";
            data += "&type=0";
            data += "&dlr=1";
            data += "&destination=" + customerSMSdetails.mobileNumber;
            data += "&source=INDRIV";
            data += "&sender=INDRIV";
            data += "&message=" + msg;

            var url = 'http://103.16.101.52:8080/sendsms/bulksms?' + data;
            console.log('url = ' + url);

            $http({
                method: 'post',
                url: 'http://103.16.101.52:8080/sendsms/bulksms?' + data
            }).then(function successCallback(response) {
                    // console.log(JSON.stringify(response));
                    console.log('position : ' + JSON.stringify(response));
                },
                function errorCallback(response) {
                    console.log('errorCallback : ' + JSON.stringify(response));
                });

        };



    };


    $(function() {
        initMap();
    });

}).directive('googleplace', function() {
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
                    console.log(element.val());
                });
            });
        }
    };
});
