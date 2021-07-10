
import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {
    start() {
        this.playAnimation("提示-WASD", "hint1");
    }

    playAnimation(nodeName: string, animName: string) {
        let node = this.node.getChildByName(nodeName)!;
        node.getComponent(Animation)?.play(animName);
    }

    setFishMoving(flag: boolean) {
        this.node.getChildByName("鱼群")!.active = flag;
    }
}
