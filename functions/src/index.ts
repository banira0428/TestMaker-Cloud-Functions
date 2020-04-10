import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Firestore, Query} from '@google-cloud/firestore';
import {Test} from "tslint";

admin.initializeApp();

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

exports.textToTest = functions.https.onRequest((req, res) => {
    const csvText = req.body.text;
    res.status(200).send(parseCSV(csvText));
});

export const parseCSV = function (text: string): Test {
    //todo ローカライズしろ！
    const textRows = text.split('\n');
    const test: Test = {
        title: '',
        questions: []
    };

    textRows.forEach((row) => {
            const textColumns = row.split(',').filter((it: string) => it.length > 0);
            if (textColumns[0] === 'タイトル') {
                test.title = textColumns[1];
            }

            switch (textColumns[0]) {
                case '記述':
                    test.questions.push(
                        {
                            question: textColumns[1],
                            answer: textColumns[2],
                            answers: [],
                            explanation: "",
                            imagePath: "",
                            isAutoGenerateOthers: false,
                            isCheckOrder: false,
                            order: test.questions.length,
                            others: [],
                            type: 0,
                        }
                    );
                    break;
                case '選択':
                    test.questions.push(
                        {
                            question: textColumns[1],
                            answer: textColumns[2],
                            answers: [],
                            explanation: "",
                            imagePath: "",
                            isAutoGenerateOthers: false,
                            isCheckOrder: false,
                            order: test.questions.length,
                            others: textColumns.slice(3, 8),
                            type: 1,
                        }
                    );
                    break;
                case '選択A':

                    const sizeOfAutoSelectOthers = parseInt(textColumns[3], 10);

                    if (isNaN(sizeOfAutoSelectOthers)) break;
                    if (sizeOfAutoSelectOthers > 5) break;

                    test.questions.push(
                        {
                            question: textColumns[1],
                            answer: textColumns[2],
                            answers: [],
                            explanation: "",
                            imagePath: "",
                            isAutoGenerateOthers: true,
                            isCheckOrder: false,
                            order: test.questions.length,
                            others: Array(sizeOfAutoSelectOthers).fill('自動生成'),
                            type: 1,
                        }
                    );
                    break;
                case '完答':
                case '記述A':
                    test.questions.push(
                        {
                            question: textColumns[1],
                            answer: textColumns.slice(2, 6).join('\n'),
                            answers: textColumns.slice(2, 6),
                            explanation: "",
                            imagePath: "",
                            isAutoGenerateOthers: false,
                            isCheckOrder: false,
                            order: test.questions.length,
                            others: [],
                            type: 2,
                        }
                    );
                    break;
                case '選択完答':

                    const sizeOfAnswers = parseInt(textColumns[2], 10);
                    const sizeOfOthers = parseInt(textColumns[3], 10);

                    if (isNaN(sizeOfAnswers) && isNaN(sizeOfOthers)) break;
                    if (sizeOfAnswers + sizeOfOthers > 6) break;

                    test.questions.push(
                        {
                            question: textColumns[1],
                            answer: textColumns.slice(4, 4 + sizeOfAnswers).join('\n'),
                            answers: textColumns.slice(4, 4 + sizeOfAnswers),
                            explanation: "",
                            imagePath: "",
                            isAutoGenerateOthers: false,
                            isCheckOrder: false,
                            order: test.questions.length,
                            others: textColumns.slice(4 + sizeOfAnswers, 4 + sizeOfAnswers + sizeOfOthers),
                            type: 3,
                        }
                    );
                    break;

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
    questions: Question[]
}

interface Question {
    question: string
    answer: string
    explanation: string
    answers: string[]
    others: string[]
    type: number
    isAutoGenerateOthers: boolean
    order: number
    isCheckOrder: boolean
    imagePath: string
}
