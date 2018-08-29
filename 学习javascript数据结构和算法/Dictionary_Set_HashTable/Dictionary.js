function Dictionary() {
  let items = {};

  this.set = function(key, value) {
    items[key] = value;
  }

  this.remove = function(key) {
    if (this.has(key)) {
      delete items[key];
      return true;
    }
    return false;
  }

  this.has = key => items.hasOwnProperty(key)

  this.get = key => items[key] ? items[key] : undefined

  this.clear = () => { items = {} }

  this.size = () => Object.keys(items).length

  this.keys = () => Object.keys(items)

  this.values = () => Object.values(items)

}

// var dictionary = new Dictionary();
// dictionary.set('a', 'aaa');
// dictionary.set('b', 'bbb');
// dictionary.set('c', 'ccc');
// console.log('dictionary', dictionary.has('a'), dictionary.get('b'), dictionary.size(), dictionary.keys(), dictionary.values());
