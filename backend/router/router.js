import { Router } from "express";
const router = Router();

// import all controllers

import * as controller from '../controllers/appcontrollers.js'
import {registerMail} from '../controllers/mailer.js'
import Auth , {localVariables} from "../middleware/auth.js";
// POST METHODS

router.route('/register').post(controller.register) // register user
router.route('/registerMail').post(registerMail); // send email
router.route('/authenticate').post(controller.verifyUser,(req,res)=> res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); //login


// GET METHODS
router.route('/user/:username').get(controller.getUser); //user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP); // otp generate
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP); // verify generated otp
router.route('/createResetSession').get(controller.createResetSession); //reset all the variables

// PUT METHODS

router.route('/updateuser').put(Auth ,controller.updateUser); // is use the update the user profile
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword); // use to reset password

export default router