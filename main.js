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
  levelOrderForEach(callback) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    let queue = [];
    let result = [];
    queue.push(this.root);
    while (queue.length > 0) {
      const item = queue[0];
      queue[0] = callback(queue[0]);
      if (item.left !== null) {
        queue.push(item.left);
      }
      if (item.right !== null) {
        queue.push(item.right);
      }
      queue.shift();
    }
  }
  inOrderForEach(callback, node = this.root, result = []) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    if (node.left !== null) {
      this.inOrderForEach(callback, node.left, result);
    }
    callback(node);
    result.push(node.value);
    if (node.right !== null) {
      this.inOrderForEach(callback, node.right, result);
    }
    return result;
  }
  preOrderForEach(callback, node = this.root, result = []) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    callback(node);
    result.push(node.value);
    if (node.left !== null) {
      this.preOrderForEach(callback, node.left, result);
    }
    if (node.right !== null) {
      this.preOrderForEach(callback, node.right, result);
    }
    return result;
  }
  postOrderForEach(callback, node = this.root, result = []) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    if (node.left !== null) {
      this.postOrderForEach(callback, node.left, result);
    }
    if (node.right !== null) {
      this.postOrderForEach(callback, node.right, result);
    }
    callback(node);
    result.push(node.value);
    return result;
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
