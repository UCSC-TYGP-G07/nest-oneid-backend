import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Controller('/validations/icao-image')
export class IcaoValidateController {
  constructor(private readonly httpService: HttpService) {}

  /*
   * Url - domain-name/validations/icao-image
   * Purpose - check that submitted image is following ICAO guidelines(Image will be submitted in form data with field name imageFile
   * TODO: Image should be linked with other properties like user_id, submitted_date, etc.
   * Parameters - image
   * Return - percentage value(image is compliance with ICAO standards)
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('imageFile'))
  async validateImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000, message: 'Validation failed (expected size is less than 5MB)' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|JPG|JPEG|PNG)$/ }),
        ],
      }),
    )
    imageFile: Express.Multer.File,
  ): Promise<string | null> {
    /*
     * Sending the file to the fastapi backend
     * Url - http://127.0.0.1:8000/validation/icao-images(hard coded)
     */
    const icaoUrl = 'http://127.0.0.1:8000/validation/icao-images';
    const formData = new FormData();
    formData.append('imageFile', JSON.stringify(imageFile), imageFile.originalname);

    const response = await lastValueFrom(
      this.httpService
        .post(icaoUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .pipe(map((res) => res.data)),
    );

    console.log(response);

    return 'Image uploaded successfully!';
  }
}
