
import { _decorator, Component, Node } from 'cc';
const { ccclass, property, float, string } = _decorator;

type direction = 'left' | 'right';

@ccclass('Fish')
export class Fish extends Component {

    @float
    speed = 30;

    @string
    direction: direction = null!;

    readonly width = 1024;

    update(dt: number) {
        let dir = this.direction === 'left' ? -1 : 1;
        let oldpos = this.node.getPosition();
        let x = this.speed * dt * dir + oldpos.x;
        if (dir == 1 && x > this.width + 40) {
            x = -40;
        } else if (dir == -1 && x < -40) {
            x = this.width + 40;
        }
        this.node.setPosition(x, oldpos.y, oldpos.z);
    }
}