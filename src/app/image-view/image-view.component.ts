import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafePipesPipe } from '../safe-pipe';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  providers: [SafePipesPipe]
})
export class ImageViewComponent implements OnInit {

  docData;
  docType;
  docViewType: any;
  sStatus: any = '';
  public errors: WebcamInitError[] = [];

  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';
  constructor(
    public dialogRef: MatDialogRef<ImageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public safe: SafePipesPipe
    
  ) {
    if (data.type == "image") {
      this.docData = data.docData;
      this.docType = "image";
    } else if (data.type == "pdf") {
      this.docType = "pdf";
      this.docViewType = "application/pdf";
      data.docData = data.docData.split('data:application/pdf;base64,').pop();
      this.docData = this.b64toBlob(data.docData, 'application/pdf');
    } else  if (data.type == "camera") {
      this.docData = data.docData;
      this.docType = "camera";
    }
    console.log(this.docData)
  }

  ngOnInit(): void {
  }

  b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const Url = URL.createObjectURL(blob);
    return this.safe.transform(Url);
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }
  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    console.info('got webcam image', this.sysImage);
  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  onUpload() {
    this.dialogRef.close({url: this.sysImage});
  }

}
