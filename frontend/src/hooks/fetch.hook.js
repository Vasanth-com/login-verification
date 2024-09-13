import axios from "axios";
import { useEffect, useState } from "react";
import {getUserName} from '../helper/helper.js'
axios.defaults.baseURL = "http://localhost:3020";


// custom hook

export default function useFetch(query){
 const [getData,setData] =   useState({isLoading:false, apiData: undefined, status:null, serverError:null})

 
 useEffect(()=>{

    const fetchData = async () => {
        try {
            setData(prev => ({...prev , isLoading:true}))
            const {username} = !query ? await getUserName() : '';
            // console.log(username);
            

            const {data,status} =  !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);
            // console.log(data,status);
            

            if(status === 201){
                setData(prev => ({...prev, isLoading:false}))
                setData(prev =>({...prev, apiData:data,status:status}))
            }
        } catch (error) {
            setData(prev => ({...prev , isLoading:false, serverError:error}))
        }
    }
    fetchData()
 },[query])
 return [getData,setData];
}