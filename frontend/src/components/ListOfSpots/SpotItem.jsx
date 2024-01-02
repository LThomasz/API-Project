import { Link } from "react-router-dom";
import './SpotItem.css'
function SpotItem({spot}) {
  return (
    <Link to={`/spots/${spot.id}`} className="spot-card-item">
    <div>
      <img title={`${spot.name}`} className="spot-card-image" src={spot.previewImage == "No preview image available." ? `https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg` : spot.previewImage} alt="" />
      <div className="spot-card-stuff">
        <p>{spot.city}, {spot.state}</p>
        <p>
        <i className="fa-solid fa-star"></i>
        {typeof spot.avgRating === 'string' ? 'New' : (spot.avgRating % 1 == 0 ? spot.avgRating.toFixed(1) : spot.avgRating)}
        </p>
      </div>
      <div className="price">
        <p>${spot.price} night</p>
      </div>
    </div>
    </Link>
  )
}

export default SpotItem;
