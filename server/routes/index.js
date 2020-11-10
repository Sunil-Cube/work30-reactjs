var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.post('/login',function(req,res,nex){

    console.log("yes that is custom api login ");
}); 

module.exports = router;
