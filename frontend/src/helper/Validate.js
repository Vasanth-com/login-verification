import toast from "react-hot-toast";
import { authenticate } from "./helper";
export async function usernameValidate(values){
    const errors = usernameVerify({},values)
    if(values.username){
        // check user exists or not
        const {status} = await authenticate(values.username)

        if(status !== 200){
            errors.exist = toast.error("User Doesn't exists")
        }
    }
    return errors
}

export async function passwordValidate(values) {
    const errors = passwordVerify({},values);
    
    return errors
}

export async function  resetValidate(values) {
    const errors = passwordVerify({},values);
    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password does not match..!")
    }
    return errors
}

export async function  registerValidate(values) {
        const errors = usernameVerify({},values);
        passwordVerify(errors,values)
        emailVerify(errors,values)
        return errors
}


export async function  profileValidate(values) {
        const errors =   emailVerify({},values)
        return errors;
}


function usernameVerify(error = {} , values){
    if(!values.username){
        error.username = toast.error("Username Required..!")
    }else if(values.username.includes(" ")) {
        error.username = toast.error("Invalid Username..!")
    }

    return error
}

function passwordVerify(errors = {}, values){
    let spacialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password){
        errors.password = toast.error('Password required..!')
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password..!")
    }else if(values.password.length <4){
        errors.password = toast.error("Password must be more than 4 ")
    }else if(!spacialCharacters.test(values.password)){
            errors.password = toast.error("Password must have spacial characters ")
    }

    return errors
}


function emailVerify(errors ={}, values){
    if(!values.email){
        errors.email = toast.error("Email Required..!")
    }else if(values.email.includes(" ")){
        errors.email  = toast.error("Wrong Email..!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email  = toast.error("Invalid email address..!")
    }
    return errors
}