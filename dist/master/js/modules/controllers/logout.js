/**=========================================================
 * Module: logout.js
 
 =========================================================*/

App.controller('LogoutFormController', ['$scope', '$http', '$state', 'ConUsers',  '$cookieStore',
    '$localStorage',  '$rootScope','$cookies',
    function($scope, $http, $state, ConUsers, $cookieStore, $localStorage, $rootScope,$cookies) {
      
        $scope.logOutApp = function(){//logout from app
            $rootScope.loader = 1;
            $rootScope.operationCity = undefined;
                    $rootScope.operationCitySelect = undefined;
            $localStorage.empty();
            angular.forEach($cookies, function(v, k) {
                console.log('value  :'+k);
                $cookieStore.remove(k);
            });
            ConUsers.logout({

            },function(user){
                console.log('LogOut user '+ JSON.stringify(user));
            },function(error){
                 console.log('LogOut user error '+ JSON.stringify(error));
            });
            $rootScope.loader = 0;
            $state.go('page.login');
        };

       /* $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.loader = 1;
            $localStorage.empty();
            angular.forEach($cookies, function(v, k) {
                console.log('value  :'+k);
                $cookieStore.remove(k);
            });
            $rootScope.loader = 0;
            $state.go('page.login');




        });*/

/*

        //Called when the state changes
        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {



                $rootScope.loader = 1;
                $localStorage.empty();
                angular.forEach($cookieStore, function(v, k) {
                    $cookieStore.remove(k);
                });
                $rootScope.loader = 0;
                $state.go('page.login');



            });*/

    }
]);
