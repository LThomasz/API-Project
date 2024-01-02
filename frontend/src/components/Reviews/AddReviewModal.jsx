import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkAddReview, thunkGetAllReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import './AddReviewModal.css'

function AddReviewModal({spotId, change}) {
  const [comments, setComments] = useState('')
  const [activeRating, setActiveRating] = useState(0);
  const [rating, setRating] = useState(0);

  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const disabled = false;
  const onChange = (number) => {
    setRating(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = {
      stars: rating,
      review: comments
    }
    const data = await dispatch(thunkAddReview(review, spotId))
    console.log("this is the frontend received data", data)
    await dispatch(thunkGetAllReviews(spotId)).then(closeModal())
    change()

  }
  // try get all reviews
  return (
    <div className="add-review-container">
      <form onSubmit={handleSubmit} className="new-review-form">
        <div className="review-header">
          <h1>How was your stay?</h1>
        </div>
        <div className="review-section-one">
          <label htmlFor="comments"></label>
          <textarea
            id="comments"
            value={comments}
            placeholder="Leave your review here..."
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>
        <div className="review-section-two">
          <div className="rating-input" id="rating-input">
            <div className={activeRating > 0 ? `filled` : `empty`}
              onClick={() => onChange(1)}
            >
              <i className="fa fa-star"
                onMouseEnter={() => disabled || setActiveRating(1)}
                onMouseLeave={() => disabled || setActiveRating(rating)}
              ></i>
            </div>
            <div className={activeRating > 1 ? `filled` : `empty`}
              onClick={() => onChange(2)}
            >
              <i className="fa fa-star"
                onMouseEnter={() => disabled || setActiveRating(2)}
                onMouseLeave={() => disabled || setActiveRating(rating)}
              ></i>
            </div>
            <div className={activeRating > 2 ? `filled` : `empty`}
              onClick={() => onChange(3)}
            >
              <i className="fa fa-star"
                onMouseEnter={() => disabled || setActiveRating(3)}
                onMouseLeave={() => disabled || setActiveRating(rating)}
              ></i>
            </div>
            <div className={activeRating > 3 ? `filled` : `empty`}
              onClick={() => onChange(4)}
            >
              <i className="fa fa-star"
                onMouseEnter={() => disabled || setActiveRating(4)}
                onMouseLeave={() => disabled || setActiveRating(rating)}
              ></i>
            </div>
            <div className={activeRating > 4 ? `filled` : `empty`}
              onClick={() => onChange(5)}
            >
              <i className="fa fa-star"
                onMouseEnter={() => disabled || setActiveRating(5)}
                onMouseLeave={() => disabled || setActiveRating(rating)}
              ></i>
            </div>
            <label htmlFor="rating-input">Stars</label>
          </div>
        </div>
        <button
          type="submit"
          disabled={comments.length < 10 || rating < 1}
        >Submit Your Review</button>
      </form>
    </div>
  )
}

export default AddReviewModal;
