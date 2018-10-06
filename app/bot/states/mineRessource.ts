import { BotState } from './bot-State';
import { Player, TileContent } from '../../helper/interfaces';
import { Map as GameMap } from '../../helper/map';
import { Point } from '../../helper/point';
import { AIHelper } from '../../helper/aiHelper';
import { GoToRessource } from './goToRessource';

export class MineRessource implements BotState {

    private _ressourcePosition: Point;
    private _isOver: boolean = false;

    public constructor(ressourcePosition: Point) {
        this._ressourcePosition = ressourcePosition;
    }

    public execute(map: GameMap, playerInfo: Player): string {
        if (map.getTileAt(this._ressourcePosition) === TileContent.Empty) {
            this._isOver = true;
        }
        return AIHelper.createCollectAction(this.getNextMove(playerInfo.Position, this._ressourcePosition))
    }

    public getNextMove(currentPosition: Point, nextPosition: Point): Point {
        return new Point(nextPosition.x - currentPosition.x, nextPosition.y - currentPosition.y);
    }

    public isOver(): boolean {

        return this._isOver;
    }

    public getNextState(): BotState {
        return new GoToRessource();
    }
}