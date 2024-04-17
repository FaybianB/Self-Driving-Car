// Define the Controls class
class Controls {
    // Constructor for the Controls class, takes a type as argument
    constructor(type) {
        // Initialize the control states
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        // Switch case to handle different types of controls
        switch(type) {
            // If the type is "KEYS", add keyboard listeners
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            // If the type is "DUMMY", set forward to true
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    // Private method to add keyboard listeners
    #addKeyboardListeners() {
        // On key down event, set the corresponding control state to true
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        };

        // On key up event, set the corresponding control state to false
        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        };
    }
}
