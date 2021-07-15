
import { _decorator, Component, Node, Animation } from 'cc';
import { Map } from './map';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    plantedSeasonID = -1;
    seasonChangable = true;
    talkState = 0;
    hasShear = false;
    isInRoom = false;
    treeCounter = 0;
    sheepCounter = 0;
    hasCheckedJar = false;
    hasPlayedHintC = false;

    start() {
        this.playAnimation("提示-WASD", "hint1");
    }

    getMap() {
        return this.node.getChildByName('Outdoor')!.getComponent('Map') as Map;
    }

    getSeasonID() {
        return this.getMap().seasonID;
    }

    getMapElement(elementName: string) {
        return this.node.getChildByName('Outdoor')!.getChildByName(elementName)!;
    }

    getArea(areaName: string) {
        return this.node.getChildByName('area')!.getChildByName(areaName)!;
    }

    playAnimation(nodeName: string, animName: string) {
        let node = this.node.getChildByName(nodeName)!;
        node.active = true;
        node.getComponent(Animation)?.play(animName);
    }

    setFishMoving(flag: boolean) {
        this.node.getChildByName("鱼群")!.active = flag;
    }
}
