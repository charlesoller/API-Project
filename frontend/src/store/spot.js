import { getAllSpots, getSpotDetailsById } from "../util/api";

// ======================== Action Constants ========================
const LOAD_ALL_SPOTS = "spot/loadAllSpots"
const LOAD_SPOT_BY_ID = "spot/loadSpotById"

// ======================== Action Creators ========================
const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        payload: spots
    }
}

const loadSpotById = (spot) => {
  return {
    type: LOAD_SPOT_BY_ID,
    payload: spot
  }
}

// ======================== Thunk Action Creators ========================
export const fetchSpotsThunk = () => async (dispatch) => {
    const res = await getAllSpots()
    dispatch(loadAllSpots(res.Spots));
};

export const fetchSpotDetailsThunk = (id) => async (dispatch) => {
  const res = await getSpotDetailsById(id)
  dispatch(loadSpotById(res))
}

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
      case LOAD_SPOT_BY_ID: {
        return { ...state, [action.payload.id]: action.payload}
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
