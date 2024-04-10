import { getAllSpots } from "../util/api";

// ======================== Action Constants ========================
const LOAD_ALL_SPOTS = "spot/getAllSpots"

// ======================== Action Creators ========================
const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        payload: spots
    }
}

// ======================== Thunk Action Creators ========================
export const fetchSpotsThunk = () => async (dispatch) => {
    const res = await getAllSpots()
    dispatch(loadAllSpots(res.Spots));
};

// ======================== Reducer ========================
export const spotReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAD_ALL_SPOTS: {
        const spotsState = {};
        action.payload.forEach((spot) => {
          spotsState[spot.id] = spot;
        });
        return spotsState;
      }
    //   case RECEIVE_REPORT:
    //     return { ...state, [action.report.id]: action.report };
    //   case UPDATE_REPORT:
    //     return { ...state, [action.report.id]: action.report };
    //   case REMOVE_REPORT: {
    //     const newState = { ...state };
    //     delete newState[action.reportId];
    //     return newState;
    //   }
      default:
        return state;
    }
};
