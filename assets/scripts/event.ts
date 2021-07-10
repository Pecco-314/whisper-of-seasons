import { Player } from "./player";
export type Item = "seed" | "sapling";

export class Rectangle {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
    constructor(minx: number, miny: number, maxx: number, maxy: number) {
        this.minx = minx;
        this.miny = miny;
        this.maxx = maxx;
        this.maxy = maxy;
    }
    contains(x: number, y: number) {
        return this.minx <= x && this.miny <= y && this.maxx >= x && this.maxy >= y;
    }
}

export class Event {
    name: string;
    rectangle: Rectangle;
    requiredItems: Item[];
    action: (player: Player) => void;
    constructor(name: string, rectangle: Rectangle, requiredItems: Item[], action: (player: Player) => void) {
        this.name = name;
        this.rectangle = rectangle;
        this.requiredItems = requiredItems;
        this.action = (player: Player) => {
            action(player);
            requiredItems.forEach(item => player.loseItem(item));
        };
    }
}

export const events: Event[] = [
    new Event('种植', new Rectangle(-339, 180, -279, 232), ['seed'], (player) => {
        player.controller.node.getChildByName('TiledMap')!.getChildByName('苗')!.active = true;
        player.controller.hasPlanted = true;
    })
];