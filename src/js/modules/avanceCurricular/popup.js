angular.module('PopupApp', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('loading', {
      url: '/',
      template: '<div class="row"><div class="col-sm-12">' +
                '<p class="text-center">Cargando Datos</p>' +
                '</div></div>',
      controller: ['$scope', '$state', function($scope, $state){
        var handleData = function(data){
          //obtener asignaturas pendientes
          data.inscritas = data.semestresActivos.reduce(function(prev, curr){
            return prev.concat(curr.asignaturas);
          }, []);
          var pendientes = data.inscritas.filter(function(elem){
            return elem.evaluacion == 'No ingresada' || elem.evaluacion == 'Pendiente';
          });
          if(pendientes.length > 0){
            $state.go('pending', {data: data});
          } else {
            $state.go('result', {data: data});
          }
        };

        chrome.runtime.sendMessage({
          from: 'popup', subject: 'ready'
        }, handleData);
      }]
    })
    .state('pending', {
      url: '/pending',
      templateUrl: 'pending.html',
      params: {
        data: null
      },
      controller: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
        $scope.data = $stateParams.data;
        $scope.filterPending = function(elem){
          return elem.evaluacion == 'No ingresada' || elem.evaluacion == 'Pendiente';
        };
        $scope.pendingReady = function(){
          $state.go('result', {data: $scope.data, pending: true});
        };
      }]
    })
    .state('result', {
      url: '/result',
      templateUrl: 'result.html',
      params: {
        data: null,
        pending: false
      },
      controller: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
        var getPriority = function(data){
          var notasPorCreditos = data.inscritas.reduce(function(prev, curr){
            if(curr.nota === null && curr.sigla.indexOf('DEW') > -1){
              curr.nota = 100;
            }
            return prev + (curr.nota * curr.creditos);
          }, 0);
          var creditosAprobados = data.inscritas.reduce(function(pr, cr){
            if (cr.evaluacion == 'Aprobada' || ((cr.evaluacion == 'Pendiente' || cr.evaluacion == 'No ingresada') && cr.nota >= 55)){
              return pr + cr.creditos;
            }
            return pr;
          }, 0);
          return Number(
            100 * (notasPorCreditos/(14 * Math.pow(data.semestresActivos.length, 1.06))) * (creditosAprobados/data.creditosTotales)
          ).toFixed(3).replace('.',',');
        };

        $scope.pending = $stateParams.pending;
        $scope.prioridad = getPriority($stateParams.data);
        $scope.closePopup = function(){
          window.close();
        };
        $scope.goBack = function(){
          $state.go('pending', {data:$stateParams.data});
        };
      }]
    });
  $urlRouterProvider.otherwise('/');
}])
.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
