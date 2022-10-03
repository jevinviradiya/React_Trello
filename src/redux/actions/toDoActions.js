import axios from "axios";
import { TODO_FAILED, TODO_LOADING, TODO_SUCCESS } from "../types";

export const getTrelloData = () => {
  return async (dispatch) => {
    dispatch({
      type: TODO_LOADING,
      payload: true,
    });
    try {
      const res = await axios.get(`http://localhost:3000/trellodata`);

      if (res.status === 200) {
        dispatch({
          type: TODO_SUCCESS,
          payload: res,
        });
      } else {
        dispatch({
          type: TODO_FAILED,
          payload: "Something Went Wrong",
        });
      }
    } catch (error) {
      dispatch({
        type: TODO_FAILED,
        payload: error,
      });
    }
  };
};

export const updateToDo = (todoObj) => {
  return async (dispatch) => {
    console.log("data update here action",todoObj);
    await axios.put(`http://localhost:3000/trellodata/trelloDataid`, todoObj);
  };
};
