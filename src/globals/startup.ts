import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import {getAllThemes} from "../database/databaseHandler";

const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

const envTemplate =
`
CLIENT_ID=
TOKEN=
BEARER=
BOT_URL=

S3_KEY_ID=
S3_KEY=
S3_ENDPOINT=
S3_BUCKET_NAME=

APPLE_CONNECT_API_KEY=
APPLE_CONNECT_API_KEY_ID=
APPLE_CONNECT_API_ISSUER_ID=
APPLE_CONNECT_APP_ID=
APPLE_CONNECT_COOKIE=''

`;

const channelsJsonContents = `{
  "channelID": "",
  "guildID": ""
}`;
const whitelistsJsonContents= `{"users":[""]}`;

export async function ensureFilesExist() {
	try {
		await access(path.resolve(__dirname, '../../.env'));
	} catch {
		await writeFile(path.resolve(__dirname, '../../.env'), envTemplate);
	}

	try {
		await access(path.resolve('../channels.json'));
	} catch {
		await writeFile(path.resolve(__dirname, '../channels.json'), channelsJsonContents);
	}

	try {
		await access(path.resolve(__dirname, '../whitelist.json'));
	} catch {
		await writeFile(path.resolve(__dirname, '../whitelist.json'), whitelistsJsonContents);
	}
}