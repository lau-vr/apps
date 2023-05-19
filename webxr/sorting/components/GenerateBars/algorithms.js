export function bubbleSort(arr) {
  const output = [];
  output.push([...arr]);
  //Outer pass
  for (let i = 0; i < arr.length; i++) {
    //Inner pass
    for (let j = 0; j < arr.length - i - 1; j++) {
      //Value comparison using ascending order
      if (arr[j + 1] <= arr[j]) {
        //Swapping
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        output.push([...arr]);
      }
    }
  }
  return output;
}

export function insertionSort(arr) {
  const output = [];
  output.push([...arr]);

  //Start from the second element.
  for (let i = 1; i < arr.length; i++) {
    //Go through the elements behind it.
    for (let j = i - 1; j > -1; j--) {
      //value comparison using ascending order.
      if (arr[j + 1] < arr[j]) {
        //swap
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        output.push([...arr]);
      }
    }
  }

  return output;
}

export function selectionSort(arr) {
  const output = [];
  output.push([...arr]);
  let min;

  //start passes.
  for (let i = 0; i < arr.length; i++) {
    //index of the smallest element to be the ith element.
    min = i;

    //Check through the rest of the array for a lesser element
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }

    //compare the indexes
    if (min !== i) {
      //swap
      [arr[i], arr[min]] = [arr[min], arr[i]];
      output.push([...arr]);
    }
  }

  return output;
}

function partition(items, left, right, output) {
  //rem that left and right are pointers.

  let pivot = items[Math.floor((right + left) / 2)],
    i = left, //left pointer
    j = right; //right pointer

  while (i <= j) {
    //increment left pointer if the value is less than the pivot
    while (items[i] < pivot) {
      i++;
    }

    //decrement right pointer if the value is more than the pivot
    while (items[j] > pivot) {
      j--;
    }

    //else we swap.
    if (i <= j) {
      [items[i], items[j]] = [items[j], items[i]];
      output.push([...items]);
      i++;
      j--;
    }
  }

  //return the left pointer
  return i;
}

export function quickSort(items, left, right, output) {
  if (typeof output === "undefined") {
    output = [];
    output.push([...items]);
  }
  if (typeof left === "undefined") left = 0;
  if (typeof right === "undefined") right = items.length - 1;
  let index;

  if (items.length > 1) {
    index = partition(items, left, right, output); //get the left pointer returned

    if (left < index - 1) {
      //more elements on the left side
      quickSort(items, left, index - 1, output);
    }

    if (index < right) {
      //more elements on the right side
      quickSort(items, index, right, output);
    }
  }

  return output; //return the sorted array
}

var trackedArr = [];

function mergeArrays(left_sub_array, right_sub_array) {
  let array = [];
  while (left_sub_array.length && right_sub_array.length) {
    if (left_sub_array[0] < right_sub_array[0]) {
      array.push(left_sub_array.shift());
    } else {
      array.push(right_sub_array.shift());
    }
  }
  return [...array, ...left_sub_array, ...right_sub_array];
}

export function mergeSort(unsorted_Array, index, output) {
  const middle_index = unsorted_Array.length / 2;
  let isFirst = false;
  if (typeof index === "undefined" || output === "undefined") {
    index = 0;
    output = [];
    isFirst = true;
    trackedArr = [...unsorted_Array];
    output.push(trackedArr);
  }

  if (unsorted_Array.length < 2) {
    return unsorted_Array;
  }
  const left_sub_array = unsorted_Array.splice(0, middle_index);
  const leftCopy = [...left_sub_array];

  const merged = mergeArrays(
    mergeSort(left_sub_array, index, output),
    mergeSort(unsorted_Array, index + leftCopy.length, output)
  );

  trackedArr = [
    ...trackedArr.slice(0, index),
    ...merged,
    ...trackedArr.slice(index + merged.length),
  ];
  output.push(trackedArr);
  if (isFirst) return output;
  return merged;
}

/* to create MAX  array */
function heap_root(input, i, array_length, output) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if (left < array_length && input[left] > input[max]) {
    max = left;
  }

  if (right < array_length && input[right] > input[max]) {
    max = right;
  }

  if (max != i) {
    swap(input, i, max, output);
    heap_root(input, max, array_length, output);
  }
}

function swap(input, index_A, index_B, output) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;

  output.push([...input]);
}

export function heapSort(input) {
  const output = [];
  output.push([...input]);

  var array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heap_root(input, i, array_length, output);
  }

  for (i = input.length - 1; i > 0; i--) {
    swap(input, 0, i, output);
    array_length--;

    heap_root(input, 0, array_length, output);
  }

  return output;
}
