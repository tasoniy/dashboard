const {src, dest, watch, series} = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync");
const exp = require("constants");

sass.compiler = require("dart-sass");

function scssTask() {
  return src("app/scss/style.scss", {sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", {sourcemaps: "."}));
}

function jsTask() {
  return src("app/js/script.js", {sourcemaps: true})
    .pipe(babel({presets: ["babel/preset-env"]}))
    .pipe(terser())
    .pipe(dest("dist", {sourcemaps: "."}))
}

function browserSyncServer(cb) {
  browsersync.init({
    sever: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top:"auto",
        bottom: "0",
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask() {
  watch("*.html", browserSyncReload);
  watch(["app/scss/**/*.js"], series(scssTask,jsTask, browserSyncReload))
}


exports.default = series(scssTask,jsTask, browserSyncServer, watchTask);