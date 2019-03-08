const END_SYMBOL = '$';

class Node {
  constructor({ children = [], value = null } = {}) {
    this.children = children;
    this.value = value;
  }

  findChild(value) {
    const child = this.children.filter(child => child.value === value);
    return child[0] || null;
  }

  addChild(node) {
    this.children = [...this.children, node];
  }
}

export default class Trie {
  constructor(stringList = []) {
    this.root = new Node();
    this.insertMultiple(stringList);
  }

  insertMultiple(stringList) {
    stringList.forEach(string => this.insert(string));
  }

  insert(toInsert) {
    const appendedString = `${toInsert}${END_SYMBOL}`;
    let currentNode = this.root;

    appendedString.split('').forEach(character => {
      const node = currentNode.findChild(character);

      if (node) {
        currentNode = node;
      } else {
        const newNode = new Node({ value: character });
        currentNode.addChild(newNode);
        currentNode = newNode;
      }
    });

    return this.root;
  }

  search(toFind) {
    const appendedString = `${toFind}${END_SYMBOL}`;
    let current = this.root;

    for (let i = 0; i < appendedString.length; i++) {
      const character = appendedString[i];
      const node = current.findChild(character);
      if (node) {
        current = node;
        if (appendedString.length - 1 === i) {
          // we have reached the end of the word leaf-node
          return true;
        }
      } else {
        return false;
      }
    }
  }

  prefix(prefixToSearch) {
    const appendedString = `${prefixToSearch}`;
    let current = this.root;
    const combination = [];

    appendedString.split('').forEach(character => {
      const node = current.findChild(character);
      if (node) {
        current = node;
      }
    });

    if (current === this.root) {
      return [];
    }

    this.transverse(current, '', accumulated => {
      combination.push(`${prefixToSearch}${accumulated}`);
    });

    return combination;
  }

  transverse(root, accumulator, callback) {
    root.children.forEach(node => {
      if (node.value === END_SYMBOL) {
        callback(accumulator);
        return;
      }
      this.transverse(node, `${accumulator}${node.value}`, callback);
    });
  }
}
