const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}));

//browser  visits localhost:3000/
app.get('/', (req,res)=>{
    res.send('hello');
});

//postman sends 
app.post('/', (req,res)=>{
    var username = req.body.username?? '';
    var password = req.body.password ??'' ;

    //check
    console.log(req.body);

res.send(`your credentials are ${username + password}`);
});



app.listen(3000,()=>console.log("[+] Server started at PORT 3000" ));
