import React ,{ useState }from 'react'
import store from '../redux/sotre'
import { Select , Input ,Button, message} from 'antd';
import axios from 'axios';
const {Option}=Select
export default function Upload() {
  const options=store.getState().list.list.map(item=>({value:item.name}))
  const [firsthalf,setF]=useState([])
  const [secondhalf,setS]=useState([])
  const [uid,setuid]=useState()
  const [huid,sethuid]=useState()
  const [historylist,sethlist]=useState([])
  const getName=(id)=>{
    const obj=store.getState().list.list.find(o=>o.id===id)
    return obj ? obj.name :null
  }
  const getid=(name)=>{
    const obj=store.getState().list.list.find(o=>o.name===name)
    return obj ? obj.id :null
  }
  const check=(arr1,arr2)=>{
      const noCommonItems = arr1.every(item => !arr2.includes(item));
    
      // 返回检查的结果
      return noCommonItems;
  }
  const handleChange1 = (value) => {
    setF(value)
  };
  const handleChange2 = (value) => {
    setS(value)
  };
  const submit=()=>{
    if(check(firsthalf,secondhalf)&&uid!==null&&uid!==undefined&&uid.length===9){
      //提交
      const data={
        uid:uid,
        firstHalf:firsthalf.map(item=>(getid(item))),
        secondHalf:secondhalf.map(item=>(getid(item))),
        forcedOverwrite: true
      }
      axios.post('api/starrail/abyss',data,{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(
        res=>{
          message.info('提交成功')
        }
      ).catch(
        err=>{
          message.warning('网络原因提交失败');
        } 
      )

    }else{
      message.warning('输入不合法,无法提交(可能是角色重复,uid非法)');
    }
  }
  const submith=()=>{
    if(uid!=null&&uid!==undefined&&uid.length===9){
      axios.get("api/starrail/uploadHisory?uid="+huid).then(
        res=>{
          sethlist(res.data.uploadHistory)
        }
      )
    }else{
      message.warning('uid输入不合法 ');
    }
    
  }
  return (
    <div>  
      <h3>当前深渊版本：{store.getState().version.version}</h3>
      <Input placeholder='请输入uid' style={{margin:5}} value={uid} onChange={(e)=>{setuid(e.target.value)}}/>
      <div>上半队伍:</div>  
      <Select
      mode="multiple"
      allowClear
      style={{
        width: '100%',
        margin:5
      }}
      placeholder="Please select"
      onChange={handleChange1}
      >
        {
          options.filter(item=> !secondhalf.includes(item)).map(item=>(
            <Option
              disabled={
                firsthalf.length>=4?firsthalf.includes(item)?false:true:false
              }
              key={item.value}
            >
              {item.value}
            </Option>
          ))
        }
      </ Select>
      <div>下半队伍:</div>  
      <Select
      mode="multiple"
      allowClear
      style={{
        width: '100%',
        margin:5
      }}
      placeholder="Please select"
      onChange={handleChange2}
      >
        {
          options.filter(item=> !firsthalf.includes(item)).map(item=>(
            <Option
              disabled={
                secondhalf.length>=4?secondhalf.includes(item)?false:true:false
              }
              key={item.value}
            >
              {item.value}
            </Option>
          ))
        }
      </ Select>
      <Button type="primary" style={{margin:5}} onClick={submit}>上传深渊数据</Button>
      <h3>上传历史查询</h3>
      <Input placeholder='请输入uid' style={{margin:5}} value={uid} onChange={(e)=>{sethuid(e.target.value)}}/>
      <Button type="primary" style={{margin:5}} onClick={submith}>查询上传历史</Button>
      {historylist.map((item,)=>(
        <div>
          <h4>上半：</h4>
          {item.firstHalf.map((id)=>(<span>{getName(id)+"  "}</span>))}
          <h4>下半：</h4>
          {item.secondHalf.map((id)=>(<span>{getName(id)+"  "}</span>))}
          <h4>上传时间：</h4>
          <span>{item.uploadTime}</span>
        </div>
      ))}
    </div>
  )
}
