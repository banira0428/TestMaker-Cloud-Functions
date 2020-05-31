import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Firestore, Query} from '@google-cloud/firestore';
import {testToText} from "./testToText";
import {textToTest} from "./textToTest";
import * as algolia from 'algoliasearch';

admin.initializeApp();

exports.onTestCreated = functions.firestore.document('tests/{documentId}').onCreate((snap, context) => {
  const ALGOLIA_ID = functions.config().algolia.appid;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.apikey;

  const ALGOLIA_INDEX_NAME = 'TestMaker';
  // @ts-ignore
  const client = algolia(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

  const data = snap.data();
  if(data !== undefined){
    data.objectID = snap.id;

    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(data);
  }
});

exports.deleteTest = functions.firestore
    .document('tests/{documentId}')
    .onDelete((snap, context) => {

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

exports.testToText = testToText;

exports.textToTest = textToTest;

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
