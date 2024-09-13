import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/username.module.css'
import toast,{Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { registerValidate } from '../helper/Validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'

const Register = () => {

  const [file , setFile] = useState()
  const navigate = useNavigate()

    const formik = useFormik({
      initialValues: {
       
        email:"",
        username:"",
        password:""
      },
      validate:registerValidate,
      validateOnBlur:false,
      validateOnChange:false,
      onSubmit: async (values)  => {
        values = await Object.assign(values, { profile : file || ''})
        let registerPromise =  registerUser(values)
        toast.promise(registerPromise,{
          loading:"Creating..!",
          success: <b>Register Successfully...!</b>,
          error: <b>Could not Register</b>
        })
        
        registerPromise.then(()=> navigate('/'))
      }
    })

    // formik doesn't support file upload so we need to create this handler

    const onUpload = async (e) =>{
      console.log(e.target.files[0]);
      
      const base64 = await convertToBase64(e.target.files[0])
      setFile(base64);
      
    }


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex items-center justify-center h-screen'>
          <div className={styles.glass} style={{height:"700px"}}>

            <div className='title flex flex-col items-center'>
                <h4 className='text-2xl font-bold'>Register!</h4>
                <span className='py-1 text-sm text-center text-gray-500'>
                Happy to join you!</span>
            </div>

            <form className='py-1' onSubmit={formik.handleSubmit} >
                <div className='profile flex justify-center py-2'>
                  <label htmlFor='profile'>
                      <img src={file || avatar} className={styles.profile_img} alt="avatar" />
                  </label>
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
                </div>
                <div className='textbox flex flex-col items-center gap-6'>
                  <input {...formik.getFieldProps("email")} className={styles.textbox} type="email" placeholder='Email' />
                  <input {...formik.getFieldProps("username")} className={styles.textbox} type="text" placeholder='username' />
                  <input {...formik.getFieldProps("password")} className={styles.textbox} type="password" placeholder='Password' />
                  <button className={styles.btn} type='submit'>Register</button>
                </div>

                <div className='text-center py-4'>
                  <span className='text-gray-500'>Already Register? <Link to='/' className='text-red-500' href="#">Login Now</Link></span>
                </div>

            </form>
          </div>
        </div>
    </div>
  )
}

export default Register
