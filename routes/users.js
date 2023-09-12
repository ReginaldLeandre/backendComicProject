const express = require('express');
const usersCtrl = require('../controllers/users');
const router = express.Router()
const ensureLoggedIn = require('../config/ensureLoggedIn')


router.post('/create', usersCtrl.create);
router.post('/:id/fav', usersCtrl.addFavorite);
router.get('/:id', usersCtrl.show)
router.get('/:id/ranDFav', usersCtrl.random)




module.exports = router;