# EOMM Sri Lanka Edition Website

This is the website for the "Essentials of Modern Marketing - Sri Lanka Edition" book. 
It is a fully responsive, modern website built with HTML, CSS (Tailwind), and JavaScript.

## How to Run

1.  Simply double-click `index.html` to open the website in your browser.
2.  Navigate to "Buy Now" to see the order form.

## Adding Your Images

To use your own images (Book Cover and Logo):

1.  Go to the `assets/images` folder.
2.  Save your **Book Cover** image there as `book.png` (or drag and rename it).
3.  Save your **Logo** image there as `logo.png`.
4.  If you want to use the logo, open `index.html`, `order.html`, and `contact.html` and change `src="assets/images/logo.svg"` to `src="assets/images/logo.png"`.

## Features

-   **Home Page**: Eye-catching design with 3D floating book animation.
-   **Order Page**: Form to collect Name, Address, Mobile, and Payment Slip (file upload).
-   **Contact Page**: Details about the location and contact info.
-   **No Node.js Required**: This runs purely on the browser.
-   **Design**: "Supiri" premium look with purple gradients and glassmorphism.

## Note

Since there is no backend server (Node.js was requested to be avoided), the "Place Order" button currently simulates a successful submission. For a real website, you would need to connect this form to a backend service or use a tool like Formspree.
