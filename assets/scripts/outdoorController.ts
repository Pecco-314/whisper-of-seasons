
import { _decorator, Component, Node, Animation } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;

@ccclass('OutdoorController')
export class OutdoorController extends Controller {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

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

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
