function($stateProvider) {
    $stateProvider.state({
        url: '',
        name: 'dc',
        templateUrl: 'dc.home.templates.menu',
        controller: 'DcHomeMainController',
        abstract: true
    })
    .state('dc.home', {
        url: '/',
        views: {
            menuContent: {
                templateUrl: 'dc.home.templates.list',
                controller: 'DcHomeListController'
            }
        },
        resolve: {
            news: function news(dcHomeNews) {
                return dcHomeNews.query();
            }
        }
    })
    .state('dc.article', {
        url: '/{id}',
        views: {
            menuContent: {
                templateUrl: 'dc.home.templates.article',
                controller: 'DcHomeArticleController'
            }
        },
        resolve: {
            article: function article(dcHomeNews, $stateParams, $q) {
                var defer = $q.defer();

                dcHomeNews.query().then(function onSuccess(news) {
                    var article = _.first(_.where(news, { id: parseInt($stateParams.id, 10) }));

                    if (article) {
                        defer.resolve(article);
                        return;
                    }

                    defer.reject("Article " + $stateParams.id + " not found");
                }, function onError() {
                    defer.reject("Article " + $stateParams.id + " not found");
                });

                return defer.promise;
            }
        }
    });
}
