import React, {
    ElementRef,
    FC,
    MouseEvent,
    OlHTMLAttributes,
    Ref,
    useRef,
    useState,
} from 'react';
import { classNames } from '../utils/classNames';
import Draggable from './Draggable';


export interface ListProps extends OlHTMLAttributes<HTMLOListElement>{

}

export type ListDataArray = ListItemData[]
export type ListItemData = {
    id:string;
    content:any;
} | null

const List: FC<ListProps>  = (props: any) => {
    let styleClasses = classNames('patlist');
    //console.log(props)
    return (
        <div className={styleClasses} ref={props.listRef} onMouseUp={props.onMouseUp}>
            {typeof props.children == "function" ?
                props.children({listRef:props.listRef}) :
                props.children
            }
        </div>
    );
}
 
export default List;