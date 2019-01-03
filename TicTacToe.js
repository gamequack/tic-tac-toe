class TicTacToe {

    constructor() {
        this.currentPlayer = 0;
		let humanPlayer = -1;
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

		this.evaluateValue = this.evaluateWinThreeInLine;
		this.evaluateTerminal = this.gameOver;

        this.players = [];
        this.players[0] = new Player(1);
        this.players[1] = new Player(2);

        this.players.forEach(function (player) {
            if (player.id !== humanPlayer) {
                player.ai = new Negamax(this.evaluate.bind(this), this.evaluateTerminal.bind(this));
                player.ai.upturn = 0;
            }
        }, this);
    }

    getBoard() {
        return this.board;
    }

    getMove() {
        let ai = this.players[this.currentPlayer].ai;
        let moves = ai.getMoves(this.board, ai.skill, this.player, this.opponent);
		for (let i = moves.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[moves[i], moves[j]] = [moves[j], moves[i]];
		}
        moves.sort(function (a, b) {
            if (a.value > b.value)
                return -1;
            if (a.value < b.value)
                return 1;
            return 0;
        });
        let move = moves[0];
        return move;
    }

    gameOver(board = this.board, player = this.player, getmoves = true) {
        this.gameoverMoves = [];
        if (this.evaluateValue(board, player, 0, getmoves) !== 0) {
            return this.gameoverMoves;
        }
        if (!this.availableMoves()) {
            return [];
        }
        return null;
    }

    availableMoves() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    evaluate(board, player, depth, getmoves = false) {
        let playerScore = this.evaluateValue(board, player, depth, getmoves);
        if (playerScore === 0) {
            return 0;
        }
        return (playerScore === this.player) ? 10 - depth : depth - 10;
    }

    evaluateWinThreeInLine(board, player, depth, getmoves = false) {
        for (let row = 0; row < 3; row++) {
            if (board[row][0] !== 0 && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                if (getmoves) {
                    this.gameoverMoves.push({col: 0, row: row});
                    this.gameoverMoves.push({col: 1, row: row});
                    this.gameoverMoves.push({col: 2, row: row});
                }
                return board[row][0];
            }
        }

        for (let col = 0; col < 3; col++) {
            if (board[0][col] !== 0 && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                if (getmoves) {
                    this.gameoverMoves.push({col: col, row: 0});
                    this.gameoverMoves.push({col: col, row: 1});
                    this.gameoverMoves.push({col: col, row: 2});
                }
                return board[0][col];
            }
        }

        if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (getmoves) {
                this.gameoverMoves.push({col: 0, row: 0});
                this.gameoverMoves.push({col: 1, row: 1});
                this.gameoverMoves.push({col: 2, row: 2});
            }
            return board[0][0];
        }

        if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (getmoves) {
                this.gameoverMoves.push({col: 0, row: 2});
                this.gameoverMoves.push({col: 1, row: 1});
                this.gameoverMoves.push({col: 2, row: 0});
            }
            return board[0][2];
        }

        return 0;
    }

    get player() {
        return this.players[this.currentPlayer].id;
    }

    get opponent() {
        return (this.player === 1) ? 2 : 1;
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }

    test() {
        if (this.humanPlayer <= 0) {
            return;
        }
		let stats = [];
        for (let j = 0; j < 9; j++) {
            let stat = {
                games: 0,
				"p1-depth": j+1,
                "p1-wins": 0,
				"p2-depth": j,
                "p2-wins": 0,
				upturn: 0
            };
            this.players[0].ai.skill = stat["p1-depth"];
            this.players[1].ai.skill = stat["p2-depth"];
            for (let i = 0; i < 100; i++) {
                let isGameover = null;
                this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
				this.currentPlayer = Math.round(Math.random());
                while (isGameover === null) {
                    let move = this.getMove();
                    this.board[move.row][move.col] = this.player;
                    //console.log(move)
                    isGameover = this.gameOver();
                    if (isGameover === null) {
                        this.nextPlayer();
                    }
                }
                stat.games++;
                if (isGameover.length === 0) {
                } else {
                    if (this.currentPlayer === 0) {
                        stat["p1-wins"]++;
                    } else {
                        stat["p2-wins"]++;
                    }
                }
            }
			if (stat["p2-wins"] > 0) {
				stat["upturn"] = Math.round((stat["p1-wins"] - stat["p2-wins"]) / stat["p1-wins"] * 100 * 100) / 100;
			} else if (stat["p1-wins"] > 0) {
				stat["upturn"] = 0;
			} else {
				stat["upturn"] = 0;
			}
			stats.push(stat);
			let s = JSON.stringify(stat, null, 2);
            console.log(s);
        }
		let total = 0;
		stats.forEach(function (o) {
			total += o.upturn;
		});
		stats.forEach(function (o) {
			o.upturn = Math.round(o.upturn * 100/total);
		});
		let s = JSON.stringify(stats, null, 2);
		document.getElementById("tic-tac-toe").append(s);
    }
}

(function () {
	var tictactoe = new TicTacToe();
	tictactoe.test();
})();
