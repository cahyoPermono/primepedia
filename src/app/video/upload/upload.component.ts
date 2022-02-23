import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap, forkJoin } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  file: File | null = null;
  isDragover = false;
  showForms = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please Wait!!';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }

    this.isDragover = false;

    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    // generate screen shoot
    this.screenshots = await this.ffmpegService.getScreenShots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.showForms = true;

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    console.log(this.file);
  }

  async uploadFile() {
    // disabled form when uploading
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertMsg = 'Please Wait!! Your clip is being uploaded';
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    forkJoin([this.task.snapshotChanges(), this.screenshotTask.snapshotChanges()])
      .pipe(
        switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;
          
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url: clipURL,
            screenshotURL,
            screenshotFileName: `${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipService.createClip(clip);

          console.log(clip);

          this.alertMsg = 'Succesfully Upload';
          this.alertColor = 'green';
          this.inSubmission = false;
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.alertMsg = 'Error Upload';
          this.alertColor = 'red';
          this.inSubmission = false;
          this.showPercentage = false;
          this.uploadForm.enable();
          console.error(error);
        },
      });
  }
}
