/**
 * DATABASE CONFIGURATION
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// detect if keys are still placeholders
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let db = null;
if (isConfigured && typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
}

const DATABASE = {
    // Save an order
    async saveOrder(orderData) {
        // 1. ALWAYS save to LocalStorage first (Instant local save)
        try {
            let localOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
            localOrders.push(orderData);
            localStorage.setItem('eomm_orders', JSON.stringify(localOrders));
        } catch (e) { console.error("Local storage error", e); }

        // 2. Try Cloud sync only if keys are setup
        if (db) {
            try {
                // 5 second timeout to prevent hanging on "Processing..."
                const cloudPromise = db.collection("orders").add(orderData);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));

                await Promise.race([cloudPromise, timeoutPromise]);
                return true;
            } catch (error) {
                console.error("Cloud connectivity issue:", error);
                return true; // Still return success because it's in LocalStorage
            }
        }

        return true;
    },

    // Fetch all orders
    async getOrders(callback) {
        if (db) {
            db.collection("orders").orderBy("date", "desc")
                .onSnapshot((querySnapshot) => {
                    const orders = [];
                    querySnapshot.forEach((doc) => {
                        orders.push({ id: doc.id, ...doc.data() });
                    });
                    callback(orders);
                }, (error) => {
                    console.error("Cloud read error:", error);
                    // Fallback to local on error
                    const localOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
                    callback(localOrders.reverse());
                });
        } else {
            const localOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
            callback(localOrders.slice().reverse());
        }
    }
};
