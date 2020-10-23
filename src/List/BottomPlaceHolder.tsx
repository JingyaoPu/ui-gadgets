import * as React from 'react';
import { useRef } from 'react';
export interface BottomPlaceholderProps {
    register: Function
}
 
const BottomPlaceholder: React.FC<BottomPlaceholderProps> = (props) => {
    const ref= useRef<any>()

    React.useEffect(()=>props.register({ref:ref}),[]) 
    return ( 
        <div ref={ref}>123</div>
    );
}
 
export default BottomPlaceholder;