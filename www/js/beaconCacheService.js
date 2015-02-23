angular.module('starter')
    .service('beaconCacheService', function () {
            
        var storeBeacon = function (beacon) {
            sessionStorage.setItem(beacon.uuid, beacon);
        };
    
        var getBeacon = function (beacon) {
            return sessionStorage.getItem(beacon.uuid);
        };
    
        return {
            storeBeacon: storeBeacon,
            getBeacon: getBeacon
        };
    });