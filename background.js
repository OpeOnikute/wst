let highlightedText = "";

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (!message.action) {
            return sendResponse();
        }
        switch(message.action) {
            case "getHighlightedText":
                sendResponse(highlightedText);
                break;
            case "setHighlightedText":
                highlightedText = message.text;
                setIcon(highlightedText, sender.tab.id);
                sendResponse();
                break;
            default:
                sendResponse();
                break;
        }
});

function setIcon(text, tabId) {
    if (!text) {
        chrome.pageAction.setPopup({tabId, popup: ""});
        return chrome.pageAction.setIcon({tabId, path:"images/icon128.png"});
    }
    chrome.pageAction.setPopup({tabId, popup: "popup.html"});
    chrome.pageAction.setIcon({tabId, path:"images/icon128-active.png"});
}