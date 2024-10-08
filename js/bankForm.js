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
var bankFormDB = firebase.database().ref("BankForm");

document.getElementById("bankForm").addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();


    var name = getElementVal("name");
    var emailid = getElementVal("emailid");
    var contactno = getElementVal("contactno");
    var banktype = getElementVal("banktype");
    var address = getElementVal("address");


    // Check if any required field is empty
    if (name === "" || emailid === "" || contactno === "" || banktype === "" || address === "") {
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

    saveMessages(name, emailid, contactno, banktype, address);



    // Enable alert
    document.querySelector(".alert").style.display = "block";

    // Remove the alert
    setTimeout(() => {
        document.querySelector(".alert").style.display = "none";
    }, 3000);

    // Reset the form
    document.getElementById("bankForm").reset();
}

const saveMessages = (name, emailid, contactno, banktype, address) => {
    var newBankForm = bankFormDB.push();
    var uniqueId = newBankForm.key;
    newBankForm.set({
        name: name,
        emailid: emailid,
        contactno: contactno,
        banktype: banktype,
        address: address,
        availability: {
            "A+": "0",
            "A-": "0",
            "B+": "0",
            "B-": "0",
            "O+": "0",
            "O-": "0",
            "AB+": "0",
            "AB-": "0"
        }
    })
    alert('Form submitted successfully! Unique ID: ' + uniqueId);
    window.location.href = "setPassword.html?uniqueId=" + uniqueId;
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
};