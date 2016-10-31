const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const plugins = require('gulp-load-plugins')();
const pkg = require('../package');
const version = `${pkg.version}.${Date.now()}`;
const scripts = {
  entry: 'src/main.js',
  output: 'js/main.js',
  src: 'src/**/*.js',
  dest: 'js',
};
const styles = {
  entry: 'src/main.less',
  src: 'src/**/*.less',
  dest: 'css',
};
const html = {
  jade: 'src/*.jade',
  src: 'src/**/*.jade',
  dest: './',
};
const images = {
  src: 'src/images/**/*.{jpg,png,gif}',
  dest: 'images',
};
const fonts = {
  dest: 'fonts',
};

gulp.task('clean', () => {
  return gulp.src([
    'css',
    'fonts',
    'images',
    'js',
    '*.html',
  ])
    .pipe(plugins.clean());
});

gulp.task('eslint', () => {
  return gulp.src(scripts.src)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new plugins.util.PluginError('webpack', err);
    }

    plugins.util.log('[webpack]', stats.toString({
      colors: true,
    }));

    callback();
  });
});

gulp.task('js', ['eslint', 'webpack'], () => {
  return gulp.src(scripts.output)
    .pipe(plugins.uglify())
    .pipe(gulp.dest(scripts.dest));
});

gulp.task('less', () => {
  return gulp.src(styles.entry)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({
      paths: ['./src/less'],
    }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(styles.dest));
});

gulp.task('css', () => {
  return gulp.src(styles.entry)
    .pipe(plugins.less({
      paths: ['./src/less'],
    }))
    .pipe(plugins.autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12',
      ],
    }))
    .pipe(plugins.cleanCss({
      keepSpecialComments: 0,
    }))
    .pipe(gulp.dest(styles.dest));
});

gulp.task('jade', () => {
  return gulp.src(html.jade)
    .pipe(plugins.jade({
      pretty: true,
      locals: {
        development: true,
        version,
      },
    }))
    .pipe(gulp.dest(html.dest));
});

gulp.task('html', () => {
  return gulp.src(html.jade)
    .pipe(plugins.jade({
      locals: {
        development: false,
        version,
      },
    }))
    .pipe(plugins.htmlcomb())
    .pipe(gulp.dest(html.dest));
});

gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(gulp.dest(images.dest));
});

gulp.task('fonts', () => {
  return gulp.src([
    '../node_modules/material-design-icons/iconfont/*.{otf,eot,svg,ttf,woff,woff2}',
  ])
    .pipe(gulp.dest(fonts.dest));
});

gulp.task('styles', ['fonts'], () => {
  return gulp.src([
    '../node_modules/material-design-lite/material.min.css',
  ])
    .pipe(gulp.dest(styles.dest));
});

gulp.task('scripts', () => {
  return gulp.src([
    '../node_modules/material-design-lite/material.js',
    '../node_modules/material-design-lite/material.min.js',
    '../node_modules/vue/dist/vue.js',
    '../node_modules/vue/dist/vue.min.js',
  ])
    .pipe(gulp.dest(scripts.dest));
});

gulp.task('assets', ['images', 'styles', 'scripts']);

gulp.task('release', ['js', 'css', 'html', 'assets']);

gulp.task('watch', () => {
  gulp.watch(scripts.src, ['webpack']);
  gulp.watch(styles.src, ['less']);
  gulp.watch(images.src, ['images']);
  gulp.watch(html.src, ['jade']);
});

gulp.task('default', ['watch']);
