import * as React from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';
import {calCenter} from './DragContext'
import {} from './store/action'
import {PhaseTypes} from './store/reducers/phase'
import {setPhaseAnimation,setPhaseNone} from './store/action'
const Droppable: React.FC<any> = (props:any) => {
    const listRef = useRef<any>()
    const height = useRef<any>()
    const placeHolderIndex = useRef<any>()
    const draggableRegistry = useRef<any>([])
    const children:any = useRef()
    const registerDraggable = (item:any)=>{
        draggableRegistry.current = [...draggableRegistry.current,item]};
    const { 
        DraggingObjPos,
        DraggingObj,
        Phase, 
        setPhaseAnimation,
        setPhaseNone
    } = props
    React.useEffect(()=>{
        if(!props.draggingObj){
        props.registerDroppable({
            id:props.id,listRef:listRef, 
            rect:listRef.current.getBoundingClientRect()
        })
        children.current = draggableRegistry.current.map((child:any,index:number)=>
            ({  index:index, 
                originIndex:index, 
                center:calCenter(child.ref.current.getBoundingClientRect()),
                rect: child.ref.current.getBoundingClientRect(),
                ref:child.ref, 
                originCenter:calCenter(child.ref.current.getBoundingClientRect()),
                listId: props.id})
        )
        height.current = listRef.current.getBoundingClientRect().height
        }
    },[])
    React.useEffect(()=>{
        console.log(Phase)
        if(Phase == PhaseTypes.dragging && DraggingObj.listId==props.id){         
            remove(DraggingObj.index)
        }
        else if(Phase == PhaseTypes.dropping){
            if(DraggingObj.in==props.id){
                setPhaseAnimation()
                const to =  children.current[placeHolderIndex.current].center
                DraggingObj.innerRef.current.setAttribute("style",
                    `transform:translate(
                        ${to.x-DraggingObj.originCenter.x}px,
                        ${to.y-DraggingObj.originCenter.y}px);
                        z-index:99
                    `)
            }
            else if(DraggingObj.listId == props.id && DraggingObj.in == null){
                
            }
            setTimeout(()=>{
                if(DraggingObj.listId == props.id){
                    insert(DraggingObj.index,DraggingObj)
                }
                pushback()
                listRef.current.setAttribute("style",`height:${height.current}px`)
                setPhaseNone()
            },150)
        }
    },[Phase])

    React.useEffect(()=>{
        if(Phase == PhaseTypes.dragging){
            let newHeight
            if(DraggingObj.in==props.id){
                const holderIndex = getInsertPos(DraggingObjPos.pos)
                placeHolderIndex.current = holderIndex
                pushDown(holderIndex, DraggingObj.originRect.height)
                newHeight = DraggingObj.listId == props.id?
                height.current : height.current + DraggingObj.originRect.height
            }else{
                pushback()
                newHeight = DraggingObj.listId == props.id?
                height.current - DraggingObj.originRect.height : height.current
            }
            listRef.current.setAttribute("style",`height:${newHeight}px`)
        }
    },[DraggingObjPos])

    const pushback = ()=>{
        children.current.forEach((item:any,i:number)=>{
            item.ref.current.setAttribute("style", 
            `transform:translate(0px,${item.center.y-item.originCenter.y}px)`)
        })
    }
    const pushDown = (start:number, height:number)=>{
        children.current.forEach((item:any,i:number)=>{
            if(i<start){
                item.ref.current.setAttribute("style", 
                `transform:translate(0px,${item.center.y-item.originCenter.y}px)`)
            }else{
                item.ref.current.setAttribute("style", 
                `transform:translate(0px,${item.center.y-item.originCenter.y+height}px)`)
            }
        })
    }
    const getInsertPos = (insertObjCenter:{x:number,y:number})=>{
        let min = Infinity
        let index = -1
        const p = insertObjCenter
        children.current.forEach((item:any,i:number)=>{
            const {x,y} = item.center
            const distance = Math.pow(x-p.x, 2) + Math.pow(y-p.y, 2)
            if(distance<min){
                min = distance;
                index = i
            }
        })
        return index
    }
    const insert = (index:number,obj:any) => {
        let temp = [...children.current]
        const insertObjHeight = DraggingObj.originRect.height
        temp.splice(index,0,)
        const n = { 
            index:index, 
            originIndex:index, 
            center:obj.center,
            ref:obj.innerRef, 
            rect:obj.originRect,
            originCenter:obj.originCenter,
            listId: props.id
        }
        for(let i=index;i<temp.length;i++){
            temp[i].center = {x:temp[i].center.x,y:temp[i].center.y + insertObjHeight}
        }
        temp.splice(index,0,n)
        //console.log("after insert index:",index,temp)
        children.current = temp
    }
    const remove= (index:number) => {
        let temp = [...children.current]
        console.log("remove index:",index,temp)
        const removeObjHeight = temp[index].rect.height
        temp.splice(index,1)
        for(index;index<temp.length;index++){
            temp[index].center = {x:temp[index].center.x,y:temp[index].center.y - removeObjHeight}
        }
        //console.log("after remove index:",index,temp)
        children.current = temp
    }
    
    const droppableContext = {
        registerDraggable,
        listRef:listRef,
        listId: props.id,
    }
    return ( 
        <div style={{width:"100px",height:"800px"}}>
            {props.children(droppableContext)}
        </div>
     );
}
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
        setPhaseAnimation,
        setPhaseNone
    }
)
(Droppable);