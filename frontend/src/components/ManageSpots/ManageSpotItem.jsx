import { Link, NavLink } from "react-router-dom";
import DeleteSpot from "../DeleteModal/DeleteSpot";
import './ManageSpotItem.css'
function ManageSpotItem({spot}) {

  return (
    <div className="spot-card-item">
      <Link to={`/spots/${spot.id}`}  style={{ textDecoration: 'none', color: 'black' }} >
      <div className="spot-card">
        <div className="image-container">
          <img title={`${spot.name}`} className="spot-card-image" src={spot.previewImage == "No preview image available." ? `https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg` : spot.previewImage} alt="" />
        </div>
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
      <div className="manage-spots-buttons">
        <button>
          <NavLink to={`/spots/${spot.id}/edit`} style={{ textDecoration: 'none', color: 'black' }} state={{fromManage: {spot}}}>
            Update
          </NavLink>
        </button>
        <div>
          <DeleteSpot spotId={spot.id}/>
        </div>
      </div>
    </div>
  )
}

export default ManageSpotItem;
