var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var del = require('del');

gulp.task('clean-css', function () {
    return del(['dist/css/*.css']);
});

gulp.task('clean-js', function () {
    return del(['dist/js/*.js']);
});

gulp.task('sass', ['clean-css'], function () {
    return gulp.src('./app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass({ includePaths: './node_modules/' }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('pack-js', ['clean-js'], function () {
    return gulp.src([
        'app/js/index.js',
        'app/js/slot.js',
        'app/js/slotBounds.js',
        'app/js/chart.js',
        'app/js/gridPositions.js',
        'app/js/isNotOverlapping.js',
        'app/js/placeCharts.js',
        'app/js/addChartToDOM.js',
        'app/js/arrangeItems.js',
        'app/js/getIdByCoords.js',
        'app/js/removeMenu.js',
        'app/js/availableCharts.js',
        'app/js/addFirstCharts.js',
        'app/js/addChartEventListeners.js',
        'app/js/removeChart.js',
        'app/js/resize.js',
        'app/js/mouseFunctions.js'])
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(concat('bundle.js'))
        .pipe(minify({ ext: { min: '.js' }, noSource: true }))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('default', ['pack-js', 'sass'], function () {
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    gulp.watch('./app/js/**/*.js', ['pack-js']);
});