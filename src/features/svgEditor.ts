import fs from 'fs-extra';
import sharp from "sharp";
import {ThemeMetadata} from "./themesHandler/handleUploaded";
export interface WinstonThemePreview {
	background: string;
	accentColor: string;
	tabBarBackground: string
	subredditPillBackground: string;
	divider: string;
	tabBarInactiveColor: string;
	tabBarInactiveTextColor: string;
	postBackground: string;
	postTitleText: string;
	postBodyText: string;
}

//TODO: Refactor this to be more better
export function getThemePreviewImage(metadata: ThemeMetadata) {
	const colorsToReplaceLight: { [key: string]: string } = {
		"#F2F2F7": metadata.themeColorsLight.background,
		"#007AFF": metadata.themeColorsLight.accentColor,
		"#CCE4FF": metadata.themeColorsLight.subredditPillBackground,
		"#F2F2F2": metadata.themeColorsLight.divider,
		"#A1A1A1": metadata.themeColorsLight.tabBarInactiveColor,
		"#ADAEAE": metadata.themeColorsLight.tabBarInactiveTextColor,
		"#FFFFFE": metadata.themeColorsLight.postBackground,
		"#F7F7F8": metadata.themeColorsLight.tabBarBackground,
		"#000001": metadata.themeColorsLight.postTitleText,
		"#000002": metadata.themeColorsLight.postBodyText,
		"#000003": "#000000",
	};

	const colorsToReplaceDark: { [key: string]: string } = {
		"#F2F2F7": metadata.themeColorsDark.background,
		"#007AFF": metadata.themeColorsDark.accentColor,
		"#CCE4FF": metadata.themeColorsDark.subredditPillBackground,
		"#F2F2F2": metadata.themeColorsDark.divider,
		"#A1A1A1": metadata.themeColorsDark.tabBarInactiveColor,
		"#ADAEAE": metadata.themeColorsDark.tabBarInactiveTextColor,
		"#FFFFFE": metadata.themeColorsDark.postBackground,
		"#F7F7F8": metadata.themeColorsDark.tabBarBackground,
		"#000001": metadata.themeColorsDark.postTitleText,
		"#000002": metadata.themeColorsDark.postBodyText,
		"#000003": "#FFFFFF",
	};

	let svgData = fs.readFileSync('./src/assets/Winston.svg', 'utf8');

	let svgDataDrk = svgData
	let svgDataLight = svgData

	for (let color in colorsToReplaceDark) {
		let regex = new RegExp(color, 'g');
		svgDataDrk = svgDataDrk.replace(regex, colorsToReplaceDark[color]);
	}

	for (let color in colorsToReplaceLight) {
		let regex = new RegExp(color, 'g');
		svgDataLight = svgDataLight.replace(regex, colorsToReplaceLight[color]);
	}

	fs.writeFileSync('./src/assets/light-' + metadata.file_id + ".svg", svgDataLight);

	fs.writeFileSync('./src/assets/dark-' + metadata.file_id + ".svg", svgDataDrk);

	// Convert SVG to PNG
	sharp('./src/assets/light-' + metadata.file_id + ".svg")
		.png()
		.toFile('./src/cache/light-' + metadata.file_id + ".png", (err) => {
			if(err) {
				console.error("Error during conversion to PNG ", err);
				return;
			}

			// The SVG to PNG conversion is successful at this point

			// Now let's delete the SVG file
			fs.rm('./src/assets/light-' + metadata.file_id + ".svg", (err) => {
				if(err) {
					console.error("Error deleting the SVG file", err);
				} else {
					console.log("SVG file deleted successfully");
				}
			});
		});

	sharp('./src/assets/dark-' + metadata.file_id + ".svg")
		.png()
		.toFile('./src/cache/dark-' + metadata.file_id + ".png", (err) => {
			if(err) {
				console.error("Error during conversion to PNG ", err);
				return;
			}

			// The SVG to PNG conversion is successful at this point

			// Now let's delete the SVG file
			fs.rm('./src/assets/dark-' + metadata.file_id + ".svg", (err) => {
				if(err) {
					console.error("Error deleting the SVG file", err);
				} else {
					console.log("SVG file deleted successfully");
				}
			});
		});
}