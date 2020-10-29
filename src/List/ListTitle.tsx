import * as React from 'react';
import { FC } from 'react';
import { classNames } from '../utils/classNames';
import '../styles/index.scss';
export interface ListTitleProps extends React.HTMLAttributes<HTMLDivElement>{
    theme?: 'primary' | 'default' | 'dark';
    content: React.ReactNode
}
const listTitle: FC<ListTitleProps>  = (props: any) => {
    const {
        theme,
        content
    } = props
    let styleClasses = classNames('patlist-title',{
        [`list-title-default`]: !theme,
        [`list-title-${theme}`]: !!theme,
    })
    return(
        <div className = {styleClasses}>
            {content}
        </div>
    )
}

export default listTitle