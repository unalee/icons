// toTitleCase.js
// a function to titlecase strings
'use strict';

module.exports = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };