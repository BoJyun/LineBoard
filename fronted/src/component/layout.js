import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import "./layout.css";
import AppContent from "./content.js";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ItemBread=()=>{
  let { chamber,BU } = ReactRouterDOM.useParams();
  console.log(chamber)
  return(
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>{chamber}</Breadcrumb.Item>
      <Breadcrumb.Item>{BU}</Breadcrumb.Item>
    </Breadcrumb>
  )
}

const ChamberApp=()=>{

  const [Chamber,setChamber]=React.useState({chamber:'',bg:""})

  const onClickItem=(event)=>{
    setChamber({
      chamber:event.keyPath[0],
      bg:event.keyPath[1]
    })
  }

  return (
    <Layout>
      <ReactRouterDOM.HashRouter>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1" onClick={(event)=>{setChamber({chamber:'',bg:''})}}>
              <ReactRouterDOM.Link to="/">WNC</ReactRouterDOM.Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={150} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="whiteboard" icon={<LaptopOutlined />} title="Lineboard">
                <Menu.Item key="SG24" onClick={(event)=>{onClickItem(event)}}><ReactRouterDOM.Link to="/chamber/SG24/whiteboard">SG24</ReactRouterDOM.Link></Menu.Item>
                <Menu.Item key="SG64" onClick={(event)=>{onClickItem(event)}}><ReactRouterDOM.Link to="/chamber/SG64/whiteboard">SG64</ReactRouterDOM.Link></Menu.Item>
                <Menu.Item key="CATR" onClick={(event)=>{onClickItem(event)}}><ReactRouterDOM.Link to="/chamber/CATR/whiteboard">CATR</ReactRouterDOM.Link></Menu.Item>
              </SubMenu>
              {/* <SubMenu key="SG64" icon={<LaptopOutlined />} title="SG64">
                <Menu.Item key="SG64whiteboard"onClick={(event)=>{onClickItem(event)}}><ReactRouterDOM.Link to="/chamber/SG64/whiteboard">whiteboard</ReactRouterDOM.Link></Menu.Item>
                <Menu.Item key="7">SAS</Menu.Item>
                <Menu.Item key="8">CH</Menu.Item>
                <Menu.Item key="9">NW</Menu.Item>
                <Menu.Item key="10">AIS</Menu.Item>
              </SubMenu> */}
            </Menu>
          </Sider>

          <Layout style={{ padding: '0 24px 24px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>{Chamber.chamber}</Breadcrumb.Item>
              <Breadcrumb.Item>{Chamber.bg}</Breadcrumb.Item>
            </Breadcrumb> */}
              <ReactRouterDOM.Route path="/chamber/:chamber/:BU"  children={<ItemBread />}/>

            <Content

              className="site-layout-background"
              style={{
                padding: 10,
                margin: 0,
                // minHeight: 2000,
              }}
            >

                <ReactRouterDOM.Switch>
                  <ReactRouterDOM.Route exact path="/"  children={<></>}/>
                  <ReactRouterDOM.Route path="/chamber/:chamber/:BU" children={ <AppContent />}/>
                </ReactRouterDOM.Switch>

            </Content>
          </Layout>
        </Layout>
      </ReactRouterDOM.HashRouter>
    </Layout>
  )
};


export default ChamberApp;