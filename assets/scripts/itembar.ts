
import { _decorator, Component, Node } from 'cc';
import { Item } from './event';
const { ccclass, property } = _decorator;


@ccclass('ItemBar')
export class ItemBar extends Component {
    readonly Y = 0;
    positions = [-116, -69, -23, 24, 71, 117];
    items: Item[] = [];

    addItem(item: Item) {
        let itemNode = this.node.getChildByName(item)!;
        this.items.push(item);
        itemNode.active = true;
        this.updateItemBar();
    }

    loseItem(item: Item) {
        let itemNode = this.node.getChildByName(item)!;
        const idx = this.items.indexOf(item);
        if (idx >= 0) this.items.splice(idx, 1);
        itemNode.active = false;
        this.updateItemBar();
    }

    updateItemBar() {
        for (let i = 0; i < this.items.length; i++) {
            let itemNode = this.node.getChildByName(this.items[i])!;
            itemNode.setPosition(this.positions[i], this.Y);
        }
    }
}