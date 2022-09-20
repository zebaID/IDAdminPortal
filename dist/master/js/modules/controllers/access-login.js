/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$rootScope', '$http', '$state', 'ConUsers', '$cookieStore', '$localStorage', 'UserRoles', 'Cities', function($scope, $rootScope, $http, $state, ConUsers, $cookieStore, $localStorage, UserRoles, Cities) {

    
    $scope.account = {};
    
    $scope.authMsg = '';

    $rootScope.count = 0;

     $scope.callback = function(){

    var url = 'http://13.232.203.238:3000';
                        $http.get(url + '/oauth2callback').
                                                    success(function(result) {


                                                        }).
                                                    error(function(error) {
                                                        // $cordovaDialogs.alert('Error......');
                                                      //  console.log('Error in updating driver invoiceDetails:' + JSON.stringify(error));
                                                    });
      
    }

    //Creating and displaying alphanumeric captcha. 

    var code;
  //clear the contents of captcha div first 
  //document.getElementById('captcha').innerHTML = "";
  var charsArray =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&!*^";
  var lengthOtp = 4;
  var captcha = [];
  for (var i = 0; i < lengthOtp; i++) {
    //below code will not allow Repetition of Characters
    var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
    if (captcha.indexOf(charsArray[index]) == -1)
      captcha.push(charsArray[index]);
    else i--;
  }
  var canv = document.createElement("canvas");
  canv.id = "captcha";
  canv.width = 100;
  canv.height = 50;
  var ctx = canv.getContext("2d");
  ctx.font = "25px Georgia";
  ctx.strokeText(captcha.join(""), 0, 30);
  //storing captcha so that can validate you can save it somewhere else according to your specific requirements
  code = captcha.join("");
  var k = document.getElementById("captcha"); if (k != null)k.appendChild(canv);
  // adds the canvas to the body element
console.log(code);
$rootScope.captcha = code;

    $scope.signIn = function(user) {//login to admin portal
        $scope.authMsg = '';
        var email = user.email;
        var password = user.password;


        // Captcha Validation
  if (document.getElementById("cpatchaTextBox").value.length === 0) {
      // Error when captcha not entered
    document.getElementById('cError').innerHTML = '<span style="color:red;">Enter Captcha.</span>';
  }
  else if(document.getElementById("cpatchaTextBox").value !== $rootScope.captcha){
      // Validating Captcha
    document.getElementById('cError').innerHTML = '<span style="color:red;">Please Enter Valid Captcha.</span>';
  }
  else if(document.getElementById("cpatchaTextBox").value === $rootScope.captcha){ 

        if ((email !== "" && password !== "")) {

            ConUsers.login({//login service 
                    email: email,
                    password: password
                },
                function(value) {//login success block
                    $rootScope.operationCity = undefined;
                    $rootScope.operationCitySelect = undefined;
                   // console.log('login details' + JSON.stringify(value));
                    var loginname = value.user.firstName +' '+ value.user.lastName;
                    $cookieStore.put('loginName', loginname);//store login name in local storeage
                    if (value != null) {
                        if (user.remember == true) {
                            $cookieStore.put('remember', true);
                            $cookieStore.put('userPwd', user.password);
                        } else {
                            $cookieStore.put('remember', false);
                            $cookieStore.put('userPwd', null);
                        }
                        $cookieStore.put('userEmail', email);//storing email
                        window.localStorage['user.email'] = email;
                        var userId = value.userId;
                        var operationcity = value.user.operationCity;
                        $rootScope.operationCitySelect = operationcity;
                        $localStorage.put('operationCitySelect', operationcity);//store operation city of admin user
                        $localStorage.put('operationCity', operationcity);//store operation city of staff user
                        $localStorage.put('userId', userId);//store user id
                        
                        Cities.findOne({//fetch operation city
                            filter:{
                                where:{
                                   cityName:operationcity 
                                }
                            }
                        },function(city){
                           // console.log('cityName: '+JSON.stringify(city));
                            var cityId = city.id;
                            $localStorage.put('cityId', cityId);
                        },function(error){
                           // console.log('error: '+JSON.stringify(error));
                        });
                        $rootScope.userId = userId;
                        $rootScope.loginUserId = value.userId;
                        if (value.user.status == 'Active') {
                            UserRoles.findOne({
                                filter:{
                                    where: {
                                    conuserId: userId
                                }
                                }
                                
                            },function(success){
                                $rootScope.roleId = success.roleId;
                                $localStorage.put('roleId', $rootScope.roleId);
                                if($rootScope.roleId === '1'){
                                     
                                    //$localStorage.put('operationCity', operationcity);
                                    $localStorage.put('operationCityFlag', true);
                                     
                                }else{
                                    //$localStorage.put('operationCity', operationcity);
                                    $localStorage.put('operationCityFlag', false);
                                }
                                //console.log("user roles**" +JSON.stringify(success));
                                if(!angular.isUndefined(success.roleId) || success.roleId !== null || success.roleId !== ''){
                                    if(success.roleId === '2' || success.roleId === '3'){
                                        $scope.authMsg = 'User role not matched';
                                    }
                                    else{
                                        Cities.find({
                                            filter:{
         fields:['cityName'],
            order: 'cityName ASC'
    }

            },function(success){
                console.log('select cities :' +JSON.stringify(success));
                $rootScope.cities =[];
                 
                for(var i = 0; i< success.length ; i++){
                    if(success[i].cityName !== null){
                      $rootScope.cities.push(success[i].cityName);  
                    }
                    
                }
                 
                 $localStorage.put('cities', $rootScope.cities); 
                //console.log('select cities :' +JSON.stringify($rootScope.cities));
                 $state.go('app.dashboard');//go to dashboard

            },function(error){
                console.log('erro in city fetching' +JSON.stringify(error))
            });
                                        
                                    }
                                }
                            },function(error){
                               // console.log("error" +JSON.stringify(error));
                            });
                           
                        }else{
                             $scope.authMsg = 'User is not active';
                        }

                    } else {
                        $scope.authMsg = 'Error logging in. Please contact system admin.';
                    }
                },
                function(res) {
                    // error
                   //  console.log('Error: '+JSON.stringify(res));
                     if(res.status === 0){
                        $scope.authMsg = 'Offline';    
                     }
                     else if(document.getElementById('cpatchaTextBox').value !== code){
                        document.getElementById(cError).innerHTML="Please Enter Valid Captcha";
                    }
                    else{
                        //$localStorage.put(count, $rootScope.count);
                        $cookieStore.put('cEmail', $scope.account.email);
                        $rootScope.count++;
                        //$scope.authMsg = 'Enter valid credentials';

                        if ($rootScope.count === 1) {
                            $scope.authMsg = 'Enter valid credentials (2 attempts remaining)';
                        }

                        if ($rootScope.count === 2){
                            $scope.authMsg = 'Enter valid credentials (1 attempts remaining)';
                            
                        }
                        
                        if ($rootScope.count >= 3) {
                            
                            ConUsers.block({
                                //email: $scope.account.email,
                                email: $scope.account.email= $cookieStore.get('cEmail'),
            
                            },function(success){
                                $scope.authMsg = 'User Blocked';
                                console.log('user is blocked');
            
                            },function(error){
                                console.log(error);
            
                            });


                        }
                    }
                    
                });
        } else {
            if (email == "") {
                $scope.authMsg = 'Enter email';
            }
            else if (document.getElementById("cpatchaTextBox").value == ""){
                document.getElementById('cError').innerHTML="Please Enter Captcha";
            } 
            else if(password == ""){
                $scope.authMsg = 'Enter password';
            }

        }
    }

    };


    $scope.autoLogin = function() {
       // console.log('called autologin');
        if ($cookieStore.get('remember') === true &&
            $cookieStore.get('userEmail') !== undefined &&
            $cookieStore.get('userEmail') !== null &&
            $cookieStore.get('userPwd') !== undefined &&
            $cookieStore.get('userPwd') !== null) {
            $rootScope.loader = 1;
            ConUsers.login({
                    email: $cookieStore.get('userEmail'),
                    password: $cookieStore.get('userPwd')/*,
                    captcha:$scope.get('captcha')*/

                },
                function(value) {
                    //console.log('Success' + JSON.stringify(value));
                    if (value != null) {
                        if (value.user.status == 'Active') {
                        var userId = value.userId;
                        $localStorage.put('userId', userId);
                        $rootScope.userId = userId;
                        $rootScope.loader = 0;
                        $state.go('app.dashboard');
                    }else{
                         $scope.authMsg = 'User is not active';
                    }

                    }

                },
                function(res) {
                    // error
                    if (res.status === 401) {
                        $scope.authMsg = 'Please enter valid credentials';
                    } else if (res.status === 400) {
                        $scope.authMsg = 'Please enter valid email';
                    } else if (document.getElementById("cpatchaTextBox").value !== code) {
                        document.getElementById('cError').innerHTML = '<span style="color:red;">Please enter valid captcha.</span>';
                      }
                     else {
                        $scope.authMsg = 'Service is not available. Please try again later';
                    }

                  //  console.log('Login Error: ' + JSON.stringify([res]));
                    $rootScope.loader = 0;
                });
        }

    };

}]);
