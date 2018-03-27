var config = {
    apiKey: "AIzaSyBssuO8vtmBWuIdwz8J1bBxi8NCN2QMcZs",
    authDomain: "train-scheduler-bf4af.firebaseapp.com",
    databaseURL: "https://train-scheduler-bf4af.firebaseio.com",
    projectId: "train-scheduler-bf4af",
    storageBucket: "train-scheduler-bf4af.appspot.com",
    messagingSenderId: "150799690256"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
    var freq = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        freq: freq
    };

    database.ref().push(newTrain);

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var freq = childSnapshot.val().freq;

    firstTrainTime = moment.unix(firstTrainTime).format("HH:mm");

    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "days");
 
    var diffTime = moment().diff(firstTimeConverted, "minutes");

    var remainder = (diffTime - 1440) % freq;

    var minsAway = freq - remainder;

    var nextArrival = moment().add(minsAway, "minutes");

    nextArrival = moment(nextArrival).format("LT");

    $("#train-info-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        freq + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
});
