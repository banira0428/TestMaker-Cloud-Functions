import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Firestore, Query} from '@google-cloud/firestore';
import {testToText} from "./testToText";
import {textToTest} from "./textToTest";
import axios from 'axios';

admin.initializeApp();

exports.onTestCreated = functions.firestore.document('tests/{documentId}').onCreate((snap, context) => {
  const data = snap.data();
  if (data !== undefined) {

    if(!isPublic(data)) {
      return
    }

    const client = getClient();
    client.post('/tests', {
      name: data.name,
      color: data.color,
      document_id: snap.id,
      size: 0,
      comment: data.overview,
      user_id: data.userId,
      user_name: data.userName
    }).then().catch(function (error) {
      console.log(error)
    });

  }
  return;
});

export function isPublic(data: any): boolean{
  if('public' in data){
    return data.public
  }else{
    return true
  }
}

exports.deleteTest = functions.firestore
  .document('tests/{documentId}')
  .onDelete((snap, context) => {

    const db = admin.firestore();
    const data = snap.data();
    let size = 0;

    if (data !== undefined) {
      size = data.size as number;
      deleteCollection(db, snap.id, size).catch(function (error) {
        console.log(error)
      });

      const client = getClient();
      client.delete('/tests/' + snap.id).then().catch(function (error) {
        console.log(error)
      });
    }
    return;
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

function getClient() {
  return axios.create({
    baseURL: "https://test-maker-server.herokuapp.com/",
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'
  });
}
