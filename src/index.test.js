import IncrementalSync from './index';

test("doesn't crash", () => {
  var is = new IncrementalSync();
  expect(is.oldItems).toEqual({});
  expect(is.currentItems).toEqual({});
  expect(is.oldDone).toEqual(false);
  expect(is.currentDone).toEqual(false);
});
