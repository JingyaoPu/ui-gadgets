import React, {
    FC,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { connect } from "react-redux";
import {
    setDraggingPos,
    setPhaseDragging,
    setDraggingObjIn,
    setPhaseDropping,
    setPhaseNone,
    setPhaseAnimation
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
        setPhaseNone,
        setPhaseDragging,
        setPhaseDropping,
        setDraggingObjIn
    } = props
    
    //set dragging phase and transform dragging obj position
    
    const mouseMoveHandlerRef:any = useRef(()=>{})
    const mouseUpHandlerRef:any = useRef(()=>{})
    mouseMoveHandlerRef.current = (event:MouseEvent)=>{
        if(Phase === PhaseTypes.mouseDown){
            setPhaseDragging()
            setIn()
        }else if(Phase === PhaseTypes.dragging){
            const origin = DraggingObj.startPos
            const transX = event.pageX-origin.x
            const transY = event.pageY-origin.y
            const newPos = {
                x:DraggingObj.originCenter.x+transX,
                y:DraggingObj.originCenter.y+transY,
            }
            setDraggingPos({
                pos:newPos,
                //moveDirection:event.movementY<0? 'up': (event.movementY>0?'down':'still')
            })
            DraggingObj.innerRef.current.setAttribute("style",`
                    transform:translate(${transX}px,${transY}px);
                    z-index:99
                `)
        }
    }
    mouseUpHandlerRef.current = (event:MouseEvent)=>{
        console.log("drop")
        if(Phase === PhaseTypes.dragging || Phase === PhaseTypes.mouseDown){
            setPhaseDropping()
        }
    }
    useEffect(()=>{
        // console.log("mount",Phase)
        // setPhaseNone()
        const moveHandler = (event:any)=> mouseMoveHandlerRef.current(event)
        const upHandler = (event:any)=>mouseUpHandlerRef.current(event)
        window.addEventListener('mousemove',moveHandler)
        window.addEventListener('mouseup',upHandler)
        return ()=>{
            console.log("unmount")
            setPhaseNone()
            window.removeEventListener('mousemove',moveHandler)
            window.removeEventListener('mouseup',upHandler)
        }
    },[])
    // const moveHandler = useCallback((event:any)=>{

    //         const origin = DraggingObj.startPos
    //         const transX = event.pageX-origin.x
    //         const transY = event.pageY-origin.y
    //         const newPos = {
    //             x:DraggingObj.originCenter.x+transX,
    //             y:DraggingObj.originCenter.y+transY,
    //         }
    //         setDraggingPos({
    //             pos:newPos,
    //         })
    //         DraggingObj.innerRef.current.setAttribute("style",`
    //                 transform:translate(${transX}px,${transY}px);
    //                 z-index:99
    //             `)
        
    // },[])
    // const mouseUpHandler = useCallback((event:any)=>{
    //     console.log("drop handler")
    //     setPhaseDropping()
    //     window.removeEventListener('mousemove',moveHandler)
    // },[moveHandler])
    // useEffect(()=>{
    //     if(Phase === PhaseTypes.mouseDown){
    //         setPhaseDragging()
    //         setIn()
    //         window.addEventListener('mousemove',moveHandler)
    //     }
    //     else if(Phase === PhaseTypes.dragging){
    //         window.addEventListener('mouseup',mouseUpHandler)
    //     }
    //     else if(Phase === PhaseTypes.dropping){
            
    //         window.removeEventListener('mouseup',mouseUpHandler)
    //     }
    // },[Phase])
    
    const setIn = useCallback(()=>{
        let posIn:any = null
        droppableRegistry.current.forEach((d:any)=>{
            if(calculateCenterIn(DraggingObjPos.pos,d.listRef.current.getBoundingClientRect())){
                posIn = d.id
            }  
        })
        setDraggingObjIn(posIn)
    },[DraggingObjPos.pos,setDraggingObjIn])
    //monitor dragging obj in List change
    useEffect(()=>{
        if(Phase === PhaseTypes.dragging){
            setIn()
        }
    },[DraggingObjPos,Phase,setIn])

    

    const context = {
        registerDroppable,
        changeHandler:props.changeHandler,
        droppableRegistry,
        
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
