var wrappedDB = new Dexie('VNW_SMART_JA');
Dexie.Promise.on('error', function(e) {
    console.log('Uncaught database error: ' + e);
});

wrappedDB.version(2).stores({
    settings: 'key, value',
    jobs: 'jobId, jobTitle, companyName'
});

wrappedDB.on('blocked', function() {
    debugger;
});
wrappedDB.open();
