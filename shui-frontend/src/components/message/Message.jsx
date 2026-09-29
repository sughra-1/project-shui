import './index.css';
import { NotePencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useNavigate , Link} from 'react-router-dom';
import { formatDate } from '../../utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMessage } from '../../api/messages';


const Message = ({ message }) => {
    const navigate = useNavigate(); 
    const queryClient = useQueryClient();

    // Who is logged in can get pencil & delete icons
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('username');
    const isOwner = token && loggedInUser === message.username;

    // Delete the message, then refresh all message lists
    const deleteMutation = useMutation({
        mutationFn : () => deleteMessage(message.id, token),
        onSuccess : () => queryClient.invalidateQueries({ queryKey : ['messages'] }),
        onError : (error) => alert(error.message)
    });

    const handleDelete = () => {
        if (window.confirm('Do you want to delete the message?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <article className="message">
            <h3 className="message__initials">
                { message.username.substring(0, 2) .toUpperCase()}
                {/* message.user.lastname.substring(0, 1) */}
            </h3>
            <div className="message__content">
                <div className="message__content-top">
                    {/* <h4 className="message__user">{ message.username }</h4> */}
                    <Link to={ `/users/${message.username}` } className="message__user">
                        { message.username }
                    </Link>
                    <p className="message__date">{ formatDate(message.createdAt) }
                    { message.updatedAt && ` · updatedAt ${ formatDate(message.updatedAt) }` }</p>
                </div>
                <p className="message__text">
                    { message.text }
                </p>
            </div>
            { isOwner &&
            <div className="message__icon-group">
                <NotePencilIcon 
                    className="icon icon--pencil"
                    size={20}
                    weight="bold"
                    onClick={ () => navigate(`/message/edit/${message.id}`) }
                />
                <TrashIcon 
                    className="icon icon--trash"
                    size={20}
                    weight="bold"
                    color="red"
                    onClick={ handleDelete }
                />
            </div>
            }
        </article>
    )
}

export default Message;