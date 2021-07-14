
import { _decorator, Component, Node, systemEvent, SystemEventType, EventKeyboard, macro, director, UITransform, Animation } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;

@ccclass('RoomController')
export class RoomController extends Controller {

    @property(Node)
    passwordBox: Node = null!;
    @property(Node)
    door: Node = null!;
    @property(Node)
    player: Node = null!;


    start() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.openBox, this);
        systemEvent.on(SystemEventType.KEY_DOWN, this.openDoor, this);

        this.playAnimation("提示-WASD", "hint1");
    }

    openBox(Event: EventKeyboard) {
        let passwordBoxRec = <UITransform>this.passwordBox.getComponent(UITransform)
        let playerRec = <UITransform>this.player.getComponent(UITransform)
        if (Event.keyCode == macro.KEY.f) {
            if (passwordBoxRec.getBoundingBox().intersects(playerRec.getBoundingBox())) {

            }
        }
    }

    openDoor(Event: EventKeyboard) {
        let doorRec = <UITransform>this.door.getComponent(UITransform)
        let playerRec = <UITransform>this.player.getComponent(UITransform)
        if (Event.keyCode == macro.KEY.f) {
            if (doorRec.getBoundingBox().intersects(playerRec.getBoundingBox())) {
                console.log("open open open door")
                director.loadScene('scene')
            }
        }
    }

    playAnimation(nodeName: string, aniName: string) {
        let node = this.node.getChildByName(nodeName)
        node?.getComponent(Animation)?.play(aniName)
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
