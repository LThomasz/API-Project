import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReserveModal from "./ReserveModal";
function Reserve() {
  return (
    <OpenModalButton
      buttonText="Reserve"
      modalComponent={<ReserveModal />}
    />
  )
}

export default Reserve;
