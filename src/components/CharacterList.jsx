import React, { useEffect, useState } from 'react';
import './List.css'; // 引入外部样式表
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import store from '../redux/sotre';
import axios from 'axios';
import {cha} from '../redux/actions/actions'
const itemsPerPage = 9;
const CharacterList = () => {
  useEffect(()=>{
    var templist=[]
    var ratelist=[]
    try {
      axios.get("api/starrail/characters").then(
        res=>{
          templist=res.data.characters
          axios.get("api/starrail/usagerate/"+store.getState().version.version).then(
            res=>{
              ratelist=res.data.usageRates.data
              setptotal(res.data.usageRates.prevTotal)
              setctotal(res.data.usageRates.currentTotal)
              const mergedArray = templist.map(obj1 => {
                const matchingObj2 = ratelist.find(obj2 => obj2.characterId === obj1.id);
                if (matchingObj2) {
                  return { ...obj1, ...matchingObj2 };
                }
                return obj1;
              });
              setc(mergedArray.sort((b, a) => a.currentRate - b.currentRate))
            }
          ).catch()
        }
      ).catch()
    } catch (error) {
      
    }
    

  },[store.getState().version.version])
  const [ctotal,setctotal]=useState()
  const [ptotal,setptotal]=useState()
  const [characterlist,setc]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedData = sortData(characterlist, sortColumn, sortOrder);
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(characterlist.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="character-list-container">
      <header className="character-header">
        <strong style={{paddingRight:40}}>当前版本：{store.getState().version.version }  </strong>
        <strong style={{paddingRight:40}}>本期数据：{ctotal }  </strong>
        <strong style={{paddingRight:40}}>上期数据：{ptotal }  </strong>
      </header>
      <table className="character-table">
        <thead>
          <tr>
            <SortableHeader
              column="name"
              label="角色"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="prevUsed"
              label="上期使用数"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="currentUsed"
              label="当前使用数"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="prevRate"
              label="上期使用率"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="currentRate"
              label="当前使用率"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="rateOfChange"
              label="变化率"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {currentItems.map((character, index) => (
            <tr key={index} onClick={()=>{
              store.dispatch(cha(character.id,character.name))
            }}>
              
              <td><Link to={`/team`}>{character.name}</Link></td>
              <td>{(character.prevUsed)}</td>
              <td>{(character.currentUsed)}</td>
              <td>{(character.prevRate*100).toFixed(2)+'%'}</td>
              <td>{(character.currentRate*100).toFixed(2)+'%'}</td>
              <td>{(character.rateOfChange*100).toFixed(2)+'%'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          上一页
        </button>
        <span> 第{currentPage}页 / 共{totalPages}页 </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

// 新增的SortableHeader组件，用于渲染可排序的表头
const SortableHeader = ({ column, label, sortColumn, sortOrder, onSort }) => {
  const isCurrentSortColumn = column === sortColumn;
  const isAscOrder = isCurrentSortColumn && sortOrder === 'asc';

  return (
    <th onClick={() => onSort(column)} className={isCurrentSortColumn ? 'sort-active' : ''}>
      {label}{' '}
      {isCurrentSortColumn && <span className={`sort-icon ${isAscOrder ? 'asc' : 'desc'}`} />}
    </th>
  );
};

// 新增的sortData函数，用于对数据进行排序
const sortData = (data, column, order) => {
  if (!column) {
    return data;
  }

  const sortedData = [...data];
  sortedData.sort((a, b) => {
    const aValue = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
    const bValue = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sortedData;
};

export default CharacterList;

