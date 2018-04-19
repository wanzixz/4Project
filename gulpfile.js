var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var comments = require('postcss-discard-comments');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var yargs = require('yargs').options({
  w: {
    alias: 'watch',
    type: 'boolean'
  },
  s: {
    alias: 'server',
    type: 'boolean'
  },
  p: {
    alias: 'port',
    type: 'number'
  }
}).argv;

var option = { base: 'src' };
var dist = __dirname + '/dist';

gulp.task('build:style', function() {
  var banner = [
    '/*!',
    ' * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
  ].join('\n');
  gulp
    .src('src/style/weui.less', option)
    .pipe(sourcemaps.init())
    .pipe(
      less().on('error', function(e) {
        console.error(e.message);
        this.emit('end');
      })
    )
    .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1']), comments()]))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(
      nano({
        zindex: false,
        autoprefixer: false
      })
    )
    .pipe(
      rename(function(path) {
        path.basename += '.min';
      })
    )
    .pipe(gulp.dest(dist));
});


gulp.task('build:images', function() {
  gulp
    .src('src/**/*.?(png|jpg|gif)', option)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:js', function() {
  gulp
    .src('src/js/*.?(js)', option)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:style', function() {
  gulp
    .src('src/style/*.less', option)
    .pipe(
      less().on('error', function(e) {
        console.error(e.message);
        this.emit('end');
      })
    )
    .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
    .pipe(
      nano({
        zindex: false,
        autoprefixer: false
      })
    )
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:view', function() {
  gulp
    .src('src/view/*.html', option)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:', [
  'build:images',
  'build:js',
  'build:style',
  'build:view'
]);

gulp.task('release', ['build:images', 'build:style','build:js','build:view']);

gulp.task('watch', ['release'], function() {
  gulp.watch('src/style/**/*', ['build:style']);
  gulp.watch('src/style/*.less', ['build:style']);
  gulp.watch('src/**/*.?(png|jpg|gif|js)', ['build:images']);
  gulp.watch('src/**/*.?(js)', ['build:js']);
  gulp.watch('src/view/*.html', ['build:view']);
});

gulp.task('server', function() {
  yargs.p = yargs.p || 8080;
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    ui: {
      port: yargs.p + 1,
      weinre: {
        port: yargs.p + 2
      }
    },
    port: yargs.p,
    startPath: '/view/'
  });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['release'], function() {
  if (yargs.s) {
    gulp.start('server');
  }

  if (yargs.w) {
    gulp.start('watch');
  }
});
