import React, { Component, useEffect, useState, useRef } from 'react';
import List from './List'
import DragContext from './DragContext'
import Draggable from './Draggable'
import Droppable from './Droppable';
import '../styles/index.scss';
import { Provider } from "react-redux";
import store from "./store/store";

const buttonStyle = {
    marginRight: '5px',
    marginTop: '5px',
  };
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item${k + offset}`,
        content: `item ${k + offset}`
    }));


const getButtons  = (count, offset = 0)=>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `button${k + offset}`,
        content:<button style={buttonStyle}>
                    Default Button {k}
                </button>
    }));
 

const MyLists = () => {
    const key = useRef(0)
    key.current = key.current+1
    const [data, setData] = useState({
        drop0:getItems(5),
        drop1:getButtons(5)
    })
    
    console.log("myLists called")
    const changeHandler = (change)=>{
        if(!change) return
        console.log(change)
        if(change.from.listId!=change.to.listId && change.to.listId){
            const source = [...data[change.from.listId]]
            const target = [...data[change.to.listId]]
            const [temp] = source.splice(change.from.index,1)
            target.splice(change.to.index,0,temp)
            setData((data)=>({...data,[change.from.listId]:source,[change.to.listId]:target}))
        }
        else if(change.from.listId==change.to.listId){
            console.log("setting state!!!")
            const list = [...data[change.from.listId]]
            const [temp] = list.splice(change.from.index,1)
            list.splice(change.to.index,0,temp)
            setData((data)=>({...data,[change.from.listId]:list}))
        }
        // setFresh(true)
        // setTimeout(()=>setFresh(false),0)
    }
    console.log(data)
    return ( 
    <div style= {{display:"flex",justifyContent:"space-around"}}>
    <Provider store={store}>
    <DragContext changeHandler={changeHandler}>
    {(context) => (
        <>
        <Droppable id = "drop0"  {...context} >
        {(droppableProvided)=>(
        <List {...droppableProvided} {...context}>
            {data.drop0.map((item, index) => (
                <Draggable
                index={index}
                {...droppableProvided}
                {...context}>
                    {(provided)=>(
                        <div key = {item.id}
                        {...provided}>
                            {item.content}
                        </div>
                    )}
                </Draggable>
            ))}
        </List>)}
        </Droppable >
        <Droppable id = "drop1"  {...context} >
        {(droppableProvided)=>(
        <List {...droppableProvided} {...context}>
            {data.drop1.map((item, index) => (
                <Draggable
                index={index}
                {...droppableProvided}
                >
                    {(provided)=>(
                        <div key = {item.id}
                        {...provided}>
                            {item.content}
                        </div>
                    )}
                </Draggable>
            ))}
        </List>)}
        </Droppable>
        </>
    )}
    </DragContext>
    </Provider>
    </div>
)
}
 
export default MyLists;