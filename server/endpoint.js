// endpoint.js
'use strict';

const _ = require('lodash');
// API Endpoint List - shows available endpoints on console on login

module.exports = function(routes, src) {

  const Table = require('cli-table');
  let table = new Table({
      head: ["", "Name", "Path"]
    }),
    container = [];

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
        let val = routes[key];

        if (val.name == 'router') {
          val.handle.stack.forEach(val => {
            let route = val.route,
              regexp = val.regexp.toString();

            let row = {},
              matchPath,
              reply;

            if (val.regexp && val.handle.stack) {
              matchPath = regexp.match(/\w+/)[0];

              val.handle.stack.forEach(thing => {
                reply = matchPath + thing.route.path;
                container.push({
                  prefix: matchPath,
                  method: thing.route.stack[0].method,
                  path: reply
                });
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

  container = _.compact(container);
  container.forEach(item => {
    let row = {};
    row[item.method] = [item.prefix, item.path];
    table.push(row);
  })

  console.log(table.toString());

  return table;
};
