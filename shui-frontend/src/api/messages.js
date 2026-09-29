const BASE_URL =
"https://8ez7w55yl6.execute-api.eu-north-1.amazonaws.com/api/messages";

export const getMessages = async (username) => {

	const url = username
		?`${BASE_URL}?username=${encodeURIComponent(username)}`
		:BASE_URL;

	const response = await fetch(url);
    const data = await response.json();
	if(!response.ok) {
		throw new Error(data.message || 'Could not fetch messages');
	}

	return data.messages;
};

export const getMessageById = async (id) => {
	const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Could not fetch message");
	}


	return data.message;
};

export const createMessage = async (text, token) => {
	const response = await fetch(BASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ text }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Could not create message");
	}

	return data.message;
};

// Update message (needs token, only your own message)
export const updateMessage = async (id, text, token) => {
	const response = await fetch(`${BASE_URL}/${id}`, {
		method : 'PATCH',
		headers : {
			'Content-Type' : 'application/json',
			Authorization : `Bearer ${token}`
		},
		body : JSON.stringify({ text })
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not update message');
	}

	return data.message;
};


// DELETE messages (needs token, only your own message)
export const deleteMessage = async (id, token) => {
	const response = await fetch(`${BASE_URL}/${id}`, {
		method : 'DELETE',
		headers : {
			Authorization : `Bearer ${token}`
		}
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not delete message');
	}

	return data;
};