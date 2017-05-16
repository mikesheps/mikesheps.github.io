import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import {create} from 'browser-sync';
import data from './src/pug/data/data';
const browserSync = create();

// JS
import uglify from 'gulp-uglify';
import pump from 'pump';
import concat from 'gulp-concat';
import rename from 'gulp-rename';

// Used to clear out /dist folder when we run gulp
import del from 'del';

//Send to github pages
import ghPages from 'gulp-gh-pages';

gulp.task('log', function() {
  console.log('Hello from gulp');
});


gulp.task('js', function() {
    return gulp.src([
      'src/js/vendor/modernizr.js',
      'src/js/vendor/headroom.js',
      'src/js/scripts.js',
    ])
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist'));
});



gulp.task('pug', function() {
  // const LOCAL_DATA = {text: 'Hello from Data'};
  return gulp.src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      locals: data
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

// gulp.task('js', function() {
//   return gulp.src('src/js/index.js')
//     .pipe(gulp.dest('./dist'));
// });

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('browserSync', ['pug', 'sass', 'js', 'img'], function() {
  browserSync.init({
    port: 4444,
    browser: 'google chrome canary',
    server: './dist',
  });
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/pug/**/*.pug', ['pug']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('dist/*').on('change', browserSync.reload);
});


// Clearing task
gulp.task('clean', function () {
  return del([
    //'dist/**/*',
    'dist/*.html',
    'dist/*.css',
    'dist/*.js'
    // we don't want to clean this file though so we negate the pattern
    //'!dist/img'
  ]);
});



gulp.task('moveCNAME', function() {
  return gulp.src('CNAME')
    .pipe(gulp.dest('./dist'));
});

gulp.task('moveModernizer', function() {
  return gulp.src('src/js/vendor/modernizr.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('moveDocs', function() {
  return gulp.src('src/docs/*')
    .pipe(gulp.dest('./dist/docs'));
});

gulp.task('moveSitemap', function() {
  return gulp.src('src/sitemap.xml')
    .pipe(gulp.dest('./dist/'));
});



// Deploy to github pages
gulp.task('deploy', ['moveCNAME', 'moveModernizer', 'moveDocs', 'moveSitemap'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      branch: 'master'
    }));
});

gulp.task('default', ['clean', 'browserSync']);
