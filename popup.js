
let highlightedText = "";

const btn = document.getElementById("btn");

btn.onclick = function() {
    copyToClipboard(highlightedText);
};

window.onload = function() {
    chrome.runtime.sendMessage({ action: "getHighlightedText" }, function(response) {
        if (!response) {
            return displayEmpty();
         }

        highlightedText = response;
        displayHighlightedText(response);
    });
}

function displayEmpty () {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = "none";

    const emptyDiv = document.getElementById('empty');
    emptyDiv.style.display = "flex";
}

function displayHighlightedText (text) {
    const emptyDiv = document.getElementById('empty');
    emptyDiv.style.display = "none";

    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = "flex";

    const resultsLink = document.getElementById('results-link');
    resultsLink.innerHTML = `${truncate(text, 30)} <i class="fa fa-external-link" style="margin-left:5px;"></i>`;
    resultsLink.href = text;
}

function copyToClipboard (str) {
    try {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        displayCopiedBtn();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function displayCopiedBtn () {
    const btn = document.getElementById('btn');
    btn.innerHTML = "Copied!";
    btn.style["background-color"] = "green";

    setTimeout(function(){
        resetCopiedBtn();
    }, 5000);
}

function resetCopiedBtn () {
    const btn = document.getElementById('btn');
    btn.innerHTML = `Copy url`;
    btn.style["background-color"] = "rgb(1, 1, 105)";
}

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '..' : str;
};