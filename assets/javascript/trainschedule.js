
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCUBW6TfzBqHi8IsDgFINFcaTo0KCUWzlc",
    authDomain: "trainscheduler-22d4f.firebaseapp.com",
    databaseURL: "https://trainscheduler-22d4f.firebaseio.com",
    projectId: "trainscheduler-22d4f",
    storageBucket: "trainscheduler-22d4f.appspot.com",
    messagingSenderId: "386350809646"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

function addNewTrain() {
    let train = {};
    train.name = $('#train-name').val().trim();
    train.destination = $('#train-destination').val().trim();
    train.frequency = $('#train-frequency').val().trim();
    console.log($('#train-first-arrival').val().trim());
    train.firstArrival = $('#train-first-arrival').val().trim();
    console.log(train.firstArrival);
    // todo: highlight required field of omitted?
    if (train.name && train.destination && train.frequency && train.firstArrival) {
        console.log("You're adding a train!");
        console.log(train.name, train.destination, train.frequency, train.firstArrival);
        db.ref().push(train);
    }
    else {
        console.log("Not adding train - you didn't enter all the info!");
    }
}

function returnMinutes(moment) {
    return moment.hours() * 60 + moment.minutes();
}

function minutesToMoment(minutesInput) {
    let hours = Math.floor(minutesInput / 60);
    let minutes = minutesInput - (hours * 60);
    return moment(`${hours}:${minutes}`, 'hh:mm A');
}

function updateClock() {
    let timeDisplay = moment().format('hh:mm:ss A');
    $('#header').text('Schedule ' + timeDisplay);
}

db.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    let trainName = childSnapshot.val().name;
    let trainDestination = childSnapshot.val().destination;
    let trainFrequency = parseInt(childSnapshot.val().frequency); // in minutes
    let firstArrival = moment(childSnapshot.val().firstArrival, "hh:mm"); // as a moment
    let firstArrivalMinutes = returnMinutes(firstArrival); // time of first arrival train, in minutes
    let currentTimeMinutes = returnMinutes(moment()); // current time in minutes
    let trainsPassed = Math.floor((currentTimeMinutes - firstArrivalMinutes) / trainFrequency); // the number of trains that have passed by today
    let nextTrainMinutes = (trainsPassed * trainFrequency) + firstArrivalMinutes + trainFrequency; // minute in day when next train will arrive
    let nextTrainTime = minutesToMoment(nextTrainMinutes); // moment that next train will arrive
    //let nextTrainDisplay = nextTrainTime.format('hh:mm A'); 
    let minutesAway = nextTrainTime.diff(moment(), 'minutes'); // minutes until next train

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        //$('<td>').text(nextTrainDisplay),
        $("<td>").text(nextTrainTime.format('hh:mm A')),
        $('<td>').text(minutesAway)
        );
    $('#list-of-trains').append(newRow);
});

$(document).ready( ()=> {
    updateClock();
})

setInterval(updateClock, 1000);

$("#add-train").click(function() {
    event.preventDefault();
    addNewTrain();
});