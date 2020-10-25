import * as actionTypes from "../actionTypes";

export const PhaseTypes = {
    animation: "ANIMATION", 
    none: "NONE", 
    dragging: "DRAGGING",
    mouseDown:"MOUSE_DOWN",
    dropping:"DROPPING",
    readyToDrag:"READY_TO_DRAG"
}

const Phase = (state = PhaseTypes.none, action) => {
  switch (action.type) {
    case actionTypes.SET_ANIMATION: {
        return PhaseTypes.animation;
    }
    case actionTypes.SET_NONE:{
        return PhaseTypes.none;
    }
    case actionTypes.SET_DRAGGING:{
        return PhaseTypes.dragging;
    }
    case actionTypes.SET_MOUSE_DOWN: {
        return PhaseTypes.mouseDown;
    }
    case actionTypes.SET_DROPPING: {
        return PhaseTypes.dropping;
    }
    case actionTypes.SET_READY_TO_DRAG: {
        return PhaseTypes.readyToDrag;
    }
    default: {
      return state;
    }
  }
};

export default Phase;