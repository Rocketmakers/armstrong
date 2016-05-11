// lib
var importResolve = require('import-resolve');

// spits out a master dist file with all your wonderful stylesheet
// things concatenated

// IMPORTS
importResolve({
    "ext": "scss",
    "pathToMain": "./source/imports.scss",
    "output": "./dist/imports.scss"
});

// CORE
importResolve({
    "ext": "scss",
    "pathToMain": "./source/style.scss",
    "output": "./dist/style.scss"
});
