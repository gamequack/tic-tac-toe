class Negamax {

    constructor(evaluateValue, evaluateTerminal) {
        this.evaluateValue = evaluateValue;
        this.evaluateTerminal = evaluateTerminal;
        this.depthMax = -1;
    }

    negamax(node, board, depth, player, opponent, alpha, beta, color) {
        if (depth === this.depthMax || this.evaluateTerminal(board, player, false)) {
            return color * this.evaluateValue(board, player, depth);
        }

        let value = Number.NEGATIVE_INFINITY;
        for (let j = 0; j < board.length; j++) {
            for (let i = 0; i < board[0].length; i++) {
                if (board[j][i] === 0) {
                    board[j][i] = player;
                    value = Math.max(value, -this.negamax(node, board, depth + 1, opponent, player, -beta, -alpha, -color));
                    alpha = Math.max(alpha, value);
                    board[j][i] = 0;
                    if (alpha >= beta) {
                        return alpha;
                    }
                }
            }
        }
        return value;
    }

    getMoves(board, level, player, opponent) {
        let moves = [];
        this.depthMax = level;
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
                if (board[j][i] === 0) {
                    let move = {
                        col: i,
                        row: j,
                        value: 0
                    };
                    if (this.depthMax > 0) {
                        board[j][i] = player;
                        move.value = -this.negamax(move, board, 1, opponent, player, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, -1);
                        board[j][i] = 0;
                    }
                    moves.push(move);
                }
            }
        }
        return moves;
    }

}
