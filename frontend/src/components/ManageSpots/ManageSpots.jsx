import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserSpots } from "../../store/spots";
import { useEffect, useState } from "react";
import ManageSpotItem from "../ManageSpots/ManageSpotItem";
import './ManageSpots.css'
import { NavLink } from "react-router-dom";

function ManageSpots() {
  const dispatch = useDispatch();
  const userSpotsObj = useSelector((store) => store.spots)
  console.log(userSpotsObj)
  const userSpots = Object.values(userSpotsObj)
  console.log(userSpots)
  useEffect(() => {
    dispatch(thunkGetUserSpots())
  }, [dispatch])
  return (
    <div className="spot-list">
    {userSpots.length ? userSpots.map((spot) => (
      <ManageSpotItem
        spot={spot}
        key={spot.id}
      />
    )) : (
      <NavLink to='/spots/new'>
        <button>Create a Spot</button>
      </NavLink>
    )}
    </div>

  )
}

export default ManageSpots;
