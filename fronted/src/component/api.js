import React from "react"
import axios from 'axios';
import {Notification } from "./Notification.js";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {

    const fetchRegister= async (mydata)=>{
        let data=null

        try{
            const response=await axios({
                method:"POST",
                url:"http://127.0.0.1:8000/chamber/chamberapi/api/register",
                headers:{
                    "COntent-Type":"application/json",
                    "Accept":"application/json",
                },
                data:mydata
            });

            data=response.data;

        }catch(error){
            Notification('error', error.message);
        }
    }

    const fetchWhiteboard=async(chamber)=>{
        let data=null

        try{
            const response=await axios({
                method:"GET",
                url:"http://127.0.0.1:8000/chamber/chamberapi/api/whiteboard?chamber="+chamber,
                headers:{
                    "COntent-Type":"application/json",
                    "Accept":"application/json",
                },
            })

            data=response.data;

        }catch(error){
            Notification('error', error.message);
        }

        return data;
    }

    const fetchInprocess=async(chamber)=>{
        let data=null

        try{
            const response=await axios({
                method:"GET",
                url:"http://127.0.0.1:8000/chamber/chamberapi/api/inprocess?chamber="+chamber,
                headers:{
                    "COntent-Type":"application/json",
                    "Accept":"application/json",
                },
            })

            data=response.data;

        }catch(error){
            Notification('error', error.message);
        }

        return data;
    }

    const fetchAllBU=async(chamber)=>{
        let data=null

        try{
            const response=await axios({
                method:"GET",
                url:"http://127.0.0.1:8000/chamber/chamberapi/api/getAllBU?chamber="+"SG24",
                headers:{
                    "COntent-Type":"application/json",
                    "Accept":"application/json",
                },
            })

            data=response.data;

        }catch(error){
            Notification('error', error.message);
        }

        return data;
    }

    const fetchQuit=async (chamber,num)=>{
        let data=null

        try{
            const response=await axios({
                method:"GET",
                url:"http://127.0.0.1:8000/chamber/chamberapi/api/quit?chamber="+chamber+"&LineNum="+num,
                headers:{
                    "COntent-Type":"application/json",
                    "Accept":"application/json",
                },
            })

            data=response.data;

        }catch(error){
            Notification('error', error.message);
        }

        return data;
    }

    return (
        <AppContext.Provider
            value={{
                fetchRegister,
                fetchWhiteboard,
                fetchInprocess,
                fetchAllBU,
                fetchQuit,
            }}
        >{children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };