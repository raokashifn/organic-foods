const express=require('express');
const homeRouter=express.Router();

homeRouter.get('/', async (req,res)=> {
    // products list
    let products = await ProductModal.find({});
    // let blogs = await BlogModal.find({});
    res.render('home/home',{products,blogs});
});

homeRouter.get('/blogs', async (req,res)=> {
    let blogs = await BlogModal.find({});
    res.render('blog/blogs',{blogs});
});


module.exports=homeRouter;