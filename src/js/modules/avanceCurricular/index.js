var utils = require('../../utils');

//Obtiene los datos desde el marco del medio
var getFrameData = function(callback){
  utils.getFrameWithDelay('frame5', 2000, function(err, frame){
    if(err) utils.error(err);
    var data = {};
    var nodes = frame.querySelectorAll('.letra8 b');
    data.creditosTotales = Number(nodes[nodes.length-1].textContent);
    data.semestres = Array.prototype.map.call(
      frame.querySelectorAll('body > table'),
      function(elem, idx, arr){
        if(elem.getAttribute('align') == 'center'){
          var bNodes = elem.querySelectorAll('b');
          var creditos = Number(bNodes[0].textContent);
          var count = Number(bNodes[1].textContent);
          return {
            'creditos': creditos,
            'asignaturas': Array.prototype.filter.call(arr, function(elem, jdx){
              if(jdx > idx + 1 && jdx <= idx + 1 + count){
                return true;
              }
            }).map(function(elem){
              var nodes = elem.querySelectorAll('td');
              return {
                'sigla': nodes[0].textContent,
                'nombre': nodes[1].textContent,
                'profesor': nodes[2].textContent,
                'creditos': Number(nodes[4].textContent),
                'nota': Number(nodes[5].textContent) || null,
                'evaluacion': nodes[6].textContent,
                'estado': nodes[7].textContent
              };
            })
          };
        }
    }).filter(function(elem){
      return elem;
    });
    data.semestresActivos = data.semestres.filter(function(elem){
      return elem.asignaturas && elem.asignaturas[0].estado != 'Retiro Temp.';
    });
    if(callback) callback(data);
  });
};

//Crea el botón que realiza el cálculo
var createButton = function(data, callback){
  utils.getFrameWithDelay('frame6', 0, function(err, frame){
    if(err) utils.error(err);

    var button = frame.createElement('input');
    button.classList.add('Boton02');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Calcular Prioridad');
    button.addEventListener('click', function(event){
      chrome.runtime.sendMessage({from: 'content', subject:'createWindow', data: data});
    });

    var buttonBar = frame.querySelectorAll('.Encabezado02 td:first-child')[0];
    buttonBar.appendChild(button);

    if(callback) callback();
  });
};

var init = function(){
  utils.log('Modulo de Avance Curricular');
  utils.log('Esperando datos...');
  getFrameData(function(data){
    createButton(data, function(){
      utils.log('Listo');
      console.log(data);
    });
  });
};

module.exports = function(router){
  router.addRoute('insc_consultainscalum_frameset', init);
};
