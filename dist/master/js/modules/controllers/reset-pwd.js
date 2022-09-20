App.controller('resetPwdCtrl', ['$scope', '$rootScope', '$filter', '$timeout', //ngTableDataService,
    'ConUsers', 'CustomerDetails', '$http', '$localStorage','$state',
    function($scope, $rootScope, $filter, $timeout, //ngTableDataService,
        ConUsers, CustomerDetails, $http, $localStorage,$state) {
        'use strict';



        $scope.verifyEmail = function(email) {


            $scope.EmailExist = false;
            if ((!angular.isUndefined(email)) && email !== '') {

                var mailTest = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (!mailTest.test(email)) {
                    document.getElementById("email").style.borderColor = "red";
                    document.getElementById("email1").innerHTML = 'Enter valid email';
                    $scope.EmailExist = true;
                    $scope.submitUserBtn = true;
                    return false;
                }
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';
                $scope.EmailExist = false;
                $scope.submitUserBtn = false;

            } else {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = 'Enter email';
                $scope.EmailExist = true;
                $scope.submitUserBtn = true;
            }


        };

        $scope.resetPassword = function(user) {
            if (angular.isUndefined(user) || user === '') {
                document.getElementById("email").style.borderColor = "red";
                document.getElementById("email1").innerHTML = '*required';


            } else {
                document.getElementById("email").style.borderColor = "#dde6e9";
                document.getElementById("email1").innerHTML = '';

                ConUsers.accountProvider({
                    emailId: user.email
                }, function(resetUser) {
                    if (resetUser.length > 0) {
                        //if (resetUser[0].provider === 'local') {
                        ConUsers.resetPassword({
                            email: user.email
                        }, function(status) {
                            window.alert('Password reset successfull, please check you email for further details.');
                            $state.go('page.login');
                        }, function(err) {
                            console.log('Password Reset Error: ' + JSON.stringify(err));
                            window.alert('Password reset un-successfull. Please try again later.');
                        });
                        /*} else {
                            $cordovaDialogs.alert('Email Id does not exist', 'Reset Password');
                        }*/
                    } else {
                        alert('Email Id does not exist');
                    }
                }, function(err) {
                    console.log('Password Reset Error: ' + JSON.stringify(err));
                    if (err.status === 503) {
                        window.alert('Service is not available. Please try again later.');
                    }else if(err.status===0){
                     window.alert('mail id not registerd.');

                    } else {
                        window.alert('Please enter a valid email.');
                    }

                });
            }

        };





        $(function() {

        });

    }
]).directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
}).directive('allowPattern', [allowPatternDirective]);

function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
                // I handle key events
                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                    // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                        event.preventDefault();
                        return false;
                    }

                });
            };
        }
    };
};
