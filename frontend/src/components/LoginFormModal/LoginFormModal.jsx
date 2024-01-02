import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css'

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
    });
  };

  return (
    <div className='log-in-form-container'>
      <h1 className='log-in-title'>Log In</h1>
      <form className='log-in-form' onSubmit={handleSubmit}>
        <input
          id='username'
          type="text"
          placeholder='Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          id='password'
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.credential && <p style={{color: 'red'}}>{errors.credential}</p>}
        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >Log In</button>
        <button
          type='submit'
          onClick={() => {
            setCredential("Demo-lition");
            setPassword("password")
          }}
        >
          Log in as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
