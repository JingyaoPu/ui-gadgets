import { combineReducers } from "redux";
import DraggingObjPos from "./draggingCenter";
import DraggingObj from "./draggingObj";
import Phase from "./phase" 

export default combineReducers({ 
    DraggingObjPos,
    DraggingObj,
    Phase,
});