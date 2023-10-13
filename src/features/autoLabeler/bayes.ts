// ---------------------------------------------------------------
//This is a naive bayes implementation for labelling github issues
// ---------------------------------------------------------------

import {GithubAPI} from "../webHandler/githubAPI";

let p_bug: number = 0, p_fr: number = 0, p_sev_low: number = 0, p_sev_mid: number = 0,p_sev_high: number = 0, p_crash: number = 0 //probabilities for each label
let bug_word: Record<string, number> = {}, fr_word: Record<string, number> = {}, sev_low_words: Record<string, number> = {}, sev_mid_word: Record<string, number> = {}, sev_high_word: Record<string, number> = {}, crash_words : Record<string, number>= {} //words in label and how often they appear
let bug_amount = 0, fr_amount = 0, crash_amount = 0, sev_low_amount = 0, sev_mid_amount = 0, sev_high_amount = 0;
export function label(text: string){
	let local_p_bug = p_bug;
	let local_p_fr = p_fr;
	let local_p_crash = p_crash;

	let local_p_sev_low = p_sev_low;
	let local_p_sev_mid = p_sev_mid;
	let local_p_sev_high = p_sev_high;

	text.toLowerCase().split(" ").forEach(word => {
		word = word.replace(/[.,:;!?"'\n()\[\]{}]/g, '');
		local_p_bug *= bug_word[word] || (1 / (bug_amount + Object.keys(bug_word).length + 1));
		local_p_fr *= fr_word[word] || (1 / (fr_amount + Object.keys(fr_word).length + 1));
		local_p_crash *= crash_words[word] || (1 / (crash_amount + Object.keys(crash_words).length + 1));

		local_p_sev_low *= sev_low_words[word] || (1 / (sev_low_amount + Object.keys(sev_low_words).length + 1));
		local_p_sev_mid *= sev_mid_word[word] || (1 / (sev_mid_amount + Object.keys(sev_mid_word).length + 1));
		local_p_sev_high *= sev_high_word[word] || (1 / (sev_high_amount + Object.keys(sev_high_word).length + 1));

	})


	console.log(`Local Probabilities Type: Bug: ${local_p_bug}, FR: ${local_p_fr}, Crash: ${local_p_crash}`);
	console.log(`Local Probabilities Severity: Sev Low: ${local_p_sev_low}, Sev Mid: ${local_p_sev_mid}, Sev High: ${local_p_sev_high}`);

	let labels = []
	if (local_p_bug > local_p_fr && local_p_bug > local_p_crash) {
		labels.push(LabelsEnum.BUG);
	} else if (local_p_fr > local_p_bug && local_p_fr > local_p_crash) {
		labels.push(LabelsEnum.FR);
	} else if (local_p_crash > local_p_bug && local_p_crash > local_p_fr) {
		labels.push(LabelsEnum.CRASH);
	}

	if (local_p_sev_low > local_p_sev_mid && local_p_sev_low > local_p_sev_high) {
		labels.push(LabelsEnum.SEVERITY_LOW);
	} else if (local_p_sev_mid > local_p_sev_low && local_p_sev_mid > local_p_sev_high) {
		labels.push(LabelsEnum.SEVERITY_MID);
	} else if (local_p_sev_high > local_p_sev_low && local_p_sev_high > local_p_sev_mid) {
		labels.push(LabelsEnum.SEVERITY_HIGH);
	}
	console.log(labels)
	return labels
}

export async function bayes(manualWeights: Record<string, number> = {}) {

	const issues = await GithubAPI.getIssues("lo-cafe", "winston") as Issue[]
	const totalSamples = issues.length;
	let labelCounts: Record<string, number> = {};
	let weights: Record<string, number> = {};

	// Count the labels
	for (const issue of issues) {
		issue.labels.forEach(label => {
			if(!labelCounts[label.name]) {
				labelCounts[label.name] = 0;
			}
			labelCounts[label.name] += 1;
		});
	}
	const numOfClasses = Object.keys(labelCounts).length;

	// Compute class weights
	for (const label in labelCounts) {
		weights[label] = totalSamples / (numOfClasses * labelCounts[label]);
	}

	// Apply manual weight adjustments
	for (let label in manualWeights) {
		if (weights[label] !== undefined) {
			weights[label] *= manualWeights[label];
		}
	}
	

	for (const issue of issues) {
		const text = issue.title.toLowerCase() + " " + (issue.body ?? "").toLowerCase()
		issue.labels.forEach((label) => {
			switch (label.name) {
				case LabelsEnum.BUG:
					p_bug++
					text.split(" ").forEach((word ) => {
						bug_word[word] = (bug_word[word] || 0) + 1;
					})
					break
				case LabelsEnum.CRASH:
					text.split(" ").forEach((word ) => {
						crash_words[word] = (crash_words[word] || 0) + 1;
					})
					p_crash++
					break
				case LabelsEnum.FR:
					text.split(" ").forEach((word ) => {
						fr_word[word] = (fr_word[word] || 0) + 1;
					})
					p_fr++
					break
				case LabelsEnum.SEVERITY_LOW:
					text.split(" ").forEach((word ) => {
						sev_low_words[word] = (sev_low_words[word] || 0) + 1;
					})
					p_sev_low++
					break
				case LabelsEnum.SEVERITY_MID:
					text.split(" ").forEach((word ) => {
						sev_mid_word[word] = (sev_mid_word[word] || 0) + 1;
					})
					p_sev_mid++
					break
				case LabelsEnum.SEVERITY_HIGH:
					text.split(" ").forEach((word ) => {
						sev_high_word[word] = (sev_high_word[word] || 0) + 1;
					})
					p_sev_high++
					break
			}
		})
	}

	bug_amount = p_bug
	fr_amount = p_fr
	crash_amount = p_crash

	sev_low_amount = p_sev_low
	sev_mid_amount = p_sev_mid
	sev_high_amount = p_sev_high

	p_bug = p_bug / issues.length
	p_fr = p_fr / issues.length
	p_crash = p_crash / issues.length

	p_sev_low = p_sev_low / issues.length
	p_sev_mid = p_sev_mid / issues.length
	p_sev_high = p_sev_high / issues.length

	for(let word in sev_low_words) {
		sev_low_words[word] = sev_low_words[word] / sev_low_amount;
	}
	for(let word in sev_mid_word) {
		sev_mid_word[word] = sev_mid_word[word] / sev_mid_amount;
	}
	for(let word in sev_high_word) {
		sev_high_word[word] = sev_high_word[word] / sev_high_amount;
	}

	for(let word in bug_word) {
		bug_word[word] = bug_word[word] / bug_amount;
	}
	for(let word in fr_word) {
		fr_word[word] = fr_word[word] / fr_amount;
	}
	for(let word in crash_words) {
		crash_words[word] = crash_words[word] / crash_amount;
	}
}

enum LabelsEnum {
	BUG = "bug/fix",
	CRASH  = "bug=causes crash",
	FR = "feature/enhancement",
	SEVERITY_LOW = "severity/priority=low",
	SEVERITY_MID = "severity/priority=medium",
	SEVERITY_HIGH = "severity/priority=high",
}

interface Issue {
	title: string,
	body: string
	labels: Label[]
}

interface Label {
	name: string,
	description: string
}