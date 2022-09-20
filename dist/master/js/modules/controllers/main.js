/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar','$stateParams','$http','APP_VALUES',
  function($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar,$stateParams,$http,appval) {
    "use strict";

    // Loading bar transition
    // ----------------------------------- 
    var url = appval.API_BASE_URL;
    var thBar;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(thBar);
          cfpLoadingBar.complete();
        });
    }); 
     $scope.searchById = function() {
        if($rootScope.roleId === '1'){
            if(angular.isUndefined($rootScope.operationCitySelect) || $rootScope.operationCitySelect === null){
                    window.alert('Please Select Operation City.'); 
                    $state.go('app.bookingHistory');
                      
                }else{
                    $state.go('app.bookingHistory');
                    $rootScope.history = true;
                   $scope.searchBooking = false;
                   $scope.shouldBeOpen = true;
                }
        }else{
            $state.go('app.bookingHistory');
            $rootScope.history = true;
            $scope.searchBooking = false;
        $scope.shouldBeOpen = true;
        }
        


    };
    // Hook not found
    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams) {
          console.log(unfoundState.to); // "lazy.state"
          console.log(unfoundState.toParams); // {a:1, b:2}
          console.log(unfoundState.options); // {inherit:false} + default options
      });
    // Hook error
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
      });
    // Hook success
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        // display new view from top
        $window.scrollTo(0, 0);
        // Save the route title
        $rootScope.currTitle = $state.current.title;
      });

    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function() {
      return $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
    };

    // iPad may presents ghost click issues
    // if( ! browser.ipad )
      // FastClick.attach(document.body);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
      if( newValue === false )
        $rootScope.$broadcast('closeSidebarMenu');
    });

    // Restore layout settings
    if( angular.isDefined($localStorage.layout) )
      $scope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $scope.app.layout;

    $rootScope.$watch("app.layout", function () {
      $localStorage.layout = $scope.app.layout;
    }, true);

    
    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}
    $scope.colorByName = colors.byName;

    // Hides/show user avatar on sidebar
    $scope.toggleUserBlock = function(){
      $scope.$broadcast('toggleUserBlock');
    };

    // Internationalization
    // ----------------------

    $scope.language = {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'en':       'English',
        'es_AR':    'Español'
      },
      // display always the current ui language
      init: function () {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
        $scope.language.selected = $scope.language.available[ (proposedLanguage || preferredLanguage) ];
      },
      set: function (localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        $scope.language.selected = $scope.language.available[localeId];
        // finally toggle dropdown
        $scope.language.listIsOpen = ! $scope.language.listIsOpen;
      }
    };

    $scope.language.init();

    // Restore application classes state
    toggle.restoreState( $(document.body) );

    // Applies animation to main view for the next pages to load
    $timeout(function(){
      $rootScope.mainViewAnimation = $rootScope.app.viewAnimation;
    });

    // cancel click event easily
    $rootScope.cancel = function($event) {
      $event.stopPropagation();
    };


     $scope.resetPasswordMain = function(Pwd) {//reset password
            var password = document.getElementById("passwordBox").value;
            var confirm = document.getElementById("passwordBox1").value;
            $rootScope.loader = 1;
            if (password === confirm) {

                 if (angular.isUndefined(password)) {
                    $.notify('Please Enter the Password', {
                        status: 'danger'
                    });
                    return false;
                }

                /*var anUpperCase = /[A-Z]/;
                var aLowerCase = /[a-z]/;
                var aNumber = /[0-9]/;
                var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

                if (password.length < 8) {
                    $.notify('Password should have minimum eight character', {
                        status: 'danger'
                    });

                    document.getElementById("passwordBox").value = '';
                    document.getElementById("passwordBox1").value = '';


                    return false;
                }

                var numUpper = 0;
                var numLower = 0;
                var numNums = 0;
                var numSpecials = 0;
                for (var i = 0; i < password.length; i++) {
                    // console.log('password inside for if=' + password);
                    if (anUpperCase.test(password[i])) {
                        numUpper++;
                    } else if (aLowerCase.test(password[i])) {
                        numLower++;
                    } else if (aNumber.test(password[i])) {
                        numNums++;
                    } else if (aSpecial.test(password[i])) {
                        numSpecials++;
                    }
                }

                if (numUpper < 1 || numLower < 1 || numNums < 1 || numSpecials < 1) {
                    //console.log('password inside second if=' + password);
                    $.notify('Password should have one Uppercase one LowerCase one Special and one Numerical character', {
                        status: 'danger'
                    });

                    document.getElementById("passwordBox").value = '';
                    document.getElementById("passwordBox1").value = '';
                    return false;
                }*/

                var accessToken = $stateParams.accessToken;

                //console.log(password + ' - ' + accessToken);

                $http.post(url + '/reset-password', {
                        password: password,
                        confirmation: confirm,
                        accessToken: accessToken
                    })
                    .success(function(data) { //success
                        $rootScope.loader = 0;
                        console.log('Success: ' + JSON.stringify(data)); //data from server
                        window.alert('Passwords reset successfully.');
                    })
                    .error(function(error) { //error
                        $rootScope.loader = 0;
                        console.log('Error: ' + JSON.stringify(error)); //data from server
                        window.alert('Passwords not reset, please try again.');
                    });
            } else {
                $.notify('Please enter valid confirm password', {
                    status: 'danger'
                });

                document.getElementById("passwordBox").value = '';
                document.getElementById("passwordBox1").value = '';

            }
        };

        $scope.validateConfirmPassword = function() {

            var password = document.getElementById("passwordBox").value;
            var confirmPassword = document.getElementById("passwordBox1").value;


            if (confirmPassword.length !== 0) {
                if (password === confirmPassword) {
                    document.getElementById("passtrength").innerHTML = 'Matched';
                    document.getElementById("passtrength").style.color = "green";

                } else {
                    document.getElementById("passtrength").innerHTML = '';

                }

            } else {
                document.getElementById("passtrength").innerHTML = '';

            }
        };

        $scope.validatePassword = function() {

            var password = document.getElementById("passwordBox").value;
            var confirmPassword = document.getElementById("passwordBox1").value;

            if (password.length !== 0) {
                if (password === confirmPassword) {
                    document.getElementById("passtrength").innerHTML = 'Matched';
                    document.getElementById("passtrength").style.color = "green";

                } else {
                    document.getElementById("passtrength").innerHTML = '';

                }

            } else {
                document.getElementById("passtrength").innerHTML = '';

            }

            /*if (password.length !== 0) {
                var anUpperCase = /[A-Z]/;
                var aLowerCase = /[a-z]/;
                var aNumber = /[0-9]/;
                var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;



                if (password.length < 8) {



                    document.getElementById("passstrength").innerHTML = 'Weak';
                    document.getElementById("passstrength").style.color = "red";
                    //document.getElementById("passwordBox").style.backgroundColor = 'red'

                    return false;
                }

                var numUpper = 0;
                var numLower = 0;
                var numNums = 0;
                var numSpecials = 0;
                for (var i = 0; i < password.length; i++) {
                    // console.log('password inside for if=' + password);
                    if (anUpperCase.test(password[i])) {
                        numUpper++;
                    } else if (aLowerCase.test(password[i])) {
                        numLower++;
                    } else if (aNumber.test(password[i])) {
                        numNums++;
                    } else if (aSpecial.test(password[i])) {
                        numSpecials++;
                    }
                }

                if (numUpper < 1 || numLower < 1 || numNums < 1 || numSpecials < 1) {
                    document.getElementById("passstrength").innerHTML = 'Medium';
                    document.getElementById("passstrength").style.color = "cyan";
                    return false;
                } else {
                    document.getElementById("passstrength").innerHTML = 'Strong';
                    document.getElementById("passstrength").style.color = "green";
                    return false;

                }

            } else {

                document.getElementById("passstrength").innerHTML = '';
                // document.getElementById("passwordBox").style.backgroundColor = 'white';
            }*/

        };

        $scope.resetPassword = function() {

            var pwd = $scope.pwd;
            var cPwd = $scope.cPwd;

            console.log('In savePassword ' + JSON.stringify(pwd));
            if (angular.isUndefined(pwd) || pwd === null || pwd === '') {
                window.alert('Please enter passwords', 'Reset Password');
            } else {
                if (pwd !== cPwd) {
                    window.alert('Passwords don\'t match.', 'Reset Password');
                } else {

                    var accessToken = $stateParams.accessToken;

                    console.log(pwd + ' - ' + accessToken);

                    $http.post(url + '/reset-password', {
                            password: pwd,
                            confirmation: cPwd,
                            accessToken: accessToken
                        })
                        .success(function(data) { //success
                            console.log('Success: ' + JSON.stringify(data)); //data from server
                            window.alert('Passwords reset successfully.');
                        })
                        .error(function(error) { //error
                            console.log('Error: ' + JSON.stringify(error)); //data from server
                            window.alert('Passwords not reset, please try again.');
                        });
                }
            }
        };

}]);
