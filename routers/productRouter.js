const express = require('express');
const ProductModal = require('../modals/productModal');
const { saveImage, deleteFile } = require('../utils/file_handler');
const productRouter = express.Router();





productRouter.get('/', async(req, res) => {
    /**
     * products screen contain
     * 1. add product button and form 
     * 2. current list of products table form
     * 3. edit/delete button and their form
     */
    try {
        // get modal
        let data = await ProductModal.find({});
        res.status(200).send({ success: true, message: { data } });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }


    // res.render('admin/products/products');;
});


//ADD Product
productRouter.post('/', async (req, res) => {
    try {

        let {
            name,
            price,
            bulkQty,
            description,
            sellerName,
            sellerId
        } = req.body;

        //date
        const product = await ProductModal({
            name: name,
            price: price,
            bulkQty: bulkQty,
            description: description,
            sellerName: sellerName,
            sellerId: sellerId,
        });

        // srcImg, productImg
        if (req.files && req.files.imgSrc) {
            // TODO:pushing to array needs work
            //upload file t0 firebase instead!
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                product.imgSrc = url;
        }

        await product.save();
        res.status(200).send({ success: true, message: `new Product named:${product.title} added successfully!` });
    } catch (err) {
        res.status(402).send({ success: false, message: err });
    }
});

//Edit Product
// productRouter.get('/', async(req,res)=>{});
productRouter.put("/", async (req, res) => {

    try {

        let {
            name,
            price,
            bulkQty,
            description,
            id

        } = req.body;


        let product = await ProductModal.findById(id);
        console.log(product);

        product.name = name ? name : product.name;
        product.price = price ? price : product.price;
        product.bulkQty = bulkQty ? bulkQty : product.bulkQty;
        product.description = description ? description : product.description;


        // imgSrc
        if (req.files && req.files.imgSrc) {
            console.log(req.files.imgSrc.name);
            if (product.imgSrc !== "") {
                await deleteFile(product.imgSrc);
            }
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                product.imgSrc = url;
        }
   
        // ToDo: Demo img uses array work later on it
        // if (req.files && demoImg) {
        //     if (product.demoImg !== "") {
        //         await deleteFile(product.demoImg);
        //     }
        //     let url = await saveImage(demoImg);
        //     if (url != false)
        //         product.demoImg = url;
        // }

        var result = await product.save();
        console.log(result);
        res.status(200).send({ success: true, message: `new Product named:${product.name} updated successfully!` });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

productRouter.delete("/", async (req, res) => {
    try {
        let id = req.body.id;
        //view

        const product = await ProductModal.findById(id);

        if (product.imgSrc !== "") {
            await deleteFile(product.imgSrc);
        }



        await product.deleteOne({ _id: id });
        res.status(200).send({ success: true, message: 'Product deleted!' });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }
});

module.exports = productRouter;