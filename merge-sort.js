function mergeSort(arr, sorted = [], compare1 = [], compare2 = []) {
  if (arr.length === 1) {
    return arr;
  }
  compare1 = mergeSort(arr.slice(0, Math.round(arr.length / 2)));
  compare2 = mergeSort(arr.slice(Math.round(arr.length / 2), arr.length));
  while (compare1.length !== 0 && compare2.length !== 0) {
    if (compare1[0] < compare2[0]) {
      sorted.push(compare1[0]);
      compare1.shift();
    } else {
      sorted.push(compare2[0]);
      compare2.shift();
    }
  }
  if (compare1.length !== 0) {
    sorted.push(...compare1);
  }
  if (compare2.length !== 0) {
    sorted.push(...compare2);
  }
  return sorted;
}

export default mergeSort;
