# gulp-csslint-sass-reporter

A console reporter for csslint that maps errors back to the original sass/scss files using sass/scss source maps.

## Installation

Install `gulp-csslint-sass-reporter` as a development dependency.

```bash
npm install --save-dev gulp-csslint-sass-reporter
```

`gulp-csslint`, `gulp-sourcemaps`, and `gulp-sass` should also be installed.

## Usage

Sass source maps are required in order to map errors back onto the original `sass` or `scss` files. If sass source maps are not available, an error will be thrown.

```javascript
var gulp = require('gulp');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var sassReporter = require('gulp-csslint-sass-reporter');

gulp.task('sass', function () {
  return gulp.src('src/**/*.s+(a|c)ss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter())
    .pipe(gulp.dest('build'));
});
```

## API

### sassReporter()

Errors will be reported in all files and `@imports`.

### sassReporter(pattern)

#### pattern

Type: `String` or `Array`

A valid `pattern` for [`globule.isMatch()`](https://www.npmjs.com/package/globule#globule-ismatch).

If an error is in an imported file, you can specify a whitelist `pattern` to filter out unwanted errors in the imported files. Only imported files that **match** the pattern will emit errors. This only applies to imports, any file that is in the pipeline directly will always have linting errors reported.

For example, if you `@import` an external sass/scss file from `bower_components` and don't care about linting errors in it, you can whitelist the results to only your sources.

**src/example.scss**

```sass
@import "bower_components/my-module/src/hello.scss";
@import "bower_components/my-module/src/world.scss";
```

**gulpfile.js**

```javascript
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var sassReporter = require('gulp-csslint-sass-reporter');

gulp.task('sass', function () {
  return gulp.src('src/**/*.s+(a|c)ss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter('src/**/*.s+(a|c)ss')) // errors in bower_components will be ignored
    .pipe(gulp.dest('build'));
});
```
## Error Handling

Errors will be written to the console as they are encountered. An exception will be thrown after reporting all errors.

To capture that exception so that the pipline will continue, add a listener to the `error` event and then you can handle the error as you like.

```javascript
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var sassReporter = require('gulp-csslint-sass-reporter');

var shouldThrow = true;

gulp.task('sass', function () {
  return gulp.src('src/**/*.s+(a|c)ss')
    .pipe(sourcemaps.init()) // sourcemaps are required
    .pipe(sass())
    .pipe(csslint())
    .pipe(sassReporter())
    .on('error', function (err) {
      // decide whether to throw the error
      if (shouldThrow) {
        throw err;
      }
    })
    .pipe(gulp.dest('build'));
});
```
