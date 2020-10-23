import { SET_DRAGGING_OBJ_POS,INCREASE_DRAGGING_OBJ_POS } from "../actionTypes";

const DraggingObjPos = (state = {}, action) => {
  switch (action.type) {
    case SET_DRAGGING_OBJ_POS: {
      return action.payload;
    }
    case INCREASE_DRAGGING_OBJ_POS: {
      const direction = action.payload.y<0? "up"
                        :action.payload.y>0? "down"
                        :"still"
      return {...state, 
        moveDireciton:{direction}, 
        pos:{x:action.payload.x+state.pos.x, y:action.payload.y+state.pos.y}}
    }
    default: {
      return state;
    }
  }
};

export default DraggingObjPos;