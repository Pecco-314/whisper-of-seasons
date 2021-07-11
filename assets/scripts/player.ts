
import { _decorator, Component, Label, EventKeyboard, macro, systemEvent, SystemEvent } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;
import { Item, Event, events } from "./event";
import { ItemBar } from './itembar';

@ccclass('Player')
export class Player extends Component {

    @property(Controller)
    controller: Controller = null!;

    @property(ItemBar)
    itemBar: ItemBar = null!;

    items: Item[] = ["种子", "树苗"];

    start() {
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.items.forEach((item) => this.itemBar.addItem(item));
    }

    action(player: Player) { }

    setFHint(active: boolean, text?: string) {
        let fhint = this.controller.node.getChildByName("F键提示")!;
        if (active) {
            fhint.getChildByName('提示')!.getComponent(Label)!.string = text!;
            fhint.setPosition(this.node.getPosition().add3f(150, 0, 0));
        }
        fhint.active = active;
    }

    satisfy(event: Event) {
        if (!event.filter(this)) {
            return false;
        }
        let pos = this.node.getPosition();
        if (!event.rectangle.contains(pos.x, pos.y)) {
            return false;
        }
        for (const item of event.requiredItems) {
            if (this.items.indexOf(item) < 0) {
                return false;
            }
        }
        return true;
    }

    update() {
        for (const event of events) {
            if (this.satisfy(event)) {
                this.setFHint(true, event.name);
                this.action = event.action;
                return;
            }
        }
        this.setFHint(false);
        this.action = (player: Player) => { };
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === macro.KEY.f) {
            (this.action)(this);
        }
    }

    addItem(item: Item) {
        this.items.push(item);
        this.itemBar.addItem(item);
    }

    loseItem(item: Item) {
        let res: Item[] = [];
        this.items.forEach((x) => { if (x !== item) res.push(x); });
        this.items = res;
        this.itemBar.loseItem(item);
    }
}