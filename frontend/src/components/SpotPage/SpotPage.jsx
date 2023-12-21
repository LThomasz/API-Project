import { useDispatch, useSelector } from "react-redux";
import { thunkGetOneSpot } from "../../store/spots";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import './SpotPage.css'
function SpotPage() {
  const dispatch = useDispatch();
  const spotObj = useSelector((store) => store.spots);

  const {spotId} = useParams();
  const spot = spotObj[spotId];

  useEffect(() => {
    dispatch(thunkGetOneSpot(spotId))
  }, [dispatch, spotId])

  if (!spot || !spot.Owner) {
    return null
  }
  return (
    <div className="spot-info-container">
      <h1>{spot.name}</h1>
      <div className="spot-images-container">
        <div className="main-spot-image">
          <img className="spot-preview-image" src="https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />
        </div>
        <div className="secondary-image-container">
          <div className="secondary-images">
            <img className="spot-image-tile" src="https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />
          </div>
          <div className="secondary-images">
            <img className="spot-image-tile" src="https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />
          </div>
          <div className="secondary-images">
            <img className="spot-image-tile" src="https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />
          </div>
          <div className="secondary-images">
            <img className="spot-image-tile" src="https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />
          </div>
        </div>
      </div>
      <div>
        <h2>Location: {spot.city}, {spot.state}, {spot.country}</h2>
        {/* Object.values(spot.Owner).slice(1).join(' ') */}
        <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
      </div>
      <div>
        <p>${spot.price} night</p>
        <button>Reserve</button>
      </div>
        <p>{spot.description}</p>
    </div>
  )
}

export default SpotPage;
