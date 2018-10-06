import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { PathFinder } from './pathfinding';
import { BotHelper } from './botHelper';

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
        const pathfinder: PathFinder = new PathFinder();
        pathfinder.findPath(map, this.playerInfo.Position, new Point(28, 40));

        try {
            // find assets positionf
            if (this.currentPath.length === 0 && this.state !== botStates.mining && !this.moving) {
                const assetsPositions: Map<TileContent, Point[]> = BotHelper.getAssets(map, this.playerInfo);

                let path: Point[];
                if (this.state === botStates.goMining) {
                    assetsPositions.get(TileContent.Resource).forEach((point: Point) => {
                        path = pathfinder.findPath(map, this.playerInfo.Position, point);

                        if (path.length < this.currentPath.length || path.length !== 0) {
                            this.currentPath = path;
                        }
                    });

                } else {
                    path = pathfinder.findPath(map, this.playerInfo.Position, new Point(this.playerInfo.HouseLocation.x - 1, this.playerInfo.HouseLocation.y));
                    if (path.length < this.currentPath.length || path.length !== 0) {
                        this.currentPath = path;
                    }
                }

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
                    this.state = botStates.goMining;
                }
                this.moving = false;
            }

            return AIHelper.createEmptyAction();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
