// lib
var importResolve = require('import-resolve');

// spits out a master dist file with all your wonderful stylesheet
// things concatenated
importResolve({
    "ext": "scss",
    "pathToMain": "./source/style.scss",
    "output": "./dist/style.scss"
});
