import React, {
    FC,
    OlHTMLAttributes,
    ReactNode,
    Ref,
} from 'react';
import { classNames } from '../utils/classNames';
import '../styles/index.scss';
import BottomPlaceholder from './BottomPlaceHolder';
import ListTitle from './ListTitle';
export interface ListProps extends OlHTMLAttributes<HTMLUListElement>{
    theme: 'primary' | 'default' | 'dark';
    title?: string | undefined;
    id?:string;
    listRef?:React.MutableRefObject<any>;
    registerDraggable?:Function
}

export type ListDataArray = ListItemData[]
export type ListItemData = {
    theme: 'primary' | 'default' | 'dark';
    title?: ReactNode
    id:string;
    content:ReactNode;
} | null

const List: FC<ListProps>  = (props: ListProps) => {
    const {
        theme,
        title,
        listRef
    } = props
    let styleClasses = classNames('patlist',{
        [`list-${theme}`]: true,
    })
    
    return (
        <ul className={styleClasses} ref={listRef}> 
            <ListTitle theme={theme} content={title}/>     
            {props.children} 
            {props.registerDraggable && <BottomPlaceholder register={props.registerDraggable}/>}  
        </ul>
    );
}

export default List;