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
    if (node.value === value) {
      return node;
    }
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
    if (returnParent) {
      const parent = this.parentNode;
      this.parentNode = {};
      return { result, parent };
    } else {
      return result;
    }
  }
  levelOrderForEach(callback, modify = false) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    let queue = [];
    let result = [];
    queue.push(this.root);
    while (queue.length > 0) {
      const item = queue[0];
      if (modify) {
        queue[0] = callback(queue[0]);
        result.push(queue[0]);
      } else {
        const temp = callback(queue[0]);
        result.push(temp);
      }
      if (item.left !== null) {
        queue.push(item.left);
      }
      if (item.right !== null) {
        queue.push(item.right);
      }
      queue.shift();
    }
    return result;
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
  postOrderForEach(callback, node = this.root, result = [], modify = false) {
    if (callback === undefined) {
      throw new Error("Expected one argument, received none.");
    }
    if (node.left !== null) {
      this.postOrderForEach(callback, node.left, result);
    }
    if (node.right !== null) {
      this.postOrderForEach(callback, node.right, result);
    }
    if (modify) {
      callback(node);
      result.push(node.value);
    } else {
      const temp = callback(node);
      result.push(temp);
    }
    return result;
  }
  height(value) {
    const node = this.find(value);
    if (node === null) {
      return node;
    }
    function findHeight(node) {
      if (node === null) {
        return -1;
      }
      let left = findHeight(node.left);
      let right = findHeight(node.right);
      if (left > right) {
        return (left += 1);
      } else {
        return (right += 1);
      }
    }
    return findHeight(node);
  }
  depth(value) {
    let depth = 0;
    let node = this.root;
    while (value !== node.value) {
      if (node.right === null && node.left === null) {
        return null;
      }
      if (value < node.value) {
        node = node.left;
      } else {
        node = node.right;
      }
      depth++;
    }
    return depth;
  }
  isBalanced(node = this.root) {
    function checkBalance(node) {
      if (node === null) {
        return { height: 0, balanced: true };
      }
      const left = checkBalance(node.left);
      const right = checkBalance(node.right);
      if (!left.balanced || !right.balanced) {
        return { height: -1, balanced: false };
      }
      if (Math.abs(left.height - right.height) > 1) {
        return { height: -1, balanced: false };
      }
      const currentHeight = 1 + Math.max(left.height, right.height);
      return { height: currentHeight, balanced: true };
    }
    const result = checkBalance(node);
    return result.balanced;
  }
  rebalance() {
    this.arr = this.inOrderForEach((node) => node);
    this.root = this.buildTree(this.arr, 0, this.arr.length - 1);
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

function randomArray(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 1000));
  }
  return arr;
}

const tree = new Tree(randomArray(100));
console.log(tree.isBalanced());
tree.insert(100);
tree.insert(101);
tree.insert(102);
tree.insert(103);
tree.insert(104);
console.log(tree.isBalanced());
tree.rebalance();
console.log(tree.isBalanced());
