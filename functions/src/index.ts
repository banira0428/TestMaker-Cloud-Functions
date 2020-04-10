import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Firestore, Query } from '@google-cloud/firestore';

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
                    console.log("deleted");
                    resolve();
                    return;
                }).catch(() => {
                    reject();
                    return;
                });
            });
        }else{
            return;
        }
    
    });

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

                // if (doc.data().imageRef !== "") {
                //     const file = admin.storage().bucket("gs://testmaker-1cb29.appspot.com/").file(doc.data().imageRef);

                //     if (file !== null) {
                //         console.log(file.name);
                //         file.delete().then(() => {
                //             console.log("deleted");
                //             resolve();
                //             return;
                //         }).catch(() => {
                //             console.log("failed");
                //             reject();
                //             return;
                //         });
                //     }


                // }

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
