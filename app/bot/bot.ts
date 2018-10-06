import { Player } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { BotState } from './states/bot-State';
import { ThiefState } from './states/thiefState';

export class Bot {
    protected playerInfo: Player;
    private currentState: BotState = new ThiefState();

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
        try {
            if (this.currentState.isOver()) {
                this.currentState = this.currentState.getNextState({});
            }
            return this.currentState.execute(map, this.playerInfo);

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
