import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Firestore, Query} from '@google-cloud/firestore';
import {Test} from "tslint";

admin.initializeApp();

exports.deleteTest = functions.firestore
    .document('tests/{documentId}')
    .onDelete((snap, context) => {

        // Get an object representing the document prior to deletion
        // e.g. {'name': 'Marie', 'age': 66}
        //const deletedValue = snap.data();
        const db = admin.firestore();

        const data = snap.data();
        let size = 0;

        if (data !== undefined) {
            size = data.size as number
        }
        deleteCollection(db, snap.id, size);

        return;
        // perform desired operations ...
    });

exports.deleteQuestion = functions.firestore
    .document('tests/{documentId}/questions/{questionId}')
    .onDelete((snap, context) => {

        const data = snap.data()

        if (data !== undefined) {
            const deleteImage: string = data.imageRef

            const bucket = admin.storage().bucket();

            console.log(deleteImage);

            return new Promise((resolve, reject) => {
                bucket.file(deleteImage).delete().then(() => {
                    resolve();
                    return;
                }).catch(() => {
                    reject();
                    return;
                });
            });
        } else {
            return;
        }

    });

exports.textToTest = functions.https.onRequest((req, res) => {
    const csvText = req.body.text;
    res.status(200).send(parseCSV(csvText));
});

export const parseCSV = function (text: string): Test {
    //todo ローカライズしろ！
    const textRows = text.split('\n');
    const test: Test = {
        title: ''
    };

    textRows.forEach((row) => {
            const textColumns = row.split(',').filter((it: string) => it.length > 0);
            if (textColumns[0] === 'タイトル') {
                test.title = textColumns[1];
            }
        }
    );

    return test
};

function deleteCollection(db: Firestore, testId: string, batchSize: number) {
    const collectionRef = db.collection("tests").doc(testId).collection("questions");
    const query: Query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db: Firestore, query: Query, batchSize: number, resolve: () => void, reject: () => void) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            })
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    }).catch(() => {
        reject();
    });

    return 0;
}

interface Test {
    title: string
}
