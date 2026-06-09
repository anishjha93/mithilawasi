import admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin
// Make sure serviceAccount.json is in the root directory
try {
    const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf8"));

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("❌ Error loading serviceAccount.json. Make sure you downloaded it from Firebase Console and placed it in the root directory.");
    process.exit(1);
}

// REPLACE THIS WITH YOUR ACTUAL FCM TOKEN FROM THE BROWSER CONSOLE
const token = "dKeTqF_uPPeAc5_IwTcnxg:APA91bFIClAUT_J1eicBgPOs0oTh2Y33KsrgiyxE11lUS7gXRCSCE9ZMBQz4md-jJZthpHd2BJfv0nSFH1Bg2NltP7lSkWFpsDf33D3BrSaru2t6NeiVsqA";

if (token === "PASTE_FCM_TOKEN_HERE") {
    console.error("❌ Please replace 'PASTE_FCM_TOKEN_HERE' with your actual FCM token in sendPanchang.mjs");
    process.exit(1);
}

const message = {
    notification: {
        title: "🪔 आज का मिथिला पंचांग",
        body: "तिथि: द्वितीया | शुभ समय: प्रातः 7:10–8:45"
    },
    token
};

console.log("🚀 Sending notification...");

admin.messaging().send(message)
    .then((response) => {
        console.log("✅ Panchang notification sent successfully:", response);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error sending notification:", error);
        process.exit(1);
    });
