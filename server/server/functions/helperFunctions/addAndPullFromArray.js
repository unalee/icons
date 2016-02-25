// addAndPullFromArray.js
// takes an array of things to add
// and an array of things to remove
// from a final array value
'use strict';

module.exports = function(main, add, remove) {
// Module requirements ==========================
 	var Promise = require('bluebird');

 	var addThings = function(a){
 		Promise.map(a, function(n){
    		if(main.indexOf(n) === -1){
    			main.push(n);
    			return main;
    		} else { 
    			return main;
    		}
 		});
 	}

 	var removeThings = function(r){
 		Promise.map(r,function(n){
			if(main.indexOf(n) !== -1){
				main.splice(main.indexOf(n), 1);
				return main;
			} else { 
				return main;
			}
	 	});
	 }

	return Promise.all([ addThings(add), removeThings(remove)])
};
  
// if(req.body.add._participants){
//                     // if there are participant ids attached to this update, add them to the list
//                     _.map(req.body.add._participants, function(n, index){
//                             if(model._participants.indexOf(n) === -1){
//                                 console.log('adding participant to squad', n);
//                                 return model._participants.push(n);
//                             }
//                         });
//                 }

//                 if(req.body.remove._participants){
//                     _.map(req.body.remove._participants, function(n, index){
//                         if(model._participants.indexOf(n) !== -1){
//                             model._participants.splice(model._participants.indexOf(n), 1);
//                         }
//                     })
//                 }
// return new Promise(function (resolve, reject) {
//         mongooseModel.save(function(err,done) {
//           if (!done || done.error || err) {
//             console.error(err);
//             return reject(done.error);}
//           return resolve(done);
//         })
//     })

// }