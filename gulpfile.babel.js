import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import {create} from 'browser-sync';
const browserSync = create();

gulp.task('log', function() {
  console.log('Hello from gulp');
});

gulp.task('pug', function() {
  const LOCAL_DATA = {text: 'Hello from Data'};
  return gulp.src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      locals: LOCAL_DATA
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
  return gulp.src('src/js/index.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('browserSync', ['pug', 'sass', 'js'], function() {
  browserSync.init({
    port: 4444,
    browser: 'google chrome canary',
    server: './dist',
  });
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/pug/*.pug', ['pug']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('dist/*').on('change', browserSync.reload);
});

gulp.task('default', ['browserSync']);
