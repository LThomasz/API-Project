import { csrfFetch } from "./csrf"

// Action Constants
const GET_ALL_REVIEWS = "reviews/GET_ALL_REVIEWS"
const ADD_REVIEW = "reviews/ADD_REVIEW"
const DELETE_REVIEW = "reviews/DELETE_REVIEW"
// Action Creators
const getAllReviews = (reviews) => ({
  type: GET_ALL_REVIEWS,
  reviews
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
})
// Thunks
export const thunkGetAllReviews = (spotId) => async (dispatch) => {

  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(getAllReviews(data))
  }
}

export const thunkAddReview = (review, spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(review)
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addReview(data));
      return data;
    }
  } catch (error) {
    console.log(error);
    const data = await error.json();
    return data;
  }
}

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  })
  if (res.ok) {
    const data = await res.json();
    dispatch(deleteReview(reviewId));
    return data;
  }
}
const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_REVIEWS: {
      const reviewState = {};
        if (typeof action.reviews.Reviews !== "string") {
          action.reviews.Reviews.forEach(ele => {
            reviewState[ele.id] = ele
          });
          return reviewState;
        } else {
          return {};
        }
    }
    case ADD_REVIEW: {
      const newState = {...state, [action.review.id]: action.review};
      return newState;
    }
    case DELETE_REVIEW: {
      const newState = {...state};
      console.log(action)
      delete newState[action.reviewId]
      return newState
    }
    default:
      return state
  }
}

export default reviewReducer;
