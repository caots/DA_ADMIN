import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { NbDialogService, NbMenuService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { ACCOUNT_TYPE } from '../../constants/config';
import { MESSAGE } from '../../constants/message';
import { TYPE_SORTED, PAGING, STORAGE_KEY } from '../../constants/config'
import { Employer } from './../../interfaces/employer';
import { Report } from './../../interfaces/report';
import { PaginationConfig } from '../../interfaces/paginationConfig';
import { ApiService } from '../../services/api.service'
import { HelperService } from '../../services/helper.service';
import { EmployerService } from './../../services/employer.service';
import { SubjectService } from 'app/services/subject.service';

@Component({
  selector: 'ngx-manage-employers',
  templateUrl: './manage-employers.component.html',
  styleUrls: ['./manage-employers.component.scss']
})

export class ManageEmployersComponent implements OnInit {
  isLoading: boolean = true;
  isShowFilter: boolean = false;
  orderBy: string = TYPE_SORTED.OLDEST;
  listTab = LIST_TAB;
  paramsService: any = PARAMS;
  source: LocalDataSource = new LocalDataSource();
  paginationConfig: PaginationConfig;
  statusEmployer: string = this.listTab[0].id;
  textSearchEmployer: string;
  listEmployers: Employer[] = [];
  reportEmployers: Report[];
  listCountry: Array<string> = [];
  selectLocation: string;
  isShowBtnDeleteAll: boolean = false;
  isShowBtnRestoreAll: boolean = false;
  settings: any = TABLE_SETTING;
  actionTable: any = TABLE_ACTION;
  deleteUser: any;
  restoreUser: any;
  messageUser: any;
  subscriptions: Subscription[] = [];
  adminPermission: any;
  listCompanies: any[];
  itemsFilter: Array<Object> = [
    { title: TYPE_SORTED.LATEST },
    { title: TYPE_SORTED.OLDEST },
  ];
  constructor(
    public router: Router,
    private subjectService: SubjectService,
    private activeRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private employerService: EmployerService,
    private helperService: HelperService,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    let stringPermission = localStorage.getItem(STORAGE_KEY.ADMIN_PERMISSION)?.substring(0, localStorage.getItem(STORAGE_KEY.ADMIN_PERMISSION).length - 1)
    this.adminPermission = stringPermission?.substring(1)?.split(",")
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.status) {
        this.statusEmployer = params.status;
      } else {
        this.statusEmployer = this.listTab[0].id;
      }
    })

    this.paramsService = Object.assign({}, this.paramsService,
      { page: this.paginationConfig.currentPage },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusEmployer ? this.statusEmployer : '' },
      { orderNo: this.orderBy === TYPE_SORTED.LATEST ? 0 : 1 }
    )

    this.employerService.getTotalEmployer().then(resTotal => {
      this.listTab.forEach(tab => {
        const found = resTotal.find(total => tab.id == total.id);
        if (found) {
          tab['total'] = found.total;
        }
      })
    })
    this.getListEmployer(this.paramsService);
    this.getDataMaster();
    this.nbMenuService.onItemClick().pipe(
      filter(({ tag }) => tag === 'filter-context-menu'),
      map(({ item: { title } }) => title),
    ).subscribe(title => this.changeSortType(title));
  }

  getAddressCompany(company) {
    const cityName = company?.city_name ? `${company.city_name}, ` : '';
    const stateName = company?.state_name ? `${company.state_name}, ` : '';
    const zipCode = company?.zip_code || '';
    return `${cityName}${stateName}${zipCode}`;
  }

  ngOnChanges(): void {
    if (this.listCompanies.length > 0) {
      this.listCompanies.map((co, index) => {
        this.listCompanies[index]['isCollapsed'] = false;
      });
    }
  }

  changeCollageCompany(index) {
    this.listCompanies[index]['isCollapsed'] = !this.listCompanies[index]['isCollapsed'];
    this.listCompanies.map((co, i) => {
      if (i == index) return;
      this.listCompanies[i]['isCollapsed'] = false;
    });
    if (this.listCompanies[index]['isCollapsed'] && this.listCompanies[index].id != this.paramsService.companyId) {
      this.paginationConfig.currentPage = 0;
      this.textSearchEmployer = '';
      this.paramsService = Object.assign({}, this.paramsService,
        { companyId: this.listCompanies[index].id },
        { page: this.paginationConfig.currentPage },
        { name: '' },
        { location: '' },
        { searchType: this.statusEmployer },
        { orderNo: 1 }
      )
      this.getListEmployer(this.paramsService);
    }
  }

  addClassRemoveItem() {
    if (this.listEmployers) {
      this.listEmployers.map((job, index) => {
        if (job.is_deleted === 1) {
          setTimeout(() => {
            if(document.getElementsByTagName('tr')[index + 1]) document.getElementsByTagName('tr')[index + 1].className = "ng2-smart-row ng-star-inserted is-deleted";
          }, 100)
        } else {
          setTimeout(() => {
            if(document.getElementsByTagName('tr')[index + 1]) document.getElementsByTagName('tr')[index + 1].className = "ng2-smart-row ng-star-inserted";
          }, 100)
        }
      })
    }
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listCountry, query);
      })
    )
  }

  filterData() {
    this.isShowFilter = !this.isShowFilter;
    if (!this.isShowFilter) {
      this.selectLocation = '';
      let searchLocation: any = document.getElementById('search-location');
      searchLocation.value = '';
    }
    this.paramsService = Object.assign({}, this.paramsService,
      { page: this.paginationConfig.currentPage },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusEmployer ? this.statusEmployer : '' },
      { orderNo: this.orderBy === TYPE_SORTED.LATEST ? 0 : 1 }
    )
    this.getListEmployer(this.paramsService);
  }

  getListEmployer(params) {
    this.isLoading = true;
    const getListEmployerSubscription = this.employerService.getListEmployer(params).subscribe(
      data => {
        this.isLoading = false;
        this.listEmployers = data.listEmployer;
        this.listEmployers.forEach(emp => {
          emp.full_name = emp.first_name ? `${emp.first_name} ${emp?.last_name || ''}` : '';
          // if (emp.employer_id == 0) emp.full_name = emp.full_name + " (Primary)";
        })
        this.paginationConfig.totalRecord = data.total;
        this.source.load(this.listEmployers);
        this.addClassRemoveItem();
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getListEmployerSubscription);
  }

  getDetailsEmployer(employerId) {
    this.reportEmployers = this.listEmployers.filter(employer => employer.id === employerId)[0].reports;
  }

  deleteEmployerById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 1) {
        this.helperService.showSuccess("Data has been deleted");
        return;
      };
    }
    const deleteEmployerSubscrition = this.employerService.deletesEmployer(data, 'delete').subscribe(
      data => {
        this.getListEmployer(Object.assign({}, PARAMS, { searchType: this.statusEmployer }));
        this.isShowBtnDeleteAll = false;
        this.helperService.showSuccess(MESSAGE.DELETE_EMPLOYER_SUCCESS);
      },
      error => {
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(deleteEmployerSubscrition);
  }

  restoreEmployersById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 0) {
        this.helperService.showSuccess("The data still exists");
        return;
      };
    }
    this.employerService.deletesEmployer(data, 'restore').subscribe(
      data => {
        this.getListEmployer(Object.assign({}, PARAMS, { searchType: this.statusEmployer }));
        this.isShowBtnRestoreAll = false;
        this.helperService.showSuccess(MESSAGE.RESTORE_JOB_POSTING_SUCCESS);
      },
      error => {
        this.helperService.showError(error);
      }
    )
  }

  paginationEmployer(page) {
    this.paginationConfig.currentPage = page;
    this.paramsService = Object.assign({}, this.paramsService,
      { page: this.paginationConfig.currentPage },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusEmployer ? this.statusEmployer : '' },
      { orderNo: this.orderBy === TYPE_SORTED.LATEST ? 0 : 1 }
    )
    this.getListEmployer(this.paramsService);
  }

  onCustomAction(event) {
    switch (event.action) {
      case this.actionTable.EDIT:
        this.onEditEmployer(event.data, 'edit', this.statusEmployer);
        break;
      case this.actionTable.DELETE:
        this.deleteUser = event.data;
        this.onConfirmDeleteEmployer(0, this.deleteUser);
        break;
      case this.actionTable.RESTORE:
        this.restoreUser = event.data;
        this.onConfirmRestoreEmployer(0, this.restoreUser);
        break;
      default:
        break;
    }
    this.addClassRemoveItem();
  }

  searchData(type) {
    if (type === 0) {
      this.selectLocation = '';
    }
    this.paramsService = Object.assign({}, this.paramsService,
      { page: 0 },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusEmployer ? this.statusEmployer : '' },
      { orderNo: this.orderBy === TYPE_SORTED.LATEST ? 0 : 1 }
    )
    this.getListEmployer(this.paramsService);
  }

  onMessageEmployer(employer) {
    if (employer.chat_group_id) {
      this.router.navigate(['/pages/messages'], {
        queryParams: {
          groupId: employer.chat_group_id,
          isGroup: 0,
          q: `${employer.full_name}`
        }
      })
    }
  }

  searchEnterData(e) {
    this.getListEmployer(Object.assign({}, this.paramsService,
      { orderNo: 1 },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' })
    );
  }

  changeSortType(type) {
    this.paramsService = Object.assign({}, this.paramsService,
      { page: 0 },
      { name: this.textSearchEmployer ? this.textSearchEmployer : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusEmployer ? this.statusEmployer : '' },
      { orderNo: this.orderBy === TYPE_SORTED.LATEST ? 0 : 1 }
    )
    if (this.orderBy === '') {
      this.paramsService = Object.assign({}, this.paramsService, { orderNo: 1 });
    }
    this.getListEmployer(this.paramsService);
  }

  onSelectedRowAction(event) {
    let totalJobIsDelete = event.selected.filter(e => e.is_deleted === 0);
    let totalJobIsRestore = event.selected.filter(e => e.is_deleted === 1)
    this.isShowBtnDeleteAll = totalJobIsDelete.length > 0;
    this.isShowBtnRestoreAll = totalJobIsRestore.length > 0;
    this.deleteUser = totalJobIsDelete;
    this.restoreUser = totalJobIsRestore;
  }

  onEditEmployer(data, type, tab) {
    this.router.navigate(['/pages/employer-details'], {
      queryParams: {
        id: data.employer_id ? data.employer_id : data.id,
        type: type,
        tab: tab
      }
    })
  }

  deleteAll() {
    this.onConfirmDeleteEmployer(1, this.deleteUser);
  }

  restoreAll() {
    this.onConfirmRestoreEmployer(1, this.restoreUser);
  }

  async onConfirmDeleteEmployer(type, data) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DELETE_EMPLOYER);
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.deleteEmployerById(arrsId, data);
      } else {
        data.map(user => {
          arrsId.push(user.id);
        })
        this.deleteEmployerById(arrsId, undefined);
      }
    }
  }

  async onConfirmRestoreEmployer(type, data) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_RESTORE_EMPLOYERS);
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.restoreEmployersById(arrsId, data);
      } else {
        data.map(user => {
          arrsId.push(user.id);
        })
        this.restoreEmployersById(arrsId, undefined);
      }
    }
  }


  onSelectStatusEmployer(status) {
    this.router.navigate([], {
      queryParams: {
        status
      }
    });
    this.statusEmployer = status;
    this.paramsService = Object.assign({}, PARAMS, { searchType: status });
    // this.listCompanies.map((co, i) => {
    //   this.listCompanies[i]['isCollapsed'] = false;
    // });
    this.getListEmployer(this.paramsService);
  }

  getDataMaster() {
    this.apiService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }
}

const LIST_TAB = [
  {
    id: 'active',
    name: 'Active'
  },
  {
    id: 'inactive',
    name: 'Inactive'
  }
]

const TABLE_ACTION = {
  EDIT: 'editAction',
  DELETE: 'deleteAction',
  MESSAGE: 'mesageAction',
  RESTORE: 'restoreAction',
  NOTE: 'noteAction'
}

const TABLE_SETTING = {
  selectMode: 'multi',
  columns: {
    full_name: {
      title: 'Username',
      filter: false
    },
    company_name: {
      title: 'Company',
      filter: false
    },
    email: {
      title: 'Email',
      filter: false
    },
    phone_number: {
      title: 'Phone',
      filter: false
    }
  },
  hideSubHeader: true,
  actions: {
    custom: [
      {
        name: TABLE_ACTION.EDIT,
        title: '<i class="ion-edit" title="Edit" ></i>'
      },
      {
        name: TABLE_ACTION.DELETE,
        title: '<i class="far fa-trash-alt" title="delete"></i>'
      },
      {
        name: TABLE_ACTION.RESTORE,
        title: '<i class="far fa-window-restore" title="restore"></i>'
      },
    ],
    position: "right",
    add: false,
    edit: false,
    delete: false,
  }
}

const PARAMS = {
  accType: ACCOUNT_TYPE.EMPLOYER,
  searchType: 'active',
  location: '',
  orderNo: 1,
  page: 0,
  pageSize: 10,
  name: '',
  companyId: ''
}