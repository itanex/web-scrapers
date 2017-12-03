var gulp = require('gulp');
var clean = require('gulp-rimraf');


gulp.task('build-clean', [], function () {
    console.log("Clean all files in build folder");

    return gulp
        .src('docs/*', { read: false })
        .pipe(clean());
});

/**
 * Push build to docs folder
 */
gulp.task('build', ['build-clean'], function () {
    console.log("Updated all documentation");

    return gulp
        .src(["./scrapes/**/index.html", "./scrapes/**/styles.css", "./scrapes/**/scripts.js"])
        .pipe(gulp.dest('docs'))
});