import { Link } from "react-router-dom";
import './SpotItem.css'
function SpotItem({spot}) {
  return (
    <Link to={`/spots/${spot.id}`} className="spot-card-item">
    <div>
      <img title={`${spot.name}`} className="spot-card-image" src={spot.previewImage == "No preview image available." ? `https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg` : spot.previewImage} alt="" />
      <div>
        <p>{spot.city}, {spot.state}</p>
        <p>
        <i className="fa-solid fa-star"></i>
        {spot.avgRating}
        </p>
      </div>
      <p>${spot.price} night</p>
    </div>
    </Link>
  )
}

export default SpotItem;
