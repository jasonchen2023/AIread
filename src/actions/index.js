// keys for actiontypes
export const ActionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  SET_USER: 'SET_USER',
  HIDE_USER: 'HIDE_USER',
  FETCH_FILES: 'FETCH_FILES',
  SELECT_FILE: 'SELECT_FILE',
};

export function increment() {
  return {
    type: ActionTypes.INCREMENT,
    payload: null,
  };
}

export function decrement() {
  return {
    type: ActionTypes.DECREMENT,
    payload: null,
  };
}

export function selectFile(fileName, fileUrl) {
  console.log(fileName, fileUrl);
  return {
    type: ActionTypes.SELECT_FILE,
    payload: { name: fileName, url: fileUrl },
  };
}
