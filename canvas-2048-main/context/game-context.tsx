import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { isNil, set, throttle } from "lodash";
import { mergeAnimationDuration, tileCountPerDimension } from "@/constants";
import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
  score: 0,
  isOver: false,
  moveTiles: (_: MoveDirection) => {},
  getTiles: () => [] as Tile[],
  startGame: () => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [isOver, setIsOver] = useState(false);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  const isGameOver = () => {
    // Check if there are any empty cells
    const emptyCells = getEmptyCells();
    console.log('emptyCells', emptyCells.length);
    if (emptyCells.length > 0) {
      return false;
    }
  
    // Check for possible merges horizontally and vertically
    for (let y = 0; y < tileCountPerDimension; y++) {
      for (let x = 0; x < tileCountPerDimension; x++) {
        const currentTileId = gameState.board[y][x];
        const currentTile = gameState.tiles[currentTileId];
  
        // Check right neighbor
        if (x < tileCountPerDimension - 1) {
          const rightTileId = gameState.board[y][x + 1];
          const rightTile = gameState.tiles[rightTileId];
          if (currentTile.value === rightTile.value) {
            return false;
          }
        }
  
        // Check bottom neighbor
        if (y < tileCountPerDimension - 1) {
          const bottomTileId = gameState.board[y + 1][x];
          const bottomTile = gameState.tiles[bottomTileId];
          if (currentTile.value === bottomTile.value) {
            return false;
          }
        }
      }
    }
  
    // If we've made it here, there are no possible moves
    return true;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTile = {
        position: emptyCells[cellIndex],
        value: 2,
      };
      dispatch({ type: "create_tile", tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesByIds.map((tileId) => gameState.tiles[tileId]);
  };

  const moveTiles = (type: MoveDirection) => {
    if (isGameOver()) {
      console.log("Game over!");
      setIsOver(true);
      return;
    }

    moveTilesCallback(type);
  }

  const moveTilesCallback = useCallback(
    throttle(
      (type: MoveDirection) => {
        dispatch({ type });
      },
      mergeAnimationDuration * 1.05,
      { trailing: false },
    ),
    [dispatch],
  );

  const startGame = () => {
    dispatch({ type: "start_game" });
    setIsOver(false);
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" });
        appendRandomTile();
      }, mergeAnimationDuration);
    }
  }, [gameState.hasChanged]);

  return (
    <GameContext.Provider
      value={{
        score: gameState.score,
        getTiles,
        moveTiles,
        startGame,
        isOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
