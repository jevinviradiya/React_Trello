import { TODO_ADD, TODO_FAILED, TODO_LOADING, TODO_SUCCESS } from "../types";

const initState = {
  loading: true,
  data: [],
  error: "",
};
const todoData = (state = initState, action) => {
  switch (action.type) {
    case TODO_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TODO_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case TODO_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default todoData;
