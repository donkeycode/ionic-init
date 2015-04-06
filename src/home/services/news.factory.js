function (dcHomeConfig, dcCommonOnline, $http, $q, DSCacheFactory, $log, moment) {
    return {
        query: function query(forceReload) {
            var def = $q.defer();

            var cache = DSCacheFactory.get('DcHome');

            if (cache.get('news') && !forceReload) {
                // Not online or cache not expired
                if (!dcCommonOnline.isOnline() || moment().diff(cache.info('news').created, 'minutes') < dcHomeConfig.news.cache) {
                    def.resolve(cache.get('news'));

                    return def.promise;
                }

                $log.debug('forceReload cache');
            }

            $http.get(dcHomeConfig.news.api).then(function onSuccess(datas) {
                cache.put('news', datas.data);
                def.resolve(datas.data);
            }, function onError(err) {
                if (cache.get('news')) {
                    def.resolve(cache.get('news'));
                    return;
                }

                def.reject(err);
            });

            return def.promise;
        }
    };
}
