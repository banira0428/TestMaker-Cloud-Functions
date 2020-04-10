import {parseCSV} from "./index";

test('問題集のタイトル', () => {
    expect(parseCSV('タイトル,問題集')).toStrictEqual({
        title: '問題集',
        questions: []
    })
});

test('記述問題', () => {
    expect(parseCSV('記述,問題,答え')).toStrictEqual({
        title: '',
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
    })
});

test('選択問題', () => {
    expect(parseCSV('選択,問題,答え,はずれ,はずれ')).toStrictEqual({
        title: '',
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
                others: ['はずれ','はずれ'],
                type: 1,
            }
        ]
    })
});

test('選択問題（末尾削除）', () => {
    expect(parseCSV('選択,問題,答え,はずれ,はずれ,はずれ,はずれ,はずれ,はずれ')).toStrictEqual({
        title: '',
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
                others: ['はずれ','はずれ','はずれ','はずれ','はずれ'],
                type: 1,
            }
        ]
    })
});