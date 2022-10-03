import { combineReducers } from "redux";
// reducer imports
import todoData from "./toDoReducers";

const reducers = combineReducers({
  todoData,
});

export default reducers;
