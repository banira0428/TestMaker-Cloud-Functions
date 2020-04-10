import {parseCSV} from "./index";

test('sample test', () => {
    expect(parseCSV('タイトル,問題集')).toStrictEqual({
        title: '問題集'
    })
});