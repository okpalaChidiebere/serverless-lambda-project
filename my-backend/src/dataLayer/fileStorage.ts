import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'


import { createLogger } from '../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS)


export class FileStorage {
    
    constructor(
        private logger: any = createLogger('dataLayer'),
        private pid = uuid.v4(),
        private readonly s3: AWS.S3 = FileStorage.createS3Client(),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = +process.env.SIGNED_URL_EXPIRATION  //convert string to number with the plus sign
    ) {}

    static createS3Client() {
      return new XAWS.S3({
          signatureVersion: 'v4'
       })
    }

    get getBucketName() {
        return this.bucketName
    }

    async getUploadUrl(todoId: string) {

        this.logger.info('Getting PreSignedURL', {
            pid: this.pid
        })

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })
    }
}
