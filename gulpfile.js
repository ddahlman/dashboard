var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass({ includePaths: './node_modules/' }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('default', ['sass'], function () {
    gulp.watch('./scss/*.scss', ['sass']);
});