const app = require('./app');
const cloudinary = require("cloudinary");
const dotenv = require('dotenv');

//config
dotenv.config({path:"backend/config/config.env"});

//Databse configuration
const connectDatabase = require('./config/database');
connectDatabase();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

//Handling uncaught exceptions
process.on('uncaughtException', (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to uncaught Exception.");

    server.close(()=>{
        process.exit(1);
    });
});


const server = app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`);
});

app.get('/', function(req, res){
    res.send(`<h1 style="text-align: center">Hello World<h1>`);
});
//Unhandled promise Rejections

process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection.");


    server.close(()=>{
        process.exit(1);
    });
});