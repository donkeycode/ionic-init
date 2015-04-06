function ($timeout, $rootScope) {
    /**
    * @ngdoc directive
    * @description search bar
    * @usage
    * <dc-common-search-bar ng-model="search" search="onSearchChanged(term)"></dc-common-search-bar>
    *
    */
    return {
        restrict: 'E',
        templateUrl: 'dc.common.directives.searchBar',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            search: '&'
        },
        link: function link(scope, elm, attr, ngModelCtrl) {
            var input = angular.element(elm[0].querySelector('input'));

            var toggleShowIfSearch = function toggleShowIfSearch() {
                if (input.val() !== "") {
                    elm[0].querySelector('.show-if-search').classList.remove('ng-hide');
                } else {
                    elm[0].querySelector('.show-if-search').classList.add('ng-hide');
                }
            };

            input.unbind('input');

            var debounceTimeout;

            input.bind('input', function inputBind() {
                $timeout.cancel(debounceTimeout);
                toggleShowIfSearch();

                debounceTimeout = $timeout(function debounceTimeout() {
                    scope.$apply(function debounceApply() {
                        ngModelCtrl.$setViewValue(input.val());
                    });
                }, attr.ngDebounce || 100);
            });

            input.bind('blur', function inputBlur() {
                scope.$apply(function inputBlurApply() {
                    ngModelCtrl.$setViewValue(input.val());

                    if (!scope.ngModel) {
                        scope.searchIsFocused = false;
                        scope.searchFocusChanged(false);
                    }

                    if (input.val() === "") {
                        scope.broadcastCancel();
                    }
                });
            });

            ngModelCtrl.$viewChangeListeners.push(function ngModelListeners() {
                scope.search({
                    term: ngModelCtrl.$viewValue
                });
            });

            scope.searchIsFocused = false;
            // Toggle on event
            scope.searchFocusChanged = function searchFocusChanged(isFocused) {
                if (isFocused) {
                    elm[0].querySelector('.cancel-search').classList.remove('ng-hide');
                } else {
                    elm[0].querySelector('.cancel-search').classList.add('ng-hide');
                }
            };

            scope.focusSearch = function focusSearch() {
                $timeout(function delayFocusSearch() {
                    document.getElementById('search').focus();
                    scope.searchIsFocused = true;
                    scope.searchFocusChanged(true);
                });
            };

            scope.emptySearch = function emptySearch() {
                $timeout(function emptySearchTimeout() {
                    scope.ngModel = '';
                    input.val('');
                    toggleShowIfSearch();
                    ngModelCtrl.$setViewValue(scope.ngModel);
                    scope.broadcastCancel();
                });
            };

            scope.blurSearch = function blurSearch() {
                scope.searchIsFocused = false;

                $timeout(function delayBlurSearch() {
                    document.activeElement.blur();

                    if (!scope.ngModel) {
                        scope.searchFocusChanged(false);
                    }
                });
            };

            scope.broadcastCancel = function broadcastCancel() {
                $rootScope.$broadcast('cancel.search');
            };
        }
    };
}
