import { BotState } from './bot-State';
import { Map } from '../../helper/map';
import { Player, UpgradeType } from '../../helper/interfaces';
import { AIHelper } from '../../helper/aiHelper';
import { ThiefState } from './thiefState';

export class UpgradeState implements BotState {
    private hasUpgrade = false;

    public execute(map: Map, playerInfo: Player): string {
        this.hasUpgrade = true;
        return AIHelper.createUpgradeAction(UpgradeType.CarryingCapacity);
    }

    public isOver(): boolean {
        return this.hasUpgrade;
    }

    public getNextState(options: {}): BotState {
        return new ThiefState();
    }
}