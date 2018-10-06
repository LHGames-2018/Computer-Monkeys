import { Map } from "../helper/map";
import { Point } from "../helper/point";
import { TileContent } from "../helper/interfaces";

const PF = require('pathfinding');

export class PathFinder {

    private initializeMatrix(gameMap: Map, playerPos: Point): number[][] {
        const matrix: number[][] = [];
        for (let i = 0; i <= 20; i++) {
            matrix[i] = [];
            for (let j = 0; j <= 20; j++) {
                if (gameMap.getTileAt(new Point(playerPos.x + j - 10, playerPos.y + i - 10)) === TileContent.Empty) {
                    matrix[i].push(0);
                } else {
                    matrix[i].push(1);
                }
            }
        }

        return matrix;
    }

    public findPath(gameMap: Map, playerPos: Point, destination: Point): any {
        const matrix = this.initializeMatrix(gameMap, playerPos);
        const grid = new PF.Grid(matrix);
        const finder = new PF.AStarFinder({ allowDiagonal: false });

        const localDestinationX = (destination.x - playerPos.x) + 10;
        const localDestinationY = (destination.y - playerPos.y) + 10;

        const path: any = finder.findPath(10, 10, localDestinationX, localDestinationY, grid);
        const globalPath: Point[] = [];
        path.forEach((pair: number[]) => {
            globalPath.push(this.localToGlobal(pair, playerPos));
        });

        return globalPath;
    }

    private localToGlobal(localPoint: number[], playerPos: Point): Point {
        return new Point(
            localPoint[0] - 10 + playerPos.x,
            localPoint[1] - 10 + playerPos.y
        );
    }

}
