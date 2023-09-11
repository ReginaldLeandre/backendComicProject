const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const favoriteSchema = new Schema( {
    favorite: String,
    enum: ["Iron Man", "Spider-man", "Captain America", "Hulk", "Black Widow", "X-Men", "Thor", "Black Panther"],
});




const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true},
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
      },
    password: {
        type: String,
        trim: true,
        minLength: 3,
        required: true
      },
    likesDislikes: {
        type: String,
        enum: ["Action & Adventure", "Mystery", "Comedy", "Horror", "Dark-Themed Stories", "Romance", "Drama"],
        default: "Action & Adventure"
    },

    purchaseHistory: [{
        type: Schema.Types.ObjectId,
        ref: "PurchaseHistory",
        default: null
    }]
    ,
    favorites: [favoriteSchema],

    isActive: {
        type: Boolean,
        default: true,
    },
    // email: String,
    // avatar: String,
    userId: Schema.Types.ObjectId
    }, 
    {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret){
          delete ret.password;
          return ret;
        }
    }

  })

module.exports = mongoose.model('User', userSchema)

