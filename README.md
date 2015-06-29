This project is a tool to quickly start one [ionicframework](http://ionicframework.com/) app using [ng-build](https://github.com/izeau/ng-build)

# Quick start

1. Clone / fork this repo
2. Change bundle name in config.xml & ionic.project
3. Install deps

````
sudo npm install -g ionic cordova bower gulp
npm install && bower install
gulp build
ionic platform add android
ionic platform add ios
ionic browser add crosswalk
ionic resources
````

4. Install your cordova plugins

I use frequently :

### Keyboard

``````
cordova plugin add com.ionic.keyboard
``````

### DatePicker

To manage android date pickers with french format

``````
cordova plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker
``````

### Pushwoosh

``````
cordova plugin add com.pushwoosh.plugins.pushwoosh
``````

### Inappbrowser

``````
cordova plugin add org.apache.cordova.inappbrowser
``````

### Network Information

``````
cordova plugin add org.apache.cordova.network-information
``````

### Splashscreen

``````
cordova plugin add org.apache.cordova.splashscreen
``````

### StatusBar

``````
cordova plugin add org.apache.cordova.statusbar
``````

4. Start dev mode

````
gulp dev
````
