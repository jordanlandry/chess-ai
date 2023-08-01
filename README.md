# Chess

A chess game implemented in React and TypeScript

## How it works

### Minimax

The minimax algorithm is a decision-making algorithm commonly used in game theory and artificial intelligence. It is used to determine the best move for a player in a two-player, zero-sum game (i.e., a game in which one player's gain is the other player's loss).

The algorithm works by considering all possible moves and countermoves, and "minimizing" the worst possible outcome (i.e., the maximum loss). This is done by assigning a value to each potential move and choosing the move with the highest value.

In the context of a chess game, the minimax algorithm would consider all possible moves and countermoves, assign a value to each potential position, and choose the move that leads to the highest value for the player and the lowest value for the opponent.

### Alpha-beta pruning

Alpha-beta pruning is an optimization technique used to improve the efficiency of the minimax algorithm in game-playing systems. It works by reducing the number of nodes that the minimax algorithm needs to search through, by eliminating "suboptimal" paths that cannot possibly influence the final decision.

Alpha-beta pruning works by keeping track of two values, called alpha and beta, which represent the minimum score that the maximizing player (e.g., the player using the minimax algorithm) is assured of and the maximum score that the minimizing player (e.g., the opponent) is assured of, respectively.

During the search, if the value of a node exceeds beta, it is pruned (i.e., it is not considered further) because the minimizing player will never choose a path that leads to a score worse than beta. Similarly, if the value of a node is less than alpha, it is also pruned because the maximizing player will never choose a path that leads to a score worse than alpha.

By pruning these suboptimal paths, alpha-beta pruning significantly reduces the number of nodes that need to be searched, improving the efficiency of the minimax algorithm.

### Move ordering

Move ordering is an optimization technique that can be used in conjunction with alpha-beta pruning to further improve its efficiency. The idea behind move ordering is to order the moves from best to worst before they are searched so that the best moves are searched first and are more likely to be pruned.

There are several ways to estimate the "goodness" of a move, such as using a heuristic function that assigns a score to each move based on its potential to lead to a winning position. The moves are then ordered from highest to lowest score, and the search begins with the best moves.

By starting with the best moves first, there is a higher probability that they will be pruned, as they are more likely to exceed alpha or beta. This means that fewer nodes need to be searched, improving the efficiency of the alpha-beta pruning algorithm.

However, it is important to note that the estimates of move goodness are not always accurate, and it may be necessary to search some of the lower-ranked moves as well. This is why the search must continue until the desired depth is reached or the game is over.


### Transposition table

In chess, there are many ways to get to the same position. This is called a transposition. For example, the position after 1. e4 e5 2. Nf3 Nc6 is the same as the position after 1. Nf3 Nc6 2. e4 e5. The transposition table is a data structure that stores the results of previous searches so that they can be reused in future searches meaning you cut out that unnecessary calculation.

## Ranking

After playing many games against Stockfish, this AI given 10,000ms (10s) to think per move, performs at a rating of 2000 ELO. This is comparable to the strength of a very strong club player, but still not quite a master-level player. 

## Can you beat it?

You can try out the chess game at the following link:
https://jordanlandry.github.io/chess-ai/