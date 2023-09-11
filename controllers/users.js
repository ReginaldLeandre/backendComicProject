const PurchaseHistory = require('../models/PurchaseHistory');
const User = require('../models/User')
const axios = require('axios');
const crypto = require('crypto');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

/***************************************************************************************************
 *                                         Global Variables for API Access
 *                                                 
 ***************************************************************************************************/
const ts = 1;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BASE_URL = process.env.BASE_URL;



const concatenatedString = ts + PRIVATE_KEY + PUBLIC_KEY;


const md5Hash = crypto.createHash('md5').update(concatenatedString).digest('hex');




/***************************************************************************************************
 *                                          Controller Functions
 *                                                 
 ***************************************************************************************************/

async function register(req, res, next){
  //  note: req.body has the password before storing the user info in the database
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
 	req.body.password = passwordHash;
 	const newUser = await User.create(req.body);
 	res.status(201).json({
 		user: newUser,
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};


module.exports = {
	create: register
}







