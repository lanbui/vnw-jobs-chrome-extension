if (!window.bg) {
    if (document.location.href.indexOf("chrome-extension://") == 0) {
        if (chrome && chrome.extension && chrome.extension.getBackgroundPage) {
            window.bg = chrome.extension.getBackgroundPage();
        } else {
            console.warn("JError: no access to background");
        }
    }
}
function chromeGetMessage(messageID, args) {
    if (args && $.isNumeric(args)) {
        args = args + "";
    }
    return chrome.i18n.getMessage(messageID, args);
}

function getMessage(messageID, args) {
    if (messageID) {
        if (bg.localeMessages) {
            var messageObj = bg.localeMessages[messageID];
            if (messageObj) { // found in this language
                var str = messageObj.message;

                // patch: replace escaped $$ to just $ (because chrome.i18n.getMessage did it automatically)
                if (str) {
                    str = str.replace(/\$\$/g, "$");
                }

                if (args) {
                    if (args instanceof Array) {
                        for (var a=0; a<args.length; a++) {
                            str = str.replace("$" + (a+1), args[a]);
                        }
                    } else {
                        str = str.replace("$1", args);
                    }
                }
                return str;
            } else { // default to default language
                return chromeGetMessage(messageID, args);
            }
        } else {
            return chromeGetMessage(messageID, args);
        }
    }
}