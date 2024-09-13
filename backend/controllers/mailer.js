import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'



let nodeConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "infocheck.2519@gmail.com",
      pass: "pdwg sttl guqx fvba",
    },

}

let transporter = nodemailer.createTransport({...nodeConfig,debug:true});

let Mailgenerator = new Mailgen({
    theme: "default",
    product:{
        name:'Mailgen',
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/


export const registerMail = async(req,res) =>{
    const {username,userEmail,text,subject} = req.body;
    console.log("register mail" , username, userEmail);
    
    // body of email
    var email = {
        body:{
            name:username,
            intro: text || "Welcome los pollas hermonos.",
            outro: "Need help or have questions? just reply to this email, we'd love to help"
        }
    }

    var emailBody = Mailgenerator.generate(email);
    let  message = {
        from: "infocheck.2519@gmail.com",
        to: userEmail,
        subject: subject || "Sign Up successful",
        html:emailBody
    }

    //send mail

    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({msg:"You should receive an email from us."})
    })
    .catch(err => {
        console.error("Error sending email",err);
        
       return res.status(500).send({err:"Failed to send email. please try again..!"})})
}