/**
 * DATABASE CONFIGURATION
 * To make this work "ANIWARYEN", you need to:
 * 1. Go to console.firebase.google.com
 * 2. Create a project and get your "Firebase Config" keys
 * 3. Replace the placeholder below with your actual keys
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (This requires the Firebase SDK scripts in your HTML)
let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (e) {
    console.warn("Firebase not initialized. Falling back to LocalStorage.");
}

const DATABASE = {
    // Save an order to the cloud
    async saveOrder(orderData) {
        console.log("Saving order...", orderData);
        
        // 1. Always save to LocalStorage as a backup
        let localOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
        localOrders.push(orderData);
        localStorage.setItem('eomm_orders', JSON.stringify(localOrders));

        // 2. Try to save to Cloud (Firebase)
        if (db) {
            try {
                // If image is too large, we store a placeholder or use Storage
                // For now, Firestore handles up to 1MB per document
                await db.collection("orders").add(orderData);
                console.log("Saved to Cloud successfully!");
                return true;
            } catch (error) {
                console.error("Cloud Save Failed:", error);
                return false;
            }
        }
        return false;
    },

    // Fetch all orders for the Admin Panel
    async getOrders(callback) {
        if (db) {
            // Real-time listener for any device
            db.collection("orders").orderBy("date", "desc")
                .onSnapshot((querySnapshot) => {
                    const orders = [];
                    querySnapshot.forEach((doc) => {
                        orders.push({ id: doc.id, ...doc.data() });
                    });
                    callback(orders);
                });
        } else {
            // Fallback to local if no cloud setup
            const localOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
            callback(localOrders.reverse());
        }
    }
};
