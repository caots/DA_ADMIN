import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

import { MENU_ITEMS } from './pages-menu';
import {STORAGE_KEY, ADMIN_TYPE, ADMIN_PERMISSION} from './../constants/config'

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit{
  menu: NbMenuItem[];
  ngOnInit(): void {
    this.menu = MENU_ITEMS;
  }
}
