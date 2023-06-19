const express = require('express');

const ProfileRouter = express.Router();

const ProfileModal = require('../modals/messageModal');
const SellerModal = require('../modals/sellerModal');



ProfileRouter.get("/", async (req, res) => {
    try {   
       let id =  req.query.id;
        // get modal
        let data = await SellerModal.findById(id);
        res.status(200).send({ success: true, message: { data } });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

ProfileRouter.put('/', async (req, res) => {
    try {

        let {id,
            name,
           description,
           phone,
           password
        } = req.body;

        //date
        let seller = await SellerModal.findById(id);
       

       // product.name = name ? name : product.name;

            seller.name= name != ""? name : seller.name,
           seller.description= description != ""? description : seller.description,
           seller.phone= phone != ""? phone : seller.phone,
           seller.password= password != ""? password : seller.password
      

        // srcImg, productImg
        if (req.files && req.files.imgSrc) {
            // TODO:pushing to array needs work
            //upload file t0 firebase instead!
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
            seller.imgSrc = url;
        }

        await seller.save();
        res.status(200).send({ success: true, message: `profile has been updated for :${seller.name} successfully!` });
    } catch (err) {
        res.status(402).send({ success: false, message: `error ${err}` });
    }
});

//delete in case user delete his profile (optional) 

module.exports = ProfileRouter;