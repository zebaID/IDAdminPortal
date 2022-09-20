/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES', 'RouteHelpersProvider',
        function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appRequires, helper) {
            'use strict';

            App.controller = $controllerProvider.register;
            App.directive = $compileProvider.directive;
            App.filter = $filterProvider.register;
            App.factory = $provide.factory;
            App.service = $provide.service;
            App.constant = $provide.constant;
            App.value = $provide.value;

            // LAZY MODULES
            // ----------------------------------- 

            $ocLazyLoadProvider.config({
                debug: false,
                events: true,
                modules: appRequires.modules
            });


            // defaults to dashboard
            $urlRouterProvider.otherwise('/page/login');

            // 
            // Application Routes
            // -----------------------------------   
            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: helper.basepath('app.html'),
                    controller: 'AppController',
                    resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl','ngTable', 'ngTableExport')
                })
                .state('app.dashboard', {
                    url: '/dashboard',
                    title: 'Dashboard',
                    templateUrl: helper.basepath('dashboard.html'),
                    controller: 'dashboardController',
                    resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins','ngTable', 'ngTableExport')
                })
                .state('app.manageBooking', {
                    url: '/manageBooking',
                    title: 'Manage Booking',
                    templateUrl: helper.basepath('manage-booking.html'),
                    controller: 'NullController',
                    resolve: helper.resolveFor('loadGoogleMapsJS', function() {
                        return loadGoogleMaps();
                    }, 'google-map','moment')
                })
                .state('app.dailyBookingReport', {
                    url: '/dailyBookingReport',
                    title: 'Daily Booking Report',
                    templateUrl: helper.basepath('daily-booking-report.html'),
                    controller: 'dailyBookingCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.searchEnquiry', {
                    url: '/searchEnquiry',
                    title: 'Search Enquiry',
                    templateUrl: helper.basepath('searchEnquiry.html'),
                    controller: 'dailyBookingCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.news', {
                    url: '/news',
                    title: 'Daily Booking Report',
                    templateUrl: helper.basepath('news.html'),
                    controller: 'dailyBookingCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.driverLedger', {
                    url: '/driverLedger',
                    title: 'Driver Ledger',
                    templateUrl: helper.basepath('driver-ledger.html'),
                    controller: 'dailyCollectionCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.enquiry', {
                    url: '/enquiry',
                    title: 'Driver and Customer enquiry',
                    templateUrl: helper.basepath('enquiry.html'),
                    controller: 'dailyBookingCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.idLedger', {
                    url: '/idLedger',
                    title: 'Id Ledger',
                    templateUrl: helper.basepath('id-ledger.html'),
                    controller: 'idLedgerCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
               .state('app.fareDetails', {
                    url: '/fareDetails',
                   title: 'Fare Details',
                   templateUrl: helper.basepath('fare-details.html'),
                   controller: 'fareDetailsCtrl',
                   resolve: helper.resolveFor('ngTable', 'ngTableExport')
               })
                .state('app.manageUser', {
                    url: '/manageUser',
                    title: 'Manage User',
                    templateUrl: helper.basepath('manage-user.html'),
                    controller: 'manageUserCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                 .state('app.addUser', {
                     url: '/addUser',
                    title: 'Add User',
                    templateUrl: helper.basepath('add-user.html'),
                    controller: 'manageUserCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle')
                })
                 .state('app.searchDriver', {
                    url: '/searchDriver',
                    title: 'Search Driver',
                    templateUrl: helper.basepath('driver-search.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.manageDriver', {
                    url: '/manageDriver',
                    title: 'Manage Driver',
                    templateUrl: helper.basepath('manage-driver.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.searchDriverAgain', {
                    url: '/searchDriverAgain',
                    title: 'Search Driver',
                    templateUrl: helper.basepath('search-driver.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.searchDriverWithPv', {
                    url: '/searchDriverWithPv',
                    title: 'Search Driver',
                    templateUrl: helper.basepath('searchDriverWithPv.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.searchDriverCityOther', {
                    url: '/searchDriverCityOther',
                    title: 'Search Driver Other City',
                    templateUrl: helper.basepath('searchDriverWithOther.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.searchDriverDetailsEx', {
                    url: '/searchDriverDetailsEx',
                    title: 'Search DL Expiry Driver',
                    templateUrl: helper.basepath('searchPvDriverDetailsEx.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.driverSettlement', {
                    url: '/driverBookingHistory',
                    title: 'Settlement Report',
                    templateUrl: helper.basepath('driver-settlement-report.html'),
                    controller: 'manageSettlementReport',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.addDriver', {
                     url: '/addDriver',
                    title: 'Add Driver',
                    templateUrl: helper.basepath('add-driver.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.manageDriverWithCar', {
                     url: '/manageDriverWithCar',
                    title: 'Manage Driver With Car',
                    templateUrl: helper.basepath('manage-driver-with-car.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle')
                })
               .state('app.manageCustomer', {
                    url: '/manageCustomer',
                    title: 'Manage Customer',
                    templateUrl: helper.basepath('manage-customer.html'),
                    controller: 'manageCustomerCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle')
                })
               .state('app.searchCustomer', {
                    url: '/searchCustomer',
                    title: 'Search Customer',
                    templateUrl: helper.basepath('searchCustomer.html'),
                    controller: 'manageCustomerCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle')
                })
                 .state('app.addCustomer', {
                     url: '/addCustomer',
                    title: 'Add Customer',
                    templateUrl: helper.basepath('add-customer.html'),
                    controller: 'manageCustomerCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                   .state('app.fareCalculator', {
                     url: '/fareCalculator',
                    title: 'Fare Calculator',
                    templateUrl: helper.basepath('fare-calculator.html'),
                    controller: 'fareCalcCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.settlementReport', {
                    url: '/settlementReport',
                    title: 'Settlement Report',
                    templateUrl: helper.basepath('settelled-report.html'),
                    controller: 'settlementCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                  .state('app.paymentCycle', {
                    url: '/paymentCycle',
                    title: 'Payment Cycle',
                    templateUrl: helper.basepath('payment-cycle.html'),
                    controller: 'paymentCycleCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.paymentCycleBookingDetails', {
                    url: '/paymentCycleBookingDetails',
                    title: 'Payment Cycle Booking Details',
                    templateUrl: helper.basepath('payment-cycle-booking-details.html'),
                    controller: 'paymentCycleCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.paymentCycleReport', {
                    url: '/paymentCycleReport',
                    title: 'Payment Cycle Report',
                    templateUrl: helper.basepath('search-payment-cycle.html'),
                    controller: 'paymentCycleReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.paymentCycleResult', {
                    url: '/paymentCycleResult',
                    title: 'Payment Cycle Result',
                    templateUrl: helper.basepath('payment-cycle-result.html'),
                    controller: 'paymentCycleReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.paymentCycleDriverDetails', {
                    url: '/paymentCycleDriverDetails',
                    title: 'Payment Cycle Driver Details',
                    templateUrl: helper.basepath('payment-cycle-driver-details.html'),
                    controller: 'paymentCycleReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                }) 
                   .state('app.paymentCyclePrint', {
                    url: '/paymentCyclePrint',
                    title: 'Payment Cycle',
                    templateUrl: helper.basepath('print.html'),
                    controller: 'paymentCycleReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                }) 
                    .state('app.paymentCycleDetails', {
                    url: '/paymentCycleDetails', 
                    title: 'Payment Cycle Details',
                    templateUrl: helper.basepath('payment-cycle-details.html'),
                    controller: 'paymentCycleDetailsCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.paymentCycleDetailsdriver', {
                    url: '/paymentCycleDetailsdriver',
                    title: 'Generate Payment Cycle Details',
                    templateUrl: helper.basepath('generate-payment-cycle.html'),
                    controller: 'paymentCycleDetailsCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.delayBookingReport', {
                    url: '/delayBookingReport',
                    title: 'Delay Booking Report',
                    templateUrl: helper.basepath('delay-booking-report.html'),
                    controller: 'delayBookingCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.configure', {
                    url: '/configure',
                    title: 'Configure',
                    templateUrl: helper.basepath('configure.html'),
                    controller: 'configureCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                    .state('app.bookingHistoryResult', {
                    url: '/bookingHistoryResult',
                    title: 'Search History Data',
                    templateUrl: helper.basepath('bookingsearch-result.html'),
                    controller: 'bookingHistoryCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                  .state('app.bookingHistory', {
                    url: '/bookingHistory',
                    title: 'BookingHistory',
                    templateUrl: helper.basepath('booking-history.html'),
                    controller: 'bookingHistoryCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                   .state('app.lookingForPermanentDriver', {
                    url: '/lookingForPermanentDriver',
                    title: 'LookingForPermanentDriver',
                    templateUrl: helper.basepath('lookingforpermanent-driver.html'),
                    controller: 'permanentdriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })

                   .state('app.searchMonthlyDriverRequest', {
                    url: '/searchMonthlyDriverRequest',
                    title: 'LookingForPermanentDriver',
                    templateUrl: helper.basepath('searchMonthlyDriverRequest.html'),
                    controller: 'permanentdriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })

                .state('app.dataAnalysisChart', {
                    url: '/dataAnalysisChart',
                    title: 'Data Analysis Chart',
                    templateUrl: helper.basepath('data-analysis-chart.html'),
                    controller: 'dataAnalysisCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.dataAnalysisReport', {
                    url: '/dataAnalysisReport',
                    title: 'Data Analysis Report',
                    templateUrl: helper.basepath('data-analysis-report.html'),
                    controller: 'dataAnalysisCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })  

                .state('app.dataAnalysisSearch', {
                    url: '/dataAnalysisSearch',
                    title: 'Data Analysis Search',
                    templateUrl: helper.basepath('data-analysis-search.html'),
                    controller: 'dataAnalysisCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.dataAnalysisResult', {
                    url: '/dataAnalysisResult',
                    title: 'Data Analysis Result',
                    templateUrl: helper.basepath('data-analysis-result.html'),
                    controller: 'dataAnalysisCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                   .state('app.dataAnalysisResultByUser', {
                    url: '/dataAnalysisResultByUser',
                    title: 'Data Analysis Result By User',
                    templateUrl: helper.basepath('data-analysis-result-by-user.html'),
                    controller: 'dataAnalysisCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.multiplePaymentSearch', {
                    url: '/multiplePaymentSearch',
                    title: 'Multiple Payment Search',
                    templateUrl: helper.basepath('multiple-payment-search.html'),
                    controller: 'multiplePaymentCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })  
                   .state('app.multiplePaymentDetails', {
                    url: '/multiplePaymentDetails',
                    title: 'Multiple Payment Details',
                    templateUrl: helper.basepath('multiple-payment.html'),
                    controller: 'multiplePaymentCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })   

                   .state('app.collectionReport', {
                    url: '/collectionReport',
                    title: 'Collection Report',
                    templateUrl: helper.basepath('search-collection-booking.html'),
                    controller: 'collectionReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                   .state('app.collectionReportDetails', {
                    url: '/collectionReportDetails',
                    title: 'Collection Report Details',
                    templateUrl: helper.basepath('collection-report.html'),
                    controller: 'collectionReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                    .state('app.driverAccount', {
                    url: '/driverAccount',
                    title: 'Driver Account',
                    templateUrl: helper.basepath('driver-account.html'),
                    controller: 'driverAccountCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                    .state('app.driverTransactionHistory', {
                    url: '/driverTransactionHistory',
                    title: 'Driver Transaction History',
                    templateUrl: helper.basepath('driver-transaction-history.html'),
                    controller: 'driverTransactionCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                    .state('app.driver-transaction-history_byDate', {
                    url: '/driver-transaction-history_byDate',
                    title: 'Driver Transaction History By Date',
                    templateUrl: helper.basepath('driver-transaction-history_byDate.html'),
                    controller: 'driverTransactionCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                 .state('app.monthlyCustomerBilling', {
                    url: '/monthlyCustomerBilling',
                    title: 'Monthly Customer Billing',
                    templateUrl: helper.basepath('search-billing-customer.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                 .state('app.searchBillById', {
                    url: '/searchBillById',
                    title: 'Monthly Customer Billing',
                    templateUrl: helper.basepath('search-bill-by-id.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.billingCustomerDetails', {
                    url: '/billingCustomerDetails',
                    title: 'Billing Customer Details',
                    templateUrl: helper.basepath('billing-customer-details.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.multipleBill', {
                    url: '/multipleBill',
                    title: 'Multiple Billing Details',
                    templateUrl: helper.basepath('multipleBill.html'),
                    controller: 'multipleBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.updateMultipleBill', {
                    url: '/updateMultipleBill',
                    title: 'Multiple Billing Details',
                    templateUrl: helper.basepath('updateMultipleBill.html'),
                    controller: 'multipleBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
              
                 .state('app.billingCustomerDetails1', {
                    url: '/billingCustomerDetails1',
                    title: 'Billing Customer Details',
                    templateUrl: helper.basepath('bill_details.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.selectCompany', {
                    url: '/selectCompany',
                    title: 'Select Company',
                    templateUrl: helper.basepath('select-company.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                 .state('app.billPrintPage', {
                    url: '/billPrintPage',
                    title: 'Bill Print Page',
                    templateUrl: helper.basepath('bill-print-page.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                  .state('app.otherBillPrintPage', {
                    url: '/otherBillPrintPage',
                    title: 'Other Bill Print Page',
                    templateUrl: helper.basepath('other-bill-print-page.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                  .state('app.multiplebillPrintPage', {
                    url: '/multiplebillPrintPage',
                    title: 'multiple Bill Print Page',
                    templateUrl: helper.basepath('multiple-bill-print-page.html'),
                    controller: 'multipleBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.searchJob', {
                    url: '/searchJob',
                    title: 'searchJob',
                    templateUrl: helper.basepath('search-job-report.html'),
                    controller: 'driverJobCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                 .state('app.jobReport', {
                    url: '/jobReport',
                    title: 'jobReport',
                    templateUrl: helper.basepath('job-details.html'),
                    controller: 'driverJobCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })

                 .state('app.jobRequestReport', {
                    url: '/jobRequestReport',
                    title: 'jobRequestReport',
                    templateUrl: helper.basepath('job-request-details.html'),
                    controller: 'driverJobCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.searchedJobRequest', {
                    url: '/searchedJobRequest',
                    title: 'searchedJobRequest',
                    templateUrl: helper.basepath('searched-job-request.html'),
                    controller: 'searchedJobRequestCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                 .state('app.searchedJobReport', {
                    url: '/searchedJobReport',
                    title: 'searchedJobReport',
                    templateUrl: helper.basepath('searched-job-report.html'),
                    controller: 'searchedJobReportCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                 .state('app.customerBillReport', {
                    url: '/customerBillReport',
                    title: 'Customer Bill Report',
                    templateUrl: helper.basepath('customer-bill-report.html'),
                    controller: 'customerBillCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                 .state('app.driverJobRequestHistory', {
                    url: '/driverJobRequestHistory',
                    title: 'Driver Job Request History',
                    templateUrl: helper.basepath('driver-job-request-history.html'),
                    controller: 'driverJobRequestHistoryCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                  .state('app.recharge', {
                    url: '/rechargeDrivers',
                    title: 'Driver Recharge',
                    templateUrl: helper.basepath('rechargeDrivers.html'),
                    controller: 'manageDriverCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                  .state('app.rateCard', {
                    url: '/rateCard',
                    title: 'Rate Card',
                    templateUrl: helper.basepath('rateCard.html'),
                    controller: 'dashboardController',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                  .state('app.map', {
                    url: '/map',
                    title: 'Map',
                    templateUrl: helper.basepath('map.html'),
                    controller: 'dashboardController',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                .state('app.driverAttendance', {
                    url: '/driverAttendance',
                    title: 'Driver Attendance',
                    templateUrl: helper.basepath('driver-attendance.html'),
                    controller: 'driverAttendanceCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                
                .state('app.fileUpload', {
                    url: '/fileUpload',
                    title: 'Driver fileUpload Details',
                    templateUrl: helper.basepath('fileUpload.html'),
                    controller: 'driverfileUploadCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                .state('app.billingAttendanceDetails', {
                    url: '/billingAttendanceDetails',
                    title: 'Billing Attendance Details',
                    templateUrl: helper.basepath('billing-attendance-details.html'),
                    controller: 'driverAttendanceCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })

                .state('app.driverAttendanceDetails', {
                    url: '/driverAttendanceDetails',
                    title: 'Driver Attendance Details',
                    templateUrl: helper.basepath('driver-details.html'),
                    controller: 'driverAttendanceCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.otherJobs', {
                    url: '/otherJobs',
                    title: 'Other Jobs',
                    templateUrl: helper.basepath('other-jobs.html'),
                    controller: 'otherJobsCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
                .state('app.otherJobsReport', {
                    url: '/otherJobsReport',
                    title: 'otherJobsReport',
                    templateUrl: helper.basepath('other-jobs-details.html'),
                    controller: 'otherJobsCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport','angularFileUpload', 'filestyle','taginput','inputmask','codemirror', 'codemirror-plugins','localytics.directives','ngWig')
                })
                .state('app.otherJobsRequestReport', {
                    url: '/otherJobsRequestReport',
                    title: 'otherJobsRequestReport',
                    templateUrl: helper.basepath('other-jobs-request-details.html'),
                    controller: 'otherJobsCtrl',
                    resolve: helper.resolveFor('ngTable', 'ngTableExport')
                })
 
 
                // 
                // Single Page Routes
                // ----------------------------------- 
                .state('page', {
                    url: '/page',
                    templateUrl: 'app/pages/page.html',
                    resolve: helper.resolveFor('modernizr', 'icons', 'parsley')
                })
                 .state('page.logout', {
                    url: '/logout',
                    templateUrl: 'app/pages/logout.html'
                })
                .state('page.login', {
                    url: '/login',
                    title: "Login",
                    templateUrl: 'app/pages/login.html'
                })
                .state('page.register', {
                    url: '/register',
                    title: "Register",
                    templateUrl: 'app/pages/register.html'
                })
                .state('page.recover', {
                    url: '/recover',
                    title: "Recover",
                    templateUrl: 'app/pages/recover.html'
                })
                .state('page.lock', {
                    url: '/lock',
                    title: "Lock",
                    templateUrl: 'app/pages/lock.html'
                })
                .state('page.resetPassword', {
                    url: '/resetPassword/:accessToken',
                    title: "Reset Password",
                    templateUrl: 'app/pages/reset-password.html',
                    controller: 'AppController'
                })
                .state('page.forgetPassword', {
                    url: '/forgetPassword',
                    title: "Reset Password",
                    templateUrl: 'app/pages/reset.html',
                    controller: 'resetPwdCtrl'
                })
                .state('page.404', {
                    url: '/404',
                    title: "Not Found",
                    templateUrl: 'app/pages/404.html'
                })
                // 
                // CUSTOM RESOLVES
                //   Add your own resolves properties
                //   following this object extend
                //   method
                // ----------------------------------- 
                // .state('app.someroute', {
                //   url: '/some_url',
                //   templateUrl: 'path_to_template.html',
                //   controller: 'someController',
                //   resolve: angular.extend(
                //     helper.resolveFor(), {
                //     // YOUR RESOLVES GO HERE
                //     }
                //   )
                // })
            ;


        }
    ]).config(['$translateProvider', function($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();
        $translateProvider.usePostCompiling(true);

    }]).config(['tmhDynamicLocaleProvider', function(tmhDynamicLocaleProvider) {

        tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

        // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }])
    .controller('NullController', function() {});
