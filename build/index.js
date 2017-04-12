'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IncrementalSync = function () {
  function IncrementalSync(getStoredItemKey, getCurrentItemKey, hasChanged, emit) {
    _classCallCheck(this, IncrementalSync);

    this.getStoredItemKey = getStoredItemKey;
    this.getCurrentItemKey = getCurrentItemKey;
    this.hasChanged = hasChanged;
    this.emit = emit;
    this.storedItems = {};
    this.currentItems = {};
    this.storedDone = false;
    this.currentDone = false;
  }

  _createClass(IncrementalSync, [{
    key: 'addStoredItem',
    value: function addStoredItem(item) {
      var key = this.getStoredItemKey(item);
      this.storedItems[key] = item;

      var currentItem = this.currentItems[key];
      if (currentItem && this.hasChanged(item, currentItem)) {
        this.emit({ event: 'to-update', stored: item, current: currentItem });
      }

      if (this.currentDone && !currentItem) {
        this.emit({ event: 'to-delete', stored: item });
      }
    }
  }, {
    key: 'finishStoredItems',
    value: function finishStoredItems() {
      var _this = this;

      this.storedDone = true;
      Object.keys(this.currentItems).forEach(function (key) {
        var storedItem = _this.storedItems[key];
        if (!storedItem) {
          _this.emit({ event: 'to-add', current: _this.currentItems[key] });
        }
      });
    }
  }, {
    key: 'addCurrentItem',
    value: function addCurrentItem(item) {
      var key = this.getCurrentItemKey(item);
      this.currentItems[key] = item;

      var storedItem = this.storedItems[key];
      if (storedItem && this.hasChanged(storedItem, item)) {
        this.emit({ event: 'to-update', stored: storedItem, current: item });
      }

      if (this.storedDone && !storedItem) {
        this.emit({ event: 'to-add', current: item });
      }
    }
  }, {
    key: 'finishCurrentItems',
    value: function finishCurrentItems() {
      var _this2 = this;

      this.currentDone = true;
      Object.keys(this.storedItems).forEach(function (key) {
        var currentItem = _this2.currentItems[key];
        if (!currentItem) {
          _this2.emit({ event: 'to-delete', stored: _this2.storedItems[key] });
        }
      });
    }
  }]);

  return IncrementalSync;
}();

exports.default = IncrementalSync;