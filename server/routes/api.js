// api.js - api routes
const express = require('express'),
  router = express.Router(),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty(),
  unless = require('express-unless'),
  ftp = require('ftp'),
  checkRole = require('../functions/helperFunctions/checkRole'),
  tokenExists = require('../functions/accountFunctions/token-exists-check'),
  models = require('../models'),
  aws = require('aws-sdk'),
  S3_BUCKET = process.env.S3_BUCKET || 'visionarchiveicons',
  ACCESS_KEY_ID = 'AKIAJ4BJYRIKBHHSCEBQ',
  SECRET_ACCESS_KEY = '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'
  User = models.User,
  Icon = models.Icon;

aws.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'ca-central-1'
});

// set up storage for images ==========

// todo: attach the user's name to this
// then send a link to the user's id that connects this file to their account
tokenExists.unless = unless;
router.use(tokenExists.unless({ method: 'GET'}));

router.get('/', (req, res) => {
  // console.log('get icon path');
  res.json('touched api');
})

// router.get('/icon', (req, res) => {
//   // console.log('get icon path');
//   res.json('hello world');
// })

router.post('/sign', (req, res) => {

  const s3 = new aws.S3(),
  time = new Date().getTime(),
  fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
  fileReqName = req.query['file-name'],
  fileType = req.query['file-type'],
  fileName = `${req.user._id.substring(0, 8)}_${time}_${fileReqName}`,
  s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  if (fileTypes.indexOf(fileType) === -1) {
    console.error('Invalid file format');
    return res.end('Please upload a JPG, SVG, PNG, or GIF');
  }

  else {

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
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

  }
});

router.put('/icon', (req, res) => {
  User.findById(req.user._id)
    .exec(function(err, user){
      if (!user) {
        console.log('No user in DB');
        res.status(401).send('Sorry, we cannot find that user.');
      } else {
        const data = req.body;
        if (data) {
          const icon = new Icon({
            url: data.url,
            admin: [user._id],
            title: data.title,
            story: data.story,
            tags: (data.tags || '').split(','),
            location: data.location,
          });
          icon.save((err, savedIcon) => {
            if (err) {
              return res.end('Error saving to database');
            } else {
              res.json(savedIcon);
            }
          });
        } else {
          return res.end('No Icon data was received');
        }
      }
    });
});

router.get('/icon/:iconId', (req, res) => {
  const iconId = req.params.iconId;
  if (iconId === 'all') {
    Icon.find({}).exec((err, icons) => {
      if (err) {
        console.error(err);
        res.status(401).send('Error finding icons');
      }

      res.write(JSON.stringify(icons));
      res.end();
    });
  } else if (iconId) {
    Icon.findById(iconId).exec((err, icon) => {

      if (err) {
        console.error(err);
        res.status(401).send('Icon not found');
      }

      const params = {
        _id: { $in: icon.admin }
      };

      User.find(params)
        .select({ name: 1, _id: 1})
        .exec((err, users) => {
          if (err) {
            console.error(err);
            res.status(401).send('Icon author not found');
          }

          icon.authors = users;
          if (req.user) {
            const admin = icon.admin.find(function(u) {
              return u === req.user._id;
            });
            console.log(admin, req.user._id);
            if (admin) {
              icon.isOwnIcon = true;
            }
          }

          res.json(icon);
        });

    });
  } else {
    res.status(401).send('Icon author not found');
  }

});


// routes for user  =============================
router.get('/user', checkRole('get_all_user'), (req, res) => {
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
