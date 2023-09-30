import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
const now = Math.floor(Date.now() / 1000);
import axios from "axios";

const appleAPIKey = `
-----BEGIN PRIVATE KEY-----
${process.env.APPLE_CONNECT_API_KEY}
-----END PRIVATE KEY-----`;
const appleAPIKeyID = process.env.APPLE_CONNECT_API_KEY_ID;
const appleAPIIssuerID = process.env.APPLE_CONNECT_API_ISSUER_ID;

const appStorePayload = {
	iss: appleAPIIssuerID,
	iat: now,
	exp: now + 60,
	aud: 'appstoreconnect-v1',
};

const token = jwt.sign(appStorePayload, appleAPIKey, {
	algorithm: 'ES256',
	header: {
		alg: 'ES256',
		kid: appleAPIKeyID,
		typ: 'JWT',
	},
});

const appStoreHeaders = {
	Authorization: `Bearer ${token}`,
};

export const getTotalTestersCount = async (): Promise<number | null> => {
	const appId = process.env.APPLE_CONNECT_APP_ID;

	try {
		// Fetch all beta testers for your app
		const betaTestersData = await axios.get(`https://api.appstoreconnect.apple.com/v1/apps/${appId}/betaTesters`, { headers: appStoreHeaders });

		// Count and return the number of testers
		return betaTestersData.data.data.length;

	} catch (error) {
		console.error(error);
		return null;
	}
};




export const getAppName = async (): Promise<string | null> => {
	const appId = process.env.APPLE_CONNECT_APP_ID;
	try {
		const response = await axios({
			method: 'get',
			url: `https://api.appstoreconnect.apple.com/v1/apps/${appId}`,
			headers: appStoreHeaders,
		});
		return response.data.data.attributes.name;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getAppVersionAndBuildNumber = async (): Promise<any | null> => {
	const appId = process.env.APPLE_CONNECT_APP_ID;

	try {
		const response = await axios({
			method: 'get',
			url: `https://api.appstoreconnect.apple.com/v1/apps/${appId}/preReleaseVersions`,
			headers: appStoreHeaders,
		});

		return response.data.data[0].attributes.version;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getWhatToTest = async (): Promise<string | null> => {
	const appId = process.env.APPLE_CONNECT_APP_ID;

	try {
		const { data } = await axios.get(`https://api.appstoreconnect.apple.com/v1/apps/${appId}/preReleaseVersions`, { headers: appStoreHeaders });

		const versionId = data.data
			.filter((app: any) => app.attributes.platform === 'IOS')
			.map((app: any) => app.id)
			.shift();

		const buildResponse = await axios.get(`https://api.appstoreconnect.apple.com/v1/preReleaseVersions/${versionId}/builds`, { headers: appStoreHeaders });

		if(buildResponse.data.data && buildResponse.data.data[0]) {
			const buildId = buildResponse.data.data[0].id;

			const whatsNewResponse = await axios.get(`https://api.appstoreconnect.apple.com/v1/builds/${buildId}/betaBuildLocalizations`, { headers: appStoreHeaders });

			if (whatsNewResponse.data.data && whatsNewResponse.data.data[0]) {
				return whatsNewResponse.data.data[0].attributes.whatsNew;
			}
		}

		return null;

	} catch (error) {
		console.error(error);
		return null;
	}
};