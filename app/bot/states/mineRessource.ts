import { BotState } from './bot-State';
import { Player } from '../../helper/interfaces';
import { Map as GameMap } from '../../helper/map';
import { Point } from '../../helper/point';
import { PathFinder } from '../pathfinding';
import { BotHelper } from '../botHelper';
import { AIHelper } from '../../helper/aiHelper';

export class MineRessource implements BotState {

    private _isOver: boolean = false;
    private _path: Point[];

    public execute(map: GameMap, playerInfo: Player): string {
        return undefined;
        // if (!this._path) {
        //     this._path = this.findPathToRessource(map, playerInfo);
        // }
        // return AIHelper.createMoveAction(this.getNextMove(playerInfo.Position, this._path.shift()))

    }

    public isOver(): boolean {
        return this._isOver;
    }

    public getNextState(): BotState {
        return undefined;
        /* next state*/
    }
}