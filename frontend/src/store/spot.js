import { createImageBasedOnSpotId, createSpot, deleteSpot, getAllSpots, getCurrentUserSpots, getSpotDetailsById, updateSpot } from "../util/api";

// ======================== Action Constants ========================
const LOAD_ALL_SPOTS = "spot/loadAllSpots"
const LOAD_SPOT_BY_ID = "spot/loadSpotById"
const LOAD_SPOTS = "spot/loadSpots"
const DELETE_SPOT = "spot/deleteSpot"
// const RECEIVE_SPOT = "spot/receiveSpot"

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

const loadSpots = spots => {
  return {
    type: LOAD_SPOTS,
    payload: spots
  }
}

const deleteSpotById = (id) => {
  return {
    type: DELETE_SPOT,
    payload: id
  }
}

// const receiveSpot = (spot) => {
//   return {
//     type: RECEIVE_SPOT,
//     payload: spot
//   }
// }

// ======================== Thunk Action Creators ========================
export const fetchSpotsThunk = () => async (dispatch) => {
    const res = await getAllSpots()
    dispatch(loadAllSpots(res.Spots));
};

export const fetchSpotDetailsThunk = (id) => async (dispatch) => {
  const res = await getSpotDetailsById(id)
  dispatch(loadSpotById(res))
}

export const fetchCurrentUserSpotsThunk = () => async (dispatch) => {
  const res = await getCurrentUserSpots()
  dispatch(loadSpots(res.Spots))
}

export const createSpotThunk = (spot, imgs, navigate) => async(dispatch) => {
  // console.log("IN THUNK")
  const res = await createSpot(spot);

  // After creating the spot, we create the images for the spot
  const images = await Promise.all(imgs.map(async (img) => await createImageBasedOnSpotId(img, res.id)))

  dispatch(loadSpotById(res))
  // The spot as well as the preview images url is passed along
  navigate(`/spots/${res.id}`)
}

export const updateSpotThunk = (spot, id, navigate) => async(dispatch) => {
  const res = await updateSpot(spot, id)
  dispatch(loadSpotById(res))
  navigate(`/spots/${res.id}`)
}

export const deleteSpotThunk = (id) => async(dispatch) => {
  const res = await deleteSpot(id)
  dispatch(deleteSpotById(id))
}

// export const createReportThunk = (report, navigate) => async (dispatch) => {
//   const res = await fetch("/api/reports", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(report)
//   })
//   const { id } = await res.json()
//   if(res.ok){
//     navigate(`/reports/${id}`)
//   }
// }

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
      case LOAD_SPOTS: {
        const newSpots = {}
        action.payload.forEach((spot) => {
          newSpots[spot.id] = spot;
        })
        return { ...state, ...newSpots }
      }
      case DELETE_SPOT: {
        const newSpots = { ...state }
        delete newSpots[action.payload]
        return newSpots
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
