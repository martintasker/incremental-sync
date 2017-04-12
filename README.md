# IncrementalSync

This module emits `deleted`, `added` and `changed` events, as early as
possible, when comparing two sets of data, the _old_ set and the _current_ set.
You can then use these events to do synchronization between the two sets.

Say, for example, you have

```js
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
```

We can see that, despite the difference in structure between these two sets,

* there's a `foo` in `old` but not in `current` -- this has been _deleted_
* there's a `bar` in both, and it has not changed
* there's a `bas` in both, and it has _changed_
* there's a `quux` in `current` but not in `old` -- it has been _added_

The `IncrementalSync` class:

* provides `addOldItem(item)`, `finishOldItems()` functions, to add items from
  an "old" stream in any order and then indicate that that stream has finished
* similarly, provides `addCurrentItem(item)` and `finishCurrentItems()` functions
* requires, as constructor parameters, a function to identify the key in an old item,
  a function to identify the key in a current item, and a function to check whether
  an old item and a new item are substantially different
* requires, as a constructor parameter, an `emit()` callback function, which it
  uses to emit `added`, `deleted` or `changed` events

Thus a client of `IncrementalSync`:

* sets it up with the constructor, providing the required helper and callback functions
* sets up fetch streams for both old and current items, and calls relevant methods
  in `IncrementalSync` when items arrive and when streams finish
* handles the `added`, `deleted` and `changed` events as they are emitted

This is _sync_, for obvious reasons.

It's _incremental_, because no assumption is made about the relative ordering betewen
old and current items, and sync events are emitted as soon as possible:

* if the _old_ stream has finished, then any _current_ item for which a corresponding
  _old_-item key does not exist, results in an `added` event
* if the _current_ stream has finished, then any _old_ item for which a corresponding
  _current_-item key does not exist, results in a `deleted` event
* `changed` events are emitted as soon as it's known that identical-key old and current
  items exist, but their values are materially different

## Using `IncrementalSync`

Install using npm:

```shell
npm install incremental-sync
```

Import from ES6 code:

```js
import IncrementalSync from 'incremental-sync`

const is = new IncrementalSync(...);
```

## Developing

Clone the repo, use `npm start` to set up incremental compilation, and `npm test` for testing.

## todo

Make conveniently available in other module formats.

Change `old` to `stored`.

Change event names:

* `added` becomes `must-add`
* `deleted` becomes `must-delete`
* `changed` becomes `must-change`

More interleaved test code.
