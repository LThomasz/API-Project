import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllReviews } from "../../store/reviews";
import './Reviews.css'
import { useEffect } from "react";
function Reviews({spotId, avgRating, numReviews}) {
  const dispatch = useDispatch();
  const reviewObj = useSelector((store) => store.reviews)
  const reviews = Object.values(reviewObj)

  const month = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthNum = date.slice(5, 7);
    return months[monthNum - 1];
  }
  const year = (date) => {
    return date.slice(0, 4)
  }

  useEffect(() => {
    dispatch(thunkGetAllReviews(spotId))
  }, [dispatch, spotId])

  return (

    <div>
      <h2>
        <i className="fa-solid fa-star"></i>
        {typeof avgRating === 'string' ? 'New' : (avgRating % 1 == 0 ? avgRating.toFixed(1) : avgRating)} {typeof numReviews === 'string' ? null : numReviews == 1 ? `· ${numReviews} review` : `· ${numReviews} reviews`}
      </h2>
      <button>Post Your Review</button>
      {reviews.length ? reviews.map((rev) => (
        <div  key={rev.id}>
          <h3>{rev.User.firstName}</h3>
          <p>{month(rev.createdAt)} {year(rev.createdAt)}</p>
          <p>{rev.review}</p>
        </div>
      )) : (
        <h3>Be the first to post a review!</h3>
      )}
    </div>
  )
}

export default Reviews
