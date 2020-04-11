import {Test} from './Test'
import * as functions from "firebase-functions";

export const testToText = functions.https.onRequest((req, res) => {
    res.status(200).send(generateCSV(req.body));
});

const generateCSV = function (test: Test) {
    return {text: ""}
};