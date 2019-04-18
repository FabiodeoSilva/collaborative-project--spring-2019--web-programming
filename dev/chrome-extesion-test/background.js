console.log("background running");

chrome.storage.sync.get(function(data){
    if(!data.urls){
        chrome.storage.sync.set({urls: [] });
    }   
});

chrome.extension.onMessage.addListener(
 function(message, sender, sendResponse) {
    if(!data.clickCounter){
            chrome.storage.sync.set({clickCounter: 0, noteText:""})
    }

});
