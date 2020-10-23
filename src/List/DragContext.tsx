import React, {
    FC,
    MouseEvent,
    useEffect,
    useRef,
} from 'react';
import { connect } from "react-redux";
import {
    setDraggingPos,
    setPhaseDragging,
    setDraggingObjIn,
    setPhaseDropping,
    setPhaseNone
} from './store/action'
import {PhaseTypes} from './store/reducers/phase'

const DragContext: FC<any> = (props) => {
    const droppableRegistry:any = useRef([])
    const registerDroppable = (content:any)=>{
        droppableRegistry.current = [...droppableRegistry.current,content];
    }

    const {
        DraggingObj,
        DraggingObjPos, 
        Phase,
        setDraggingPos,
        setPhaseDragging,
        setPhaseDropping,
        setPhaseNone,
        setDraggingObjIn
    } = props

    //set dragging phase and transform dragging obj position
    useEffect(()=>{
        document.addEventListener('mousemove',(event)=>mouseMoveHandlerRef.current(event))
        document.addEventListener('mouseup',(event)=>mouseUpHandlerRef.current(event))
        return document.removeEventListener('mousemove',mouseMoveHandlerRef.current)
    },[])
    const mouseMoveHandlerRef:any = useRef(()=>{})
    const mouseUpHandlerRef:any = useRef(()=>{})
    mouseMoveHandlerRef.current = (event:MouseEvent)=>{
        if(Phase == PhaseTypes.mouseDown){
            setPhaseDragging()
            setIn()
        }else if(Phase == PhaseTypes.dragging){
            const origin = DraggingObj.startPos
            const transX = event.pageX-origin.x
            const transY = event.pageY-origin.y
            const newPos = {
                x:DraggingObj.originCenter.x+transX,
                y:DraggingObj.originCenter.y+transY,
            }
            setDraggingPos({
                pos:newPos,
                moveDirection:event.movementY<0? 'up': (event.movementY>0?'down':'still')
            })
            DraggingObj.innerRef.current.setAttribute("style",`
                    transform:translate(${transX}px,${transY}px);
                    z-index:99
                `)
        }
    }
    mouseUpHandlerRef.current = (event:MouseEvent)=>{
        console.log("drop")
        if(Phase == PhaseTypes.dragging){
            setPhaseDropping()
        }else{
            setPhaseNone()
        }
    }

    //monitor dragging obj in List change
    useEffect(()=>{
        if(Phase == PhaseTypes.dragging){
            setIn()
        }
    },[DraggingObjPos])

    const setIn = ()=>{
        let posIn:any = null
        droppableRegistry.current.forEach((d:any)=>{
            if(calculateCenterIn(DraggingObjPos.pos,d.listRef.current.getBoundingClientRect())){
                posIn = d.id
            }  
        })
        setDraggingObjIn(posIn)
    }

    const context = {
        registerDroppable,
    }
    return ( 
        <>
            {props.children(context) }  
        </>
    );
}

export const calCenter=(rect:any)=>{
    return ({x:(rect.left+rect.right)/2, y:(rect.top+rect.bottom)/2})
}
export const calculateCenterIn = (center:{x:number,y:number}, rect:any)=>{
    return !(center.x < rect.left || 
        center.x > rect.right || 
        center.y < rect.top || 
        center.y > rect.bottom)
}

const mapStateToProps = (state:any) => {
    const { 
        DraggingObjPos,
        DraggingObj,
        Phase 
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
        setPhaseDragging,
        setPhaseDropping,
        setPhaseNone,
        setDraggingObjIn
    }
)(DragContext);
