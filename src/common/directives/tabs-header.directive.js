function ($ionicSlideBoxDelegate, $ionicScrollDelegate) {
    return {
        restrict: 'A',
        link: function link($scope, $element, attrs) {
            $scope.goToSlide = function goToSlide(index) {
                $ionicSlideBoxDelegate.slide(index);
            };

            $scope.$parent.slideChanged = function slideChanged(index) {
                if ($scope.$parent.afterSlideChanged) {
                    $scope.$parent.afterSlideChanged(index);
                }

                $scope.activeTab = index;
                $scope.isDragUp = false;

                if (!document.querySelector(".bar.tabs")) {
                    return;
                }

                var tabs = $element[0].getElementsByClassName('tab-item');

                _.forEach(tabs, function forEachTab(tab) {
                    tab.classList.remove('active');
                });

                if (tabs && tabs[index]) {
                    tabs[index].classList.add('active');
                }

                var lft = $element[0].getBoundingClientRect().width * (index / $ionicSlideBoxDelegate.slidesCount());
                lft -= $element[0].getBoundingClientRect().width * (1 / $ionicSlideBoxDelegate.slidesCount());
                $ionicScrollDelegate.$getByHandle(attrs.delegateHandle).scrollTo(lft, 0, true);
            };
        }
    };
}
