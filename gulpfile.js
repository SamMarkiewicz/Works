var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    slim = require("gulp-slim"),
    connect = require('gulp-connect'),
    del = require('del');

// Convert .slim to .html

gulp.task('slim', function(){
  gulp.src("source/*.slim")
  .pipe(slim({
    pretty: true
  }))
  .pipe(gulp.dest("build"))
  .pipe(connect.reload())
  .pipe(notify({ message: 'Slim task complete' }));
});

// Process for styles, include sass prepros, autoprefixer and minify

gulp.task('styles', function(){
  return gulp.src('source/sass/style.sass')
  .pipe(sass({style: 'expanded',  "sourcemap=none": true}))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('build/css'))
  .pipe(minifycss())
  .pipe(gulp.dest('build/css'))
  .pipe(connect.reload())
  .pipe(notify({ message: 'Styles task complete'}));
});

// Image optimization w/cache to avoid re-compressing the same images

gulp.task('images', function() {
  return gulp.src('source/images/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(gulp.dest('build/images'))
  .pipe(connect.reload())
  .pipe(notify({ message: 'Images task complete' }));
});

// Clean the destination folder

gulp.task('clean', function(cb) {
  del(['build/css', 'build/images', 'build/*.html'], cb);
});


// Create a webserver with liveReload @ localhost:8080

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

// Default task

gulp.task('default', ['clean', 'webserver', 'watch'], function() {
  gulp.start('slim', 'styles', 'images');
});

// Watch !

gulp.task('watch', function() {

  // Watch .slim files

  gulp.watch('source/*.slim', ['slim']);

  // Watch .sass files
  gulp.watch('source/sass/*.sass', ['styles']);

  // Watch .js files
  //gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('source/images/**/*', ['images']);


});
