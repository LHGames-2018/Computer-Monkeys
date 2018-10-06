import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';

export class BotHelper {

    public static getAssets(map: GameMap, playerInfo: Player): Map<TileContent, Point[]> {
        const assetToPosition: Map<TileContent, Point[]> = new Map();

        for (let i: number = -10; i <= 10; i++) {
            for (let j: number = -10; j <= 10; j++) {
                const point: Point = new Point(playerInfo.Position.x + i, playerInfo.Position.y + j);

                switch (map.getTileAt(point)) {
                    case TileContent.Resource:
                        if (!assetToPosition.get(TileContent.Resource)) {
                            assetToPosition.set(TileContent.Resource, []);
                        }

                        assetToPosition.get(TileContent.Resource).push(point);
                        break;
                    case TileContent.Player:
                        if (!assetToPosition.get(TileContent.Player)) {
                            assetToPosition.set(TileContent.Player, []);
                        }
                        if (!(i === 0 && j === 0)) {
                            assetToPosition.get(TileContent.Player).push(point);
                        }
                        break;
                }
            }
        }
        return assetToPosition;
    }

    public static nextMove(currentPosition: number[], nextPosition: number[]): Point {
        return new Point(nextPosition[0] - currentPosition[0], nextPosition[1] - currentPosition[1]);
    }

}
