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

@Controller('/validations/validate-icao')
export class IcaoValidationController {
  constructor(private readonly httpService: HttpService) {}

  /*
   * Url - domain-name/api/validations/validate-icao
   * Purpose - check that submitted face photo complies with ICAO guidelines (Image will be submitted in form data with field name: imageFile)
   * TODO: Image should be linked with other properties like userId, submitted_date, etc.
   * Parameters - image
   * Return - ICAO compliance check results
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('imageFile'))
  async validateImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'Validation failed (expected size is less than 5MB)',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|JPG|JPEG|PNG)$/ }),
        ],
      }),
    )
    imageFile: Express.Multer.File,
  ): Promise<string | null> {
    /*
     * Sending the file to the FastAPI backend
     * Url - ICAO_VALIDATION_URL in env
     */
    const icaoUrl = process.env.ICAO_VALIDATION_URL;
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

    return 'Request submitted successfully!';
  }
}
