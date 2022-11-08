import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';

import { MESSAGE } from '../../constants/message';
import { PAGING, JOB_STATUS } from '../../constants/config'
import { JobPostings } from './../../interfaces/jobPostings';
import { PaginationConfig } from '../../interfaces/paginationConfig';
import { HelperService } from '../../services/helper.service';
import { ApiService } from '../../services/api.service';
import { JobPostingsService } from 'app/services/job-postings.service';

@Component({
  selector: "ngx-manage-job-postings",
  templateUrl: "./manage-job-postings.component.html",
  styleUrls: ["./manage-job-postings.component.scss"],
})
export class ManageJobPostingsComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = true;
  listJobPostings: JobPostings[] = [];
  isShowBtnDeleteAll: boolean = false;
  isShowBtnRestoreAll: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  listTab = LIST_TAB;
  textSearchJobPostings: string;
  companyIds: Array<number>;
  paramsService: Object = PARAMS;
  statusJobPostings: string;
  paginationConfig: PaginationConfig;
  settings: any = TABLE_SETTING;
  actionTable: any = TABLE_ACTION;
  deleteUser: any;
  restoreUser: any;
  subscriptions: Subscription[] = [];
  listCompany: any;
  filterTab = FILTER_TAB;
  filterTabUnpaid = FILTER_TAB_UNPAID;
  listFilterTabCallApi: Array<any> = [];

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private jobPostingsService: JobPostingsService,
    private helperService: HelperService,
    private apiService: ApiService,
    private elementRef: ElementRef
  ) { }

  ngAfterViewChecked() {
    Object.keys(listIcon).forEach((key) => {
      const listElements = this.elementRef.nativeElement.querySelectorAll(
        `.${key}`
      );
      for (let i = 0; i < listElements.length; i++) {
        if (listElements && !listElements[i].getElementsByTagName("svg")[0]) {
          listElements.forEach((element) => {
            element.insertAdjacentHTML("beforeend", listIcon[key]);
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM,
    };
    this.activeRoute.queryParams.subscribe((params) => {
      if (params && params.status) {
        this.statusJobPostings = params.status;
      } else {
        this.statusJobPostings = this.listTab[0].id;
      }
    });
    this.getListJobPostings(this.paramsService);
    this.getListcompany();

    this.jobPostingsService.getTotalJobPostings().then((resTotal) => {
      this.listTab.forEach((tab) => {
        let tabParams = tab.id == "active" ? "" : tab.id;
        const found = resTotal.find((total) => tabParams == total.id);
        if (found) {
          tab.total = found.total;
        }
      });
    });
  }

  changeTab(e, tab) {
    if (e.target.checked) {
      this.listFilterTabCallApi = this.listFilterTabCallApi.concat(tab.callApi);
    } else {
      let index = this.listFilterTabCallApi.findIndex((x) => x == tab.callApi);
      if (index > -1) {
        this.listFilterTabCallApi.splice(index, 1);
      }
    }
    this.paramsService = Object.assign({}, PARAMS, {
      jobType: this.listFilterTabCallApi.toString(),
    });
    this.getListJobPostings(this.paramsService);
  }

  getListcompany() {
    const getListCompanySubscrition = this.apiService.getAllCompany().subscribe(
      (data) => {
        this.listCompany = data.filter((x) => x.company_name !== null);
      },
      (error) => {
        this.helperService.showError(error);
      }
    );
    this.subscriptions.push(getListCompanySubscrition);
  }

  addClassRemoveItem() {
    if (this.listJobPostings) {
      this.listJobPostings.map((job, index) => {
        setTimeout(() => {
          document
            .getElementsByTagName("tr")
          [index + 1].getElementsByTagName("td")[1]
            .getElementsByTagName("ng2-smart-table-cell")[0]
            .getElementsByTagName("table-cell-view-mode")[0]
            .getElementsByTagName("div")[0]
            .getElementsByTagName("div")[0].className = "job-posting-title";
        }, 100);

        if (job.is_deleted === 1) {
          setTimeout(() => {
            document.getElementsByTagName("tr")[index + 1].className =
              "ng2-smart-row ng-star-inserted is-deleted";
          }, 100);
        } else {
          setTimeout(() => {
            document.getElementsByTagName("tr")[index + 1].className =
              "ng2-smart-row ng-star-inserted";
          }, 100);
        }
      });
    }
  }

  getListJobPostings(params) {
    if (params.searchType === "active") params.searchType = "";
    this.isLoading = true;
    const getListJobPostingsSubscrition = this.jobPostingsService
      .getListJobPostings(params)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.listJobPostings = data.listJobPostings;
          this.listJobPostings.map((job) => {
            job.statusMess = this.onShowStatusJobPosting(job.status);
            this.checkIconHide(job);
          });
          this.paginationConfig.totalRecord = data.total;
          this.source.load(this.listJobPostings);
          this.addClassRemoveItem();
        },
        (error) => {
          this.isLoading = false;
          this.helperService.showError(error);
        }
      );
    this.subscriptions.push(getListJobPostingsSubscrition);
  }

  checkIconHide(job) {
    job.title = `
      ${job.title}
      ${job.add_urgent_hiring_badge ? svgUrgentContainer : ""}
      ${job.is_private ? svgPrivateContainer : ""}
      ${job.is_make_featured ? svgFeatureContainer : ""}
    `;
  }

  onSelectStatusJobPostings(status) {
    this.router.navigate([], {
      queryParams: {
        status,
      },
    });
    this.paramsService = Object.assign({}, PARAMS, { searchType: status });
    this.companyIds = [];
    this.textSearchJobPostings = "";
    let textsearch: any = document.getElementById("txt-search-input");
    textsearch.value = "";
    this.statusJobPostings = status;
    this.getListJobPostings(this.paramsService);
  }

  searchEnterData(e) {
    this.getListJobPostings(
      Object.assign(
        {},
        this.paramsService,
        { page: 0 },
        { q: this.textSearchJobPostings ? this.textSearchJobPostings : "" },
        { searchType: this.statusJobPostings ? this.statusJobPostings : "" },
        { companyIds: this.companyIds ? this.companyIds : "" }
      )
    );
    this.getListJobPostings(this.paramsService);
  }

  onChangeSelectedCompany($event) {
    this.companyIds = $event;
  }

  searchData() {
    this.paramsService = Object.assign(
      {},
      this.paramsService,
      { page: 0 },
      { q: this.textSearchJobPostings ? this.textSearchJobPostings : "" },
      { companyIds: this.companyIds ? this.companyIds : "" },
      { searchType: this.statusJobPostings ? this.statusJobPostings : "" }
    );
    this.getListJobPostings(this.paramsService);
  }

  onCustomAction(event) {
    switch (event.action) {
      case this.actionTable.RESTORE:
        this.restoreUser = event.data;
        this.onConfirmRestoreJobPosting(0, this.restoreUser);
        break;
      case this.actionTable.PREVIEW:
        this.onEditJobPostings(event.data, "preview", this.statusJobPostings);
        break;
      case this.actionTable.DELETE:
        this.deleteUser = event.data;
        this.onConfirmDeleteJobPosting(0, this.deleteUser);
        break;
      default:
        break;
    }
  }

  onEditJobPostings(data, type, tab) {
    this.router.navigate(["/pages/job-postings-details"], {
      queryParams: {
        id: data.id,
        type: type,
        tab: tab,
      },
    });
  }

  onSelectedRowAction(event) {
    let totalJobIsDelete = event.selected.filter((e) => e.is_deleted === 0);
    let totalJobIsRestore = event.selected.filter((e) => e.is_deleted === 1);
    this.isShowBtnDeleteAll = totalJobIsDelete.length > 0;
    this.isShowBtnRestoreAll = totalJobIsRestore.length > 0;
    this.deleteUser = totalJobIsDelete;
    this.restoreUser = totalJobIsRestore;
  }

  paginationEmployer(page) {
    this.paginationConfig.currentPage = page;
    this.paramsService = Object.assign(
      {},
      this.paramsService,
      { page: this.paginationConfig.currentPage },
      { q: this.textSearchJobPostings ? this.textSearchJobPostings : "" },
      { companyIds: this.companyIds ? this.companyIds : "" },
      { searchType: this.statusJobPostings ? this.statusJobPostings : "" }
    );
    this.getListJobPostings(this.paramsService);
  }

  deleteAll() {
    this.onConfirmDeleteJobPosting(1, this.deleteUser);
  }

  restoreAll() {
    this.onConfirmRestoreJobPosting(1, this.restoreUser);
  }

  async onConfirmDeleteJobPosting(type, data) {
    const isConfirm = await this.helperService.confirmPopup(
      MESSAGE.TITLE_CONFIRM_DELETE_JOB_POSTINGS
    );
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.deleteJobPostingsById(arrsId, data);
      } else {
        data.map((user) => {
          arrsId.push(user.id);
        });
        this.deleteJobPostingsById(arrsId, undefined);
      }
    }
  }

  async onConfirmRestoreJobPosting(type, data) {
    const isConfirm = await this.helperService.confirmPopup(
      MESSAGE.TITLE_CONFIRM_RESTORE_JOB_POSTINGS
    );
    if (isConfirm && data) {
      let arrsId = [];
      if (type === 0) {
        arrsId.push(data.id);
        this.restoreJobPostingsById(arrsId, data);
      } else {
        data.map((user) => {
          arrsId.push(user.id);
        });
        this.restoreJobPostingsById(arrsId, undefined);
      }
    }
  }

  deleteJobPostingsById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 1) {
        this.helperService.showSuccess("Data has been deleted");
        return;
      }
    }
    const deleteJobPostingsSubscrition = this.jobPostingsService
      .deletesJobPostings(data)
      .subscribe(
        (data) => {
          this.getListJobPostings(
            Object.assign({}, PARAMS, { searchType: this.statusJobPostings })
          );
          this.isShowBtnDeleteAll = false;
          this.helperService.showSuccess(MESSAGE.DELETE_JOB_POSTING_SUCCESS);
        },
        (error) => {
          this.helperService.showError(error);
        }
      );
    this.subscriptions.push(deleteJobPostingsSubscrition);
  }

  restoreJobPostingsById(data, type) {
    if (type !== undefined) {
      if (type.is_deleted === 0) {
        this.helperService.showSuccess("The data still exists");
        return;
      }
    }
    const restoreJobPostingsSubscrition = this.jobPostingsService
      .restoreJobPostings(data)
      .subscribe(
        (data) => {
          this.getListJobPostings(
            Object.assign({}, PARAMS, { searchType: this.statusJobPostings })
          );
          this.isShowBtnRestoreAll = false;
          this.helperService.showSuccess(MESSAGE.RESTORE_JOB_POSTING_SUCCESS);
        },
        (error) => {
          this.helperService.showError(error);
        }
      );
    this.subscriptions.push(restoreJobPostingsSubscrition);
  }
  onShowStatusJobPosting(type) {
    switch (type) {
      case JOB_STATUS.Active:
        return "Paid";
      case JOB_STATUS.Closed:
        return "Closed";
      case JOB_STATUS.Draft:
        return "Draft";
      case JOB_STATUS.UnPaid:
        return "Unpaid";
      case JOB_STATUS.Inactive:
        return "Unactive";
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }
}

const FILTER_TAB = [
  {
    id: 0,
    name: 'Featured',
    callApi: 'featured'
  },
  {
    id: 1,
    name: 'Urgent',
    callApi: 'urgent'
  },
  {
    id: 2,
    name: 'Private',
    callApi: 'private'
  },
  {
    id: 3,
    name: 'Public',
    callApi: 'public'
  }
]

const FILTER_TAB_UNPAID = [
  {
    id: 2,
    name: 'Private',
    callApi: 'private'
  },
  {
    id: 3,
    name: 'Public',
    callApi: 'public'
  }
]

const LIST_TAB = [
  {
    id: 'active',
    name: 'Active',
    total: 0
  },
  {
    id: 'unpaid',
    name: 'Unpaid',
    total: 0
  },
  {
    id: 'expired',
    name: 'Expired',
    total: 0
  }
]

const TABLE_ACTION = {
  PREVIEW: 'previewAction',
  EDIT: 'editAction',
  DELETE: 'deleteAction',
  RESTORE: 'restoreAction',
  APPLICANT: 'applicantAction'
}

const TABLE_SETTING = {
  selectMode: 'multi',
  columns: {
    title: {
      title: 'Job Title',
      type: 'html',
      filter: false
    },
    fullname: {
      title: 'Employer Name',
      filter: false
    },
    employer_company_name: {
      title: 'Company Name',
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
    statusMess: {
      title: 'Payment Status',
      filter: false
    }
  },
  hideSubHeader: true,
  actions: {
    custom: [
      {
        name: TABLE_ACTION.PREVIEW,
        title: '<i class="ion-eye" title="Preview" ></i>'
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
  searchType: '',
  q: '',
  companyIds: [],
  page: 0,
  pageSize: 10,
  jobType: ''
}

const svgUrgentContainer = `<div class="urgent" #urgent>
</div>`

const svgPrivateContainer = `<div class="private" #private>
</div>`

const svgFeatureContainer = `<div class="feature" #feature>
</div>`

const svgUrgent = `
  <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 496.615 496.615" height="30"
    viewBox="0 0 496.615 496.615" width="30">
    <path d="m255.05 78.861h54.819v183.079h-54.819z" fill="#E19974" />
    <g>
      <g>
        <path d="m378.156 300.01c14.525 0 26.3 11.775 26.3 26.3s-11.775 26.3-26.3 26.3h-101.318v-52.6z"
          fill="#FFCEBF" />
      </g>
      <path d="m367.512 300.01c14.525 0 26.3-11.775 26.3-26.299 0-14.525-11.775-26.3-26.3-26.3h-67.966v52.599z"
        fill="#FFCEBF" />
      <g>
        <g id="XMLID_385_">
          <g>
            <path
              d="m286.82 328.399v125.91h-32.72-58.55c-28.69 0-53.17-18.03-62.72-43.38h-113.507c-2.829 0-5.123-2.294-5.123-5.123v-83.377-55.377c0-2.829 2.294-5.123 5.123-5.123h110.687c3.15 0 6.171-1.251 8.399-3.479l41.525-41.525c10.332-10.332 24.345-16.136 38.956-16.136h67.93z"
              fill="#FFDFCF" />
          </g>
        </g>
      </g>
      <path
        d="m195.55 392.07c-22.235 0-41.941-10.829-54.128-27.503-7.39-10.109-19.335-15.878-31.857-15.878h-90.242c-2.829 0-5.123-2.294-5.123-5.123v62.239c0 2.829 2.294 5.123 5.123 5.123h113.507c9.55 25.35 34.03 43.38 62.72 43.38h58.55 32.72v-62.238h-32.72z"
        fill="#FFCEBF" />
      <path
        d="m255.05 473.56c0 12.733 10.322 23.055 23.055 23.055h8.709c12.733 0 23.055-10.322 23.055-23.055v-13.756-183.105h-54.819z"
        fill="#E19974" />
      <path
        d="m255.05 340.018c4.458-1.21 8.738-2.854 12.793-4.885 1.548 5.957 4.209 11.554 7.836 16.578-5.567 7.642-8.864 17.04-8.864 27.198 0 9.763 3.045 18.824 8.225 26.299-5.179 7.476-8.225 16.537-8.225 26.3 0 24.312 18.839 44.292 42.684 46.145.238-1.329.369-2.695.369-4.093v-13.756-183.105h-54.818z"
        fill="#DC8758" />
      <path
        d="m286.23 273.109c0 27.24-22.09 49.32-49.33 49.32h-29.38-193.32v-54.58c0-3.27 2.651-5.92 5.92-5.92h109.89c3.15 0 6.171-1.251 8.399-3.479l41.525-41.525c10.332-10.332 24.345-16.136 38.956-16.136h86.87c22.55 0 40.83 18.28 40.83 40.83v80.206c0 16.511-13.008 30.422-29.515 30.777-8.604.185-16.4-3.228-22.005-8.833-5.46-5.46-8.84-13.01-8.84-21.34z"
        fill="#FFDFCF" />
      <path d="m255.05 78.861h54.819v81.964h-54.819z" fill="#DC8758" />
      <path
        d="m470.824 135.825h-374.728c-6.401 0-11.591-5.189-11.591-11.591v-112.643c0-6.402 5.19-11.591 11.591-11.591h374.728c6.401 0 11.591 5.189 11.591 11.591v112.644c0 6.401-5.19 11.59-11.591 11.59z"
        fill="#FAF7F7" />
      <path
        d="m205.501 124.234v-112.643c0-6.402 5.189-11.591 11.591-11.591h-120.996c-6.402 0-11.591 5.189-11.591 11.591v112.644c0 6.401 5.189 11.591 11.591 11.591h120.995c-6.401-.001-11.59-5.19-11.59-11.592z"
        fill="#F3EAE6" />
      <g fill="#FE646F">
        <path
          d="m193.131 27.533c-4.143 0-7.5 3.358-7.5 7.5v25.87h-20.606v-25.87c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v66.739c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-25.87h20.606v25.87c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-66.739c0-4.142-3.358-7.5-7.5-7.5z" />
        <path
          d="m251.346 42.533c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-28.672c-4.143 0-7.5 3.358-7.5 7.5v66.739c0 4.142 3.357 7.5 7.5 7.5h28.672c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-21.172v-18.37h13.398c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-13.398v-18.37h21.172z" />
        <path
          d="m308.712 94.273h-20.439v-59.24c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v66.739c0 4.142 3.357 7.5 7.5 7.5h27.939c4.143 0 7.5-3.358 7.5-7.5s-3.358-7.499-7.5-7.499z" />
        <path
          d="m351.305 27.533h-13.207c-5.768 0-10.46 4.692-10.46 10.459v63.78c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-20.36h8.667c14.855 0 26.94-12.085 26.94-26.94s-12.084-26.939-26.94-26.939zm0 38.88h-8.667v-23.88h8.667c6.584 0 11.94 5.356 11.94 11.939s-5.356 11.941-11.94 11.941z" />
        <path
          d="m413.061 87.041c-4.143 0-7.5 3.358-7.5 7.5v7.231c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-7.231c0-4.142-3.357-7.5-7.5-7.5z" />
        <path
          d="m413.061 27.533c-4.143 0-7.5 3.358-7.5 7.5v30.715c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-30.715c0-4.142-3.357-7.5-7.5-7.5z" />
      </g>
    </g>
    <path
      d="m313.115 457.808h37.967c14.525 0 26.3-11.775 26.3-26.3 0-14.525-11.775-26.3-26.3-26.3h-37.967c-14.525 0-26.3 11.775-26.3 26.3.001 14.525 11.775 26.3 26.3 26.3z"
      fill="#FFDFCF" />
    <path
      d="m313.115 405.208h45.657c14.525 0 26.3-11.775 26.3-26.3 0-14.525-11.775-26.3-26.3-26.3h-45.657c-14.525 0-26.3 11.775-26.3 26.3.001 14.526 11.775 26.3 26.3 26.3z"
      fill="#FFDFCF" />
    <g fill="#FFCEBF">
      <path
        d="m306.43 451.123c0-14.525 11.775-26.3 26.3-26.3h37.967c2.062 0 4.075.251 6.001.7-2.713-11.637-13.153-20.315-25.616-20.315h-37.967c-14.525 0-26.3 11.775-26.3 26.3 0 12.463 8.675 22.902 20.311 25.615-.448-1.926-.696-3.938-.696-6z" />
      <path
        d="m306.43 398.523c0-14.525 11.775-26.3 26.3-26.3h45.656c2.062 0 4.076.253 6.001.702-2.713-11.637-13.153-20.316-25.616-20.316h-45.657c-14.525 0-26.3 11.775-26.3 26.3 0 12.463 8.676 22.902 20.313 25.615-.448-1.926-.697-3.939-.697-6.001z" />
    </g>
  </svg>
`

const svgPrivate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1"
  x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" width="30" height="30"
  xml:space="preserve">
  <g>
    <g>
      <path
        d="M469.577,205.289c-33.016,33.018-77.932,51.211-124.632,51.211h-177.89c-46.699,0-91.615-18.193-124.633-51.211L0,247.711    C44.355,292.065,104.345,316.5,167.069,316.5H344.93c62.725,0,122.714-24.434,167.069-68.789L469.577,205.289z" />
    </g>
  </g>
  <g>
    <g>
      <path
        d="M451,406.5v-30H271v30h-30v-30H61v30H31v30h35.53c12.424,34.845,45.412,60,84.47,60s72.048-25.155,84.472-60h41.058    c12.424,34.845,45.412,60,84.47,60c39.058,0,72.048-25.155,84.472-60H481v-30H451z" />
    </g>
  </g>
  <g>
    <g>
      <path
        d="M316,15.5h-15v15c0,24.814-20.186,45-45,45c-24.814,0-45-20.186-45-45v-15h-15c-41.353,0-75,33.647-75,75v76h270v-76    C391,49.146,357.353,15.5,316,15.5z" />
    </g>
  </g>
  <g>
    <g>
      <path
        d="M121,196.5v21.892c14.713,4.942,30.082,8.108,46.055,8.108h177.891c15.972,0,31.342-3.166,46.055-8.108V196.5H121z" />
    </g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
</svg>
`

const svgFeature = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve" width="30" height="30">
  <path style="fill:#FFDC64;" d="M452.71,157.937l-133.741-12.404L265.843,22.17c-3.72-8.638-15.967-8.638-19.686,0l-53.126,123.362  L59.29,157.937c-9.365,0.868-13.149,12.516-6.084,18.723l100.908,88.646l-29.531,131.029c-2.068,9.175,7.841,16.373,15.927,11.572  L256,339.331l115.49,68.576c8.087,4.802,17.994-2.397,15.927-11.572l-29.532-131.029l100.909-88.646  C465.859,170.453,462.074,158.805,452.71,157.937z"/>
  <g>
    <path style="fill:#FFF082;" d="M119.278,17.923c6.818,9.47,26.062,50.14,37.064,73.842c1.73,3.726-2.945,7.092-5.93,4.269   C131.425,78.082,98.96,46.93,92.142,37.459c-5.395-7.493-3.694-17.941,3.8-23.336C103.435,8.728,113.883,10.43,119.278,17.923z"/>
    <path style="fill:#FFF082;" d="M392.722,17.923c-6.818,9.47-26.062,50.14-37.064,73.842c-1.73,3.726,2.945,7.092,5.93,4.269   c18.987-17.952,51.451-49.105,58.27-58.575c5.395-7.493,3.694-17.941-3.8-23.336C408.565,8.728,398.117,10.43,392.722,17.923z"/>
    <path style="fill:#FFF082;" d="M500.461,295.629c-11.094-3.618-55.689-9.595-81.612-12.875c-4.075-0.516-5.861,4.961-2.266,6.947   c22.873,12.635,62.416,34.099,73.51,37.717c8.778,2.863,18.215-1.932,21.078-10.711   C514.034,307.928,509.239,298.492,500.461,295.629z"/>
    <path style="fill:#FFF082;" d="M11.539,295.629c11.094-3.618,55.689-9.595,81.612-12.875c4.075-0.516,5.861,4.961,2.266,6.947   c-22.873,12.635-62.416,34.099-73.51,37.717c-8.778,2.863-18.215-1.932-21.078-10.711S2.761,298.492,11.539,295.629z"/>
    <path style="fill:#FFF082;" d="M239.794,484.31c0-11.669,8.145-55.919,13.065-81.582c0.773-4.034,6.534-4.034,7.307,0   c4.92,25.663,13.065,69.913,13.065,81.582c0,9.233-7.485,16.718-16.718,16.718C247.279,501.029,239.794,493.543,239.794,484.31z"/>
  </g>
  <path style="fill:#FFC850;" d="M285.161,67.03l-19.319-44.86c-3.72-8.638-15.967-8.638-19.686,0L193.03,145.532L59.29,157.937  c-9.365,0.868-13.149,12.516-6.084,18.723l100.908,88.646l-29.531,131.029c-2.068,9.175,7.841,16.373,15.927,11.572l15.371-9.127  C181.08,235.66,251.922,115.918,285.161,67.03z"/>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
</svg>
`

const listIcon = {
  urgent: svgUrgent,
  private: svgPrivate,
  feature: svgFeature
}
