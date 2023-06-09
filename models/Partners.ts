/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - imageUrl
 *       properties:
 *         homeUrl:
 *           type: string
 *           description: The URL of the partner's homepage.
 *         imageUrl:
 *           type: string
 *           description: The URL of the partner's image.
 *       example:
 *         homeUrl: https://example.com
 *         imageUrl: /example.com/image.jpg
 */

import mongoose from 'mongoose';
import { IPartner } from '../types';

const PartnerSchema = new mongoose.Schema<IPartner>({
	homeUrl: {
		type: String,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Partners', PartnerSchema);
