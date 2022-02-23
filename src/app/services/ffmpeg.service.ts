import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenShots(file: File) {
    this.isRunning = true;
    // convert file to binary
    const data = await fetchFile(file);

    // insert it into memory so we can do something about it
    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        //input
        '-i',
        file.name,
        //output options
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-100',
        //output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];

    seconds.forEach((second) => {
      const screenShotFile = this.ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );

      const screenShotBlob = new Blob([screenShotFile.buffer], {
        type: 'image/png',
      });

      const screenShotURL = URL.createObjectURL(screenShotBlob);

      screenshots.push(screenShotURL);
    });

    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string){
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
