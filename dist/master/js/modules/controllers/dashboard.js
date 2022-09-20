App.controller('dashboardController', function($rootScope,$scope, $timeout,$state,UserRoles,$localStorage,ConUsers, $cookieStore, Cities, RateCard, $sce){
    $rootScope.loginUserName = $cookieStore.get('loginName');
    $rootScope.operationCity = $localStorage.get('operationCity');
    $rootScope.operationCityFlag = $localStorage.get('operationCityFlag');
     $rootScope.operationCitySelect = $localStorage.get('operationCitySelect');
    // console.log('oc'+JSON.stringify($rootScope.operationCity));
    // console.log('ocf'+JSON.stringify($rootScope.operationCityFlag));

     $scope.manageBooking = function()
     {
        
         $state.go('app.manageBooking');
           
     };

     $scope.dailyCollection = function()
     {
        //console.log('called daily collection report');
        $state.go('app.dailyCollectionReport');
     
     };
     $scope.rateCardData = function() {
                
                 Cities.findOne({
                        filter:{
                           where:{
                            cityName:$rootScope.operationCitySelect
                        } 
                        }
                        
                        },function(success){
                            $rootScope.operationCityId=success.id;
                            $rootScope.callUs = success.contactNumber;
 
                                RateCard.findOne({
                        filter: {
                            where: {
                                type: 'Admin',
                                operationCityId:$rootScope.operationCityId
                            }
                        }
                    },
                    function(rateCardsuc) {

                        $scope.rateCardDetail = $sce.trustAsHtml(rateCardsuc.rateCardHtml);
                     //   console.log( $scope.rateCardDetail);

                    },
                    function(ratecarderr) {

                    });
                        },function(r){
                    });
                
            };
     $rootScope.getCities = function() {
            Cities.find({
                filter:{
         fields:['cityName'],
            order: 'cityName ASC'
    }
            },function(success){
               // console.log('select cities :' +JSON.stringify(success));
                $rootScope.cities =[];
                 
                for(var i = 0; i< success.length ; i++){
                    if(success[i].cityName !== null){
                      $rootScope.cities.push(success[i].cityName);  
                    }
                    
                }
                 
                 $localStorage.put('cities', $rootScope.cities); 
                //console.log('select cities :' +JSON.stringify($rootScope.cities));
                 

            },function(error){
                console.log('erro in city fetching' +JSON.stringify(error))
            });
        }
        
      $rootScope.getUserforSelectedCity = function(city){
            $rootScope.operationCitySelect = city;
           // console.log('city: '+JSON.stringify(city));
            $localStorage.put('operationCitySelect', $rootScope.operationCitySelect);
             $state.go('app.dashboard');
             
        }
      $scope.dailyReport = function()
     {
       // console.log('called daily booking report');
        $state.go('app.dailyBookingReport');
     
     };

      $scope.manageCustomer = function()
     {
        $state.go('app.manageCustomer');
    
     };

      $scope.manageDriver = function()
     {
        $state.go('app.manageDriver');
    
     };
      $scope.manageUser = function()
     {
        $state.go('app.manageUser');
     };
      $scope.settelledReport = function()
     {
        $state.go('app.settelledReport');
     };

      $scope.delayBookingReport = function()
     {
       // console.log('called daily booking report');
        $state.go('app.delayBookingReport');
     
     };

      function fetchTiles() {//fetch tiles for respective users for dashboard
        $rootScope.loader = 1;
        $scope.tileList = [];
        UserRoles.fetchTiles({
            conUserId: $localStorage.get('userId')
        }, function (tiles) {
            $rootScope.loader = 0;
           for(var i = 0; i<tiles.length; i++){
            
            if(tiles[i].tileId === "7"|| tiles[i].tileId === "8"){
                
            }else{
                $scope.tileList.push(tiles[i]);
            }
        } 
            //$scope.tileList = tiles;
            
            //console.log('Tile list: ' + JSON.stringify(tiles));
        }, function (tileError) {
            $rootScope.loader = 0;
            console.log('Tile list: ' + JSON.stringify(tileError));
        });
    }

     $rootScope.fetchUserDetails=function(){
        ConUsers.findOne({
            id: $rootScope.loginUserId
        },function(userDetails){
            //console.log('user details**' +JSON.stringify(userDetails));
            $scope.username = userDetails.firstName +' '+ userDetails.lastName;
        },function(userErr){
            console.log('user error**' +JSON.stringify(userErr));
        })
    }

    $(function() {
        fetchTiles();
    });
     
   }); 