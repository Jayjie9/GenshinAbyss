import React, { useState,useEffect } from 'react';
import background from './1.jpg'
import {FloatButton,Drawer} from 'antd';
import Upload from '../components/Upload';
import CharacterList from '../components/CharacterList';
import TeamList from '../components/TeamList'
import VersionSelecter from '../components/VersionSelecter'
import { HashRouter, Route,Switch,Redirect} from 'react-router-dom'
import {PlusOutlined , SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import store from '../redux/sotre';
import { setVersion , setlist } from '../redux/actions/actions';
import Meterial from '../components/Meterial';
const AbyssQuery = () => {
  const [open, setOpen] = useState(false);
  const [type,settype] = useState(true)
  useEffect(()=>{
    axios.get("api/starrail/characters").then(
      res=>{
        console.log(res.data.characters)
        store.dispatch(setlist(res.data.characters))
      }
    )
    axios.get("/api/starrail/version").then(
      res=>{
        store.dispatch(setVersion(res.data.versions.find(obj => obj.id === res.data.currentVersion).ver))
      }
    )
  },[])
  return (
    <div style={styles.container}>
      <div style={styles.meterial}>
        <Meterial />
      </div>
        <FloatButton style={styles.versionselecter}
        icon={<SettingOutlined />}
          onClick={() => {
            setOpen(true)
            settype(true)
          }} 
        />
        <FloatButton style={styles.selecter}
        icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true)
            settype(false)
          }} 
        />
        <Drawer title={type?"深渊版本选择":"深渊数据上传"} style={styles.sidepage}  placement="right" onClose={()=>setOpen(false)} open={open} maskClosable={false}>
          {type?<VersionSelecter />:<Upload />}
        </Drawer>
      <header style={styles.header}>
        <img 
        src={require(`${'./R.jpg'}`)} // 替换为左侧图片的路径
        style={styles.topimage}></img>
      </header>

      <div style={styles.mainContainer}>
      <HashRouter >
        <Switch>
          <Redirect from='/' to='/home' exact />
          <Route path='/home' component={CharacterList} />
          <Route path='/team' component={TeamList} />
        </Switch>
      </HashRouter>
      </div>
        <p>&copy; 2023 原神深渊查询</p>

    </div>
  );
};

const styles = {
  sidepage:{
    opacity:'0.8',
  },
  container: {
    backgroundImage: `url(${background})`, // 替换为实际的背景图片路径
    backgroundSize: 'cover', // 图片尺寸根据容器尺寸进行调整
    backgroundPosition: 'center', // 图片居中显示
    backgroundRepeat: 'no-repeat', // 不重复显示背景图片
    fontFamily: 'Arial, sans-serif',
    height:'100%',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  header: {
    width:'100%',
    backgroundColor:'white',
    color: 'white',
    textAlign: 'center',
    position: 'relative', // 使 header 成为相对定位的容器

    opacity:'0.8',
  },
  mainContainer: {
    opacity:'0.5',
    width:'70%',
    maxWidth: '800px',
    height: '72%', // 设置高度为90%的视窗高度
    margin: '20px auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    marginBottom: '16px',
    padding: '8px',
    width: '60%',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: 'black',
    color: 'black',
    cursor: 'pointer',
    width: '50%',
    boxSizing: 'border-box',
  },
  resultContainer: {
    marginTop: '20px',
  },
  resultText: {
    // Add styles for result text
  },

  topimage:{
    maxWidth: '100%', // 图片最大宽度为容器宽度
    maxHeight: '100px', // 图片最大高度，根据需要调整
    display: 'block', // 去除图片底部空白间隙
    margin: '0 auto', // 居中显示
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    marginRight: '20px',
  },
  meterial: {
    width: "20%",
    maxWidth: "200px",
    position: "fixed",
    top: 100,
    left: 0,
  },
  versionselecter:{
    position: "fixed",
    bottom: 30,
    right: 30,
  },
  selecter: {
    position: "fixed",
    bottom: 90,
    right: 30,
  }
};

export default AbyssQuery;
