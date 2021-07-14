
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
        this.setSeasonChangable(true);
    }

    onTalkEnd() {
        console.log(this.controller.node.getChildByName('对话框'));
        this.controller.node.getChildByName('对话框')!.active = false;
        this.setSeasonChangable(true);
    }

    setSeasonChangable(flag: boolean) {
        this.controller.seasonChangable = flag;
    }

}