import gulp from 'gulp'
import del from 'del'
import changed from 'gulp-changed'
import jshint from 'gulp-jshint'
import svg2png from 'gulp-svg2png'
import zip from 'gulp-zip'
import babel from 'gulp-babel'
import fs from 'fs'
import webpack from 'webpack'
import gutil from 'gulp-util'
import uglify from 'gulp-uglify'

import mnf from './src/manifest.json'
import pkg from './package.json'
import wpConfig from './webpack.config.js'

gulp.task('clean', () => {
  return del('dist/**/*')
})

gulp.task('manifest', (next) => {
  for(let field of ['name', 'version', 'description']){
    mnf[field] = pkg[field]
  }
  fs.mkdir('tmp', function(err){
    if(err && err.code != 'EEXIST') next(err)
    fs.writeFile('tmp/manifest.json', JSON.stringify(mnf, null, 2), () => {
      next()
    })
  })
})

gulp.task('icon', () => {
  return gulp.src('res/icon.svg')
    .pipe(changed('src', {extension: '.png'}))
    .pipe(svg2png(0.5))
    .pipe(gulp.dest('src'))
})

gulp.task('webpack', (next) => {
  webpack(wpConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({}))
    next()
  })
})


gulp.task('copy:dev', ['clean', 'icon', 'webpack', 'manifest'], () => {
  return gulp.src(['tmp/**', 'src/icon.png'])
    .pipe(gulp.dest('dist/unpacked'))
})

gulp.task('make:unpacked', ['copy:dev'], () => {
  return del(['tmp'])
})

gulp.task('default', ['make:unpacked'])

gulp.task('minify', ['make:unpacked'], () => {
  return gulp.src(['dist/unpacked/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/unpacked-prod'))
})

gulp.task('copy:prod', ['minify'], () => {
  return gulp.src(['dist/unpacked/**', '!dist/unpacked/**/*.js'])
    .pipe(gulp.dest('dist/unpacked-prod'))
})

gulp.task('build:webstore', ['copy:prod'], () => {
  return gulp.src('dist/unpacked-prod/**')
    .pipe(zip(mnf.name+'-'+mnf.version+'.zip'))
    .pipe(gulp.dest('dist'))
})
