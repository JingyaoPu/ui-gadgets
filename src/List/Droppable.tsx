import * as React from 'react';
import { useRef, useState } from 'react';
import { parentPort } from 'worker_threads';
import { classNames } from '../utils/classNames';
import {calCenter,calculateCenterIn} from './DragContext'
export interface DroppableProps {
    
}

const Droppable: React.FC<DroppableProps> = (props:any) => {
    const listRef = useRef<any>()
    const height = useRef<any>()
    const placeHolderIndex = useRef<any>()
    const firstPos = useRef<any>(true)
    const draggableRegistry = useRef<any>([])
    const children:any = useRef()
    const preDragPos:any = useRef(null)
    const registerDraggable = (item:any)=>{
        draggableRegistry.current = [...draggableRegistry.current,item]};
    
    React.useEffect(()=>{
        if(!props.draggingObj){
        props.registerDroppable({id:props.id,listRef:listRef})
        children.current = draggableRegistry.current.map((child:any,index:number)=>
            ({  index:index, 
                originIndex:index, 
                center:calCenter(child.ref.current.getBoundingClientRect()),
                rect: child.ref.current.getBoundingClientRect(),
                ref:child.ref, 
                originCenter:calCenter(child.ref.current.getBoundingClientRect()),
                listId: props.id})
        )
        //const listRect = listRef.current.getBoundingClientRect();
        // children.current.push({
        //     index:children.length, 
        //         originIndex:children.length, 
        //         center:{x:listRect.right-listRect.left,y:listRect.bottom},
        //         originCenter:{x:listRect.right-listRect.left,y:listRect.bottom},
        //         rect:{
        //             top:listRect.bottom,bottom:listRect.bottom,
        //             left:listRect.left,right:listRect.right
        //         }
        // })
        //curChildren.current = children.current
        //console.log(props.id, "children after reg",children.current)
        height.current = listRef.current.getBoundingClientRect().height
        }
    },[props.draggingObj])
    
    
    const getPlaceHolderIndex = ()=>{
        if(!preDragPos.current || !props.draggingPos){
            console.error("previous dragging position or current dragging is null! fail to get Placeholder index!")
        }
        //*classify: move up  ------------------------------------------------------------
        //           move down
        //           not moving
        if(preDragPos.current.y<props.draggingPos.y){ //move down
            //console.log("moving down in",props.id)
            const centerlist = getCenterInDragRect()
            if(centerlist.length>0){
                return centerlist[centerlist.length-1]
            }
        }else if(preDragPos.current.y>props.draggingPos.y){
            //console.log("moving up in",props.id)
            const centerlist = getCenterInDragRect()
            if(centerlist.length>0){
                return centerlist[0]
            }
        }else{
            //console.log("stand still",props.id)
        }
        return -1
        //*classify----------------------------------------------------------------------------
    }

    const getInsertPos = ()=>{
        let min = Infinity
        let index = -1
        const p = {...props.draggingPos}
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

    const insert = (index:number)=>{ // insert to center nearest
        if(!children.current){
            console.error("failed to insert, draggables not been registered")
        }
        const dragRect = props.draggingObj.originRect
        const temp = [...children.current]
        const topbound = temp[0].rect.top
        if(!props.draggingObj) console.error("failed to insert, dragging object is null!")
        const newRect = index==-1?{   
            ...listRef.current.getBoundingClientRect(),
            bottom:listRef.current.getBoundingClientRect().top+dragRect.height}  
        :
        {   top:temp[index].rect.top,
            left:listRef.current.getBoundingClientRect().left,
            right:listRef.current.getBoundingClientRect().right,
            bottom:temp[index].rect.top+dragRect.height}
        temp.forEach((item:any,i:number)=>{
            if(item.index>=index){
                temp[i] = { originIndex:temp[i].originIndex, 
                            ref:temp[i].ref, 
                            originCenter:temp[i].originCenter,
                            listId: temp[i].listId,
                            index:i+1,
                            rect:{...item.rect,
                                    top:item.rect.top+dragRect.height,
                                    bottom: item.rect.bottom+dragRect.height,
                                    left: item.rect.left,
                                    right: item.rect.right},
                            center:{x:item.center.x,y:item.center.y+dragRect.height}
                        }
            }
        })
        const newDraggble = {
            originIndex:props.draggingObj.index, 
            ref:props.draggingObj.innerRef,
            originCenter:calCenter(props.draggingObj.originRect),
            listId:props.draggingObj.listId,
            index:props.draggingObj.listId == props.id? props.draggingObj.index:index, 
            rect:newRect,
            center:calCenter(newRect)}
            
        temp.splice(index,0,newDraggble)
        children.current = temp
        updateChildrenLayout(0,temp.length-1,topbound)
        placeHolderIndex.current = index 
        //console.log(props.id,"insertPos:",index,children.current)
    }
    const  getCenterInDragRect= ()=>{
        const dragRect = props.draggingObj.innerRef.current.getBoundingClientRect()
        let centerInDragRect:any = []  //store indexs
        children.current.forEach((item:any,index:number)=>{
            if(calculateCenterIn(item.center,dragRect)){
                centerInDragRect.push(index)
            }
        }) 
        return centerInDragRect
    }
    const updateChildrenLayout = (start:number,end:number,topbound:number)=>{
        let temp = [...children.current] 
        // do loop to avoid missed update due to low refresh rate
        for(start;start<=end;start++){
            const height = temp[start].rect.bottom-temp[start].rect.top
            temp[start].rect = {
                top:topbound,
                bottom:topbound+height,
                left:temp[start].rect.left,
                right:temp[start].rect.right,
            }
            topbound += height
            temp[start].center = calCenter(temp[start].rect)
        }
        children.current = temp
    }
    const swapDraggable = (sourceIndex:number,targetIndex:number)=>{
        const temp = [...children.current];
        let removed:any;
        [removed]= temp.splice(sourceIndex, 1);
        temp.splice(targetIndex, 0, removed);
        children.current = temp
        
    }
    const moveOutHandler = ()=>{
        let temp = [...children.current]
        let removePos = placeHolderIndex.current
        //console.log(props.id,"removePos:",removePos)
        const upbound = temp[removePos].rect.top
        temp.splice(removePos,1)
        if(temp.length!=0){
            for(let i=removePos;i<children.current.lenght;i++){
                temp[i].index = i;
            }
        }
        children.current = temp
        if(children.current.length!==0 && removePos<temp.length){
            //console.log(removePos,temp.length-1,upbound)
            updateChildrenLayout(removePos,temp.length-1,upbound)
        }
        setHeight()

        placeHolderIndex.current = null
        preDragPos.current=null
        //dragRect = null
        tranformChildren(children.current)
        //console.log("after move out:",props.id,children.current,props.id)
        
    }
    const moveInHandler = ()=>{
        preDragPos.current={...props.draggingPos}
        insert(getInsertPos())
        //console.log("after move in:",props.id,children.current,props.id)
        tranformChildren(children.current)
        setHeight()
    }
    const moveInternalHandler = ()=>{
        const moveTo = getPlaceHolderIndex()
        if(moveTo == -1 || moveTo == children.current.length-1){
            //console.log("not center in rect, not close enought to swap")
            return
        }
        if(placeHolderIndex.current==null){
            console.error("failed try to swap, No placeHolderIndex value")
            return
        }
        const moveFrom = placeHolderIndex.current
        if(moveFrom==moveTo) return
        let [start,end] = moveFrom>moveTo? [moveTo,moveFrom]:[moveFrom,moveTo]
        const topbound = children.current[start].rect.top
        // const topbound = children.current[end].rect.top<children.current[start].rect.top?
        //                     children.current[end].rect.top:
        //                     children.current[start].rect.top
        swapDraggable(moveFrom,moveTo)
        //console.log("before:",children.current) 
        updateChildrenLayout(start,end,topbound) 
        placeHolderIndex.current = moveTo 
        preDragPos.current={...props.draggingPos}
        //console.log("after move:", moveFrom,"to",moveTo,props.id,children.current.map((d:any)=>d.center))
        //"from:",moveFrom,"to:",moveTo,
        //children.current,props.id)
        tranformChildren(children.current)
    }
    React.useEffect(()=>{
        //props.setUpdatingDraggable(true)
        if(props.finish.current) return
        if(props.draggingPos!=null && props.dragCenterInList){
            //console.log("pos",props.draggingPos)
            if(props.id == props.draggingObj.listId){
                if(firstPos.current){//first pos in meaning start dragging inside
                    firstPos.current = false
                    placeHolderIndex.current = props.draggingObj.index
                    preDragPos.current = {...props.draggingPos}
                    console.log(props.id,"unlocked the first mouse down striction")
                }
            }else{
                if(firstPos.current){
                    firstPos.current = false
                    //console.log(props.id,"by passed the first mouse down striction")
                }
            }
            //console.log(props.id,"preDragPos",preDragPos.current,"props.dragCenterInList",props.dragCenterInList)
        }
        
        
        //*classify: inbound : {own draggable, other's draggable}----------------------
        //          outbound : {own draggable, other's draggable}
        //          internal : {up,down}
        if(!preDragPos.current && props.dragCenterInList==props.id) {//inbound
            //console.log("inbound",props.id)
            moveInHandler()
        }else if(preDragPos.current && props.dragCenterInList!=props.id) {//outbound 
            //console.log("outbound",props.id)
            moveOutHandler()
            
        }else if(preDragPos.current && props.dragCenterInList==props.id) {//internal
            //console.log("internal",props.id)
            moveInternalHandler()
        }else{
            //console.log("meaningless render in draggable",props.id)
        }
        //*classify---------------------------------------------------------------------
        //props.setUpdatingDraggable(false)
    },[props.draggingPos])
    
    const pullBack = ()=>{
        const target = children.current[placeHolderIndex.current]
        const originPos = target.originCenter
        const toPos = target.center
        target.ref.current.setAttribute("style", 
            `transform:translate(${toPos.x-originPos.x}px,${toPos.y-originPos.y}px)`)
    }
    React.useEffect(()=>{
        //console.log("pullbackToList",props.pullbackToList)
        if(props.pullbackToList == props.id){
            //props.setFinishDrag(true)
            props.finish.current = true
            pullBack()
            firstPos.current = true 
            props.setReturnRes({listId:props.id,index:placeHolderIndex.current})
            placeHolderIndex.current = null;
            clean()
        }
        else if(props.pullbackToList == -1 && props.draggingObj.listId == props.id){
            
            console.log("moveInTo-",props.draggingObj.index)
            props.finish.current = true
            insert(props.draggingObj.index)
            pullBack()
            console.log("after pullback:",props.id,children.current,props.id)
            tranformChildren(children.current)
            setHeight()
            props.setReturnRes({listId:props.id,index:placeHolderIndex.current})
            firstPos.current = true;
            preDragPos.current = null
            clean()
        }
        if(props.pullbackToList!=null){
            draggableRegistry.current = [];
            children.current = [];
        }
        
    },[props.pullbackToList])

    const clean = ()=>{
        //console.log("clean draggable!!!!!!!--------")
        draggableRegistry.current = [];
        children.current = [];
        firstPos.current = true;
        preDragPos.current = null
    }
    
    const setHeight = ()=>{
        const dragRect = props.draggingObj.originRect
        let h = 0;
        if(children.current.length > draggableRegistry.current.length)
            h=height.current + dragRect.height
        else if(children.current.length < draggableRegistry.current.length)
            h=height.current - dragRect.height
        else 
            h=height.current 
        console.log(children.current.length,draggableRegistry.current.length)
        console.log("dragRect hight", dragRect.height)
        console.log("set hight", h)
        listRef.current.setAttribute("style",`height:${h}px`)
    }

    

    const tranformChildren = (result:any)=>{
        //const dragEleHeight = props.draggingObj.innerRef.current.getBoundingClientRect().height
        console.log("layout to transform:",result,)
        result.forEach((item:any,index:number)=>{
            if(index != placeHolderIndex.current){
                console.log(item)
                item.ref.current.setAttribute("style", 
                `transform:translate(0px,${item.center.y-item.originCenter.y}px)`)
            }
        })
    }
    
    const droppableContext = {
        listStyle: {},
        registerDraggable,
        listRef:listRef,
        listId: props.id,
        onMouseUp: props.onMouseUp
    }
    return ( 
        <div style={{width:"100px",height:"800px",
                     display:"flex",
                     flexDirection:"column",
                     alignItems:"center"
            }}
        >
            {props.children(droppableContext)}
        </div>
     );
}
 
export default Droppable;