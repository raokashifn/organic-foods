const express = require('express');
const BlogModal = require('../modals/blogModal');
const { saveImage, deleteFile } = require('../utils/file_handler')
const BlogRouter = express.Router();

//view blog
BlogRouter.get("/", async (req, res) => {

    try {
        //view
        const blogs = await BlogModal.find({});
        res.status(200).send({ success: true, message: { blogs } });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

/**
 *  title: { type: String, required: true },
    intro_text: { type: String, required: true },
    description: { type: String, required: true},
    imgSrc: { type: String, required:true },
 */

// post blog
BlogRouter.post("/", async (req, res) => {
   
    let {
        title,
        intro_text,
        description
    }= req.body;
    console.log("blog");
    console.log(req.body);

    try {
        //write blog
        let newblog = await BlogModal({
            title: title,
            intro_text: intro_text,
            description: description,
            imgSrc: "img-link"
            // tags: req.body.tags,
        });

    
        if (req.files && req.files.imgSrc) {

            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                newblog.imgSrc = url;
        }

        let result = await newblog.save();
        console.log(result);
        // res.status(200).send({ success: true, message: `New Blog added with id ${newblog.title}` });
        res.redirect('/auth/blogs');
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

// edit blog
BlogRouter.put("/", async (req, res) => {

    try {

        //view
        let blog = await BlogModal.findById(req.body.id);

        /*
         title: req.body.title,
            intro_text: req.body.intro_text,
            discription: req.body.discription,
           
        */
        blog.title = req.body.title ? req.body.title : blog.title;
        blog.intro_text = req.body.intro_text ? req.body.title : blog.title;
        blog.discription = req.body.discription ? req.body.discription : blog.discription;
       

        // comments add array isnt working
        // blog.comments = req.body.comments ? req.body.comments : blog.comments;

        // implement tags, use spilcing and index to add or remove or add a tag
        // same goes for adding or removing comments

        //
        if (req.files && req.files.imgSrc) {
            if (blog.imgSrc !== "") {
                await deleteFile(blog.imgSrc);
            }
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                blog.imgSrc = url;
        }

        // blog.drafted = req.body.drafted ? req.body.drafted : blog.drafted;
        await blog.save();
        res.status(200).send({ success: true, message: 'Blog updated!', data: { blog } });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

//delete
BlogRouter.delete("/", async (req, res) => {

    try {
        let id = req.body.id;
        //view

        const blog = await BlogModal.findById(id);

        if(blog.imgSrc !== ""){
            await deleteFile(blog.imgSrc);
        }

        await blog.deleteOne({ _id: id });
        res.status(200).send({ success: true, message: 'Blog deleted!' });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});


module.exports = BlogRouter;
