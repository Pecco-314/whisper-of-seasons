
import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;
import { Controller } from './controller'

@ccclass('Hint')
export class Hint extends Component {

    @property(Controller)
    controller: Controller = null!;

    playNext() {
        this.controller.playAnimation('提示-C', 'hint2');
    }
}
