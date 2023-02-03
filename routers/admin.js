const {Listing} = require('../models/listing');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const listingList = await Listing.find();//.select('name image -_id');

    if(!listingList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(listingList);
})

router.get(`/:id`, async (req, res) =>{
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        res.status(500).json({message: 'The TV with the given id was not found'})
    }

    res.status(200).send(listing);

})



router.put(`/:id`, async (req, res)=> {
    const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        {
            listing: req.body.category
        },
        {new: true}
    )

    if(!listing){
        return res.status(404).send('the Listing cannot be updated!')
    }
    

    res.status(200).send(listing);
})

router.delete(`/:id`, (req, res) =>{
    Listing.findByIdAndRemove(req.params.id).then(listing =>{
        if(listing) {
            return res.status(200).json({success: true, message: 'The listing has been deleted!'})
        } else {
            return res.status(404).json({success: false, message:'Listing not found!!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error:err})
    })
})

module.exports =router;