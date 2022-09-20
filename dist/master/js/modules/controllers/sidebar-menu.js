/**=========================================================
 * Module: sidebar-menu.js
 * Provides a simple way to implement bootstrap collapse plugin using a target 
 * next to the current element (sibling)
 * Targeted elements must have [data-toggle="collapse-next"]
 =========================================================*/
App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$location', '$http', '$timeout', 'APP_MEDIAQUERY', 'UserRoles','$localStorage','$cookieStore',
    function($rootScope, $scope, $state, $location, $http, $timeout, mq, UserRoles,$localStorage,$cookieStore) {
        $rootScope.loginUserName = $cookieStore.get('loginName');
        var currentState = $rootScope.$state.current.name;
        var $win = $(window);
        var $html = $('html');
        var $body = $('body');

        // Adjustment on route changes
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            currentState = toState.name;
            // Hide sidebar automatically on mobile
            $('body.aside-toggled').removeClass('aside-toggled');

            $rootScope.$broadcast('closeSidebarMenu');
        });

        // Normalize state on resize to avoid multiple checks
        $win.on('resize', function() {
            if (isMobile())
                $body.removeClass('aside-collapsed');
            else
                $body.removeClass('aside-toggled');
        });

        // Check item and children active state
        var isActive = function(item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            } else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // ----------------------------------- 

        $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        $scope.loadSidebarMenu = function() {//load side bar data

            /* var menuJson = 'server/sidebar-menu.json',
                 menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
             $http.get(menuURL)
               .success(function(items) {
                  $rootScope.menuItems = items;
               })
               .error(function(data, status, headers, config) {
                 alert('Failure loading menu');
               });*/
            var tileList = [];
            $rootScope.menuItems = null;
            UserRoles.fetchTiles({//fetch tiles for users at side bar
                conUserId: $localStorage.get('userId')
            }, function(tiles) {

                tileList.push(
                    {
                        "text": "Main Navigation",
                        "heading": "true",
                        "translate": "sidebar.heading.HEADER"
                    }, {
                        "text": "Dashboard",
                        "sref": "app.dashboard",
                        "icon": "icon-speedometer",
                        "translate": "sidebar.nav.DASHBOARD"
                    }
                );

                for(var j=0; j<tiles.length; j++)

                {
                    if(tiles[j].tileId === "7" || tiles[j].tileId === "8"){
                       
                    }else{
                        tileList.push({
                      text: tiles[j].tileName,
                      sref: tiles[j].sref,
                      icon: tiles[j].iconName
                    }); 
                    }
                    
                }
                $rootScope.menuItems = tileList;
                console.log('Tile list: ' + JSON.stringify(tiles));
            }, function(tileError) {
                $rootScope.loader = 0;
                console.log('Tile list: ' + JSON.stringify(tileError));
            });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // ----------------------------------- 
        var collapseList = [];

        $scope.addCollapse = function($index, item) {
            collapseList[$index] = !isActive(item);
        };

        $scope.isCollapse = function($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function($index, isParentItem) {


            // collapsed sidebar doesn't toggle drodopwn
            if (isSidebarCollapsed() && !isMobile()) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                collapseList[$index] = !collapseList[$index];
                closeAllBut($index);
            } else if (isParentItem) {
                closeAllBut(-1);
            }

            return true;

            function closeAllBut(index) {
                index += '';
                for (var i in collapseList) {
                    if (index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
                // angular.forEach(collapseList, function(v, i) {
                // });
            }
        };

        // Helper checks
        // ----------------------------------- 

        function isMobile() {
            return $win.width() < mq.tablet;
        }

        function isTouch() {
            return $html.hasClass('touch');
        }

        function isSidebarCollapsed() {
            return $body.hasClass('aside-collapsed');
        }

        function isSidebarToggled() {
            return $body.hasClass('aside-toggled');
        }
    }
]);
