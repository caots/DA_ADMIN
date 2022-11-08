import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { PaginationConfig } from '../../interfaces/paginationConfig';

@Component({
  selector: 'ngx-pagigation',
  templateUrl: './pagigation.component.html',
  styleUrls: ['./pagigation.component.scss']
})
export class PagigationComponent implements OnInit {
  @Input() config: PaginationConfig;
  @Output() goTo = new EventEmitter();
  pageNumber: number;

  constructor() { }

  ngOnInit(): void {
  }

  getListPage() {
    this.pageNumber = Math.ceil(this.config.totalRecord / this.config.maxRecord);
    let listPage = [];
    for (let i = 1; i <= this.pageNumber; i++) {
      listPage.push(i);
    }
    return listPage;
  }

  previous() {
    if (this.config.currentPage >= 1) {
      this.goTo.emit(--this.config.currentPage);
    }
  }

  next() {
    const numberPage = Math.ceil(this.config.totalRecord / this.config.maxRecord);
    if (this.config.currentPage <= numberPage) {
      this.goTo.emit(++this.config.currentPage);
    }
  }

  go(page: number) {
    this.goTo.emit(page);
  }

  show() {
    const pageNumber = Math.ceil(this.config.totalRecord / this.config.maxRecord);
    return pageNumber > 1;
  }

}
