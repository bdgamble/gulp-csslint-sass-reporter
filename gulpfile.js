'use strict';

var assert = require('assert');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');

var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var sassReporter = require('./');

var isWatch = false;

gulp.task('eslint', function () {
  return gulp.src('*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(isWatch, eslint.failAfterError()));
});

// Verify when linting, when errors are found an error is emitted
gulp.task('sassHasErrorsTest', function (cb) {
  var error;
  gulp.src('test/example.scss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter())
    .on('error', function (err) {
      error = err;
    })
    .on('end', function () {
      assert(error, 'Linting errors should have been found in elements.');
      cb(!error);
    });
});

// Verify when linting, when errors are not found an error is not emitted
gulp.task('sassHasNoErrorsTest', function (cb) {
  var error;
  gulp.src('test/passing.scss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter())
    .on('error', function (err) {
      error = err;
    })
    .on('end', function () {
      assert(!error, 'Linting errors should not have been found in passing.');
      cb(!!error);
    });
});

// Verify when linting, when errors are found and in whitelisted imported files, an error is emitted
gulp.task('sassHasErrorsNotFilteredOutByWhitelistTest', function (cb) {
  var error;
  gulp.src('test/example.scss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter('test/elements.scss'))
    .on('error', function (err) {
      error = err;
    })
    .on('end', function () {
      assert(error, 'Linting errors should have been found in elements.');
      cb(!error);
    });
});

// Verify when linting, when errors are found but not in whitelisted imported files, an error is not emitted
gulp.task('sassHasErrorsFilteredOutByWhitelistTest', function (cb) {
  var error;
  gulp.src('test/example.scss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter('test/passing.scss'))
    .on('error', function (err) {
      error = err;
    })
    .on('end', function () {
      assert(!error, 'Linting errors should not have been found in example or passing.');
      cb(!!error);
    });
});

gulp.task('watch', function () {
  isWatch = true;
  gulp.watch(['*.js', 'test/*.scss'], ['default']);
});

gulp.task('default', [
  'eslint',
  'sassHasErrorsTest',
  'sassHasNoErrorsTest',
  'sassHasErrorsNotFilteredOutByWhitelistTest',
  'sassHasErrorsFilteredOutByWhitelistTest'
]);
