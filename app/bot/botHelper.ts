import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';

export class BotHelper {

    public static getAssets(map: GameMap, playerInfo: Player) {
        const assetToPosition: Map<TileContent, Point> = new Map();

        for (let i: number = -10; i <= 10; i++) {
            for (let j: number = -10; j <= 10; j++) {
                const point: Point = new Point(playerInfo.Position.x + i, playerInfo.Position.y + j);

                switch (map.getTileAt(point)) {
                    case TileContent.Resource:
                        assetToPosition.set(TileContent.Resource, point);
                        break;
                    case TileContent.Player:
                        if (!(i === 0 && j === 0)) {
                            assetToPosition.set(TileContent.Player, point);
                        }
                        break;
                }
            }
        }
    }

}
