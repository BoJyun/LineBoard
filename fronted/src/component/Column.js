import React, { useState, useEffect } from 'react';
import "./layout.css";
import { Column } from '@ant-design/charts';
import * as antd from 'antd';
const columns = [

  { title: 'SAS', dataIndex: 'SAS', key: '1' ,align:'center',color:'red'},
  { title: 'Connecting Home', dataIndex: 'CH', key: '2',align:'center',width: 100, },
  { title: 'Net Working', dataIndex: 'NW', key: '3' ,align:'center',width: 70,},
  { title: 'Automatic Industry Solutions', dataIndex: 'AIS', key: '4' ,align:'center',width: 100,},
  { title: 'Advance', dataIndex: 'Other', key: '5' ,align:'center',width: 80,},

];

const ChamberColumn = (props) => {
  // const [data,setData]=React.useState([])
  const datatime = [
    "00:00:00",
    "01:00:00",
    "02:00:00",
    "03:00:00",
    "04:00:00",
    "05:00:00",
  ]
  const data = [
    {
      type: 'SAS',
      sales: parseInt("50",10),
    },
    {
      type: 'Connecting Home',
      sales: parseInt("20",10),
    },
    {
      type: 'Net Working',
      sales: parseInt("34",10),
    },
    {
      type: 'Automatic Industry Solutions',
      sales: parseInt("26",10),
    },
    {
      type: 'Advance',
      sales:parseInt("13",10),
    }
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    // yAxis: {
    //   ticks: {
    //     min: 0, max: 5,
    //     callback: value => datatime[value]
    //   },
    // },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  };
  // return (
  //     <div class="v">
  //       <Column {...config}/>
  //     </div>
  // )
  return(
    <div class='a'>
        <div class="ant-table-content">
            <antd.Table columns={columns} dataSource={props.allBU} pagination={false}  scroll={ {y: 250}} bordered={true}/>
        </div>
      {console.log(props.allBU)}
    </div>
  )

};

export default ChamberColumn;