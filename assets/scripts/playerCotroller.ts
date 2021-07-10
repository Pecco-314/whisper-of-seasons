
import { _decorator, Component, Node, CCInteger, systemEvent, SystemEventType, EventKeyboard, Event, macro, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerCotroller')
export class PlayerCotroller extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    player: Node = null!;
    @property(Sprite)
    playerSprite: Sprite = null!
    @property(Node)
    camera: Node = null!;

    @property(Sprite)
    player_front: Sprite = null!;
    @property(Sprite)
    player_back: Sprite = null!;
    @property(Sprite)
    player_left: Sprite = null!;
    @property(Sprite)
    player_right: Sprite = null!;


    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;

    private speed: number = 150;
    private eps: number = 6;

    private wid: number = 71 / 2;
    private hei: number = 89 / 2;

    private mp_size: number = 512;
    private cam_size: number = 400;

    start() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);
    }

    update(deltaTime: number) {
        let pos = this.player.position;
        let deltaX = 0, deltaY = 0;
        if (this.moveRight) deltaX += deltaTime * this.speed;
        if (this.moveLeft) deltaX -= deltaTime * this.speed;
        if (this.moveUp) deltaY += deltaTime * this.speed;
        if (this.moveDown) deltaY -= deltaTime * this.speed;
        let xR = 112 + this.wid, xL = 48 - this.wid, yU = 80 + this.hei, yD = 16 + this.hei;
        if (pos.x + deltaX >= xL && pos.x + deltaX <= xR && pos.y + deltaY >= yD && pos.y + deltaY <= yU) {
            if (pos.x > xR - this.eps) deltaX = xR - pos.x;
            if (pos.x < xL + this.eps) deltaX = xL - pos.x;
            if (pos.y > yU - this.eps) deltaY = yU - pos.y;
            if (pos.y < yD + this.eps) deltaY = yD - pos.y;
        }

        {
            if (pos.x + deltaX + this.wid > this.mp_size) deltaX = this.mp_size - pos.x - this.wid;
            if (pos.x + deltaX - this.wid < -this.mp_size) deltaX = -this.mp_size - pos.x + this.wid;
            if (pos.y + deltaY + this.hei > this.mp_size) deltaY = this.mp_size - pos.y - this.hei;
            if (pos.y + deltaY - this.hei < -this.mp_size) deltaY = -this.mp_size - pos.y + this.hei;
        }

        this.player.setPosition(pos.x + deltaX, pos.y + deltaY);

        {
            let x = this.player.position.x + this.mp_size;
            let y = this.player.position.y + this.mp_size;
            if (x < 400) x = 400;
            if (x > 2 * this.mp_size - 400) x = 2 * this.mp_size - 400;
            if (y < 400) y = 400;
            if (y > 2 * this.mp_size - 400) y = 2 * this.mp_size - 400;
            x -= this.mp_size;
            y -= this.mp_size;
            this.camera.setPosition(x, y);
        }
    }

    onKeyDown(Event: EventKeyboard) {
        switch (Event.keyCode) {
            case macro.KEY.w:
                this.moveUp = true;
                this.playerSprite.spriteFrame = this.player_back.spriteFrame;
                break;
            case macro.KEY.s:
                this.moveDown = true;
                this.playerSprite.spriteFrame = this.player_front.spriteFrame;
                break;
            case macro.KEY.a:
                this.moveLeft = true;
                this.playerSprite.spriteFrame = this.player_left.spriteFrame;
                break;
            case macro.KEY.d:
                this.moveRight = true;
                this.playerSprite.spriteFrame = this.player_right.spriteFrame;
                break;
        }
    }

    onKeyUp(Event: EventKeyboard) {
        switch (Event.keyCode) {
            case macro.KEY.w:
                this.moveUp = false;
                break;
            case macro.KEY.s:
                this.moveDown = false;
                break;
            case macro.KEY.a:
                this.moveLeft = false;
                break;
            case macro.KEY.d:
                this.moveRight = false;
                break;
        }
    }
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
