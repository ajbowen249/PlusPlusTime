function winningBot(symbol, gameboard) {
    var numOf = (arr, check) => {
        var count = 0;
        for(item in arr){
            if(check(arr[item])) count++;
        }

        return count;
    };

    var firstOf = (arr, check) => {
        for(item in arr){
            if(check(arr[item])) return arr[item];
        }

        return -1;
    };
    
    var enemy = symbol == 'X' ? 'O' : 'X';
    var indexScores = [];

    for(route in possibleRoutes) {
        var firstAvailableSpaceOnRoute = firstOf(possibleRoutes[route], index => gameboard[index] == ' ');
        if(firstAvailableSpaceOnRoute == -1) continue;

        var mySpaces = numOf(possibleRoutes[route], index => gameboard[index] == symbol);
        var enemySpaces = numOf(possibleRoutes[route], index => gameboard[index] == enemy);
        if(mySpaces > 0) {
            indexScores.push({
                index : firstAvailableSpaceOnRoute,
                score : mySpaces == 2 ? 0 : 1
            });
        } else if (enemySpaces > 0){
            indexScores.push({
                index : firstAvailableSpaceOnRoute,
                score : enemySpaces == 2 ? 3 : 4
            });
        } else {
            indexScores.push({
                index : firstAvailableSpaceOnRoute,
                score : 2
            });
        }
    }

    gameboard[indexScores.sort((a, b) => a.score - b.score)[0].index] = symbol;
}