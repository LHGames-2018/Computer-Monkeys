import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map as GameMap } from '../helper/map';
import { Point } from '../helper/point';
import { BotHelper } from './botHelper';

enum botStates {
    goMining,
    goHome
}

export class Bot {
    protected playerInfo: Player;

    private currentPath = new Array<Array<number>>();
    private currentResourcePoint = new Array<number>() 
    private state: botStates = botStates.goMining;
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
        
        
        // find assets positionf
        if (this.currentPath.length === 0 && !this.moving) {
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
        }

        return AIHelper.createEmptyAction();        
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
