const pkg = require('apollo-upload-client');
console.log('Exports:', Object.keys(pkg));
console.log('Type of pkg:', typeof pkg);
console.log('Is createUploadLink available?', !!pkg.createUploadLink);
