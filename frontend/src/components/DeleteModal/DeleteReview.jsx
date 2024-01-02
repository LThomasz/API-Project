import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal";
function DeleteReview({reviewId, spotId, change}) {
  return (
    <OpenModalButton
      buttonText="Delete"
      modalComponent={<DeleteReviewModal reviewId={reviewId} spotId={spotId} change={change}
    />}

    />
  )
}

export default DeleteReview;
