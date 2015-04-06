function($ionicPopup) {
    /**
    * @ngdoc directive
    * @description open a yes/no confirm modal
    * @params {expression} confirmed-click confirm function
    * @usage
    * <a dc-common-confirm-click="Are you sure ?"
    *       confirmed-click="doIt()"
    *       confirm-click-title="Title of alert">Link</a>
    *
    */
    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            var msg = attr.dcCommonConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click', function onElementClicked() {
                var confirmPopup = $ionicPopup.confirm({
                    title: attr.confirmClickTitle,
                    template: msg,
                    okType: 'button-positive',
                    cancelText: "Non",
                    okText: "Oui"
                });

                confirmPopup.then(function onPopupClose(res) {
                    if (res) {
                        scope.$eval(clickAction);
                    }
                });
            });
        }
    };
}
