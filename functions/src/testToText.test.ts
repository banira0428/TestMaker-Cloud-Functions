import {generateCSV} from "./testToText";

test('問題集のタイトル', () => {
    expect(generateCSV({
        title: "問題集",
        questions: []
    })).toStrictEqual(
        {
            text: "タイトル,問題集"
        }
    )
});

test('記述問題', () => {
    expect(generateCSV({
        title: "問題集",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: [],
                type: 0,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集¥n記述,問題,答え¥n"
        }
    )
});

test('選択問題', () => {
    expect(generateCSV({
        title: "問題集",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: ['はずれ', 'はずれ', 'はずれ'],
                type: 1,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集¥n選択,問題,答え,はずれ,はずれ,はずれ¥n"
        }
    )
});

test('選択問題（自動生成）', () => {
    expect(generateCSV({
        title: "問題集",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: true,
                isCheckOrder: false,
                order: 0,
                others: ['自動生成', '自動生成', '自動生成'],
                type: 1,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集¥n選択A,問題,答え,3¥n"
        }
    )
});

test('完答問題', () => {
    expect(generateCSV({
        title: "問題集",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: [],
                type: 2,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集¥n完答,問題,答え1,答え2,答え3,答え4¥n"
        }
    )
});
