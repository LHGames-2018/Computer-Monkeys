import { BotState } from './bot-State';
import { Map } from '../../helper/map';
import { Player, TileContent } from '../../helper/interfaces';
import { AIHelper } from '../../helper/aiHelper';
import { Point } from '../../helper/point';
import { HomeFromThiefState } from './homeFromThiefState';

const down: Point = new Point (0, 1);

export class ThiefState implements BotState {
    private counter = 0;

    public execute(map: Map, playerInfo: Player): string {
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
                this.counter++;
                return AIHelper.createStealAction(down);
            default:
                return AIHelper.createEmptyAction();
        }
    }

    public isOver(): boolean {
        if (this.counter === 5) {
            return true;
        }
        return false;
    }

    public getNextState(options: {}): BotState {
        return new HomeFromThiefState();
    }
}
