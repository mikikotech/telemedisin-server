const admin = require('firebase-admin')
const serviceAccount = require('./wecare.json')
const app = require("express");

const route = app.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

route.post("/:id", async (req, res) => {

    try {

        admin.firestore()
            .collection('patient')
            .where('sensor_id', '==', req.params.id)
            .get()
            .then((resp) => {
                // console.log('pasien id = ', resp.docs[0].data());

                var data = admin.firestore()
                    .collection('fcmToken')
                    .doc('fcmToken')
                    .get()
                    .then((data) => {
                        // console.log(data.data());

                        var fcm_token = data.data().fcm_token

                        if (data.data() != undefined) {
                            admin.messaging()
                                .sendMulticast(
                                    {
                                        data: {
                                            id: resp.docs[0].data().id,
                                            patient_name: resp.docs[0].data().name
                                        },
                                        tokens: fcm_token,
                                        notification: {
                                            title: 'Urgent Notification',
                                            body: `UpNormal Condition, Patient ${req.body.data == 'temp' ? 'Body Temperature' : req.body.data == 'oxygen' ? 'Oxygen Saturation' : req.body.data == 'blood' ? 'Blood Pressure' : 'Heart Rate'} is ${req.body.value} ${req.body.data == 'temp' ? '°C' : req.body.data == 'oxygen' ? '%' : req.body.data == 'blood' ? 'mmHg' : 'bpm'}`
                                        }
                                    }
                                )
                                .then((resp) => {
                                    console.log(resp);
                                    if (resp.responses[0].success) {
                                        res.send('notif send')
                                    } else {
                                        res.send('failed')
                                    }
                                })
                        }
                    })
                    .catch((e) => { console.log(e); })

            })
    } catch (error) {
        res.status(400).send("error");
    }
});

module.exports = route;