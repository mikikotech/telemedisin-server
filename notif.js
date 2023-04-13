const admin = require('firebase-admin')
const serviceAccount = require('./wecare.json')
const app = require("express");

const route = app.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

route.get("/", async (req, res) => {
    // console.log("notif body = ", req.body);

    res.send('notif')
    try {

        var data = admin.firestore()
            .collection('fcmToken')
            .doc('fcmToken')
            .get()
            .then((data) => {
                console.log(data.data());

                var fcm_token = data.data().fcm_token

                if (data.data() != undefined) {
                    admin.messaging()
                        .sendMulticast(
                            {
                                data: {
                                    message: 'urgent notification'
                                },
                                tokens: fcm_token,
                                notification: {
                                    title: 'urgent notification',
                                    body: 'suhu pasien tinggi'
                                }
                            }
                        )
                        .then((resp) => {
                            console.log(resp);
                        })
                }
            })
            .catch((e) => { console.log(e); })
    } catch (error) {
        res.status(400).send("error");
    }
});

module.exports = route;