const { src, dest, series, watch } = require(`gulp`);
const sass = require(`gulp-sass`);
const htmlCompressor = require(`gulp-htmlmin`);
const cache = require(`gulp-cache`);
const htmlValidator = require(`gulp-html`);
const imageCompressor = require(`gulp-imagemin`);
const jsCompressor = require(`gulp-uglify`);
const babel = require(`gulp-babel`);
const cssLinter = require(`gulp-stylelint`);
const jsLinter = require(`gulp-eslint`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;
const browserify = require(`browserify`);
const fs = require(`fs`);

/*Directory Names */
const sassSrc = `dev/sass/main.scss`;
const sassDest = `prod/css/`;
const htmlSrc = `dev/*.html`;
const htmlDest = `prod/`;
const imgSrc = `dev/uncompressed-images/**/`;
const imgDest = `prod/images/`;
const jsSrc = `dev/`;
const jsDest = `prod/`;
const serveSrc = `dev/`;
const libSrc = `dev/chrome-extesion-test/libs`;
const libDest = `prod/lib`;
const tfSrc = 'dev/chrome-extesion-test/manifest.json';
const tfDest = 'prod/manifest.json';

let compileCSS = () => {
  return src(sassSrc)
    .pipe(
      sass({
        outputStyle: `expanded`,
        precision: 10
      }).on(`error`, sass.logError)
    )
    .pipe(dest(sassDest));
};

let compileCSSdev = () => {
  return src(sassSrc)
    .pipe(
      sass({
        outputStyle: `expanded`,
        precision: 10
      }).on(`error`, sass.logError)
    )
    .pipe(dest(`dev/css/`));
};

let validateHTML = () => {
  return src([`dev/*.html`, `prod/*.html`]).pipe(htmlValidator());
};

let compressHTML = () => {
  return src(htmlSrc)
    .pipe(htmlCompressor({ collapseWhitespace: true }))
    .pipe(dest(htmlDest));
};

let compressImages = () => {
  return src([
    `${imgSrc}*.png`,
    `${imgSrc}*.jpg`,
    `${imgSrc}*.svg`,
    `${imgSrc}*.gif`
  ])
    .pipe(
      cache(
        imageCompressor({
          optimizationLevel: 3, // For PNG files. Accepts 0 – 7; 3 is default.
          progressive: true, // For JPG files.
          multipass: false, // For SVG files. Set to true for compression.
          interlaced: false // For GIF files. Set to true for compression.
        })
      )
    )
    .pipe(dest(imgDest));
};

let compressJS = () => {
  return src(`${jsSrc}/chrome-extesion-test/content.js`)
    .pipe(babel())
    .pipe(jsCompressor())
    .pipe(dest(jsDest));
};

let transferFile = (done) => {

  let writeStream = fs.createWriteStream(`${tfDest}`);

  writeStream.on('close', ()=>{
    done();
  });
  
  fs.createReadStream(`${tfSrc}`).pipe(writeStream);
}

let browserifyTask = () => {
  return browserify({
    entries: 'dev/app.js',
    debug: true
  })
  .bundle()
  .pipe(fs.createWriteStream(`prod/background.js`));
}

let lintCSS = () => {
  return src(`${sassDest}/*.css`).pipe(
    cssLinter({
      failAfterError: true,
      reporters: [{ formatter: `verbose`, console: true }]
    })
  );
};

let lintJS = () => {
  return src(`${jsSrc}/*.js`)
    .pipe(jsLinter())
    .pipe(jsLinter.formatEach(`compact`, process.stderr));
};

let serve = () => {
  browserSync({
    notify: true,
    reloadDelay: 100, // A delay is sometimes helpful when reloading at the
    server: {
      // end of a series of tasks.
      baseDir: [`${serveSrc}`, `html`]
    }
  });

  watch(`index.html`).on(`change`, reload);
  watch(`sass/main.scss`, series(compileCSS)).on(`change`, reload);
};


let transferLibs = done => {
  const ncp = require("ncp").ncp;
  ncp.limit = 16;

  return ncp(libSrc, libDest, err => {
    if (err) {
      return console.error(err);
    }
    console.log("done!");
    done();
  });
};

exports.build = series(
  compressHTML,
  compressJS,
  compressImages,
  compileCSS,
  serve
);
exports.serve = series( compressJS, transferLibs, transferFile, browserifyTask);
exports.compileCSSdev = compileCSSdev;
exports.compressJS = compressJS;
exports.compressImages = compressImages;
exports.compressHTML = compressHTML;
exports.validateHTML = validateHTML;
exports.compileCSS = compileCSS;
exports.default = series(
  compileCSS,
  compressJS,
  browserifyTask,
  validateHTML,
  compressHTML,
  transferLibs,
  transferFile,
  compressImages
);
exports.transferLibs = transferLibs;
exports.browserifyTask = browserifyTask;
exports.transferFile = transferFile;