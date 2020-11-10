import express from "express";
import usercontroller from "../controller/usercontroller"
//import ironlist from "../controller/ironlistcontroller"

// var express = require('express');
// var usercontroller = require('../controller/usercontroller');



const router = express.Router();
router.post('/login', usercontroller.login);

router.post('/add_user_record', usercontroller.add_user_record);
router.post('/all_list_company_record', usercontroller.all_list_company_record);

router.post('/update_company_status', usercontroller.update_company_status);
router.post('/deactiveCompanyByIds', usercontroller.deactiveCompanyByIds);


// ironlist api's
//router.get('/getlistingdb', ironlist.getlistingdb);

// router.post('/getlistinges',ironlist.getlistinges);
// router.post('/getAutoSuggestion', ironlist.getAutoSuggestion);
// router.get('/getTopData', ironlist.getTopData);


module.exports = router;


