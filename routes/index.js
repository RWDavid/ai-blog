var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer')
var upload = multer({ dest: 'tmp/uploads'});
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/generic', function(req, res, next) {
  res.render('generic');
});

router.get('/elements', function(req, res, next) {
  res.render('elements');
});

router.get('/about-me', function(req, res, next) {
  res.render('about-me');
});

router.get('/fastai', function(req, res, next) {
  res.render('fastai');
});

router.get('/fastai/chapter-1', function(req, res, next) {
  res.render('fastai/chapter-1');
});

router.get('/cat-or-dog', function(req, res, next) {
  res.render('cat-or-dog');
});

router.get('/cat-or-dog/cat', function(req, res, next) {
  res.render('cat-or-dog/cat');
});

router.get('/cat-or-dog/dog', function(req, res, next) {
  res.render('cat-or-dog/dog');
});

router.post('/upload-image', upload.single('animal-image'), function(req, res, next) {
  let { spawn } = require('child_process');
  let ml_proc = spawn('python', ['animal_predict.py', '../tmp/uploads/' + req.file.filename],
    { cwd: path.join(__dirname, '../ml_procs') });

  let proc_output = "";

  ml_proc.stdout.on('data', function(data) {
    proc_output += data.toString();
  });

  ml_proc.stdout.on('end', function(){
    res.render(proc_output.includes('cat') ? 'cat-or-dog/cat' : 'cat-or-dog/dog');
    res.end();
    fs.unlink(path.join(__dirname, "../tmp/uploads/", req.file.filename), (err) => {
      if (err) { console.error(err); }
    });
  });
});

module.exports = router;
