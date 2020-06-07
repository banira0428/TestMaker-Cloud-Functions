import {parseCSV} from "./textToTest";

test('問題集のタイトル', () => {
    expect(parseCSV('タイトル,問題集')).toStrictEqual({
        title: '問題集',
        lang: "ja",
        questions: []
    })
});

test('記述問題', () => {
    expect(parseCSV('記述,問題,答え')).toStrictEqual({
        title: 'no title',
        lang: "ja",
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
        title: 'no title',
        lang: "ja",
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
                others: ['はずれ', 'はずれ'],
                type: 1,
            }
        ]
    })
});

test('選択問題（末尾削除）', () => {
    expect(parseCSV('選択,問題,答え,はずれ,はずれ,はずれ,はずれ,はずれ,はずれ')).toStrictEqual({
        title: 'no title',
        lang: "ja",
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
                others: ['はずれ', 'はずれ', 'はずれ', 'はずれ', 'はずれ'],
                type: 1,
            }
        ]
    })
});

test('完答問題', () => {
    expect(parseCSV('完答,問題,答え1,答え2')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2',
                answers: ['答え1', '答え2'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: [],
                type: 2,
            }
        ]
    })
});

test('完答問題（末尾削除）', () => {
    expect(parseCSV('完答,問題,答え1,答え2,答え3,答え4,答え5')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2\n答え3\n答え4',
                answers: ['答え1', '答え2', '答え3', '答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: [],
                type: 2,
            }
        ]
    })
});

test('選択完答問題', () => {
    expect(parseCSV('選択完答,問題,2,1,答え1,答え2,はずれ1')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2',
                answers: ['答え1', '答え2'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: ['はずれ1'],
                type: 3,
            }
        ]
    })
});

test('選択完答問題（順序指定）', () => {
    expect(parseCSV('選択完答O,問題,2,1,答え1,答え2,はずれ1')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2',
                answers: ['答え1', '答え2'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: true,
                order: 0,
                others: ['はずれ1'],
                type: 3,
            }
        ]
    })
});

test('選択完答問題（変換不可）', () => {
    expect(parseCSV('選択完答,問題,あ,1,答え1,答え2,はずれ1')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択完答問題（要素数オーバー）', () => {
    expect(parseCSV('選択完答,問題,4,3,答え1,答え2,はずれ1')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択完答問題（末尾削除）', () => {
    expect(parseCSV('選択完答,問題,3,3,答え1,答え2,答え3,はずれ1,はずれ2,はずれ3,はずれ4')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2\n答え3',
                answers: ['答え1', '答え2', '答え3'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: ['はずれ1', 'はずれ2', 'はずれ3'],
                type: 3,
            }
        ]
    })
});

test('選択問題（自動生成かつ要素数オーバー）', () => {
    expect(parseCSV('選択A,問題,答え,6')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択問題（自動生成かつ変換不可能）', () => {
    expect(parseCSV('選択A,問題,答え,あ')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択問題（自動生成かつ変換不可能）', () => {
    expect(parseCSV('選択A,問題,答え,3')).toStrictEqual({
        title: 'no title',
        lang: "ja",
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
                others: ['自動生成', '自動生成','自動生成'],
                type: 1,
            }
        ]
    })
});

test('選択完答問題（自動生成かつ変換不可能）', () => {
    expect(parseCSV('選択完答A,問題,あ,答え,答え')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択完答問題（自動生成かつ要素数オーバー）', () => {
    expect(parseCSV('選択完答A,問題,3,答え,答え,答え,答え')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('選択完答問題（自動生成）', () => {
    expect(parseCSV('選択完答A,問題,2,答え1,答え2,答え3,答え4')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2\n答え3\n答え4',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: true,
                isCheckOrder: false,
                order: 0,
                others: ['自動生成', '自動生成'],
                type: 3,
            }
        ]
    })
});

test('選択完答問題（自動生成かつ順序指定）', () => {
    expect(parseCSV('選択完答AO,問題,2,答え1,答え2,答え3,答え4')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え1\n答え2\n答え3\n答え4',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: true,
                isCheckOrder: true,
                order: 0,
                others: ['自動生成', '自動生成'],
                type: 3,
            }
        ]
    })
});

test('解説つき問題', () => {
    expect(parseCSV('タイトル,問題集¥n記述,問題,答え¥n解説,解説文')).toStrictEqual({
        title: '問題集',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: '解説文',
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

test('解説つき問題', () => {
    expect(parseCSV('解説,解説文')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: []
    })
});

test('コンマつき問題', () => {
    expect(parseCSV('記述,問題&lt;comma>文,答え')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題,文',
                answer: '答え',
                answers: [],
                explanation: '',
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

test('改行つき問題', () => {
    expect(parseCSV('記述,問題&lt;br>文,答え')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題\n文',
                answer: '答え',
                answers: [],
                explanation: '',
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

test('改行つき問題(\r)', () => {
    expect(parseCSV('記述,問題,答え\r')).toStrictEqual({
        title: 'no title',
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: '',
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


