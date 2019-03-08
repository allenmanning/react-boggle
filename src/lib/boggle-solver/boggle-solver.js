import Trie from './Trie';
export const findNeighbors = ({ position, size }) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];
  const [row, column] = position;
  return directions.reduce((neighbors, direction) => {
    const [x, y] = direction;
    const rowSum = x < 0 ? row - Math.abs(x) : row + x;
    const colSum = y < 0 ? column - Math.abs(y) : column + y;

    const validPosition = rowSum >= 0 && colSum >= 0;
    const validSize = rowSum < size && colSum < size;

    if (validPosition && validSize) {
      const neighbor = [rowSum, colSum];
      neighbors.push(neighbor);
    }

    return neighbors;
  }, []);
};

export const getMatrixFromLetters = ({ size, letters }) => {
  const result = [];

  letters.split('').reduce((accumulator, letter, index) => {
    accumulator.push(letter);
    if ((index + 1) % size === 0) {
      result.push(accumulator);
      accumulator = [];
    }
    return accumulator;
  }, []);

  return result;
};

export const solveBoggle = ({
  letters = '',
  dictionaryTrie = null,
  allWords = [],
  size = 4,
  minWordLength = 3
} = {}) => {
  const boggleMatrix = getMatrixFromLetters({ size, letters });
  const result = [];
  if (!dictionaryTrie) {
    dictionaryTrie = new Trie(allWords);
  }

  const solve = function(word, position, usedPositions = []) {
    if (word.length >= minWordLength) {
      const isValid = dictionaryTrie.search(word);
      const isFound = result.includes(word);
      if (isValid && !isFound) {
        result.push(word);
      }
    }

    const filter = usedPositions;
    const neighbor = findNeighbors({ position, size });
    const filteredNeighbors = neighbor.filter(neighbor => {
      return !filter.some(item => {
        return item.every((item, index) => {
          return item === neighbor[index];
        });
      });
    });

    const validNeighbors = filteredNeighbors.filter(neighbor => {
      const [x, y] = neighbor;
      const isPrefix = dictionaryTrie.prefix(word + boggleMatrix[x][y]);
      return isPrefix;
    });

    const used = [...usedPositions];
    validNeighbors.forEach(neighbor => {
      used.push(position);
      const [x, y] = neighbor;
      const letter = boggleMatrix[x][y];
      const currentWord = word + letter;
      solve(currentWord, neighbor, used);
    });
  };

  boggleMatrix.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      solve(boggleMatrix[rowIndex][columnIndex], [rowIndex, columnIndex]);
    });
  });

  return result;
};