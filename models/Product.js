const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide product name"],
    maxlength: [100, "Name can not be more than 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    default: 0,
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: [1000, "Description can not be more than 1000 characters"],
  },
  image: {
    type: String,
    default: "/uploads/example.jpeg",
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    enum: ["office", "kitchen", "bedroom"],
  },
  company: {
    type: String,
    required: [true, "Please provide company"],
    enum: {
      values: ["ikea", "liddy", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
  colors: {
    type: [String],
    default: ["#222"],
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: true,
    default: 15,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

// We want singleProduct, that review should be display but we have no connection Product->Review
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",           // grab me productId
  foreignField: "product",      // grab me product which was in Review model
  justOne: false
})

// If we delete product, then review also be deleted with that product
ProductSchema.pre("remove", async function(){
  await this.model("Review").deleteMany({product: this._id});
})

module.exports = mongoose.model("Product", ProductSchema);