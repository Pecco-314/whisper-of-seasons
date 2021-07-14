
import { _decorator, Component } from 'cc';
const { ccclass, property, float } = _decorator;

@ccclass('Sheep')
export class Sheep extends Component {

    @float
    velocity = 5;

    readonly LEFT_WALL = 166;
    readonly RIGHT_WALL = 416;

    update(dt: number) {
        let pos = this.node.getPosition();
        let x = pos.x + dt * this.velocity;
        this.node.setPosition(x, pos.y, pos.z);
        if (x <= this.LEFT_WALL) {
            this.velocity = Math.abs(this.velocity);
            this.node.setScale(-1, 1, 1);
        } else if (x >= this.RIGHT_WALL) {
            this.velocity = -Math.abs(this.velocity);
            this.node.setScale(1, 1, 1);
        }
    }

}