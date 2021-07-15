
import { _decorator, Component, Node, Animation } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;

@ccclass('OutdoorController')
export class OutdoorController extends Controller {
    start() {
        this.playAnimation("提示-WASD", "hint1");
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
