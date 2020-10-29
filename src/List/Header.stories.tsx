// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import React, { useState, useRef } from 'react';
import List from './List'
import DragContext from './DragContext'
import Draggable from './Draggable'
import Droppable from './Droppable';
import '../styles/index.scss';
import { Provider } from "react-redux";
import store from "./store/store";
import MyLists from "./MyLists"
export default {
  title: 'List',
  component: List,
} as Meta;

export const DefaultList = (args:any) => 
  <List theme="default" title = "DEFUALT">
    {Array.from({ length: 5 }, (v, k) => k).map(k => (
        <div style={{display:"flex", justifyContent:"center",alignItems:"center",
                      height:"20px",width:"100px"}}>
          item{k}
        </div>
    ))}
  </List>

export const PrimaryList = (args:any) => 
  <List theme="primary" title = "PRIMARY">
    {Array.from({ length: 5 }, (v, k) => k).map(k => (
        <div style={{display:"flex", justifyContent:"center",alignItems:"center",
                      height:"20px",width:"100px"}}>
          item{k}
        </div>
    ))}
  </List>

export const DarkList = (args:any) => 
  <List theme="dark" title = "DARK">
    {Array.from({ length: 5 }, (v, k) => k).map(k => (
        <div style={{display:"flex", justifyContent:"center",alignItems:"center",
                      height:"20px",width:"100px"}}>
          item{k}
        </div>
    ))}
  </List>
  

export const Swap = (args:any) => <MyLists/>

