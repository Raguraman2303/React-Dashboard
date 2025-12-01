import { createStore } from "redux";

const initialState = {
  firstName: "Raguraman"
};

function reducer(state = initialState, action) {
  return state; 
}

export default createStore(reducer);
