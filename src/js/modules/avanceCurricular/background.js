module.exports = function(){
  var priorData = null;

  chrome.runtime.onMessage.addListener(function(request, sender, response){
    if(request.from == 'content'){
      if(request.subject == 'createWindow'){
        priorData = request.data;
        chrome.tabs.create({
          url: chrome.extension.getURL('../modules/avanceCurricular/index.html'),
          active: false
        }, function(tab){
          chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true,
            width: 400,
            height: 300,
            top: 40,
            left: 40
          });
        });
      }
    } else if(request.from == 'popup'){
      if(request.subject == 'ready'){
        response(priorData);
      }
    }
  });
};
