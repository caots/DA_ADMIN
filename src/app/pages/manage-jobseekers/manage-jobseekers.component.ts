import { NbMenuService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

import { MESSAGE } from '../../constants/message';
import { TYPE_SORTED, PAGING, ACCOUNT_TYPE, STORAGE_KEY } from '../../constants/config'
import { JobSeeker } from './../../interfaces/jobSeeker';
import { PaginationConfig } from '../../interfaces/paginationConfig';
import { ApiService } from '../../services/api.service'
import { HelperService } from '../../services/helper.service';
import { JobSeekerService } from './../../services/jobSeeker.service';

@Component({
  selector: 'ngx-manage-jobseekers',
  templateUrl: './manage-jobseekers.component.html',
  styleUrls: ['./manage-jobseekers.component.scss']
})

export class ManageJobseekersComponent implements OnInit {
  isLoading: boolean = true;
  isShowFilter: boolean = false;
  orderBy: string = TYPE_SORTED.LATEST;
  listTab = LIST_TAB;
  paramsService: Object = PARAMS;
  source: LocalDataSource = new LocalDataSource();
  paginationConfig: PaginationConfig;
  textSearchJobseeker: string;
  statusJobSeeker: string = this.listTab[0].id;
  listJobSeekers: JobSeeker[] = [];
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

  itemsFilter: Array<Object> = [
    { title: TYPE_SORTED.LATEST },
    { title: TYPE_SORTED.OLDEST },
    { title: TYPE_SORTED.A_Z },
    { title: TYPE_SORTED.Z_A },
  ];

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private nbMenuService: NbMenuService,
    private jobSeekerService: JobSeekerService,
    private helperService: HelperService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    let stringPermission = localStorage.getItem(STORAGE_KEY.ADMIN_PERMISSION)?.substring(0, localStorage.getItem(STORAGE_KEY.ADMIN_PERMISSION).length - 1)
    this.adminPermission = stringPermission?.substring(1)?.split(",")
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.status) {
        this.statusJobSeeker = params.status;
      } else {
        this.statusJobSeeker = this.listTab[0].id;
      }
    })

    this.paramsService = Object.assign({}, this.paramsService,
      { page: 0 },
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusJobSeeker ? this.statusJobSeeker : '' },
      { orderNo: this.sortUpdate() }
    )

    this.jobSeekerService.getTotalJobseeker().then(resTotal => {
      this.listTab.forEach(tab => {
        const found = resTotal.find(total => tab.id == total.id);
        if (found) {
          tab['total'] = found.total;
        }
      })
    })

    this.getDataMaster();
    this.getListJobSeekers(this.paramsService);
    // sort content menu
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'filter-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => this.changeSortType(title));
  }

  sortUpdate() {
    switch (this.orderBy) {
      case TYPE_SORTED.LATEST:
        return 0;
      case TYPE_SORTED.OLDEST:
        return 1;
      case TYPE_SORTED.A_Z:
        return 2;
      case TYPE_SORTED.Z_A:
        return 3;
    }
  }

  addClassRemoveItem() {
    if (this.listJobSeekers) {
      this.listJobSeekers.map((job, index) => {
        if (job.is_deleted === 1) {
          setTimeout(() => {
            document.getElementsByTagName('tr')[index + 1].className = "ng2-smart-row ng-star-inserted is-deleted";
          }, 100)
        } else {
          setTimeout(() => {
            document.getElementsByTagName('tr')[index + 1].className = "ng2-smart-row ng-star-inserted";
          }, 100)
        }
      })
    }
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
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
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusJobSeeker ? this.statusJobSeeker : '' },
      { orderNo: this.sortUpdate() }
    )
    this.getListJobSeekers(this.paramsService);
  }

  getListJobSeekers(params) {
    this.isLoading = true;
    const getListJobSeekerSubscrition = this.jobSeekerService.getListJobSeeker(params).subscribe(
      data => {
        this.isLoading = false;
        this.listJobSeekers = data.listJobseeker;
        this.paginationConfig.totalRecord = data.total;
        this.source.load(this.listJobSeekers);
        this.addClassRemoveItem();
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getListJobSeekerSubscrition);
  }

  restoreJobseekerById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 0) {
        this.helperService.showSuccess("The data still exists");
        return;
      };
    }
    const restoreJobPostingsSubscrition = this.jobSeekerService.deletesJobseeker(data, 'restore').subscribe(
      data => {
        this.getListJobSeekers(Object.assign({}, PARAMS, { searchType: this.statusJobSeeker }));
        this.isShowBtnRestoreAll = false;
        this.helperService.showSuccess(MESSAGE.RESTORE_JOB_POSTING_SUCCESS);
      },
      error => {
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(restoreJobPostingsSubscrition);
  }

  deleteJobseekerById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 1) {
        this.helperService.showSuccess("Data has been deleted");
        return;
      };
    }
    const deleteEmployerSubscrition = this.jobSeekerService.deletesJobseeker(data, 'delete').subscribe(
      data => {
        this.getListJobSeekers(Object.assign({}, PARAMS, { searchType: this.statusJobSeeker }));
        this.isShowBtnDeleteAll = false;
        this.helperService.showSuccess(MESSAGE.DELETE_JOBSEEKER_SUCCESS);
      },
      error => {
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(deleteEmployerSubscrition);
  }

  paginationEmployer(page) {
    this.paginationConfig.currentPage = page;
    this.paramsService = Object.assign({}, this.paramsService,
      { page: this.paginationConfig.currentPage },
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusJobSeeker ? this.statusJobSeeker : '' },
      { orderNo: this.sortUpdate() }
    )
    this.getListJobSeekers(this.paramsService);
  }

  onCustomAction(event) {
    switch (event.action) {
      case this.actionTable.EDIT:
        this.onEditJobSeeker(event.data, 'edit', this.statusJobSeeker);
        break;
      case this.actionTable.DELETE:
        this.deleteUser = event.data;
        this.onConfirmDeleteJobSeeker(0, this.deleteUser);
        break;
      case this.actionTable.RESTORE:
        this.restoreUser = event.data;
        this.onConfirmRestoreJobseeker(0, this.restoreUser);
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
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusJobSeeker ? this.statusJobSeeker : '' },
      { orderNo: this.sortUpdate() }
    )
    this.getListJobSeekers(this.paramsService);
  }

  searchEnterData(e) {
    console.log(this.textSearchJobseeker);
    this.getListJobSeekers(Object.assign({}, this.paramsService,
      { orderNo: 0 },
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' })
    );
  }

  changeSortType(type) {
    this.orderBy = type === this.orderBy ? '' : type;
    this.paramsService = Object.assign({}, this.paramsService,
      { page: 0 },
      { name: this.textSearchJobseeker ? this.textSearchJobseeker : '' },
      { location: this.selectLocation ? this.selectLocation : '' },
      { searchType: this.statusJobSeeker ? this.statusJobSeeker : '' },
      { orderNo: this.sortUpdate() }
    )
    if (this.orderBy === '') {
      this.paramsService = Object.assign({}, this.paramsService, { orderNo: 0 });
    }
    this.getListJobSeekers(this.paramsService);
  }

  onMessageJobseeker(jobseeker) {
    console.log(jobseeker);
    if (jobseeker.chat_group_id) {
      this.router.navigate(['/pages/messages'], {
        queryParams: {
          groupId: jobseeker.chat_group_id, isGroup: 0, q: `${jobseeker.fullname}`,
        }
      })
    }
  }

  onSelectedRowAction(event) {
    let totalJobIsDelete = event.selected.filter(e => e.is_deleted === 0);
    let totalJobIsRestore = event.selected.filter(e => e.is_deleted === 1)
    this.isShowBtnDeleteAll = totalJobIsDelete.length > 0;
    this.isShowBtnRestoreAll = totalJobIsRestore.length > 0;
    this.deleteUser = totalJobIsDelete;
    this.restoreUser = totalJobIsRestore;
  }

  onEditJobSeeker(data, type, tab) {
    this.router.navigate(['/pages/jobseeker-details'], {
      queryParams: { id: data.id, type: type, tab: tab }
    })
  }

  deleteAll() {
    this.onConfirmDeleteJobSeeker(1, this.deleteUser);
  }

  restoreAll() {
    this.onConfirmRestoreJobseeker(1, this.restoreUser);
  }

  async onConfirmDeleteJobSeeker(type, data) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DELETE_JOBSEEKER);
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.deleteJobseekerById(arrsId, data);
      } else {
        data.map(user => {
          arrsId.push(user.id);
        })
        this.deleteJobseekerById(arrsId, undefined);
      }
    }
  }

  async onConfirmRestoreJobseeker(type, data) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_RESTORE_JOBSEEKERS);
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.restoreJobseekerById(arrsId, data);
      } else {
        data.map(user => {
          arrsId.push(user.id);
        })
        this.restoreJobseekerById(arrsId, undefined);
      }
    }
  }

  onSelectStatusJobSeeker(status) {
    this.router.navigate([], {
      queryParams: {
        status
      }
    })

    this.statusJobSeeker = status;
    this.paramsService = Object.assign({}, PARAMS, { searchType: status },)
    this.getListJobSeekers(this.paramsService);
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
  NOTE: 'noteAction',
  RESTORE: 'restoreAction',
}

const TABLE_SETTING = {
  selectMode: 'multi',
  columns: {
    fullname: {
      title: 'Jobseeker Name',
      filter: false
    },
    city_name: {
      title: 'City',
      filter: false
    },
    state_name: {
      title: 'State',
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
        title: '<i class="ion-edit" title="Edit"></i>'
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
  accType: 1,
  searchType: 'active',
  location: '',
  orderNo: 0,
  page: 0,
  pageSize: 10,
  name: ''
}
