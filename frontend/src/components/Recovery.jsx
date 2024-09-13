import React, { useEffect, useState } from 'react'
import styles from '../styles/username.module.css'
import toast, {Toaster} from 'react-hot-toast'
import {useAuthStore} from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'
const Recovery = () => {
  const {username} = useAuthStore(state => state.auth)
  const [OTP,setOTP] = useState();
  const navigate = useNavigate()

    useEffect(()=>{
      console.log(username);
      
      generateOTP(username).then((OTP)=>{        
        if(OTP) return toast.success("OTP has been send to your email")
        }).catch((error)=>{
      console.error("Error generating OTP..! ",error );
      
      return toast.error("problem while generating OTP")
      })
    },[])

    async function  onSubmit(e) {
        e.preventDefault();
        console.log("verify OTP",username,OTP);
        
      try {
        let {status} =   await verifyOTP({username, code:OTP})
        if(status === 201){
          toast.success("Verify successfully")
          return navigate("/reset")
        }
        
      } catch (error) {
        return toast.error("Wrong OTP! Check email again")
        
      }


    }

    // handler of rend OTP

    function resendOTP(){
      let sendPromise =  generateOTP(username);
      
      toast.promise(sendPromise,{
        loading:"Sending..!",
        success: <b>OTP has been send to email</b>,
        error: <b>Could not send it</b>
      })

      sendPromise.then(OTP =>{
        // console.log(OTP);
        
      })

    }

  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='flex items-center justify-center h-screen'>
          <div className={styles.glass}>

            <div className='title flex flex-col items-center'>
                <h4 className='text-3xl font-bold'>Hello Again!</h4>
                <span className='py-4 text-sm w-2/3 text-center text-gray-500'>
                Enter OTP to Recover Password</span>
            </div>

            <form className='pt-20' onSubmit={onSubmit} >
                
                <div className='textbox flex flex-col items-center gap-6'>

                  <div className='input text-center'>

                  <span className='py-4 text-sm text-left text-gray-500 '>
                    Enter 6 digit OTP sent to your email address 
                  </span>
                  <input onChange={(e)=>setOTP(e.target.value)}  className={styles.textbox} type="text" placeholder='OTP' />
                  </div>


                  <button className={styles.btn} type='submit'>Recover</button>
                </div>
            </form>
                <div className='text-center py-4'>
                  <span className='text-gray-500'>Can't get OTP? <button  onClick={resendOTP} className='text-red-500' href="#">Resend</button></span>
                </div>
          </div>
        </div>
    </div>
  )
}

export default Recovery
