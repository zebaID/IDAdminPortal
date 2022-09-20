/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

 App.controller('driverfileUploadCtrl', ['$scope', '$rootScope', '$http', '$state', 'ConUsers', '$cookieStore', '$localStorage', 'UserRoles', 'Cities', function($scope, $rootScope, $http, $state, ConUsers, $cookieStore, $localStorage, UserRoles, Cities) {

    $scope.uploadFile = function() {
      console.log('hi');
         $http.post('http://192.168.43.131:3000/uploadfile',$rootScope.files,
         {
          headers:{'Content-Type':'multipart/form-data'}
        }).success(function(d){
          console.log(d);

         })      
         
     };
 

}]);
