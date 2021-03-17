/* eslint-disable import/no-extraneous-dependencies */
import { basename } from 'path';
import { parseSync } from 'svgson';
import { hash, readSvg } from '../helpers';

function generateHashedKey({ name, attributes }) {
  return hash(JSON.stringify([name, attributes]));
}

/**
 * Build an object in the format: `{ <name>: <contents> }`.
 * @param {string[]} svgFiles - A list of filenames.
 * @param {Function} getSvg - A function that returns the contents of an SVG file given a filename.
 * @returns {Object}
 */
export default (svgFiles, iconsDirectory, renderUniqueKey = false) =>
  svgFiles
    .map(svgFile => {
      const name = basename(svgFile, '.svg');
      const svg = readSvg(svgFile, iconsDirectory);
      const contents = parseSync(svg);

      if (renderUniqueKey) {
        contents.children = contents.children.map(child => {
          child.attributes.key = generateHashedKey(child);

          return child;
        });
      }

      return { name, contents };
    })
    .reduce((icons, icon) => {
      icons[icon.name] = icon.contents;
      return icons;
    }, {});
