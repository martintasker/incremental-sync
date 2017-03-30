"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test("doesn't crash", function () {
  var is = new _index2.default();
  expect(is.oldItems).toEqual({});
  expect(is.currentItems).toEqual({});
  expect(is.oldDone).toEqual(false);
  expect(is.currentDone).toEqual(false);
});

test("does useful stuff", function () {

  var old = [{ key: 'foo', value: '1' }, { key: 'bar', value: '2' }, { key: 'baz', value: '3' }];

  var current = [{ id: 'bar', data: '2' }, { id: 'baz', data: '4' }, { id: 'quux', data: '5' }];

  function getOldItemKey(item) {
    return item.key;
  }

  function getCurrentItemKey(item) {
    return item.id;
  }

  function hasChanged(oldItem, currentItem) {
    return oldItem.value !== currentItem.data;
  }

  function emit(event) {
    console.log("event: %j", event);
  }

  var is = new _index2.default(getOldItemKey, getCurrentItemKey, hasChanged, emit);

  // test the test code
  expect(getOldItemKey(old[0])).toEqual('foo');
  expect(getCurrentItemKey(current[0])).toEqual('bar');
  expect(hasChanged(old[1], current[0])).toEqual(false);
  expect(hasChanged(old[2], current[1])).toEqual(true);

  // run the real code and see results
  is.addOldItem(old[0]);
  is.addOldItem(old[1]);
  is.addOldItem(old[2]);
  is.finishOldItems();

  is.addCurrentItem(current[0]);
  is.addCurrentItem(current[1]);
  is.addCurrentItem(current[2]);
  is.finishCurrentItems();
});