import { ActionTypes } from '../actions';

const initialState = {
  email: '',
  displayName: '',
  age: 0,
};

const UserReducer = (state = initialState, action = {}) => {
  console.log('Action', action);
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state, email: action.payload.email, displayName: action.payload.displayName, age: action.payload.age,
      };
    case ActionTypes.HIDE_USER:
      return {
        ...state, email: '', displayName: '', age: 0,
      };
    default:
      return state;
  }
};

export default UserReducer;
