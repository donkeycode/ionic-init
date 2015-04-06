function($log, $scope, news, $filter) {
    $scope.news = news;

    $scope.search = '';

    $scope.onSearchChanged = function onSearchChanged(term) {
        $log.debug('onSearchChanged', term);
        $scope.news = $filter('filter')(news, term);
    };
}
