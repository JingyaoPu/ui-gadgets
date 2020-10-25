import * as React from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';
import { calCenter } from './DragContext'
import { } from './store/action'
import { PhaseTypes } from './store/reducers/phase'
import {
    setPhaseAnimation,
    setPhaseNone,
    setReadyToDrag
} from './store/action'
const Droppable: React.FC<any> = (props: any) => {
    const listRef = useRef<any>()
    const height = useRef<any>()
    const placeHolderIndex = useRef<any>()
    const draggableRegistry = useRef<any>([])
    const children: any = useRef()
    const registerDraggable = (item: any) => {
        draggableRegistry.current = [...draggableRegistry.current, item]
    };
    const {
        DraggingObjPos,
        DraggingObj,
        Phase,
        setPhaseAnimation,
        setPhaseNone,
        setReadyToDrag
    } = props
    React.useEffect(() => {
        props.registerDroppable({
            id: props.id,
            listRef: listRef,
            rect: listRef.current.getBoundingClientRect()
        })
    }, [])
    React.useEffect(() => {
        console.log(Phase)
        if (Phase == PhaseTypes.none) {
            console.log("clean style")
            draggableRegistry.current.forEach((e: any) => {
                e.ref.current.removeAttribute("style")
            })
            listRef.current.removeAttribute("style")
            height.current = listRef.current.getBoundingClientRect().height
            setTimeout(() => {
                console.log("create children")
                children.current = draggableRegistry.current.map((child: any, index: number) =>
                    ({
                        index: index,
                        originIndex: index,
                        center: calCenter(child.ref.current.getBoundingClientRect()),
                        rect: child.ref.current.getBoundingClientRect(),
                        ref: child.ref,
                        originCenter: calCenter(child.ref.current.getBoundingClientRect()),
                        listId: props.id
                    }))
                console.log("registry:", children.current.map((e: any) => e.center))
                if (props.droppableRegistry.current[props.droppableRegistry.current.length - 1].id == props.id) {
                    setReadyToDrag()
                }
            }, 300)

        }
        else if (Phase == PhaseTypes.mouseDown && DraggingObj.listId == props.id) {
            remove(DraggingObj.index)
            placeHolderIndex.current = DraggingObj.index
        }
        else if (Phase == PhaseTypes.dropping) {
            setPhaseAnimation()
            if (DraggingObj.in == props.id) {
                const to = children.current[placeHolderIndex.current].center
                DraggingObj.innerRef.current.setAttribute("style",
                    `transform:translate(
                        ${to.x - DraggingObj.originCenter.x}px,
                        ${to.y - DraggingObj.originCenter.y}px);
                        z-index:99
                    `)
            }
            setTimeout(() => {
                draggableRegistry.current = []
                if (props.id == DraggingObj.in) {
                    props.changeHandler && props.changeHandler({
                        from: {
                            listId: DraggingObj.listId,
                            index: DraggingObj.index
                        },
                        to: {
                            listId: props.id,
                            index: placeHolderIndex.current
                        }
                    })
                }
                if (props.droppableRegistry.current[props.droppableRegistry.current.length - 1].id == props.id) {
                    if (DraggingObj.in == null) {
                        props.changeHandler && props.changeHandler({
                            from: {
                                listId: DraggingObj.listId,
                                index: DraggingObj.index
                            },
                            to: {
                                listId: null,
                                index: null
                            }
                        })
                    }
                    setPhaseNone()
                }
            }, 300)
        }
    }, [Phase])

    React.useEffect(() => {
        if (Phase == PhaseTypes.dragging) {
            let newHeight
            if (DraggingObj.in == props.id) {
                const holderIndex = getInsertPos(DraggingObjPos.pos)
                if (placeHolderIndex.current != holderIndex) {
                    placeHolderIndex.current = holderIndex
                    pushDown(holderIndex, DraggingObj.originRect.height)
                    newHeight = DraggingObj.listId == props.id ?
                        height.current : height.current + DraggingObj.originRect.height
                    listRef.current.setAttribute("style", `height:${newHeight}px`)
                }
            } else {
                if (placeHolderIndex.current != -1) {
                    placeHolderIndex.current = -1
                    pushback()
                    newHeight = DraggingObj.listId == props.id ?
                        height.current - DraggingObj.originRect.height : height.current
                    listRef.current.setAttribute("style", `height:${newHeight}px`)
                }
            }
        }
    }, [DraggingObjPos])

    const pushback = () => {
        console.log("push back")
        children.current.forEach((item: any, i: number) => {
            item.ref.current.setAttribute("style",
                `transform:translate(0px,${item.center.y - item.originCenter.y}px)`)
        })
    }
    const pushDown = (start: number, height: number) => {
        console.log("push Down from", start)
        children.current.forEach((item: any, i: number) => {
            if (i < start) {
                item.ref.current.setAttribute("style",
                    `transform:translate(0px,${item.center.y - item.originCenter.y}px)`)
            } else {
                item.ref.current.setAttribute("style",
                    `transform:translate(0px,${item.center.y - item.originCenter.y + height}px)`)
            }
        })
    }
    const getInsertPos = (insertObjCenter: { x: number, y: number }) => {
        let min = Infinity
        let index = -1
        const p = insertObjCenter
        children.current.forEach((item: any, i: number) => {
            const { x, y } = item.center
            const distance = Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2)
            if (distance < min) {
                min = distance;
                index = i
            }
        })
        return index
    }
    const insert = (index: number, obj: any) => {
        let temp = [...children.current]
        const insertObjHeight = obj.originRect.height
        const n = {
            index: index,
            originIndex: index,
            center: obj.center,
            ref: obj.innerRef,
            rect: obj.originRect,
            originCenter: obj.originCenter,
            listId: props.id
        }
        for (let i = index; i < temp.length; i++) {
            temp[i].center = { x: temp[i].center.x, y: temp[i].center.y + insertObjHeight }
        }
        temp.splice(index, 0, n)
        children.current = temp
        console.log("after insert index:", index, children.current.map((e: any) => e.center))
    }
    const remove = (index: number) => {
        const removeObjHeight = children.current[index].rect.height
        children.current.splice(index, 1)
        for (let i = index; i < children.current.length; i++) {
            children.current[i].center = { x: children.current[i].center.x, y: children.current[i].center.y - removeObjHeight }
        }
        console.log("after remove index:", index, children.current)
    }

    const droppableContext = {
        registerDraggable,
        listRef: listRef,
        listId: props.id,
    }
    return (
        <div style={{ width: "100px", height: "800px" }}>
            {props.children(droppableContext)}
        </div>
    );
}
const mapStateToProps = (state: any) => {
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
        setPhaseNone,
        setReadyToDrag
    }
)
    (Droppable);