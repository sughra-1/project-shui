import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../button/Button';

const Navigation = () => {
    const navigate = useNavigate();

    // Who is logged in (saved at login)
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const isLoggedIn = token && username;

    // Remove the saved login and go to the home page
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };
    return (
        <nav className="nav">
            <NavLink to="/" className="nav__link">Hem</NavLink>
            { isLoggedIn ? (
                <>
                    {/* The username links to the user's own messages */}
                    <NavLink to={ `/users/${username}` } className="nav__link">
                        { username }
                    </NavLink>
            <Button
                text="Logga ut"
                type="default"
                // onClick={ () => navigate('/login') }
                onClick={ handleLogout }
            />
            </>
            ) : (
                <Button
                    text="Logga in"
                    type="default"
                    onClick={ () => navigate('/login') }
                />
            )}
        </nav>
    )
}

export default Navigation;