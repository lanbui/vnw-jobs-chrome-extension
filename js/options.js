/**
 * Created by tuanna on 8/4/2015.
 */

//Init database
var db_version = Dexie.version;
var db = new Dexie('VNW_V2');

//Database schema
db.version(db_version).stores({
    settings: 'key, value'
});
db.open();

$(document).ready(function() {
    menuActive();
    showSoundNotifications();
    updateSoundNotifications();
    playSoundDemo();

    showDesktopNotifications();
    updateDesktopNotifications();

    saveSearchJobCriteria();
    showSearchJobCriteria();
});

function showSearchJobCriteria() {
    db.settings.get('search_criteria').then(function (searchCriteria) {
        console.log(searchCriteria);
        if (searchCriteria !== undefined) {
            $("#searchKeyword").val(searchCriteria.keyword);
            $("select#searchIndustries option").each(function(){
                this.selected = (this.value == searchCriteria.industries);
            });

            $("select#v option").each(function(){
                this.selected = (this.value == searchCriteria.job_level);
            })

            $("select#searchLocations option").each(function(){
                this.selected = (this.value == searchCriteria.job_locations);
            })
            $("#searchSalary").val(searchCriteria.salary);
        }
    });

}

function saveSearchJobCriteria() {
    $("#searchSubmitButton").on('click', function() {
        var keyword = $("#searchKeyword").val();
        var industry = $("#searchIndustries").find('option:selected').val();
        var jobLevel = $("#searchJobLevels").find('option:selected').val();
        var location = $("#searchLocations").find('option:selected').val();
        var salary = $("#searchSalary").val();

        db.settings.put({
            keyword: keyword,
            industries: industry,
            job_level: jobLevel,
            job_locations: location,
            salary: salary
        }, 'search_criteria');
    })
}

function menuActive() {
    $("#mainMenu a").click(function() {
        var contentID = $(this).attr("contentID");
        showContent(contentID);
    });
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

function playSoundDemo() {
    //TODO: Anh Lan will handle this
}

function updateSoundNotifications () {
    try {
        //Update enable sound Notification
        $('#soundNotification').on('change', function () {
            var sound = $('.sound').find('option:selected').val();
            var volume = $('#notificationSoundVolume').val();
            db.settings.put({
                enable_sound: this.checked ? 1 : 0,
                sound: sound,
                volume: volume
            }, 'sound_notifications').then(showSoundNotifications());
        });

        //Update sound
        $('.sound').on('change', function () {
            var sound = this.value;
            var volume = $('#notificationSoundVolume').val();

            db.settings.put({
                enable_sound: 1,
                sound: sound,
                volume: volume
            }, 'sound_notifications').then(showSoundNotifications());
        });

        //Update Volume
        $('#notificationSoundVolume').on('change', function () {
            var sound = $('.sound').find('option:selected').val();
            var volume = this.value;

            db.settings.put({
                enable_sound: 1,
                sound: sound,
                volume: volume
            }, 'sound_notifications').then(showSoundNotifications());
        })

        //Update run in background
        $('#runInBackground').on('change', function () {
            db.settings.put(this.checked ? 1 : 0, 'run_in_background');
        });
    } catch (ex) {
        console.log(ex.message);
    }
}

function showSoundNotifications () {
    //Get information from db
    db.settings.get('sound_notifications').then(function(isSoundNotification) {
        if (isSoundNotification !== undefined) {
            $('.sound').prop("disabled", !isSoundNotification.enable_sound);
            $('#notificationSoundVolume').prop("disabled", !isSoundNotification.enable_sound);
            $('#playNotificationSound').prop("hidden", !isSoundNotification.enable_sound);
        }

        loadSoundSettings(isSoundNotification);
    });

    db.settings.get('run_in_background').then(function(isRunInBackground) {
        if (isRunInBackground !== undefined || isRunInBackground !== 'NULL') {
            isRunInBackground ? $('#runInBackground').prop('checked', true) : $('#runInBackground').prop('checked', false);
        }
    });
}

function loadSoundSettings(isSoundNotification) {
    if (isSoundNotification !== undefined) {
        isSoundNotification.enable_sound ? $("#soundNotification").prop('checked', true) : $("#soundNotification").prop('checked', false);
        $("select.sound option")
            .each(function() { this.selected = (this.value == isSoundNotification.sound); });
        $('#notificationSoundVolume').val(isSoundNotification.volume);
    } else {
        $("#soundNotification").prop('checked', defaultSettings.ENABLE_SOUND);
        $("select.sound option")
            .each(function() { this.selected = (this.value == defaultSettings.SOUND); });
        $('#notificationSoundVolume').val(defaultSettings.VOLUME);
    }
}

function showDesktopNotifications() {
    //Get information from db
    db.settings.get('desktop_notifications').then(function(isDesktopNotification) {
        if (isDesktopNotification !== undefined) {
            $("#doNotShowNotificationIfVNWTabActive").prop('disabled', !isDesktopNotification.enable_desktop_notification);
            $('#dn_timeout').prop('disabled', !isDesktopNotification.enable_desktop_notification);
        }

        loadDesktopSettings(isDesktopNotification);
    });
}

function updateDesktopNotifications() {
    //Update enable Desktop Notification
    $('#desktopNotification').on('change', function() {
        db.settings.put({
            enable_desktop_notification: this.checked ? 1 : 0,
            not_show_notification: $("#doNotShowNotificationIfVNWTabActive").checked ? 1 : 0,
            time_out: $('#dn_timeout').find('option:selected').val()
        }, 'desktop_notifications').then(showDesktopNotifications());
    });

    //Update Desktop Notification timeout
    $('#dn_timeout').on('change', function() {
        console.log(this.value);
        db.settings.put({
            enable_desktop_notification: 1,
            not_show_notification: $("#doNotShowNotificationIfVNWTabActive").checked ? 1 : 0,
            time_out: this.value
        }, 'desktop_notifications').then(showDesktopNotifications());
    });

    $('#doNotShowNotificationIfVNWTabActive').on('change', function() {
        db.settings.put({
            enable_desktop_notification: 1,
            not_show_notification: this.checked ? 1 : 0,
            time_out: $('#dn_timeout').find('option:selected').val()
        }, 'desktop_notifications').then(showDesktopNotifications());
    });
}

function loadDesktopSettings(isDesktopNotification) {
    if (isDesktopNotification !== undefined) {
        isDesktopNotification.enable_desktop_notification ? $('#desktopNotification').prop('checked', true) : $("#desktopNotification").prop('checked', false);
        $("select#dn_timeout option").each(function(){
            this.selected = (this.value == isDesktopNotification.time_out);
        })
        isDesktopNotification.not_show_notification ? $('#doNotShowNotificationIfVNWTabActive').prop('checked', true) : $("#doNotShowNotificationIfVNWTabActive").prop('checked', false);
    } else {
        $("#desktopNotification").prop('checked', defaultSettings.ENABLE_DN);
        $("#doNotShowNotificationIfVNWTabActive").prop('checked', defaultSettings.VNW_NOT_SHOW_DN);
        $("select#dn_timeout option")
            .each(function() { this.selected = (this.value == defaultSettings.DN_TIMEOUT); });
    }
}