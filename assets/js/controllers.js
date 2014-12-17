var portalControllers = angular.module('portalAppControllers', []);

portalControllers.controller('PortalCtrl', function($scope, $http) {
  var states = {
    anonym: 'anonym',
    authenticating: 'authenticating',
    ready: 'ready',
    forbidden: 'forbidden',
    working: 'working',
    error: 'error'
  }

  $scope.state = states.anonym;

  // DEV ONLY

  $scope.register = function() {
    $http.post('/register', {username: $scope.username, deviceid: new Fingerprint().get()});
  }

  // UI functions

  $scope.return_home = function() {
    $http.get('/logout');
    $scope.state = states.anonym;
  }

  $scope.login = function() {
    $http.post('/login', {username: $scope.username, deviceid: new Fingerprint().get()})
      .success(function() {
        $scope.state = states.ready;
      })
      .error(function() {
        $scope.state = states.forbidden;
      });
  }

  $scope.open_portal = function() {
    $scope.state = states.working;
    $http.get('/open')
      .success(function() {
        $scope.state = states.ready;
      })
      .error(function(data, status) {
        switch (status) {
          case 403:
            $scope.state = states.forbidden;
            break;
          case 404:
            $scope.state = states.error;
            $scope.error_message = 'Vérifiez votre connexion internet.';
            break;
          case 500:
            $scope.state = states.error;
            $scope.error_message = 'Une erreur est survenue avec le portail. Désolé.';
            break;
        }
      });
  }
});
