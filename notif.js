const admin = require('firebase-admin')
const serviceAccount = require('./wecare.json')
const app = require("express");

const route = app.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

route.post("/:id", async (req, res) => {
    console.log("notif body ============= ", req.body);
    // console.log('notif param = ', req.params.id);

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
                                            title: 'urgent notification',
                                            body: `${req.body.data} ${req.body.condition == '>' ? 'diatas' : 'dibawah'} ${req.body.value} ${req.body.data == 'suhu' ? 'C' : req.body.data == 'oxygen' ? '%' : req.body.data == 'blood' ? 'mmHg' : 'bpm'}`
                                        }
                                    }
                                )
                                .then((resp) => {
                                    console.log(resp);
                                    if (resp.responses[0].success) {
                                        res.send('notif')
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

"-----BEGIN CERTIFICATE-----"
"MIIFwzCCBKugAwIBAgIQDNBxzxVMcyYvBIw9+pREizANBgkqhkiG9w0BAQsFADA8"
"MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRwwGgYDVQQDExNBbWF6b24g"
"UlNBIDIwNDggTTAxMB4XDTIzMDUwODAwMDAwMFoXDTI0MDYwNTIzNTk1OVowFzEV"
"MBMGA1UEAwwMKi5jeWNsaWMuYXBwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB"
"CgKCAQEA7IaMHd2TXPH0zzAJZzHWud+9fny17J9Vo/72ZVePiWtbeUVHiN0mjgc1"
"KG/jjPLPdpVenKbLOo2NTibt5I8Tf+Mm1R5EF3lZ9lgLkLz3Ngg5EVW47j9wNSKO"
"qM4/dJrDVuZawyrvUvrkJkGD8B8wFfiETMIOEOj1+eOgrYRyjbzMWTSB5qIIrurK"
"sbmIXY3YnWT8aKZqrOmdNpZjBqeexyymoRuja+WZxqE91jgzI4v71hh/fefNNG71"
"NLzA4lPF634pgQND7zgGMc69Wokj61wuTTakc1YrsqsSqt0ffB6MsoBa/1pEKNgO"
"DyeaGgZv4PS76TiDh++YtF9cpL+v/wIDAQABo4IC5DCCAuAwHwYDVR0jBBgwFoAU"
"gbgOY4qJEhjl+js7UJWf5uWQE4UwHQYDVR0OBBYEFJt+Mb5aEXVbxvByiDgUumOk"
"CnC1MBcGA1UdEQQQMA6CDCouY3ljbGljLmFwcDAOBgNVHQ8BAf8EBAMCBaAwHQYD"
"VR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMDsGA1UdHwQ0MDIwMKAuoCyGKmh0"
"dHA6Ly9jcmwucjJtMDEuYW1hem9udHJ1c3QuY29tL3IybTAxLmNybDATBgNVHSAE"
"DDAKMAgGBmeBDAECATB1BggrBgEFBQcBAQRpMGcwLQYIKwYBBQUHMAGGIWh0dHA6"
"Ly9vY3NwLnIybTAxLmFtYXpvbnRydXN0LmNvbTA2BggrBgEFBQcwAoYqaHR0cDov"
"L2NydC5yMm0wMS5hbWF6b250cnVzdC5jb20vcjJtMDEuY2VyMAwGA1UdEwEB/wQC"
"MAAwggF9BgorBgEEAdZ5AgQCBIIBbQSCAWkBZwB1AHb/iD8KtvuVUcJhzPWHujS0"
"pM27KdxoQgqf5mdMWjp0AAABh/uM99cAAAQDAEYwRAIgQpjdM6cUiDbUq1VvUCYE"
"U4choLEkjsbt+jbtBlZafRsCIHby8Q4IgdYGX+I2Br5Fyu6JcR+Okv3CbAa2PzzR"
"qLJdAHYAc9meiRtMlnigIH1HneayxhzQUV5xGSqMa4AQesF3crUAAAGH+4z3yQAA"
"BAMARzBFAiEAhUNO8TZr9pa4zYlzu841p7gbtRLUZLVLf7asRsgo9FsCIGH5fxbO"
"DsVlELl9m/aJi4/6RRSa/8VFoNfGylZFXZcDAHYASLDja9qmRzQP5WoC+p0w6xxS"
"ActW3SyB2bu/qznYhHMAAAGH+4z3pwAABAMARzBFAiEA/DkiG7a4fAQHSlUtqVjA"
"4d648IWWcFS1ee9zvbdcF7ICIAvwTM9Uah69tQe2MfggNqlePOoWLCORCJECgHmF"
"Xm4VMA0GCSqGSIb3DQEBCwUAA4IBAQBPKispvMxci9VduS6NEseVp7WH7wsXYxDD"
"ZtoPL0Mq3uWvVHdSSW0u+QlPiku/taW7Ndq8tHQcaMcXHrxHlr38L1yCt4j6dAwj"
"Dyf/+7Pa+N3JH03HDEndGZnud8PS1QLbo/M0hz8a8artqsv25IHbfFfU/OR/6yZh"
"QQDQghN3CcUFj8sDivC42WTjbsj+X2wXjNUCD2xxRcrS3uXXnyx/o3WFjRWVb4z9"
"kNYFW+AXA6/X/tgVrNpVAU4t2/7XAg4w0/n79tQl7QvNGLUC5QlI13L3gg13cbIP"
"D7N2c58S63a3uCSBJc90P6BJ884IGSYeldTZqVweexp0TVrBCXaO"
"-----END CERTIFICATE-----"