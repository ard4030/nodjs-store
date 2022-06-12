const express = require('express');
const mongoose = require('mongoose')
const path = require('path')

module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;
    constructor(PORT,DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoDb();
        this.createServer();
        this.createRoutes();
        this.errorHandling(); 
    }

    configApplication(){
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended:true}))
        this.#app.use(express.static(path.join(__dirname,'..','public')))

    }

    createServer(){
        const http = require('http');
        http.createServer(this.#app).listen(this.#PORT, () => {
            console.log("run > http://localhost:"+this.#PORT)
        })
    }

    connectToMongoDb(){
        mongoose.connect(this.#DB_URI, (error) => {
            if(!error) return console.log('Connect to Mongodb');
            return console.log('Failed Connect To Mongo Db')
        })
    }

    createRoutes(){
        this.#app.use((req,res,next) => {
            return res.status(404).json({
                status:404,
                message:"آدرس مورد نظر یافت نشد"
            })
        })

        this.#app.use((error,req,res,next) => {
            const statusCode = error.status || 500;
            const message = error.message || 'Internal Server Error';
            return res.status(statusCode).json({
                statusCode,
                message
            })
        })
    }

    errorHandling(){
        
    }


}