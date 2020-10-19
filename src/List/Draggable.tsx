import React, { Children, createRef, FC, Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { classNames } from '../utils/classNames';
export interface DragableProps {

}

const Draggable: FC<DragableProps> = React.memo((props:any) => {
    //console.log("draggable excution")
    const innerRef:any = useRef<HTMLElement>();
    
    useEffect(()=>{
        if(!props.draggingObj){
            //console.log("draggable register~~~~",innerRef.current.getBoundingClientRect())
            props.registerDraggable({ref:innerRef,index:+props.index})
        }
    }
    ,[props.draggingObj]
    )
    let styleClasses = classNames('cursor-ondrag',"pat-list-draggable");
    const provided = {
        ref:innerRef,
        //id:props.listId,
        draggable:false,
        className:styleClasses,
        onMouseDown:(event:any) => {
            props.finish.current = false
            event.preventDefault();
                //console.log("offset:", event.nativeEvent.offsetX)
                props.setDraggingObj({ 
                    listId: props.listId,
                    listRef: props.listRef, 
                    index: props.index, 
                    innerRef:innerRef, 
                    originRect:innerRef.current.getBoundingClientRect(),
                    startPos:{x:event.pageX,y:event.pageY, 
                            offset:{x:event.nativeEvent.offsetX,y:event.nativeEvent.offsetY}}})
        },
        
    }
    return (
        <Fragment>
            {props.children(provided)}
        </Fragment>
    );
})

export default Draggable;