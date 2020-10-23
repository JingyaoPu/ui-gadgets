import React, {
    FC,
    OlHTMLAttributes,
} from 'react';
import { classNames } from '../utils/classNames';
import '../styles/index.scss';
import BottomPlaceholder from './BottomPlaceHolder';

export interface ListProps extends OlHTMLAttributes<HTMLOListElement>{

}

export type ListDataArray = ListItemData[]
export type ListItemData = {
    id:string;
    content:any;
} | null

const List: FC<ListProps>  = (props: any) => {
    let styleClasses = classNames('patlist')
    return (
        <div className={styleClasses} ref={props.listRef}>      
            {props.children} 
            <BottomPlaceholder register={props.registerDraggable}/>  
        </div>
    );
}
 
export default List;