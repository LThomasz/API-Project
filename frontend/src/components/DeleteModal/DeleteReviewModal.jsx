import { useModal } from "../../context/Modal";
import { thunkDeleteReview, thunkGetAllReviews } from "../../store/reviews";
import { useDispatch } from "react-redux";
import './DeleteReviewModal.css'
function DeleteReviewModal({reviewId, spotId, change}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const deleteReview = async (e) => {
    e.stopPropagation()
    await dispatch(thunkDeleteReview(reviewId))
    await dispatch(thunkGetAllReviews(spotId)).then(closeModal())
    change()
  }
  return  (
    <div className="delete-review-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this review?</p>
      <button style={{color: "white", backgroundColor: "red"}} onClick={deleteReview}>
        Yes (Delete Review)
      </button>
      <button style={{color: "white", backgroundColor: "darkgray"}} onClick={closeModal}>
        No (Keep Review)
      </button>
    </div>
  )
}

export default DeleteReviewModal;
