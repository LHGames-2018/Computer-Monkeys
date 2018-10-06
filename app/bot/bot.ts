import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { BotHelper } from './botHelper';

enum botStates {
    goMining,
    goHome,
    goSteal,
    goHomeFromSteal
}

export class Bot {
    protected playerInfo: Player;

    private currentPath = new Array<Array<number>>();
    private currentResourcePoint = new Array<number>() 
    private state: botStates = botStates.goSteal;
    private moving: boolean = false;
    private moved: boolean = false;

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
        /*
        if (this.state === botStates.goSteal) {
            const point: Point = new Point(this.playerInfo.Position.x + 1, this.playerInfo.Position.y);
            const right: Point = new Point (1, 0);
            switch (map.getTileAt(point)) {
                case TileContent.Wall:
                    return AIHelper.createAttackAction(right);
                case TileContent.Resource:
                    return AIHelper.createCollectAction(right);
                case TileContent.Empty:
                    return AIHelper.createMoveAction(right);
                case TileContent.Player:
                    return AIHelper.createAttackAction(right);
                case TileContent.House:
                    this.state = botStates.goHomeFromSteal;
                    return AIHelper.createStealAction(right);
                default:
                    return AIHelper.createEmptyAction();
            }
        } else if (this.state === botStates.goHomeFromSteal) {
            const point: Point = new Point(this.playerInfo.Position.x - 1, this.playerInfo.Position.y);
            const left: Point = new Point (-1, 0);
            switch (map.getTileAt(point)) {
                case TileContent.Wall:
                    return AIHelper.createAttackAction(left);
                case TileContent.Empty:
                    return AIHelper.createMoveAction(left);
                case TileContent.Resource:
                    return AIHelper.createCollectAction(left);
                case TileContent.Player:
                    return AIHelper.createAttackAction(left);
                case TileContent.House:
                    this.state = botStates.goSteal;
                    return AIHelper.createMoveAction(left);
                default:
                    return AIHelper.createEmptyAction(); 
            }
        }*//* else if (this.currentPath.length === 0 && !this.moving) {
            // find assets positionf
            const maperonni: Map<TileContent, Point[]> = BotHelper.getAssets(map, this.playerInfo);

            let content: TileContent;
            if (this.state === botStates.goMining) {
                content = TileContent.Resource;
            } 
            else {
                content = TileContent.House;
            }

            maperonni.get(content).forEach(point => {
                const path = [[1,1], [1,2], [2,2]];
                if (path.length < this.currentPath.length) {
                    this.currentPath = path;
                }
            });

            if (this.state === botStates.goMining) {
                this.currentResourcePoint = this.currentPath.pop();
            } 
            
            this.moving = true;

        }

        if (this.currentPath.length !== 0) {
            const currentPosition: number[] = this.currentPath.shift();
            return AIHelper.createMoveAction( BotHelper.nextMove(currentPosition, this.currentPath[0]));
        } else {
            if (this.state === botStates.goMining) {
                this.state = botStates.goHome;
                return AIHelper.createCollectAction(BotHelper.nextMove([this.playerInfo.Position.x, this.playerInfo.Position.y], this.currentResourcePoint));
            } else if (this.state === botStates.goHome) {
                this.state = botStates.goMining;
            } 
            this.moving = false;
        }*/
        if(!this.moved) {
            this.moved =true;
            return AIHelper.createMoveAction(new Point(0,1));
        }
        return AIHelper.createEmptyAction();
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
