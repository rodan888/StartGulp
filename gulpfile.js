var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		concatCss    = require('gulp-concat-css'),
		uglify       = require('gulp-uglifyjs'),
		jade         = require('gulp-jade'),
		imagemin     = require('gulp-imagemin'),
		jr 					 = require('gulp-json-replace'),
		imageminMozjpeg = require('imagemin-mozjpeg');

gulp.task('browser-sync', [
							'styles',							
							'scriptsConcat',
							'scriptsCommon',
							'copyJquery',
							'copyfontAwesome',
							'copyfonts',
							'vendorCss',							
							'templates',
							'compress',
							'fontsdist',
							], function() {
		browserSync.init({
				server: {
						baseDir: "./dist"
				},
				notify: false,
				files: ['./dist/**/*.html','./dist/js/*.js','./dist/css/*.css']
		});
});

gulp.task('styles', function () {
	gulp.src('app/sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(minifycss(''))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('compress', () =>
  gulp.src('app/img/*')
  .pipe(imagemin([imageminMozjpeg({
      quality: 85
  })]))
  .pipe(gulp.dest('dist/img/'))
);

gulp.task('copyJquery', function () {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
  	.pipe(gulp.dest('dist/js'));
});

gulp.task('copyfontAwesome', function() {
  gulp.src('app/libs/font-awesome/webfonts/*.{ttf,woff,woff2,eot,svg}')
  	.pipe(gulp.dest('dist/css/font-awesome/webfonts/'));
});

gulp.task('copyfonts', function() {
  gulp.src('app/fonts/**/*.{ttf,woff,woff2,eot,svg}')
  	.pipe(gulp.dest('dist/fonts/'));
});

gulp.task('scriptsConcat', function() {
  return gulp.src('app/libs/**/*.js')
    .pipe(concat('plagin.min.js'))
    .pipe(uglify(''))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scriptsCommon', function() {
  return gulp.src('app/js/*.js')
    .pipe(uglify(''))
    .pipe(concat('common.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('vendorCss', function () {
  return gulp.src('app/libs/**/*.css')
    .pipe(concatCss("vendor.css"))   
    .pipe(minifycss('')) 
    .pipe(rename("vendor.min.css"))
    .pipe(gulp.dest('dist/css'));
}); 

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  gulp.src('app/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(jr({
      src: './content.json',
      identify: '%%'
 		}))
 	 .pipe(gulp.dest('./dist/'))
});

gulp.task('fontsdist', function() {
  	return gulp.src('app/fonts/*/**')   
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function () {
	gulp.watch('app/sass/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js',['scriptsCommon']);	
	gulp.watch('app/**/*.jade', ['templates']);
});
gulp.task('default', ['watch','browser-sync']);

