import { Animation, Label, Sprite, UITransform } from "cc";
import { Map } from "./map";
import { OutdoorController } from "./outdoorController";
import { Player } from "./player";
export type Item = "种子" | "树苗" | "麦子" | "苹果" | "羊毛" | "剪刀";

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
    rectangle: string;
    requiredItems: Item[];
    filter: (player: Player) => boolean;
    action: (player: Player) => void;
    constructor(name: string, rectangle: string, requiredItems: Item[], action: (player: Player) => void, filter?: (player: Player) => boolean) {
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
            this.filter = (() => true);
        }
    }
}

function onPlant(player: Player) {
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
}

function onPickApple(player: Player) {
    player.getTiledMap().getChildByName('掉地上的苹果')!.active = false;
    player.addItem("苹果");
}

function onTalk(player: Player) {
    let talkBox = player.controller.node.getChildByName('对话框')!;
    talkBox.active = true;
    if (player.items.indexOf("苹果") < 0 && player.controller.talkState === 0) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "饿了，想吃苹果\n了";
    } else if (player.controller.talkState === 0) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "苹果是给我的吗？\n谢谢你！";
        player.controller.talkState = 1;
        player.loseItem('苹果');
    } else if (player.controller.talkState === 1) {
        (talkBox.getChildByName("对话内容")!.getComponent(Label) as Label).string = "这是给你的谢礼！";
        let password = player.controller.node.getChildByName("密码3")!;
        password.active = true;
        password.getComponent(Animation)!.play('password3');
        player.controller.seasonChangable = false;
        player.controller.talkState = -1;
    }
}

function onFetch(player: Player) {
    player.getTiledMap().getChildByName('信')!.active = false;
    let password = player.controller.node.getChildByName("密码1")!;
    password.active = true;
    password.getComponent(Animation)!.play('password1');
    player.controller.seasonChangable = false;
}

function onShear(player: Player) {
    player.addItem('羊毛');
    player.controller.hasShear = true;
}

function onEnter(player: Player) {
    let pos = player.controller.getArea('内门').getPosition();
    player.node.setPosition(pos);
    player.controller.node.getChildByName('Camera')!.setPosition(2000, 2000, 1000);
    player.controller.isInRoom = true;
}

function onLeave(player: Player) {
    let pos = player.controller.getArea('门').getPosition();
    player.node.setPosition(pos);
    player.controller.node.getChildByName('Camera')!.setPosition(0, 0, 1000);
    player.controller.isInRoom = false;
    if (!player.controller.hasPlayedHintC) {
        player.controller.node.getChildByName('提示-C')!.getComponent(Animation)?.play('hint2');
        player.controller.hasPlayedHintC = true;
    }
}

function onPlantTree(player: Player) {
    player.controller.treeCounter = 0;
    let tree = player.controller.getArea('小树')!;
    tree.active = true;
    let pos = player.node.getPosition();
    tree.setPosition(pos.x - 20, pos.y + 20, pos.z);
}

function onFetchScissors(player: Player) {
    player.addItem('剪刀');
    player.controller.node.getChildByName('剪刀')!.active = false;
}

function onCheckJar(player: Player) {
    player.addItem('种子');
    player.controller.hasCheckedJar = true;
}

export const events: Event[] = [
    new Event('种植', '田', ['种子'], onPlant, (player: Player) => player.controller.getSeasonID() !== 3),
    new Event('收获', '田', [], onHarvet, (player) =>
        player.getTiledMap().getChildByName('稻草')!.active
    ),
    new Event('喂养', '乌鸦树下', ['麦子'], onFeed, (player) =>
        player.getTiledMap().getChildByName('乌鸦叼纸')!.active
    ),
    new Event('摇晃', '苹果树下', [], onShake, (player) =>
        player.getTiledMap().getChildByName('苹果')!.active
    ),
    new Event('拾起', '苹果树下', [], onPickApple, (player) =>
        player.getTiledMap().getChildByName('掉地上的苹果')!.active
    ),
    new Event('对话', '精灵边', [], onTalk, (player) =>
        player.controller.talkState !== -1
    ),
    new Event('取出', '苹果树下', [], onFetch, (player) =>
        player.getTiledMap().getChildByName('信')!.active
    ),
    new Event('剪毛', '羊', [], onShear, (player) => !player.controller.hasShear && player.controller.sheepCounter >= 3),
    new Event('进门', '门', [], onEnter),
    new Event('出门', '内门', [], onLeave),
    new Event('种树', '草地1', ['树苗'], onPlantTree, (player) => player.controller.getSeasonID() === 0),
    new Event('种树', '草地2', ['树苗'], onPlantTree, (player) => player.controller.getSeasonID() === 0),
    new Event('种树', '草地3', ['树苗'], onPlantTree, (player) => player.controller.getSeasonID() === 0),
    new Event('种树', '草地4', ['树苗'], onPlantTree, (player) => player.controller.getSeasonID() === 0),
    new Event('拿起', '桌边', [], onFetchScissors, (player) => player.controller.node.getChildByName('剪刀')!.active),
    new Event('查看', '罐子右', [], onCheckJar, (player) => !player.controller.hasCheckedJar),
    new Event('查看', '罐子下', [], onCheckJar, (player) => !player.controller.hasCheckedJar),
];