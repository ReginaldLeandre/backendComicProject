const express = require('express');
const usersCtrl = require('../controllers/users');
const router = express.Router()
const ensureLoggedIn = require('../config/ensureLoggedIn')


router.post('/', usersCtrl.create);





module.exports = router;