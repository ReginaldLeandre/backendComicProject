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


async function show(req, res) {
  try {
    res.status(200).json(await User.findById(req.params.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addFavorite(req, res) {
  try {
    const userId = req.params.userId;
    const favoriteThing = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorite: favoriteThing } },
      { new: true }
    );

    if (!updatedUser) {
      
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}




async function showFavCharComics(req, res) {
  try {
    const userId = req.params.userId;

   
    const userFav = await User.findOne({ _id: userId });

    if (!userFav) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userFavChar = userFav.favorite;
    const randomIndex = Math.floor(Math.random() * userFavChar.length);
    const randomElement = userFavChar[randomIndex];

    
    const response = await axios.get(`${BASE_URL}/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`, {
      params: {
        limit: 20,
        characters: randomElement
      }
    });

    const comics = response.data.data.results.map(comic => {
      const comicId = comic.id;
      const firstImage = comic.thumbnail && comic.thumbnail.path
        ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
        : null;
      return {
        title: comic.title,
        id: comicId,
        image: firstImage
      };
    });

    res.json(comics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}




module.exports = {
	create: register,
  show,
  addFavorite,
  random: showFavCharComics
}







