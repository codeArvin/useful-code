const getRadomArray = (range, count) => {
  let arr = [];
  const getRange = () => (Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]));
  for (let i = 0; i < count; i++) {
    arr.push(getRange());
  }
  return arr;
}
// 箭头函数不能用做构造函数
function createNonSortArray(count) {
  let array = getRadomArray([1, 100], count);

  const swap = (i, j) => {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  this.toString = () => array.join();

  // 冒泡
  this.bubbleSort = () => {
    const len = array.length;
    for (let i = len - 1; i >= 0 ; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j] > array[j + 1]) {
          swap(i, j);
        }
      }
    }
  }

  // 选择
  this.selectionSort = () => {
    const len = array.length;
    let minIndex;
    for (let i = 0; i < len - 1; i++) {
      minIndex = i;
      for (let j = i + 1; j < len; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (i !== minIndex) {
        swap(i, minIndex);
      }
    }
  }

  // 插入
  this.insertSort = () => {
    const len = array.length;
    for (let i = 1; i < len; i++) {
      let j = i;
      const temp = array[i];
      while (j > 0 && array[j - 1] > temp) {
        array[j] = array[j - 1];
        j--;
      }
      array[j] = temp;
    }
  }

  // 归并
  let merge = (left, right) => {
    let result = [], li = ri = 0;
    const ll = left.length, rl = right.length;
    while (li < ll && ri < rl) {
      if (left[li] < right[ri]) {
        result.push(left[li++]);
      } else {
        result.push(right[ri++]);
      }
    }
    while (li < ll) {
      result.push(left[li++]);
    }
    while (ri < rl) {
      result.push(right[ri++]);
    }
    return result;
  }

  let mergeSortRec = (array) => {
    const len = array.length
    if (len === 1) {
      return array;
    }

    let mid = Math.floor(len / 2),
        left = array.slice(0, mid),
        right = array.slice(mid, len);
    return merge(mergeSortRec(left), mergeSortRec(right));
  }

  this.mergeSort = () => {
    array = mergeSortRec(array);
  }
  let cou = 0;
  //  快速排序
  let quick = (arr) => {
    if (arr.length <= 1) { return arr }
    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr.splice(pivotIndex, 1)[0];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] <= pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return quick(left).concat([pivot], quick(right));
  };
  this.quickSort = () => {
    array = quick(array);
  }

  // 顺序搜索
  this.sequentialSearch = (item) => {
    const len = array.length;
    for (let i = 0; i < len; i++) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  }

  // 二分搜索
  this.binarySearch = (item) => {
    this.quickSort();
    let low = 0, high = array.length - 1, mid, element;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      element = array[mid];
      if (element === item) {
        return mid;
      } else if (element < item) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return -1;
  }

}


// let array = new createNonSortArray(10);
// console.log('origin array', array.toString());
// array.bubbleSort();
// console.log('bubbleSort: ', array.toString());
// console.log('---------------------------------');
//
// array = new createNonSortArray(10);
// console.log('origin array', array.toString());
// array.selectionSort();
// console.log('selectionSort: ', array.toString());
// console.log('---------------------------------');
//
// array = new createNonSortArray(10);
// console.log('origin array', array.toString());
// array.insertSort();
// console.log('insertSort: ', array.toString());
// console.log('---------------------------------');
//
// array = new createNonSortArray(10);
// console.log('origin array', array.toString());
// array.mergeSort();
// console.log('mergeSort: ', array.toString());
// console.log('---------------------------------');

// array = new createNonSortArray(10);
// console.log('origin array', array.toString());
// array.quickSort();
// console.log('quickSort: ', array.toString());
// console.log('---------------------------------');

array = new createNonSortArray(100);
console.log('sequentialSearch: ', array.sequentialSearch(21), array.sequentialSearch(-10));
array = new createNonSortArray(100);
console.log('binarySearch: ', array.binarySearch(12), array.binarySearch(101));
