var gulp = require('gulp');
var del = require('del');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var svg2png = require('gulp-svg2png');
var zip = require('gulp-zip');
var fs = require('fs');

var mnf = require('./src/manifest.json');
var pkg = require('./package.json');

gulp.task('lint:src', function(){
  return gulp.src([
    'src/js/**/*.js',
    '!src/js/vendor/*.js',
    '!src/js/**/*.spec.js'
  ]).pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:test', function(){
  return gulp.src('src/js/**/*.spec.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function(){
  return del('dist/**/*');
});

gulp.task('manifest', ['copy:modules'],function(){
  for(var field of ['name', 'version', 'description']){
    mnf[field] = pkg[field];
  }
  fs.mkdirSync('tmp');
  fs.writeFileSync('tmp/manifest.json', JSON.stringify(mnf, null, 2));
  gulp.src('tmp/manifest.json')
    .pipe(gulp.dest('dist/unpacked'));
  return del(['tmp']);
});

gulp.task('icon', function(){
  return gulp.src('res/icon.svg')
    .pipe(changed('src', {extension: '.png'}))
    .pipe(svg2png(0.5))
    .pipe(gulp.dest('src'));
});

gulp.task('copy:dev', ['clean', 'icon'], function(){
  return gulp.src(['src/**', '!src/js/**', '!src/**/*.md', '!manifest.json'])
    .pipe(gulp.dest('dist/unpacked'));
});

gulp.task('copy:modules', ['copy:dev'], function(){
  return gulp.src([
    'src/js/modules/**',
    '!src/js/modules/**/background.js',
    '!src/js/modules/**/index.js'
  ]).pipe(gulp.dest('dist/unpacked/modules/'));
});

gulp.task('browserify:content', ['lint:src', 'manifest'], function(){
  return browserify(['src/js/content.js'])
    .bundle()
    .pipe(source('content.js'))
    .pipe(gulp.dest('dist/unpacked/js'));
});

gulp.task('browserify:background', ['lint:src', 'manifest'], function(){
  return browserify(['src/js/background.js'])
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('dist/unpacked/js'));
});

gulp.task('browserify', ['browserify:content', 'browserify:background']);

gulp.task('uglify:main', ['browserify'], function(){
  return gulp.src('dist/unpacked/js/**')
    .pipe(uglify())
    .pipe(gulp.dest('dist/unpacked-prod/js'));
});

gulp.task('uglify:modules', ['copy:modules'], function(){
  return gulp.src('dist/unpacked/modules/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/unpacked-prod/modules'));
})

gulp.task('copy:prod', ['uglify:main', 'uglify:modules'], function(){
  return gulp.src(['dist/unpacked/**', '!dist/unpacked/js/*.js'])
    .pipe(gulp.dest('dist/unpacked-prod'));
});

gulp.task('watch', ['browserify'], function(){
  gulp.watch('src/**/*', ['browserify']);
});

gulp.task('default', ['browserify']);

gulp.task('build:webstore', ['copy:prod'], function(){
  return gulp.src('dist/unpacked-prod')
    .pipe(zip(mnf.name+'-'+mnf.version+'.zip'))
    .pipe(gulp.dest('dist'));
});
