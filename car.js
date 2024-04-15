// Define the Car class
class Car {
    // Constructor for the Car class, takes x and y coordinates, width, height, control type, and max speed
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        // Set the x and y coordinates of the car
        this.x = x;
        this.y = y;
        // Set the width and height of the car
        this.width = width;
        this.height = height;
        // Initialize the speed of the car
        this.speed = 0;
        // Set the acceleration of the car
        this.acceleration = 0.2;
        // Set the max speed of the car
        this.maxSpeed = maxSpeed;
        // Set the friction of the car
        this.friction = 0.05;
        // Initialize the angle of the car
        this.angle = 0;
        // Initialize the damage status of the car
        this.damaged = false;
        // Set whether the car uses AI control
        this.useBrain = controlType == "AI";

        // If the car is not a dummy car, initialize the sensor and brain
        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }

        // Initialize the controls of the car
        this.controls = new Controls(controlType);
    }

    // Method to update the car's status
    update(roadBorders, traffic) {
        // If the car is not damaged, move the car and check for damage
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        // If the car has a sensor, update the sensor and control the car based on the sensor readings
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map((s) =>
                s == null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    // Private method to assess damage to the car
    #assessDamage(roadBorders, traffic) {
        // Check for collision with road borders
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        // Check for collision with other cars
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        // If no collision was detected, return false
        return false;
    }

    // Private method to create a polygon representing the car
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        // Calculate the points of the polygon
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        // Return the points of the polygon
        return points;
    }

    // Private method to move the car
    #move() {
        // Adjust the speed of the car based on the controls
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        // Limit the speed of the car
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }
        // Apply friction to the car's speed
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        // Stop the car if the speed is below the friction
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        // Adjust the angle of the car based on the controls and speed
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
        // Move the car based on the speed and angle
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    // Method to draw the car on a canvas context
    draw(ctx, color, drawSensor = false) {
        // Set the fill color based on the damage status of the car
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        // Draw the car's polygon
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        // If the car has a sensor and the sensor should be drawn, draw the sensor
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }
}