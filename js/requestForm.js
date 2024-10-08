// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference your database
var requestFormDB = firebase.database().ref("RequestForm");
var donorFormDB = firebase.database().ref("DonorForm");

// Function to save messages
const saveMessages = (name, emailid, contactno, requesttype, address, age, height, weight, gender, organType, bloodInputType) => {
    // Save the message to Firebase
    var newrequestForm = requestFormDB.push();

    newrequestForm.set({
        name: name,
        emailid: emailid,
        contactno: contactno,
        requesttype: requesttype,
        address: address,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        organType: organType,
        bloodType: bloodInputType
    });

    // Try matching with donors
    matchDonorsWithRequests(requesttype, organType, bloodInputType, {
        name: name,
        contactno: contactno,
        requesttype: requesttype,
        address: address,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        organType: organType,
        bloodInputType: bloodInputType
    });
};

// Function to match donors with requests and send SMS notification
function matchDonorsWithRequests(requestType, organType, bloodType, messageData) {
    // Reference to the donor form entries
    donorFormDB.once('value', function (donorSnapshot) {
        donorSnapshot.forEach(function (donorChildSnapshot) {
            var donorData = donorChildSnapshot.val();
            var donorType = donorData.donortype;
            var donorOrganType = donorData.organType;
            var donorBloodType = donorData.bloodType;

            // Perform matching based on requestType, donorType, and bloodType
            if (requestType === "Blood" && bloodType === donorBloodType && requestType === donorType) {
                // Match found for blood type, send SMS to the donor
                sendSMSNotification(donorData, messageData);
            } else if (requestType === "Organ" && organType === donorOrganType && requestType === donorType) {
                // Match found for organ type, send SMS to the donor with different template
                sendOrganSMSNotification(donorData, messageData);
            }
        });
    });
}

// Function to send SMS notification for organ request using a different template
const sendOrganSMSNotification = (donorData, messageData) => {
    // Send email using EmailJS with organ-specific template
    const serviceID = 'default_service';
    const templateID = 'template_pnop02c';
    const templateParams = {
        to_name: donorData.name,
        name: messageData.name,
        contact: messageData.contactno,
        emailid: messageData.emailid,
        address: messageData.address,
        age: messageData.age,
        gender: messageData.gender,
        bloodtype: messageData.bloodInputType,
        organtype: messageData.organType,
        to_email: donorData.emailid
    };
    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            console.log('Organ request email sent successfully!');
            window.location.href = 'search.html';
        })
        .catch((error) => {
            console.error('Error sending organ request email:', error);
        });
};

// Function to send SMS notification and email using EmailJS
const sendSMSNotification = (donorData, messageData) => {
    // Send email using EmailJS
    const serviceID = 'default_service';
    const templateID = 'template_b7y06fn';
    const templateParams = {
        to_name: donorData.name,
        name: messageData.name,
        contact: messageData.contactno,
        emailid: messageData.emailid,
        address: messageData.address,
        age: messageData.age,
        gender: messageData.gender,
        bloodtype: messageData.bloodInputType,
        to_email: donorData.emailid
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            console.log('Email sent successfully!');
            window.location.href = 'search.html';
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
};


// Submit form event listener
document.getElementById("requestForm").addEventListener("submit", submitForm);

// Request type change event listener
document.getElementById('requesttype').addEventListener('change', function () {
    var requestType = this.value;
    var organInput = document.getElementById("organInput");

    if (requestType === "Organ") {
        organInput.style.display = "block";
    } else {
        organInput.style.display = "none";
    }
});

// Function to submit form
function submitForm(e) {
    e.preventDefault();

    var name = getElementVal("name");
    var emailid = getElementVal("emailid");
    var contactno = getElementVal("contactno");
    var gender = getElementVal("gender");
    var age = getElementVal("age");
    var weight = getElementVal("weight");
    var height = getElementVal("height");
    var bloodInputType = getElementVal("bloodTypeInput");
    var requesttype = getElementVal("requesttype");
    var address = getElementVal("address");
    var organType = getElementVal("organType");

    // Check if any required field is empty
    if (name === "" || emailid === "" || contactno === "" || requesttype === "" || address === "" || age === "" || height === "" || weight === "" || gender === "") {
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

    // Save messages to Firebase
    saveMessages(name, emailid, contactno, requesttype, address, age, height, weight, gender, organType, bloodInputType);

    // Enable alert
    document.querySelector(".alert").style.display = "block";

    // Remove the alert
    setTimeout(() => {
        document.querySelector(".alert").style.display = "none";
    }, 3000);

    // Reset the form
    document.getElementById("requestForm").reset();
}

// Function to get element value
const getElementVal = (id) => {
    return document.getElementById(id).value;
};
