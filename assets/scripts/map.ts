
import { _decorator, Component, systemEvent, EventKeyboard, SystemEvent, macro } from 'cc';
const { ccclass, property } = _decorator;
import { Controller } from './controller';
import { OutdoorController } from './outdoorController';
import { Player } from './player';

@ccclass('Map')
export class Map extends Component {


    [index: string]: any;

    crow = "乌鸦叼纸"

    @property(OutdoorController)
    controller: OutdoorController = null!;

    @property(Component)
    collisions: Component = null!;

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

    getNodesOfSeasons() {
        return [
            ["春草", "春夏树", "野花", "河"],
            ["夏草", "春夏树", "野花", "河"],
            ["秋草", "苹果", this.crow, "秋天装饰", "秋树", "河"],
            ["冬草", "雪花等元素", "乌鸦树", "冬河"],
        ]
    }
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
        for (const nodeName of this.getNodesOfSeasons()[(index + 3) % 4])
            if (nodeName !== "") {
                this.node.getChildByName(nodeName)!.active = false;
            }
        for (const nodeName of this.getNodesOfSeasons()[index])
            if (nodeName !== "") {
                this.node.getChildByName(nodeName)!.active = true;
            }
        for (const method of this.methodsOfSeasons[(index + 3) % 4]) {
            this[method](false);
        }
        for (const method of this.methodsOfSeasons[index]) {
            this[method](true);
        }
        this.updateCollisions(index);
    }

    updateCollisions(index: number) {
        this.collisions.node.children.forEach(p => {
            if (p.name == "static") {
                // pass
            }
            else if (p.name == "spring") {
                if (index == 0) p.active = true;
                else p.active = false;
            }
            else if (p.name == "summer") {
                if (index == 1) p.active = true;
                else p.active = false;
            }
            else if (p.name == "autumn") {
                if (index == 2) p.active = true;
                else p.active = false;
            }
            else if (p.name == "winter") {
                if (index == 3) p.active = true;
                else p.active = false;
            }
        });
    }


    start() {
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === macro.KEY.c) {
            this.seasonID = (this.seasonID + 1) % 4;
        }
    }
}