import { csrfFetch } from "./csrf"

// Action Constants
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS"
const GET_ONE_SPOT = "spots/GET_ONE_SPOT"
const CREATE_SPOT = "spots/CREATE_SPOT"
const GET_USER_SPOTS ="spots/GET_USER_SPOTS"
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

const getUserSpots = (spot) => ({
  type: GET_USER_SPOTS,
  spot
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot
});

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId
});

// Thunks
export const thunkGetAllSpots = () => async (dispatch) => {
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
      const data = await res.json();
      console.log("create spot data", data)

      console.log("This is the spotImageData", spotImageData)
      for (let obj of spotImageData) {
        if (obj.url) {
          console.log("image data", obj)
          const imageRes = await csrfFetch(`/api/spots/${data.id}/images`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obj)
          });
          console.log("adding images i think", imageRes)
          await dispatch(createSpot(data))
        }
      }
      return data.id;
  } catch (error) {
    console.log(error)
    const data = await error.json();
    return data
  }
}

export const thunkUpdateSpot = (spotData, spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spotData)
    })
    console.log("update spot res", res);
    // if (res.ok) {
      const data = await res.json();
      dispatch(updateSpot(data))
      return data.id;
  } catch (error) {
    const data = await error.json();
    return data
  }
}

export const thunkGetUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (res.ok) {
    const data = await res.json();
    dispatch(getUserSpots(data))
  }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (res.ok) {
    const data = await res.json();
    console.log("Delete spot data", data)
    dispatch(deleteSpot(spotId))
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
    case GET_ONE_SPOT: {
      const spotState = {};
        spotState[action.spot.id] = action.spot
      return spotState;
    }
    case CREATE_SPOT: {
      const newState = {...state, [action.spot.id]: action.spot}
      return newState
    }
    case GET_USER_SPOTS: {
      const newState = {};
      if (action.spot.message) {
        return {}
      } else {
        action.spot.Spots.forEach(ele => {
          newState[ele.id] = ele
        })
      }
      return newState
    }
    case UPDATE_SPOT: {
      const newState = {...state, [action.spot.id]: action.spot};
      return newState
    }
    case DELETE_SPOT: {
      const newState = {...state};
      delete newState[action.spotId]
      return newState
    }
    default:
      return state
  }
}

export default spotReducer;
