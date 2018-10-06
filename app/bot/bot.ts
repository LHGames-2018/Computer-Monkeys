import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { PathFinder } from './pathfinding';
import { BotHelper } from './botHelper';
import { BotState } from './states/bot-State';
import { ThiefState } from './states/thiefState';

enum botStates {
    goMining,
    mining,
    goHome,
    goSteal,
    goHomeFromSteal
}

const down: Point = new Point (0, 1);
const up: Point = new Point (0, -1);
const left: Point = new Point (-1, 0);
const right: Point = new Point (1, 0);


export class Bot {
    protected playerInfo: Player;

    private currentPath: Point[] = [];
    private currentResourcePoint: Point;
    private state: botStates = botStates.goHome;
    private moving: boolean = false;
    private moved: boolean = false;
    private oldCarriedResources = 0;
    private collectCounter: number = 0;

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
        if (this.currentState.isOver()) {
            this.currentState = this.currentState.getNextState({});
        }

        return this.currentState.execute(map, this.playerInfo);
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }

    private thiefMode(map: GameMap, visiblePlayers: Player[]): string {
        if (this.state === botStates.goSteal) {
            const point: Point = new Point(this.playerInfo.Position.x, this.playerInfo.Position.y + 1);
            switch (map.getTileAt(point)) {
                case TileContent.Wall:
                    return AIHelper.createAttackAction(down);
                case TileContent.Resource:
                    return AIHelper.createCollectAction(down);
                case TileContent.Empty:
                    return AIHelper.createMoveAction(down);
                case TileContent.Player:
                    return AIHelper.createAttackAction(down);
                case TileContent.House:
                    if (this.collectCounter > 6) {
                        this.collectCounter = 0;
                        this.state = botStates.goHomeFromSteal;
                        return AIHelper.createMoveAction(up);
                    }
                    this.collectCounter++;
                    this.oldCarriedResources = this.playerInfo.CarriedResources;
                    return AIHelper.createStealAction(down);
                default:
                    return AIHelper.createEmptyAction();
            }
        } else if (this.state === botStates.goHomeFromSteal) {
            const point: Point = new Point(this.playerInfo.Position.x, this.playerInfo.Position.y - 1);
            switch (map.getTileAt(point)) {
                case TileContent.Wall:
                    return AIHelper.createAttackAction(up);
                case TileContent.Empty:
                    return AIHelper.createMoveAction(up);
                case TileContent.Resource:
                    return AIHelper.createCollectAction(up);
                case TileContent.Player:
                    return AIHelper.createAttackAction(up);
                case TileContent.House:
                    this.state = botStates.goSteal;
                    return AIHelper.createMoveAction(up);
                default:
                    return AIHelper.createEmptyAction(); 
            }
        
        }
    }
}
