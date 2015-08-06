var Settings = function() {
    var cache = {};

    function loadFromDB(cb) {
        wrappedDB.transaction('r', wrappedDB.settings, function() {
            wrappedDB.settings.each(function(setting) {
                cache[setting.key] = setting.value;
            });
        }).then(function() {
            cb();
        });
    }

    Settings.defaults = {
        "desktopNotification": true,
        "sound_audio": 'chime.ogg',
        "notificationSoundVolume": 100
    };
    Settings.load = function(cb) {
        loadFromDB(cb);
    };
    Settings.read = function(key) {
        if (cache[key] != null) {
            return cache[key];
        } else if (Settings.defaults[key] != null) {
            return Settings.defaults[key];
        }
        return null;
    };
    Settings.store = function(key, value) {
        cache[key] = value;
        return wrappedDB.transaction('rw', wrappedDB.settings, function() {
            wrappedDB.settings.put({ key: key, value: value });
        });
    };
    Settings.delete = function(key) {
        delete cache[key];
        return wrappedDB.transaction('rw', wrappedDB.settings, function() {
            wrappedDB.settings.delete(key);
        });
    };
};
Settings();
