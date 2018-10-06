import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { Astar } from './Astar';
import { BotHelper } from './botHelper';

export class Bot {
    protected playerInfo: Player;

    /**
     * Gets called before ExecuteTurn. This is where you get your bot's state.
     * @param  {Player} playerInfo Your bot's current state.
     * @returns void
     */
    public beforeTurn(playerInfo: Player): void {
        this.playerInfo = playerInfo;
    }
    /**
     * This is where you decide what action to take.
     * @param  {Map} map The gamemap.
     * @param  {Player[]} visiblePlayers The list of visible players.
     * @returns string The action to take(instanciate them with AIHelper)
     */
    public executeTurn(map: GameMap, visiblePlayers: Player[]): string {
        // find assets position
        // const maperonni: Map<TileContent, Point> = BotHelper.getAssets(map, this.playerInfo);
        // Determine what action you want to take.
        console.log(this.playerInfo.Position);
        console.log(Astar.getPath(map, new Point(this.playerInfo.Position.x, this.playerInfo.Position.y), new Point(26, 60)));

        return AIHelper.createMoveAction(new Point(-1, 0));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
