const { promises: fs } = require('fs');
const outlineStroke = require('svg-outline-stroke');
const { parse, stringify } = require('svgson');

const inputDir = `./icons/`;
const outputDirs = {
  'converted_icons_200': '1',
  'converted_icons_300': '1.5',
  'converted_icons': '2',
  'converted_icons_500': '2.5',
  'converted_icons_600': '3'
}

async function init() {
  try {
    for (const directory of Object.keys(outputDirs)) {
      await fs.mkdir(`./${directory}`);
    }

    const files = await fs.readdir(inputDir);
    for (const file of files) {
      const icon = await fs.readFile(`${inputDir}${file}`);
      const scaled = await parse(icon.toString(), {
        transformNode: transformForward,
      });
      for (const [directory, width] of Object.entries(outputDirs)) {
        scaled.attributes['stroke-width'] = width;
        const outlined = await outlineStroke(stringify(scaled));
        const outlinedWithoutAttrs = await parse(outlined, {
          transformNode: transformBackwards,
        });
        await fs.writeFile(`./${directory}/${file}`, stringify(outlinedWithoutAttrs));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

init();

function transformForward(node) {
  if (node.name === 'svg') {
    return {
      ...node,
      attributes: {
        ...node.attributes,
        width: 960,
        height: 960,
      },
    };
  }
  return node;
}

function transformBackwards(node) {
  if (node.name === 'svg') {
    const { width, height, ...attributes } = node.attributes;
    return {
      ...node,
      attributes,
    };
  }
  return node;
}
