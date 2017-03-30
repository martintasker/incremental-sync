import IncrementalSync from './index';

test("doesn't crash", () => {
  var is = new IncrementalSync();
  expect(is.count()).toBe(1);
});
