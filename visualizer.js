// Define the Visualizer class
class Visualizer {
    // Static method to draw the network on the canvas
    static drawNetwork(ctx, network) {
        // Define the margin around the network
        const margin = 50;
        // Define the left boundary of the network
        const left = margin;
        // Define the top boundary of the network
        const top = margin;
        // Define the width of the network
        const width = ctx.canvas.width - margin * 2;
        // Define the height of the network
        const height = ctx.canvas.height - margin * 2;
        // Define the height of each level in the network
        const levelHeight = height / network.levels.length;

        // Loop through each level in the network
        for (let i = network.levels.length - 1; i >= 0; i--) {
            // Calculate the top position of the current level
            const levelTop =
                top +
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5
                        : i / (network.levels.length - 1)
                );

            // Set the line dash pattern for the level
            ctx.setLineDash([7, 3]);

            // Draw the current level
            Visualizer.drawLevel(
                ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i == network.levels.length - 1 ? ["↑", "←", "→", "↓"] : []
            );
        }
    }

    // Static method to draw a level on the canvas
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        // Define the right boundary of the level
        const right = left + width;
        // Define the bottom boundary of the level
        const bottom = top + height;
        // Destructure the inputs, outputs, weights, and biases from the level
        const { inputs, outputs, weights, biases } = level;

        // Loop through each input and output pair
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                // Begin a new path for the pair
                ctx.beginPath();

                // Move the drawing cursor to the input
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );

                // Draw a line to the output
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

                // Set the line width for the pair
                ctx.lineWidth = 2;

                // Set the color for the pair based on the weight
                ctx.strokeStyle = getRGBA(weights[i][j]);

                // Apply the stroke to the path, drawing the pair
                ctx.stroke();
            }
        }

        // Define the radius of the nodes
        const nodeRadius = 18;

        // Loop through each input
        for (let i = 0; i < inputs.length; i++) {
            // Calculate the x position of the input
            const x = Visualizer.#getNodeX(inputs, i, left, right);

            // Begin a new path for the input
            ctx.beginPath();

            // Draw a circle for the input
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);

            // Set the fill color for the input
            ctx.fillStyle = "black";

            // Fill the input circle
            ctx.fill();

            // Begin a new path for the input
            ctx.beginPath();

            // Draw a smaller circle inside the input
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);

            // Set the fill color for the smaller circle based on the input value
            ctx.fillStyle = getRGBA(inputs[i]);

            // Fill the smaller circle
            ctx.fill();
        }

        // Loop through each output
        for (let i = 0; i < outputs.length; i++) {
            // Calculate the x position of the output
            const x = Visualizer.#getNodeX(outputs, i, left, right);

            // Begin a new path for the output
            ctx.beginPath();

            // Draw a circle for the output
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);

            // Set the fill color for the output
            ctx.fillStyle = "black";

            // Fill the output circle
            ctx.fill();

            // Begin a new path for the output
            ctx.beginPath();

            // Draw a smaller circle inside the output
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);

            // Set the fill color for the smaller circle based on the output value
            ctx.fillStyle = getRGBA(outputs[i]);

            // Fill the smaller circle
            ctx.fill();

            // Begin a new path for the output
            ctx.beginPath();

            // Set the line width for the output
            ctx.lineWidth = 2;

            // Draw a circle around the output
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);

            // Set the color for the circle based on the bias
            ctx.strokeStyle = getRGBA(biases[i]);

            // Set the line dash pattern for the circle
            ctx.setLineDash([3, 3]);

            // Apply the stroke to the path, drawing the circle
            ctx.stroke();

            // Reset the line dash pattern
            ctx.setLineDash([]);

            // If there is a label for the output
            if (outputLabels[i]) {
                // Begin a new path for the label
                ctx.beginPath();
                // Set the text alignment for the label
                ctx.textAlign = "center";
                // Set the text baseline for the label
                ctx.textBaseline = "middle";
                // Set the fill color for the label
                ctx.fillStyle = "black";
                // Set the stroke color for the label
                ctx.strokeStyle = "white";
                // Set the font for the label
                ctx.font = nodeRadius * 1.5 + "px Arial";
                // Draw the label text
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                // Set the line width for the label
                ctx.lineWidth = 0.5;
                // Apply the stroke to the text, drawing the label
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    // Static private method to calculate the x position of a node
    static #getNodeX(nodes, index, left, right) {
        // Return the interpolated x position of the node
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}