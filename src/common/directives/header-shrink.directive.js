function ($document, $ionicSlideBoxDelegate) {
    /**
    * @ngdoc directive
    * @description shrink search header on content scroll
    * @usage
    * <ion-content dc-common-header-shrink></ion-content>
    *
    */
    var shrink = function shrink(header, content, amt, headerHeight) {
        amt = Math.min(44, amt);

        ionic.requestAnimationFrame(function requestAnimationFrame () {
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';

            if (headerHeight) {
                content.style.top = (headerHeight) + 'px';
            }
        });
    };

    return {
        restrict: 'A',
        link: function link($scope, $element, $attr) {
            var starty = $scope.$eval($attr.alMobileHeaderShrink) || 40;
            var orgStarty = starty;
            var shrinkAmt;
            $element.bind('scroll', function scrollBind(e) {
                var header = $document[0].body.querySelector($attr.shrinkSelector  || '.bar-subheader');

                if (!header) {
                    return;
                }

                if ($scope.searchIsFocused) {
                    return;
                }

                var scrollTop = e.detail ? e.detail.scrollTop : $element.scrollTop();

                var headerHeight = header.offsetHeight;
                shrinkAmt = headerHeight - (headerHeight - (scrollTop - starty));

                if (shrinkAmt >= headerHeight) {
                    //header is totaly hidden - start moving startY downward so that when scrolling up the header starts showing
                    starty = scrollTop - headerHeight;
                    shrinkAmt = headerHeight;
                } else if (shrinkAmt < 0) {
                    //header is totaly displayed - start moving startY upwards so that when scrolling down the header starts shrinking
                    starty = Math.max(orgStarty, scrollTop);
                    shrinkAmt = 0;
                }

                shrink(header, $element[0], shrinkAmt, $attr.shrinkSelector  ? ((parseInt($attr.shrinkHeaderHeight, 10) || 0) + headerHeight) : null);  //do the shrinking

            });
        }
    };
}
