const express = require('express');
const MesssageRouter = express.Router();
const messageModal = require('../modals/messageModal');


MesssageRouter.get("/", async (req, res) => {

    try {
        // get modal
        let data = await messageModal.find({});
        res.status(200).send({ success: true, message: { data } });
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

MesssageRouter.post("/", async (req, res) => {

    let {
        name,
        email,
        message,
      
   
    }= req.body;

    try {
        let newMessage = await messageModal({
            name:name != "" ? name: "",
            email:email != ""? email:"" ,
            message:message != ""? message:"",
        });


        await newMessage.save();
        // res.status(200).send({ success: true, message: 'message uploaded successfully',data:{ newMessage } });
        res.redirect('/');
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err: err });
    }

});

// delete
MesssageRouter.delete("/", async (req, res) => {

    try {
        let id = req.body.id;
        //view

        const message = await messageModal.findById(id);

      
        await message.deleteOne({ _id: id });
        res.status(200).send({ success: true, message: 'message deleted!' , id: id});
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

//TODO: reply to user :::: use node mailer to send message::
module.exports = MesssageRouter;