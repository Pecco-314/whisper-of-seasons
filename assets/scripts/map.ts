
import { _decorator, Component, systemEvent, EventKeyboard, SystemEvent, macro } from 'cc';
const { ccclass, property } = _decorator;
import { Controller } from './controller';
import { OutdoorController } from './outdoorController';
import { Player } from './player';

@ccclass('Map')
export class Map extends Component {

    [index: string]: any;

    @property(OutdoorController)
    controller: OutdoorController = null!;

    setFishMoving(flag: boolean) {
        this.controller.setFishMoving(flag);
    }

    setPlanted(flag: boolean) {
        if (this.controller.hasPlanted) {
            this.node.getChildByName('苗')!.active = false;
            this.node.getChildByName('稻草')!.active = flag;
            this.controller.hasPlanted = flag;
        }
    }

    nodesOfSeasons = [
        ["春草", "春夏树", "野花"],
        ["夏草", "春夏树", "野花"],
        ["秋草", "苹果", "乌鸦叼纸", "秋天装饰", "秋树"],
        ["冬草", "雪花等元素", "乌鸦树"],
    ]
    methodsOfSeasons = [
        [],
        ["setFishMoving"],
        ["setPlanted"],
        [],
    ]

    _seasonID = 0;
    get seasonID() {
        return this._seasonID;
    }
    set seasonID(index: number) {
        this._seasonID = index;
        for (const nodeName of this.nodesOfSeasons[(index + 3) % 4]) {
            this.node.getChildByName(nodeName)!.active = false;
        }
        for (const nodeName of this.nodesOfSeasons[index]) {
            this.node.getChildByName(nodeName)!.active = true;
        }
        for (const method of this.methodsOfSeasons[(index + 3) % 4]) {
            this[method](false);
        }
        for (const method of this.methodsOfSeasons[index]) {
            this[method](true);
        }
    }

    start() {
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === macro.KEY.c) {
            this.seasonID = (this.seasonID + 1) % 4;
        } else if (event.keyCode === macro.KEY.f) {
            let player = this.controller.node.getChildByName('player')!.getComponent(Player)!;
            (player.action)(player);
        }
    }
}