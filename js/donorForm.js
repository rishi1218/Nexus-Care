const firebaseConfig = {
        apiKey: "AIzaSyDDaE0Q-Yx7VLXDMX6xo_Gb3W0Y4dsFY68",
        authDomain: "nexuscare-43a3c.firebaseapp.com",
        databaseURL: "https://nexuscare-43a3c-default-rtdb.firebaseio.com",
        projectId: "nexuscare-43a3c",
        storageBucket: "nexuscare-43a3c.appspot.com",
        messagingSenderId: "389146758058",
        appId: "1:389146758058:web:f9d7a2c9a01b894d5b39d3",
        measurementId: "G-ZZPGSDWF0F"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var donorFormDB = firebase.database().ref("DonorForm");

document.getElementById("donorForm").addEventListener("submit", submitForm);
document.getElementById('donortype').addEventListener('change', function() {
    var donorType = this.value;
    var organInput = document.getElementById("organInput");

    if (donorType === "Organ") {
        organInput.style.display = "block";
    } else {
        organInput.style.display = "none";
    }
})
function submitForm(e) {
    e.preventDefault();

    var name = getElementVal("name");
    var emailid = getElementVal("emailid");
    var contactno = getElementVal("contactno");
    var gender = getElementVal("gender");
    var age = getElementVal("age");
    var weight = getElementVal("weight");
    var height = getElementVal("height");
    var donortype = getElementVal("donortype");
    var address = getElementVal("address");
    var organType = getElementVal("organType");
    var bloodInputType = getElementVal("bloodTypeInput");

    // Check if any required field is empty
    if (name === "" || emailid === "" || contactno === "" || donortype === "" || address === ""|| age === ""|| height === ""|| weight === ""|| gender === "") {
        alert("Please fill in all the required fields.");
        return;
    }

    // Email validation using regular expression
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailid)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Contact number validation
    if (contactno.length !== 10 || isNaN(contactno)) {
        alert("Contact number must be 10 digits long.");
        return;
    }

    saveMessages(name, emailid, contactno, donortype, address, age, height, weight, gender, organType, bloodInputType);

    // Enable alert
    document.querySelector(".alert").style.display = "block";

    // Remove the alert
    setTimeout(() => {
        document.querySelector(".alert").style.display = "none";
    }, 3000);

    // Reset the form
    document.getElementById("donorForm").reset();
}

const saveMessages = (name, emailid, contactno, donortype, address, age, height, weight, gender, organType, bloodInputType) => {
    var newdonorForm = donorFormDB.push();

    newdonorForm.set({
        name: name,
        emailid: emailid,
        contactno: contactno,
        donortype: donortype,
        address: address,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        organType: organType,
        bloodType: bloodInputType
    });
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
};