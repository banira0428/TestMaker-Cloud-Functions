import {isPublic} from "./index";


test('公開アップロード（旧仕様）', () => {
  expect(isPublic({})).toStrictEqual(true);
});

test('公開アップロード（新仕様）', () => {
  expect(isPublic({
    'public': true
  })).toStrictEqual(true);
});

test('非公開アップロード（新仕様）', () => {
  expect(isPublic({
    'public': false
  })).toStrictEqual(false);
});