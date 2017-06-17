// api.js - api routes
const express = require('express'),
  router = express.Router(),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty(),
  unless = require('express-unless'),
  ftp = require('ftp'),
  checkRole = require('../functions/helperFunctions/checkRole'),
  tokenExists = require('../functions/accountFunctions/token-exists-check'),
  getUserFromToken = require('../functions/accountFunctions/get-user-from-token'),
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


tokenExists.unless = unless;
router.use(tokenExists.unless({ method: 'GET'}));

router.get('/', (req, res) => {
  // console.log('get icon path');
  res.json('touched api');
})

/* When adding a new icon, this endpoint gets a signed URL from Amazon S3 and
 returns it to the user. That URL is then used to upload the file */

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

/* Icon endpoints */

/* Get all icons. Paginated using limit and skip */

router.get('/icon', (req, res) => {
  var limit = req.body.limit || 50;
  var skip = req.body.skip || 0;
  var userId = req.body.userId;
  var tag = req.body.tag;
  var params = {};

  if (userId) {
    params.authors = userId;
  }

  if (tag) {
    params.tags = tag;
  }

  Icon.find(params)
    .limit(limit)
    .skip(skip)
    .sort({
      created: 'desc'
    })
    .exec((err, icons) => {
      if (err) {
        console.error(err);
        res.status(401).send('Error finding icons');
      }

      res.write(JSON.stringify(icons));
      res.end();
  });
})

/* Get a single Icon by id
Will check for a token and then match that to the Icon's owner. If they match, the icon will
be returned as editable */

router.get('/icon/:iconId', (req, res) => {
  const iconId = req.params.iconId;
  Icon.findById(iconId).exec((err, icon) => {

    if (err) {
      console.error(err);
      res.status(401).send('Icon not found');
    }

    const params = {
      _id: { $in: icon.admin }
    };

    /* Match the Icon to it's .authors[] User objects */

    User.find(params)
      .select({ name: 1, _id: 1})
      .exec((err, users) => {
        if (err) {
          // There is no valid user.
          console.error(err);
          res.status(401).send('Icon author not found');
        }

        icon.authors = users;
        const token = req.body.token || req.query.token || req.headers[
          'x-access-token'];
        getUserFromToken(token).then((user) => {
          if (user) {
            const admin = icon.admin.find(function(u) {
              console.log(u, user._id);
              return u === user._id;
            });

            if (admin) {
              icon.isOwnIcon = true;
            }
          }

          res.json(icon);

        }, (error) => {
          res.status(500).send('Server error');
        });
    });
  });
});

/* Save a new Icon object */

router.put('/icon', (req, res) => {
  User.findById(req.user._id)
    .exec(function(err, user){
      if (!user) {
        console.log('No user in DB');
        res.status(401).send('Sorry, we cannot find that user.');
      } else {
        const data = req.body;
        if (data) {
          const unique = (arrArg) => {
            return arrArg.filter((elem, pos, arr) => {
              return arr.indexOf(elem) === pos;
            });
          }
          const tags = unique((data.tags || '').split(','));
          const icon = new Icon({
            url: data.url,
            admin: [user._id],
            title: data.title,
            story: data.story,
            tags: tags,
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

router.get('/tag', (req, res) => {
  Icon.distinct('tags')
    .exec(function(err, tags) {
      if (err) {
        console.log('Error finding tags');
        return res.end('Error finding tags');
      } else {
        res.write(JSON.stringify(tags));
        res.end();
      }
    });
});

/* Get all icons associated with a given tag. Paginated */

router.get('/tag/:tag', (req, res) => {
  const tag = req.params.tag;
  var limit = req.body.limit || 50;
  var skip = req.body.skip || 0;
  Icon.find({tags: tag})
    .skip(skip)
    .limit(limit)
    .sort({created: 'desc'})
    .exec((err, icons) => {
      if (err) {
        console.error(err);
        res.status(401).send('Icon author not found');
      }

      res.json(icons);
    });
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
