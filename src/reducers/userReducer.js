import { ActionTypes } from '../actions';

const initialState = {
  email: '',
  displayName: '',
  age: 0,
  fieldOfInterest: '',
};

const UserReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state, email: action.payload.email, displayName: action.payload.displayName, age: action.payload.age, fieldOfInterest: action.payload.fieldOfInterest,
      };
    case ActionTypes.HIDE_USER:
      return {
        ...state, email: '', displayName: '', age: 0, fieldOfInterest: '',
      };
    case ActionTypes.UPDATE_PROFILE: {
      const newProfile = {};
      Object.keys(state).forEach((key, index) => {
        if (key in action.payload) {
          newProfile[key] = action.payload[key];
        } else {
          newProfile[key] = state[key];
        }
      });
      return newProfile;
    }

    default:
      return state;
  }
};

export default UserReducer;
