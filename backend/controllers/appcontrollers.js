import UserModel from "../models/UserModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator'



// middleware for verify user

export async function verifyUser(req,res,next){
    
    try {
        const {username} = req.method === "GET" ? req.query : req.body;
        console.log(username);
        
        // check the user existence

        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error:"Can't find user"})
        next();



    } catch (error) {
        return res.status(404).send({error: "Authentication Error"})
    }
}









// @params {
    //     "username":"vasanth25",
    //     "email":"vasanth2519@gmail.com",
//     "password":"vasanth25",
//     "firstName":"vasanthakumar",
//     "lastName":"M",
//     "mobile": 9000390290,
//     "profile":""
// }


export async function register(req,res){
    
    try {
        const {username,password,email , profile} = req.body;
        
        // check existing user 
        
        const existingUserName = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then((err,user) => {
                if(err) reject(new Error(err))
                    if(user) reject({ error: "Please use unique username"});
                
                resolve();
            }).catch(err => reject({error: "exist username findone error"}));
        });


        // check  for existing email
        
        const existEmail = new Promise((resolve,reject)=>{
            UserModel.findOne({email}).then((err,user)=>{
                if(err) reject(new Error(err))
                    if(user) reject({error:"Please use unique email"})
                        
                        resolve();
                    }).catch(err => reject ({error: "exist email findone error"}))
                })
                
                
                Promise.all([existingUserName,existEmail])
                .then(()=>{
                    if(password){
                        bcrypt.hash(password,10)
                        .then((hashedPass)=>{
                            
                            const user = new UserModel({
                                username,
                                password:hashedPass,
                                profile:profile || "",
                                email
                            })
                            
                            console.log(user);
                            
                            
                            // return save result as a response
                            
                            user.save()
                            .then(result=>res.status(201).send({msg:"User register Successfully"}))
                            .catch(error=>res.status(500).send({error}))
                            
                        }).catch((error)=>{
                            return res.status(500).send({
                                error:"Enable to hashed password"
                            })
                        })
                    }
                }).catch((error)=>{
                    return res.status(500).send({error})
                })
                
            } catch (error) {
        return res.status(500).send(error)
   }
} 


export async function login(req,res) {
    const {username,password} = req.body;
    try {
        UserModel.findOne({username})
        .then(user => {
            console.log(user);
            bcrypt.compare(password , user.password)
            .then(passwordCheck => {
                if(!passwordCheck) return res.status(404).send({error: "Don't have password"})
                    
                    // create jwt token
                    const token =  jwt.sign({
                        userId:user._id,
                        username:user.username
                    }, ENV.JWT_SECRET ,{expiresIn:'1d'})
                    
                    return res.status(201).send({
                        msg:"Login successfully",
                        username:user.username,
                        token
                    })
                    
                })
                .catch(error => {
                    return res.status(400).send({error:"Password does not match"})
                })
            })
            .catch(error =>{
                return res.status(404).send({error:"username not found"})
            })
        } catch (error) {
            return res.status(500).send({error})
        }
    }
    
    // get methods
    
    export async function getUser(req,res) {
        const {username} = req.params;
        console.log(username);
        
        try {
            if(!username) return res.status(501).send({error:"Invalid username"})
                
                UserModel.findOne({username})
                .then((user)=>{
                    
                    if(!user){
                        return res.status(501).send({error:"Couldn't find the user"})
                    }
                    
                    console.log(user);
                    
                    return res.status(201).send(user)
                })
            } catch (error) {
                return res.status(404).send({error:"Cannot find user data"})
            }
        }
        
        // put
        
        export async function updateUser(req,res) {
            try {
                // const id = req.query.id;
                
                const {userId}   = req.user;
                
                
                
                if(!userId){
                    
                    return res.status(401).send({error: "User Not found"})
                }
                
                const body = req.body;
                UserModel.updateOne({_id:userId}, body)
        .then((data)=>{
            if(!data){
                return res.status(404).send({error: "User failed"})
            }
            return res.status(201).send({msg:"Record Updated..!"})
        })
        
    } catch (error) {
        return res.status(404).send({error})
    }
}


export async function generateOTP(req,res) {
    const OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false})
    req.app.locals.OTP = OTP;
    res.status(201).send({code:req.app.locals.OTP})
}

export async function verifyOTP(req,res) {
    const {code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true;  // start session for reset password
        
        return res.status(201).send({msg:"Verified successfully"})
        
    }
    return res.status(400).send({error:"Authentication Error"})
}

export async function createResetSession(req,res) {
    if(req.app.locals.resetSession){
        // allow access to this route only once
        return res.status(201).send({flag:req.app.locals.resetSession}) 
    }
    return res.status(440).send({error:"Session failed"})
}

export async function resetPassword(req,res) {
    try {
        if(!req.app.locals.resetSession) return res.status(440).send({error:"Session Expired..!"}) 
        const {username,password} = req.body;

        UserModel.findOne({username})
        .then(user => {
            bcrypt.hash(password,10)
            .then(hashedPassword =>{
                UserModel.updateOne({username: user.username},{password:hashedPassword})
                req.app.locals.resetPassword = false; //reset session
                return res.status(201).send({msg:"Record Updated..!"})
            })
            .catch(e =>{
                return res.status(500).send({
                    error:"Enable to hashed password"
                })
            })
        })
    } catch (error) {
        
        return res.status(401).send({error})
    }
}