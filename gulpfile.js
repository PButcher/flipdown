const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const cssToJs = require('gulp-css-to-js')
const mergeStream = require('merge-stream')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')

// TODO: ugly with sourcemaps

gulp.task('default', () => {
  return mergeStream(
    gulp
      .src('src/**/*.js')
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(uglify()),
    gulp
      .src('src/**/*.css')
      .pipe(uglifycss())
      .pipe(cssToJs())
  )
    .pipe(concat('flipdown.min.js'))
    .pipe(gulp.dest('dist'))
})
