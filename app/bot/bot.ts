import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { Astar } from './Astar';
import { BotHelper } from './botHelper';

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

    private currentPath = new Array<Array<number>>();
    private currentResourcePoint = new Array<number>();
    private state: botStates = botStates.goHome;
    private moving: boolean = false;
    private moved: boolean = false;
    private oldCarriedResources = 0;
    private collectCounter: number = 0;

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
        console.log(this.state);
        console.log(this.moving);

        try {
            // find assets positionf
            if (this.currentPath.length === 0 && this.state !== botStates.mining && !this.moving) {
                const maperonni: Map<TileContent, Point[]> = BotHelper.getAssets(map, this.playerInfo);
                let content: TileContent;
                let path: number[][];
                if (this.state === botStates.goMining) {
                    content = TileContent.Resource;
                    maperonni.get(content).forEach(point => {
                        try {
                            // console.log(Astar.getPath(map, this.playerInfo.Position, point);
                            path = Astar.getPath(map, this.playerInfo.Position, point);
                            if (!path) {
                                return;
                            }
                            console.log("------------>");
                            console.log(path);
                        } catch (error) {
                            console.error(error);
                        }
                        // path = [[1, 1], [1, 2], [2, 2]];

                        if (path.length < this.currentPath.length || this.currentPath.length === 0) {
                            this.currentPath = path;
                        }
                    });
                } else {
                    content = TileContent.House;
                    path = Astar.getPath(map, this.playerInfo.Position, this.playerInfo.HouseLocation);
                    path.push([this.playerInfo.HouseLocation.x, this.playerInfo.HouseLocation.y]);
                    if (path.length < this.currentPath.length || this.currentPath.length === 0) {
                        this.currentPath = path;
                    }
                }
                console.log("path: ");
                console.log(this.currentPath);

                if (this.state === botStates.goMining) {
                    this.currentResourcePoint = this.currentPath.pop();
                }

                this.moving = true;

            }

            if (this.currentPath.length !== 0) {
                if (this.currentPath.length === 1) {
                    const currentPosition: number[] = this.currentPath.shift();
                    return AIHelper.createEmptyAction();
                } else {
                    const currentPosition: number[] = this.currentPath.shift();
                    console.log(this.currentPath);
                    return AIHelper.createMoveAction(BotHelper.nextMove(currentPosition, this.currentPath[0]));
                }

            } else {
                if (this.state === botStates.goMining) {
                    this.state = botStates.mining;
                    this.moving = false;                    // tslint:disable-next-line:max-line-length
                    return AIHelper.createCollectAction(BotHelper.nextMove([this.playerInfo.Position.x, this.playerInfo.Position.y], this.currentResourcePoint));
                } else if (this.state === botStates.mining) {
                    // tslint:disable-next-line:max-line-length
                    const vector = BotHelper.nextMove([this.playerInfo.Position.x, this.playerInfo.Position.y], this.currentResourcePoint);
                    // tslint:disable-next-line:max-line-length
                    if (map.getTileAt(new Point(this.playerInfo.Position.x + vector.x, this.playerInfo.Position.y + vector.y)) !== TileContent.Resource) {
                        console.log("penis");
                        this.state = botStates.goHome;
                    }
                    // tslint:disable-next-line:max-line-length
                    return AIHelper.createCollectAction(vector);

                } else if (this.state === botStates.goHome) {
                   // this.state = botStates.goMining;
                   this.state = botStates.goSteal
                } else if (this.state === botStates.goSteal || this.state === botStates.goHomeFromSteal) {
                    return this.thiefMode(map, visiblePlayers);
                }
               // this.moving = false;
            }

        } catch (error) {
            console.error(error);
        }

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
