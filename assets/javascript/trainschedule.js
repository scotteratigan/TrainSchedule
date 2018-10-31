
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
    //train.firstArrival = moment($('#train-first-arrival').val().trim(), "HH:mm").unix();
    // console.log(train.firstArrivalMoment);
    // train.firstArrivalSeconds = train.firstArrivalMoment.unix();
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

db.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDestination = childSnapshot.val().destination;
    let trainFrequency = childSnapshot.val().frequency; // in minutes
    let firstArrival = moment(childSnapshot.val().firstArrival, "HH:mm"); // as a moment
    console.log("First train arrival", firstArrival);
    let firstArrivalMinutes = returnMinutes(firstArrival);
    console.log("First train arrival (minutes)", firstArrivalMinutes);
    let currentTimeMinutes = returnMinutes(moment());
    console.log('Current time minutes', currentTimeMinutes);
    console.log('current time', moment().format('H:mm A'));
    let trainsPassed = Math.floor((currentTimeMinutes - firstArrivalMinutes) / trainFrequency);
    console.log('trains passed', trainsPassed);
    let minutesAway = (currentTimeMinutes - firstArrivalMinutes) % trainFrequency;
    console.log('minutesAway', minutesAway);
    let nextTrainMinutes = returnMinutes(moment()) + minutesAway;
    console.log('nextTrainMinutes', nextTrainMinutes);
    let nextTrainMoment = moment().set({hour:0,minute:0,second:0,millisecond:0});
    nextTrainMoment.add(nextTrainMinutes, 'minutes');
    let nextTrainTime = nextTrainMoment.format('h:mm A');
    console.log('nextTrainTime', nextTrainTime);

    //let timeSinceFirstTrain = firstArrival.diff(moment());
    //console.log('Time since first train', timeSinceFirstTrain);
    
    
    //let trainsPassed = Math.floor(firstArrivalMinutes / trainFrequency);
    //console.log("Trains passed:", trainsPassed);
    //let nextArrivalMinutes = firstArrivalMinutes + (trainsPassed * trainFrequency);
    //console.log("Next arrival minutes", nextArrivalMinutes)
    //let nextTrainTime = moment().minutes(nextArrivalMinutes).format('H:mm A');

    // let minutesAway = firstArrivalMinutes % trainFrequency;
    // console.log('Minutes away', minutesAway);
    // let nextTrainMinutes = moment().minutes() + moment().hours() * 60 + minutesAway;
    // console.log('Next train minutes', nextTrainMinutes);
    // let nextTrainTime = moment().minutes(nextTrainMinutes).format('H:mm A');
    // console.log('Next train time', nextTrainTime);
    



    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $('<td>').text(nextTrainTime),
        $('<td>').text(minutesAway)
        );
    $('#list-of-trains').append(newRow);
});

$(document).ready( ()=> {
    let timeDisplay = moment().format('hh:mm:ss A')
    console.log('Displaying time');
    $('#header').text(timeDisplay);
})

$("#add-train").click(function() {
    event.preventDefault();
    addNewTrain();
});