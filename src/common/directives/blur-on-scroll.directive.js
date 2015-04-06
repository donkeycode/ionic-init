function () {
    /**
    * @ngdoc directive
    * @description blur all focused when the content is scrolled
    * @usage
    * <ion-content dc-common-blur-scroll></ion-content>
    *
    */
    return {
        restrict: 'A',
        link: function link($scope, $element) {
            $element.on('touchmove', function onTouchMove() {
                if (!ionic.scroll.isScrolling) {
                    return;
                }

                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });

            $scope.$on('$destroy', function onDestroy() {
                $element.off('touchmove');
            });
        }
    };
}
