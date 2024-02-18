'use strict'

const fs = require('fs');
const path = require('path');
const docfxBuilder = require('./events/before/docfx');
const sitemap = require('./events/after/sitemap');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = function (config) {
    config.on('eleventy.before', async ({ dir, runMode, outputMode }) => {
        await docfxBuilder().then(() => console.log())
                            .catch((reason) => {
                                console.log(reason)
                                console.log();
                            });
    });

    config.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
        //  Since we use docfx to genereate some documents, we can't rely
        //  the file list in the `results` object, since it only contains
        //  the file generated by 11ty itself.
        //  Intead we'll need to manually read the files ourselves
        const sitePath = path.join(process.cwd(), dir.output);
        const files = fs.readdirSync(sitePath, { recursive: true }).filter((file) => file.endsWith('.html'));

        sitemap(files, sitePath);
    });
}