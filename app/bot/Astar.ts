import { Point } from '../helper/point';
import { Map } from '../helper/map';
import { TileContent } from '../helper/interfaces';



const aStar: any = require('a-star');

export class Astar {

    public constructor(private map: Map, private startPoint: Point, private endPoint: Point) {

    }
    private diagonalDistance(a: number[], b: number[]): number {
        return Point.distance(new Point(a[0], a[1]), new Point(b[0], b[1]));
    }
    private distance(a: number[], b: number[]): number {
        return 1;
    }

    private getNeighbors(position: number[]): number[][] {
        const x = position[0];
        const y = position[1];
        const neighbors: number[][] = [
            [x - 1, y + 0],
            [x + 0, y - 1],
            [x + 0, y + 1],
            [x + 1, y + 0],
        ];
        neighbors.filter((pos) => {
            return (this.map.getTileAt(new Point(pos[0], pos[1])) === TileContent.Empty);
        });
        return neighbors;
    }

    private isEnd(position: number[]): boolean {
        return position[0] === this.endPoint.x && position[1] === this.endPoint.y;
    }
    public getPath(): any {
        return aStar({
            start: [this.startPoint.x, this.startPoint.y],
            isEnd: this.isEnd,
            neighbor: this.getNeighbors,
            distance: this.distance,
            heuristic: (xy: number[]) => {
                return this.diagonalDistance(xy, this.endPoint.getAstarPoint());
            }
        });

    }
}
