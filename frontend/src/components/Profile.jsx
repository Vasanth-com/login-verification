import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/username.module.css'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { profileValidate } from '../helper/Validate'
import convertToBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper'

const Profile = () => {

  const [file , setFile] = useState()
  const [{isLoading,apiData , serverError}] = useFetch()

  const navigate = useNavigate()

    const formik = useFormik({
      initialValues: {
        firstName:apiData?.firstName || '',
        lastName:apiData?.lastName || '',
        email:apiData?.email || '',
        mobile:apiData?.mobile || '',
        address:apiData?.address || ''
      },
      enableReinitialize:true,
      validate:profileValidate,
      validateOnBlur:false,
      validateOnChange:false,
      onSubmit: async (values)  => {
        values = await Object.assign(values, { profile : file || apiData?.profile || ''})
       let updatePromise =  updateUser(values)
       toast.promise(updatePromise,{
        loading: 'Updating..!',
        success: <b>update successfully</b>,
        error: <b>Could not update</b>
       })
      }
    })

    // formik doesn't support file upload so we need to create this handler

    const onUpload = async (e) =>{
      console.log(e.target.files[0]);
      
      const base64 = await convertToBase64(e.target.files[0])
      setFile(base64);
      
    }


    // log out handler 

    function logOut(){
      localStorage.removeItem('token');
      navigate('/')
    }


    
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex items-center justify-center h-screen'>
          <div className={styles.glass} style={{height:"700px"}}>

            <div className='title flex flex-col items-center'>
                <h4 className='text-2xl font-bold'>Profile</h4>
                <span className='py-1 text-sm text-center text-gray-500'>
                You can update details!</span>
            </div>

            <form className='py-1' onSubmit={formik.handleSubmit} >
                <div className='profile flex justify-center py-2'>
                  <label htmlFor='profile'>
                      <img src={apiData?.profile || file || avatar} className={styles.profile_img} alt="avatar" />
                  </label>
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
                </div>

                <div className='textbox flex flex-col items-center gap-6'>
                  <div className='name flex w-3/4 gap-10'> 
                  <input {...formik.getFieldProps("firstName")} className={styles.textbox} type="text" placeholder='First name' />
                  <input {...formik.getFieldProps("lastName")} className={styles.textbox} type="text" placeholder='Last name' /> 
                  </div>
                  <div className='name flex w-3/4 gap-10'> 
                  <input {...formik.getFieldProps("mobile")} className={styles.textbox} type="text" placeholder='Mobile Number' />
                  <input {...formik.getFieldProps("email")} className={styles.textbox} type="email" placeholder='Email' /> 
                  </div>

          
                  <input {...formik.getFieldProps("address")} className={styles.textbox} type="text" placeholder='Address' />
                  <button className={styles.btn} type='submit'>Update</button>
                </div>

                <div className='text-center py-4'>
                  <span className='text-gray-500'>Comeback later? <button  className='text-red-500' onClick={logOut}>Log out</button></span>
                </div>

            </form>
          </div>
        </div>
    </div>
  )
}

export default Profile
