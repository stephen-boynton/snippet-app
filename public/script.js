// dom function
const form = document.querySelector(".login-form");
const protectedBtn = document.querySelector("#protected");
const contentDiv = document.querySelector(".content");
function userHTML(user) {
	return `
    <div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    </div>
  `;
}

form.addEventListener("submit", function(event) {
	event.preventDefault();
	const userCred = {
		username: event.target.querySelector('input[name="username"]').value,
		password: event.target.querySelector('input[name="password"]').value
	};
	loginUser(userCred).then(function(response) {
		console.log("response for logging in!", response);
		if (response) setToken(response.token);
		event.target.querySelector('input[name="username"]').value = "";
		event.target.querySelector('input[name="password"]').value = "";
	});
});

// fetch function

const baseUrl = "http://localhost:3000";
function loginUser(userCreds) {
	return fetch(`${baseUrl}/login`, {
		method: "POST",
		body: JSON.stringify(userCreds),
		headers: { Accept: "application/json", "Content-Type": "application/json" }
	})
		.then(response => response.json())
		.catch(err => console.log(err));
}

// function getProtected() {
// 	return fetch(`${baseUrl}/protected`, {
// 		method: "GET",
// 		headers: {
// 			Accept: "application/json",
// 			Authorization: `Bearer ${getIdToken()}`,
// 			"Content-Type": "application/json"
// 		}
// 	})
// 		.then(response => response.json())
// 		.catch(err => console.log(err));
// }

function setToken(token) {
	window.localStorage.setItem("token", token);
	return token;
}
function logout() {
	window.localStorage.removeItem("token");
}
function getIdToken() {
	const token = window.localStorage.getItem("token");
	if (token) {
		return token;
	} else {
		return false;
	}
}
