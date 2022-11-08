import { Injectable } from '@angular/core';
import { listImageAcceptMessage } from 'app/constants/config';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  isFileImageAccept(type: string, name = '') {
    const extentionFile = this.getExtentionFile(name);
    let whiteFile = ["png", "jpeg", "jpg", "tiff"];
    if (listImageAcceptMessage.includes(type)) {
      return whiteFile.includes(extentionFile);
    }
    return false;
  }

  getExtentionFile(content) {
    if (!content) {return '';}
    return content.split('.').pop();
  }

  dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  convertNameOfFile(content) {
    let datas = content.split('/');
    if (!datas.length ) { return content; }
    const fileName = datas[datas.length - 1];
    const firstIndex = content.lastIndexOf('-');
    const lastIndex = content.lastIndexOf('.');
    if (firstIndex >= lastIndex) { return fileName; }
    const timeStamp = content.slice(firstIndex, lastIndex);
    const nameWithoutTimeStamp = fileName.replace(timeStamp, '');
    return nameWithoutTimeStamp;
  }
}
