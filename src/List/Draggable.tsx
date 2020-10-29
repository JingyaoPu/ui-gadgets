import React, { 
    FC, 
    Fragment, 
    MouseEvent, 
    useEffect, 
    useRef 
} from "react";
import { connect } from "react-redux";
import { classNames } from '../utils/classNames';
import {
    setDraggingPos, 
    setDraggingObj, 
    increaseDraggingPos,
    setPhaseMouseDown
} from './store/action'
import {calCenter} from './DragContext'
import {PhaseTypes} from './store/reducers/phase'
const Draggable: FC<any> = React.memo((props:any) => {
    const {
        Phase,
        setDraggingPos,
        setDraggingObj,
        setPhaseMouseDown,
        registerDraggable
    }=props
    const innerRef:any = useRef<HTMLElement>();
    useEffect(()=>{
        if(Phase === PhaseTypes.none){
            registerDraggable({ref:innerRef})
        }
    }
    ,[Phase,registerDraggable])
    let styleClasses = classNames('cursor-ondrag',"pat-list-draggable");
    const provided = {
        ref:innerRef,
        draggable:false,
        className:styleClasses,
        onMouseDown:(event:MouseEvent) => {
            if(Phase !== PhaseTypes.readyToDrag) return
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
            setPhaseMouseDown()
        }
    }
    return (
        <Fragment>
            {props.children(provided)}
        </Fragment>
    );
})

const mapStateToProps = (state:any) => {
    const { 
        DraggingObjPos,
        DraggingObj,
        Phase, 
    } = state;
    return { 
        DraggingObj,
        DraggingObjPos, 
        Phase
    };
};
export default connect(
    mapStateToProps,
    { 
        setDraggingPos,
        setDraggingObj,
        increaseDraggingPos, 
        setPhaseMouseDown
    }
  )(Draggable);