
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
    train.firstArrival = moment($('#train-first-arrival').val().trim(), "HH:mm").unix();
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

db.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDestination = childSnapshot.val().destination;
    let trainFrequency = childSnapshot.val().frequency;
    let firstArrival = moment(childSnapshot.val().firstArrival);
    let diff = firstArrival.diff(moment().unix()) / 60;
    let minutesRemaining = diff % trainFrequency;
    console.log(diff);
    console.log(minutesRemaining);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency)
        );
    $('#list-of-trains').append(newRow);
});

$("#add-train").click(function() {
    event.preventDefault();
    addNewTrain();
});