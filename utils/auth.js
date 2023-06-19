// import {FB,db,firebase} from './firebase';

const express=require('express');
const authRouter=express.Router();





authRouter.get('/',(req,res)=>{
    res.render('admin/login');;
});

authRouter.post('/',(req,res)=>{
    
    // get phone, password
    // FB.firebase.collection('Users').get();
   
    // res.render('admin/login');;
});


module.exports=authRouter;