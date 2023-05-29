import { ActionTypes } from '../actions';

const initialState = {
  allFiles: [],
  selectedFile: {},
  showPDF: false,
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
    case ActionTypes.SHOW_PDF:
      return {
        ...state,
        showPDF: action.payload.showPDF,
      };
    default:
      return state;
  }
};

export default FileReducer;
