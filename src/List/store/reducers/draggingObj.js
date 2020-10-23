import { 
    SET_DRAGGING_OBJ,
    SET_DRAGGING_OBJ_IN
 } from "../actionTypes";

const DraggingObj = (state = null, action) => {
  switch (action.type) {
    case SET_DRAGGING_OBJ: {
      return action.payload;
    }
    case SET_DRAGGING_OBJ_IN: {
      return {...state,in:action.payload}
    }
    default: {
      return state;
    }
  }
};

export default DraggingObj;