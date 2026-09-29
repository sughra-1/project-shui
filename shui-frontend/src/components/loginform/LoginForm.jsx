import './index.css';
import Button from '../button/Button';
import { Link , useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { login } from '../../api/auth';

const LoginForm = () => {
    const navigate = useNavigate();

    // Values from the input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Runs when the user clicks "Logga in"
    const handleSubmit = async (event) => {
        event.preventDefault();   // stops the page from reloading
        setError('');

        try{
        const data = await login({ username, password });  //login() sends username + password to the backend and return a token
        localStorage.setItem('token', data.token);         //the token and username are saved in localStorage
        localStorage.setItem('username', username);
        navigate('/');                                     //the user is sent to the home page, logged in
        } catch (error) {
            setError(error.message);               // e.g. "Username and/or password are incorrect"

        }     

};

    return (
        <form className="login-form" onSubmit={ handleSubmit }>
            <label className="login-form__label">
                Användarnamn
                <input
                    type="text"
                    className="login-form__input"
                    placeholder="Användarnamn"
                    value={ username }
                    onChange={ (event) => setUsername(event.target.value) }
                />
            </label>
            <label className="login-form__label">
                Lösenord
                <input
                    type="password"
                    className="login-form__input"
                    placeholder="********"
                    value={ password }
                    onChange={ (event) => setPassword(event.target.value) }
                />
            </label>
            { error && <p className="login-form__message">{ error }</p> }
            <Button 
                text="Logga in"
                type="default"
                onClick={ () => console.log('Logga in') }
            />
            <p className="login-form__message">
                Har du inget konto? <Link to="/register" className="login-form__message-link">Registrera dig här!</Link>
            </p>
        </form>
    )
}

export default LoginForm;