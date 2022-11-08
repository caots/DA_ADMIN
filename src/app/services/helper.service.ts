import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import urlSlug from 'url-slug';

import { MESSAGE } from '../constants/message';
import { ModalConfirmComponent } from '../components/modal-confirm/modal-confirm.component';
import { Router } from '@angular/router';
import { ACCOUNT_TYPE } from 'app/constants/config';

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  constructor(
    private toastrService: NbToastrService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  convertToSlugUrl(title, id) {
    if (!title) { return id; }
    let titlejob = title.trim().toString();
    let urlSlice = urlSlug(`${titlejob}`);
    if (urlSlice.length < 200) { return `${titlejob}-${id}`; }
    urlSlice = urlSlice.slice(0, 200)
    let list: number[] = [];
    for (var i = 0; i < urlSlice.length; i++) {
      if (urlSlice[i] === "-") {
        list.push(i);
      }
    }
    let indexSlice = list[list.length - 2]
    urlSlice = urlSlice.slice(0, Number(indexSlice));
    return urlSlug(`${urlSlice}-${id}`);
  }

  getIdVideoYoutube(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  showSuccess(content, title = '',) {
    this.toastrService.show(title, content, {
      status: 'success'
    })
  }

  showWarning(content, title = '',) {
    this.toastrService.show(title, content, {
      status: 'warning'
    })
  }

  showError(content, title = '') {
    this.toastrService.show(title, content, {
      status: 'danger'
    })
  }

  showToastToNewMessage(message, title = 'Received a new message', msg) {
    this.toastrService.show(message, title, {
      status: 'success'
    })
  }

  showNotif(msg) {
    if (!msg || !msg.group_id) { return; }
    const route = '/pages/messages';
    // this.router.navigate([route, msg.group_id, jobId])
    const accountType = get(msg, 'current_user.acc_type', ACCOUNT_TYPE.EMPLOYER)
    this.router.navigate([route], {
      queryParams: {
        groupId: msg.group_id,
        accountType
      }
    });
  }

  confirmPopup(
    title: string = 'Do you want to delete this item?',
    btnOkText: string = MESSAGE.BTN_OK_TEXT, btnCancelText: string = MESSAGE.BTN_CANCEL_TEXT
  ) {
    const modalRef = this.modalService.open(ModalConfirmComponent, { windowClass: 'modal-center-screen' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  convertUserId(value) {
    const pad = '0000000000';
    return (pad + value).slice(-pad.length);
  }

  markFormGroupTouched(formGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    })
  }

  autoCompleteFilter(list, query, limit = 5) {
    if (query && list && list.length) {
      let listPrioritize = list.filter(item => {
        return item && item.toLowerCase().indexOf(query.toLowerCase()) == 0;
      })

      if (listPrioritize.length >= limit) {
        return listPrioritize.splice(0, limit);
      }

      let listIncludes = list.filter(item => {
        return item && item.toLowerCase().includes(query.toLowerCase()) && !listPrioritize.includes(item);
      })

      return listPrioritize.concat(listIncludes).splice(0, limit);
    }

    return [];
  }

  groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
