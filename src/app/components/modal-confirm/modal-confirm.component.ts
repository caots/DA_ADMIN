import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  @Input() title: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  
  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

  yes() {
    this.activeModal.close(true);
  }

  no() {
    this.activeModal.close(false);
  }

}
