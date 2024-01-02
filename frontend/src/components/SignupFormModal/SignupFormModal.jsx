import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const condition = (username.length < 4 || password.length < 6 || !email.length || !firstName.length || !lastName.length || !confirmPassword.length)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      ).then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
          console.log(data)
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='sign-up-form-container'>
      <h1 className='sign-up-title'>Sign Up</h1>
      <form className='sign-up-form' onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}
          <input
            type="text"
            value={firstName}
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        {errors.firstName && <p style={{color: 'red'}}>{errors.firstName}</p>}
          <input
            type="text"
            value={lastName}
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        {errors.lastName && <p style={{color: 'red'}}>{errors.lastName}</p>}
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
          <input
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword}</p>}
        <button
          type="submit"
          disabled={condition}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
