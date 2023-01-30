//Import Config
import 'dotenv/config'

//Importing modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//Import Route
import { router } from './routes/index.js';

//Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api',router);
app.use(function(req,res,next){
    if(!['PUT','DELETE'].includes(req.method)){
      next()
      return
    }else {
        res.status(403).send('Access Denied!');
    }
  })

//Set PORT
const port = process.env.PORT || 4000

//Main Application

async function App(){

    // Start Server
    app.listen(port, () => {
        console.log(process.env.APP_NAME + ' is running on port : ' + port);
    })
}
App();