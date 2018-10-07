import { BotState } from './bot-State';
import { Player } from '../../helper/interfaces';
import { Map as GameMap } from '../../helper/map';
import { Point } from '../../helper/point';
import { PathFinder } from '../pathfinding';
import { BotHelper } from '../botHelper';
import { AIHelper } from '../../helper/aiHelper';
import { MineRessource } from './mineRessource';

export class GoToRessource implements BotState {

    private _isOver = false;
    private _path: Point[];
    private _ressourcePosition: Point;

    public execute(map: GameMap, playerInfo: Player): string {
        if (!this._path) {
            this._path = this.findPathToRessource(map, playerInfo);
            this._ressourcePosition = this._path[this._path.length - 1];
            console.log(this._path);
        }

        if (this._path.length === 1) {
            this._isOver = true;
        }

        return AIHelper.createMoveAction(this.getNextMove(playerInfo.Position, this._path.shift()))

    }

    private findPathToRessource(map: GameMap, playerInfo: Player): Point[] {
        const ressources: Point[] = BotHelper.getNearbyRessources(map, playerInfo);
        let bestPath: Point[] = [];

        ressources.forEach((ressource: Point) => {
            const pathfinder: PathFinder = new PathFinder();
            const path = pathfinder.findPath(map, playerInfo.Position, new Point(ressource.x - 1, ressource.y));
            if (path) {
                bestPath = path;
            }
        });

        return bestPath;
    }

    public getNextMove(currentPosition: Point, nextPosition: Point): Point {
        return new Point(nextPosition.x - currentPosition.x, nextPosition.y - currentPosition.y);
    }

    public isOver(): boolean {
        return this._isOver;
    }

    public getNextState(): BotState {
        return new MineRessource(new Point(this._ressourcePosition.x + 1, this._ressourcePosition.y));
    }
}