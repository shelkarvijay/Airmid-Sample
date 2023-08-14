import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafePipesPipe } from '../safe-pipe';

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
    }
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

}
