import {GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {config} from 'dotenv';
import {s3Client} from "./bucketSetup";

config();
const envConfig = process.env;

/**
 * Retrieves the download URL for a given filename.
 *
 * @param {string} filename - The name of the file to download.
 * @returns {Promise<string>} The download URL for the file.
 */
export async function getDownloadURL(filename: string): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: envConfig.S3_BUCKET_NAME,
		Key: `themes/${filename}`,
	});

	return await getSignedUrl(s3Client, command, {expiresIn: 3600});
}