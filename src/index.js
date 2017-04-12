class IncrementalSync {

  constructor(getStoredItemKey, getCurrentItemKey, hasChanged, emit) {
    this.getStoredItemKey = getStoredItemKey;
    this.getCurrentItemKey = getCurrentItemKey;
    this.hasChanged = hasChanged;
    this.emit = emit;
    this.storedItems = {};
    this.currentItems = {};
    this.storedDone = false;
    this.currentDone = false;
  }

  addStoredItem(item) {
    const key = this.getStoredItemKey(item);
    this.storedItems[key] = item;

    const currentItem = this.currentItems[key];
    if (currentItem && this.hasChanged(item, currentItem)) {
      this.emit({ event: 'to-update', stored: item, current: currentItem });
    }

    if (this.currentDone && !currentItem) {
      this.emit({ event: 'to-delete', stored: item });
    }
  }

  finishStoredItems() {
    this.storedDone = true;
    Object.keys(this.currentItems).forEach(key => {
      const storedItem = this.storedItems[key];
      if (!storedItem) {
        this.emit({ event: 'to-add', current: this.currentItems[key] });
      }
    });
  }

  addCurrentItem(item) {
    const key = this.getCurrentItemKey(item);
    this.currentItems[key] = item;

    const storedItem = this.storedItems[key];
    if (storedItem && this.hasChanged(storedItem, item)) {
      this.emit({ event: 'to-update', stored: storedItem, current: item });
    }

    if (this.storedDone && !storedItem) {
      this.emit({ event: 'to-add', current: item });
    }
  }

  finishCurrentItems() {
    this.currentDone = true;
    Object.keys(this.storedItems).forEach(key => {
      const currentItem = this.currentItems[key];
      if (!currentItem) {
        this.emit({ event: 'to-delete', stored: this.storedItems[key] });
      }
    });
  }
}

export default IncrementalSync;
