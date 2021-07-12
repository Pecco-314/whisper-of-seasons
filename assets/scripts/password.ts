
import { _decorator, Component, Node, Animation } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;

@ccclass('Password')
export class Password extends Component {

    @property(Controller)
    controller: Controller = null!;

    crowFly() {
        this.controller.node.getChildByName('TiledMap')!.getChildByName('乌鸦')!.active = false;
        let crow = this.controller.node.getChildByName('乌鸦飞')!;
        crow.active = true;
        crow.getComponent(Animation)!.play("crow");
        this.controller.seasonChangable = true;
    }

}