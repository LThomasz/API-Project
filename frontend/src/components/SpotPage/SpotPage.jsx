import { useDispatch, useSelector } from "react-redux";
import { thunkGetOneSpot } from "../../store/spots";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Reviews from "../Reviews/Reviews";
import Reserve from "../ReserveModal/Reserve";
import './SpotPage.css'
function SpotPage() {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const {spotId} = useParams();
  useEffect(() => {
    dispatch(thunkGetOneSpot(spotId))
  }, [dispatch, spotId, state])

  function changeState() {
    setState(!state);
  }
  const spotObj = useSelector((store) => store.spots);

  const spot = spotObj[spotId];


  console.log(spot)
  if (!spot || !spot.Owner || !spot.SpotImages) {
    return null
  }
  const spotImages = spot.SpotImages;
  console.log(spotImages)
  function checkImages(index) {
    if (spotImages[index]) {
      return spotImages[index].url
    } else {
      return `https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg`
    }
  }
  return (
    <div className="spot-info-container">
      <div className="spot-info-sub">
        <div className="name-and-location">
          <h1>{spot.name}</h1>
          <h2>Location: {spot.city}, {spot.state}, {spot.country}</h2>
        </div>
        <div className="spot-images-container">
          <div className="main-spot-image">
            <img className="spot-preview-image" src={checkImages(0)} alt="" />
          </div>
          <div className="secondary-image-container">
            <div className="secondary-images">
              <img className="spot-image-tile" src={checkImages(1)} alt="" />
            </div>
            <div className="secondary-images">
              <img className="spot-image-tile" src={checkImages(2)} alt="" />
            </div>
            <div className="secondary-images">
              <img className="spot-image-tile" src={checkImages(3)} alt="" />
            </div>
            <div className="secondary-images">
              <img className="spot-image-tile" src={checkImages(4)} alt="" />
            </div>
          </div>
        </div>
        <div className="secondary-info-container">
          <div className="description-section">
            {/* Object.values(spot.Owner).slice(1).join(' ') */}
            <p className="hosted-p">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
            <p>{spot.description}</p>
          </div>
          <div className="reserve-section">
            <div className="price-reviews">
              <p>${spot.price} night</p>
              <p>
                <i className="fa-solid fa-star"></i>
                {typeof spot.avgRating === 'string' ? 'New' : (spot.avgRating % 1 == 0 ? spot.avgRating.toFixed(1) : spot.avgRating)} {typeof spot.numReviews === 'string' ? null : spot.numReviews == 1 ? `· ${spot.numReviews} review` : `· ${spot.numReviews} reviews`}
              </p>
            </div>
            <div className="reserve-button" >
              <Reserve />
            </div>
          </div>
        </div>
        <div className="review-section">
          <Reviews spotId={spotId} avgRating={spot.avgRating} numReviews={spot.numReviews} spot={spot} change={changeState}/>
        </div>
      </div>
    </div>
  )
}

export default SpotPage;
