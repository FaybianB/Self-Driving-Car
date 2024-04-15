// Define the Road class
class Road {
    // Constructor for the Road class, takes the x position, width, and lane count (default 3)
    constructor(x, width, laneCount = 3) {
        // Set the x position of the road
        this.x = x;
        // Set the width of the road
        this.width = width;
        // Set the number of lanes on the road
        this.laneCount = laneCount;
        // Calculate the left boundary of the road
        this.left = x - width / 2;
        // Calculate the right boundary of the road
        this.right = x + width / 2;
        // Define a large number to represent infinity
        const infinity = 1000000;
        // Set the top boundary of the road to negative infinity
        this.top = -infinity;
        // Set the bottom boundary of the road to positive infinity
        this.bottom = infinity;
        // Define the top left corner of the road
        const topLeft = { x: this.left, y: this.top };
        // Define the top right corner of the road
        const topRight = { x: this.right, y: this.top };
        // Define the bottom left corner of the road
        const bottomLeft = { x: this.left, y: this.bottom };
        // Define the bottom right corner of the road
        const bottomRight = { x: this.right, y: this.bottom };
        // Define the borders of the road
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];
    }

    // Method to get the center of a lane given its index
    getLaneCenter(laneIndex) {
        // Calculate the width of a lane
        const laneWidth = this.width / this.laneCount;

        // Return the x position of the center of the lane
        return (
            this.left +
            laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth
        );
    }

    // Method to draw the road on a canvas context
    draw(ctx) {
        // Set the line width for drawing the road
        ctx.lineWidth = 5;

        // Set the color for drawing the road
        ctx.strokeStyle = "white";

        // Draw the lanes of the road
        for (let i = 1; i <= this.laneCount - 1; i++) {
            // Calculate the x position of the lane
            const x = lerp(this.left, this.right, i / this.laneCount);

            // Set the line dash pattern for drawing the lane
            ctx.setLineDash([20, 20]);

            // Begin a new path for the lane
            ctx.beginPath();

            // Move the drawing cursor to the top of the lane
            ctx.moveTo(x, this.top);

            // Draw a line to the bottom of the lane
            ctx.lineTo(x, this.bottom);

            // Apply the stroke to the path, drawing the lane
            ctx.stroke();
        }

        // Reset the line dash pattern
        ctx.setLineDash([]);

        // Draw the borders of the road
        this.borders.forEach(border => {
            // Begin a new path for the border
            ctx.beginPath();

            // Move the drawing cursor to the start of the border
            ctx.moveTo(border[0].x, border[0].y);

            // Draw a line to the end of the border
            ctx.lineTo(border[1].x, border[1].y);

            // Apply the stroke to the path, drawing the border
            ctx.stroke();
        });
    }
}