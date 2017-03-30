'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IncrementalSync = function () {
  function IncrementalSync(getOldItemKey, getCurrentItemKey, hasChanged, emit) {
    _classCallCheck(this, IncrementalSync);

    this.getOldItemKey = getOldItemKey;
    this.getCurrentItemKey = getCurrentItemKey;
    this.hasChanged = hasChanged;
    this.emit = emit;
    this.oldItems = {};
    this.currentItems = {};
    this.oldDone = false;
    this.currentDone = false;
  }

  _createClass(IncrementalSync, [{
    key: 'addOldItem',
    value: function addOldItem(item) {
      var key = this.getOldItemKey(item);
      this.oldItems[key] = item;

      var currentItem = this.currentItems[key];
      if (currentItem && this.hasChanged(item, currentItem)) {
        this.emit({ event: 'changed', old: item, current: currentItem });
      }

      if (this.currentDone && !currentItem) {
        this.emit({ event: 'deleted', old: item });
      }
    }
  }, {
    key: 'finishOldItems',
    value: function finishOldItems() {
      var _this = this;

      this.oldDone = true;
      Object.keys(this.currentItems).forEach(function (key) {
        var oldItem = _this.oldItems[key];
        if (!oldItem) {
          _this.emit({ event: 'added', current: _this.currentItems[key] });
        }
      });
    }
  }, {
    key: 'addCurrentItem',
    value: function addCurrentItem(item) {
      var key = this.getCurrentItemKey(item);
      this.currentItems[key] = item;

      var oldItem = this.oldItems[key];
      if (oldItem && this.hasChanged(oldItem, item)) {
        this.emit({ event: 'changed', old: oldItem, new: item });
      }

      if (this.oldDone && !oldItem) {
        this.emit({ event: 'added', current: item });
      }
    }
  }, {
    key: 'finishCurrentItems',
    value: function finishCurrentItems() {
      var _this2 = this;

      this.currentDone = true;
      Object.keys(this.oldItems).forEach(function (key) {
        var currentItem = _this2.currentItems[key];
        if (!currentItem) {
          _this2.emit({ event: 'deleted', old: _this2.oldItems[key] });
        }
      });
    }
  }]);

  return IncrementalSync;
}();

exports.default = IncrementalSync;