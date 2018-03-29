var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

gulp.task('sass', function () {
    return gulp.src('./app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass({ includePaths: './node_modules/' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('babel', function () {
    return gulp.src('./app/js/script.js')
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['babel', 'sass'], function () {
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    gulp.watch('./app/js/script.js', ['babel']);
});