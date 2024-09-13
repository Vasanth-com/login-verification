import express from 'express';
import cors from 'cors' 
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/router.js';

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))
app.disable('x-powered-by'); // less hacker know about our stack

// api endpoints

app.use('/api/',router)


const port = 3020;

// start server only when we have valid connection
connect().then(()=>{
    try {
        
        app.listen(port,()=>{
            console.log(`server running at http://localhost:${port}`);  
        })
    } catch (error) {
        console.log("Cannot connect to the server");
        
    }
}).catch(error =>{
    console.log("invalid database connection...!");
    
})
