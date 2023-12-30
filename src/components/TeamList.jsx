import React, { useState ,useEffect } from 'react';
import './List.css'; // 引入外部样式表
import axios from 'axios';
import store  from "../redux/sotre"
import { Link } from 'react-router-dom';
const itemsPerPage = 9;
const CharacterList = () => {
  const clist=store.getState().list.list
  const getName=(id)=>{
    const obj=clist.find(o=>o.id===id)
    return obj ? obj.name :null
  }
  useEffect(()=>{
    axios.get("api/starrail/team_rank/"+store.getState().version.version+"?characterId="+store.getState().cState.id).then(
      res=>{
        console.log(res.data)
        setlist(res.data.teamStatistics.sort((b, a) => a.usageRate - b.usageRate))
      }
    )
  },[store.getState().version.version])
  const [teamlist,setlist]=useState([])
  const name=store.getState().cState.name;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedData = sortData(teamlist, sortColumn, sortOrder);
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(teamlist.length / itemsPerPage);

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
        <div className="left-container">
          <Link to="/" className="backButton">
            《—
          </Link>
        </div>
        <h3>{name}队伍查询</h3>
      </header>
      <table className="character-table">
        <thead>
          <tr>
            <SortableHeader
              column="name"
              label="队伍组成"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            <SortableHeader
              column="usageRate"
              label="使用率"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="firstHalf"
              label="上半数"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="secondHalf"
              label="下半数"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              column="ratio"
              label="上下比"
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {currentItems.map((character, index) => (
            <tr key={index}>
            <td className="team-cell">
              <div className="team">
                {character.team.map((member, i) => (
                  <div key={i}>{getName(member)}</div>
                ))}
              </div>
            </td>
            <td className="usage-rate-cell">{(character.usageRate*100).toFixed(2)+'%'}</td>
            <td className="usage-rate-cell">{(character.firstHalf)}</td>
            <td className="usage-rate-cell">{(character.secondHalf)}</td>
            <td className="usage-rate-cell">{(character.ratio)}</td>
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

