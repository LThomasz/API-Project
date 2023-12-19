
// Action Constants
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS"
const CREATE_SPOT = "spots/CREATE_SPOT"
const UPDATE_SPOT = "spots/UPDATE_SPOT"
const DELETE_SPOT = "spots/DELETE_SPOT"

// Action Creators
const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

// const createSpot = (spot) => ({
//   type: CREATE_SPOT,
//   spot
// });

// const updateSpot = (spot) => ({
//   type: UPDATE_SPOT,
//   spot
// });

// const deleteSpot = (spotId) => ({
//   type: DELETE_SPOT,
//   spotId
// });

// Thunks
export const thunkGetAllSpots = (props) => async (dispatch) => {
  const res = await fetch('/api/spots', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(getAllSpots(data))
  }

}

// Spot Reducer
const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const spotsState = {};
        action.spots.Spots.forEach(ele => {
          spotsState[ele.id] = ele
        });
      return spotsState;
    }
    case CREATE_SPOT: {
      return state
    }
    case UPDATE_SPOT: {
      return state
    }
    case DELETE_SPOT: {
      return state
    }
    default:
      return state
  }
}

export default spotReducer;
