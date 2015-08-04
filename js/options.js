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

$(document).ready(function(){
    showSoundNotifications();
    updateSoundNotifications();
});

function updateSoundNotifications () {
    //Update enable sound Notification
    $('#soundNotification').on('change', function() {
        var sound = $('.sound').find('option:selected').val();
        var volume = $('#notificationSoundVolume').val();

        db.settings.put({
            enable_sound: this.checked ? 1 : 0,
            sound: sound,
            volume: volume
        }, 'sound_notifications').then(showSoundNotifications());
    });

    //Update sound
    $('.sound').on('change', function() {
        var sound = this.value;
        var volume = $('#notificationSoundVolume').val();

        db.settings.put({
            enable_sound: 1,
            sound: sound,
            volume: volume
        }, 'sound_notifications').then(showSoundNotifications());
    });

    //Update Volume
    $('#notificationSoundVolume').on('change', function() {
        var sound = $('.sound').find('option:selected').val();
        var volume = this.value;

        db.settings.put({
            enable_sound: 1,
            sound: sound,
            volume: volume
        }, 'sound_notifications').then(showSoundNotifications());
    })
}

function showSoundNotifications () {
    //Get information from db
    db.settings.get('sound_notifications').then(function(isSoundNotification) {
        if (isSoundNotification !== undefined) {
            $('.sound').prop("disabled", !isSoundNotification.enable_sound);
            $('#notificationSoundVolume').prop("disabled", !isSoundNotification.enable_sound);
            $('#playNotificationSound').prop("hidden", !isSoundNotification.enable_sound);
        }

        loadSettings(isSoundNotification);
    });
}

function loadSettings(isSoundNotification) {
    if (isSoundNotification !== undefined) {
        isSoundNotification.enable_sound ? $("#soundNotification").prop('checked', true) : $("#soundNotification").prop('checked', false);
        $("select.sound option")
            .each(function() { this.selected = (this.value == isSoundNotification.sound); });
        $('#notificationSoundVolume').val(isSoundNotification.volume);
    } else {
        $("#soundNotification").prop('checked', defaultSettings.enable_sound);
        $("select.sound option")
            .each(function() { this.selected = (this.value == defaultSettings.sound); });
        $('#notificationSoundVolume').val(defaultSettings.volume);
    }
}