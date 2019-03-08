import React, { Component } from 'react';
import {shuffleBoard, copyBoard} from '../../util/gameUtil';
import Board from '../Board';
import ScoreBox from '../ScoreBox';
import CurrentWord from '../CurrentWord';
import Button from '../Button';
import './Game.css';
import Trie from '../../lib/boggle-solver/Trie';
import allWords from '../../lib/boggle-solver/words.json';

const SCORE_TABLE = {
  '4': 1,
  '5': 2,
  '6': 3,
  '7': 5
};

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.initBoard = shuffleBoard();
    this.dictionaryTrie = new Trie(allWords);
    this.state = {
      board: this.initBoard,
      currentWord: '',
      wordScoreList: {}
    };
  }

  // Tile Clicked
  handleClick(rowId, columnId) {
    //alert(rowId + '' + columnId)
    const letter = this.state.board[rowId][columnId].letter;
    //alert(letter)

    const newBoard = copyBoard(this.state.board);
    const selected = newBoard[rowId][columnId].selected;

    newBoard[rowId][columnId].selected = !selected;

    let newWord;
    if (!selected) {
      newWord = this.state.currentWord.concat(letter);
    } else {
      newWord = this.state.currentWord.slice(0, -1);
    }

    this.setState({ currentWord: newWord, board: newBoard });
  }

  // Adds Current Word to the Word List
  handleSubmit(word) {
    console.log('handleSubmit');
    console.log('word', word);
    const found = this.dictionaryTrie.search(word);
    console.log('found', found);
    if (found) {
      let score = 0;
      const wordLength = word.length;
      if (wordLength < 4) {
        return;
      }
      console.log('wordLength', wordLength);
      console.log('SCORE_TABLE[wordLength]', SCORE_TABLE[wordLength.toString()]);
      if (wordLength > 7) {
        score = 11;
      } else if (SCORE_TABLE[wordLength]) {
        score = SCORE_TABLE[wordLength];
      } else {
        score = 0;
      }
      const updatedWordScoreList = this.state.wordScoreList;
      updatedWordScoreList[word] = score;
      console.log('updatedWordScoreList', updatedWordScoreList);
      this.setState({
        wordScoreList: updatedWordScoreList,
        currentWord: ''
      });

    }
  }

  render() {
    return (
      <div>
        <div className="game-area">
          <Board
            board={this.state.board}
            // TODO 4): Pass Board onClick callback as props
            handleClick={(rowId, columnId) => this.handleClick(rowId, columnId)}
          />
          <CurrentWord
            // TODO 1): Pass CurrentWord props
            currentWord={this.state.currentWord}
            label={'current Word'}
          />
          <Button
            // TODO 1): Pass Button Prop
            label={'submit word'}
            handleSubmit={() => this.handleSubmit(this.state.currentWord)}

            // TODO 4): Pass Button Callback
          />
        </div>

        <ScoreBox
          // TODO 2): Pass ScoreBox Props
          wordScoreList={this.state.wordScoreList}

          // TODO 3): Calculate Score using reduce
        />

        {/* Makes Board and ScoreBox be side by side */}
        <div className="clear" />
      </div>
    );
  }
}
