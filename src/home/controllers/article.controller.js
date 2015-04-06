function($scope, article, $ionicPopup) {
    $scope.article = article;

    $scope.doIt = function doIt() {
        $ionicPopup.alert({
            title: 'doIt',
            template: 'You confirmed your action'
        })
    }
}
