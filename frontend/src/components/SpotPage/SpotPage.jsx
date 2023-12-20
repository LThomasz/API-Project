import { useDispatch, useSelector } from "react-redux";
import { thunkGetOneSpot } from "../../store/spots";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
    <div>
      <h1>{spot.name}</h1>
      <div>
        <div>
          <img src="" alt="" />
        </div>
        <div>
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
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
