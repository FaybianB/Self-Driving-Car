
// Define the NeuralNetwork class
class NeuralNetwork {
    // Constructor for the NeuralNetwork class, takes an array of neuron counts for each level
    constructor(neuronCounts) {
        // Initialize an empty array to hold the levels of the network
        this.levels = [];

        // Loop through the neuronCounts array, creating a new Level for each pair of counts
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    // Static method to feed inputs forward through the network
    static feedForward(givenInputs, network) {
        // Feed the inputs through the first level of the network
        let outputs = Level.feedForward(givenInputs, network.levels[0]);

        // Feed the outputs of each level as inputs to the next level
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        // Return the final outputs of the network
        return outputs;
    }

    // Static method to mutate the weights and biases of the network
    static mutate(network, amount = 1) {
        // Loop through each level of the network
        network.levels.forEach((level) => {
            // Loop through each bias in the level
            for (let i = 0; i < level.biases.length; i++) {
                // Mutate the bias by a random amount, scaled by the given amount
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            // Loop through each weight in the level
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    // Mutate the weight by a random amount, scaled by the given amount
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
        });
    }
}

// Define the Level class
class Level {
    // Constructor for the Level class, takes the number of inputs and outputs for the level
    constructor(inputCount, outputCount) {
        // Initialize arrays for the inputs, outputs, and biases of the level
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        // Initialize an empty array to hold the weights of the level
        this.weights = [];

        // Create an array of weights for each input
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        // Randomize the weights and biases of the level
        Level.#randomize(this);
    }

    // Static method to randomize the weights and biases of a level
    static #randomize(level) {
        // Loop through each input and output pair
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                // Assign a random weight to the pair
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        // Loop through each bias in the level
        for (let i = 0; i < level.biases.length; i++) {
            // Assign a random value to the bias
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // Static method to feed inputs forward through a level
    static feedForward(givenInputs, level) {
        // Assign the given inputs to the level
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        // Loop through each output in the level
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;

            // Calculate the weighted sum of the inputs
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // Apply the activation function to the sum
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        // Return the outputs of the level
        return level.outputs;
    }
}