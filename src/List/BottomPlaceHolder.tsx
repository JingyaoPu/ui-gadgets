import * as React from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';
import {PhaseTypes} from './store/reducers/phase'
import { classNames } from '../utils/classNames';
import '../styles/index.scss';
export interface BottomPlaceholderProps {
    register: Function
    Phase?: any
}
 
const BottomPlaceholder: React.FC<BottomPlaceholderProps> = (props) => {
    const ref= useRef<any>()
    const{
        Phase
    }=props
    React.useEffect(()=>{
        if(Phase == PhaseTypes.none){
            props.register({ref:ref})
        }
    },[Phase]) 
    let styleClasses = classNames('bottom-placeholder')
    return ( 
        <div className={styleClasses} key="placeholder" ref={ref}></div>
    );
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
export default connect(mapStateToProps,null)(BottomPlaceholder);