import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote = (productID) => {
    const votesRef = ref(database, "votes");
    const newVoteRef = push(votesRef);

    return set(newVoteRef, {
        productID: productID,
        timestamp: Date.now()
    })
        .then(() => {
            return {
                status: true,
                message: "Voto guardado exitosamente."
            };
        })
        .catch((error) => {
            return {
                status: false,
                message: `Error al guardar el voto: ${error.message}`
            };
        });
};

export { saveVote };