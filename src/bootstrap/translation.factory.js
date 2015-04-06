function (dcCommonConfig, $log, $q, $http) {
    return function getTranslations(options) {
        var deferred = $q.defer();

        $log.debug("Run dcBootstrapTranslation");

        $http.get(dcCommonConfig.lang.api).then(function getLang(translations) {
            if (translations.data[options.key]) {
                $log.debug("Translations find with key : '" + options.key + "'");
                deferred.resolve(translations.data[options.key]);
            } else {
                $log.debug("Translations not find with key : '" + options.key + "'");
            }
        });

        return deferred.promise;
    };
}
