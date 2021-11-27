const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs')

//==============================================
const multer = require('multer')
const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

//==============================================

var admin = require("firebase-admin");

var serviceAccount = {

    "type": "service_account",
    "project_id": "upload-file-nodejs-11f9a",
    "private_key_id": "3d3edcfb4e1208fe8754d9fbbaada29460d24882",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnALY8uB1pIb19\n2jfOxziDfPdw1wBkytsSzrJMELr1jTbgQgnSHYkyWQqSjiCFCNFM8OIZDNPNwi/3\n04lfR0JEa4ovDAgPwKExy31g8TG3Fwhb/fd9pAplRQhWdi+ePr6ucdZVFW39TgRH\nDi9W2GyYfZQCP9L9earDrqkXyiUJzy3tUB4/bqltKJP8+2FVf3tR+4FoQKh5if05\ntyb+gKHQ97FMAZHg0HvIypRVh2I0b1qxLiIWIDtKcVoiwWW3DTWJJrT1vEZnP2E8\nJ7cbCJjMLW+vs5siR7frHQ1/KVaVgcAvqRhhUN1k2SSI4JZ1GLD0nGHflqxFTgzj\nwTYvBER3AgMBAAECggEAFQbSax+1WETOwndEuoy70VZdI0B2xLoDzkDnEwuyNnOC\nusalzOY6HXQ3kA9ECev7ykez9/p0+n2eI4JnU+85aTrvCZBmvXD/+rCHxzpnC4nj\nXA3EaPXL90czTwuPYEm/IWCk306U7CU0BaxECpeySJrbFVNq4c49UWj+0kd51Vuj\nmZcCjU6xxx7vk3lcxumPBBioPSB5EryFpV6nC9a/sD+XYJpaJ227nGV9CIslV3RE\np6af7lzz0r8sQkB6m57MKfNwxvmPD8BS2JP1WL4dzGavVMHVmd6jqoPxC+1b4RWG\ncFMW298CFcgnq1krgGwN66Sh52s4XvjBbsml7Swx8QKBgQDo4bp+vQSG0cGKCs4+\nmF5x7Pn5sM+ar8WGWijXjclrOjA1OFuwSESej6R/XkSUIV2WcW5TZdIAWwx/LfFx\nr5rJrqcuk6Ikxg4qoZitAVdyjzs0Bo24+u06JeJZ1nEDkt65aQ107dZjbEnAdBwh\nnlVF9KT7WbpGv97D74BIJtYHJwKBgQC3lMmhq9sb3WqVxuYY0WCzl06dtEk6PXCf\ntH/6wj1FG83nIwdyIY4E5ldCFxoqjk+8J3LBTUtC9t771EqFQKDbPWbKjAl4UYZD\nrwaMfaObF4fvc1Cnwkx3j4msU2e2cjRYZA6oHxxpOWDy01NsNhHCl4UuhZPt8jv5\nIFZQjmuqMQKBgQCVIXg8EO8FJu25aJIKo6hXbFnn+8H2XPkwwCvHXZTOhcS5UA3n\nJWBL6dB9f/CKq5My9BCid2GzuJqYFuO22a1V2fJVcVU0F2CbDECpCWLmibJv7oJz\nIr0nr3rz7M8SassWEJ/9cREJOh9Ajxo0rSAOXEwKabtP8y7EamrLyZLloQKBgFEG\n7M/cyILOAYNGHL0LfQEHYX2d20xHXfQ/eNU28lAUa5b/EQRA5ywmdpEHHVd3JJ5J\nUw8ajINr7xN7qcCSu+zIdxwjHvLqGLa7A8rykUmc4zS+0vSYf6OtyPg0f+w5D/2L\nfCScRq/y0WWb/JAgdUpMEk5sStSVO/9DVJWNptuhAoGAYI0aKZl2KUxva2aBTIsV\nA4Z10YNX3+F4H91+q9TdwbeCoH2nc95F3zHE1TcZZkXRxv0GmXO0M/BqODZ6BIU9\nymM8iHz7Pb7rzxJuDZU+aatJzJh0bsbVncprZ9QU/LoMsg0XJaEW+ohIUPiGTSaR\nZH/0QkE/mrftMfG+H1egTx4=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-454ou@upload-file-nodejs-11f9a.iam.gserviceaccount.com",
    "client_id": "115315730097441129335",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-454ou%40upload-file-nodejs-11f9a.iam.gserviceaccount.com"
  
  
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://upload-file-nodejs-11f9a.firebaseio.com'
});


// const admin = require("firebase-admin");
// // https://firebase.google.com/docs/storage/admin/start
// var serviceAccount = { // create service account from here: https://console.firebase.google.com/u/0/project/delete-this-1329/settings/serviceaccounts/adminsdk
//     "type": "xxxxxxxxxxxxxxxxx",
//     "project_id": "xxxxxxxxxxxxxxxxx",
//     "private_key_id": "xxxxxxxxxxxxxxxxx",
//     "private_key": "xxxxxxxxxxxxxxxxx",
//     "client_email": "xxxxxxxxxxxxxxxxx",   // replace these with your service account credentials
//     "client_id": "xxxxxxxxxxxxxxxxx",
//     "auth_uri": "xxxxxxxxxxxxxxxxx",
//     "token_uri": "xxxxxxxxxxxxxxxxx",
//     "auth_provider_x509_cert_url": "xxxxxxxxxxxxxxxxx",
//     "client_x509_cert_url": "xxxxxxxxxxxxxxxxx"
// };
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://delete-this-1329.firebaseio.com"
// });
const bucket = admin.storage().bucket("gs://upload-file-nodejs-11f9a.appspot.com");

//==============================================



var app = express();
app.use(bodyParser.json()); // to parse json body
app.use(morgan('dev'));
app.use(cors());

app.post("/upload", upload.any(), (req, res, next) => {  // never use upload.single. see https://github.com/expressjs/multer/issues/799#issuecomment-586526877

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    // upload file to storage bucket 
    // you must need to upload file in a storage bucket or somewhere safe
    // server folder is not safe, since most of the time when you deploy your server
    // on cloud it makes more t2han one instances, if you use server folder to save files
    // two things will happen, 
    // 1) your server will no more stateless
    // 2) providers like heroku delete all files when dyno restarts (their could be lots of reasons for your dyno to restart, or it could restart for no reason so be careful) 


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        // {
        //     destination: `${new Date().getTime()}-new-image.png`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        // },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // // delete file from folder before sending response back to client (optional but recommended)
                        // // optional because it is gonna delete automatically sooner or later
                        // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        // try {
                        //     fs.unlinkSync(req.files[0].path)
                        //     //file removed
                        // } catch (err) {
                        //     console.error(err)
                        // }
                        res.send("ok");
                    }
                })
            }else{
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})