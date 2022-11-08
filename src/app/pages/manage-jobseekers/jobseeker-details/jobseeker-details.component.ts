import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { environment } from '../../../../environments/environment'
import { MAX_SIZE_IMAGE_UPLOAD } from '../../../constants/config';
import { MESSAGE } from '../../../constants/message';
import { PhoneNumberValidator } from '../../../directives/phone-number.validator';
import { JobSeeker } from './../../../interfaces/jobSeeker';
import { HelperService } from '../../../services/helper.service';
import { JobSeekerService } from './../../../services/jobSeeker.service';
import { FileService } from './../../../services/file.service';

@Component({
  selector: 'ngx-jobseeker-details',
  templateUrl: './jobseeker-details.component.html',
  styleUrls: ['./jobseeker-details.component.scss']
})

export class JobseekerDetailsComponent implements OnInit {
  formDetailsJobSeeker: FormGroup;
  isLoading: boolean = false;
  isPreview: boolean;
  jobseeker: JobSeeker;
  statusUser: number;
  jobseekerId: string;
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

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private jobSeekerService: JobSeekerService,
    private helperService: HelperService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.jobseekerId = this.activeRoute.snapshot.queryParamMap.get('id');
    this.isPreview = this.activeRoute.snapshot.queryParamMap.get('type') === 'preview';
    this.tab = this.activeRoute.snapshot.queryParamMap.get('tab');
    this.initForm();
    this.getDetailsJobSeeker(this.jobseekerId);
  }

  initForm(jobSeekerForm = undefined) {
    this.formDetailsJobSeeker = this.fb.group({
      profile_picture: [],
      first_name: [jobSeekerForm && jobSeekerForm.first_name, [Validators.required]],
      last_name: [jobSeekerForm && jobSeekerForm.last_name, [Validators.required]],
      phone_number: [jobSeekerForm && jobSeekerForm.phone_number],
      email: [jobSeekerForm && jobSeekerForm.email, [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
      city_name: [jobSeekerForm && jobSeekerForm.city_name],
      state_name: [jobSeekerForm && jobSeekerForm.state_name],
      asking_salary: [jobSeekerForm && jobSeekerForm.asking_salary, [Validators.pattern(/^[0-9]\d*$/)]],
      asking_benefits: [jobSeekerForm && jobSeekerForm.asking_benefits],
    })
  }

  countryChange(country: any) {
    this.countryCode = country.dialCode;
    this.nameCountry = country.iso2;
    const phoneControl = this.formDetailsJobSeeker.get('phone_number');
    phoneControl.setValidators([PhoneNumberValidator(this.nameCountry)]);
    phoneControl.updateValueAndValidity();
  }

  getDetailsJobSeeker(jobseekerId) {
    this.isLoading = true;
    const getJobSeekerSubscrition = this.jobSeekerService.getJobSeekerById(jobseekerId).subscribe(
      data => {
        this.isLoading = false;
        this.jobseeker = data;
        this.nameCountry = this.jobseeker.region_code;
        this.statusUser = this.jobseeker.status === 1 ? 2 : 1;
        this.jobseeker.profile_picture  = this.jobseeker.profile_picture && `${environment.api_url_short}${data.profile_picture}`;
        this.initForm(data);
      },
      error => {
        this.isLoading = false;
        this.helperService.showError(error);
      }
    )
    this.subscriptions.push(getJobSeekerSubscrition);
  }

  changeStatusJobseeker(id, status) {
    this.isLoading = true;
    const getchangeStatusSubscrition = this.jobSeekerService.changeStatusJobseeker(id, status).subscribe(
      data => {
        this.statusUser = data.status === 1 ? 2 : 1;
        this.helperService.showSuccess(`${status === 1 ? 'Activate' : 'Deactivate'} Jobseeker successfully`);
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
        this.formDetailsJobSeeker.get('profile_picture').setValue(null);
        return;
      }
      this.setFileUploadHandle(file, event);
    } else {
      this.fileNameSelected = '';
      this.formDetailsJobSeeker.get('profile_picture').setValue(null);
    }
  }

  setFileUploadHandle(file, event) {
    this.formDetailsJobSeeker.get('profile_picture').setValue(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fSelectedLength = (event.target.files[0].name).trim().length;
      if (Number(fSelectedLength) > 30) {
        this.fileNameSelected = '...' + ((event.target.files[0].name).slice(-20));
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
    this.formDetailsJobSeeker.get('profile_picture').setValue(null);
    const imageUploadEl: any = document.getElementById('imageUpload');
    imageUploadEl.value = '';
    this.fileNameSelected = 'ed';
    this.imageChangedEvent = null;
  }

  onSaveDetailsJobSeeker() {
    const formData = new FormData();
    formData.append('first_name', this.formDetailsJobSeeker.get('first_name').value);
    formData.append('last_name', this.formDetailsJobSeeker.get('last_name').value);
    this.formDetailsJobSeeker.get('profile_picture').value && formData.append('profile_picture', this.formDetailsJobSeeker.get('profile_picture').value);
    formData.append('city_name', this.formDetailsJobSeeker.get('city_name').value);
    formData.append('state_name', this.formDetailsJobSeeker.get('state_name').value);
    this.formDetailsJobSeeker.get('asking_salary').value && formData.append('asking_salary', this.formDetailsJobSeeker.get('asking_salary').value);
    this.formDetailsJobSeeker.get('asking_benefits').value && formData.append('asking_benefits', this.formDetailsJobSeeker.get('asking_benefits').value);

    this.helperService.markFormGroupTouched(this.formDetailsJobSeeker);
    if (this.formDetailsJobSeeker.invalid) {
      return;
    }

    this.isLoading = true;
    this.jobSeekerService.updateJobSeeker(this.jobseekerId, formData).subscribe(res => {
      this.helperService.showSuccess(MESSAGE.UPDATE_JOBSEEKER_SUCCESS);
      this.isLoading = false;
      this.router.navigate(['/pages/manage-jobseeker'], {
        queryParams: {
          status: this.tab
        }
      });
    }, errorRes => {
      this.isLoading = false;
      this.helperService.showError(errorRes);
    })
  }

  async onConfirmDeactiveJobseeker() {
    let isConfirm;
    if (this.jobseeker && this.statusUser === 1) {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_ACTIVATE_JOBSEEKER);
    } else {
      isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DEACTIVE_JOBSEEKER);
    }
    if (isConfirm) {
      this.changeStatusJobseeker(this.jobseekerId, this.statusUser);
    }
  }

  onCancelDetailsJobSeeker() {
    this.router.navigate(['/pages/manage-jobseeker'], {
      queryParams: {
        status: this.tab
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

}
