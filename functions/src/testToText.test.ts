import {generateCSV} from "./testToText";

test('問題集のタイトル', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: []
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n"
        }
    )
});

test('記述問題', () => {
    expect(generateCSV({
        title: "問題集",
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
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n記述,問題,答え\n"
        }
    )
});

test('選択問題', () => {
    expect(generateCSV({
        title: "問題集",
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
                others: ['はずれ', 'はずれ', 'はずれ'],
                type: 1,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n選択,問題,答え,はずれ,はずれ,はずれ\n"
        }
    )
});

test('選択問題（自動生成）', () => {
    expect(generateCSV({
        title: "問題集",
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
                others: ['自動生成', '自動生成', '自動生成'],
                type: 1,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n選択A,問題,答え,3\n"
        }
    )
});

test('完答問題', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
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
            text: "タイトル,問題集\n完答,問題,答え1,答え2,答え3,答え4\n"
        }
    )
});

test('選択完答問題', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: false,
                order: 0,
                others: ['はずれ1','はずれ2'],
                type: 3,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n選択完答,問題,4,2,答え1,答え2,答え3,答え4,はずれ1,はずれ2\n"
        }
    )
});

test('選択完答問題（自動生成）', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: true,
                isCheckOrder: false,
                order: 0,
                others: ['自動生成','自動生成'],
                type: 3,
            }
        ]
    })).toStrictEqual(
        {
            text: "タイトル,問題集\n選択完答A,問題,2,答え1,答え2,答え3,答え4\n"
        }
    )
});

test('選択完答問題（順序指定）', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: false,
                isCheckOrder: true,
                order: 0,
                others: ['はずれ1','はずれ2'],
                type: 3,
            }
        ]
    })).toStrictEqual(
      {
          text: "タイトル,問題集\n選択完答O,問題,4,2,答え1,答え2,答え3,答え4,はずれ1,はずれ2\n"
      }
    )
});

test('選択完答問題（順序指定かつ自動生成）', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: ['答え1','答え2','答え3','答え4'],
                explanation: "",
                imagePath: "",
                isAutoGenerateOthers: true,
                isCheckOrder: true,
                order: 0,
                others: ['自動生成','自動生成'],
                type: 3,
            }
        ]
    })).toStrictEqual(
      {
          text: "タイトル,問題集\n選択完答AO,問題,2,答え1,答え2,答え3,答え4\n"
      }
    )
});

test('解説つき問題', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題',
                answer: '答え',
                answers: [],
                explanation: "解説文です",
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
            text: "タイトル,問題集\n記述,問題,答え\n解説,解説文です\n"
        }
    )
});

test('エスケープ文字つき問題', () => {
    expect(generateCSV({
        title: "問題集",
        lang: "ja",
        questions: [
            {
                question: '問題¥nで,す',
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
            text: "タイトル,問題集\n記述,問題&lt;br>で&lt;comma>す,答え\n"
        }
    )
});
