const express =  require("express");
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const Hompage = "/";
const Success = "/success";
const Faild = "/faild";
const https=require('https');
const apiURL = "https://us4.api.mailchimp.com/3.0/lists/2c00682b8f";
// apikey= 8a4bf7d26cdfc0631d19b9df66cf0435-us4;
//listid=2c00682b8f;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get(Hompage,function(req,res){
   res.sendFile(__dirname+"/index.html");
})

app.post(Hompage,function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          },
        },
      ],
    };
    var jsonData = JSON.stringify(data);
    console.log(jsonData);
    const options = {
      method: "post",
      auth: "Hoang:8a4bf7d26cdfc0631d19b9df66cf0435-us4",
    };
    const request=https.request(apiURL, options, function (apiResponse) {
        apiResponse.on('data',(data)=>{
            console.log(JSON.parse(data));
        })
        if(apiResponse.statusCode ===200){
            res.sendFile(`${__dirname}/success.html`);
        }else{
            res.sendFile(`${__dirname}/faild.html`);
        }
    });
    request.write(jsonData);
    request.end();
})

app.post(Success,function(req,res){
    res.redirect(Hompage);
})
app.post(Faild,function(req,res){
    res.redirect(Hompage)
})

app.listen(port,function(){
    console.log(`Server is running on port ${port}`);
})



///////////////////