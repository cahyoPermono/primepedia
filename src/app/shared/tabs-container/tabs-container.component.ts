import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> =
    new QueryList();

  constructor() {}

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active);

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    // step 1 change all tabs to false
    this.tabs.forEach((tab) => {
      tab.active = false;
    });

    // step 2 activate right tab
    tab.active = true;

    // same like prevent default
    return false
  }

  tabStyle(tab: TabComponent){
    return {
      'hover:text-indigo-400' : !tab.active,
      'hover:text-white text-white bg-indigo-400': tab.active
    }
  }
}
