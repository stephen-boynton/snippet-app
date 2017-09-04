$(document).ready(function() {
	// dom function
	const socket = io();
	const form = document.querySelector(".login-form");
	//
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
	//
	// // fetch function
	//
	const baseUrl = "http://localhost:3000";
	function loginUser(userCreds) {
		return fetch(`${baseUrl}/login`, {
			method: "POST",
			body: JSON.stringify(userCreds),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "same-origin"
		})
			.then(response => response.json())
			.catch(err => console.log(err));
	}

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

	socket.on("info", function(message) {
		const starArray = document.querySelectorAll(".fav-star");
		message.faved.forEach((elm, ind, arr) => {
			for (let i = 0; i < starArray.length; i++) {
				if (elm === starArray[i].id) {
					console.log("Changing");
					const newPic = document.getElementById(starArray[i].id);
					newPic.src = "/img/lit-sm.png";
				}
			}
		});
	});
});
