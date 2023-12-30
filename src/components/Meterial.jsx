import React, { useState , useEffect} from 'react';
import './List.css'
import store  from "../redux/sotre"
import axios from 'axios';
export default function Meterial() {
    const [selectedDate, setSelectedDate] = useState('today'); // 默认选择今日
    const [todayMaterials,settoday] = useState([])
    const [tomorrowMaterials,settomorrow] = useState([])
    const materials = selectedDate === 'today' ? todayMaterials : tomorrowMaterials;
    const clist=store.getState().list.list
    const getName=(id)=>{
        const obj=clist.find(o=>o.id===id)
        return obj ? obj.name :""
      }
    const handleChangeDate = (date) => {
      setSelectedDate(date);
    };
    useEffect(()=>{
        axios.get('api/starrail/today_talent_materials').then(
            res=>{
                console.log(res.data)
                settoday(res.data.todayMaterials)
                settomorrow(res.data.tomorrowMaterials)
            }
        )
    },[])
    return (
        <div className="talent-material-menu">
          <div className="date-selector">
            <label>
              <input
                type="radio"
                value="today"
                checked={selectedDate === 'today'}
                onChange={() => handleChangeDate('today')}
              />
              今日
            </label>
            <label>
              <input
                type="radio"
                value="tomorrow"
                checked={selectedDate === 'tomorrow'}
                onChange={() => handleChangeDate('tomorrow')}
              />
              明日
            </label>
          </div>
          <div className="material-list">
            <h2>{selectedDate === 'today' ? '今日' : '明日'}材料：</h2>
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  <strong>{material.talentMaterial}：</strong>
                  
                 {material.characterId.map((id)=>{
                    return  <span>{getName(id)}</span>
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
}
