import { BotState } from './bot-State';
import { Map } from '../../helper/map';
import { Player, TileContent } from '../../helper/interfaces';
import { AIHelper } from '../../helper/aiHelper';
import { Point } from '../../helper/point';
import { HomeFromThiefState } from './homeFromoThiefState';

const down: Point = new Point (0, 1);

export class ThiefState implements BotState {
    private carriedResources = 0;
    private capacity = 10000;

    public execute(map: Map, playerInfo: Player): string {
        this.capacity = playerInfo.CarryingCapacity;
        const point: Point = new Point(playerInfo.Position.x, playerInfo.Position.y + 1);
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
                this.carriedResources = playerInfo.CarriedResources;
                return AIHelper.createStealAction(down);
            default:
                return AIHelper.createEmptyAction();
        }
    }

    public isOver(): boolean {
        return this.carriedResources >= this.capacity;
    }

    public getNextState(options: {}): BotState {
        return new HomeFromThiefState();
    }
}
