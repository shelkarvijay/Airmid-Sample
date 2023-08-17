import { Component, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewComponent } from './image-view/image-view.component';
import { ApiService } from './shared/api.service';

export class DocData {
  doc: any;
  type: string = '';
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'file-upload';
  images: any[] = [];
  docsArray: DocData[] = [];
  @ViewChild('attachments') attachment: any;
  imageForm = new FormGroup({
    imageFile: new FormControl('', [Validators.required]),
    imgFileSource: new FormControl('', [Validators.required])
  });

  docsForm = new FormGroup({
    docFile: new FormControl('', [Validators.required]),
    docFileSource: new FormControl('', [Validators.required])
  });
  showOptions: boolean = false;
  constructor(
    public matDialog: MatDialog,
    private apiService: ApiService
  ) { }

  onImageFileChange(event: any) {
    let x: any = [];
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        x.push(event.target.files[i].name);
        reader.onload = (eventOnLoad: any) => {
          this.images.push({url: eventOnLoad.target.result, name: x[i]});
          this.imageForm.patchValue({
            imgFileSource: this.images
          });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }

  onDocFileChange(event: any) {
    let files = event.target.files;
    let type: string;
    if (files && files[0]) {
      let filesAmount = files.length;
      for (let i = 0; i < filesAmount; i++) {
        let file = files[i];
        if (file) {
          let pdf = (/\.(pdf)$/i);
          type = file.name.toLowerCase();
          if (pdf.exec(type)) {
            type = "pdf";
          }
        }
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.docsArray.push({ doc: event.target.result, type: type });
          this.docsForm.patchValue({
            docFileSource: this.docsArray
          });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }

  removeImage(url: string) {
    let index = this.images.indexOf(url);
    this.images.splice(index, 1);
  }

  removeDoc(ele: DocData) {
    let index = this.docsArray.indexOf(ele);
    this.docsArray.splice(index, 1);
  }
  onViewImage(ele: any, type: string) {
    let fileType;
    if (ele) {
      const dialogRef = this.matDialog.open(ImageViewComponent,
        {
          width: '900px',
          height: '900px',
          data: {
            docData: type == 'img' ? ele : ele.doc,
            type: type == 'img' ? "image" : ele.type
          }
        }
      );
      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  onSubmitImgFiles() {
    console.log(this.imageForm.get('imgFileSource')?.value);
    let reqJson = {};
    this.apiService.postDataToServer('/api/CRMSTran/Save_StudyUploadDocument', reqJson).subscribe(res => {
      if(res) {
        
      }
    });
  }

  onSubmitDocFiles() {
    console.log(this.docsForm.get('docFileSource')?.value);
  }

  openCamera(type: string) {
    let fileType;
    const dialogRef = this.matDialog.open(ImageViewComponent,
      {
        width: '900px',
        height: '900px',
        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : ''
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.images.push(result.url);
      }
    });
  }
}
