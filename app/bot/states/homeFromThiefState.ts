import { BotState } from './bot-State';
import { Map } from '../../helper/map';
import { Player, TileContent } from '../../helper/interfaces';
import { AIHelper } from '../../helper/aiHelper';
import { Point } from '../../helper/point';
import { UpgradeState } from './upgradeState';

const up: Point = new Point (0, -1);

export class HomeFromThiefState implements BotState {
    private isHome = false;

    public execute(map: Map, playerInfo: Player): string {
        const point: Point = new Point(playerInfo.Position.x, playerInfo.Position.y - 1);
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
                this.isHome = true;
                return AIHelper.createMoveAction(up);
            default:
                return AIHelper.createEmptyAction();
        }
    }

    public isOver(): boolean {
        return this.isHome;
    }

    public getNextState(options: {}): BotState {
        return new UpgradeState();
    }
}
