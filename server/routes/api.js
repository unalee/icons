// api.js - api routes
const express = require('express'),
  router = express.Router(),
  ftp = require('ftp'),
  checkRole = require('../functions/helperFunctions/checkRole'),
  tokenExists = require('../functions/accountFunctions/token-exists-check'),
  models = require('../models'),
  aws = require('aws-sdk'),
  S3_BUCKET = process.env.S3_BUCKET || 'visionarchive',
  User = models.User,
  Icon = models.Icon;

// set up storage for images ==========

// todo: attach the user's name to this
// then send a link to the user's id that connects this file to their account
router.use(tokenExists);

router.get('/', (req, res) => {
  // console.log('get icon path');
  res.json('touched api');
})

router.get('/icon', (req, res) => {
  // console.log('get icon path');
  res.json('hello world');
})

router.post('/icon', (req, res) => {
  const s3 = new aws.S3(),
    fileTypes = ['image/jpeg', 'image/png', 'image/svg+xml'],
    fileName = `${req.user._id.substring(0, 8)+ '_' + req.body.fileName }`,
    fileType = req.body.fileType,
    s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    if (fileTypes.indexOf(fileType) == -1) {
      console.error('Invalid file format');
      return res.end('Please upload a JPG, SVG, or PNG.');
    }

    else {
      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          console.log(err);
          return res.end();
        }

        //todo: what are we actually passing for this user to be found

        models.User.findById(req.user._id)
          .exec(function(err, user){
              if (!user) {
                console.log('No user in DB');
                res.status(401).send('Sorry, we cannot find that user!'); 
              }
              else {
                // we have a user. Save the icon with their name on it, 
                // the URL is the S3 url
                // send back the URL and user ID for display.
                // console.log('Found user ', user)
                const icon = new Icon({
                  url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
                  admin: [user._id],
                  story: req.body.story
                });

                icon.save((err, savedIcon) => {
                  const returnData = {
                    signedRequest: data,
                    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                  };

                  res.json(returnData);
                });
              }
          });
      });
    }
});

// routes for user  =============================
router.get('/user', checkRole('get_all_user'), (req, res) => {
  console.log('touched get all users');
  User.find().exec((err, next) => {
    if (err) {
      console.error(err);
    }
    res.json(next);
  });
});

router.put('/user/', checkRole('update_self'), function(req, res) {
  User.findById(req.user._doc._id).exec((err, user) => {
    if (err) {
      console.error(err);
    }
    if (!user) {
      console.log('No user found.')
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err, data) => {
      if (err) {
        console.error(err);
        res.json({
          error: err
        })
      }
      res.json(data);
    })
  });
});

module.exports = router;
