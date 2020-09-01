document.onselectionchange = function() {
    // delay for 500ms to minimise jank
    setTimeout(function(){
        const text = getHighlightedText();
        // send message to the extension
        chrome.runtime.sendMessage({ action: "setHighlightedText", text: text }, function(response) { });
    }, 500);
}

function getHighlightedText() {
    return getShareURL(window.getSelection().toString());
}

function getShareURL(highlightedText) {

    if (!highlightedText) return "";

    let { startTxt, endTxt } = formatTxt(highlightedText);

    endTxt = endTxt ? `,${endTxt}` : '';

    // :~:text=[prefix-,]textStart[,textEnd][,-suffix]
    return `${window.location.href}#:~:text=${startTxt}${endTxt}`.replace(',,', ',');
}

function formatTxt(txt) {

    // remove beginning/trailing whitespace and commas before splitting
    const words = txt.trim().replace(/^\,/, '').replace(/\,$/, '').split(" ");

    let startLength = Math.floor(words.length * 0.75);

    // Handle scenario of just one text selected
    if (startLength < 1) {
        startLength = 1;
    }

    let endLength = words.length - startLength;

    // beginning text must not be greater than 5
    if (startLength > 5) {
        startLength = 5;
    }

    // ending text must not be greater than 3
    if (endLength > 3) {
        endLength = 3;
    }

    const startTxt = words.slice(0, startLength).join(" ").removeBeginTextCommas();
    const endTxt = words.slice(words.length - endLength).join(" ").removeEndTextCommas();

    return { startTxt, endTxt };
}

String.prototype.removeBeginTextCommas = function  (txt) {
    return this.valueOf().split(",")[0];
}

// if a sentence contains commmas, split it and use the end.
String.prototype.removeEndTextCommas = function (txt) {
    let arr = this.valueOf().split(",");
    return arr[arr.length - 1];
}