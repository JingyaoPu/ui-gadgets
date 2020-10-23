import React, { FC, Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { classNames } from '../utils/classNames';
import {
    setDraggingPos, 
    setDraggingObj, 
    increaseDraggingPos,
    setPhaseMouseDown
} from './store/action'
import {calCenter} from './DragContext'

const Draggable: FC<any> = React.memo((props:any) => {
    const {
        setDraggingPos,
        setDraggingObj,
        setPhaseMouseDown
    }=props
    const innerRef:any = useRef<HTMLElement>();
    useEffect(()=>{
        //console.log("draggable register~~~~",innerRef.current.getBoundingClientRect())
        props.registerDraggable({ref:innerRef})
    }
    ,[])
    let styleClasses = classNames('cursor-ondrag',"pat-list-draggable");
    const provided = {
        ref:innerRef,
        draggable:false,
        className:styleClasses,
        onMouseDown:(event:MouseEvent) => {
            setPhaseMouseDown()
            const center = calCenter(innerRef.current.getBoundingClientRect())
            setDraggingPos({pos:center,moveDireciton:'still'})
            setDraggingObj({
                center:center,
                listId: props.listId,
                listRef: props.listRef, 
                index: props.index, 
                innerRef:innerRef, 
                originCenter: center,
                originRect:innerRef.current.getBoundingClientRect(),
                startPos:{x:event.pageX,
                          y:event.pageY}
            })
        }
    }
    return (
        <Fragment>
            {props.children(provided)}
        </Fragment>
    );
})


export default connect(
    null,
    { 
        setDraggingPos,
        setDraggingObj,
        increaseDraggingPos, 
        setPhaseMouseDown
    }
  )(Draggable);