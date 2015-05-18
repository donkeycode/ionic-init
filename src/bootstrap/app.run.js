function runApp($ionicPlatform, $log, dcToolsPushwoosh, $timeout) {
    $ionicPlatform.ready(function ionicReady() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        if (window.cordova && window.plugins.pushNotification) {
            dcToolsPushwoosh.registerListener();
        }

        if (window.cordova) {
            $timeout(function hideSlashScreen() {
                window.navigator.splashscreen.hide();
            }, 100);
        }

        if (!window.cordova) {
            navigator.connection = {
                type: "web"
            };
        }
    });

    $log.debug("Angular run app");
}
