const socket = io();
const form = document.querySelector(".login-form");

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

// //================================================ Socket.io stuff
//
const snippets = document.querySelector(".snipe");

snippets.addEventListener("click", function(event) {
	if (event.target.className === "fav-star") {
		const starId = event.target.id;
		const userId = document.querySelector("nav");
		console.log(userId.id);
		if (event.target.src === "http://localhost:3000/img/unlit-sm.png") {
			event.target.src = "http://localhost:3000/img/lit-sm.png";
			socket.emit("fav", { snippet: starId, user: userId.id });
		} else {
			event.target.src = "http://localhost:3000/img/unlit-sm.png";
			socket.emit("unfav", starId);
		}
	}
});
