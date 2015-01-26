process.env.NODE_ENV = 'development';


var gulp = require('gulp'),
    sass = require('gulp-sass'),
    compass = require('gulp-compass'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync');
    
var env = process.env.NODE_ENV;

// BrowserSync
gulp.task('browser-sync', function() {
    browserSync({
       proxy: "NAME OF LOCAL SITE HERE"
   });
});

// SASS tasks
gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss')
       .pipe(compass({
          config_file: 'config.rb',
          css: 'css',
          sass: 'scss',
          bundle_exc: true
        }))
        .on('error', function (err) {
        	$.util.log(err.message);
        	this.emit('end');
        })
       .pipe(gulpif(env === 'development', sass({errLogToConsole: true})))
       .pipe(gulpif(env === 'production', sass({errLogToConsole: true})))
       .pipe(gulpif(env === 'production', minifycss()))
       .pipe(gulp.dest('css'))
       .pipe(browserSync.reload({stream:true}));
});

// JS tasks
gulp.task('js', function() {
    return gulp.src([
            'bower_components/foundation/js/foundation/foundation.js',
            'bower_components/foundation/js/foundation/foundation.dropdown.js',
            'src_js/foundation.equalizer.js',
            'bower_components/foundation/js/foundation/foundation.offcanvas.js',
            'bower_components/foundation/js/foundation/foundation.orbit.js',
            'bower_components/foundation/js/foundation/foundation.topbar.js',
            'src_js/jquery-ui.js',
            'src_js/smartresize.js',
            'src_js/app.js'
        ])
        // .pipe(gulpif(env === 'development', sourcemaps.init()))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(concat('script.js'))
        // .pipe(gulpif(env === 'development', sourcemaps.write()))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({stream:true}));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['css/styles.css', 'js/script.js'], {read: false})
        .pipe(clean());
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Watch task
gulp.task('default', ['sass', 'js'], function() {

        // Watch .scss files
        gulp.watch('scss/**/*.scss', ['sass']);      

        // Watch .js files
        gulp.watch('src_js/**/*.js', ['js']);
        
        // gulp.watch("*.html", ['bs-reload']); 

});