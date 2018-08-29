function LinkedList() {

  var Node = function(element) {
    this.element = element;
    this.next = null;
  }

  var length = 0;
  var head = null;

  this.append = function(element) {
    var node = new Node(element);
    var current;

    if (head === null) {
      head = node;
    } else {
      current = head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }

    length ++;
  }

  this.insert = function(position, element) {
    if (position >= 0 && position <= length) {
      var node = new Node(element);
      var current;
      var previous;
      var index = 0;

      if (position === 0) {
        node.next = head;
        head = node;
      } else {
        current = head;
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = node;
        node.next = current;
      }
      length++;
      return node.element;

    } else {
      return false;
    }
  }

  this.indexOf = function(element) {
    var current = head;
    var index = 0;
    while (current) {
      if (current.element === element) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  }

  this.removeAt = function(position) {
    var current = head,
        previous,
        index = 0;

    if (position >= 0 && position < length) {
      if (position === 0) {
        head = head.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      length--;
      return current.element;
    } else {
      return false;
    }
  }

  this.remove = function(element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  }

  this.isEmpty = function() {
    return length === 0 ? true : false;
  }

  this.size = function() {
    return length;
  }

  this.toString = function() {
    var current = head;
    var string = '';

    while (current) {
      string += current.element.toString() + ' --> ';
      current = current.next;
    }

    return string === '' ? '' : string.slice(0, string.length - 5);
  }

  this.clear = function() {
    head = null;
    length = 0;
  }

  this.getHead = function() {
    return head;
  }

}

var linkedList = new LinkedList();
linkedList.append(1);
linkedList.append(2);
linkedList.append(3);
linkedList.append(4);
linkedList.append(5);
linkedList.append(6);
linkedList.insert(0, 'hhh');
linkedList.remove('hhh');
// console.log('linkedList', linkedList.toString(), linkedList.indexOf(3), linkedList.isEmpty(), linkedList.size(), linkedList.remove(2), linkedList.clear(), linkedList.size(), linkedList.isEmpty());
// console.log('linkedList', linkedList.getHead().toString());
