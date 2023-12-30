import React , {useState , useEffect}from 'react';
import store from '../redux/sotre';
import { Select, Space } from 'antd';
import axios from 'axios';
import { setVersion } from '../redux/actions/actions';
const handleChange = (value) => {
  store.dispatch(setVersion(value))
};
const App = () => {
  useEffect(()=>{
    var temp=[]
    axios.get("/api/starrail/version").then(
      res=>{
        console.log(store.getState().version)
        temp=res.data.versions.map(({ver})=>({
          value:ver,
          lable:ver
        }))

        setOptions(temp)
      }
    )
  },[])
  const [options,setOptions]=useState([])
  return(
    <Space wrap>
    <Select
      defaultValue={store.getState().version.version}
      style={{
        width: 300,
      }}
      onChange={handleChange}
      options={options}
    />
  </Space>
  )
}
export default App;
