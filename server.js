const express = require('express')
var path = require('path');
const app = express()
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
//modal
const BlogModal = require('./modals/blogModal');
const ProductModal = require('./modals/productModal');

// add routes
const homeRouter = require('./routers/home');
const authRouter = require('./routers/authRouter');
const sellerRouter = require('./routers/sellerRouter');
const productRouter = require('./routers/productRouter');
const profileRouter = require('./routers/profileRouter');
const blogRouter = require('./routers/blogRouter');
const messagesRouter = require('./routers/messagesRouter');
app.set('view engine', 'ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}));
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
var upload = require('express-fileupload')
app.use(upload({
    preserveExtension: true,
    // preserveExtension: 3,
    useTempFiles : true,
    tempFileDir : 'tmp'
})); 
// mongo connection
mongoose.connect(
    'mongodb://0.0.0.0:27017/farmer',
    {
        useNewUrlParser: true,

        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('[+] connected to mongodb'));
// ...



app.get('/', async(req,res)=>{
        // products list
        let products = await ProductModal.find({});
        res.render('home/home',{products});

});

app.get('/blogs', async (req,res)=> {
   
       let blogs = await BlogModal.find({});
       res.render('blog/blogs',{blogs});
   });

// app.get('/auth', async (req,res)=> {
//        res.render('auth/signin');
//    });

 app.use("/auth", sellerRouter);  

app.post('/signin', async (req,res)=> {
        
       res.render('auth/signin');
   });

// app.use("/api/auth", authRouter);
// app.use("/api/auth/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/admin/blog", blogRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin/messages", messagesRouter);

//route
// app.use('/', homeRouter);

// app.use((req,res,next)=>{
//     res.status(404).render('404');
//     });

app.get("/profile",function(req,res) {
    res.render("admin/panel/profile")
    
})

app.get("/shop",async function(req,res) {
    let products = await ProductModal.find({});
    res.render("shop/shops",{products})
    
})

app.get("/readblog",async function(req,res) {
    let products = await ProductModal.find({});
    res.render("blog/Blogview",{blog})
    
})


app.listen(3000,()=>console.log("[+] Server started at PORT 3000" ));
