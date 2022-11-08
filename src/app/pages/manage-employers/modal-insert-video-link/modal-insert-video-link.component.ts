import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ngx-modal-insert-video-link',
  templateUrl: './modal-insert-video-link.component.html',
  styleUrls: ['./modal-insert-video-link.component.scss']
})
export class ModalInsertVideoLinkComponent implements OnInit {

  @Input() urlVideo: any;
  linkVideo: any
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.linkVideo = this.urlVideo
  }

  closeModal() {
    this.activeModal.close(false);
  }

  save() {
    this.activeModal.close(this.linkVideo);
  }


}
