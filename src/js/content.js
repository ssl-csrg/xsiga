var utils = require('./utils');

utils.log('Cargando...');
var avanceCurricular = require('./modules/avanceCurricular');
//Enrutados de Módulos
var router = {
  routes: [],
  addRoute: function(route, callback){
    this.routes.push({
      'route': route,
      'callback': callback
    });
  },
  callModule: function(){
    var route = window.location.pathname;
    this.routes.map(function(elem){
      if(route.indexOf(elem.route) > -1){
        elem.callback();
      }
    });
  }
};

//TODO hacer que estas cosas se carguen solas.
avanceCurricular(router);

router.callModule();
