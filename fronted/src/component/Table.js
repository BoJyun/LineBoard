import React , { useState, useEffect } from "react";
import * as antd from 'antd';
import "./layout.css"
import { AppContext } from './api';

// const columns = [
//     {
//       title: '列號',
//       width: 80,
//       dataIndex: 'line',
//       key: 'name',
//       align:'center',
//     },

//     { title: '使用者', dataIndex: 'name', key: '1' ,align:'center',color:'red'},
//     { title: '工號', dataIndex: 'employerID', key: '2',align:'center',width: 100, },
//     { title: '分機', dataIndex: 'extension', key: '3' ,align:'center',width: 70,},
//     { title: 'Model', dataIndex: 'model', key: '4' ,align:'center',width: 100,},
//     { title: '圈數', dataIndex: 'circle', key: '5' ,align:'center',width: 80,},

//     {
//       title: 'Quit',
//       key: 'operation',
//       width: 80,
//       align:'center',
//       render: (record) => <a href={"http://127.0.0.1:8000/chamber/chamberapi/api/quit?"}>Quit</a>,
//     },
//   ];

  const Reservation=(props)=>{
    const [chamber,setChamber]=React.useState("")
    const appCtx = React.useContext(AppContext);

    React.useEffect(()=>{
      setChamber(props.chamber)
    },[props.chamber])

    const columns = [
      {
        title: '列號',
        width: 80,
        dataIndex: 'line',
        key: 'number',
        align:'center',
      },

      { title: '使用者', dataIndex: 'name', key: '1' ,align:'center',color:'red'},
      { title: '工號', dataIndex: 'employerID', key: '2',align:'center',width: 100, },
      { title: '分機', dataIndex: 'extension', key: '3' ,align:'center',width: 70,},
      { title: 'Model', dataIndex: 'model', key: '4' ,align:'center',width: 100,},
      { title: '圈數', dataIndex: 'circle', key: '5' ,align:'center',width: 80,},

      {
        title: 'Quit',
        key: 'operation',
        width: 80,
        align:'center',
        // render: (record) => <a href={"http://127.0.0.1:8000/chamber/chamberapi/api/quit?chamber="+chamber+"&LineNum="+record.line}>Quit</a>,
        render: (record) => <span className="delete" onClick={()=>{appCtx.fetchQuit(chamber,record.line)}}>Quit</span>,
      },
    ];
    // const appCtx = React.useContext(AppContext);
    // const [line,setLine]=React.useState([])
    // const [cutline,setCutline]=React.useState([])

    // const fetchAPI=async()=>{
    //   let resp=await appCtx.fetchWhiteboard()

    //   if (resp['cutline']!=0){
    //     let index=0
    //     let data=resp['cutline'].map((item)=>({
    //         line:item["LineNum"],
    //         name: item["RD_name"],
    //         employerID: item["RD"],
    //         extension:  item["extension_num"],
    //         model:item["Model"],
    //         circle:item["Circle"]
    //       })
    //     )
    //     setCutline(data)
    //   }

    //   if (resp['line']!=0){
    //     let index=0
    //     let data=resp['line'].map((item)=>({
    //         line:item["LineNum"],
    //         name: item["RD_name"],
    //         employerID: item["RD"],
    //         extension: item["extension_num"],
    //         model:item["Model"],
    //         circle:item["Circle"]
    //       })
    //     )
    //     setLine(data)
    //   }
    // }

    // useEffect(()=>{
    //   fetchAPI();

    // },[])

      return(
        <div class='a'>
            <font size="5">排隊區</font><br/>
            <div class="ant-table-content">
                <antd.Table columns={columns} dataSource={props.line} pagination={false}  scroll={ {y: 250}} bordered={true}  rowKey="line"/>
            </div>
            <font size="5">插測區</font><br/>
            <div class="ant-table-content">
                <antd.Table columns={columns} dataSource={props.cutLine} pagination={false}  scroll={ {y: 250}} bordered={true} rowKey="line"/>
            </div>
        </div>
      )
  }

  export default Reservation;