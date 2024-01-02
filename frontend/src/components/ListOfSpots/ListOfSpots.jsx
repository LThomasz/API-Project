import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spots";
import { useEffect } from "react";
import SpotItem from "./SpotItem";
import './ListOfSpots.css'
function ListOfSpots() {
  const dispatch = useDispatch();
  const spotsObj = useSelector((store) => store.spots);
  const spots = Object.values(spotsObj);
  useEffect(() => {
    dispatch(thunkGetAllSpots())
  }, [dispatch])

  return (
    <div className="spot-list-container">
      <div className="spot-list">
        {spots.map((spot) => (
          <SpotItem
            spot={spot}
            key={spot.id}
          />
        ))}
      </div>
    </div>
    )
}

export default ListOfSpots;
