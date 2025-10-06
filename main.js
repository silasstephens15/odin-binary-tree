import mergeSort from "./merge-sort.js";

class Tree {
  constructor(arr) {
    this.arr = mergeSort(arr);
    this.root = this.buildTree(this.arr, 0, this.arr.length - 1);
    this.parentNode = {};
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
    const combined = this.find(value, true);
    const node = combined.result;
    const parent = combined.parent;
    if (node.right === null && node.left === null) {
      if (parent.left === node) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    } else {
      if (node.left === null) {
        if (parent.right === node) {
          parent.right = node.right;
        } else {
          parent.left = node.right;
        }
      }
      if (node.right === null) {
        if (parent.right === node) {
          parent.right = node.left;
        } else {
          parent.left = node.left;
        }
      }
      if (node.right !== null && node.left !== null) {
        this.deleteTwoChild(node, parent);
      }
    }

    this.arr.splice(this.arr.indexOf(value), 1);
  }
  deleteTwoChild(node, parent) {
    let replacement = node.right;
    while (replacement.left !== null) {
      replacement = replacement.left;
    }
    this.deleteItem(replacement.value);
    replacement.right = node.right;
    replacement.left = node.left;
    if (parent === null) {
      this.root = replacement;
      return;
    }
    if (parent.left === node) {
      parent.left = replacement;
    } else {
      parent.right = replacement;
    }
  }
  find(value, returnParent = false, node = this.root) {
    let result = {};
    if (node.value > value) {
      if (node.left !== null) {
        this.parentNode = node;
        result = this.find(value, false, node.left);
      } else {
        return null;
      }
    }
    if (node.value < value) {
      if (node.right !== null) {
        this.parentNode = node;
        result = this.find(value, false, node.right);
      } else {
        return null;
      }
    }
    if (Object.keys(this.parentNode).length === 0) {
      return { result: node, parent: null };
    }
    if (node.value === value) {
      return node;
    }
    if (returnParent) {
      const parent = this.parentNode;
      this.parentNode = {};
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
