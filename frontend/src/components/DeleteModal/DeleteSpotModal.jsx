import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import './DeleteSpotModal.css'
function DeleteSpotModal({spotId}) {
const dispatch = useDispatch();
const { closeModal } = useModal();
const deleteSpot = (e) => {
  e.stopPropagation()
  dispatch(thunkDeleteSpot(spotId)).then(closeModal())
}
  return  (
    <div className="delete-spot-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot?</p>
      <button style={{color: "white", backgroundColor: "red"}} onClick={deleteSpot}>
        Yes (Delete Spot)
      </button>
      <button style={{color: "white", backgroundColor: "darkgray"}} onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  )
}

export default DeleteSpotModal;
