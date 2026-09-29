const BASE_URL =
"https://8ez7w55yl6.execute-api.eu-north-1.amazonaws.com/api/auth";

export const login = async (credentials) => {
	const response = await fetch(`${BASE_URL}/login`, {
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify(credentials)
	});
	
	const data = await response.json();
	
	if(!response.ok) {
		throw new Error(data.message || 'Could not sign in');
	}

	return data;
};

export const register = async (user) => {
	const response = await fetch(`${BASE_URL}/register`, {
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify(user)
	});
	
	const data = await response.json();
	
	if(!response.ok) {
		throw new Error(data.message || 'Could not create accont.');
	}

	return data;
};