
// Function to perform linear interpolation between two points A and B
function lerp(A, B, t) {
    // Return the interpolated value
    return A + (B - A) * t;
}

// Function to find the intersection point of two line segments AB and CD
function getIntersection(A, B, C, D) {
    // Calculate the numerator of the t parameter
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    // Calculate the numerator of the u parameter
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    // Calculate the denominator for both t and u parameters
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    // If the denominator is not zero (lines are not parallel)
    if (bottom != 0) {
        // Calculate the t parameter
        const t = tTop / bottom;
        // Calculate the u parameter
        const u = uTop / bottom;

        // If t and u are within the range [0, 1], the intersection is within the line segments
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            // Return the intersection point and the offset along AB
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    // If no intersection was found, return null
    return null;
}

// Function to check if two polygons intersect
function polysIntersect(poly1, poly2) {
    // For each edge in the first polygon
    for (let i = 0; i < poly1.length; i++) {
        // For each edge in the second polygon
        for (let j = 0; j < poly2.length; j++) {
            // Check if the edges intersect
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );

            // If an intersection was found, the polygons intersect
            if (touch) {
                return true;
            }
        }
    }

    // If no intersection was found, the polygons do not intersect
    return false;
}

// Function to convert a value to an RGBA color
function getRGBA(value) {
    // Calculate the alpha channel as the absolute value
    const alpha = Math.abs(value);
    // If the value is negative, R and G are 0, otherwise they are 255
    const R = value < 0 ? 0 : 255;
    const G = R;
    // If the value is positive, B is 0, otherwise it is 255
    const B = value > 0 ? 0 : 255;
    // Return the RGBA color string
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}