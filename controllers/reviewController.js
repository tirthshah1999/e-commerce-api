const Review = require("../models/Review");
const Product = require("../models/Product");
const {BadRequestError, NotFoundError} = require("../errors");
const {checkPermission} = require("../utils");
const {StatusCodes} = require("http-status-codes");

const createReview = async(req, res) => {
    const {product: productId} = req.body;
    
    const isValidProduct = await Product.findOne({_id: productId});
    if(!isValidProduct){
        throw new NotFoundError(`No Product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({product: productId, user: req.user.userId});
    if(alreadySubmitted){
        throw new BadRequestError("Already submitted review for this product");
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});
}

const getAllReviews = async(req, res) => {
// populate - info to other document: I want to show product: name, company, price on getAllReviews
    const reviews = await Review.find().populate({path: 'product', select: 'name company price'});
    res.status(StatusCodes.OK).json({reviews});
}

const getSingleReview = async(req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});
    if(!review){
        throw new NotFoundError(`No Review with id: ${reviewId}`);
    } 
    res.status(StatusCodes.OK).json({review});
}

const updateReview = async(req, res) => {
    const {id: reviewId} = req.params;
    const {rating, title, comment} = req.body;

    const review = await Review.findOne({_id: reviewId});
    if(!review){
        throw new NotFoundError(`No Review with id: ${reviewId}`);
    }
    
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({review});
}

const deleteReview = async(req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});
    if(!review){
        throw new NotFoundError(`No Review with id: ${reviewId}`);
    } 
    
    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
}

module.exports = {
    createReview, 
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}