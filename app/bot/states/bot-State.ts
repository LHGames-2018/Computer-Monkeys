import { Bot } from '../bot';
import { Map } from '../../helper/map';
import { Player } from '../../helper/interfaces';

export interface BotState {
    execute(map: Map, playerInfo: Player): string;
    isOver(): boolean;
    getNextState(options: {}): BotState;
}
