import jwt from 'jsonwebtoken'
export default async function Auth(req,res,next){
    try {
       const token =  req.headers.authorization.split(" ")[1];

    //    retrive user details for the logged in user
    const decodeToken =   await jwt.verify(token,"q4Ou7TFVpcmKWwmQJTyctLCG2YRwV/bd3Cr2EU9lsiU=");
        req.user = decodeToken;

       next();
    } catch (error) {
        res.status(401).json({error:"Authentication Failed.!"})    
    }
}

export function localVariables(req,res,next) {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}