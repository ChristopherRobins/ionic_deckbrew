// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MagicApp = angular.module('MagicApp', ['ionic', 'ngRoute', 'ngSanitize', 'angularUtils.directives.dirPagination'])

.run(function($ionicPlatform, $rootScope, $location) {
  var url;
  $rootScope.goHome = function() {
    $location.path('/list');
  }

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

MagicApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/list',{
      controller: 'ListController',
      templateUrl: 'partials/list.html'
    })
    .when('/details/:cardId',{
      controller: 'DetailsController',
      templateUrl: 'partials/details.html'
    })
    .otherwise({redirectTo: '/list'});
}])

MagicApp.controller('ListController',['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading){
  var filter;
  $scope.currentPage = 1;
  $scope.pageSize = 20;
  $scope.loadCards = function(filter){
    console.log(filter);
    $ionicLoading.show();
    if(filter == undefined){
      url = 'https://api.deckbrew.com/mtg/cards';
    } else {
      url = 'https://api.deckbrew.com/mtg/cards?page=1'+filter;
    }
    $http.get(url)
    .success(function(response){
      console.log(url);
      $scope.cards = response;
      $ionicLoading.hide();
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.loadCards();
}])

MagicApp.controller('DetailsController', ['$scope', '$http', '$routeParams', '$ionicLoading', function($scope, $http, $routeParams, $ionicLoading){
  $ionicLoading.show();
  $http.get('https://api.deckbrew.com/mtg/cards/'+$routeParams.cardId)
  //$http.get(url)
  .success(function(response){
    console.log(response);
    $scope.card = response;
    $ionicLoading.hide();
  })
}])

MagicApp.controller('ColorCtrl', function($scope, $ionicPopup, $timeout){
  console.log('anything');
  $scope.colorList = [
    { value: "white", text: "White", class: "checkbox-stable", checked: false },
    { value: "blue", text: "Blue", class: "checkbox-positive", checked: false },
    { value: "black", text: "Black", class: "checkbox-dark", checked: false },
    { value: "red", text: "Red", class: "checkbox-assertive", checked: false },
    { value: "green", text: "Green", class: "checkbox-balanced", checked: false },
    { value: "any", text: "Any", class: "checkbox-energized", checked: false }
  ];
  $scope.showColors = function(e){
    var confirmColor = $ionicPopup.confirm({
      title: 'Filter by Color',
      templateUrl: 'partials/colors.html'
    });
    confirmColor.then(function(res){
      console.log($scope.colorList);
      if(res){
        console.log(filter);
        $scope.regFilter(filter);
      } else {
        console.log('nae');
      }
    });
  };
  $scope.regFilter = function(filter){
    var regexp = 'any';
  }
  $scope.consoleColors = function(){
    filter = "";
    angular.forEach($scope.colorList, function(color){
      if (!!color.checked) filter += '&color='+color.value;
    })
  };
})
