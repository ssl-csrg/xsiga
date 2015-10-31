import utils from '../lib/utils';

utils.log("Probando conectar hacia afuera...");

chrome.runtime.sendMessage({url: 'http://www.example.org/'},
function(responseText) {
    utils.log("conectado con Example.org");
});
