import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import UsStates from "us-state-codes";

import { JOB_BONUS, JOB_NUMBER_OPENING_RANGE, JOB_SCHEDULE, JOB_STATUS, PERCENT_TRAVEL, BONUS, SCHEDULE_JOB, BENEFITS, SALARY_TYPE, OTHER_OPTION, EMPLOYMENT_TYPE, PROPOSED_TYPE, JOB_PERCENT_TRAVEL_TYPE } from '../../../constants/config'
import { MESSAGE } from '../../../constants/message';
import { HelperService } from 'app/services/helper.service';
import { JobPostingsService } from 'app/services/job-postings.service';
import { JobPostings } from 'app/interfaces/jobPostings';
import { Assesment } from 'app/interfaces/assesment';
import { JobLevel } from 'app/interfaces/jobLevel';
import { JobCategory } from 'app/interfaces/jobCategory';
import { BillingService } from '../../../services/billing.service';


@Component({
  selector: 'ngx-job-postings-details',
  templateUrl: './job-postings-details.component.html',
  styleUrls: ['./job-postings-details.component.scss']
})
export class JobPostingsDetailsComponent implements OnInit {
  formDetailsJobPostings: FormGroup;
  isLoading: boolean = true;
  jobPostingId: string;
  isPreview: boolean;
  statusUser: number;
  editingAssessment: Assesment;
  tab: string;
  listCountry: Array<string> = [];
  listState: Array<string> = [];
  listCityStore: any[] = [];
  listCity: Array<any> = [];
  isSubmit: boolean = false;
  listJobCategory: Array<string> = [];
  jobPosting: JobPostings;
  messageValidateAssessment: string;
  subscriptions: Subscription[] = [];
  openingNumberRange = JOB_NUMBER_OPENING_RANGE;
  listLevel: Array<JobLevel> = [];
  listCategory: Array<JobCategory> = [];
  listAssessment: Array<Assesment> = [];
  listAssessmentByCategory: Array<Assesment> = [];
  listSelectedAssesment: Array<Assesment> = [];
  modalEditAssessmentTagRef: NgbModalRef;
  modalAddAssessmentTagRef: NgbModalRef;
  modalCopyJobTemplateRef: NgbModalRef;
  listBonus = BONUS;
  listSchedule = SCHEDULE_JOB;
  listBenefits = BENEFITS;
  listBonusCallApi: any[] = [];
  listScheduleCallApi: any[] = [];
  listBenefitsCallApi: any[] = [];
  listSalaryType = SALARY_TYPE;
  salaryType: any;
  isHiring: boolean = false;
  optionPercentTravel: any;
  otherBonus: any;
  otherSchedule: any;
  defaultSpecificPercentTravel: number;
  fromDateModel: any;
  otherOption = OTHER_OPTION;
  isPercent: any;
  isSalary: any;
  typeEmployment = EMPLOYMENT_TYPE;
  typeProposed = PROPOSED_TYPE;
  JOB_STATUS = JOB_STATUS;
  JOB_PERCENT_TRAVEL_TYPE = JOB_PERCENT_TRAVEL_TYPE;
  isTypeProposed: number = 0;
  isSpecificPercentTravel: any;
  warningSalary: string = "";
  isFromCrawlJob: string;
  fromPageJob: string;
  listFallUnder: any[];
  isDisableSelectDC: boolean = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private jobPostingsService: JobPostingsService,
    private helperService: HelperService,
    private billingService: BillingService
  ) { }

  ngOnInit(): void {
    this.jobPostingsService.getAllFallUnder().subscribe(listFallUnder => {
      this.listFallUnder = listFallUnder;
      this.listFallUnder.sort(function (a, b) { return a.localeCompare(b) });
    });
    this.listBonus = this.listBonus.map(bonus => {
      bonus.isSelected = false;
      return bonus;
    })
    this.listBenefits = this.listBenefits.map(benefit => {
      benefit.isSelected = false;
      return benefit;
    })
    this.listSchedule = this.listSchedule.map(schedule => {
      schedule.isSelected = false;
      return schedule;
    })
    this.jobPostingId = this.activeRoute.snapshot.queryParamMap.get('id');
    this.getDetailsJobPostings(this.jobPostingId);
    this.isPreview = this.activeRoute.snapshot.queryParamMap.get('type') === 'preview';
    this.tab = this.activeRoute.snapshot.queryParamMap.get('tab');
    this.isFromCrawlJob = this.activeRoute.snapshot.queryParamMap.get('fromCrawl');
    this.fromPageJob = this.activeRoute.snapshot.queryParamMap.get('fromPage');
    this.getDataMaster();
    this.initForm(undefined, true);
  }

  goToPreview(){
     this.router.navigate(['/pages/preview-job'], {
      queryParams: {
        id: this.jobPostingId
      }
    });
  }

  selectState(value) {
    const stateName = value;
    this.formDetailsJobPostings.get('city').setValue('');
    const index = this.listState.findIndex(state => state == stateName);
    if (index >= 0) {
      const code = UsStates.getStateCodeByStateName(this.listState[index]);
      this.listCity = this.listCityStore.filter(res => res.adminCode == code);
    }
    if(this.formDetailsJobPostings.get('state').value == 'District Of Columbia'){
      this.isDisableSelectDC = true;
      this.formDetailsJobPostings.get('city').setValue('Washington');
    }else{
      this.isDisableSelectDC = false;
    }
  }

  getDataCity(code = '') {
    this.listCityStore = [];
    this.jobPostingsService.getAllCity().subscribe(listCity => {
      this.listCityStore = listCity;
      this.getDataState();
    });
  }

  getDataState() {
    this.jobPostingsService.getAllState().subscribe(listState => {
      this.listState = listState;
      const index = this.listState.findIndex(state => state == this.formDetailsJobPostings.get('state').value);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }

  change(e) {
    this.isHiring = e.target.checked
  }

  onItemChange(e) {
    this.optionPercentTravel = e;
  }

  initForm(jobPostingForm = undefined, isFirstCall = false) {
    let listSelectedAssesment = [];
    // if (jobPostingForm != undefined) {
    if (jobPostingForm) {
      this.jobPostingsService.getListAssessMent().subscribe(listAssessment => {
        this.listAssessment = listAssessment;
        this.listAssessment.forEach(assessment => {
          let existedAssessment = jobPostingForm.job_assessments.find(item => item.assessmentId == assessment.assessmentId);
          if (existedAssessment) {
            listSelectedAssesment.push({
              ...assessment,
              point: existedAssessment.point
            })
          }
        })
      }, err => {
        this.helperService.showError(err);
      })
    }
    this.listSelectedAssesment = listSelectedAssesment;
    this.listAssessmentByCategory = this.listAssessment.filter(ass => ass.categoryId === parseInt(jobPostingForm.jobs_category_ids));
    // }
    // isFromCrawlJob
    if (jobPostingForm && jobPostingForm.is_private != 1) {
      this.formDetailsJobPostings = this.fb.group({
        title: [jobPostingForm && jobPostingForm.title, [Validators.required]],
        salary: [jobPostingForm && jobPostingForm.salary],
        city: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.city_name] : [jobPostingForm && jobPostingForm.city_name, [Validators.required]],
        state: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.state_name] : [jobPostingForm && jobPostingForm.state_name, [Validators.required]],
        desciption: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.desciption] : [jobPostingForm && jobPostingForm.desciption, [Validators.required]],
        employment_type: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.employment_type] : [jobPostingForm && jobPostingForm.employment_type, [Validators.required]],
        level: [jobPostingForm && jobPostingForm.jobs_level_id],
        openings: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.nbr_open] : [jobPostingForm && jobPostingForm.nbr_open, [Validators.required, Validators.min(JOB_NUMBER_OPENING_RANGE.MIN), Validators.max(JOB_NUMBER_OPENING_RANGE.MAX)]],
        category: [jobPostingForm && jobPostingForm.jobs_category_ids],
        specificPercentTravelType: [jobPostingForm && jobPostingForm.specific_percent_travel_type],
        jobCategory: [jobPostingForm && jobPostingForm.job_fall_under],
        otherBonus: [''],
        otherSchedule: [''],
        percentTravel: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.percent_travel] : [jobPostingForm && jobPostingForm.percent_travel, [Validators.required]],
        dateExpiration: [''],
        salary_min: [jobPostingForm && jobPostingForm.salary_min],
        salary_max: [jobPostingForm && jobPostingForm.salary_max],
      })
      this.fromDateModel = jobPostingForm?.expired_at;
      this.isPercent = jobPostingForm?.percent_travel;
      this.isHiring = jobPostingForm?.add_urgent_hiring_badge;
    } else {
      this.formDetailsJobPostings = this.fb.group({
        title: [jobPostingForm && jobPostingForm.title, [Validators.required]],
        salary: [jobPostingForm && jobPostingForm.salary],
        city: [jobPostingForm && jobPostingForm.city_name],
        state: [jobPostingForm && jobPostingForm.state_name],
        desciption: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.desciption] : [jobPostingForm && jobPostingForm.desciption, [Validators.required]],
        employment_type: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.employment_type] : [jobPostingForm && jobPostingForm.employment_type, [Validators.required]],
        level: [jobPostingForm && jobPostingForm.jobs_level_id],
        openings: this.isFromCrawlJob ? [jobPostingForm && jobPostingForm.nbr_open] : [jobPostingForm && jobPostingForm.nbr_open, [Validators.min(JOB_NUMBER_OPENING_RANGE.MIN), Validators.max(JOB_NUMBER_OPENING_RANGE.MAX)]],
        category: [jobPostingForm && jobPostingForm.jobs_category_ids],
        specificPercentTravelType: [jobPostingForm && jobPostingForm.specific_percent_travel_type],
        jobCategory: [jobPostingForm && jobPostingForm.job_fall_under],
        otherBonus: [''],
        otherSchedule: [''],
        percentTravel: [jobPostingForm && jobPostingForm.percent_travel],
        dateExpiration: [''],
        salary_min: [jobPostingForm && jobPostingForm.salary_min],
        salary_max: [jobPostingForm && jobPostingForm.salary_max],
      })
      this.fromDateModel = jobPostingForm?.expired_at;
      this.isPercent = jobPostingForm?.percent_travel;
      this.isHiring = jobPostingForm?.add_urgent_hiring_badge;
      const jobFallUnder = jobPostingForm?.jobFallUnder || (this.listFallUnder && this.listFallUnder[0]);
      if (!this.formDetailsJobPostings.get('jobCategory').value) this.formDetailsJobPostings.get('jobCategory').setValue(jobFallUnder);
    }
    if(isFirstCall) this.getDataCity();
  }


  generateLinkPrivteJob(job: any) {
    if (job?.is_private == 1) {
      return this.jobPostingsService.generateLinkPrivateJob(job)
    }
    return '';
  }

  getDetailsJobPostings(jobPostingId) {
    this.isLoading = true;
    const getEmployerSubscrition = this.jobPostingsService.getJobPostingsById(jobPostingId).subscribe(
      data => {
        this.isLoading = false;
        this.jobPosting = data;
        this.isSalary = data?.salary_type;
        this.salaryType = data?.salary_type;
        this.isSpecificPercentTravel = data?.is_specific_percent_travel;
        this.listScheduleCallApi = data?.schedule_job ? JSON.parse(data.schedule_job) : [];
        this.isTypeProposed = data?.proposed_conpensation || 0
        // data old and data new
        // this.listBenefitsCallApi = JSON.parse(data.benefits);
        try {
          this.listBenefitsCallApi = data.benefits?.split(",").map(id => ({
            id: parseInt(id)
          }));
        } catch (error) {
          this.listBenefitsCallApi = []
          // expected output: ReferenceError: nonExistentFunction is not defined
          // Note - error messages will vary depending on browser
        }
        this.listBonusCallApi = data?.bonus ? JSON.parse(data.bonus) : [];
        if(data?.schedule_job) this.mapDataArray(this.listSchedule, JSON.parse(data.schedule_job));
        // data old and data new
        if(this.listBenefitsCallApi) this.mapDataArray(this.listBenefits, this.listBenefitsCallApi);
        if(data?.bonus) this.mapDataArray(this.listBonus, JSON.parse(data.bonus));
        this.statusUser = this.jobPosting.status === JOB_STATUS.Active ? JOB_STATUS.Inactive : JOB_STATUS.Active;
        this.initForm(data);
        this.listBonusCallApi?.length > 0 && this.listBonusCallApi.forEach(element => {
          if (element.id == JOB_BONUS.Other) {
            this.formDetailsJobPostings.get('otherBonus').setValue(element.title);
          }
        });
        this.listScheduleCallApi?.length > 0 && this.listScheduleCallApi.forEach(element => {
          if (element.id == JOB_SCHEDULE.Other) {
            this.formDetailsJobPostings.get('otherSchedule').setValue(element.title);
          }
        });
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getEmployerSubscrition);
  }

  changeSalaryType(e) {
    this.salaryType = e
  }

  mapDataArray(arrayOld, arrayBackend) {
    if (!arrayBackend || arrayBackend.length == 0) return arrayOld;
    arrayOld = arrayOld.map((elem) => {
      elem.isSelected = arrayBackend?.findIndex(x => x.id == elem.id) != -1;
      return elem
    });
  }

  deleteAddArray(array) {
    array?.map(e => { delete e.isSelected });
  }

  mapArrayToId(array) {
    return array?.map(e => e.id).join(",");
  }

  convertJobFormData(form) {
    this.listBonusCallApi?.length > 0 && this.listBonusCallApi.forEach(e => {
      if (e.id == JOB_BONUS.Other) {
        e.title = this.formDetailsJobPostings.get('otherBonus').value;
      }
    })

    this.listScheduleCallApi?.length > 0 && this.listScheduleCallApi.forEach(e => {
      if (e.id == JOB_SCHEDULE.Other) {
        e.title = this.formDetailsJobPostings.get('otherSchedule').value;
      }
    })
    this.listBenefitsCallApi = this.listBenefits.filter(e => e.isSelected);

    this.deleteAddArray(this.listBonusCallApi);
    this.deleteAddArray(this.listScheduleCallApi);
    this.listBenefitsCallApi = this.mapArrayToId(this.listBenefitsCallApi);
    let result = {
      title: form.get('title').value,
      salary: this.isTypeProposed == 0 && form.get('salary').value ? this.billingService.switchSalary(form.get('salary').value) : null,
      salary_min: this.isTypeProposed == 1 && form.get('salary_min').value ? this.billingService.switchSalary(form.get('salary_min').value) : null,
      salary_max: this.isTypeProposed == 1 && form.get('salary_max').value ? this.billingService.switchSalary(form.get('salary_max').value) : null,
      city_name: form.get('city').value,
      state_name: form.get('state').value,
      desciption: form.get('desciption').value || null,
      jobs_level_id: form.get('level').value ? form.get('level').value : null,
      employment_type: form.get('employment_type').value,
      nbr_open: form.get('openings').value,
      specific_percent_travel_type: form.get('specificPercentTravelType').value  || form.get('specificPercentTravelType').value >= 0 ? Number.parseInt(form.get('specificPercentTravelType').value) : "",
      jobs_category_ids: form.get('category').value || '0',
      expired_days: this.jobPosting.expired_days,
      assessments: this.listSelectedAssesment.map(assessment => {
        return {
          assessment_id: assessment.assessmentId,
          point: assessment.point,
          assessment_type: assessment.type
        }
      }),
      bonus: this.listBonusCallApi ? JSON.stringify(this.listBonusCallApi) : "",
      schedule_job: this.listScheduleCallApi ? JSON.stringify(this.listScheduleCallApi) : "",
      benefits: this.listBenefitsCallApi || null,
      salary_type: this.salaryType,
      add_urgent_hiring_badge: this.isHiring ? 1 : 0,
      percent_travel: form.get('percentTravel').value,
      job_fall_under: form.get('jobCategory').value || '',
      proposed_conpensation: this.isTypeProposed,
    }

    return result;
  }

  onSaveDetailsJobPosting() {
    this.isSubmit = true;
    this.helperService.markFormGroupTouched(this.formDetailsJobPostings);
    if (!this.checkValidMarkAssessment()
      || this.formDetailsJobPostings.invalid
      || !this.listSelectedAssesment
      || ((this.jobPosting.is_private != 1 && !this.isFromCrawlJob) && (!this.listScheduleCallApi || this.listScheduleCallApi?.length == 0))
      || (!this.isFromCrawlJob && this.checkSalary())) {
      return;
    }
    let data = this.convertJobFormData(this.formDetailsJobPostings);
    this.isLoading = true;
    this.jobPostingsService.updateJobPostings(this.jobPostingId, data).subscribe(res => {
      this.isLoading = false;
      this.isSubmit = false;
      if (this.isFromCrawlJob == '1') {
        this.helperService.showSuccess(MESSAGE.UPDATE_JOB_CRAWLS_SUCCESS);
      } else {
        this.helperService.showSuccess(MESSAGE.UPDATE_JOB_POSTING_SUCCESS);
      }
      this.ngOnInit();

    }, errorRes => {
      this.isLoading = false;
      this.isSubmit = false;
      this.helperService.showError(errorRes);
    })
  }

  showEditAssessment(assesment, modalEditAssessmentTag) {
    this.editingAssessment = assesment;
    this.modalEditAssessmentTagRef = this.modalService.open(modalEditAssessmentTag, {
      windowClass: 'modal-edit-assessment-tag'
    })
  }

  showModalCopyJobTemplate(modalCopyJobTemplate){
    this.modalCopyJobTemplateRef = this.modalService.open(modalCopyJobTemplate, {
      windowClass: 'modal-edit-assessment-tag'
    })
  }

  addAssessment(assessment) {
    if (!this.listSelectedAssesment.find(item => item.id == assessment.id)) {
      this.listSelectedAssesment.push({
        ...assessment,
      })
    }
  }

  addNewAssessment(modalAddAssessment) {
    this.modalAddAssessmentTagRef = this.modalService.open(modalAddAssessment, {
      windowClass: 'modal-add-new-job',
      size: 'lg'
    })
  }

  removeAssessment(assessment) {
    this.listSelectedAssesment = this.listSelectedAssesment.filter(item => item.id != assessment.id);
  }

  updateAssessment(assessment) {
    this.listSelectedAssesment.forEach(item => {
      if (item.id == assessment.id) {
        item.name = assessment.name;
        item.point = parseInt(assessment.point);
      }
    })

    this.modalEditAssessmentTagRef.close();
  }

  onChangeSelectCategory(value) {
    this.listAssessmentByCategory = this.listAssessment.filter(ass => ass.categoryId === parseInt(value));
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listCountry, query);
      })
    )
  }

  selectJobCategory = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listJobCategory, query);
      })
    )
  }

  onCancelDetailsJobPosting() {
    if (this.isFromCrawlJob == '1') {
      this.router.navigate(['/pages/manage-job-crawl'], {
        queryParams: {
          status: this.tab,
          fromPage: this.fromPageJob
        }
      });
    } else {
      this.router.navigate(['/pages/manage-job-postings'], {
        queryParams: {
          status: this.tab
        }
      });
    }
  }


  async onConfirmDeactivejobPosting() {
    let isConfirm;
    if (this.jobPosting && this.statusUser === JOB_STATUS.Active) {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_ACTIVATE_EMPLOYER);
    } else {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DEACTIVE_JOBPOSTING);
    }

    if (isConfirm) {
      this.changeStatusJobPosting(this.jobPostingId, this.statusUser);
    }
  }

  changeStatusJobPosting(id, status) {
    // this.isLoading = true;
    // const getchangeStatusSubscrition = this.jobPostingsService.changeStatusJobPosting(id, status).subscribe(
    //   data => {
    //     this.statusUser = data.status === 1 ? 2 : 1;
    //     this.helperService.showSuccess(`${status === 1 ? 'Activate' : 'Deactivate'} Employer successfully`);
    //     this.isLoading = false;
    //   },
    //   error => {
    //     this.isLoading = false;
    //     this.helperService.showError(error);
    //   }
    // )
    // this.subscriptions.push(getchangeStatusSubscrition);
  }

  getDataMaster() {
    // this.jobPostingsService.getListAssessMent().subscribe(listAssessment => {
    //   this.listAssessment = listAssessment;
    // }, err => {
    //   this.helperService.showError(err);
    // })

    this.jobPostingsService.getListCategory().subscribe((listCategory: JobCategory[]) => {
      this.listCategory = listCategory;
    }, err => {
      this.helperService.showError(err);
    })

    this.jobPostingsService.getListJobLevel().subscribe((listLevel: JobLevel[]) => {
      this.listLevel = listLevel;
    }, err => {
      this.helperService.showError(err);
    })

    this.jobPostingsService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })

    this.jobPostingsService.getAllState().subscribe(listState => {
      this.listState = listState;
    })

    this.jobPostingsService.getAllJobCategory().subscribe(listJobCategory => {
      this.listJobCategory = listJobCategory;
    })
  }

  checkValidMarkAssessment() {
    let sumAssessmentPoint = 0;
    this.listSelectedAssesment.forEach(assessent => {
      if (assessent.point) {
        sumAssessmentPoint += assessent.point;
      }
    })
    if (sumAssessmentPoint > 100) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }

    if (sumAssessmentPoint < 100 && this.listSelectedAssesment.filter(item => !item.point).length == 0 && sumAssessmentPoint > 0) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listSelectedAssesment.filter(item => !item.point).length)).toString()).toFixed(0));
    this.listSelectedAssesment.forEach(assessment => {
      if (!assessment.point) {
        assessment.point = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let numberOfSurplus = 100 - sumAssessmentPoint;

    if (this.listSelectedAssesment.length) {
      for (let i = 0; i <= this.listSelectedAssesment.length; i++) {
        if (numberOfSurplus > 0) {
          this.listSelectedAssesment[i].point = this.listSelectedAssesment[i].point + 1;
          sumAssessmentPoint = sumAssessmentPoint + 1;
          numberOfSurplus = numberOfSurplus - 1;
        } else {
          sumAssessmentPoint = 100;
          break;
        }
      }
    }

    if (this.listSelectedAssesment.find(assessment => assessment.point == 0)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    if (this.listSelectedAssesment.filter(item => !item.point).length > 0) {
      return true;
    }
    if (this.listSelectedAssesment.find(assessment => !assessment.point)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    this.messageValidateAssessment = '';
    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  changeSchedule(event, element) {
    if(!this.listScheduleCallApi) this.listScheduleCallApi = [];
    if (event.target.checked) {
      this.listScheduleCallApi.push(element);
    } else {
      let index = this.listScheduleCallApi.indexOf(element)
      if (index >= -1) {
        this.listScheduleCallApi.splice(index, 1);
      }
    }
  }

  changeBonus(event, element) {
    if(!this.listBonusCallApi) this.listBonusCallApi = [];
    if (event.target.checked) {
      this.listBonusCallApi.push(element);
    } else {
      let index = this.listBonusCallApi.indexOf(element)
      if (index >= -1) {
        this.listBonusCallApi.splice(index, 1);
      }
    }
  }

  changeBenefits(event, element) {
    let eleBenefit = this.listBenefits.find(e => e.id == element.id);
    eleBenefit.isSelected = event.target.checked;
  }

  copyClipboard() {
    let copyText: any = document.getElementById('refer');
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
  }

  onChange(e) {
    this.isTypeProposed = e;
   if(this.isTypeProposed == 1 ){
    this.formDetailsJobPostings.get('salary').setValue("");
   }else{
    this.formDetailsJobPostings.get('salary_min').setValue("");
    this.formDetailsJobPostings.get('salary_max').setValue("");
   }
  }

  changeSpecify(e) {
    this.isSpecificPercentTravel = e.target.checked;
  }

  checkSalary() {
    const valueSalaryMax = Number.parseInt(this.billingService.switchSalary(this.formDetailsJobPostings.get('salary_max').value));
    const valueSalaryMin = Number.parseInt(this.billingService.switchSalary(this.formDetailsJobPostings.get('salary_min').value));
    if (this.isTypeProposed) {
      if (!valueSalaryMin) {
        this.warningSalary = "Min value is required!";
        return true;
      } else if (!valueSalaryMax) {
        this.warningSalary = "Max value is required!";
        return true;
      } else if (valueSalaryMax <= valueSalaryMin) {
        this.warningSalary = "Max value must be greater than Min value!";
        return true;
      }
    }
    this.warningSalary = null;
    return false;
  }

  copyJobTemplate(jobTemplates: number[]){
    const body = {
      id: this.jobPostingId,
      jobsTo: [...jobTemplates]
    }

    this.jobPostingsService.copyJobCrawlTemplate(body).subscribe(data => {
    }, err => {
      this.helperService.showError(err);
    })
  }
}

