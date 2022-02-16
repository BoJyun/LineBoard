import React , { useState, useEffect } from "react";
import "./layout.css"


const Headwhiteboard=(props)=>{
    return (
        <div>
            <font size="7">{props.mylabel} Whiteboard</font><br/>
        </div>
    )
}

const AllBG=()=>{
    return (
        <div style={{marginTop:"100px"}}>
            <font size="7">All Buiness Group</font>
        </div>
    )
}


export {Headwhiteboard,AllBG};