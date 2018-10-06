import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { PathFinder } from './pathfinding';
import { BotHelper } from './botHelper';
import { BotState } from './states/bot-State';
import { GoToRessource } from './states/goToRessource';

enum botStates {
    goMining,
    mining,
    goHome
}

export class Bot {
    protected playerInfo: Player;

    private currentPath: Point[] = [];
    private currentResourcePoint: Point;
    private state: botStates = botStates.goHome;
    private moving: boolean = false;

    private currentState: BotState = new GoToRessource();

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
