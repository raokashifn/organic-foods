const express = require('express');
const bcrypt = require("bcryptjs");
const UserModal = require('../modals/sellerModal');
const productModal = require('../modals/productModal');
const blogModal = require('../modals/blogModal');
const messageModal = require('../modals/messageModal');
const {
    // isAuth,
    generateToken, isAuth
} = require('../utils/util');
const {

    saveImage, deleteFile
} = require('../utils/file_handler');


const SellerModal = require('../modals/sellerModal');
const sellerRouter = express.Router();


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
    res.render('auth/signin');
})

sellerRouter.post("/login", async (req, res) => {
    //implement cross-check with firebase (optional!)

    const {
        phone, password
    } = req.body;

    const user = await SellerModal.findOne({
        phone: phone
    });


    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.cookie('token', token);
            if (phone == '03186178977') {
                res.cookie('ad', true);
                //admin
                var products = await productModal.find();
                res.render('admin/panel/panel', { admin: true, products });
            } else {
                var products = await productModal.find({ sellerId: user.id });

                res.render('seller/panel/panel', { admin: false, products, user });
            }

        } else {
            res.status(401).send({ success: false, message: "User record not found!" });

        }
    } else {
        res.status(401).send({ success: false, message: "User record not found!" });

    }
});

//if admin
sellerRouter.get('/admin-panel', isAuth, async (req, res) => {
    // 
    var products = await productModal.find({});
    console.log(products);
    res.render('admin/panel/panel', { admin: true, products });
});



///logout
sellerRouter.get('/logout', isAuth, async (req, res) => {
    res.clearCookie('token');

    // res.status(200).send({ success: true, message: 'logged out and cookies cleared!' });
    res.redirect('/auth/login')
});

sellerRouter.get('/register', async (req, res) => {
    res.render('auth/signup');
})

sellerRouter.post('/register', async (req, res) => {
    // res.render('admin/register/register');
    console.log(req.body);
    const {
        phone,
        name,

        description: description,
        password,
        ePassword
    } = req.body;
    try {


        const user = await SellerModal.findOne({ phone });


        if (!user && password === ePassword) {
            console.log('password matched');
            const ePassword = bcrypt.hashSync(password, 8);

            const newUser = SellerModal({
                name: name,
                phone: phone,
                // imgSrc:imgSrc,
                imgSrc: '',
                description: description,
                password: ePassword
            });
            await newUser.save();
            console.log('user done');
            if (bcrypt.compareSync(password, newUser.password)) {
                const token = generateToken(newUser);
                res.cookie('token', token);
                console.log('redirecting');
                // res.status(200).send({ success: true, message: "Registered and Login Successfully", user: newUser });
                res.redirect('/auth/login')
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



sellerRouter.get('/blogs', isAuth, async (req, res) => {
    var blogs = await blogModal.find({});
    res.render('admin/panel/blog', { admin: true, blogs })
});

sellerRouter.get('/customer', isAuth, async (req, res) => {
    var customers = await SellerModal.find({});
    res.render('admin/panel/customer', { admin: true, customers })
});

sellerRouter.get('/chat', isAuth, async (req, res) => {
    var messages = await messageModal.find({});
    res.render('admin/panel/chat', { admin: true, messages })
});


// if seller

sellerRouter.get('/seller-panel/:id', isAuth, async (req, res) => {
    //seller id
    var sellerId = req.params.id;
    var user = await SellerModal.findOne({ _id: sellerId });

    var products = await productModal.find({ sellerId });
    res.render('seller/panel/panel', { admin: false, products, user })
});
// test panel

sellerRouter.get('/panel/:type', isAuth, async (req, res) => {
    console.log(req.params.type);
    //seller id
    var sellerId = "646dfeddccd495137ed0ec86";
    var user = await SellerModal.findOne(sellerId);
    var products = await productModal.find({ sellerId: sellerId });
    console.log(products);
    res.render('seller/panel/panel', { admin: false, products, user })
});

sellerRouter.get('/product', isAuth, async (req, res) => {
    res.render('seller/panel/panel', { admin: false })
});

sellerRouter.get('/profile/:id', isAuth, async (req, res) => {
    var seller = await SellerModal.findOne({ _id: req.params.id });

    res.render('seller/panel/profile', { admin: false, seller })
});

sellerRouter.post('/profile', isAuth, async (req, res) => {

    const {

        sellerId,
        currentPassword,
        password,
        ePassword,
    } = req.body;
    try {

console.log(req.body);
        const user = await SellerModal.findOne({ _id:sellerId });
        console.log(user);
        if (user) {

            //hash currentPassword and get match with previous password mongo
            let valid = bcrypt.compareSync(currentPassword, user.password);
            var passwordsMatch = (parseInt(password) === parseInt(ePassword));

            if (valid && passwordsMatch) {
                const hash = bcrypt.hashSync(password, 8);

                var updateUser = await SellerModal.findOneAndUpdate(
                    {_id:sellerId},
                    {   password: hash  },
                    { new: true }
                );
                    console.log(updateUser);
                res.render(`seller/panel/profile`, { admin: false, seller: updateUser })
               
            } else {
                res.status(401).send({ success: false, message: 'validation failed!' });
            }

        }
        else {
            res.status(401).send({ success: false, message: 'User not found!' });

        }
    } catch (error) {
        res.status(401).send({ success: false, message: 'failed! ', error });
    }


});

sellerRouter.post('/editProfileInfo', isAuth, async (req, res) => {

    try {


        let {
            id,
            name,
            description,
        } = req.body;


        var seller = await SellerModal.findById(id);
        console.log(req.body);

        seller.name = name ? name : seller.name;
        seller.description = description ? description : seller.description;


        // imgSr c
        if (req.files && req.files.imgSrc) {
            console.log(req.files.imgSrc.name);
            if (seller.imgSrc !== "") {
                await deleteFile(seller.imgSrc);
            }
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                seller.imgSrc = url;
        }


        var result = await seller.save();
        console.log(result);

        //end
        res.render(`seller/panel/profile`, { admin: false, seller: result })
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }


});




sellerRouter.post("/deleteMessage", async (req, res) => {
    console.log('im at deletemessage');
    try {
        let id = req.body.id;
        //view

        const message = await messageModal.findById(id);

        if (message) {
            await message.deleteOne({ _id: id });
        }
        res.redirect('/auth/chat')
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});
sellerRouter.post("/deleteBlog", isAuth, async (req, res) => {

    try {
        let id = req.body.id;
        //view

        const blog = await blogModal.findById(id);

        if (blog) {
            if (blog.imgSrc !== "") {
                await deleteFile(blog.imgSrc);
            }
            await blog.deleteOne({ _id: id });
        }
        res.redirect('/auth/blogs')
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});
sellerRouter.post("/deleteProduct", isAuth, async (req, res) => {

    try {
        let { id, sellerId } = req.body;

        //view

        const product = await productModal.findById(id);

        if (product) {
            await product.deleteOne({ _id: id });
        }
        res.redirect(`/auth/seller-panel/${sellerId}`);
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

sellerRouter.post("/updateProduct", isAuth, async (req, res) => {

    try {


        let {
            id,
            sellerId,
            name,
            price,
            bulkQty,
            description,
        } = req.body;


        var product = await productModal.findById(id);
        console.log(req.body);

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


        var result = await product.save();
        console.log(result);

        //end
        res.redirect(`/auth/seller-panel/${product.sellerId}`);
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

sellerRouter.post("/addProduct", isAuth, async (req, res) => {

    try {


        let {
            sellerId,
            name,
            price,
            bulkQty,
            description,
        } = req.body;
        console.log(req.body);
        var seller = await SellerModal.findOne({_id:sellerId});
        console.log(seller);
        var product = new productModal({name,price, bulkQty, description, sellerId, sellerName: seller.name, userId: seller.id});
      
        // imgSrc
        if (req.files && req.files.imgSrc) {
            console.log(req.files.imgSrc.name);
           
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                product.imgSrc = url;
        }


        var result = await product.save();
        console.log(result);

        //end
        res.redirect(`/auth/seller-panel/${result.sellerId}`);
    } catch (err) {
        res.status(401).send({ success: false, message: 'Something went wrong', err });
    }

});

module.exports = sellerRouter;