class IncrementalSync {

  constructor(getOldItemKey, getCurrentItemKey, hasChanged, emit) {
    this.getOldItemKey = getOldItemKey;
    this.getCurrentItemKey = getCurrentItemKey;
    this.hasChanged = hasChanged;
    this.emit = emit;
    this.oldItems = {};
    this.currentItems = {};
    this.oldDone = false;
    this.currentDone = false;
  }

  addOldItem(item) {
    const key = this.getOldItemKey(item);
    this.oldItems[key] = item;

    const currentItem = this.currentItems[key];
    if (currentItem && this.hasChanged(item, currentItem)) {
      this.emit({ event: 'changed', old: item, current: currentItem });
    }

    if (this.currentDone && !currentItem) {
      this.emit({ event: 'deleted', old: item });
    }
  }

  finishOldItems() {
    this.oldDone = true;
    Object.keys(this.currentItems).forEach(key => {
      const oldItem = this.oldItems[key];
      if (!oldItem) {
        this.emit({ event: 'added', current: this.currentItems[key] });
      }
    });
  }

  addCurrentItem(item) {
    const key = this.getCurrentItemKey(item);
    this.currentItems[key] = item;

    const oldItem = this.oldItems[key];
    if (oldItem && this.hasChanged(oldItem, item)) {
      this.emit({ event: 'changed', old: oldItem, current: item });
    }

    if (this.oldDone && !oldItem) {
      this.emit({ event: 'added', current: item });
    }
  }

  finishCurrentItems() {
    this.currentDone = true;
    Object.keys(this.oldItems).forEach(key => {
      const currentItem = this.currentItems[key];
      if (!currentItem) {
        this.emit({ event: 'deleted', old: this.oldItems[key] });
      }
    });
  }
}

export default IncrementalSync;
