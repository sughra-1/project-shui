import './index.css';
import Button from '../button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../api/auth';

const RegisterForm = () => {
    const navigate = useNavigate();

    //values from the input fields
       const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [error, setError] = useState('');

        // Runs when the user clicks "Registrera"
        const handleSubmit = async (event) => {
            event.preventDefault();   // stops the page from reloading
            setError('');

            // Checked in the frontend only; the backend doesn't need confirmPassword
            if (password !== confirmPassword) {
                setError('Lösenorden matchar inte');
                return;
            }

            try {
                await register({ username, email, password });   // sends the new user to the backend
                navigate('/login');                              // go to the login page
            } catch (error) {
                setError(error.message);   // e.g. "Username already exists"
            }
        };

    return (
        <form className="register-form" onSubmit={ handleSubmit }>
            <label className="register-form__label">
                Användarnamn
                <input
                    type="text"
                    className="register-form__input"
                    placeholder="Välj ett användarnamn"
                    value={ username }
                    onChange={ (event) => setUsername(event.target.value) }
                />
            </label>
            <label className="register-form__label">
                E-post
                <input
                    type="text"
                    className="register-form__input"
                    placeholder="namn@exempel.se"
                    value={ email }
                    onChange={ (event) => setEmail(event.target.value) }
                />
            </label>
            <label className="register-form__label">
                Lösenord
                <input
                    type="password"
                    className="register-form__input"
                    placeholder="Minst 6 tecken"
                    value={ password }
                    onChange={ (event) => setPassword(event.target.value) }
                />
            </label>
            <label className="register-form__label">
                Bekräfta lösenord
                <input
                    type="password"
                    className="register-form__input"
                    placeholder="Upprepa ditt lösenord"
                    value={ confirmPassword }
                    onChange={ (event) => setConfirmPassword(event.target.value) }
                />
            </label>
            { error && <p className="register-form__message">{ error }</p> }
            <Button 
                text="Registrera"
                type="default"
                onClick={ () => console.log('Registrera') }
            />
            <p className="register-form__message">
                Har du redan ett konto? <Link to="/login" className="register-form__message-link">Logga in här!</Link>
            </p>
        </form>
    )
}

export default RegisterForm;