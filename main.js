import mergeSort from "./merge-sort.js";

class Tree {
  constructor(arr) {
    this.arr = mergeSort(arr);
    this.root = this.buildTree(this.arr, 0, this.arr.length - 1);
  }
  buildTree(arr, start, end) {
    if (start > end) {
      return null;
    }
    let mid = start + Math.floor((end - start) / 2);
    let root = this.newNode(arr[mid]);
    root.left = this.buildTree(arr, start, mid - 1);
    root.right = this.buildTree(arr, mid + 1, end);
    return root;
  }
  newNode(value) {
    return { value, right: null, left: null };
  }
  insert(value, node = this.root) {
    if (node.value > value) {
      if (node.left !== null) {
        this.insert(value, node.left);
      } else {
        node.left = this.newNode(value);
        this.arr.push(value);
      }
    } else {
      if (node.right !== null) {
        this.insert(value, node.right);
      } else {
        node.right = this.newNode(value);
        this.arr.push(value);
      }
    }
  }
  deleteItem(value) {
    const node = this.find(value, true);
    if (node.right === null && node.left === null) {
    }

    this.arr.splice(this.arr.indexOf(value), 1);
  }
  find(value, returnParent = false, node = this.root, parent = {}) {
    let result = {};
    if (node.value === value) {
      return node;
    }
    if (node.value > value) {
      if (node.left !== null) {
        parent.value = node.value;
        parent.left = node.left;
        parent.right = node.right;
        result = this.find(value, false, node.left, parent);
      } else {
        return null;
      }
    } else {
      if (node.right !== null) {
        parent.value = node.value;
        parent.left = node.left;
        parent.right = node.right;
        result = this.find(value, false, node.right, parent);
      } else {
        return null;
      }
    }
    if (returnParent) {
      return { result, parent };
    } else {
      return result;
    }
  }
  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
tree.prettyPrint();
console.log(tree.find(7, true));
