function DoubleLinkedList() {
  var Node = function(element) {
    this.element = element;
    this.prev = null;
    this.next = null;
  }

  var head = null;
  var tail = null;
  var length = 0;

  this.insert = function(position, element) {
    var node = new Node(element);
    var current = head;
    var previous;
    var index = 0;
    if (position >= 0 && position <= length) {
      if (position === 0) {
        if (!head) {
          head = node;
          tail = node;
        } else {
          head = node;
          node.next = current;
          current.prev = node;
        }
      } else if (position === length) {
        current = tail;
        tail = node;
        current.next = node;
        node.prev = current;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = node;
        node.prev = previous;
        node.next = current;
        current.prev = node;
      }
      length++;
      return true;
    } else {
      return false;
    }
  }

  this.removeAt = function(position) {
    var current = head;
    var previous;
    var index = 0;
    if (position >= 0 && position < length) {
      if (position === 0) {
        head = current.next;
        if (length === 1) {
          tail = null;
        } else {
          head.prev = null;
        }
      } else if (position === length - 1) {
        current = tail;
        tail = current.prev;
        if (length === 1) {
          head = null;
        } else {
          tail.next = null;
        }
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
        previous.next.prev = previous;
      }
      length--;
      return true;
    } else {
      return false;
    }
  }

  this.remove = function(element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
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

  this.append = function(element) {
    this.insert(length, element);
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
      string += current.element.toString() + ' <--> ';
      current = current.next;
    }
    return string === '' ? '' : string.slice(0, string.length - 6);
  }

  this.getHead = function() {
    return head;
  }

}

var doubleLinkedList = new DoubleLinkedList();
doubleLinkedList.append(0);
doubleLinkedList.append(1);
doubleLinkedList.append(2);
doubleLinkedList.append(3);
doubleLinkedList.append(4);
doubleLinkedList.append(5);
doubleLinkedList.append(6);
doubleLinkedList.append(7);
doubleLinkedList.remove(4);
doubleLinkedList.insert(4, 100);
console.log('doubleLinkedList', doubleLinkedList.toString(), doubleLinkedList.isEmpty(), doubleLinkedList.size(), doubleLinkedList.indexOf(5));
