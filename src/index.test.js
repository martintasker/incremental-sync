import IncrementalSync from './index';

test("doesn't crash", () => {
  var is = new IncrementalSync();
  expect(is.storedItems).toEqual({});
  expect(is.currentItems).toEqual({});
  expect(is.storedDone).toEqual(false);
  expect(is.currentDone).toEqual(false);
});

// data and functions for use in next set of tests

const stored = [
  { key: 'foo', value: '1' },
  { key: 'bar', value: '2' },
  { key: 'baz', value: '3' }
];

const current = [
  { id: 'bar', data: '2' },
  { id: 'baz', data: '4' },
  { id: 'quux', data: '5' }
]

function getStoredItemKey(item) {
  return item.key;
}

function getCurrentItemKey(item) {
  return item.id;
}

function hasChanged(storedItem, currentItem) {
  return storedItem.value !== currentItem.data;
}

test("test data and accessor functions work", () => {
  expect(getStoredItemKey(stored[0])).toEqual('foo');
  expect(getCurrentItemKey(current[0])).toEqual('bar');
  expect(hasChanged(stored[1], current[0])).toEqual(false);
  expect(hasChanged(stored[2], current[1])).toEqual(true);
});

test("non-interleaving case", () => {

  var events = [];

  function emit(event) {
    console.log("event: %j", event);
    events.push(event);
  }

  var is = new IncrementalSync(getStoredItemKey, getCurrentItemKey, hasChanged, emit);

  is.addStoredItem(stored[0]);
  is.addStoredItem(stored[1]);
  is.addStoredItem(stored[2]);
  is.finishStoredItems();

  is.addCurrentItem(current[0]);
  expect(events.length).toEqual(0);

  is.addCurrentItem(current[1]);
  expect(events.length).toEqual(1);
  expect(events[0].event).toEqual('to-update');
  expect(events[0].stored).toEqual(stored[2]);
  expect(events[0].current).toEqual(current[1]);
  expect(events[0].stored.key).toEqual('baz');
  expect(events[0].stored.value).toEqual('3');
  expect(events[0].current.id).toEqual('baz');
  expect(events[0].current.data).toEqual('4');

  is.addCurrentItem(current[2]);
  expect(events.length).toEqual(2);
  expect(events[1].event).toEqual('to-add');
  expect(events[1].current).toEqual(current[2]);
  expect(events[1].current.id).toEqual('quux');
  expect(events[1].current.data).toEqual('5');

  is.finishCurrentItems();
  expect(events.length).toEqual(3);
  expect(events[2].event).toEqual('to-delete');
  expect(events[2].stored).toEqual(stored[0]);
  expect(events[2].stored.key).toEqual('foo');
  expect(events[2].stored.value).toEqual('1');
});
