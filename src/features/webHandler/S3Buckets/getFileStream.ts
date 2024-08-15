import { GetObjectCommand, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import stream from 'stream';
import { promisify } from 'util';
import express, { Response } from "express";
import { NoSuchKey } from "@aws-sdk/client-s3";
import { s3Client } from "./bucketSetup";

// We'll use the pipeline API to correctly handle backpressure and errors.
const promies_pipeline = promisify(stream.pipeline);

export async function streamS3ObjectToResponse(fileKey: string, res: Response) {
    try {
        const downloadParams = {
            Key: fileKey,
            Bucket: process.env.S3_BUCKET_NAME
        }

        const data = await s3Client.send(new GetObjectCommand(downloadParams));

        if (data.Body instanceof stream.Readable) {
            data.Body.pipe(res as any); // directly pipe the stream to the response
        }
    } catch (error) {
        if (error instanceof NoSuchKey) {
            // If the key is not found, return HTTP 404 error
            console.error("The specified key does not exist. Key: " + fileKey)
            res.status(404).send('The specified key does not exist.');
        } else {
            // For other errors, let's return HTTP 500
            res.status(500).send('An error occurred.');
        }
    }
}
