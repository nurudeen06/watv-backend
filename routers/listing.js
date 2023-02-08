const {Listing} = require('../models/listing');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const aws = require('aws-sdk');
const fs = require('fs');

const region = 'us-east-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};
const S3_BUCKET = process.env.S3_BUCKET;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        cb(null, 'public/uploads/');
        let uploadError = new Error('invalid image type');

        if (isValid) {
             uploadError = null;
         }
        cb(uploadError, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    
    const listingList = await Listing.find();

    if(!listingList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(listingList);
})

router.get(`/:id`, async (req, res) =>{
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(listing);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    //if (!file) return res.status(400).send('No image in the request');
     //const fileName = file.filename;

     if(file){
     const s3 = new aws.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region:region
    });
    console.log(accessKeyId)
    console.log(secretAccessKey)
    const uploadImage=(file)=>{
        const fileStream =fs.createReadStream(file.path);

        const params = {
            Bucket: S3_BUCKET,
            Key: file.originalname,
            Body: fileStream,
        };
        s3.upload(params, function (err, data) {
            if (err) {
                throw err
            }
        });
    }
    uploadImage(file);
}
   let upload = `https://${S3_BUCKET}.s3.amazonaws.com/${file.originalname}`
    let listing = new Listing({
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        image: file? upload : `${req.get('host')}/public/uploads/default.jpg`,
        //image: `${basePath}${fileName}`, //"http://localhost:3000/public/uploads/image-2323232"
        number: req.body.number,
        email: req.body.email,
    })

    listing = await listing.save();

    if(!listing) return res.status(500).send('The Listing cannot be created')

    res.status(200).send(listing);
})

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
        if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Listing Id')
    }

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
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            image: `${basePath}${fileName}`, 
            number: req.body.number,
        },
        {new: true}
    )

    if(!updatedListing)
    return res.status(500).send('the Listing cannot be updated!')

    res.send(updatedListing);
})


router.get(`/get/count`, async (req, res) =>{
    
    let listingCount = await Listing.countDocuments();
    //const listingCount = await Listing.countDocuments((count) => count)

    if(!listingCount) {
        res.status(500).json({success: false})
    } 
    res.status(200).send({
        listingCount: listingCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    let listings = await Listing.find({category: 3}).limit(+count);
    //const listingCount = await Listing.countDocuments((count) => count)

    if(!listings) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(listings);
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
