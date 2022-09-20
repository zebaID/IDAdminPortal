App.controller('dataAnalysisCtrl', dataAnalysisCtrl)

function dataAnalysisCtrl($scope, $rootScope, $filter, ngTableParams, $resource, $timeout, //ngTableDataService,
    $cookieStore, $localStorage, $state, orderByFilter, $modal, $http, Bookings, CustomerDetails, DriverDetails, ConUsers, CancellationReasons, BookingInvites, Invoices, OutstationBookings, $window, UserRoles, BookingPaymentTransaction, BookingAnalysisData, AgentDetails) {
    'use strict';

    $rootScope.operationCity = $localStorage.get('operationCity');
       $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
        $rootScope.userId = $localStorage.get('userId');
    $rootScope.cities = $localStorage.get('cities'); 
   $rootScope.roleId = $localStorage.get('roleId');
         

        
        $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $rootScope.fetchChartData();
              
             
        }
    $scope.uid = $localStorage.get('userId');
    UserRoles.findOne({
        filter: {
            where: {
                conuserId: $scope.uid
            }
        }

    }, function(success) {
        //console.log("user roles**" + JSON.stringify(success));
        if (!angular.isUndefined(success.roleId) || success.roleId !== null || success.roleId !== '') {
            if (success.roleId === '1') {
                $rootScope.updateFlag1 = true;
            } else {
                $rootScope.updateFlag1 = false;
            }
        }
    }, function(error) {
        console.log("error" + JSON.stringify(error));
    });
    $rootScope.gotoReport = function() {
        console.log('hello');
        $state.go('app.dataAnalysisReport');
    }
    $rootScope.selectYear = function() {
        var analysisDataResult = [];
        BookingAnalysisData.find({

        }, function(yearData) {
            //console.log('year data ' + JSON.stringify(yearData));
            for (var i = 0; i < yearData.length; i++) {
                analysisDataResult.push({

                    year: yearData[i].year

                });
            }
            $scope.datalist = analysisDataResult;

            //console.log('year: ' + JSON.stringify($scope.datalist));

            $scope.year = $scope.datalist;


        }, function(err) {
            console.log('anlysis error ' + JSON.stringify(err));

        });
    }


    $scope.quarter = [{
        Id: 1,
        quarter: 'First Quarter'
    }, {
        Id: 2,
        quarter: 'Second Quarter'
    }, {
        Id: 3,
        quarter: 'Third Quarter'
    }, {
        Id: 4,
        quarter: 'Fourth Quarter'
    }];
    $rootScope.analysisSelectFunction = function(analysisSearchData) {
        //console.log('searchData is' + JSON.stringify(analysisSearchData));
        $localStorage.put('chartSearchData', analysisSearchData);
        //$state.reload();
        $rootScope.chartDataInit();
    }
    $rootScope.chartOnLoadFunction = function() {
        $localStorage.remove('chartSearchData');
        $rootScope.chartDataInit();
    }
    $rootScope.chartDataInit = function() {

                    /*var url = 'http://52.32.39.44:3000';
                        $http.get(url + '/transactionJobForAnalysisAurangabad').
                        success(function(result) {
                            console.log('Updated transactionJobForAnalysisAurangabad successfully' + JSON.stringify(result));
                             
                        }).
                        error(function(error) {
                            console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                        });*/

        //console.log('searchData is' + JSON.stringify(year));
        var localStorageChartData = $localStorage.get('chartSearchData');
        if (angular.isUndefined(localStorageChartData) || localStorageChartData === null || localStorageChartData === '') {
            $rootScope.qrtr = true;
            $rootScope.month = false;
            $rootScope.fetchChartData();
        } else {
            if ((!angular.isUndefined(localStorageChartData.year) || localStorageChartData.year !== null || localStorageChartData.year !== '') && (angular.isUndefined(localStorageChartData.quarter) || localStorageChartData.quarter === null || localStorageChartData.quarter === '')) {
                $rootScope.qrtr = true;
                $rootScope.month = false;
                $rootScope.fetchChartDataByYear(localStorageChartData.year);
            } else if ((!angular.isUndefined(localStorageChartData.year) || localStorageChartData.year !== null || localStorageChartData.year !== '') && (!angular.isUndefined(localStorageChartData.quarter) || localStorageChartData.quarter !== null || localStorageChartData.quarter !== '')) {
                $rootScope.fetchChartDataByBoth(localStorageChartData);
            } else if ((angular.isUndefined(localStorageChartData.year) || localStorageChartData.year === null || localStorageChartData.year === '') && (!angular.isUndefined(localStorageChartData.quarter) || localStorageChartData.quarter !== null || localStorageChartData.quarter !== '')) {
                $rootScope.fetchChartDataByBoth(localStorageChartData);
            } else {

            }
        }

    }
    $rootScope.fetchChartDataByBoth = function(localStorageChartData) {
        $rootScope.month = true;
        if (angular.isUndefined(localStorageChartData.year) || localStorageChartData.year === null || localStorageChartData.year === '') {
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear();
            $rootScope.fetchSpecificQuarterData(localStorageChartData.quarter, currentYear);
        } else {

            $rootScope.fetchSpecificQuarterData(localStorageChartData.quarter, localStorageChartData.year);

        }
    }

    $rootScope.fetchSpecificQuarterData = function(quarter, year) {

        //console.log('searchData is' + JSON.stringify(search));
        if (quarter === 'First Quarter') {
            var firstMonth = 'January';
            var secondMonth = 'February';
            var thirdMonth = 'March';
        } else if (quarter === 'Second Quarter') {
            var firstMonth = 'April';
            var secondMonth = 'May';
            var thirdMonth = 'June';
        } else if (quarter === 'Third Quarter') {
            var firstMonth = 'July';
            var secondMonth = 'August';
            var thirdMonth = 'September';
        } else {
            var firstMonth = 'October';
            var secondMonth = 'November';
            var thirdMonth = 'December';
        }
        $rootScope.loader = 1;
        var localTotalData = [];
        var localOvertimeData = [];
        var outstationTotalData = [];
        var outstationOvertimeData = [];
        var analysisData = [];
        var currentYear = Number(year);

        $rootScope.anlysisYear = currentYear;
        //console.log('currentYear is' + JSON.stringify(currentYear));
        if($rootScope.roleId === '1'){
            if($rootScope.operationCitySelect === 'All'){
                BookingAnalysisData.getAnalysisDataofAll({
                  year: currentYear,
                  firstMonth: firstMonth,
                  secondMonth: secondMonth,
                  thirdMonth: thirdMonth
        }, function(chartData) {
           // console.log('anlysis data ' + JSON.stringify(chartData));
             for (var i = 0; i < chartData.length; i++) {
                
                 localTotalData.push(Math.round(chartData[i].local_total_time));
                localOvertimeData.push(Math.round(chartData[i].local_overtime));
                outstationTotalData.push(Math.round(chartData[i].outstation_total_time));
                outstationOvertimeData.push(Math.round(chartData[i].outstation_overtime));
                analysisData.push({
                     
                    month: chartData[i].month,
                    year: chartData[i].year,
                    localTotal: Math.round(chartData[i].local_total_time),
                    localOvertime: Math.round(chartData[i].local_overtime),
                    outstationTotal: Math.round(chartData[i].outstation_total_time),
                    outstationOvertime: Math.round(chartData[i].outstation_overtime)
                });   
                
                
            }
           // console.log('anlysis data ' + JSON.stringify(analysisData));
            $rootScope.analysisTableData = analysisData;
            if (quarter === 'First Quarter') {
                var data = {
                    "xData": ["Jan", "Feb", "Mar"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Second Quarter') {
                var data = {
                    "xData": ["Apr", "May", "Jun"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Third Quarter') {
                var data = {
                    "xData": ["Jul", "Aug", "Sep"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else {
                var data = {
                    "xData": ["Oct", "Nov", "Dec"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            }



            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        });
            }else{
               BookingAnalysisData.find({
            filter: {
                where: {
                    year: currentYear,
                    month: {
                        inq: [firstMonth, secondMonth, thirdMonth]
                    },
                    location:$rootScope.operationCitySelect

                }
            }
        }, function(chartData) {
            //console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                localTotalData.push(Math.round(chartData[i].localTotalTime));
                localOvertimeData.push(Math.round(chartData[i].localOvertime));
                outstationTotalData.push(Math.round(chartData[i].outstationTotalTime));
                outstationOvertimeData.push(Math.round(chartData[i].outstationOvertime));
                analysisData.push({
                    id: chartData[i].id,
                    month: chartData[i].month,
                    year: chartData[i].year,
                    localTotal: Math.round(chartData[i].localTotalTime),
                    localOvertime: Math.round(chartData[i].localOvertime),
                    outstationTotal: Math.round(chartData[i].outstationTotalTime),
                    outstationOvertime: Math.round(chartData[i].outstationOvertime)
                });
            }
            $rootScope.analysisTableData = analysisData;
            if (quarter === 'First Quarter') {
                var data = {
                    "xData": ["Jan", "Feb", "Mar"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Second Quarter') {
                var data = {
                    "xData": ["Apr", "May", "Jun"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Third Quarter') {
                var data = {
                    "xData": ["Jul", "Aug", "Sep"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else {
                var data = {
                    "xData": ["Oct", "Nov", "Dec"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            }



            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        }); 
            }
            

        }else{
        BookingAnalysisData.find({
            filter: {
                where: {
                    year: currentYear,
                    month: {
                        inq: [firstMonth, secondMonth, thirdMonth]
                    },
                    location:$rootScope.operationCity

                }
            }
        }, function(chartData) {
            //console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                localTotalData.push(Math.round(chartData[i].localTotalTime));
                localOvertimeData.push(Math.round(chartData[i].localOvertime));
                outstationTotalData.push(Math.round(chartData[i].outstationTotalTime));
                outstationOvertimeData.push(Math.round(chartData[i].outstationOvertime));
                analysisData.push({
                    id: chartData[i].id,
                    month: chartData[i].month,
                    year: chartData[i].year,
                    localTotal: Math.round(chartData[i].localTotalTime),
                    localOvertime: Math.round(chartData[i].localOvertime),
                    outstationTotal: Math.round(chartData[i].outstationTotalTime),
                    outstationOvertime: Math.round(chartData[i].outstationOvertime)
                });
            }
            $rootScope.analysisTableData = analysisData;
            if (quarter === 'First Quarter') {
                var data = {
                    "xData": ["Jan", "Feb", "Mar"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Second Quarter') {
                var data = {
                    "xData": ["Apr", "May", "Jun"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else if (quarter === 'Third Quarter') {
                var data = {
                    "xData": ["Jul", "Aug", "Sep"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            } else {
                var data = {
                    "xData": ["Oct", "Nov", "Dec"],
                    "yData": [{
                        "name": "L - TT",
                        "data": localTotalData
                    }, {
                        "name": "L - OT",
                        "data": localOvertimeData
                    }, {
                        "name": "O - TT",
                        "data": outstationTotalData
                    }, {
                        "name": "O - OT",
                        "data": outstationOvertimeData
                    }]
                }
                $scope.lineChartYData = data.yData;
                $scope.lineChartXData = data.xData;
            }



            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        });
        }


    };
    $rootScope.fetchChartDataByYear = function(year) {


        //console.log('searchData is' + JSON.stringify(search));
        $rootScope.loader = 1;
        var localTotalData = [];
        var localOvertimeData = [];
        var outstationTotalData = [];
        var outstationOvertimeData = [];
        var analysisData = [];
        var Quarter = [];
        var currentYear = year;
        var localTotalDataQ1 = 0;
        var localTotalDataQ2 = 0;
        var localTotalDataQ3 = 0;
        var localTotalDataQ4 = 0;
        var localOvertimeDataQ1 = 0;
        var localOvertimeDataQ2 = 0;
        var localOvertimeDataQ3 = 0;
        var localOvertimeDataQ4 = 0;
        var outstationTotalDataQ1 = 0;
        var outstationTotalDataQ2 = 0;
        var outstationTotalDataQ3 = 0;
        var outstationTotalDataQ4 = 0;
        var outstationOvertimeDataQ1 = 0;
        var outstationOvertimeDataQ2 = 0;
        var outstationOvertimeDataQ3 = 0;
        var outstationOvertimeDataQ4 = 0;

        $rootScope.anlysisYear = currentYear;
            if($rootScope.roleId === '1'){
                if($rootScope.operationCitySelect === 'All'){
                    BookingAnalysisData.find({
            filter: {
                where: {
                    year: currentYear 
                }
            }
        }, function(chartData) {
           // console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                if (chartData[i].month === 'January' || chartData[i].month === 'February' || chartData[i].month === 'March') {
                    localTotalDataQ1 = localTotalDataQ1 + chartData[i].localTotalTime;
                    localOvertimeDataQ1 = localOvertimeDataQ1 + chartData[i].localOvertime;
                    outstationTotalDataQ1 = outstationTotalDataQ1 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ1 = outstationOvertimeDataQ1 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'April' || chartData[i].month === 'May' || chartData[i].month === 'June') {
                    localTotalDataQ2 = localTotalDataQ2 + chartData[i].localTotalTime;
                    localOvertimeDataQ2 = localOvertimeDataQ2 + chartData[i].localOvertime;
                    outstationTotalDataQ2 = outstationTotalDataQ2 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ2 = outstationOvertimeDataQ2 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'July' || chartData[i].month === 'August' || chartData[i].month === 'September') {
                    localTotalDataQ3 = localTotalDataQ3 + chartData[i].localTotalTime;
                    localOvertimeDataQ3 = localOvertimeDataQ3 + chartData[i].localOvertime;
                    outstationTotalDataQ3 = outstationTotalDataQ3 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ3 = outstationOvertimeDataQ3 + chartData[i].outstationOvertime;


                } else {
                    localTotalDataQ4 = localTotalDataQ4 + chartData[i].localTotalTime;
                    localOvertimeDataQ4 = localOvertimeDataQ4 + chartData[i].localOvertime;
                    outstationTotalDataQ4 = outstationTotalDataQ4 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ4 = outstationOvertimeDataQ4 + chartData[i].outstationOvertime;

                }

            }
            Quarter.push('Quarter-1');
            Quarter.push('Quarter-2');
            Quarter.push('Quarter-3');
            Quarter.push('Quarter-4');

            localTotalData.push(Math.round(localTotalDataQ1));
            localTotalData.push(Math.round(localTotalDataQ2));
            localTotalData.push(Math.round(localTotalDataQ3));
            localTotalData.push(Math.round(localTotalDataQ4));
            localOvertimeData.push(Math.round(localOvertimeDataQ1));
            localOvertimeData.push(Math.round(localOvertimeDataQ2));
            localOvertimeData.push(Math.round(localOvertimeDataQ3));
            localOvertimeData.push(Math.round(localOvertimeDataQ4));
            outstationTotalData.push(Math.round(outstationTotalDataQ1));
            outstationTotalData.push(Math.round(outstationTotalDataQ2));
            outstationTotalData.push(Math.round(outstationTotalDataQ3));
            outstationTotalData.push(Math.round(outstationTotalDataQ4));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ1));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ2));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ3));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ4));
            for (var j = 0; j < Quarter.length; j++) {
                analysisData.push({
                    Quarter: Quarter[j],
                    year: currentYear,
                    localTotal: localTotalData[j],
                    localOvertime: localOvertimeData[j],
                    outstationTotal: outstationTotalData[j],
                    outstationOvertime: outstationOvertimeData[j]
                });
            }
            $rootScope.analysisTableData = analysisData;
            var data = {
                "xData": ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4"],
                "yData": [{
                    "name": "L - TT",
                    "data": localTotalData
                }, {
                    "name": "L - OT",
                    "data": localOvertimeData
                }, {
                    "name": "O - TT",
                    "data": outstationTotalData
                }, {
                    "name": "O - OT",
                    "data": outstationOvertimeData
                }]
            }

            $scope.lineChartYData = data.yData;
            $scope.lineChartXData = data.xData;
            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        });
                }else{
                    BookingAnalysisData.find({
            filter: {
                where: {
                    year: currentYear,
                    location: $rootScope.operationCitySelect
                }
            }
        }, function(chartData) {
            //console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                if (chartData[i].month === 'January' || chartData[i].month === 'February' || chartData[i].month === 'March') {
                    localTotalDataQ1 = localTotalDataQ1 + chartData[i].localTotalTime;
                    localOvertimeDataQ1 = localOvertimeDataQ1 + chartData[i].localOvertime;
                    outstationTotalDataQ1 = outstationTotalDataQ1 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ1 = outstationOvertimeDataQ1 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'April' || chartData[i].month === 'May' || chartData[i].month === 'June') {
                    localTotalDataQ2 = localTotalDataQ2 + chartData[i].localTotalTime;
                    localOvertimeDataQ2 = localOvertimeDataQ2 + chartData[i].localOvertime;
                    outstationTotalDataQ2 = outstationTotalDataQ2 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ2 = outstationOvertimeDataQ2 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'July' || chartData[i].month === 'August' || chartData[i].month === 'September') {
                    localTotalDataQ3 = localTotalDataQ3 + chartData[i].localTotalTime;
                    localOvertimeDataQ3 = localOvertimeDataQ3 + chartData[i].localOvertime;
                    outstationTotalDataQ3 = outstationTotalDataQ3 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ3 = outstationOvertimeDataQ3 + chartData[i].outstationOvertime;


                } else {
                    localTotalDataQ4 = localTotalDataQ4 + chartData[i].localTotalTime;
                    localOvertimeDataQ4 = localOvertimeDataQ4 + chartData[i].localOvertime;
                    outstationTotalDataQ4 = outstationTotalDataQ4 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ4 = outstationOvertimeDataQ4 + chartData[i].outstationOvertime;

                }

            }
            Quarter.push('Quarter-1');
            Quarter.push('Quarter-2');
            Quarter.push('Quarter-3');
            Quarter.push('Quarter-4');

            localTotalData.push(Math.round(localTotalDataQ1));
            localTotalData.push(Math.round(localTotalDataQ2));
            localTotalData.push(Math.round(localTotalDataQ3));
            localTotalData.push(Math.round(localTotalDataQ4));
            localOvertimeData.push(Math.round(localOvertimeDataQ1));
            localOvertimeData.push(Math.round(localOvertimeDataQ2));
            localOvertimeData.push(Math.round(localOvertimeDataQ3));
            localOvertimeData.push(Math.round(localOvertimeDataQ4));
            outstationTotalData.push(Math.round(outstationTotalDataQ1));
            outstationTotalData.push(Math.round(outstationTotalDataQ2));
            outstationTotalData.push(Math.round(outstationTotalDataQ3));
            outstationTotalData.push(Math.round(outstationTotalDataQ4));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ1));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ2));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ3));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ4));
            for (var j = 0; j < Quarter.length; j++) {
                analysisData.push({
                    Quarter: Quarter[j],
                    year: currentYear,
                    localTotal: localTotalData[j],
                    localOvertime: localOvertimeData[j],
                    outstationTotal: outstationTotalData[j],
                    outstationOvertime: outstationOvertimeData[j]
                });
            }
            $rootScope.analysisTableData = analysisData;
            var data = {
                "xData": ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4"],
                "yData": [{
                    "name": "L - TT",
                    "data": localTotalData
                }, {
                    "name": "L - OT",
                    "data": localOvertimeData
                }, {
                    "name": "O - TT",
                    "data": outstationTotalData
                }, {
                    "name": "O - OT",
                    "data": outstationOvertimeData
                }]
            }

            $scope.lineChartYData = data.yData;
            $scope.lineChartXData = data.xData;
            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        });
                }
             

   
            }else{
                BookingAnalysisData.find({
            filter: {
                where: {
                    year: currentYear,
                    location:$rootScope.operationCity
                }
            }
        }, function(chartData) {
            //console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                if (chartData[i].month === 'January' || chartData[i].month === 'February' || chartData[i].month === 'March') {
                    localTotalDataQ1 = localTotalDataQ1 + chartData[i].localTotalTime;
                    localOvertimeDataQ1 = localOvertimeDataQ1 + chartData[i].localOvertime;
                    outstationTotalDataQ1 = outstationTotalDataQ1 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ1 = outstationOvertimeDataQ1 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'April' || chartData[i].month === 'May' || chartData[i].month === 'June') {
                    localTotalDataQ2 = localTotalDataQ2 + chartData[i].localTotalTime;
                    localOvertimeDataQ2 = localOvertimeDataQ2 + chartData[i].localOvertime;
                    outstationTotalDataQ2 = outstationTotalDataQ2 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ2 = outstationOvertimeDataQ2 + chartData[i].outstationOvertime;


                } else if (chartData[i].month === 'July' || chartData[i].month === 'August' || chartData[i].month === 'September') {
                    localTotalDataQ3 = localTotalDataQ3 + chartData[i].localTotalTime;
                    localOvertimeDataQ3 = localOvertimeDataQ3 + chartData[i].localOvertime;
                    outstationTotalDataQ3 = outstationTotalDataQ3 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ3 = outstationOvertimeDataQ3 + chartData[i].outstationOvertime;


                } else {
                    localTotalDataQ4 = localTotalDataQ4 + chartData[i].localTotalTime;
                    localOvertimeDataQ4 = localOvertimeDataQ4 + chartData[i].localOvertime;
                    outstationTotalDataQ4 = outstationTotalDataQ4 + chartData[i].outstationTotalTime;
                    outstationOvertimeDataQ4 = outstationOvertimeDataQ4 + chartData[i].outstationOvertime;

                }

            }
            Quarter.push('Quarter-1');
            Quarter.push('Quarter-2');
            Quarter.push('Quarter-3');
            Quarter.push('Quarter-4');

            localTotalData.push(Math.round(localTotalDataQ1));
            localTotalData.push(Math.round(localTotalDataQ2));
            localTotalData.push(Math.round(localTotalDataQ3));
            localTotalData.push(Math.round(localTotalDataQ4));
            localOvertimeData.push(Math.round(localOvertimeDataQ1));
            localOvertimeData.push(Math.round(localOvertimeDataQ2));
            localOvertimeData.push(Math.round(localOvertimeDataQ3));
            localOvertimeData.push(Math.round(localOvertimeDataQ4));
            outstationTotalData.push(Math.round(outstationTotalDataQ1));
            outstationTotalData.push(Math.round(outstationTotalDataQ2));
            outstationTotalData.push(Math.round(outstationTotalDataQ3));
            outstationTotalData.push(Math.round(outstationTotalDataQ4));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ1));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ2));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ3));
            outstationOvertimeData.push(Math.round(outstationOvertimeDataQ4));
            for (var j = 0; j < Quarter.length; j++) {
                analysisData.push({
                    Quarter: Quarter[j],
                    year: currentYear,
                    localTotal: localTotalData[j],
                    localOvertime: localOvertimeData[j],
                    outstationTotal: outstationTotalData[j],
                    outstationOvertime: outstationOvertimeData[j]
                });
            }
            $rootScope.analysisTableData = analysisData;
            var data = {
                "xData": ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4"],
                "yData": [{
                    "name": "L - TT",
                    "data": localTotalData
                }, {
                    "name": "L - OT",
                    "data": localOvertimeData
                }, {
                    "name": "O - TT",
                    "data": outstationTotalData
                }, {
                    "name": "O - OT",
                    "data": outstationOvertimeData
                }]
            }

            $scope.lineChartYData = data.yData;
            $scope.lineChartXData = data.xData;
            $rootScope.loader = 0;
        }, function(err) {
            console.log('chart error ' + JSON.stringify(err));
            $rootScope.loader = 0;
        });


            }
        

    };

    $rootScope.fetchChartData = function() {
        //console.log('searchData is' + JSON.stringify(search));
        $rootScope.loader = 1;

        var localTotalData = [];
        var localOvertimeData = [];
        var outstationTotalData = [];
        var outstationOvertimeData = [];
        var year = [];
        var analysisData = [];
        if($rootScope.roleId === '1'){

            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.dashboard');
                     $rootScope.loader = 0;
                }else{
                  BookingAnalysisData.getAnalysisDataofYears({
                    operationCity:$rootScope.operationCitySelect
        }, function(chartData) {
            console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                year.push(chartData[i].year);
                localTotalData.push(chartData[i].local_total_time);
                localOvertimeData.push(chartData[i].local_overtime);
                outstationTotalData.push(chartData[i].outstation_total_time);
                outstationOvertimeData.push(chartData[i].outstation_overtime);

                analysisData.push({

                    year: chartData[i].year,
                    localTotal: Math.round(chartData[i].local_total_time),
                    localOvertime: Math.round(chartData[i].local_overtime),
                    outstationTotal: Math.round(chartData[i].outstation_total_time),
                    outstationOvertime: Math.round(chartData[i].outstation_overtime)
                });

            }
            $rootScope.qrtr = false;
            $rootScope.month = false
            $rootScope.analysisTableData = analysisData;
            var data = {
                "xData": year,
                "yData": [{
                    "name": "L- TT",
                    "data": localTotalData
                }, {
                    "name": "L- OT",
                    "data": localOvertimeData
                }, {
                    "name": "O- TT",
                    "data": outstationTotalData
                }, {
                    "name": "O- OT",
                    "data": outstationOvertimeData
                }]
            }

            $scope.lineChartYData = data.yData;
            $scope.lineChartXData = data.xData;
            //console.log('anlysis data ' + JSON.stringify(chartData));
            $rootScope.loader = 0;
        }, function(err) {


            $rootScope.loader = 0;
        });  
                }
        }else{

        BookingAnalysisData.getAnalysisDataofYears({
            operationCity:$rootScope.operationCity
        }, function(chartData) {
            //console.log('anlysis data ' + JSON.stringify(chartData));
            for (var i = 0; i < chartData.length; i++) {
                year.push(chartData[i].year);
                localTotalData.push(chartData[i].local_total_time);
                localOvertimeData.push(chartData[i].local_overtime);
                outstationTotalData.push(chartData[i].outstation_total_time);
                outstationOvertimeData.push(chartData[i].outstation_overtime);

                analysisData.push({

                    year: chartData[i].year,
                    localTotal: Math.round(chartData[i].local_total_time),
                    localOvertime: Math.round(chartData[i].local_overtime),
                    outstationTotal: Math.round(chartData[i].outstation_total_time),
                    outstationOvertime: Math.round(chartData[i].outstation_overtime)
                });

            }
            $rootScope.qrtr = false;
            $rootScope.month = false
            $rootScope.analysisTableData = analysisData;
            var data = {
                "xData": year,
                "yData": [{
                    "name": "L- TT",
                    "data": localTotalData
                }, {
                    "name": "L- OT",
                    "data": localOvertimeData
                }, {
                    "name": "O- TT",
                    "data": outstationTotalData
                }, {
                    "name": "O- OT",
                    "data": outstationOvertimeData
                }]
            }

            $scope.lineChartYData = data.yData;
            $scope.lineChartXData = data.xData;
            //console.log('anlysis data ' + JSON.stringify(chartData));
            $rootScope.loader = 0;
        }, function(err) {


            $rootScope.loader = 0;
        });

    }



    };
    $rootScope.fetchBookingAnalysisDetails = function() {


        //console.log('searchData is' + JSON.stringify(search));
        $rootScope.loader = 1;
        $scope.data = $rootScope.analysisTableData;
        createTable();
        $rootScope.loader = 0;

    };
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

    $scope.dutyTypeArray = [{
        Id: 1,
        dutyType: 'Local'
    }, {
        Id: 2,
        dutyType: 'Outstation'
    }];

    $rootScope.getAnalysisHistory = function() {
        $rootScope.data = $rootScope.newBookingsData;
        $rootScope.customerData1 = $rootScope.newBookingsData;
        //console.log('searched data' + JSON.stringify($rootScope.data));
        createTable();
    }

    function createTable() {

        $scope.tableParams3 = new ngTableParams({
            page: 1, // show first page
            count: 60 // count per page

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



    
    $rootScope.fetchSearchedAnalysisDetails = function(frmDate, toDate) {

        $scope.isDisabledButton = true;
        $rootScope.loader = 1;
        var count = 0;

        var allBookingData = [];


        if ((angular.isUndefined(frmDate) || frmDate === '' || frmDate === null) && (angular.isUndefined(toDate) || toDate === '' || toDate === null)) {
            document.getElementById("frmDate").style.borderColor = "red";
            document.getElementById("frmDate1").innerHTML = '*required';

            document.getElementById("toDate").style.borderColor = "red";
            document.getElementById("toDate1").innerHTML = '*required';
            count++;
           

        } else {

            if (angular.isUndefined(frmDate) || frmDate === '' || frmDate === null) {
                document.getElementById("frmDate").style.borderColor = "red";
                document.getElementById("frmDate1").innerHTML = '*required';
                count++;
                

            } else {
                document.getElementById("frmDate").style.borderColor = "#dde6e9";
                document.getElementById("frmDate1").innerHTML = '';
            }
            if (angular.isUndefined(toDate) || toDate === '' || toDate === null) {
                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate1").innerHTML = '*required';
                count++;
               

            } else if (toDate < frmDate) {
                document.getElementById("toDate").style.borderColor = "red";
                document.getElementById("toDate1").innerHTML = 'To Date should be greater than From Date';
                count++;
              

            } else {
                document.getElementById("toDate").style.borderColor = "#dde6e9";
                document.getElementById("toDate1").innerHTML = '';
            }


        }

        if (count > 0) {
            $scope.count = count;
            $scope.isDisabledButton = false;
            $rootScope.loader = 0;
            return false;
        } else {
            $scope.count = 0;
            var startDate = 0;
            var endDate = 0;


            if (angular.isDefined(frmDate)) {
                startDate = moment(frmDate).format('YYYY-MM-DD');
               
            }
            if (angular.isDefined(toDate)) {

                endDate = moment(toDate).format('YYYY-MM-DD');
                
            }
            Bookings.getAnalysisData({
                fromDate: startDate,
                toDate: endDate,
                operationCity:$rootScope.operationCitySelect
            }, function(analysisData) {
                //console.log('analysisData' + JSON.stringify(analysisData));

                for (var i = 0; i < analysisData.length; i++) {


                    allBookingData.push({
                        localCount: analysisData[i].local_count,
                        localDriverShare: analysisData[i].local_drivershare,
                        localIDShare: analysisData[i].local_idshare,
                        localIDSharePercent: analysisData[i].local_idshare_percent,
                        localAutomatic: analysisData[i].local_automatic,
                        localLuxury: analysisData[i].local_luxury,
                        localManual: analysisData[i].local_manual,
                        localOneway: analysisData[i].local_oneway,
                        localRound: analysisData[i].local_round,
                        localReplacement: analysisData[i].local_replacement,
                        localOncall: analysisData[i].local_oncall,
                        localAvgIDShare: analysisData[i].local_avg_idshare,
                        outstationCount: analysisData[i].outstation_count,
                        outstationDriverShare: analysisData[i].outstation_drivershare,
                        outstationIDShare: analysisData[i].outstation_idshare,
                        outstationIDSharePercent: analysisData[i].outstation_idshare_percent,
                        outstationAutomatic: analysisData[i].outstation_automatic,
                        outstationLuxury: analysisData[i].outstation_luxury,
                        outstationManual: analysisData[i].outstation_manual,
                        outstationOneway: analysisData[i].outstation_oneway,
                        outstationRound: analysisData[i].outstation_round,
                        outstationReplacement: analysisData[i].outstation_replacement,
                        outstationOncall: analysisData[i].outstation_oncall,
                        outstationAvgIDShare: analysisData[i].outstation_avg_idshare,
                        localCancelled:analysisData[i].cancelled_local,
                        outstationCancelled:analysisData[i].cancelled_outstation,
                        createdByAdminLocal:analysisData[i].created_by_admin_local,
                        createdByCustomerAppLocal:analysisData[i].created_by_customer_local,
                        createdByAdminOutstation:analysisData[i].created_by_admin_outstation,
                        createdByCustomerAppOutstation:analysisData[i].created_by_customer_outstation,
                       
                        localCountTotal:analysisData[i].local_count_total,
                        localNewBooking:analysisData[i].local_count_new,
                        localLineUp:analysisData[i].local_count_line_up,
                        localOnDuty:analysisData[i].local_count_on_duty,
                        localDone:analysisData[i].local_count_done,
                        localPaid:analysisData[i].local_count_paid,
                        //localCancelled:analysisData[i].local_count_cancelled,

                        otstationCountTotal:analysisData[i].outstation_count_total,
                        otstationNewBooking:analysisData[i].outstation_count_new,
                        otstationLineUp:analysisData[i].outstation_count_line_up,
                        otstationOnDuty:analysisData[i].outstation_count_on_duty,
                        otstationDone:analysisData[i].outstation_count_done,
                        otstationPaid:analysisData[i].outstation_count_paid,
                       // otstationCancelled:analysisData[i].otstation_count_cancelled,
                        newCustomer:analysisData[i].new_customer_count



                    });
                }
                $rootScope.newBookingsData = allBookingData;
                //console.log('booking data****** ' + JSON.stringify($rootScope.newBookingsData));
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                $scope.orginalData = allBookingData;
                $scope.isDisabledButton = false;
                $state.go('app.dataAnalysisResult');
               
                $rootScope.loader = 0;

            }, function(analysisDataErr) {
                console.log('analysisDataErr' + JSON.stringify(analysisDataErr));
                $scope.isDisabledButton = false;
                $rootScope.driverId1 = undefined;
                $scope.mobileId = undefined;
                if (analysisDataErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;

            });



        }
    };

    $rootScope.fetchSearchedAnalysisDetailsByUser = function(userFromDate, userToDate) {

        $scope.isDisabledButton = true;
        $rootScope.loader = 1;
        var count = 0;

        var allBookingData = [];


        if (angular.isUndefined($scope.userConuserId) || $scope.userConuserId == null || $scope.userConuserId == '') {
            document.getElementById("userMobileNo").style.borderBottom = "1px solid red";
            document.getElementById("userMobileNo1").innerHTML = '*required';
            count++;

        } else {
            document.getElementById("userMobileNo").style.borderColor = "#dde6e9";
            document.getElementById("userMobileNo1").innerHTML = '';
        }
        if ((angular.isUndefined(userFromDate) || userFromDate === '' || userFromDate === null) && (angular.isUndefined(userToDate) || userToDate === '' || userToDate === null)) {
            document.getElementById("userFromDate").style.borderColor = "red";
            document.getElementById("userFromDate1").innerHTML = '*required';

            document.getElementById("userToDate").style.borderColor = "red";
            document.getElementById("userToDate1").innerHTML = '*required';
            count++;


        } else {

            if (angular.isUndefined(userFromDate) || userFromDate === '' || userFromDate === null) {
                document.getElementById("userFromDate").style.borderColor = "red";
                document.getElementById("userFromDate1").innerHTML = '*required';
                count++;


            } else {
                document.getElementById("userFromDate").style.borderColor = "#dde6e9";
                document.getElementById("userFromDate1").innerHTML = '';
            }
            if (angular.isUndefined(userToDate) || userToDate === '' || userToDate === null) {
                document.getElementById("userToDate").style.borderColor = "red";
                document.getElementById("userToDate1").innerHTML = '*required';
                count++;


            } else if (userToDate < userFromDate) {
                document.getElementById("userToDate").style.borderColor = "red";
                document.getElementById("userToDate1").innerHTML = 'To Date should be greater than From Date';
                count++;


            } else {
                document.getElementById("userToDate").style.borderColor = "#dde6e9";
                document.getElementById("userToDate1").innerHTML = '';
            }


        }

        if (count > 0) {
            $scope.count = count;
            $scope.isDisabledButton = false;
            $rootScope.loader = 0;
            return false;
        } else {
            $scope.count = 0;
            var startDate = 0;
            var endDate = 0;

            if (angular.isDefined(userFromDate)) {
                startDate = moment(userFromDate).format('YYYY-MM-DD');

            }
            if (angular.isDefined(userToDate)) {
                endDate = moment(userToDate).format('YYYY-MM-DD');

            }

            Bookings.getAnalysisDataByUser({
                userId: $scope.userConuserId,
                fromDate: startDate,
                toDate: endDate
            }, function(analysisData) {
                //console.log('analysisData' + JSON.stringify(analysisData));

                for (var i = 0; i < analysisData.length; i++) {


                    allBookingData.push({
                        bookingCount: analysisData[i].created_booking_count,
                        monthlyRequestCount: analysisData[i].monthly_request_count

                    });
                }
                $rootScope.analysisDataByUser = allBookingData;
                //console.log('analysis data by user****** ' + JSON.stringify($rootScope.analysisDataByUser));
                $scope.userConuserId = undefined;
                $rootScope.userCellNo = undefined;
                $scope.isDisabledButton = false;
                $state.go('app.dataAnalysisResultByUser');

                $rootScope.loader = 0;

            }, function(analysisDataErr) {
                console.log('analysisDataErr' + JSON.stringify(analysisDataErr));
                $scope.isDisabledButton = false;
                $scope.userConuserId = undefined;
                $rootScope.userCellNo = undefined;
                if (analysisDataErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');
                    $state.go('page.login');
                }

                $rootScope.loader = 0;

            });



        }
    };

    $scope.fetchUserDetails = function() {

        $rootScope.loader = 1;

        AgentDetails.find({
                filter: {
                    include: {
                        relation: 'conUsers'
                    }

                }
            }, function(userData) {

                //console.log('userData' + JSON.stringify(userData));
                $scope.analysisUserList = [];

                for (var i = 0; i < userData.length; i++) {
                    var mobNo = '';
                    var firstName = '';
                    var lastName = '';
                    if (!angular.isUndefined(userData[i].conUsers)) {
                        if (!angular.isUndefined(userData[i].conUsers.mobileNumber) || userData[i].conUsers.mobileNumber !== '' || userData[i].conUsers.mobileNumber !== null) {
                            mobNo = userData[i].conUsers.mobileNumber;
                        }

                        if (!angular.isUndefined(userData[i].conUsers.firstName) || userData[i].conUsers.firstName !== '' || userData[i].conUsers.firstName !== null) {
                            firstName = userData[i].conUsers.firstName;
                        }
                        if (!angular.isUndefined(userData[i].conUsers.lastName) || userData[i].conUsers.lastName !== '' || userData[i].conUsers.lastName !== null) {
                            lastName = userData[i].conUsers.lastName;
                        }
                    }

                    $scope.analysisUserList.push({
                        id: userData[i].id,
                        conuserId: userData[i].conuserId,
                        mobileNumber: mobNo,
                        userName: firstName + ' ' + lastName,
                        userDetails: firstName + ' ' + lastName + ' - ' + mobNo


                    });
                }

                //console.log('user List = ' + JSON.stringify($scope.analysisUserList));

                $rootScope.loader = 0;

            },
            function(custErr) {
                console.log('Error fetching existing mobile number : ' + JSON.stringify(custErr));
                if (custErr.status == 0) {
                    window.alert('Oops! You are disconnected from server.');

                }
                $rootScope.loader = 0;
            });
    };

    $scope.userMobileSelected = function() {

        if ($scope.search !== undefined && $scope.search.userMobileNumber !== undefined && $scope.search.userMobileNumber !== null) {
            //console.log('Search mobile : ' + JSON.stringify($scope.search.userMobileNumber));
            $scope.userConuserId = parseInt($scope.search.userMobileNumber.originalObject.conuserId);
            $rootScope.userCellNo = $scope.search.userMobileNumber.originalObject.mobileNumber;
            $rootScope.analysisUserName = $scope.search.userMobileNumber.originalObject.userName;
        }
    };
    $scope.toggleMin1 = function() {
        $scope.minDate1;
    };
    $scope.toggleMin1();
    $scope.openToDate1 = false;
    $scope.openedStart1 = false;
    $scope.openStart1 = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart1 = true;
        $scope.openToDate1 = false;

    };
    $scope.changeMin1 = function(minDt) {
        $scope.minToDate1 = $scope.minToDate1 ? null : minDt;
    };
    $scope.openedToDate1 = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.openToDate1 = true;
        $scope.openedStart1 = false;

    };

    $scope.dateOptions1 = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.ismeridian1 = true;
    $scope.toggleMode1 = function() {
        $scope.ismeridian1 = !$scope.ismeridian1;
    };
    $scope.backToChart = function() {
        $rootScope.anlysisYear = undefined;
        $localStorage.remove('chartSearchData');

        $state.go('app.dataAnalysisChart');

    }
    $scope.SearchCriteria = function() {

        $rootScope.driverId1 = undefined;
        $scope.mobileId = undefined;
        $rootScope.newBookingsData = undefined;
        $scope.userConuserId = undefined;
        $rootScope.userCellNo = undefined;
        $rootScope.analysisUserName = undefined;
        $rootScope.analysisDataByUser = undefined;
        $rootScope.analysisUserName = undefined;
        $state.go('app.dataAnalysisChart');

    }


    /*controller end*/
}
App.directive('chart', function() {
        return {
            restrict: 'E',
            template: '<div></div>',
            transclude: true,
            replace: true,
            scope: '=',
            link: function(scope, element, attrs) {
                console.log('oo', attrs, scope[attrs.formatter])
                var opt = {
                    chart: {
                        renderTo: element[0],
                        type: 'column',
                        marginRight: 130,
                        marginBottom: 40
                    },
                    title: {
                        text: attrs.title,
                        x: -20 //center
                    },
                    subtitle: {
                        text: attrs.subtitle,
                        x: -20
                    },
                    xAxis: {
                        //categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        tickInterval: 1,
                        title: {
                            text: attrs.xname
                        }
                    },
                    plotOptions: {
                        lineWidth: 0.5
                    },
                    yAxis: {
                        title: {
                            text: attrs.yname
                        },
                        tickInterval: (attrs.yinterval) ? new Number(attrs.yinterval) : null,
                        max: attrs.ymax,
                        min: attrs.ymin
                            //                    ,
                            //                    plotLines:[
                            //                        {
                            //                            value:0,
                            //                            width:1,
                            //                            color:'#808080'
                            //                        }
                            //                    ]
                    },
                    /*tooltip: {
                        formatter: scope[attrs.formatter] || function() {
                            return '<b>' + this.y + '</b>'
                        }
                    },*/
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
                }


                //Update when charts data changes
                scope.$watch(function(scope) {
                    return JSON.stringify({
                        xAxis: {
                            categories: scope[attrs.xdata]
                        },
                        series: scope[attrs.ydata]
                    });
                }, function(news) {
                    console.log('ola')
                        //                if (!attrs) return;
                    news = JSON.parse(news)
                    if (!news.series) return;
                    angular.extend(opt, news)
                    console.log('opt.xAxis.title.text', opt)




                    var chart = new Highcharts.Chart(opt);
                });
            }
        }

    })
    .filter('unique', function() {
        return function(collection, primaryKey, secondaryKey) { //optional secondary key
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key;
                secondaryKey === undefined ? key = item[primaryKey] : key = item[primaryKey][secondaryKey];

                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };
    });
