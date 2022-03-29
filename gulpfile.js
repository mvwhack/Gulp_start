"use strict";

const syntax = "sass";

const {src, dest} = require("gulp");
//system
const gulp = require("gulp");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync").create();
const del = require("del");
const notify = require("gulp-notify");
// styles
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const gcmq = require("gulp-group-css-media-queries");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify-es").default;

// HTMl
const plumber = require("gulp-plumber");
const panini = require("panini");
// image
const imagemin = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const webp = require('gulp-webp');
//favicon
const favicons = require("gulp-favicons");

/* Paths */
const srcPath = "src/";
const distPath = "dist/";

const path = {
    build: {
        html: distPath,
        js: distPath + "assets/js/",
        css: distPath + "assets/css/",
        images: distPath + "assets/img/",
        imagesX2: distPath + "assets/img/@2x",
        svg: distPath + "assets/img/svg/",
        fonts: distPath + "assets/fonts/",
        video: distPath + "assets/video/",
        libs: distPath + "assets/libs/",
        fav: distPath + "assets/img/favicon",
    },
    src: {
        html: srcPath + "*.html",
        js: srcPath + "assets/js/*.js",
        css: srcPath + "assets/scss/*.scss",
        images:
            srcPath +
            "assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xgulml,json}",
        video: srcPath + "assets/video/**/*.{mp4,ogv}",
        libs: srcPath + "assets/libs/**/*",
        svg: srcPath + "assets/img/svg/**/*.svg",
        fav: srcPath + "assets/img//favicon/favicon.png",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    },
    watch: {
        html: srcPath + "**/*.html",
        js: srcPath + "assets/js/**/*.js",
        css: srcPath + "assets/scss/**/*.scss",
        images:
            srcPath +
            "assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        video: srcPath + "assets/video/**/*.{mp4,ogv}",
        libs: srcPath + "assets/libs/**/*",
        svg: srcPath + "assets/img/svg/**/*.svg",
        fav: srcPath + "assets/img//favicon/favicon.png",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    },
    clean: "./" + distPath,
};

function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath,
        },
    });
}

function html() {
    panini.refresh();
    return src(path.src.html, {
        base: srcPath,
    })
        .pipe(plumber())
        .pipe(
            panini({
                root: srcPath,
                layouts: srcPath + "layouts/",
                partials: srcPath + "partials/",
                helpers: srcPath + "helpers/",
                data: srcPath + "data/",
            })
        )
        .pipe(dest(path.build.html))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function css() {
    return src(path.src.css, {
        base: srcPath + "assets/scss/",
    })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: "SCSS Error",
                        message: "Error: <%= error.message %>",
                    })(err);
                    this.emit("end");
                },
            })
        )
        .pipe(
            sass({
                includePaths: "./node_modules/",
            })
        )
        .pipe(
            autoprefixer({
                cascade: true,
            })
        )
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(
            cssnano({
                zindex: false,
                discardComments: {
                    removeAll: true,
                },
            })
        )
        .pipe(removeComments())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".css",
            })
        )

        .pipe(dest(path.build.css))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function cssWatch() {
    return src(path.src.css, {
        base: srcPath + "assets/scss/",
    })
        .pipe(sourcemaps.init())
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: "SCSS Error",
                        message: "Error: <%= error.message %>",
                    })(err);
                    this.emit("end");
                },
            })
        )

        .pipe(
            sass({
                includePaths: "./node_modules/",
            })
        )
        .pipe(
            rename({
                suffix: ".min",
                extname: ".css",
            })
        )
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function js() {
    return src(path.src.js, {
        base: srcPath + "assets/js/",
    })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: "JS Error",
                        message: "Error: <%= error.message %>",
                    })(err);
                    this.emit("end");
                },
            })
        )
        .pipe(
            webpackStream({
                mode: "production",
                output: {
                    filename: "app.js",
                },
                module: {
                    rules: [
                        {
                            test: /\.(js)$/,
                            exclude: /(node_modules)/,
                            loader: "babel-loader",
                            query: {
                                presets: ["@babel/preset-env"],
                            },
                        },
                    ],
                },
            })
        )
        .pipe(dest(path.build.js))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function jsWatch() {
    return src(path.src.js, {
        base: srcPath + "assets/js/",
    })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: "JS Error",
                        message: "Error: <%= error.message %>",
                    })(err);
                    this.emit("end");
                },
            })
        )
        .pipe(
            webpackStream({
                mode: "development",
                devtool: "source-map",
                output: {
                    filename: "app.js",
                },
            })
        )
        .pipe(dest(path.build.js))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function images() {
    return src(path.src.images)
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true,
                }),
                imagemin.mozjpeg({
                    quality: 75,
                    progressive: true,
                }),
                imagemin.optipng({
                    optimizationLevel: 5,
                }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: true,
                        },
                        {
                            cleanupIDs: false,
                        },
                    ],
                }),
            ])
        )
        .pipe(dest(path.build.images))
        .pipe(webp())
        .pipe(dest(path.build.images))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function imagesWatch() {
    return src(path.src.images)
        .pipe(dest(path.build.images))
        .pipe(webp())
        .pipe(dest(path.build.images))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function svg() {
    return src(path.src.svg)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true,
                },
            })
        )
        .pipe(
            cheerio({
                run: function ($) {
                    $("[fill]").removeAttr("fill");
                    $("[stroke]").removeAttr("stroke");
                    $("[style]").removeAttr("style");
                    $("style").remove();
                },
                parserOptions: {
                    xmlMode: true,
                },
            })
        )
        .pipe(replace("&gt;", ">"))
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        sprite: "sprite.svg",
                    },
                },
            })
        )
        .pipe(dest(path.build.svg))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function fav() {
    return src(path.src.fav)
        .pipe(
            favicons({
                icons: {
                    appleIcon: true,
                    favicons: true,
                    online: false,
                    appleStartup: false,
                    android: false,
                    firefox: false,
                    yandex: false,
                    windows: false,
                    coast: false,
                },
            })
        )
        .pipe(dest(path.build.fav));
}

function clean() {
    return del(path.clean);
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function video() {
    return src(path.src.video)
        .pipe(dest(path.build.video))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function libs() {
    return src(path.src.libs)
        .pipe(dest(path.build.libs))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], cssWatch);
    gulp.watch([path.watch.js], jsWatch);
    gulp.watch([path.watch.images], imagesWatch);
    gulp.watch([path.watch.svg], svg);
    gulp.watch([path.watch.fonts]);
    gulp.watch([path.watch.video]);
    gulp.watch([path.watch.libs]);
}

const build = gulp.series(
    clean,
    gulp.parallel(html, css, js, images, fonts, video, libs, svg, fav)
);
const watch = gulp.parallel(build, watchFiles, serve);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fav = fav;
exports.fonts = fonts;
exports.svg = svg;
exports.video = video;
exports.libs = libs;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
