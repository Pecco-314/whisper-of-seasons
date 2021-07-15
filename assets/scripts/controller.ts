
import { _decorator, Component, Node, Animation } from 'cc';
import { Map } from './map';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    plantedSeasonID = -1;
    seasonChangable = true;
    talkState = 0;
    hasShear = false;
    isInRoom = false;
    treeCounter = 0;
    sheepCounter = 0;
    hasCheckedJar = false;
    hasPlayedHintC = false;

    getSeasonID() {
        return (this.node.getChildByName('TiledMap')!.getComponent('Map') as Map).seasonID;
    }

    getArea(areaName: string) {
        return this.node.getChildByName('area')!.getChildByName(areaName)!;
    }
}
