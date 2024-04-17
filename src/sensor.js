// Define the Sensor class
class Sensor {
    // Constructor for the Sensor class, takes a car object
    constructor(car) {
        // Assign the car object to this instance of the Sensor class
        this.car = car;
        // Set the number of rays to be cast by the sensor
        this.rayCount = 5;
        // Set the length of the rays to be cast by the sensor
        this.rayLength = 150;
        // Set the spread of the rays to be cast by the sensor
        this.raySpread = Math.PI / 2;
        // Initialize an empty array to hold the rays
        this.rays = [];
        // Initialize an empty array to hold the readings from the rays
        this.readings = [];
    }

    // Method to update the sensor readings based on the road borders and traffic
    update(roadBorders, traffic) {
        // Cast the rays from the sensor
        this.#castRays();

        // Reset the readings array
        this.readings = [];

        // For each ray, get a reading and add it to the readings array
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    // Private method to get a reading from a ray
    #getReading(ray, roadBorders, traffic) {
        // Initialize an empty array to hold the intersections of the ray
        let touches = [];

        // For each road border, check if the ray intersects it
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );

            // If the ray intersects the road border, add the intersection to the touches array
            if (touch) {
                touches.push(touch);
            }
        }

        // For each vehicle in traffic, check if the ray intersects it
        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;

            // For each edge of the vehicle's polygon, check if the ray intersects it
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );

                // If the ray intersects the vehicle, add the intersection to the touches array
                if (value) {
                    touches.push(value);
                }
            }
        }

        // If the ray did not intersect anything, return null
        if (touches.length == 0) {
            return null;
        } else {
            // Otherwise, return the intersection with the smallest offset
            const offsets = touches.map((e) => e.offset);
            const minOffset = Math.min(...offsets);

            return touches.find((e) => e.offset == minOffset);
        }
    }

    // Private method to cast rays from the sensor
    #castRays() {
        // Reset the rays array
        this.rays = [];

        // For each ray to be cast
        for (let i = 0; i < this.rayCount; i++) {
            // Calculate the angle of the ray
            const rayAngle =
                lerp(
                    this.raySpread / 2,
                    -this.raySpread / 2,
                    this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
                ) + this.car.angle;

            // Define the start and end points of the ray
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };

            // Add the ray to the rays array
            this.rays.push([start, end]);
        }
    }

    // Method to draw the sensor readings on a canvas context
    draw(ctx) {
        // For each ray
        for (let i = 0; i < this.rayCount; i++) {
            // Define the end point of the ray
            let end = this.rays[i][1];

            // If there is a reading for the ray, set the end point to the reading
            if (this.readings[i]) {
                end = this.readings[i];
            }

            // Draw the ray on the canvas
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw the end point of the ray on the canvas
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}