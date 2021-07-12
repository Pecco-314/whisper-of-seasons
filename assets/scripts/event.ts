import { Animation, Label } from "cc";
import { Map } from "./map";
import { OutdoorController } from "./outdoorController";
import { Player } from "./player";
export type Item = "种子" | "树苗" | "麦子" | "苹果";

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

function onPlant(player: Player)  {
    player.getTiledMap().getChildByName('苗')!.active = true;
    player.controller.plantedSeasonID = player.controller.getSeasonID();
}

function onHarvet(player: Player) {
    player.addItem("麦子");
    player.getTiledMap().getChildByName('稻草')!.active = false;
}

function onFeed(player: Player) {
    player.controller.seasonChangable = false;
    player.getTiledMap().getChildByName('乌鸦叼纸')!.active = false;
    player.getTiledMap().getChildByName('乌鸦')!.active = true; 
    (player.controller as OutdoorController).playAnimation('密码2', 'password2');
    (player.getTiledMap().getComponent(Map) as Map).crow = "";
}

function onShake(player: Player) {
    player.getTiledMap().getChildByName('苹果')!.active = false;
    player.getTiledMap().getChildByName('掉地上的苹果')!.active = true;
    (player.getTiledMap().getComponent(Map) as Map).apple = "";
}

function onPickApple(player: Player) {
    player.getTiledMap().getChildByName('掉地上的苹果')!.active = false;
    player.addItem("苹果");
}

function onTalk(player: Player) {
    let talkBox = player.controller.node.getChildByName('对话框')!;
    talkBox.active = true;
    if (player.items.indexOf("苹果") < 0 && player.controller.talkState === 0) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "饿了，想吃苹果了";
    } else if (player.controller.talkState === 0) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "给我的吗？谢谢你";
        player.controller.talkState = 1;
        player.loseItem('苹果');
    } else if (player.controller.talkState === 1) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "这是给你的谢礼";
        player.controller.talkState = -1;
    }
}

export const events: Event[] = [
    new Event('种植', new Rectangle(-339, 180, -279, 232), ['种子'], onPlant, (player: Player)=>
    player.controller.getSeasonID() !== 3),
    new Event('收获', new Rectangle(-339, 180, -279, 232), [], onHarvet, (player) =>
        player.getTiledMap().getChildByName('稻草')!.active
    ),
    new Event('喂养', new Rectangle(-339, 45, -321, 74), ['麦子'], onFeed, (player) =>
        player.getTiledMap().getChildByName('乌鸦叼纸')!.active
    ),
    new Event('摇晃', new Rectangle(115, 395, 233, 414), [], onShake, (player) =>
        player.getTiledMap().getChildByName('苹果')!.active
    ),
    new Event('拾起', new Rectangle(115, 395, 233, 414), [], onPickApple, (player) =>
        player.getTiledMap().getChildByName('掉地上的苹果')!.active
    ),
    new Event('对话', new Rectangle(-380, -420, -325, -393), [], onTalk, (player) => 
        player.controller.talkState !== -1
    ),
];