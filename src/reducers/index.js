import { combineReducers } from '@reduxjs/toolkit';

import UserReducer from './userReducer';
import FileReducer from './fileReducer';

const rootReducer = combineReducers({
  user: UserReducer,
  files: FileReducer,
});

export default rootReducer;
