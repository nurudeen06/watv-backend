const {Listing} = require('../models/listing');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        cb(null, 'public/uploads');
        let uploadError = new Error('invalid image type');

        if (isValid) {
             uploadError = null;
         }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    let filter = {};
    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }
    const listingList = await Listing.find(filter).populate('category');

    if(!listingList) {
        res.status(500).json({success: false})
    } 
    res.send(listingList);
})

router.get(`/:id`, async (req, res) =>{
    const listing = await Listing.findById(req.params.id).populate('category');

    if(!listing) {
        res.status(500).json({success: false})
    } 
    res.send(listing);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    //const category = await Category.findById(req.body.category);
    // const category = await Category.find({name: req.body.category});
    // if(!category) return res.status(400).send('Invalid Category')

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    //const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let listing = new Listing({
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        //image: fileName,
        image: `${basePath}${fileName}`, //"http://localhost:3000/public/uploads/image-2323232"
        number: req.body.number,
        email: req.body.email,
    })

    listing = await listing.save();

    if(!listing)
    return res.status(500).send('The Listing cannot be created')

    res.send(listing);
})

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
        if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Listing Id')
    }

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(400).send('Invalid Listing!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = listing.image;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        },
        {new: true}
    )

    if(!updatedListing)
    return res.status(500).send('the Listing cannot be updated!')

    res.send(updatedListing);
})


router.delete(`/:id`, (req, res) =>{
    Listing.findByIdAndRemove(req.params.id).then(listing =>{
        if(listing) {
            return res.status(200).json({success: true, message: 'The Listing is deleted!'})
        } else {
            return res.status(404).json({success: false, message:'Listing not found!!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error:err})
    })
})

router.get(`/get/count`, async (req, res) =>{
    
    let listingCount = await Listing.countDocuments();
    //const listingCount = await Listing.countDocuments((count) => count)

    if(!listingCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        listingCount: listingCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    let listings = await Listing.find({isFeatured: true}).limit(+count);
    //const listingCount = await Listing.countDocuments((count) => count)

    if(!listings) {
        res.status(500).json({success: false})
    } 
    res.send(listings);
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Listing Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );

        if (!listing)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(listing);
    
});

module.exports =router;