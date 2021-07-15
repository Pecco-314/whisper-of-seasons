
import { _decorator, Component, systemEvent, EventKeyboard, SystemEvent, macro, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import { Controller } from './controller';

@ccclass('Map')
export class Map extends Component {


    [index: string]: any;

    crow = "乌鸦叼纸"

    @property(Controller)
    controller: Controller = null!;

    @property(Component)
    collisions: Component = null!;

    setFishMoving(flag: boolean) {
        this.controller.setFishMoving(flag);
    }

    setPlanted(flag: boolean) {
        if (this.controller.plantedSeasonID !== -1) {
            this.node.getChildByName('苗')!.active = false;
        }
        if (this.controller.plantedSeasonID === 0) {
            this.node.getChildByName('麦子')!.active = flag;
        }
    }

    getNodesOfSeasons() {
        return [
            ["春草", "春夏树", "野花", "河"],
            ["夏草", "春夏树", "野花", "河"],
            ["秋草", "苹果", this.crow, "秋天装饰", "秋树", "河"],
            ["冬草", "雪花等元素", "冬乌鸦树", "冬河", "对岸的冬树"],
        ]
    }
    methodsOfSeasons = [
        [],
        ["setFishMoving"],
        ["setPlanted"],
        [],
    ]
    perishableMapElement = [
        '掉地上的苹果',
    ]
    perishableRootElement = [
        '对话框',
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
        for (const element of this.perishableMapElement) {
            let node = this.node.getChildByName(element)!;
            node.active = false;
        }
        for (const element of this.perishableRootElement) {
            let node = this.controller.node.getChildByName(element)!;
            node.active = false;
        }
        this.updateCollisions(index);
        this.updateSheep(index);
        this.controller.treeCounter++;
        if (this.controller.treeCounter >= 4) {
            let smallTreeSprite = this.controller.node.getChildByName('area')!.getChildByName('小树')!.getComponent(Sprite)!;
            let bigTreeSprite = this.controller.node.getChildByName('area')!.getChildByName('大树')!.getComponent(Sprite)!;
            smallTreeSprite.spriteFrame = bigTreeSprite.spriteFrame;
        }
    }

    updateSheep(index: number) {
        let sheepNode = this.controller.node.getChildByName('area')!.getChildByName('羊')!;
        let sheepSprite = sheepNode.getComponent(Sprite)!;
        this.controller.sheepCounter++;
        if (this.controller.sheepCounter === 2) {
            sheepSprite.spriteFrame = sheepNode.getChildByName('秋羊')!.getComponent(Sprite)!.spriteFrame;
        } else if (this.controller.sheepCounter === 3) {
            sheepSprite.spriteFrame = sheepNode.getChildByName('冬羊')!.getComponent(Sprite)!.spriteFrame;
        }
    }

    updateCollisions(index: number) {
        this.collisions.node.children.forEach(p => {
            if (p.name == "static") {
                // pass
            } else if (p.name == "spring") {
                p.active = (index === 0);
            } else if (p.name == "summer") {
                p.active = (index === 1);
            } else if (p.name == "autumn") {
                p.active = (index === 2);
            } else if (p.name == "winter") {
                p.active = (index === 3);
            }
        });
    }


    start() {
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === macro.KEY.c && this.controller.seasonChangable) {
            this.seasonID = (this.seasonID + 1) % 4;
        }
    }
}