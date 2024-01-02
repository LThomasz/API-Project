import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllReviews } from "../../store/reviews";
import AddReview from "./AddReview";
import DeleteReview from "../DeleteModal/DeleteReview";
import './Reviews.css'
import { useEffect } from "react";
function Reviews({spotId, avgRating, numReviews, spot, change}) {
  const reviewObj = useSelector((store) => store.reviews)
  const user = useSelector((store) => store.session.user)
  const reviews = Object.values(reviewObj)

  const sorted = reviews.sort((review1, review2) => {
    const date1 = new Date(review1.createdAt);
    const date2 = new Date(review2.createdAt)

    if (date1 < date2) {
      return 1
    } else if (date1 > date2) {
      return -1
    } else {
      return 0
    }
  });
  const check = () => {
    if (!user) {
      return false
    }
    if (user.firstName == spot.Owner.firstName) {
      return false
    }
    if(sorted.length) {
      for (let thing of sorted) {
        if (thing.User.firstName == user.firstName) {
          return false
        } else {
          return true
        }
      }
    } else {
      return true
    }
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetAllReviews(spotId))
  }, [dispatch, spotId])
  for (let rev of sorted) {
    if (!rev.User) {
      return null
    }
  }

  const month = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthNum = date.slice(5, 7);
    return months[monthNum - 1];
  }
  const year = (date) => {
    return date.slice(0, 4)
  }

  return   (
    <div>
      <h2>
        <i className="fa-solid fa-star"></i>
        {typeof avgRating === 'string' ? 'New' : (avgRating % 1 == 0 ? avgRating.toFixed(1) : avgRating)} {typeof numReviews === 'string' ? null : numReviews == 1 ? `· ${numReviews} review` : `· ${numReviews} reviews`}
      </h2>
      {check() && <div>
        <AddReview spotId={spotId} change={change}/>
      </div>}
      {sorted.length ? sorted.map((rev) => (

        <div  key={rev.id}>
          <h3>{rev.User.firstName}</h3>
          <p>{month(rev.createdAt)} {year(rev.createdAt)}</p>
          <p>{rev.review}</p>
          { user && user.firstName == rev.User.firstName && <div className="delete-button">
            <DeleteReview reviewId={rev.id} spotId={spotId} change={change}/>
          </div>}
        </div>
      )) : (
        <h3>Be the first to post a review!</h3>
      )}
    </div>
  )
}

export default Reviews
