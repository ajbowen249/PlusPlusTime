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
