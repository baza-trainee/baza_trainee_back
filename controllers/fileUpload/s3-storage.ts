import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Request, Response, NextFunction } from 'express';
import { getFileExtension } from '../../utils/getFileExtension';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, BUCKET } = process.env;

const s3Config = new S3Client({
	region: REGION,
	credentials: {
		accessKeyId: ACCESS_KEY_ID || '',
		secretAccessKey: SECRET_ACCESS_KEY || '',
	},
});

const s3Upload = multer({
	storage: multerS3({
		s3: s3Config,
		bucket: BUCKET || '',
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(
				null,
				`${Date.now().toString()}.${getFileExtension(file.originalname)}`
			);
		},
	}),
});

const uploadWithFileSizeValidation =
	(fileSizeLimit: number) =>
	(req: Request, res: Response, next: NextFunction): void => {
		const contentLength = Number(req.headers['content-length']);
		const skipUpload = Boolean(req.headers['skip-upload']);
		if (!req.file && skipUpload) {
			//console.log('body', req);
			next();
		}

		if (contentLength && contentLength > fileSizeLimit) {
			res.status(400).json({
				error: `File size exceeds the allowed limit. File size is ${contentLength}, limit is ${fileSizeLimit}`,
			});
		} else {
			s3Upload.single('file')(req, res, function (err) {
				if (err) {
					console.log('Error uploading file:', err);
					res.status(500).json({ error: 'Internal server error' });
				} else {
					next();
				}
			});
		}
	};

const deleteFileFromS3 = async (key: string) => {
	try {
		const deleteObjectCommand = new DeleteObjectCommand({
			Bucket: BUCKET,
			Key: key,
		});

		await s3Config.send(deleteObjectCommand);

		console.log('File deleted successfully');
	} catch (error) {
		console.log('Error deleting file:', error);
	}
};

export { s3Upload, deleteFileFromS3 };
