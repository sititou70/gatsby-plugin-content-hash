import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import crypto from 'crypto';
import escapeStringRegexp from 'escape-string-regexp';

import { GatsbyNode } from 'gatsby';

// types
type PluginOption = {
  build_root_path: string | null;
  hashing_target_file_names: string[];
};

// settings
const PLUGIN_NAME = 'gatsby-plugin-content-hash';
const default_option: PluginOption = {
  build_root_path: null,
  hashing_target_file_names: ['app-data.json', 'page-data.json'],
};

// gatsby api handler
export const onPostBuild: GatsbyNode['onPostBuild'] = async (
  { reporter },
  user_option
) => {
  const option = { ...default_option, ...user_option };

  const build_root_path = option.build_root_path;
  if (build_root_path === null)
    throw new Error(`[${PLUGIN_NAME}] option: build_root_path is required!`);

  // calculate hashes
  const hashes = new Map<string, string>();
  for (const hashing_target_file_name of option.hashing_target_file_names) {
    const paths = glob.sync(
      path.join(build_root_path, '/**/', hashing_target_file_name),
      {
        nodir: true,
      }
    );

    const contents = (
      await Promise.all(paths.map((x) => fs.readFile(x)))
    ).reduce((s, x) => Buffer.concat([s, x]));

    const hash = crypto.createHash('md5').update(contents).digest('hex');

    hashes.set(hashing_target_file_name, hash);
  }

  // modify: add hash
  const modification_target_paths = glob.sync(
    path.join(build_root_path, '/**/*.{html,js}'),
    { nodir: true }
  );
  const modification_promises = modification_target_paths.map(
    (modification_target_path) => {
      let modification_content = fs
        .readFileSync(modification_target_path)
        .toString();

      for (const hashing_target_file_name of option.hashing_target_file_names) {
        const hash = hashes.get(hashing_target_file_name);
        if (hash === undefined) continue;

        modification_content = modification_content.replace(
          new RegExp(
            `${escapeStringRegexp(hashing_target_file_name)}(\\?[0-9a-z]{32})?`,
            'g'
          ),
          `${hashing_target_file_name}?${hash}`
        );
      }

      return fs.writeFile(
        modification_target_path,
        modification_content,
        'utf8'
      );
    }
  );

  await Promise.all(modification_promises);

  reporter.info(
    `[${PLUGIN_NAME}] modified ${modification_target_paths.length} HTML/JS files.`
  );
};
