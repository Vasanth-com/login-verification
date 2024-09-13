import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/username.module.css'
import toast,{Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { passwordValidate } from '../helper/Validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
const Password = () => {

 const {username} = useAuthStore(state => state.auth)

 const navigate =useNavigate()
 
 const [{isLoading,apiData , serverError}] = useFetch(`/user/${username}`)

    const formik = useFormik({
      initialValues: {
        password:""
      },
      validate:passwordValidate,
      validateOnBlur:false,
      validateOnChange:false,
      onSubmit: async (values)  => {
          let loginPromise = verifyPassword({username , password: values.password})
          toast.promise(loginPromise,{
            loading: "Checking..",
            success: <b>Login Successfully..!</b>,
            error: <b>Password Not Match..!</b>
          })

          loginPromise.then(res=>{
            console.log(res.token);
            
            let token = res.token;
            localStorage.setItem('token',token)
            navigate("/profile")
          })
      }
    })

    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex items-center justify-center h-screen'>
          <div className={styles.glass}>

            <div className='title flex flex-col items-center'>
                <h4 className='text-3xl font-bold'>Hello {apiData?.firstName ||apiData?.username}</h4>
                <span className='py-4 text-sm w-2/3 text-center text-gray-500'>
                Explore More by connecting with us</span>
            </div>

            <form className='py-1' onSubmit={formik.handleSubmit} >
                <div className='profile flex justify-center py-4'>
                      <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
                </div>
                <div className='textbox flex flex-col items-center gap-6'>
                  <input {...formik.getFieldProps("password")} className={styles.textbox} type="password" placeholder='Password' />
                  <button className={styles.btn} type='submit'>Sign In</button>
                </div>

                <div className='text-center py-4'>
                  <span className='text-gray-500'>Forget Password? <Link to='/Recovery' className='text-red-500' href="#">Recover Now</Link></span>
                </div>

            </form>
          </div>
        </div>
    </div>
  )
}

export default Password
