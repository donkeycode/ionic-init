function($scope, $log, dcCommonConfig) {
    $log.debug('Start App');
    $scope.isDevMode = !!dcCommonConfig.isDevMode;
}
