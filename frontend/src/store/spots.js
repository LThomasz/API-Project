import { csrfFetch } from "./csrf"

// Action Constants
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS"
const GET_ONE_SPOT = "spots/GET_ONE_SPOT"
const CREATE_SPOT = "spots/CREATE_SPOT"
const ADD_SPOT_IMAGE = "spots/ADD_SPOT_IMAGE"
const UPDATE_SPOT = "spots/UPDATE_SPOT"
const DELETE_SPOT = "spots/DELETE_SPOT"

// Action Creators
const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

const getOneSpot = (spot) => ({
  type: GET_ONE_SPOT,
  spot
});

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot
});

const addSpotImage = (spot) => ({
  type: ADD_SPOT_IMAGE,
  spotImage
})
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
  const res = await csrfFetch('/api/spots', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(getAllSpots(data))
  }

}

export const thunkGetOneSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(getOneSpot(data))
  }
}

export const thunkCreateSpot = (spotData, spotImageData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spotData)
    })
    console.log("create spot res", res);
    // if (res.ok) {
      const data = await res.json();
      console.log("create spot data", data)

      const imageRes = await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotImageData)
      });
      console.log("adding images i think", imageRes)
      dispatch(createSpot(data))

    // }
  } catch (error) {
    console.log(error)
    const data = await error.json();
    return data
  }
}

// Spot Reducer
const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const spotsState = {...state};
        action.spots.Spots.forEach(ele => {
          spotsState[ele.id] = ele
        });
      return spotsState;
    }
    case GET_ONE_SPOT: {
      const spotState = {...state};
        spotState[action.spot.id] = action.spot
      return spotState;
    }
    case CREATE_SPOT: {
      const newState = {...state, [action.spot.id]: action.spot}
      console.log(newState)
      return newState
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
