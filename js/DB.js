var wrappedDB = new Dexie('VNW_SMART_JA');
Dexie.Promise.on('error', function(e) {
    console.log('Uncaught database error: ' + e);
});

wrappedDB.version(1).stores({
    settings: 'key',
    jobs: 'jobId, unRead'
});

wrappedDB.on('blocked', function() {
    debugger;
});
wrappedDB.open();
