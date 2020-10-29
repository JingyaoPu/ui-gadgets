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
        register,
        Phase
    }=props
    React.useEffect(()=>{
        if(Phase === PhaseTypes.none){
            register({ref:ref})
        }
    },[Phase,register]) 
    let styleClasses = classNames('bottom-placeholder')
    return ( 
        <li className={styleClasses} key="placeholder" ref={ref}></li>
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