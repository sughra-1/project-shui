import { useState } from 'react';
import './index.css';
import Button from '../button/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessage, updateMessage } from '../../api/messages';

// Used for both creating (no message) and editing (with message)
const MessageForm = ({ message = null }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [text, setText] = useState(message?.text ?? '');
    const [error, setError] = useState('');

     // Who is logged in (the backend takes the username from the token)
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Create or update, depending on whether we got a message
    const saveMutation = useMutation({
        mutationFn : () => message
            ? updateMessage(message.id, text, token)
            : createMessage(text, token),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey : ['messages'] });   // refresh the lists
            navigate('/');
        },
        onError : (error) => setError(error.message)
    });

    const handleSubmit = (event) => {
        event.preventDefault();   // stops the page from reloading
        setError('');

        if (!token) {
            setError('Du måste logga in för att skriva ett meddelande');
            return;
        }

        saveMutation.mutate();
    };

    const handleClear = (event) => {
        event.preventDefault();   // stops this button from submitting the form
        setText('');
    };

    return (
        <form className="message-form" onSubmit={ handleSubmit }>
            <label className="message-form__label">
                Användarnamn

                <input
                    type="text"
                    className="message-form__input"
                    value={ message ?  message.username : (username ?? '') }
                    placeholder="Logga in för att skriva"
                    disabled
                    // disabled={ !message ? false : true }
                />
            </label>

            <label className="message-form__label">
                Meddelande

                <div className="message-form__textarea-wrapper">
                    <textarea
                        className="message-form__textarea"
                        placeholder="Vad vill du säga?"
                        maxLength={200}
                        value={ text }
                        onChange={(event) => setText(event.target.value)}
                    />

                    <span className="message-form__counter">
                        {text.length}/200
                    </span>
                </div>
            </label>
            { error && <p className="message-form__error">{ error }</p> }
            <Button 
                text={ !message ? 'Publicera' : 'Spara ändringar' }
                type="default"
                // onClick={ console.log('Spara meddelande') }
            />
            <Button 
                text="Rensa"
                type="outline"
                // onClick={ console.log('Rensa') }
                onClick={ handleClear }
            />
        </form>
    );
};

export default MessageForm;