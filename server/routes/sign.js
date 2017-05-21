// user.js - icon routes

var express = require('express');
var aws = require('aws-sdk');

var router = express.Router();

var checkRole = require('../functions/helperFunctions/checkRole');

// ROUTES =========================================
// middleware that is specific to this router

router.use(checkRole);

router.get('/sign', (req, res) => {
  const s3 = new aws.S3();
  const S3_BUCKET = process.env.S3_BUCKET;
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
