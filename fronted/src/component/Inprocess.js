import React , { useState, useEffect } from "react";
import "./layout.css"
import * as antd from 'antd';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
// import { AppContext } from './api';


const InProcess=(props)=>{
    // const [user,setUser]=React.useState({Num:0,StTim:'NA:NA:NA',User:'None',model:'None',circles:0})
    // const [NeUser,seNetUser]=React.useState({Num:0,StTim:'NA:NA:NA',User:'None',model:'None',circles:0})
    // const [restart,setRestart]=React.useState(false)
    // const appCtx = React.useContext(AppContext);

    // useEffect(()=>{
    //     let data=null
    //     appCtx.fetchInprocess().then((data)=>{
    //         setUser({
    //             Num:data['nowUserNum'],StTim:data["startTime"],User:data['nowUserNam'],model:data['nowUserMode'],circles:data['nowUserCirNum']
    //         });
    //         seNetUser({
    //             ...NeUser,
    //             Num:data['nextUserNum'],User:data['nextUserNam'],model:data['nextUserMode'],circles:data['nextUserCirNum']
    //         })
    //     })
    //     if (restart){
    //         setRestart(false)
    //     }
    // },[restart])

    return(
        <div class="b">
            {/* <font size="7">Whiteboard</font><br/> */}
            <div class="WeatherCard">
                <div class="Location">Current Number</div>
                <div class="CurrentWeather">
                    <div class="Temperature">
                        {props.user.Num}
                    </div>
                </div>
                {/* <div class="inputName">
                    <i class="fas fa-calendar-alt"></i>111
                </div> */}

                <i class="far fa-clock" style={{fontSize:"20px",paddingLeft: '5px', paddingTop: '5px',fontWeight:'bold'}}>&nbsp;Start Time: {props.user.StTim}</i><br/>
                <i class="fas fa-user" style={{fontSize:"20px",paddingLeft: '5px',}}>&nbsp;USER: {props.user.User}</i><br/>
                {/* <div class="Description">Start Time: NA:NA:NA</div> */}
                <i class="fas fa-book"style={{fontSize:"20px",paddingLeft: '5px', paddingTop: '5px',}}>&nbsp;Model: {props.user.model}</i><br/>
                {/* <div class="Description">Model: LTE</div> */}
                <i class="fab fa-creative-commons-sa"style={{fontSize:"20px", paddingLeft: '5px',paddingTop: '5px',fontWeight:'bold'}}>&nbsp;Circles: {props.user.circles}</i>
                {/* <div class="Description">圈數: 4</div> */}
            </div>
            <div class="WeatherCard" >
                <div class="Location">Next Number</div>
                <div class="CurrentWeather">
                    <div class="Temperature">
                        {props.NeUser.Num}
                    </div>
                </div>

                <i class="far fa-clock" style={{fontSize:"20px",paddingLeft: '5px', paddingTop: '5px',fontWeight:'bold'}}>&nbsp;Start Time: NA:NA:NA</i><br/>
                <i class="fas fa-user" style={{fontSize:"20px",paddingLeft: '5px',}}>&nbsp;USER: {props.NeUser.User}</i><br/>
                {/* <div class="Description">Start Time: NA:NA:NA</div> */}
                <i class="fas fa-book"style={{fontSize:"20px",paddingLeft: '5px', paddingTop: '5px',}}>&nbsp;Model: {props.NeUser.model}</i><br/>
                {/* <div class="Description">Model: LTE</div> */}
                <i class="fab fa-creative-commons-sa"style={{fontSize:"20px",paddingLeft: '5px', paddingTop: '5px',fontWeight:'bold'}}>&nbsp;Circles: {props.NeUser.circles}</i>
                {/* <div class="Description">圈數: 4</div> */}
            </div>
        </div>
    )
}

export default InProcess;