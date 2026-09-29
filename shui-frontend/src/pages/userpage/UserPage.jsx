import './index.css';
import Header from '../../components/header/Header';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../../api/messages';

const UserPage = () => {
    const { username } = useParams();   // from the URL: /users/:username

    const { data: messages, isLoading, isError, error } = useQuery({
        queryKey : ['messages', username],
        queryFn : () => getMessages(username)
    });

    return (
        <section className="page">
            <Header />
            <div className="wrapper">
                <h2>Meddelanden från { username }</h2>
                { isLoading && <p>Laddar meddelanden...</p> }
                { isError && <p>{ error.message }</p> }
                <MessageFlow messages={ messages } />
            </div>
        </section>
    )
}

export default UserPage;
