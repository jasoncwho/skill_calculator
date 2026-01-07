import React, { useState } from 'react';
import {DataGrid} from '@mui/x-data-grid';
import { configData } from './config';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';

const SkillTable =() =>{
    const [rows, setRows]=useState([]);
    const [counters, setCounters] = useState({
        fire:0,
        water:0,
        thunder:0,
        wood:0,
    });
    const handleAddRow =(selectedId) => {
        const selectedData = configData.find(item => item.id.toString()===selectedId);
        if(selectedData){
            const newRow ={
                ...selectedData,
                id: rows.length+1
            };
            setRows([...rows,newRow]);
        }
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
                if(action==='add' && row.level <10){
                    const newCounters ={...counters};
                    newCounters[row.characteristic]= newCounters[row.characteristic]+1;
                    setCounters(newCounters);
                    return { ...row, level: row.level+1, skill: row.skill-getSkillDiff(row.initialSkill)};
                }else if (action==='remove' && row.level >1){
                    const newCounters ={...counters};
                    newCounters[row.characteristic]= newCounters[row.characteristic]-1;
                    setCounters(newCounters);
                    return { ...row, level: row.level-1,skill: row.skill+getSkillDiff(row.initialSkill)};
                }
            }
            return row;
        })
    );
    };

    const columns = [
        {field: 'id', headerName: 'ID', width:60},
        {field: 'avatar', 
         headerName: '1', 
         width:120, 
         renderCell: (params) => (
            <Avatar alt={params.row.id} src={params.row.Avatar} variant="square"/>
            ),
        },
        {field: 'name', headerName: '名稱', width:150},
        {field: 'level', headerName: '技能lv', type: 'number', width:80},
        {field: 'skill', headerName: '波可', type: 'number', width:80},
        {
            field: 'actions',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <>
                <IconButton
                  onClick={() => handleLevelChange(params.row.id,'add')}
                  disabled={params.row.level >=10}
                  >
                    <AddIcon/>
                </IconButton>
                <IconButton
                  onClick={() => handleLevelChange(params.row.id,'remove')}
                  disabled={params.row.level <=1}
                  >
                    <RemoveIcon/>
                </IconButton>
                </>
            )
        }
        ];

    return (
        <div>
            <select onChange={(e)=> handleAddRow(e.target.value)}
                style={{marginBottom: '10px'}}
                >
                    <option value="">Select an ID</option>
                    {configData.map(({id,name})=>(
                        <option key={id} value={id}>
                            {id+" "+name }
                        </option> 
                    ))}
                </select>
            <div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            /></div>
            <div>
            <Avatar alt={"fire"} src={"/images/1640_m_i.png"} variant="square"/> {counters.fire}
            <Avatar alt={"water"} src={"/images/1641_m_i.png"} variant="square"/> {counters.water}
            <Avatar alt={"thunder"} src={"./images/1642_m_i.png"} variant="square"/> {counters.thunder}
            <Avatar alt={"wood"} src={"./images/1643_m_i.png"} variant="square"/> {counters.wood}
            </div>
        </div>
       

       
    );
};

export default SkillTable;