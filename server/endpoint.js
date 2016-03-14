// endpoint.js
'use strict';

// API Endpoint List - shows available endpoints on console on login

module.exports = function(routes, src) {

  var Table = require('cli-table');
  var table = new Table({
    head: ["", "Name", "Path"]
  });

  console.log('\nAPI for this service \n');
  if (src === 'restify') {
    console.log('\n********************************************');
    console.log('\t\tRESTIFY');
    console.log('********************************************\n');
    for (var key in routes) {
      if (routes.hasOwnProperty(key)) {
        var val = routes[key];
        var _o = {};
        _o[val.method] = [val.name, val.spec.path];
        table.push(_o);

      }
    }
  } else {
    console.log('\n********************************************');
    console.log('\t\tEXPRESS');
    console.log('********************************************\n');
    for (var key in routes) {
      if (routes.hasOwnProperty(key)) {
        var val = routes[key];

        if (val.name == 'router') {
          val.handle.stack.forEach(val => {
            const route = val.route,
                  regexp = val.regexp.toString();

            let row = {},
                matchPath,
                reply;

            if (val.regexp && val.handle.stack) {
              matchPath = regexp.match(/\w+/)[0];

              val.handle.stack.forEach(thing => {
                reply = matchPath + thing.route.path;
                console.log('thing', reply, thing.route.stack[0].method);
                if (reply && thing.route.stack[0].method) {
                  row[thing.route.stack[0].method] = [reply, reply];
                  table.push(row);
                }
              })


            }
          })
        }
        if (val.route) {
          val = val.route;
          var _o = {};
          _o[val.stack[0].method] = [val.path, val.path];
          table.push(_o);
        }
      }
    }
  }
  console.log(table.toString());

  return table;
};
