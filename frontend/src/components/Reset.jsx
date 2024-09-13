import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/username.module.css'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { resetValidate } from '../helper/Validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store'
import useFetch from '../hooks/fetch.hook'

const Reset = () => {


  const {username} = useAuthStore(state => state.auth)

  const navigate = useNavigate()

  const [{isLoading,apiData,status,serverError}] =useFetch('createResetSession')

  useEffect(()=>{
    // console.log(apiData);
    
    if(status){

    }
  })
  
    const formik = useFormik({
      initialValues: {
        password:"vasanth@2519",
        confirm_pwd:"vasanth@2519"
      },
      validate:resetValidate,
      validateOnBlur:false,
      validateOnChange:false,
      onSubmit: async (values)  => {
          let resetPromise = resetPassword({username,password:values.password})
          toast.promise(resetPromise,{
            loading:"Updating...",
            success: <b>Reset Successfully..!</b>,
            error: <b>Could not reset</b>
          })

          resetPromise.then(()=>{
            navigate("/password")
          })
      }
    })


    
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    if(status && status !== 201) return <Navigate to='/password' replace = {true}></Navigate>
  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex items-center justify-center h-screen'>
          <div className={styles.glass}>

            <div className='title flex flex-col items-center'>
                <h4 className='text-3xl font-bold'>Reset</h4>
                <span className='py-4 text-sm w-2/3 text-center text-gray-500'>
                Enter new Password</span>
            </div>

            <form className='py-20' onSubmit={formik.handleSubmit} >
                
                <div className='textbox flex flex-col items-center gap-6'>


                  <input {...formik.getFieldProps('password')}  className={styles.textbox} type="text" placeholder='Password' />
                  <input {...formik.getFieldProps('confirm_pwd')}  className={styles.textbox} type="text" placeholder='Confirm password' />
                  


                  <button className={styles.btn} type='submit'>Reset</button>
                </div>


            </form>
          </div>
        </div>
    </div>
  )
}

export default Reset
