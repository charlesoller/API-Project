import { getReviewsBySpotId } from "../util/api"

// ======================== Action Constants ========================

const LOAD_REVIEWS_BY_SPOT_ID = "review/loadReviewsBySpotId"

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

const loadReviewsBySpotId = (reviews) => {
    return {
        type: LOAD_REVIEWS_BY_SPOT_ID,
        payload: reviews
    }
}

// ======================== Thunk Action Creators ========================

export const fetchReviewsBySpotIdThunk = (id) => async (dispatch) => {
    const res = await getReviewsBySpotId(id)
    dispatch(loadReviewsBySpotId(res))
  }

// ======================== Reducer ========================
export const reviewReducer = (state = {}, action) => {
    switch (action.type) {
    //   case LOAD_ALL_SPOTS: {
    //     const spotsState = {};
    //     action.payload.forEach((spot) => {
    //       spotsState[spot.id] = spot;
    //     });
    //     return spotsState;
    //   }
    //   case LOAD_SPOT_BY_ID: {
    //     return { ...state, [action.payload.id]: action.payload}
    //   }
      case LOAD_REVIEWS_BY_SPOT_ID: {
        const newReviews = {};
        action.payload.Reviews.forEach((review) => {
            newReviews[review.id] = review;
        })
        return { ...state, ...newReviews}
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
