// function index
// index.js
'use strict';

module.exports = {
	inviteCreate        : require('./accountFunctions/create-invite'),
	forgotPasswordToken : require('./accountFunctions/forgot-password-token'),
	resendInvite        : require('./accountFunctions/resend-invite'),
	resetPassword       : require('./accountFunctions/reset-password'),
  addAndRemove        : require('./helperFunctions/addAndPullFromArray'),
  jwtAuth             : require('./helperFunctions/jwtAuth'),
	modelSave	     	    : require('./helperFunctions/modelSave'),
  modelDelete         : require('./helperFunctions/modelDelete'),
	toTitleCase		      : require('./helperFunctions/toTitleCase'),
  updateDoc           : require('./helperFunctions/updateDoc'),
  checkRole           : require('./helperFunctions/checkRole')
}
