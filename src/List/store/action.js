import * as actions from "./actionTypes";

//phase
export const setPhaseNone = ()=> ({type:actions.SET_NONE})
export const setPhaseMouseDown = ()=> ({type:actions.SET_MOUSE_DOWN})
export const setPhaseDragging = ()=> ({type:actions.SET_DRAGGING})
export const setPhaseDropping = ()=> ({type:actions.SET_DROPPING})
export const setPhaseAnimation = ()=> ({type:actions.SET_ANIMATION})
export const setReadyToDrag = ()=> ({type:actions.SET_READY_TO_DRAG})

export const setDraggingPos = pos => ({
  type: actions.SET_DRAGGING_OBJ_POS,
  payload: pos
});

export const increaseDraggingPos = increment =>({
    type: actions.INCREASE_DRAGGING_OBJ_POS,
    payload: increment
})

export const setDraggingObjIn = id => ({
    type: actions.SET_DRAGGING_OBJ_IN,
    payload: id
  });

export const setDraggingObj = obj =>({
    type:actions.SET_DRAGGING_OBJ,
    payload: obj
})
