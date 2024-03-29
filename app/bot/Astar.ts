import { Point } from '../helper/point';
import { Map } from '../helper/map';
import { TileContent } from '../helper/interfaces';

const aStar: any = require('a-star');

export class Astar {

    public static getPath(gameMap: Map, startPoint: Point, endPoint: Point): any {
        const result: any = aStar({
            start: [startPoint.x, startPoint.y],
            isEnd: (currentPoint: any) => {
                return (currentPoint[0] === endPoint.x && currentPoint[1] === endPoint.y ||
                    currentPoint[0] === endPoint.x - 1 && currentPoint[1] === endPoint.y ||
                    currentPoint[0] === endPoint.x && currentPoint[1] === endPoint.y - 1 ||
                    currentPoint[0] === endPoint.x + 1 && currentPoint[1] === endPoint.y ||
                    currentPoint[0] === endPoint.x && currentPoint[1] === endPoint.y + 1);
            },
            neighbor: (xy: any) => {
                const x = xy[0];
                const y = xy[1];
                let neighbors: number[][] = [
                    [x - 1, y + 0],
                    [x + 0, y - 1],
                    [x + 0, y + 1],
                    [x + 1, y + 0],
                ];
                neighbors = neighbors.filter((pos) => {
                    return (gameMap.getTileAt(new Point(pos[0], pos[1])) === TileContent.Empty);
                });
                return neighbors;
            },
            distance: () => { return 1 },
            heuristic: (xy: any) => {
                return Astar.diagonalDistance(xy, [endPoint.x, endPoint.y]);
            }
        });

        console.log(result.status + "   kjadkajfajhflahflh");
        if (result.status === 'success') {
            result.path.push([endPoint.x, endPoint.y]);

            return result.path;
        } else {
            return undefined;
        }
    }

    public static diagonalDistance(a: number[], b: number[]): number {
        return Point.distance(new Point(a[0], a[1]), new Point(b[0], b[1]));
    }

}
