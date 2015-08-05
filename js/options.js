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
    showSoundNotifications();
    updateSoundNotifications();
    playSoundDemo();

    showDesktopNotifications();
    updateDesktopNotifications();
});

function playSoundDemo() {
    //TODO: Anh Lan handle this
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