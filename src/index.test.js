import IncrementalSync from './index';

test("doesn't crash", () => {
  var is = new IncrementalSync();
  expect(is.oldItems).toEqual({});
  expect(is.currentItems).toEqual({});
  expect(is.oldDone).toEqual(false);
  expect(is.currentDone).toEqual(false);
});

test("does useful stuff", () => {

  var old = [
    { key: 'foo', value: '1' },
    { key: 'bar', value: '2' },
    { key: 'baz', value: '3' }
  ];

  var current = [
    { id: 'bar', data: '2' },
    { id: 'baz', data: '4' },
    { id: 'quux', data: '5' }
  ]

  var events = [];

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
    events.push(event);
  }

  var is = new IncrementalSync(getOldItemKey, getCurrentItemKey, hasChanged, emit);

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
  expect(events.length).toEqual(0);

  is.addCurrentItem(current[1]);
  expect(events.length).toEqual(1);
  expect(events[0].event).toEqual('changed');
  expect(events[0].old).toEqual(old[2]);
  expect(events[0].current).toEqual(current[1]);
  expect(events[0].old.key).toEqual('baz');
  expect(events[0].old.value).toEqual('3');
  expect(events[0].current.id).toEqual('baz');
  expect(events[0].current.data).toEqual('4');

  is.addCurrentItem(current[2]);
  expect(events.length).toEqual(2);
  expect(events[1].event).toEqual('added');
  expect(events[1].current).toEqual(current[2]);
  expect(events[1].current.id).toEqual('quux');
  expect(events[1].current.data).toEqual('5');

  is.finishCurrentItems();
  expect(events.length).toEqual(3);
  expect(events[2].event).toEqual('deleted');
  expect(events[2].old).toEqual(old[0]);
  expect(events[2].old.key).toEqual('foo');
  expect(events[2].old.value).toEqual('1');
});
