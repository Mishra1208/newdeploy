import { getFirestore, collection, addDoc, getDocs, deleteDoc, query, where, doc } from "firebase/firestore";
// We need to import the initialized app from somewhere, or initialize it here.
// Let's create a dedicated firebase initialization file if it doesn't exist, or just initialize here for firestore.
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "conuplanner-auth.firebaseapp.com",
    projectId: "conuplanner-auth",
    storageBucket: "conuplanner-auth.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/**
 * Subscribes a user to a seat alert.
 */
export async function addSeatAlert(alertData) {
    try {
        // alertData should contain: email, term, subject, courseNumber, classNumber
        const alertsRef = collection(db, "seat_alerts");
        // Check if this exact alert already exists
        const q = query(alertsRef, 
            where("email", "==", alertData.email),
            where("classNumber", "==", alertData.classNumber),
            where("term", "==", alertData.term)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            return { success: false, message: "You are already subscribed to this alert." };
        }

        const docRef = await addDoc(alertsRef, {
            ...alertData,
            createdAt: new Date().toISOString()
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding seat alert:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Gets all pending seat alerts.
 */
export async function getAllSeatAlerts() {
    try {
        const alertsRef = collection(db, "seat_alerts");
        const snapshot = await getDocs(alertsRef);
        const alerts = [];
        snapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() });
        });
        return alerts;
    } catch (error) {
        console.error("Error getting seat alerts:", error);
        return [];
    }
}

/**
 * Deletes a seat alert by ID.
 */
export async function deleteSeatAlert(id) {
    try {
        const alertsRef = collection(db, "seat_alerts");
        await deleteDoc(doc(db, "seat_alerts", id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting seat alert:", error);
        return { success: false };
    }
}
