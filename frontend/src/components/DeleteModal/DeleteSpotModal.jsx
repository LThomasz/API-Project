import { thunkDeleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";


function DeleteSpotModal({spotId}) {
const dispatch = useDispatch();
const deleteSpot = (e) => {
  e.stopPropagation()
  dispatch(thunkDeleteSpot(spotId))
}
  return  (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot?</p>
      <button style={{color: "white", backgroundColor: "red"}} onClick={deleteSpot}>
        Yes
      </button>
      <button style={{color: "white", backgroundColor: "darkgray"}}>
        No
      </button>
    </div>
  )
}

export default DeleteSpotModal;
