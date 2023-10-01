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

const signJWT = () => {
	const now = Math.floor(Date.now() / 1000);

	const payload = {
		iss: appleAPIIssuerID,
		iat: now,
		exp: now + (60 * 20), // Recommended to set the expiry time to <= 20 minutes
		aud: 'appstoreconnect-v1',
	};

	const token = jwt.sign(payload, appleAPIKey, {
		algorithm: 'ES256',
		header: {
			alg: 'ES256',
			kid: appleAPIKeyID,
			typ: 'JWT',
		},
	});

	return `Bearer ${token}`;
};

const getHeaders = () => ({
	Authorization: signJWT(),
	// other headers...
});


export async function getJoinable() {
	const appId = process.env.APPLE_CONNECT_APP_ID;

	const appStoreHeaders = {
		'Accept': 'application/vnd.api+json',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'en-GB,en;q=0.9',
		'Connection': 'keep-alive',
		'Content-Type': 'application/vnd.api+json',
		'Cookie': process.env.APPLE_CONNECT_COOKIE!,
		'Host': 'appstoreconnect.apple.com',
		'Referer': 'https://appstoreconnect.apple.com/apps/6450856694/testflight/testers',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-origin',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
		'x-csrf-itc': '[asc-ui]'
	};

	try {
		const response = await axios({
			method: 'get',
			url: `https://appstoreconnect.apple.com/iris/v1/apps/${appId}/betaAppTesterDetail`,
			headers: appStoreHeaders,
		});

		return response.data.data.attributes.currentExternalTesters;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const getAppVersionAndBuildNumber = async (): Promise<any | null> => {
	const appId = process.env.APPLE_CONNECT_APP_ID;

	try {
		const response = await axios({
			method: 'get',
			url: `https://api.appstoreconnect.apple.com/v1/apps/${appId}/preReleaseVersions`,
			headers: getHeaders(),
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
		const { data } = await axios.get(`https://api.appstoreconnect.apple.com/v1/apps/${appId}/preReleaseVersions`, { headers: getHeaders()});

		const versionId = data.data
			.filter((app: any) => app.attributes.platform === 'IOS')
			.map((app: any) => app.id)
			.shift();

		const buildResponse = await axios.get(`https://api.appstoreconnect.apple.com/v1/preReleaseVersions/${versionId}/builds`, { headers: getHeaders() });

		if(buildResponse.data.data && buildResponse.data.data[0]) {
			const buildId = buildResponse.data.data[0].id;

			const whatsNewResponse = await axios.get(`https://api.appstoreconnect.apple.com/v1/builds/${buildId}/betaBuildLocalizations`, { headers: getHeaders() });

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