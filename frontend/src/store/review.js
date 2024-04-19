import { createReviewBasedOnSpotId, getReviewsBySpotId, deleteReview } from "../util/api"

// ======================== Action Constants ========================

const LOAD_REVIEWS_BY_SPOT_ID = "review/loadReviewsBySpotId"
const LOAD_REVIEW = "review/loadReview"
const DELETE_REVIEW = "review/deleteReview"

// ======================== Action Creators ========================

const loadReviewsBySpotId = (reviews) => {
    return {
        type: LOAD_REVIEWS_BY_SPOT_ID,
        payload: reviews
    }
}

const loadReview = (review) => {
  return {
    type: LOAD_REVIEW,
    payload: review
  }
}

const deleteReviewById = (id) => {
  return {
    type: DELETE_REVIEW,
    payload: id
  }
}


// ======================== Thunk Action Creators ========================

export const fetchReviewsBySpotIdThunk = (id) => async (dispatch) => {
    try {
      const res = await getReviewsBySpotId(id)
      dispatch(loadReviewsBySpotId(res))
    } catch (e) {
      throw new Error(e.message)
    }
  }

export const createReviewThunk = (review, id) => async(dispatch) => {
  try {
    const res = await createReviewBasedOnSpotId(review, id)
    const newSpots = await getReviewsBySpotId(id)
    dispatch(loadReviewsBySpotId(newSpots))
  } catch (e) {
    throw new Error(e.message)
  }
}

export const deleteReviewThunk = (id) => async(dispatch) => {
  const res = await deleteReview(id)
  dispatch(deleteReviewById(id))
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
        try{
          const newReviews = {};
          action.payload.Reviews.forEach((review) => {
              newReviews[review.id] = review;
          })
          return { ...state, ...newReviews}
        } catch (e) {
          throw new Error(e.message)
        }
      }
      case LOAD_REVIEW: {
        console.log(action.payload)
        try {
          return { ...state, [action.payload.id]: action.payload}
        } catch (e) {
          throw new Error(e.message)
        }
      }
      case DELETE_REVIEW: {
        const newReviews = { ...state }
        delete newReviews[action.payload]
        return newReviews
      }
      default:
        return state;
    }
};
