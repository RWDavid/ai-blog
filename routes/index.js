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

router.post('/upload-image', upload.single('animal-image'), function(req, res, next) {
  let { spawn } = require('child_process');
  
  /*
  let ml_proc = spawn('/home/david/anaconda3/envs/fastai/bin/python', 
    [ 'animal_predict.py',
      '../tmp/uploads/' + req.file.filename],
    { cwd: path.join(__dirname, '../ml_procs') }
  );
  */

  let ml_proc = spawn('conda', ['run', '-n', 'fastai', 'python', 'animal_predict.py', '../tmp/uploads/' + req.file.filename],
    { cwd: path.join(__dirname, '../ml_procs') });

  let proc_output = "";

  ml_proc.stdout.on('data', function(data) {
    proc_output += data.toString();
  });

  ml_proc.stdout.on('end', function(){
    res.send(proc_output.includes('cat') ? 'cat' : 'dog');
    res.end();
    fs.unlink(path.join(__dirname, "../tmp/uploads/", req.file.filename), (err) => {
      if (err) { console.error(err); }
    });
  });
});

module.exports = router;
