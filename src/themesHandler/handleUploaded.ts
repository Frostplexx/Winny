import unzipper, {Open} from 'unzipper';
import fs from 'fs';
import {cacheFolder} from "../globals/constants";
import path from "path";
import * as util from "util";
import {ApprovalStates, initiateApproval} from "./approvalHandler";
import {uploadThemeToDiscord} from "./discordUploader";
import {databaseHandler} from "../databaseHandler/databaseHandler";

/**
 * Handles uploaded file.
 *
 * @param {string} filename - The name of the uploaded file.
 * @returns {Promise<void>} - A promise that resolves once the file is handled.
 */
export const handleUploaded = async (filename: string): Promise<void> => {
	console.log(`Handling uploaded file: ${filename}`);
	let foldername = filename.replace(".zip", "")
	//get the file metadata
	var metadata = await extractThemeMetadata(filename, `${cacheFolder}/${foldername}`)
	if (!metadata) {return}
	await databaseHandler(metadata)
	await initiateApproval(metadata)
	//metadata = await uploadThemeToDiscord(metadata)
}

/**
 * Extracts theme metadata from a zip file.
 * @param {string} filename - The name of the zip file.
 * @param {string} extractPath - The path where the zip file will be extracted.
 * @returns {Promise<ThemeMetadata | null>} A promise that resolves to the extracted theme metadata or null if an error occurs.
 */
async function extractThemeMetadata(filename: string, extractPath: string): Promise<ThemeMetadata | null> {
	let filePath = `${cacheFolder}/${filename}`
	let metadata = null;
	try {
		await new Promise((resolve, reject) => {
			fs.createReadStream(filePath)
				.pipe(unzipper.Extract({ path: extractPath }))
				.on('close', resolve)  // Change 'finish' to 'close'
				.on('error', reject);
		});

		console.log('File unzipped successfully');

		const jsonFilePath = path.join(extractPath,'theme.json');

		// Ensure theme.json file exists
		if (fs.existsSync(jsonFilePath)) {
			const readFile = util.promisify(fs.readFile);

			const data = await readFile(jsonFilePath, 'utf8');

			const jsonContent = JSON.parse(data);

			if (jsonContent && jsonContent.metadata) {

				metadata = {
					file_name: filename,
					file_id: filename.replace(".zip", "") || '',
					theme_name: jsonContent.metadata.name || '',
					theme_author: jsonContent.metadata.author || '',
					theme_description: jsonContent.description || '',
					message_id: undefined,
					attachment_url: undefined,
					approval_state: ApprovalStates.PENDING,
					color: {
						alpha: jsonContent.metadata.color.alpha,
						hex: jsonContent.metadata.color.hex
					} as MetadataColor,
					icon: jsonContent.metadata.icon
				};
			} else {
				console.error("Error parsing JSON");
			}
		} else {
			console.error("theme.json doesnt exist");
		}
	} catch (err) {
		console.error(`Error while unzipping file and reading JSON: ${err}`);
	} finally {
		// Delete the folder after finishing extracting the metadata
		fs.rm(extractPath, { recursive: true, force: true }, (err) => {
			if(err) {
				console.error(`Error while deleting folder: ${err}`);
			} else {
				console.log(`Folder deleted successfully: ${extractPath}`);
			}
		});
	}

	return metadata;
}


/**
 * Represents the metadata of a theme.
 */
export interface ThemeMetadata {
	file_name: string
	file_id: string
	theme_name: string
	theme_author: string
	theme_description: string
	message_id: string | undefined
	attachment_url: string | undefined
	approval_state: ApprovalStates
	color: MetadataColor
	icon: string
}

/**
 * Represents the color metadata.
 * @interface
 */
export interface MetadataColor {
	alpha: number
	hex: string
}