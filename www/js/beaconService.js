angular.module('starter')
    .service('beaconService', function ($ionicPlatform, $http, $q, $rootScope, ttsService, userService, REGIONS) {
        var beacons = {};
            
        $ionicPlatform.ready(function () {
             
            ttsService.init();
            
            var regions = REGIONS;
            // Dictionary of beacons.
            

            // Timer that displays list of beacons.
            var updateTimer = null;

            var lastkey = null;
            var nearkey = null;
            var deferred = $q.defer();
            
            var app = {

                // Application Constructor
                initialize: function() {
                    this.bindEvents();
                },
                // Bind Event Listeners
                //
                // Bind any events that are required on startup. Common events are:
                // 'load', 'deviceready', 'offline', and 'online'.
                bindEvents: function() {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                },
                // deviceready Event Handler
                //
                // The scope of 'this' is the event. In order to call the 'receivedEvent'
                // function, we must explicitly call 'app.receivedEvent(...);'
                onDeviceReady: function() {
                    app.receivedEvent('deviceready');


                    //Beacon
                    // Specify a shortcut for the location manager holding the iBeacon functions.
                    window.locationManager = cordova.plugins.locationManager;
                    startScan();
                    updateTimer = setInterval(loopBeaconList, 500);


                    function startScan()
                    {
                        // The delegate object holds the iBeacon callback functions
                        // specified below.
                        var delegate = new locationManager.Delegate();

                        // Called continuously when ranging beacons.
                        delegate.didRangeBeaconsInRegion = function(pluginResult)
                        {
                            for (var i in pluginResult.beacons)
                            {
                                // Insert beacon into table of found beacons.
                                var beacon = pluginResult.beacons[i];
                                beacon.timeStamp = Date.now();
                                var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
                                //Using rssi because the overhead we get from accuracy
                                if(beacon.rssi > -65) {
                                    	beacons[key] = beacon;
                                }
                            }
                        };

                        // Called when starting to monitor a region.
                        // (Not used in this example, included as a reference.)
                        delegate.didStartMonitoringForRegion = function(pluginResult)
                        {
                            //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
                        };

                        // Called when monitoring and the state of a region changes.
                        // (Not used in this example, included as a reference.)
                        delegate.didDetermineStateForRegion = function(pluginResult)
                        {
                            //console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
                        };

                        // Set the delegate object to use.
                        locationManager.setDelegate(delegate);

                        // Request permission from user to access location info.
                        // This is needed on iOS 8.
                        locationManager.requestAlwaysAuthorization();

                        // Start monitoring and ranging beacons.
                        for (var i in regions)
                        {
                            var beaconRegion = new locationManager.BeaconRegion(
                                i + 1,
                                regions[i].uuid);

                            // Start ranging.
                            locationManager.startRangingBeaconsInRegion(beaconRegion)
                                .fail(console.error)
                                .done();

                            // Start monitoring.
                            // (Not used in this example, included as a reference.)
                            locationManager.startMonitoringForRegion(beaconRegion)
                                .fail(console.error)
                                .done();
                        }
                    }
                    
                    function loopBeaconList(){
                        var nearest = null,
                            previous = null,
                            activeBeacons = {},
                            timeNow = Date.now();
                        
                        for (var key in beacons) {
                            var beacon = beacons[key];
                            if (userService.getUser()) {
                                beacons[key].user = userService.getUser();
                            }
                            
                            if(beacon.timeStamp + 3000 > timeNow) {
                                if(nearest == null || (beacon.rssi > nearest.rssi && beacon.rssi != 0)){
                                    nearest = beacon;
                                    nearkey = key;
                                }
                                activeBeacons[key] = beacon;
                            }
                        }
                        
                        $rootScope.$broadcast('beaconsUpdated', activeBeacons);
                        
                        if(lastkey != nearkey ){
                            deferred.reject();
                            deferred = $q.defer();
                            
                                $http({method: 'POST', url: '/someURL', data: activeBeacons, timeout: deferred.promise}).success(function (resp) {
                                    
                                    
                                        if (resp.action.vibrate) {
                                            navigator.vibrate(100);
                                        }

                                        if (resp.action.tts) {
                                            ttsService.speak(resp.action.tts);
                                        }

                                        $rootScope.closestBeacon = resp;
                                        
                                    
                                    
                                });
                            lastkey = nearkey;
                        }
                    }
                },
                // Update DOM on a Received Event
                receivedEvent: function(id) {
                    //var parentElement = document.getElementById(id);
                    //var listeningElement = parentElement.querySelector('.listening');
                    //var receivedElement = parentElement.querySelector('.received');

                    //listeningElement.setAttribute('style', 'display:none;');
                    //receivedElement.setAttribute('style', 'display:block;');

                    //console.log('Received Event: ' + id);
                }
            };



             app.initialize();
         });
    
       this.getBeacons = function () {
           return beacons;
       };    
        
    });