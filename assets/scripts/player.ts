
import { _decorator, Component, Label } from 'cc';
import { Controller } from './controller';
const { ccclass, property } = _decorator;
import { Item, Event, events } from "./event";

@ccclass('Player')
export class Player extends Component {

    @property(Controller)
    controller: Controller = null!;

    items: Item[] = ["seed", "sapling"];

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

    addItem(item: Item) {
        this.items.push(item);
    }

    loseItem(item: Item) {
        let res: Item[] = [];
        this.items.forEach((x) => { if (x !== item) res.push(x); });
        this.items = res;
    }
}