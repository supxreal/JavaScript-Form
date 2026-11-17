import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const usersCon = document.querySelector("#getUsersCon");

// DELETE
const deleteUser = async (userID) => {
    try {
        const response = await axios.delete(`${API}/users/${userID}`)
        console.log(response.data);
        getUsers();
    } catch (error) {
        console.log(error.response?.data?.error);
    }
}

// loadUsers (Create DOM) use by getUsers function
const loadUsers = (users) => {
    usersCon.innerHTML = "";

    if (users.length === 0) {
        const container = document.createElement("div");
        container.className = "flex flex-row justify-center items-center bg-white gap-2 my-2 mx-4 p-4 rounded-lg";
        container.textContent = "No Users";
        usersCon.appendChild(container);

    } else {
        users.forEach((element) => {
            const container = document.createElement("div");
            container.className = "flex flex-row items-center bg-white gap-2 my-2 mx-4 p-4 rounded-lg";

            const idDiv = document.createElement("div");
            idDiv.textContent = `ID: ${element.userID}`;

            const fullnameDiv = document.createElement("div");
            fullnameDiv.textContent = element.fullname;

            const buttonCon = document.createElement("div");
            buttonCon.className = "flex flex-row gap-1 ml-auto";

            const editBtn = document.createElement("a");
            editBtn.textContent = "Edit";
            editBtn.href = `index.html?id=${element.userID}`;
            editBtn.className = "border border-gray-300 rounded-lg h-8 w-12 inline-flex items-center justify-center";


            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete bg-red-300 h-8 w-16";
            deleteBtn.dataset.id = element.userID;

            container.appendChild(idDiv);
            container.appendChild(fullnameDiv);
            buttonCon.appendChild(editBtn);
            buttonCon.appendChild(deleteBtn);
            container.appendChild(buttonCon);
            usersCon.appendChild(container);
        });

        const deleteDOM = document.querySelectorAll(".delete");
        deleteDOM.forEach((element) => {
            element.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                deleteUser(id);
            })
        })
    }
}


// GET
const getUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        const users = response.data;
        console.log(users);
        loadUsers(users);

    } catch (error) {
        console.log(error.response?.data?.error);

        usersCon.innerHTML = "";
        const errorMessage = "500 Interval server error";

        const container = document.createElement("div");
        container.className = "flex flex-row justify-center items-center bg-red-400 gap-2 my-2 mx-4 p-4 rounded-lg";
        container.textContent = errorMessage;

        usersCon.appendChild(container);
    }
}

// GET (search users by id)
const findBtn = document.querySelector("#find");
findBtn.addEventListener("click", async () => {
    const id = document.querySelector("#find-input").value.trim();

    if (!id) {
        getUsers();
        return;
    }
    const userID = Number(id);
    if (!Number.isInteger(userID) || userID < 1) {
        usersCon.innerHTML = "";
        const errorMessage = "UserID must be greater than zero";

        const container = document.createElement("div");
        container.className = "flex flex-row justify-center items-center bg-red-400 gap-2 my-2 mx-4 p-4 rounded-lg";
        container.textContent = errorMessage;

        usersCon.appendChild(container);
        return;
    }

    try {
        const response = await axios.get(`${API}/users/${userID}`);
        const user = response.data;
        console.log(response.data);

        usersCon.innerHTML = "";
        const container = document.createElement("div");
        container.className = "flex flex-row items-center bg-white gap-2 my-2 mx-4 p-4 rounded-lg";

        const idDiv = document.createElement("div");
        idDiv.textContent = `ID: ${user.userID}`;

        const fullnameDiv = document.createElement("div");
        fullnameDiv.textContent = user.fullname;

        const buttonCon = document.createElement("div");
        buttonCon.className = "flex flex-row gap-1 ml-auto";

        const editBtn = document.createElement("a");
        editBtn.textContent = "Edit";
        editBtn.href = `index.html?id=${user.userID}`;
        editBtn.className = "border border-gray-300 rounded-lg h-8 w-12 inline-flex items-center justify-center";


        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete bg-red-300 h-8 w-16";
        deleteBtn.dataset.id = user.userID;

        container.appendChild(idDiv);
        container.appendChild(fullnameDiv);
        buttonCon.appendChild(editBtn);
        buttonCon.appendChild(deleteBtn);
        container.appendChild(buttonCon);
        usersCon.appendChild(container);

        const deleteDOM = document.querySelector(".delete");
        deleteDOM.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            deleteUser(id);
        })

    } catch (error) {
        console.log(error.response?.data?.error);

        usersCon.innerHTML = "";
        const errorMessage = "User not found";

        const container = document.createElement("div");
        container.className = "flex flex-row justify-center items-center bg-red-400 gap-2 my-2 mx-4 p-4 rounded-lg";
        container.textContent = errorMessage;

        usersCon.appendChild(container);
    }
})

window.onload = () => {
    getUsers();
}
