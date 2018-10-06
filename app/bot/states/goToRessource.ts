import { BotState } from './bot-State';
import { Player } from '../../helper/interfaces';
import { Map as GameMap } from '../../helper/map';
import { Point } from '../../helper/point';
import { PathFinder } from '../pathfinding';
import { BotHelper } from '../botHelper';
import { AIHelper } from '../../helper/aiHelper';

export class GoToRessource implements BotState {

    private _isOver: boolean = false;
    private _path: Point[];

    public execute(map: GameMap, playerInfo: Player): string {
        if (!this._path) {
            this._path = this.findPathToRessource(map, playerInfo);
        }
        return AIHelper.createMoveAction(this.getNextMove(playerInfo.Position, this._path.shift()))

    }

    private findPathToRessource(map: GameMap, playerInfo: Player): Point[] {
        const pathfinder: PathFinder = new PathFinder();
        const ressources: Point[] = BotHelper.getNearbyRessources(map, playerInfo);
        let bestPath: Point[] = [];

        ressources.forEach((ressource: Point) => {
            const path = pathfinder.findPath(map, playerInfo.Position, ressource);

            if (path.length < bestPath.length && path.length !== 0) {
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
        return undefined;
        /* next state*/
    }
}