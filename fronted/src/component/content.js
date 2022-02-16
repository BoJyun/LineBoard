import  React , { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import ChamberColumn from "./Column.js";
import InProcess from "./Inprocess.js"
import {Headwhiteboard,AllBG} from "./label.js"
import FormLayoutDemo from "./Form"
import Reservation from './Table';
import { AppContext } from './api';

const AppContent=(props)=>{
    let { chamber } = ReactRouterDOM.useParams();
    const appCtx = React.useContext(AppContext);
    const [restart,setRestart]=React.useState(false)
    const [line,setLine]=React.useState([])
    const [cutline,setCutline]=React.useState([])
    const [allBU,setAllBU]=React.useState([])
    const [user,setUser]=React.useState({Num:0,StTim:'NA:NA:NA',User:'None',model:'None',circles:0})
    const [NeUser,seNetUser]=React.useState({Num:0,StTim:'NA:NA:NA',User:'None',model:'None',circles:0})
    const ws=React.useRef(null)

    React.useEffect(()=>{
        ws.current = new WebSocket("ws://127.0.0.1:8000/chamberAPI/ws/"+chamber+"/");
        ws.current.onopen=()=>{
            console.log('websocket link success')
        }
        ws.current.onerror=(error)=>{
            console.error("WebSocket error observed:", error);
        }

        return (()=>{
            ws.current.close()
            initialize()
            console.log('websocket link close')
       })
    },[chamber])

    React.useEffect(()=>{
        setTimeout(()=>window.location.reload(),2400000)
    },[])

    React.useEffect(()=>{
        if (!ws){return};

        ws.current.onmessage=(e)=>{
            console.log("socket",e.data)
            setRestart(true)
        }
    })

    React.useEffect(()=>{
        fetchAPI();
    },[restart])

    React.useEffect(() => {
        if (restart) {
            setRestart(false)
        }
    }, [restart])

    const fetchAPI=async()=>{
        let resp=await appCtx.fetchWhiteboard(chamber)

        if (resp['cutline']!=[]){
          let index=0
          let data=resp['cutline'].map((item)=>({
              line:item["LineNum"],
              name: item["RD_name"],
              employerID: item["RD"],
              extension:  item["extension_num"],
              model:item["Model"],
              circle:item["Circle"]
            })
          )
          setCutline(data)
        }

        if (resp['line']!=[]){
          let index=0
          let data=resp['line'].map((item)=>({
              line:item["LineNum"],
              name: item["RD_name"],
              employerID: item["RD"],
              extension: item["extension_num"],
              model:item["Model"],
              circle:item["Circle"]
            })
          )
          setLine(data)
        }

        let dataUser=await appCtx.fetchInprocess(chamber)
        setUser({
            Num:dataUser['nowUserNum'],StTim:dataUser["startTime"],User:dataUser['nowUserNam'],model:dataUser['nowUserMode'],circles:dataUser['nowUserCirNum']
        });
        seNetUser({
            ...NeUser,
            Num:dataUser['nextUserNum'],User:dataUser['nextUserNam'],model:dataUser['nextUserMode'],circles:dataUser['nextUserCirNum']
        })
      }

    const initialize=()=>{
        setRestart(true)
        sendSocketMsg()
    }

    const sendSocketMsg=()=>{
        ws.current.send(JSON.stringify({message:"changeData true"}))
    }

    return(
        <>
            <div style={{height:"700px"}}>
                <Headwhiteboard mylabel={chamber}/>
                <InProcess user={user} NeUser={NeUser}/>
                <Reservation line={line} cutLine={cutline} chamber={chamber}/>
                <FormLayoutDemo onSuccess={initialize} chamber={chamber}/>
            </div>
            {/* <div style={{marginTop:"10px"}}>
                <AllBG/>
                <ChamberColumn allBU={allBU}/>
            </div> */}
        </>
    )
}

export default AppContent;