import fs from "fs";
import path from "path";

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 */
export function filewalker(
	dir: any,
	done: {
		(err: any, res: any): void;
		(arg0: null, arg1: any[] | undefined): void;
	}
) {
	let results: any[] = [];

	fs.readdir(dir, function (err: any, list: any[]) {
		if (err) return done(err, results);

		let pending = list.length;

		if (!pending) return done(null, results);

		list.forEach(function (file: any) {
			file = path.resolve(dir, file);

			fs.stat(file, function (err: any, stat: { isDirectory: () => any }) {
				// If directory, execute a recursive call
				if (stat && stat.isDirectory()) {
					// Add directory to array [comment if you need to remove the directories from the array]
					results.push(file);

					filewalker(file, function (err: any, res: any) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);

					if (!--pending) done(null, results);
				}
			});
		});
	});
}