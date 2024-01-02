import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from "../../../src/images/favicon.ico"
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  return (
    <ul className='navigation-bar'>
      <li className='profile-logo'>
        <NavLink to="/">
          <img src={logo} alt="" />
        </NavLink>
          <p>Ground Bnb</p>
      </li>
      {sessionUser && <li>
        <NavLink to='/spots/new'>Create a New Spot</NavLink>
      </li>}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
