const express = require('express');
const bcrypt = require("bcryptjs");
const UserModal = require('../modals/sellerModal');
const productModal = require('../modals/productModal');
const blogModal = require('../modals/blogModal');
const messageModal = require('../modals/messageModal');
const {
    // isAuth,
    generateToken
} = require('../utils/util');


const SellerModal = require('../modals/sellerModal');
const sellerRouter = express.Router();


sellerRouter.get("/", async (req, res) => {

    try {
        const users = await UserModal.find({});
        // res.status(200).send({ success: true, data: users });
        res.render('auth/signin');
        // res.render('user/user', { users })
    } catch (err) {
        res.status(300).send({ success: false, message: `something went wrong ${err}` });


    }
});

// get user info ..here purchases {it will be changed don't worry}
sellerRouter.post('/', async (req, res) => {
    const {
        userid
    } = req.body;

    // const userPurchases = await UserModal.aggregate([
    //     {
    //         $match: {
    //             _id: { $eq: mongoose.Types.ObjectId(userid) }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "purchases",
    //             "localField": "_id",
    //             "foreignField": "user",
    //             "as": "purchases"
    //         },
    //     }
    // ]).exec();

    try {
        res.status(200).send({
            success: true,
            // message: userPurchases 
            message: 'you get nothing!'
        });
    } catch (err) {
        res.status(500).send({ success: false, message: `something went wrong! ${err}` });
    }

});


sellerRouter.get('/login', async (req, res) => {
    res.render('admin/login/login');
})

sellerRouter.post("/login", async (req, res) => {
//implement cross-check with firebase (optional!)

    const {
     phone,password
    } = req.body;

    const user = await SellerModal.findOne({
        phone: phone
    });
  

    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.cookie('token', token);
            // res.status(200).send({ success: true, message: "Login Successfully", user: user });
            if(phone == '3339999991'){
                //admin
                res.redirect('/auth/admin-panel');    
            }else{
                res.redirect('/auth/admin-panel');  
            }
       
        } else {
            res.status(401).send({ success: false, message: "User record not found!" });
            // res.render("admin/login/login", {
            //     errorMessage: 'Incorrect credentials'
            // });
        }
    } else {
        res.status(401).send({ success: false, message: "User record not found!" });
        // res.render("admin/login/login", {
        //     errorMessage: 'Incorrect credentials'
        // });
    }
});

//if admin
sellerRouter.get('/admin-panel',async(req,res)=>{
     // 
     var products =await productModal.find({});
     console.log(products);
     res.render('admin/panel/panel', {admin:true,products});    
});



///logout
sellerRouter.get('/logout', async (req, res) => {
    res.clearCookie('token');

    // res.status(200).send({ success: true, message: 'logged out and cookies cleared!' });
    res.redirect('/auth/')
});

sellerRouter.get('/register', async (req, res) => {
    res.render('auth/signup');
})

sellerRouter.post('/register', async (req, res) => {
    // res.render('admin/register/register');
    console.log(req.body);
    const {
        phone,
        imgSrc,
        name,
        
        description:description,
        password,
        ePassword
    } = req.body;
    try {
      
    
 const user = await SellerModal.findOne({phone});

  
        if (!user && password === ePassword) {
            console.log('password matched');
            const ePassword = bcrypt.hashSync(password, 8);

            const newUser = SellerModal({
                name: name,
                phone: phone,
                // imgSrc:imgSrc,
                imgSrc:'image-src',
                description:description,
                password: ePassword
            });
            await newUser.save();
            console.log('user done');
            if (bcrypt.compareSync(password, newUser.password)) {
                const token = generateToken(newUser);
                res.cookie('token', token);
                console.log('redirecting');
                // res.status(200).send({ success: true, message: "Registered and Login Successfully", user: newUser });
                res.redirect('/')
            } else {
                res.status(401).send({ success: false, message: "User record not found!" });
                // res.render("admin/login/login", {
                //     errorMessage: 'Incorrect credentials'
                // });
            }
        } else {
            res.status(401).send({ success: false, message: 'User already Registered with this email!' });

        }
    } catch (error) {
        res.status(401).send({ success: false, message: 'failed! ', error });
    }
   
});

// sellerRouter.post("/register", async (req, res) => {

//     try {
//         const user = await UserModal.findOne({
//             email: req.body.email
//         });

//         if (user) {

//             res.status(401).send({ success: false, message: 'User already Registered with this email!' });

//         } else {

//             const ePassword = await bcrypt.hashSync(req.body.password, 8);
//             const newUser = UserModal({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: ePassword
//             })
//             await newUser.save();
//             // res.render('home');
//             res.status(200).send({ success: true, message: `Registered user Successfully, goto http://localhost:5000/auth/login to Login` });

//         }

//     }
//     catch (err) {
//         res.status(401).send({ success: false, message: 'failed! ', err });
//     }

// });

sellerRouter.get('/blogs',async(req,res)=>{
    var blogs =await blogModal.find({});
    res.render('admin/panel/blog',{admin:true,blogs})
});

sellerRouter.get('/customer',async(req,res)=>{
    var customers =await SellerModal.find({});
    res.render('admin/panel/customer',{admin:true,customers})
});

sellerRouter.get('/chat',async(req,res)=>{
    var messages =await messageModal.find({});
    res.render('admin/panel/chat',{admin:true,messages})
});


// if seller

sellerRouter.get('/seller-panel',async(req,res)=>{
    //seller id
    var sellerId="646dfeddccd495137ed0ec86";
    var user = await SellerModal.findById(sellerId);
   var products= await productModal.find({sellerId:sellerId});
    console.log(products);
    res.render('seller/panel/panel',{admin:false,products,user})
});

sellerRouter.get('/product',async(req,res)=>{
    res.render('seller/panel/panel',{admin:false})
});

sellerRouter.get('/profile',async(req,res)=>{
    // res.render('seller/panel/panel',{admin:false})
});


sellerRouter.post("/deleteMessage", async (req, res) => {
console.log('im at deletemessage');
    try {
        let id = req.body.id;
        //view

        const message = await messageModal.findById(id);

      if(message){
        await message.deleteOne({ _id: id });
      }
       res.redirect('/auth/chat')
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});
sellerRouter.post("/deleteBlog", async (req, res) => {

    try {
        let id = req.body.id;
        //view

        const message = await blogModal.findById(id);

      if(message){
        await message.deleteOne({ _id: id });
      }
       res.redirect('/auth/blogs')
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

module.exports = sellerRouter;