import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateSpot, thunkGetOneSpot } from "../../store/spots";
import './UpdateSpotForm.css'

function UpdateSpotForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const spotId = useParams().spotId;
  const spot = location.state.fromManage.spot
  const [country, setCountry] = useState(`${spot.country}`);
  const [address, setAddress] = useState(`${spot.address}`);
  const [city, setCity] = useState(`${spot.city}`);
  const [state, setState] = useState(`${spot.state}`);
  const [description, setDescription] = useState(`${spot.description}`);
  const [name, setName] = useState(`${spot.name}`);
  const [price, setPrice] = useState(`${spot.price}`);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkGetOneSpot(spotId))
  }, [dispatch, spotId])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spotData = {
      address,
      city,
      state,
      lat: 0.1,
      lng: 0.1,
      country,
      name,
      description,
      price
    }

    const data = await dispatch(thunkUpdateSpot(spotData, spotId))
    if (typeof data !== "number") {
      const errorMessages = {...data.errors}
      setErrors(errorMessages)
    } else {
      navigate(`/spots/${data}`)
    }

  }

  // if (!spot) {
  //  return null
  // }
  return (
    <div className="update-spot-form-container">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit} className="update-spot-form">
        <div className="update-section-one">
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <label htmlFor="country" >Country {'country' in errors && <p style={{color: 'red'}}>{errors.country}</p>}</label>
          <input
            type="text"
            id="country"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />

          <label htmlFor="street-address">Street Address {'address' in errors && <p style={{color: 'red'}}>{errors.address}</p>}</label>
          <input
            type="text"
            id="street-address"
            value={address}
            placeholder="Street Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="update-section-two">
          <div>
            <label htmlFor="city">City {'city' in errors && <p style={{color: 'red'}}>{errors.city}</p>}</label>
            <input
              type="text"
              id="city"
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="state">State {'state' in errors && <p style={{color: 'red'}}>{errors.state}</p>}</label>
            <input
              type="text"
              id="state"
              value={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div className="update-section-three">
          <h2>Describe your place to guests</h2>
          <label htmlFor="description">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</label>
          <textarea
            id="description"
            value={description}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {'description' in errors && <p style={{color: 'red'}}>{errors.description}</p>}
        </div>
        <div className="update-section-four">
          <h2>Create a title for your spot</h2>
          <label htmlFor="name">Catch guests&apos; attention with a spot title that highlights what makes your place special.</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Name of your spot"
            onChange={(e) => setName(e.target.value)}
          />
          {'name' in errors && <p style={{color: 'red'}}>{errors.name}</p>}
        </div>
        <div className="update-section-five">
          <h2>Set a base price for your spot</h2>
          <label htmlFor="price">Competitive pricing can help your listing stand out and rank higher in search results.</label>

          <p>$</p>
          <input
            id="price"
            type="text"
            inputMode="numeric"
            value={price}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          {'price' in errors && <p style={{color: 'red'}}>{errors.price}</p>}
        </div>
        <button type="submit">Update your Spot</button>
      </form>
    </div>
  )
}

export default UpdateSpotForm;
