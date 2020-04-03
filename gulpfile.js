var gulp  = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

  const { readdirSync, statSync } = require('fs')
  const { join } = require('path')

function buildCss(path) {
  console.log('== Compiling SCSS in', path);

    return gulp.src([path +'/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path + '/css/'))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path + '/css/'))
}

function watcher() {
	const getDirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());
  // Find themes in the themes dir
	var themes = getDirs("themes");
  // Add watcher for each theme
	var t = [];
	themes.forEach(theme => {
    // Create an anonymous function and give it a pretty name for gulp logger
		t[theme] = function() { return buildCss('themes/'+ theme) };
		t[theme].displayName = 'Compiling SCSS for ' + theme;
    gulp.watch(['themes/'+ theme +'/scss/*.scss'], gulp.series( t[theme] ));
	});
}

gulp.task('watch', watcher);
