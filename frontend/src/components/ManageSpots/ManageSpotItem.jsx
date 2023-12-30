import { Link, NavLink } from "react-router-dom";
import DeleteSpot from "../DeleteModal/DeleteSpot";
import './ManageSpotItem.css'
function ManageSpotItem({spot}) {

  return (
    <div className="spot-card-item">
      <Link to={`/spots/${spot.id}`} >
      <img title={`${spot.name}`} className="spot-card-image" src={spot.previewImage == "No preview image available." ? `https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg` : spot.previewImage} alt="" />
      <div>
        <p>{spot.city}, {spot.state}</p>
        <p>
        <i className="fa-solid fa-star"></i>
        {typeof spot.avgRating === 'string' ? 'New' : (spot.avgRating % 1 == 0 ? spot.avgRating.toFixed(1) : spot.avgRating)}
        </p>
      </div>
      <div>
        <p>${spot.price} night</p>
      </div>
      </Link>
      <div>
        <button>
          <NavLink to={`/spots/${spot.id}/edit`} state={{fromManage: {spot}}}>
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
