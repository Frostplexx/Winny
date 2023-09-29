import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import stream from 'stream';
import { promisify } from 'util';
import {s3Client} from "./bucketSetup";
import express from "express";

// We'll use the pipeline API to correctly handle backpressure and errors.
const pipeline = promisify(stream.pipeline);

export async function streamS3ObjectToResponse(fileKey: string, res: express.Response) {
	const downloadParams = {
		Key: fileKey,
		Bucket: process.env.S3_BUCKET_NAME
	}

	const data = await s3Client.send(new GetObjectCommand(downloadParams));

	if (data.Body instanceof stream.Readable) {
		await pipeline(data.Body, res); // pipe the stream to the response
	}
}

