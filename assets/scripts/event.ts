import { Map } from "./map";
import { OutdoorController } from "./outdoorController";
import { Player } from "./player";
export type Item = "种子" | "树苗" | "麦子";

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
    filter: (player: Player) => boolean;
    action: (player: Player) => void;
    constructor(name: string, rectangle: Rectangle, requiredItems: Item[], action: (player: Player) => void, filter?: (player: Player) => boolean) {
        this.name = name;
        this.rectangle = rectangle;
        this.requiredItems = requiredItems;
        this.action = (player: Player) => {
            action(player);
            requiredItems.forEach(item => player.loseItem(item));
        };
        if (filter !== undefined) {
            this.filter = filter!;
        } else {
            this.filter = ((player) => true);
        }
    }
}

export const events: Event[] = [
    new Event('种植', new Rectangle(-339, 180, -279, 232), ['种子'], (player) => {
        player.controller.node.getChildByName('TiledMap')!.getChildByName('苗')!.active = true;
        player.controller.hasPlanted = true;
    }),
    new Event('收获', new Rectangle(-339, 180, -279, 232), [], (player) => {
        player.addItem("麦子");
        player.controller.node.getChildByName('TiledMap')!.getChildByName('稻草')!.active = false;
    }, (player) =>
        player.controller.node.getChildByName('TiledMap')!.getChildByName('稻草')!.active
    ),
    new Event('喂养', new Rectangle(-339, 55, -321, 74), ['麦子'], (player) => {
        player.controller.node.getChildByName('TiledMap')!.getChildByName('乌鸦叼纸')!.active = false;
        player.controller.node.getChildByName('TiledMap')!.getChildByName('乌鸦')!.active = true; (player.controller as OutdoorController).playAnimation('密码2', 'password2');
        (player.controller.node.getChildByName('TiledMap')!.getComponent('Map') as Map).crow = "乌鸦"; // TODO 添加乌鸦飞走动画
    }, (player) =>
        (player.controller.node.getChildByName('TiledMap')!.getComponent('Map') as Map).crow === "乌鸦叼纸"
    )
];