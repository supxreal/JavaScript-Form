import axios from "axios";

let mode = "CREATE";
let selectedId = "";
let noProblem = "";

// URLSearchParams
window.onload = async () => {
    const URLParams = new URLSearchParams(window.location.search);
    const userID = URLParams.get("id");

    if (userID !== null) {
        mode = "UPDATE";
        selectedId = userID;
        console.log("mode",mode);
        console.log("userID", selectedId);

        // GET FOR UPDATE BY ID
        try {
            const response = await axios.get(`/api/users/${selectedId}`);
            const user = response.data;
            console.log(user);

            const fullnameDOM = document.querySelector("#fullname");
            const ageDOM = document.querySelector("#age");
            const addressDOM = document.querySelector("#address");
            const infomationDOM = document.querySelector("#more-info");

            const genderDOM = document.querySelectorAll("input[name='gender']");
            genderDOM.forEach((element) => {
                if (element.value === user.gender) {
                    element.checked = true;
                }
            })

            const interestDOM = document.querySelectorAll("input[name='interest']");
            interestDOM.forEach((element) => {
                if (user.interest.includes(element.value)) {
                    element.checked = true;
                }
            })

            fullnameDOM.value = user.fullname;
            ageDOM.value = user.age;
            addressDOM.value = user.address;
            infomationDOM.value = user.infomation;

        } catch (error) {
            console.log(error.response?.data?.error);
        }
    }
}

const form = document.querySelector("form");
const divCon = document.querySelector("#status");

const validateData = (user) => {
    let errors = [];

    if (!user.fullname) {
        errors.push("Please enter fullname");
    }
    if (!user.age) {
        errors.push("Please enter age");
    }
    if (!user.address) {
        errors.push("Please enter address");
    }
    if (!user.gender) {
        errors.push("Please select gender");
    }
    if (!user.interest) {
        errors.push("Please select interest");
    }
    if (!user.infomation) {
        errors.push("Please enter infomation");
    }

    return errors;
}

// POST
const postUsers = async () => {
    const gender = document.querySelector("input[name='gender']:checked") || "";
    const interest = document.querySelectorAll("input[name='interest']:checked") || "";
    let countInterest = "";

    for (let i = 0; i < interest.length; i++) {
        if (i < interest.length - 1) {
            countInterest += interest[i].value + ", ";
        } else {
            countInterest += interest[i].value;
        }
    }

    const user = {
        fullname: document.querySelector("#fullname").value.trim(),
        age: document.querySelector("#age").value.trim(),
        address: document.querySelector("#address").value.trim(),
        gender: gender.value,
        interest: countInterest,
        infomation: document.querySelector("#more-info").value.trim()
    }

    try {
        const response = await axios.post("/api/users", user);
        const users = response.data;
        console.log(users);

        divCon.innerHTML = "";
        divCon.className = "flex flex-row justify-center items-center w-80 mt-2 rounded-md bg-green-400";

        const statusSuccess = document.createElement("div");
        statusSuccess.textContent = "Sumbit Success!";
        statusSuccess.className = "p-4 text-black";

        divCon.appendChild(statusSuccess);
        noProblem = "OK";

    } catch (error) {
        console.log(error.response?.data?.error);

        divCon.innerHTML = "";
        divCon.className = "flex flex-row justify-center items-center w-80 mt-2 rounded-md bg-red-400";
        
        const statusDanger = document.createElement("div");

        if (!error.response) {
            const serverErrorText = document.createElement("div");
            serverErrorText.textContent = "505 Interval server";
            serverErrorText.className = "flex justify-center items-center p-4 text-black";
            statusDanger.appendChild(serverErrorText);
            
            divCon.appendChild(statusDanger);
            return;
        }

        const dangerText = document.createElement("div");
        dangerText.textContent = "Incomplete Information!";
        dangerText.className = "flex justify-center items-center p-4 text-black";
        statusDanger.appendChild(dangerText);

        let errors = validateData(user);
        if (errors.length !== 0) {
            console.log(errors);
            const errorsCon = document.createElement("div");
            errorsCon.className = "pb-4";

            errors.forEach((element) => {
                const invalid = document.createElement("div");
                invalid.textContent = `- ${element}`
                invalid.className = "pl-2";

                errorsCon.appendChild(invalid);
            });
            statusDanger.appendChild(errorsCon);
        }
        divCon.appendChild(statusDanger);
    }
}

// PUT
const updateUser = async (selectedId) => {
    const gender = document.querySelector("input[name='gender']:checked") || "";
    const interest = document.querySelectorAll("input[name='interest']:checked") || "";
    let countInterest = "";

    for (let i = 0; i < interest.length; i++) {
        if (i < interest.length - 1) {
            countInterest += interest[i].value + ", ";
        } else {
            countInterest += interest[i].value;
        }
    }

    const user = {
        fullname: document.querySelector("#fullname").value.trim(),
        age: document.querySelector("#age").value.trim(),
        address: document.querySelector("#address").value.trim(),
        gender: gender.value,
        interest: countInterest,
        infomation: document.querySelector("#more-info").value.trim()
    }

    try {
        const response = await axios.put(`/api/users/${selectedId}`, user);
        const users = response.data;
        console.log(users);

        divCon.innerHTML = "";
        divCon.className = "flex flex-row justify-center items-center w-80 mt-2 rounded-md bg-green-400";

        const statusSuccess = document.createElement("div");
        statusSuccess.textContent = "Update Success!";
        statusSuccess.className = "p-4 text-black";

        divCon.appendChild(statusSuccess);
        noProblem = "OK";

    } catch (error) {
        console.log(error.response?.data?.error);

        divCon.innerHTML = "";
        divCon.className = "flex flex-row justify-center items-center w-80 mt-2 rounded-md bg-red-400";
        
        const statusDanger = document.createElement("div");

        if (!error.response) {
            const serverErrorText = document.createElement("div");
            serverErrorText.textContent = "505 Interval server";
            serverErrorText.className = "flex justify-center items-center p-4 text-black";
            statusDanger.appendChild(serverErrorText);
            
            divCon.appendChild(statusDanger);
            return;
        }

        const dangerText = document.createElement("div");
        dangerText.textContent = "Incomplete Information!";
        dangerText.className = "flex justify-center items-center p-4 text-black";
        statusDanger.appendChild(dangerText);

        let errors = validateData(user);
        if (errors.length !== 0) {
            console.log(errors);
            const errorsCon = document.createElement("div");
            errorsCon.className = "pb-4";

            errors.forEach((element) => {
                const invalid = document.createElement("div");
                invalid.textContent = `- ${element}`
                invalid.className = "pl-2";

                errorsCon.appendChild(invalid);
            });
            statusDanger.appendChild(errorsCon);
        }
        divCon.appendChild(statusDanger);
    }
}

// SUBMIT FORM
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (mode == "CREATE") {
        await postUsers();
    } else {
        await updateUser(selectedId);
    }

    if (noProblem === "OK") {
        noProblem = "";
        form.reset();
    }
})
