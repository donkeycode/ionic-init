function ($translateProvider, dcToolsConfigProvider, dcCommonConfig) {
    dcToolsConfigProvider.config.lang.api = dcCommonConfig.lang.api;
    
    $translateProvider.preferredLanguage('fr');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useLoader('dcToolsTranslation');
}
