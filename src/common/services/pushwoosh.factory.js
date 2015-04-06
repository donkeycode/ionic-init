function (dcCommondcCommonConfig, $log, $ionicPopup, $location, $rootScope) {
    if (!window.cordova) {
        return {};
    }

    var pushNotification;

    var init = function init() {
        $log.debug('PushWooshService init');

        pushNotification = window.plugins.pushNotification;

        if (ionic.Platform.isIOS()) {
            pushNotification.onDeviceReady({
                pw_appid: dcCommonConfig.PushwooshAppId,
            });
        } else {
            pushNotification.onDeviceReady({
                pw_appid: dcCommonConfig.PushwooshAppId,
                projectid: dcCommonConfig.googleProjectNumber
            });
        }
    };

    return {
        registerListener: function registerListener() {
            pushNotification = window.plugins.pushNotification;

            //set push notification callback before we initialize the plugin
            document.addEventListener('push-notification', function onNotificationRecieved(event) {
                //get the notification payload
                var notification = event.notification;

                if (notification.userdata.url) {
                    //display alert to the user for example
                    var confirmPopup = $ionicPopup.confirm({
                        title: notification.userdata.title || "Notification",
                        template: notification.userdata.message || notification.aps.alert,
                        okText: "Voir",
                        cancelText: "Annuler"
                    });

                    confirmPopup.then(function onPopupConfirmed(res) {
                        if (res) {
                            $location.path(notification.userdata.url);
                        }
                    });
                }

                //clear the app badge
                pushNotification.setApplicationIconBadgeNumber(0);
            });

            document.addEventListener("resume", function onAppResumed() {
                pushNotification.setApplicationIconBadgeNumber(0);
            }, false);

            pushNotification.setApplicationIconBadgeNumber(0);
        },
        registerDevice: function registerDevice(tags) {
            init();
            //register for pushes
            pushNotification.registerDevice(
                function onSuccess(status) {
                    $log.debug('registerDevice: ' + status.deviceToken);

                    if (tags) {
                        pushNotification.setTags(tags);
                    }

                    $rootScope.broadcast('push:registerDevice', {
                        devicetoken: status.deviceToken,
                        tags: tags
                    });
                },
                function onError(status) {
                    $log.debug('failed to register : ' + JSON.stringify(status));
                    $ionicPopup.alert({
                        title: 'Push',
                        template: "Impossible de vous enregistrer au push"
                    });
                }
            );

        }
    };
}
