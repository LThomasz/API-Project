import { useState } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";

function DeleteSpot({spotId}) {
  return (
    <OpenModalButton
      buttonText="Delete"
      modalComponent={<DeleteSpotModal spotId={spotId} />}

    />
  )
}

export default DeleteSpot;
