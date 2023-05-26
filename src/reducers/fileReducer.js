import { ActionTypes } from '../actions';

const initialState = {
  allFiles: [],
  selectedFile: {},
};

const FileReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.FETCH_FILES:
      return {
        ...state,
        allFiles: action.payload.files,
      };
    case ActionTypes.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.payload,
      };
    default:
      return state;
  }
};

export default FileReducer;
