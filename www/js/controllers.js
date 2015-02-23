angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
    
})

.controller('ChatsCtrl', function($scope, beaconService) {
    
    $scope.beacons = [];
    
    $scope.filterParams = {predicate: 'accuracy', reverse: false};
    
    $scope.$on('beaconsUpdated', function (event, beacons) {
        $scope.beacons = [];
        for (var beacon in beacons) {
            $scope.beacons.push(beacons[beacon]);
        }
    });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, userService) {
  $scope.userName = userService.getUser();
  $scope.onTap = function (name) {
    userService.setUser(name);
  };
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
