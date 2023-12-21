import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import logo from "../../../dist/favicon.ico"
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
      <li className='create-spot-link'>
        <button className='create-spot-button'>
          <NavLink style={{textDecoration: 'none'}} to="/spots/new">
            Create a New Spot
          </NavLink>
        </button>
      </li>
      <li className="profile-button">
        <ProfileButton user={sessionUser} />
      </li>
      </>
    );
  } else {
    sessionLinks = (
      <>
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li className='sign-up-button'>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
      </>
    );
  }

  return (
    <ul className='navigation-bar'>
      <li className='profile-logo'>
        <NavLink to="/">
          <img src={logo} alt="" />
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
