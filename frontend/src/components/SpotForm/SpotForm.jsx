import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import './SpotForm.css'
function SpotForm() {
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

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
      const data = await dispatch(thunkCreateSpot(spotData))
      setErrors(data.errors)

    // const spotImageData = {
    //   url: previewImage,
    //   preview: true
    // }
  }
  return (
    <div className="create-spot-form-container">
      <h1>Create a new Spot</h1>
      <form onSubmit={handleSubmit} className="new-spot-form">
        <div className="section-one">
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
        <div className="section-two">
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
        <div className="section-three">
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
        <div>
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
        <div>
          <h2>Set a base price for your spot</h2>
          <label htmlFor="price">Competitive pricing can help your listing stand out and rank higher in search results.</label>

          <p>$</p>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          {'price' in errors && <p style={{color: 'red'}}>{errors.price}</p>}
        </div>
        <div>
          <h2>Liven up your spot with photos</h2>
          <label htmlFor="previewImage">Submit a link to at least one photo to publish your spot.</label>
          <input
            type="url"
            id="previewImage"
            value={previewImage}
            placeholder="Preview Image URL"
            onChange={(e) => setPreviewImage(e.target.value)}
          />

          <input
            type="url"
            id="image1"
            value={image1}
            placeholder="Image URL"
            onChange={(e) => setImage1(e.target.value)}
          />
          <input
            type="url"
            id="image2"
            value={image2}
            placeholder="Image URL"
            onChange={(e) => setImage2(e.target.value)}
          />
          <input
            type="url"
            id="image3"
            value={image3}
            placeholder="Image URL"
            onChange={(e) => setImage3(e.target.value)}
          />
          <input
            type="url"
            id="image4"
            value={image4}
            placeholder="Image URL"
            onChange={(e) => setImage4(e.target.value)}
          />
        </div>
        <button type="submit">Create Spot</button>
      </form>
    </div>
  )
}
export default SpotForm;
