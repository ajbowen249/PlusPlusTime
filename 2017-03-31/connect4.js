"use strict";

// Connect Four Tournament

///////////////////////////////////////////////////////////////////
// Utility functions.

const NUM_COLUMNS = 7;
const NUM_ROWS = 6;
const VICTORY_SPAN_LENGTH = 4;
const DEBUG_SHOW_GAME_MESSAGES = true;
const DEBUG_SHOW_GAME_BOARD_MESSAGES = true;

function inBrowser() {
  return 'undefined' != typeof document;
}

function message( string, terminator ) {
  if( inBrowser() ) {
    document.getElementById("messageArea").innerHTML += string + ( terminator || "<br />" )
    console.log( string );
  }
  else {
    process.stdout.write( string + ( terminator || "\n" ));
  }
}

function gameMessage( string, terminator ) {
  if( DEBUG_SHOW_GAME_MESSAGES ) {
    message( string, terminator );
  }
}

function boardMessage( string, terminator ) {
  if( DEBUG_SHOW_GAME_BOARD_MESSAGES ) {
    gameMessage( string, terminator );
  }
}

function assert( expression ) {
  if( !expression ) {
    alert( "Assertion failed." );
  }
}

function shuffle(array) { // From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createBoard() {
  let board = [];
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    let columnArray = [];
    for( let row = 0; row < NUM_ROWS; ++row ) {
      columnArray.push( undefined );
    }
    board.push( columnArray );
  }
  return board;
}

function copyBoard( board ) {
  let newBoard = [];
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    let columnArray = [];
    for( let row = 0; row < NUM_ROWS; ++row ) {
      columnArray.push( boardCellPlayer( board, column, row ) );
    }
    newBoard.push( columnArray );
  }
  return newBoard;
}

function boardText( board ) {
  let text = ""

  inBrowser() && ( text += "<table class='board'>" );
  
  for( let row = NUM_ROWS - 1; row >= 0; --row ) {
    if( inBrowser() ) {
      text += "<tr>";
    }
    for( let column = 0; column < NUM_COLUMNS; ++column ) {
      const player = boardCellPlayer( board, column, row );
      inBrowser() && ( text += "<td>" );
      text += ( player != undefined ? player : '⚪️' ) 
      inBrowser() && ( text += "</td>" );
    }
    if( inBrowser() ) {
      text += "</tr>";
    }
    else {
      text += "\n";
    }
  }
  inBrowser() && ( text += "</table>" );
  return text;
}

function boardCellPlayer( board, column, row ) {
  if( 0 <= column && column < NUM_COLUMNS &&
      0 <= row && row < NUM_ROWS ) {
    return board[ column ][ row ];
  }
  else {
    return undefined;
  }
}

function occupiedColumnHeight( board, column ) {
  const columnArray = board[ column ];
  for( let i = 0; i < NUM_ROWS; ++i ) {
    const cell = columnArray[ i ];
    if( cell == undefined ) {
      return i;
    }
  }   
  return NUM_ROWS;
}

function isLegalMove( board, column ) {
  if( column == null || column == undefined ) {
    return false;
  }
  if( column < 0 || column >= NUM_COLUMNS ) {
    return false;
  }
  return occupiedColumnHeight( board, column ) < NUM_ROWS;
}

function evaluateSpan( board, col, row, colStep, rowStep ) {
  // Returns the player ID of the winning player if there is one; else null.
  let potentialWinner = null;
  for( let i = 0; i < VICTORY_SPAN_LENGTH; ++i ) {
    const playerHere = boardCellPlayer( board, col, row );
    if( playerHere == undefined ) {
      return null;
    }
    else if( potentialWinner == null ) {
      potentialWinner = playerHere;
    }
    else if( potentialWinner != playerHere ) {
      return null;
    }
    col += colStep;
    row += rowStep;
  }
  
  return potentialWinner;
}

function evaluateGameOver( board ) {
  // Does someone have a victory span ("four in a row")?
  //
  let spaceRemains = false;
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    
    // Check whether space remains in this column. If at the end no column has space
    // and no one has won, it's a draw.
    spaceRemains = spaceRemains || ( occupiedColumnHeight( board, column ) < NUM_ROWS );
    
    for( let row = 0; row < NUM_ROWS; ++row ) {
      let winner = null;
      
      winner = winner || evaluateSpan( board, column, row, 1, 0 );
      winner = winner || evaluateSpan( board, column, row, 0, 1 );        
      winner = winner || evaluateSpan( board, column, row, 1, 1 );
      winner = winner || evaluateSpan( board, column, row, 1, -1 );
      
      if( winner != null ) {
        return {
          winningPlayerSymbol: winner,
          isDraw: false
        };
      }
    }
  }
  
  return spaceRemains ? null : { isDraw: true };
}

///////////////////////////////////////////////////////////////////
// Tournament infrastructure

function playTournament( players, numRounds = 1 ) {

  let pointsPerPlayer = {}
  for( let player of players ) {
    pointsPerPlayer[ player.name ] = 0;
  }

  for( let round = 0; round < numRounds; ++round ) {
    message( "ROUND " + (round + 1) + " ----------------------" );
    
    for( let i = 0; i < players.length - 1; ++i ) {
      const player1 = players[ i ];
      for( let j = i + 1; j < players.length; ++j ) {
        const player2 = players[ j ];
        
        const matchPlayers = [player1, player2]
        
        // Randomize first player.
        if( Math.random() < 0.5 ) {
          const temp = matchPlayers[ 0 ];
          matchPlayers[ 0 ] = matchPlayers[ 1 ];
          matchPlayers[ 1 ] = temp;
        }
        
        const gameResult = playGame( matchPlayers[ 0 ], matchPlayers[ 1 ] );
        
        if( gameResult != null ) {
          message( gameResult.winner.name + " defeats " + gameResult.loser.name );
        
          pointsPerPlayer[ gameResult.winner.name ] += 1
          pointsPerPlayer[ gameResult.loser.name ] -= 1
        }
        else {
          message( matchPlayers[ 0 ].name + " and " + matchPlayers[ 1 ] + " draw " );
        }
      }
    }    
  }
  
  return pointsPerPlayer  
}

function playGame( player1, player2 ) {
  const playerSymbols = ["🔴", "🔵"];

  gameMessage( player1.name + " (" + playerSymbols[ 0 ] + ") vs. " + player2.name + " (" + playerSymbols[ 1 ] + ")" );      

  const players = [player1, player2];
  let currentPlayerIndex = 0;
  
  // Create the board.
  let board = createBoard();
  
  let halfTurnIndex = 0
  while( true ) {
    const otherPlayerIndex = ( currentPlayerIndex + 1 ) % 2;
    const currentPlayer = players[ currentPlayerIndex ];
    const symbol = playerSymbols[ currentPlayerIndex ]; 
    const hisSymbol = playerSymbols[ otherPlayerIndex ]; 
    
    // Copy the board so sneaky players can't change it.
    //
    let boardCopy = copyBoard( board );
    gameMessage( "Player " + (currentPlayerIndex + 1) + " '" + currentPlayer.name + "' (" + symbol + ") deciding move..." );
    
    const column = currentPlayer.function( halfTurnIndex, boardCopy, symbol, hisSymbol );
    
    gameMessage( "Playing column " + column );
    
    if( isLegalMove( board, column )) {
      gameMessage( "Legal. Applying." );
    
      applyMove( board, column, symbol );
      
      boardMessage( boardText( board ));
      
      const evaluationResult = evaluateGameOver( board );
      if( evaluationResult != null ) {
        gameMessage( "Game over." );
        
        // Game over. Who won? Or drew?
        //
        if( evaluationResult.isDraw ) {
          return null;
        }
        else {
          assert( evaluationResult.winningPlayerSymbol == symbol );
          return {
            winner: players[ currentPlayerIndex ],
            loser:  players[ otherPlayerIndex ]
          };
        }
      }
    }
    else {
      gameMessage( "Illegal. Player forfeits." );

      // Illegal move. Player forfeits.
      //
      return {
        winner: players[ otherPlayerIndex ],
        loser:  players[ currentPlayerIndex ]
      };
    }
    
    currentPlayerIndex = otherPlayerIndex;
    halfTurnIndex += 1;
  }
}

function playerName( playerFunction ) {
  for( let player of players ) {
    if( player.function == playerFunction ) {
      return player.name
    }
  }
}

function setBoardCellPlayer( board, column, row, player ) {
  board[ column ][ row ] = player;
}

function applyMove( board, column, playerId ) {
  const row = occupiedColumnHeight( board, column );
  setBoardCellPlayer( board, column, row, playerId );
}

const players = [
  { name: "Laszlo1", function: laszloPlayer1 },
//  { name: "Laszlo2", function: laszloPlayer2 },
 // { name: "Todd", function: blockingPlayer },
 // { name: "Alex", function: alexsPlayer },
 // { name: "Chris", function: TobeyPlayer },
 // { name: "Justin", function: playerJustin },
  { name: "Jeff", function: jeffsPlayer },
  // TODO: Add players here
];

const results = playTournament( players, 1 );

message( "Tournament results: --------------------" );
for( let result in results ) {
  message( result + ": " + results[ result ] );
}

///////////////////////////////////////////////////////////////////
// Stock players.
//
// A player function must return an integer indicating which column
// to add its piece to. The move must be legal or the player will
// be considered to have forfeited the game.
//
// `halfTurnCount` is the number of half-turns (moves by a single player)
// since the game begin. This is initial zero and increments by 1 for
// every "move" made by either player.
//
// `board` is an array of NUM_COLUMNS columns where each column is
// an array of NUM_ROWS "cells". Each cell is either `undefined` (no piece
// occupies this cell), or is the ID of a player.
//
// Do not modify the board. You may do so, but doing so has no effect
// on the game.
//
// `me` is the ID of the current player. Board cells with this value
// are "mine." Board cells with `undefined` are unoccupied.
// Board cells with any other value belong to the other player.

function randomPlayer( halfTurnCount, board, me, him ) {

  // Build a list of possible moves.
  //
  let possibleMoves = []
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    possibleMoves[ column ] = column;
  }
  
  // Scramble moves randomly.
  //
  possibleMoves = shuffle( possibleMoves );
  
  // Pick the first one that's legal.
  //
  for( let move of possibleMoves ) {
    if( isLegalMove( board, move )) {
      return move;
    }
  }
  
  // Shouldn't happen.
  return null;
}

function simplePlayer( halfTurnCount, board, me, him ) {

  // Build a list of possible moves.
  //
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    if( isLegalMove( board, column )) {
      return column;
    }
  }
  
  // Shouldn't happen.
  return null;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

function laszloPlayer1( halfTurnCount, board, me, him ) {
  function enemyOnTop( board, column, me, him ) {
    return true;
      let row;
    row = occupiedColumnHeight( board, column );
    if(boardCellPlayer( board, colH, row ) == him){
        return true;
    }

    return false;
  }


  let possibleMoves = []
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    possibleMoves[ column ] = column;
  }
  
  for( let move of possibleMoves ) {
    if( isLegalMove( board, move )) {
    if(enemyOnTop(board, move, me, him) && (occupiedColumnHeight( board, move ) < 4)){
        return move;
      }
    }
  }

  return simplePlayer(halfTurnCount, board, me, him);
  
  // Shouldn't happen.
  return null;
}

function laszloPlayer2( halfTurnCount, board, me, him ) {
  function enemyOnTop( board, column, me, him ) {
      let row;
    row = occupiedColumnHeight( board, column );
    if(boardCellPlayer( board, column, row - 1 ) == him){
        return true;
    }

    return false;
  }


  let possibleMoves = []
  for( let column = 0; column < NUM_COLUMNS; ++column ) {
    possibleMoves[ column ] = column;
  }
  
  for( let move of possibleMoves ) {
    if( isLegalMove( board, move )) {
      if(enemyOnTop(board, move, me, him) && (occupiedColumnHeight( board, move ) < 4)){
          return move;
      }
    }
  }

  return simplePlayer(halfTurnCount, board, me, him);
  
  // Shouldn't happen.
  return null;
}
function blockingPlayer(halfTurnCount, board, me, him) {
  function evaluateSpanX( board, col, row, colStep, rowStep, spanLength ) {
    // Returns the player ID of the winning player if there is one; else null.
    let potentialWinner = null;
    for( let i = 0; i < spanLength; ++i ) {
      const playerHere = boardCellPlayer( board, col, row );
      if( playerHere == undefined ) {
        return null;
      }
      else if( potentialWinner == null ) {
        potentialWinner = playerHere;
      }
      else if( potentialWinner != playerHere ) {
        return null;
      }
      col += colStep;
      row += rowStep;
    }
    let x = {'potentialWinner': potentialWinner, 'col': col, 'row': row};
    return x
  }
  function checkConnected(board) {
    for( let column = 0; column < NUM_COLUMNS; ++column ) {
      for( let row = 0; row < NUM_ROWS; ++row ) {
        let c_penult, r_penult, da_penult, dd_penult = null;
  //               evaluateSpan( board, col, row, colStep, rowStep, spanLength)
        c_penult = evaluateSpanX( board, column, row, 1, 0, 3 );
        r_penult =   evaluateSpanX( board, column, row, 0, 1, 3 );
        da_penult =   evaluateSpanX( board, column, row, 1, 1, 3 );
        dd_penult =   evaluateSpanX( board, column, row, 1, -1, 3 );

        let results = [c_penult, r_penult, da_penult, dd_penult];
        for(let res = 0; res< results.length; res++) {
          if( results[res] != null ) {
              // let nextMove = {'col': col, 'row': row};
              return results[res]

          }
        }

      }
    }
  }
    let possible = checkConnected(board)
    // console.log('possible ',possible)
    if (possible && isLegalMove( board, possible.col )){
        return possible.col
    }
    else {
        //choose randomly
        let possibleMoves = []
        for( let column = 0; column < NUM_COLUMNS; ++column ) {
            possibleMoves[ column ] = column;
        }
        possibleMoves = shuffle( possibleMoves );

        // Pick the first one that's legal.
        //
        for( let move of possibleMoves ) {
            if( isLegalMove( board, move )) {
            return move;
            }
        }
    }
    return null
}

function alexsPlayer(halfTurnCount, board, me, him) {
    function canColWin(someBoard, col, player) {
        let thisBoard = copyBoard(someBoard);
        applyMove(thisBoard, col, player);
        let result = evaluateGameOver(thisBoard);
        return (result != null && !result.isDraw && result.winningPlayerSymbol == me);
    }

    function willColHelpHimWin(col) {
        let thisBoard = copyBoard(board);
        applyMove(thisBoard, col, me);
        for(var i = 0; i < NUM_COLUMNS; i++) {
            let futureBoard = copyBoard(thisBoard);
            if(isLegalMove(futureBoard, i) && canColWin(futureBoard, i, him)) {
                return true;
            }
        }

        return false;
    }

    let scores = [];

    for(var i = 0; i < NUM_COLUMNS; i++) {
        if(isLegalMove(board, i)) {
            //will going here make me win?
            if(canColWin(board, i, me)) {
                scores.push({column: i, score: 1});
            //will going here block an enemy win?
            } else if (canColWin(board, i, him)) {
                scores.push({column: i, score: 2});
            //am I helping the other player win?
            } else if (willColHelpHimWin(i)) {
                scores.push({column: i, score: 4});
            } else {
                scores.push({column: i, score: 3});
            }
        }
    }

    let sorted = scores.sort((a, b) => a.score - b.score);
    let highestScore = sorted[0].score;

    let lastIndex = 0;
    for(; lastIndex < sorted.length - 1; lastIndex++) {
        if(sorted[lastIndex].score != highestScore) {
            lastIndex--;
            break;
        }
    }

    let randomHighestScoreIndex = Math.floor(Math.random() * (1 + lastIndex));

    return sorted[randomHighestScoreIndex].column;
}

function TobeyPlayer( halfTurnCount, board, me, him ) {
  
  let me_in_row = 0;
  let other_in_row = 0;
  for( let i = 0; i < NUM_COLUMNS; ++i ) {
    me_in_row = other_in_row = 0;
    if ( isLegalMove( board, i ) ) {
      for( let j = 0; j < NUM_ROWS; ++j ) {
        const cell = board[ i ][ j ];
        if( cell == undefined ) { break; }
        else {
          if ( cell == me ) { me_in_row++; }
          else { other_in_row++; }
          if ( me_in_row == 3 || other_in_row == 3 ) { return i; }
        }
      }
    }
  }
  for( let j = 0; j < NUM_ROWS; ++j ) {
    me_in_row = other_in_row = 0;
    for( let i = 0; i < NUM_COLUMNS; ++i ) {
      const cell = board[ i ][ j ];
      if( cell == undefined ) { break; }
      else {
        if ( cell == me ) { me_in_row++; }
        else { other_in_row++; }
        if (( me_in_row == 3 || other_in_row == 3 ) && isLegalMove( board, i )) { return i; }
      }
    }
  }
  
  for( let column = NUM_COLUMNS; column > 0; --column ) {
    if( isLegalMove( board, column )) {
      return column;
    }
  }

  // Shouldn't happen.
  return null;
}

function playerJustin( halfTurnCount, board, me, them ) {
  const DIAG_ROWS = 6
  let vectors = [
    {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0},
    {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0},
    {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0}, {me:0, them:0, empty:0, dir:0, row:0},
    {me:0, them:0, empty:0, dir:0, row:0}
  ]
  let count = 0

  for (let r = 0; r < NUM_ROWS; r++ ) {
    vectors[count].dir = "row"
    vectors[count].row = r;
    for (let c = 0; c < NUM_COLUMNS; c++ ) {
      if (board[c][r] == me) {
        vectors[count].me++
      }
      else if (board[c][r] == them) {
        vectors[count].them++
      }
      else {
        vectors[count].empty++
      }
    }
    count++
  }
  //console.log("out of rows")
  for (let c = 0; c < NUM_COLUMNS; c++ ) {
    vectors[count].dir = "col"
    vectors[count].row = c;
    for (let r = 0; r < NUM_ROWS; r++ ) {
      if (board[c][r] == me) {
        vectors[count].me++
      }
      else if (board[c][r] == them) {
        vectors[count].them++
      }
      else {
        vectors[count].empty++
      }
    }
    count++
  }
  //console.log("out of cols")
  let moves = []
  for (let vector of vectors) {
    if (vector.empty === 0) {
      break;
    }
    else {
      moves.push(vector)
    }
  }
  //console.log("out of pos")
  moves.sort((a, b) => {
    return b.them > a.them
  })

  //console.log("out of sort")
  if (moves[0].dir === "col") {
    return moves[0].row
  }
  for (let c =0; c < NUM_COLUMNS; c++) {
    if (isLegalMove(board, c)) {
      return c
    }
  }
}

function jeffsPlayer( halfTurnCount, board, me, him ) {
  const MAX_DEPTH = 4;

  function scoreBoardPositionally( board, move, me, him ) {
    // Is this a win for him or me?
    //
    const evaluationResult = evaluateGameOver( board );
    if( evaluationResult != null ) {
        if( evaluationResult.isDraw ) {
          return -0.5;
        }
        else if( evaluationResult.winningPlayerSymbol == me ) {
          return 1000;
        }
        else {
          return -1000;
        }
    }

    const middle = NUM_COLUMNS / 2;
    return middle - Math.abs( move - middle );
  }

  function scoreMove( board, move, me, him, depth ) {
    const amendedBoard = copyBoard( board );
    applyMove( amendedBoard, move, me );

    if( depth >= MAX_DEPTH ) {
      return scoreBoardPositionally( amendedBoard, move, me, him );
    }
    else {
      // Consider possible moves by the opposing player.
      //
      let possibleReplies = []
      for( let column = 0; column < NUM_COLUMNS; ++column ) {
        if( isLegalMove( amendedBoard, column )) {
          possibleReplies.push( column );
        }
      }

      const bestReply = bestMove( amendedBoard, him, me, depth + 1 );
      if( isLegalMove( amendedBoard, bestReply, him )) {
        applyMove( amendedBoard, bestReply, him );
        return bestMove( amendedBoard, me, him, depth + 1 );
      }
      else {
        return scoreBoardPositionally( amendedBoard, move, me, him );
      }
    }
  }

  function bestMove( board, me, him, depth = 0 ) {
    let bestScore = -1000000000;
    let bestColumn = null;
    for( let column = 0; column < NUM_COLUMNS; ++column ) {
      if( isLegalMove( board, column )) {
        const score = scoreMove( board, column, me, him, depth );
        if( bestColumn == null || score > bestScore ) {
          bestScore = score;
          bestColumn = column;
        }
      }
    }

    return bestColumn;
  }

  return bestMove( board, me, him );
}