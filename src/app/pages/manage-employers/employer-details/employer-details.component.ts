import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobPostingsService } from 'app/services/job-postings.service';
import { cloneDeep } from 'lodash';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import UsStates from 'us-state-codes';

import { environment } from '../../../../environments/environment';
import { linkEmbedYoutube, MAX_SIZE_IMAGE_UPLOAD } from '../../../constants/config';
import { MESSAGE } from '../../../constants/message';
import { PhoneNumberValidator } from '../../../directives/phone-number.validator';
import { HelperService } from '../../../services/helper.service';
import { ModalCropCompanyPhotoComponent } from '../modal-crop-company-photo/modal-crop-company-photo.component';
import { ModalInsertVideoLinkComponent } from '../modal-insert-video-link/modal-insert-video-link.component';
import { Employer } from './../../../interfaces/employer';
import { EmployerService } from './../../../services/employer.service';
import { FileService } from './../../../services/file.service';

@Component({
  selector: 'ngx-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss'],
  providers: [FormBuilder]
})
export class EmployerDetailsComponent implements OnInit {
  formDetailsEmployer: FormGroup;
  isLoading: boolean = true;
  employerId: string;
  isPreview: boolean;
  employer: Employer;
  statusUser: number;
  fileImageLogoToUpload: File = null;
  countryCode: number = 1;
  nameCountry: string;
  listPhoneCountry: Array<any> = environment.nationalPhone;
  fileNameSelected: string;
  isMaxSizeImage: boolean = false;
  imageChangedEvent: any;
  croppedImage: File;
  showImageFirst: boolean = true;
  subscriptions: Subscription[] = [];
  tab: string;
  isCrawl: string;
  listCountry: Array<string> = [];
  listState: Array<string> = [];
  listCityStore: any[] = [];
  listCity: Array<any> = [];
  gallery: Array<any> = [];
  galleryTemp: Array<any> = [];
  linkAudio: any;
  videoLink: string;
  modalInsertVideoLinkRef: NgbModalRef;
  videoSRC: SafeResourceUrl;
  
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public router: Router,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private employerService: EmployerService,
    private helperService: HelperService,
    private fileService: FileService,
    private jobPostingsService: JobPostingsService,
  ) { }

  ngOnInit(): void {
    this.gallery = [
      {
        id: 1,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 2,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 3,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 4,
        type: 'video',
        url: null
      }
    ]
    this.employerId = this.activeRoute.snapshot.queryParamMap.get('id');
    this.isPreview = this.activeRoute.snapshot.queryParamMap.get('type') === 'preview';
    this.tab = this.activeRoute.snapshot.queryParamMap.get('tab');
    this.isCrawl = this.activeRoute.snapshot.queryParamMap.get('isCrawl');
    this.galleryTemp = cloneDeep(this.gallery);
    this.initForm();

    this.jobPostingsService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })

    this.jobPostingsService.getAllState().subscribe(listState => {
      this.listState = listState;
    })

    this.getDetailsEmployer(this.employerId);
  }

  initForm(employerForm = undefined) {
    let employeeSelect;
    let revenueSelect;
    if (employerForm) {
      employeeSelect = (employerForm?.company_size_min || 0) + '-' + (employerForm?.company_size_max || 0);
      revenueSelect = (employerForm?.employer_revenue_min || 0) + '-' + (employerForm?.employer_revenue_max || 0);
    }
    this.formDetailsEmployer = this.fb.group({
      profile_picture: [],
      company_name: [employerForm && employerForm.company_name, [Validators.required]],
      phone_number: [employerForm && employerForm.phone_number],
      email: [employerForm && employerForm.email, [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
      city_name: [employerForm && employerForm.city_name],
      state_name: [employerForm && employerForm.state_name],
      description: [employerForm && employerForm.description, [Validators.required]],
      employee: [employerForm && employeeSelect, [Validators.required]],
      address_line: [employerForm && employerForm.address_line],
      employerCompanyUrl: [employerForm && employerForm.employer_company_url, [Validators.pattern(/^[^#?\/]+/)]],
      employerCompanyFacebook: [employerForm && employerForm.employer_company_facebook, [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
      employerCompanyTwitter: [employerForm && employerForm.employer_company_twitter, [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
      yearFounded: [employerForm && employerForm.employer_year_founded, [Validators.pattern(/^\d{4}$/)]],
      industry: [employerForm && employerForm.employer_industry],
      ceoName: [employerForm && employerForm.employer_ceo_name],
      revenue: [employerForm && revenueSelect]
    });
    try{
      if (employerForm?.employer_company_photo) {
        this.gallery = JSON.parse(employerForm.employer_company_photo);
        const length = this.gallery.length;
        const isHaveVideo = this.gallery.some(e => e.type == 'video');
        this.gallery = [...this.gallery, ...this.galleryTemp.slice(this.gallery.length)];
        if (length < 4) {
          this.gallery[this.gallery.length - 1].type = isHaveVideo ? "image" : "video";
        }
      }
      this.videoLink = this.gallery.find(e => e.type == 'video')?.url;
      this.linkAudio = this.videoLink;
      if (this.videoLink) {
        let linkVideo = this.checkVideoYoutube(this.videoLink);
        this.videoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(linkVideo);
        this.gallery.forEach(e => {
          if (e.type == 'video') {
            e.url = this.videoSRC || '';
          }
        })
      }
    }catch(err){
      console.log('error gallery');
      this.gallery = this.galleryTemp;
    }
    
    this.getDataCity();
  }

  checkVideoYoutube(link) {
    if (link && link.indexOf('//www.youtube.com/watch') >= 0) {
      let id = this.helperService.getIdVideoYoutube(link);
      return `${linkEmbedYoutube}${id}`;
    } else {
      return link;
    }
  }
  
  countryChange(country: any) {
    this.countryCode = country.dialCode;
    this.nameCountry = country.iso2;
    const phoneControl = this.formDetailsEmployer.get('phone_number');
    phoneControl.setValidators([PhoneNumberValidator(this.nameCountry)]);
    phoneControl.updateValueAndValidity();
  }

  getDetailsEmployer(employerId) {
    this.isLoading = true;
    const getEmployerSubscrition = this.employerService.getEmployerById(employerId).subscribe(
      data => {
        this.isLoading = false;
        this.employer = !data.employer_info ? data : data.employer_info;
        this.statusUser = this.employer.status === 1 ? 2 : 1;
        this.nameCountry = this.employer.region_code;
        this.employer.profile_picture = this.employer.profile_picture && `${environment.api_url_short}${data.profile_picture}`;
        this.initForm(this.employer);
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getEmployerSubscrition);
  }

  changeStatusEmployer(id, status) {
    this.isLoading = true;
    const getchangeStatusSubscrition = this.employerService.changeStatusEmployer(id, status).subscribe(
      data => {
        this.statusUser = data.status === 1 ? 2 : 1;
        this.helperService.showSuccess(`${status === 1 ? 'Activate' : 'Deactivate'} Employer successfully`);
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getchangeStatusSubscrition);
  }

  handleFileLogoInput(event) {
    this.imageChangedEvent = event;
    this.showImageFirst = false;
    const maxSize = MAX_SIZE_IMAGE_UPLOAD;
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.isMaxSizeImage = false;
      if (file.size > maxSize) {
        this.isMaxSizeImage = true;
        const imageUploadEl: any = document.getElementById('imageUpload');
        imageUploadEl.value = '';
        this.fileNameSelected = '';
        this.formDetailsEmployer.get('profile_picture').setValue(null);
        return;
      }
      this.setFileUploadHandle(file, event);
    } else {
      this.fileNameSelected = '';
      this.formDetailsEmployer.get('profile_picture').setValue(null);
    }
  }

  setFileUploadHandle(file, event) {
    this.formDetailsEmployer.get('profile_picture').setValue(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fSelectedLength = (event.target.files[0].name).trim().length;
      if (Number(fSelectedLength) > 30) {
        this.fileNameSelected = `...${(event.target.files[0].name).slice(-20)}`;
      } else {
        this.fileNameSelected = event.target.files[0].name;
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    let imageBase64 = event.base64;
    let nameFile = this.imageChangedEvent.target.files[0].name;
    let typeFile = this.imageChangedEvent.target.files[0].type;
    this.croppedImage = new File([this.fileService.dataURItoBlob(imageBase64)], nameFile, {
      type: typeFile
    });

    this.setFileUploadHandle(this.croppedImage, this.imageChangedEvent);
  }

  cancelImage() {
    this.showImageFirst = true;
    this.formDetailsEmployer.get('profile_picture').setValue(null);
    const imageUploadEl: any = document.getElementById('imageUpload');
    imageUploadEl.value = '';
    this.fileNameSelected = '';
    this.imageChangedEvent = null;
  }

  onSaveDetailsEmployer() {
    const formData = new FormData();
    this.helperService.markFormGroupTouched(this.formDetailsEmployer);
    if (this.formDetailsEmployer.invalid) {
      return;
    }
    let urlVideo;
    for (let i = 0; i < this.gallery.length; i++) {
      if (this.gallery[i].type == 'video') {
        this.gallery[i].url = this.linkAudio;
        urlVideo = this.gallery[i].url;
      }
      this.gallery[i].id = i + 1;
    }

    if (this.isCrawl == '1') formData.append('is_crawl', '1');
    formData.append('email', this.formDetailsEmployer.get('email').value);
    formData.append('company_name', this.formDetailsEmployer.get('company_name').value);
    formData.append('first_name', this.employer.first_name);
    formData.append('last_name', this.employer.last_name);
    formData.append('description', this.formDetailsEmployer.get('description').value);
    formData.append('city_name', this.formDetailsEmployer.get('city_name').value);
    formData.append('state_name', this.formDetailsEmployer.get('state_name').value);
    formData.append('address_line', (this.formDetailsEmployer.get('address_line').value || ''));
    formData.append('employer_company_url', (this.formDetailsEmployer.get('employerCompanyUrl').value || ''));
    formData.append('employer_company_twitter', (this.formDetailsEmployer.get('employerCompanyTwitter').value || ''));
    formData.append('employer_company_facebook', (this.formDetailsEmployer.get('employerCompanyFacebook').value || ''));
    formData.append('employer_ceo_name', (this.formDetailsEmployer.get('ceoName').value || ''));
    formData.append('employer_year_founded', (this.formDetailsEmployer.get('yearFounded').value || ''));
    formData.append('employer_industry', (this.formDetailsEmployer.get('industry').value || ''));
    formData.append('employer_company_photo', (JSON.stringify(this.gallery) || ''));
    this.formDetailsEmployer.get('profile_picture').value && formData.append('profile_picture', this.formDetailsEmployer.get('profile_picture').value);
    this.formDetailsEmployer.get('employee').value.split('-')[0] ? formData.append('company_size_min', this.formDetailsEmployer.get('employee').value.split('-')[0]) : formData.append('company_size_min', '');
    this.formDetailsEmployer.get('employee').value.split('-')[1] ? formData.append('company_size_max', this.formDetailsEmployer.get('employee').value.split('-')[1]) : formData.append('company_size_max', '');
    this.formDetailsEmployer.get('revenue').value.split('-')[0] ? formData.append('employer_revenue_min', this.formDetailsEmployer.get('revenue').value.split('-')[0]) : formData.append('employer_revenue_min', '');
    this.formDetailsEmployer.get('revenue').value.split('-')[1] ? formData.append('employer_revenue_max', this.formDetailsEmployer.get('revenue').value.split('-')[1]) : formData.append('employer_revenue_max', '');

    this.isLoading = true;
    this.employerService.updateEmployer(this.employerId, formData).subscribe(res => {
      this.isLoading = false;
      this.helperService.showSuccess(MESSAGE.UPDATE_EMPLOYER_SUCCESS);
      this.employerService.getListCompany().subscribe(() => { });
      if (this.isCrawl == '1') {
        this.router.navigate(['/pages/manage-company-crawl'], {
          queryParams: {
            status: this.tab
          }
        });
      } else {
        this.router.navigate(['/pages/manage-employer'], {
          queryParams: {
            status: this.tab
          }
        });
      }

    }, errorRes => {
      this.isLoading = false;
      this.helperService.showError(errorRes);
    })
  }

  async onConfirmDeactiveEmployer() {
    let isConfirm;
    if (this.employer && this.statusUser === 1) {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_ACTIVATE_EMPLOYER);
    } else {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DEACTIVE_EMPLOYER);
    }

    if (isConfirm) {
      this.changeStatusEmployer(this.employerId, this.statusUser);
    }
  }

  onCancelDetailsEmployer() {
    if (this.isCrawl == '1') {
      this.router.navigate(['/pages/manage-company-crawl'], {
        queryParams: {
          status: this.tab
        }
      });
      return;
    }
    this.router.navigate(['/pages/manage-employer'], {
      queryParams: {
        status: this.tab
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  selectState(value) {
    const stateName = value;
    this.formDetailsEmployer.get('city_name').setValue('');
    const index = this.listState.findIndex(state => state == stateName);
    if (index >= 0) {
      const code = UsStates.getStateCodeByStateName(this.listState[index]);
      this.listCity = this.listCityStore.filter(res => res.adminCode == code);
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
      const index = this.listState.findIndex(state => state == this.formDetailsEmployer.get('state_name').value);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }

  showModalInsertVideoLink(item, status) {
    if (item.type != 'video') {
      return;
    }
    const modalRef = this.modalService.open(ModalInsertVideoLinkComponent, {
      windowClass: 'modal-inser-video-link',
      size: 'md'
    })
    modalRef.componentInstance.urlVideo = this.videoLink;
    modalRef.result.then(res => {
      this.gallery.forEach(e => {
        if (e.type == 'video') {
          this.linkAudio = res;
          if (res) {
            let url = res.replace("watch?v=", "embed/")
            e.url = this.sanitizer.bypassSecurityTrustResourceUrl(url)
          } else e.url = '';
        }
      })
    })
  }

  onFileChangeMulti(event, item) {
    const file = event.target.files[0];
    if (!this.fileService.isFileImageAccept(file.type, file.name)) {
      this.helperService.showError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
      return;
    }
    let index = item && this.gallery.findIndex(x => x.id == item.id);
    const modalRef = this.modalService.open(ModalCropCompanyPhotoComponent, {
      windowClass: 'modal-crop-company-photo',
      size: 'md'
    })
    modalRef.componentInstance.imageChangedEvent = event;
    modalRef.result.then(res => {
      if (res) {
        this.gallery[index].url = res.url;
          this.gallery[index].name = res.fileName;
      }
    })
  }
  
  async deleteCompanyPhoto(item) {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_EMPLOYER_PHOTO, 'Yes');
    if (isConfirmed) {
      const photoItem = this.gallery.find(x => x.id === item);
      if (photoItem) {
        photoItem.url = "";
        photoItem.name = "";
      }
    }
  }
}
