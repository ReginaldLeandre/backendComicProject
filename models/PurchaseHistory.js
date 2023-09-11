const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const purchaseHistorySchema = new Schema( {
    date:  {
        type: Date,
        default: null
    },
    price: {
        type: String,
        default: null
    },
    purchaseItems: {
        type: [Object],
        default: null
    },
    

},
{
    timestamps: true,
  }
);


module.exports = mongoose.model('PurchaseHistory', purchaseHistorySchema)