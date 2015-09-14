"use strict"

var gulp = require('gulp');
var del = require('del');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var svg2png = require('gulp-svg2png');
var fs = require('fs');
var exec = require('child_process').exec;

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
  return del([
    'dist/unpacked-dev',
    'dist/unpacked-prod',
    'dist/*.crx'
  ]);
});

gulp.task('manifest', ['copy:modules'],function(){
  for(var field of ['name', 'version', 'description']){
    mnf[field] = pkg[field];
  }
  fs.mkdirSync('tmp');
  fs.writeFileSync('tmp/manifest.json', JSON.stringify(mnf, null, 2));
  gulp.src('tmp/manifest.json')
    .pipe(gulp.dest('dist/unpacked-dev'));
  return del(['tmp']);
});

gulp.task('icon', function(){
  return gulp.src('res/icon.svg')
    .pipe(changed('src', {extension: '.png'}))
    .pipe(svg2png(0.5))
    .pipe(gulp.dest('src'))
})

gulp.task('copy:dev', ['clean', 'icon'], function(){
  return gulp.src(['src/**', '!src/js/**', '!src/**/*.md', '!manifest.json'])
    .pipe(gulp.dest('dist/unpacked-dev'));
});

gulp.task('copy:modules', ['copy:dev'], function(){
  return gulp.src([
    'src/js/modules/**',
    '!src/js/modules/**/background.js',
    '!src/js/modules/**/index.js'
  ]).pipe(gulp.dest('dist/unpacked-dev/modules/'));
})

gulp.task('browserify:content', ['lint:src', 'manifest'], function(){
  return browserify(['src/js/content.js'])
    .bundle()
    .pipe(source('content.js'))
    .pipe(gulp.dest('dist/unpacked-dev/js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist/unpacked-prod/js'));
});

gulp.task('browserify:background', ['lint:src', 'manifest'], function(){
  return browserify(['src/js/background.js'])
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('dist/unpacked-dev/js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist/unpacked-prod/js'));
});

gulp.task('browserify', ['browserify:content', 'browserify:background']);

gulp.task('copy:prod', ['browserify'], function(){
  return gulp.src(['dist/unpacked-dev/**', '!dist/unpacked-dev/js/*.js'])
    .pipe(gulp.dest('dist/unpacked-prod'));
});

gulp.task('watch', ['browserify'], function(){
  gulp.watch('src/js/**/*.js', ['browserify']);
  gulp.watch('src/html/**/*', ['copy:prod']);
})

gulp.task('default', ['copy:prod']);

gulp.task('build:chrome', ['copy:prod'], function(next){
  var commands = [
    './crxmake.sh ./dist/unpacked-prod ./xsiga-key.pem',
    'mv -v ./unpacked-prod.crx ./dist/' + pkg.name + '-' + pkg.version + '.crx'
  ]
  exec(commands.join(' && '),
  function(err, stdout, stderr){
    console.log(stdout);
    console.error(stderr);
    if(next) next(err);
  });
});
