import { AIHelper } from '../helper/aiHelper';
import { Player } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { Astar } from './Astar';


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
    public executeTurn(map: Map, visiblePlayers: Player[]): string {
        // Determine what action you want to take.
        console.log(this.playerInfo.Position);

        console.log(new Point(this.playerInfo.Position.x + 4, this.playerInfo.Position.y + 2));

        const astar = new Astar(map,
            this.playerInfo.Position,
            new Point(this.playerInfo.Position.x + 4, this.playerInfo.Position.y + 2));
        try {
            const path = astar.getPath();
        } catch (error) {
            console.log(error);
        }
        return AIHelper.createMoveAction(new Point(-1, 0));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
