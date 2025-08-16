import express from 'express'
import helmet from "helmet";
import cors from 'cors'
import {config} from "./configs";
import connectDB from "./db/mongoose";
import rateLimit from "express-rate-limit";
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from "./configs/swagger";
import {notFound} from "./middlewares/notFound";
import {errorHandler} from "./middlewares/errorHandler";
import routes from "./routes";


const app = express()

connectDB()

app.use(helmet())

app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}))
app.use(rateLimit({
    windowMs:config.rateLimitWindowMs,
    max:config.rateLimitMax,
    message:{
        success:false,
        message:'Too many request from this IP, please try again later'
    },
    standardHeaders:true,
    legacyHeaders:false
}))

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended:true,limit:"10mb"}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', routes);




if (config.nodeEnv==='development'){
    app.use(morgan('dev'))
}else{
    app.use(morgan('combined'))
}

app.use(notFound);
app.use(errorHandler);

export default app