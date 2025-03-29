const express = require('express')
const dotenv = require('dotenv')
const connectDB= require('./config/db') //เรียกใช้ db
const cookieParser=require('cookie-parser')
const cors = require('cors');
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')
const {xss} = require('express-xss-sanitizer')
const rateLimit=require('express-rate-limit')
const hpp=require('hpp')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')


//Load env vars
dotenv.config({path:'./config/config.env'})
connectDB(); //use db

const app=express()
//Routes files
const hospitals =require('./routes/hospitals')
const user= require('./routes/auth')
const appointment=require('./routes/appointments');
const { version } = require('mongoose');
 
//Rate Limit
const limiter=rateLimit({
    windowMs:10*60*1000, //10 Minute
    max: 100
});

//Mount Path
app.use(express.json()) //body parser มาก้อน use api นะ!!!
app.use(cors()); //ต้องอยู่ใต้ app.use express.json นะ
app.use(helmet())
app.use(mongoSanitize());
app.use(cookieParser());
app.use(xss());
app.use(limiter);
app.use(hpp());

app.use('/api/v1/hospitals',hospitals)
app.use('/api/v1/auth',user)
app.use('/api/v1/appointments',appointment)

const swaggerOptions={
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers:[
            {
                url: 'http://localhost:5000/api/v1'
            }
        ]
    },
    apis:['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

const PORT=process.env.PORT || 5001;
const server= app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

//Handle unhandler promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error Message: ${err.message}`)
    server.close(()=>process.exit())
})
