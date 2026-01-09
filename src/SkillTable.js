import React, { useState } from 'react';
import {DataGrid} from '@mui/x-data-grid';
import { configData } from './config';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SkillTable =() =>{
    const [rows, setRows]=useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedId , setSelectedId] = useState('');
    const [groupedData, setGroupedData]=useState(configData);
    const groups = [...new Set(configData.map(item=> item.group))];

    const handleGroupChange = (event) => {
        const group= event.target.value;
        setSelectedGroup(group);
        setSelectedId('');
        setGroupedData(configData);
        if(group){
            const filteredData = configData.filter(item => item.group === group);
            setGroupedData(filteredData);
            console.log('Grouped data:',filteredData);
        }
    }


    const [counters, setCounters] = useState({
        fire:0,
        water:0,
        thunder:0,
        wood:0,
        sp:0,
    });
    const handleAddRow =() => {
        const selectedData = configData.find(item => item.id.toString()===selectedId);
        if(selectedData){
            setRows([...rows,{id: rows.length+1,...selectedData, skillCounter: 1, spCounter: 1}]);
        }
        setSelectedId('');
    };

    const getSkillDiff = (skill) => {
        if (skill <=79 ) return 1;
        if (skill >=80 && skill <=119 ) return 2;
        if (skill >=120 && skill <=139 ) return 3;
        if (skill >=140 && skill <=159) return 4;
        if (skill >=160 && skill <=199 ) return 5;
        if (skill >=200 ) return 6;
    }
    const handleLevelChange = (id, action) => {
        setRows((prevRows)=>
        prevRows.map((row) => {
            if(row.id === id){
                if(action==='add' && (row.skillCounter + row.spCounter) <=10){
                    const newCounters ={...counters};
                    newCounters[row.characteristic]= newCounters[row.characteristic]+1;
                    setCounters(newCounters);
                    return { ...row, level: row.level+1, skill: row.skill-getSkillDiff(row.initialSkill), skillCounter: row.skillCounter+1};
                }else if (action==='remove' && row.skillCounter >1){
                    const newCounters ={...counters};
                    newCounters[row.characteristic]= newCounters[row.characteristic]-1;
                    setCounters(newCounters);
                    return { ...row, level: row.level-1,skill: row.skill+getSkillDiff(row.initialSkill), skillCounter: row.skillCounter-1};
                }
            }
            return row;
        })
    );
    };

    const handleLevelChangeSp = (id, action) => {
        setRows((prevRows)=>
        prevRows.map((row) => {
            if(row.id === id){
                if(action==='add' && (row.skillCounter + row.spCounter) <=10){
                    const newCounters ={...counters};
                    newCounters['sp']= newCounters['sp']+1;
                    setCounters(newCounters);
                    return { ...row, level: row.level+1, skill: row.skill-getSkillDiff(row.initialSkill), spCounter: row.spCounter+1};
                }else if (action==='remove' && row.spCounter >1){
                    const newCounters ={...counters};
                    newCounters['sp']= newCounters['sp']-1;
                    setCounters(newCounters);
                    return { ...row, level: row.level-1,skill: row.skill+getSkillDiff(row.initialSkill), spCounter: row.spCounter-1};
                }
            }
            return row;
        })
    );
    };
    
    const columns = [
        //{field: 'id', headerName: 'ID', width:60, },
        {field: 'avatar', 
         headerName: '', 
         width:50, 
         renderCell: (params) => (
            <Avatar alt={params.row.id} src={"https://jasoncwho.github.io/skill_calculator/images/"+params.row.id+"_m_i.png"} variant="square"/>
            ), 
        },
        {field: 'name', headerName: '名稱', width:145 , },
        {field: 'skill', headerName: '波可', type: 'number', width:35,},
        {field: 'level', headerName: '技能', type: 'number', width:35, },
        {
            field: 'actions',
            headerName: '',
            width: 20,
            renderCell: (params) => (
                <div style={{display: 'flex' , flexDirection:'column',alignItems:'center'}}>
                <Button
                  style={{width: '20px'}}
                  onClick={() => handleLevelChange(params.row.id,'add')}
                  disabled={params.row.skillCounter + params.row.spCounter >10}
                  size="small"
                  startIcon={<AddIcon />}
                  >
                </Button>
                
                <Button
                  style={{width: '20px'}}
                  onClick={() => handleLevelChange(params.row.id,'remove')}
                  disabled={params.row.skillCounter  <=1}
                  size="small"
                  startIcon={<RemoveIcon />}
                  > </Button>
                  
                </div>
            )
        },
        {
            field: 'actionsSp',
            headerName: '',
            width: 20,
            renderCell: (params) => (
                <div style={{display: 'flex' , flexDirection:'column',alignItems:'center'}}> 
                    {params.row.sp &&(
                    <>
                    <Button
                      style={{width: '20px' , height: '26px'}}
                      onClick={() => handleLevelChangeSp(params.row.id,'add')}
                      disabled={params.row.skillCounter + params.row.spCounter >10}
                      size="small">
                        SP+
                    </Button>
                    <Button
                      style={{width: '20px', height: '26px'}}
                      onClick={() => handleLevelChangeSp(params.row.id,'remove')}
                      disabled={ params.row.spCounter <=1}
                      size="small">
                        SP-
                    </Button></>
                    )}
                  
                </div>
            )
        },
        ];

    return (
        <div>
            <select onChange={handleGroupChange} value={selectedGroup}>
                <option value="">Group</option>
                {groups.map((group)=> (
                    <option key={group} value={group}>
                    {group}
                    </option>
                ))}    
            </select>
            <select value={selectedId} onChange={(e)=> setSelectedId(e.target.value)}
                style={{marginBottom: '10px'}}
                >
                    <option value="">Select an ID</option>
                    {groupedData.map(({id,name})=>(
                        <option key={id} value={id}>
                            {id+" "+name }
                        </option> 
                    ))}
                </select>
                <button onClick={handleAddRow} disabled={!selectedId}>Add Row</button>
            <div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                disableColumnMenu
                disableColumnFilter
                disableColumnSorting
                hideFooter
            /></div>
            <div>
            <Avatar alt={"fire"} src={"https://jasoncwho.github.io/skill_calculator/images/1640_m_i.png"} variant="square"/> {counters.fire}
            <Avatar alt={"water"} src={"https://jasoncwho.github.io/skill_calculator/images/1641_m_i.png"} variant="square"/> {counters.water}
            <Avatar alt={"thunder"} src={"https://jasoncwho.github.io/skill_calculator/images/1642_m_i.png"} variant="square"/> {counters.thunder}
            <Avatar alt={"wood"} src={"https://jasoncwho.github.io/skill_calculator/images/1643_m_i.png"} variant="square"/> {counters.wood}
            <Avatar alt={"sp"} src={"https://jasoncwho.github.io/skill_calculator/images/2703_m_i.png"} variant="square"/> {counters.sp}
            </div>
        </div>
       

       
    );
};

export default SkillTable;