
// Get the carCanvas element from the DOM
const carCanvas = document.getElementById("carCanvas");
// Set the width of the carCanvas
carCanvas.width = 200;
// Get the networkCanvas element from the DOM
const networkCanvas = document.getElementById("networkCanvas");
// Set the width of the networkCanvas
networkCanvas.width = 400;

// Get the 2D context of the carCanvas
const carCtx = carCanvas.getContext("2d");
// Get the 2D context of the networkCanvas
const networkCtx = networkCanvas.getContext("2d");
// Create a new Road object
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// Set the number of cars
const N = 2;
// Generate the cars
const cars = generateCars(N);
// Set the best car to the first car
let bestCar = cars[0];

// If there is a bestBrain in local storage
if (localStorage.getItem("bestBrain")) {
    // For each car
    for (let i = 0; i < cars.length; i++) {
        // Set the car's brain to the bestBrain from local storage
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

        // If the car is not the first car
        if (i != 0) {
            // Mutate the car's brain
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

// Create the traffic
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

// Start the animation
animate();

// Function to save the bestBrain to local storage
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Function to remove the bestBrain from local storage
function discard() {
    localStorage.removeItem("bestBrain");
}

// Function to generate the cars
function generateCars(N) {
    const cars = [];

    // For each car
    for (let i = 1; i < N; i++) {
        // Add a new Car object to the cars array
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    // Return the cars array
    return cars;
}

// Function to animate the cars and traffic
function animate(time) {
    // For each car in traffic
    for (let i = 0; i < traffic.length; i++) {
        // Update the car
        traffic[i].update(road.borders, []);
    }
    // For each car
    for (let i = 0; i < cars.length; i++) {
        // Update the car
        cars[i].update(road.borders, traffic);
    }

    // Set the best car to the car with the smallest y value
    bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
    // Set the height of the carCanvas to the height of the window
    carCanvas.height = window.innerHeight;
    // Set the height of the networkCanvas to the height of the window
    networkCanvas.height = window.innerHeight;

    // Save the current state of the carCtx
    carCtx.save();

    // Translate the carCtx
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    // Draw the road
    road.draw(carCtx);

    // For each car in traffic
    for (let i = 0; i < traffic.length; i++) {
        // Draw the car
        traffic[i].draw(carCtx, "red");
    }

    // Set the globalAlpha of the carCtx to 0.2
    carCtx.globalAlpha = 0.2;

    // For each car
    for (let i = 0; i < cars.length; i++) {
        // Draw the car
        cars[i].draw(carCtx, "blue");
    }

    // Set the globalAlpha of the carCtx to 1
    carCtx.globalAlpha = 1;

    // Draw the best car
    bestCar.draw(carCtx, "blue", true);

    // Restore the carCtx to its original state
    carCtx.restore();

    // Set the lineDashOffset of the networkCtx
    networkCtx.lineDashOffset = -time / 50;

    // Draw the network of the best car
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    // Request the next animation frame
    requestAnimationFrame(animate);
}