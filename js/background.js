var localeMessages;
var notification;
var notificationAudio;
var lastNotificationAudioSource;

function showNotification() {
    if (Notification.permission === 'granted') {
        notification = new Notification("Urgent! Unity Game Developer - High Salary", {body:"Evolable Asia \n4F Saigon Finance Center, No. 9 Dinh Tien Hoang St., Dist 1, HCMC", icon:"/images/icons/icon_48.png"});
        notification.onclick = function () {
            chrome.tabs.create({url: 'http://www.vietnamworks.com/urgent-unity-game-developer-high-salary-584258-jd'});
            if (notification) {
                notification.close();
            }
        }
        notification.onclose = function() {
            notification = null;
        }
        setTimeout(function () {
            if (notification) {
                notification.close();
            }
        }, 3000);
    }
}

function playNotificationSound(source) {
    try {
        if (!notificationAudio) {
            notificationAudio = new Audio();
        }
        var audioEventTriggered = true;
        $(notificationAudio).off().on("ended abort error", function(e) {
            console.log("sound event", e);
            if (!audioEventTriggered) {
                audioEventTriggered = true;
            }
        });
        if (!source) {
            source = 'chime.ogg';
        }
        if (lastNotificationAudioSource != source) {
            notificationAudio.src = "/sounds/" + source;
        }
        lastNotificationAudioSource = source;
        notificationAudio.volume = 100 / 100;
        notificationAudio.play();
    } catch (e) {
        logError("sound error: " + e);
    }
}

function initContextMemu() {
    var lang = window.navigator.language;
    if (chrome.contextMenus) {
        var doNotDisturbMenuId = chrome.contextMenus.create({title: getMessage("doNotDisturb"), contexts: ["browser_action"]});
        chrome.contextMenus.create({title: getMessage("turnOff"), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_off();
        }});
        chrome.contextMenus.create({contexts: ["browser_action"], parentId:doNotDisturbMenuId, type:"separator"});

        chrome.contextMenus.create({title: getMessage("Xminutes", 30), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_minutes(30);
        }});
        chrome.contextMenus.create({title: getMessage("Xhour", 1), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_minutes(60);
        }});
        chrome.contextMenus.create({title: getMessage("Xhour", 2), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_minutes(120);
        }});
        chrome.contextMenus.create({title: getMessage("Xhours", 4), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_minutes(240);
        }});
        chrome.contextMenus.create({title: getMessage("today"), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_today();
        }});
        chrome.contextMenus.create({title: getMessage("indefinitely"), contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
            setDND_indefinitely();
        }});
    }
}
function init() {
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 255, 255, 1]});
    chrome.browserAction.setBadgeText({ text: "..." });
    chrome.browserAction.setTitle({ title: "loading settings..." });

    Settings.load(function() {
        initContextMemu();
    });
}

$(document).ready(function() {
    init();
});
