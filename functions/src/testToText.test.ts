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