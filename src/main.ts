import { fs, path } from '../deps.ts'

// internal structure used by `schema.json`
interface schema {
	[category: string]: {
		files: string[]
	}
}

const _dirname = path.dirname(path.fromFileUrl(import.meta.url))

function extractCommentName(string: string): string {
	const charOfSpace = string.indexOf(" ");
	if (charOfSpace === -1) {
		return string.slice(1)
	} else {
		return string.slice(charOfSpace + 1);
	}
}

function isKnownComment(schema: schema, line: string) {
	if (!line.startsWith('#')) return false

	for (const category of Object.keys(schema)) {
		if (extractCommentName(line) === category) {
			return true;
		}
	}
	return false
}

function isUnknownComment(schema: schema, line: string) {
	if (!line.startsWith("#")) return false;

	return !isKnownComment(schema, line)
}

function addEntryToCategories(categories: categories, currentCategory: string, currentEntry: entry): void {
	if (!categories[currentCategory]) categories[currentCategory] = [];
	categories[currentCategory].push(currentEntry);
}

// how we track each category in this code
interface categories {
  [category: string]: entry[];
}

interface entry {
  // any comments above the line (these must be preserved)
	text: string;
	comments: string[];
}

function sort(schema: schema, gitignoreContents: string): string {

	// const customCategories: categories = {}
	// const categories: categories = {}

	// // this extracts the data from the gitignore file
	// // putting it in `categories`
	// {
	// 	const lines = gitignoreContents.split("\n");
	// 	let currentCategory: string = "";
	// 	let currentEntry: entry = {
	// 		text: "",
	// 		comments: [],
	// 	};
	// 	for (let i = 0; i < lines.length; ++i) {
	// 		const line = lines[i];

	// 		// ignore
	// 		if (line.trim() === "") continue;
	// 		if (isKnownComment(schema, line)) {
	// 			if (currentCategory !== "") {
	// 				addEntryToCategories(categories, currentCategory, currentEntry);
	// 				currentEntry = { text: "", comments: [] };
	// 			}

	// 			currentCategory = extractCommentName(line);
	// 		} else if (isUnknownComment(schema, line)) {
	// 			currentEntry.comments.push(extractCommentName(line));
	// 		} else {
	// 			currentEntry.text = line;
	// 			addEntryToCategories(categories, currentCategory, currentEntry);
	// 			currentEntry = { text: "", comments: [] };
	// 		}
	// 	}

	// 	// ensure the last known comment gets added to 'categories'
	// 	addEntryToCategories(categories, currentCategory, currentEntry);
	// }


	// console.log(categories)
	// console.log(customCategories)


	// let outputGitignore = ""
	// for (const category of Object.keys(categories)) {
	// 	const entries = categories[category]

	// 	outputGitignore += "# " + category + "\n";
	// 	for (const entry of entries) {
	// 		// we ensure entry.comments.length > 0  since it'll not run
	// 		// any iterations through for loop below
	// 		if (entry.text === "" && entry.comments.length > 0) {
	// 			outputGitignore += "\n";
	// 			console.info(`comment removed: '${entry.comments}' since it's not above a gitignore entry`)
	// 			continue
	// 		}

	// 		for (const comment of entry.comments) {
	// 			outputGitignore += '# ' + comment + '\n'
	// 		}

	// 		outputGitignore += entry.text + "\n";
	// 	}
	// }

	// return outputGitignore;
}

export async function sortGitignore() {
	const [ schema, gitignoreContents ] = await Promise.all([
		fs.readJson(path.join(_dirname, './schema.json')),
		Deno.readTextFile('./.gitignore')
	]) as [ schema, string ]

	const newGitignoreContents = await sort(schema, gitignoreContents)
	await Deno.writeTextFile('./test.gitignore', newGitignoreContents)
}
