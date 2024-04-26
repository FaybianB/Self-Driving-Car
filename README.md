# Self-Driving Car

![Self-Driving Car](media/SelfDrivingCar.gif)

This is a self-driving car simulation implemented using pure Javascript.

## Features

-   The simulation features a neural network that controls the car's movements.
-   The car is equipped with sensors to detect its surroundings and uses a brain, modeled as a neural network, to make decisions based on the sensor data.
-   The car's brain can be saved and loaded from local storage, allowing for continuous learning across multiple sessions.
-   The simulation also includes a road with multiple lanes and dummy traffic to create a realistic driving environment.
-   The car's performance can be visualized in real-time on a separate canvas.
-   The simulation is designed to be flexible, supporting multiple cars and different control types.

## How To Run

To run the Self-Driving Car simulation:

1)   Open the `index.html` file in a browser.
2)   Watch the cars perform.
3)   If all of the cars fail to pass the traffic cars then save the brain of the best performing car by clicking the save (disk) button and refreshing the page.
    -   All of the cars should use the brain of the best performing car as their basis and adjust their performance.
4)   Repeat process until a car makes it pass the traffic cars and save it's brain.
