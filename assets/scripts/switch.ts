
import { _decorator, Component, Node, systemEvent, EventKeyboard, SystemEvent, macro } from 'cc';
const { ccclass, property } = _decorator;
import { Controller } from './controller';

@ccclass('Switch')
export class Switch extends Component {

    @property(Controller)
    controller: Controller = null!;

    @property(Node)
    collisions: Node = null!

    nodesOfSeasons = [
        ["春草", "春夏树", "野花"],
        ["夏草", "春夏树", "野花"],
        ["秋草", "苹果", "乌鸦叼纸", "秋天装饰", "秋树"],
        ["冬草", "雪花等元素", "乌鸦树"],
    ]
    methodsOfSeasons = [
        [],
        [(flag: boolean) => this.controller.setFishMoving(flag)],
        [],
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
            method(false);
        }
        for (const method of this.methodsOfSeasons[index]) {
            method(true);
        }
        
        this.collisions.children.forEach(p => {
            if(p.name == "static"){
                ;
            }
            else if(p.name == "spring"){
                if(index == 0)p.active = true;
                else p.active = false;
            }
            else if(p.name == "summer"){
                if(index == 1)p.active = true;
                else p.active = false;
            }
            else if(p.name == "autumn"){
                if(index == 2)p.active = true;
                else p.active = false;
            }
            else if(p.name == "winter"){
                if(index == 3)p.active = true;
                else p.active = false;
            }
        });
    }

    start() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.collisions.children.forEach(p =>{
            if(p.name == "spring" || p.name == "static")
                p.active = true;
            else p.active = false;
        });
    }
    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === macro.KEY.c) {
            this.seasonID = (this.seasonID + 1) % 4;
        }
    }
}