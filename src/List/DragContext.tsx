import React, {
    FC,
    Fragment,
    MouseEvent,
    MutableRefObject,
    OlHTMLAttributes,
    PropsWithChildren,
    useEffect,
    useRef,
    useState
} from 'react';
import ReactDOM from 'react-dom';
import Draggable from './Draggable'

const DragContext: FC<any> = (props) => {
    //const [draggFrom,setDraggFrom] = useState(null)
    //const [hoverAt, setHoverAt] = useState(null)
    const [draggingObj,setDraggingObj] = useState<any>(null)
    const [droppingObj,setDroppingObj] = useState<any>(null)
    const [draggingPos,setDraggingPos] = useState<any>(null)
    const [dragCenterInList,setDragCenterInList] = useState<any>(null)
    const [pullbackToList,setPullbackToList] = useState<any>(null)
    const [mouseP,setMouseP] = useState<any>(null)
    const [returnRes,setReturnRes] = useState<any>(null)
    //const [finishDrag,setFinishDrag]  = useState<boolean>(false)
    const finish = useRef<any>(null)
    const mousePos:any = useRef()
    const droppableRegistry:any = useRef([])
    const registerDroppable = (content:any)=>{
        droppableRegistry.current = [...droppableRegistry.current,content];
    }
    

    const onDragHandler = (pos:any)=>{
        //if(updatingDraggable) return
        //console.log("onDragHandler,draggingObj ",draggingObj)
        draggingObj.innerRef.current.setAttribute("style",`
        transform:translate(${pos.x-draggingObj.startPos.x}px,
            ${pos.y-draggingObj.startPos.y}px);z-index:99
        `)
        const offSet = draggingObj.startPos.offset;
        const bound = draggingObj.innerRef.current.getBoundingClientRect();
        const cpos =  {x:pos.x-offSet.x+bound.width/2,
                       y:pos.y-offSet.y+ bound.height/2}
        setDraggingPos(cpos)
        setDragCenterInList(calPosInlist(cpos))
    }


    const calPosInlist = (pos:any)=>{
        let posIn:any = null
        droppableRegistry.current.forEach((d:any)=>{
            if(calculateCenterIn(pos,d.listRef.current.getBoundingClientRect())){
                posIn = d.id
            }  
        })
        return posIn
    }

    const mouseMoveHandler = (event:any)=>{
        mousePos.current = {x:event.pageX,y:event.pageY}
        setMouseP({x:event.pageX,y:event.pageY})
    }
    
    useEffect(()=>{
        document.addEventListener('mousemove',(event)=>mouseMoveHandler(event))
        return document.removeEventListener('mousemove',mouseMoveHandler)
    },[])

    useEffect(()=>{
        if(returnRes){
            //console.log("finishDrag!!!!!!!!!!!!!!!",draggingObj)
            setReturnRes(null)
            setDraggingPos(null);
            setDraggingObj(null);
            setDroppingObj(null);
            setDragCenterInList(null);
            setPullbackToList(null);
            droppableRegistry.current = []
            props.changeHandler(
                {from:{listId:draggingObj.listId,index:draggingObj.index},
                to:returnRes})
            //ReactDOM.unmountComponentAtNode(document.getElementsByTagName('div'))
    }
    },[returnRes])
    
    useEffect(()=>{
        //console.log("mousePos change:",draggingObj,finish.current )
        if(draggingObj){
           if(!finish.current){
            //console.log("onDragHandler Called!")
            onDragHandler(mouseP)
           }
        }
    },[mouseP])
    //const refresher:any= useRef()
    // useEffect(()=>{
    //     if(draggingObj){
    //         //onDragHandler(mousePos.current)
    //         refresher.current = setInterval(()=>onDragHandler(mousePos.current),0)
    //     }else{
    //         clearInterval(refresher.current);
    //     }
    //     //if(draggingObj)dragging.current=true
    // },[draggingObj])

    useEffect(()=>{
        if(!droppingObj) return
        //console.log("drop obj:",droppingObj,"in list:",calPosInlist(draggingPos))
        const endInList = calPosInlist(draggingPos)
        setPullbackToList(endInList? endInList:-1)
        
    },[droppingObj])


    const context = {
        registerDroppable,
        //draggFrom,setDraggFrom,
        //hoverAt, setHoverAt,
        draggingObj,setDraggingObj,
        droppingObj,setDroppingObj,
        draggingPos,setDraggingPos,
        dragCenterInList,setDragCenterInList,
        returnRes,setReturnRes,
        pullbackToList,setPullbackToList,
        //finishDrag,setFinishDrag,
        finish,
        onMouseUp:(event:any) => {
            //console.log("mouseUp target:", event.target)
            setDroppingObj({
                x:event.pageX,
                y:event.pageY})
        },
    }
    return ( 
    <Fragment>
        {props.children(context) }  
    </Fragment>
    );
}
 
export default DragContext;
export const calCenter=(rect:any)=>{
    return ({x:(rect.left+rect.right)/2, y:(rect.top+rect.bottom)/2})
}
export const calculateCenterIn = (center:{x:number,y:number}, rect:any)=>{
    return !(center.x < rect.left || 
        center.x > rect.right || 
        center.y < rect.top || 
        center.y > rect.bottom)
}