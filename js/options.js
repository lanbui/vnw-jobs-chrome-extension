var Settings;

if (bg.getSettings) {
    Settings = bg.getSettings();
}

function initMessages(node) {
    var selector;
    if (node) {
        selector = node;
    } else {
        selector = "*";
    }
    $(selector).each(function() {
        //var parentMsg = $(this);
        var attr = $(this).attr("msg");
        if (attr) {
            var msgArg1 = $(this).attr("msgArg1");
            if (msgArg1) {
                $(this).text(getMessage( $(this).attr("msg"), msgArg1 ));
                var msgArg2 = $(this).attr("msgArg2");
                if (msgArg2) {
                    $(this).text(getMessage( $(this).attr("msg"), [msgArg1, msgArg2] ));
                }
            } else {
                // look for inner msg nodes to replace before...
                var innerMsg = $(this).find("*[msg]");
                if (innerMsg.length > 0) {
                    initMessages(innerMsg);
                    var msgArgs = [];
                    innerMsg.each(function(index, element) {
                        msgArgs.push( $(this).get(0).outerHTML );
                    });
                    $(this).html(getMessage(attr, msgArgs));
                } else {
                    $(this).text(getMessage(attr));
                }
            }
        }
        attr = $(this).attr("msgTitle");
        if (attr) {
            var msgArg1 = $(this).attr("msgTitleArg1");
            if (msgArg1) {
                $(this).attr("title", getMessage( $(this).attr("msgTitle"), msgArg1 ));
            } else {
                $(this).attr("title", getMessage(attr));
            }
        }
        attr = $(this).attr("msgLabel");
        if (attr) {
            var msgArg1 = $(this).attr("msgLabelArg1");
            if (msgArg1) {
                $(this).attr("label", getMessage( $(this).attr("msgLabel"), msgArg1 ));
            } else {
                $(this).attr("label", getMessage(attr));
            }
        }
        attr = $(this).attr("msgText");
        if (attr) {
            var msgArg1 = $(this).attr("msgTextArg1");
            if (msgArg1) {
                $(this).attr("text", getMessage( $(this).attr("msgText"), msgArg1 ));
            } else {
                $(this).attr("text", getMessage(attr));
            }
        }
        attr = $(this).attr("msgSrc");
        if (attr) {
            $(this).attr("src", getMessage(attr));
        }
        attr = $(this).attr("msgValue");
        if (attr) {
            $(this).attr("value", getMessage(attr));
        }
        attr = $(this).attr("msgPlaceholder");
        if (attr) {
            $(this).attr("placeholder", getMessage(attr));
        }
        attr = $(this).attr("msgHTML");
        if (attr) {
            $(this).html(getMessage(attr));
        }
        attr = $(this).attr("msgHALIGN");
        if (attr) {
            if ($("html").attr("dir") == "rtl" && attr == "right") {
                $(this).attr("halign", "left");
            } else {
                $(this).attr("halign", attr);
            }
        }
    });
}

function initPrefAttributes() {
    $("select[pref], input[pref], textarea[pref]").each(function(index) {

        var key = $(this).attr("pref");
        var prefValue = Settings.read(key);

        if (this.tagName == "INPUT") {
            if ($(this).attr("type") == "checkbox") {
                $(this).attr("checked", prefValue);
                $(this).change(function(event) {
                    Settings.store(key, this.checked);
                });
            } else if ($(this).attr("type") == "radio") {
                if ($(this).val() == prefValue) {
                    $(this).attr("checked", "true");
                }
                $(this).change(function(event) {
                    Settings.store(key,  $(this).val());
                });
            } else if ($(this).attr("type") == "text" || $(this).attr("type") == "number") {
                if (prefValue !== false) {
                    $(this).val(prefValue);
                }
                $(this).change(function() {
                    Settings.store(key,  $(this).val());
                });
            } else if ($(this).attr("type") == "range") {
                $(this).val(prefValue);
                $(this).change(function() {
                    Settings.store(key,  $(this).val());
                });
            }
        } else if (this.tagName == "SELECT") {
            $(this).val(prefValue);
            $(this).change(function() {
                Settings.store(key,  $(this).val());
            });
        } else if (this.tagName == "TEXTAREA") {
            if (prefValue) {
                $(this).val(prefValue);
            }
            $(this).blur(function() {
                Settings.store(key,  $(this).val());
            });
        }
    });
}

function initNotificationSound() {
    $select = $("#soundAudios");
    $val = Settings.read('sound_audio');
    $select.off("change")
        .val($val)
        .on("change", function() {
            bg.playNotificationSound($(this).val());
            Settings.store("sound_audio", $(this).val());
            $(this).blur();
        })
    ;

    $("#playNotificationSound").click(function() {
        bg.playNotificationSound();
    });
}

function initDisplayForAccountAddingMethod() {
    if (Settings.read('accountAddingMethod') != 'autoDetect') {
        $("#signInToYourAccount").remove();
    }
}

function showContent(contentId) {
    $.when( $(".tabContent").fadeOut("fast") ).done(function() {
        $(".tabContent").eq(contentId).animate({opacity: 'show', height: 'show', xxwidth: 'show'}, 200);
    });

    $('ul.menu > li > a').each(function(index) {
        $(this).removeClass('active');
        if (index == contentId) {
            $(this).addClass('active');
            location.href = location.href.split("#")[0]	+ "#" + contentId;
        }
    });
}

function menuActive() {
    $("#mainMenu a").click(function() {
        var contentID = $(this).attr("contentID");
        showContent(contentID);
    });
    var contentID = location.href.split("#")[1];
    if (contentID != null) {
        showContent(contentID);
    }
}

$(document).ready(function() {
    if (!bg.loadedSettings) {
        $("body").empty().append( getMessage("loadingSettings") + "..." );
        setInterval(function() {
            if (bg.loadedSettings) {
                location.reload();
            }
        }, 500);

        // too long
        setTimeout(function() {
            $("body").append("This is taking too long.");
        }, 3000);
        return;
    }
    initMessages();
    initPrefAttributes();
    menuActive();
    initNotificationSound();
    initDisplayForAccountAddingMethod();
});
