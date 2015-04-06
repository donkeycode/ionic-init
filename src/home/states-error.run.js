function($rootScope, $log) {
    $rootScope.$on('$stateChangeError', function logError(event, to, toParams, from, fromParams, err) {
        $log.error(err);
    });
}
