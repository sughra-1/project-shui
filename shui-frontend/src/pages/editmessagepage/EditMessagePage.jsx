import './index.css';
import BackIcon from '../../components/backicon/BackIcon';
import MessageForm from '../../components/messageform/MessageForm';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMessageById } from '../../api/messages';

const EditMessagePage = () => {
    const { id } = useParams();   // from the URL: /message/edit/:id

    const { data: message, isLoading, isError, error } = useQuery({
        queryKey : ['messages', 'one', id],
        queryFn : () => getMessageById(id)
    });

    // const message = {
    //     user : {   
    //         username : 'Arne'
    //     },
    //     text : 'Jag gillar att fiska!'
    // }
    return (
        <section className="page new-message-page">
            <div className="wrapper new-message-page__wrapper">
                <BackIcon />
                <section className="page__form-container">
                    <h1 className="page__title">
                        Skapa nytt meddelande
                    </h1>
                    {/* <MessageForm message={ message } /> */}
                    { isLoading && <p>Laddar meddelande...</p> }
                    { isError && <p>{ error.message }</p> }
                    { message && <MessageForm message={ message } /> }
                </section>
            </div>
        </section>
    )
}

export default EditMessagePage;