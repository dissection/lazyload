var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
    return gulp.src("./jQuery.elevator.js")
        .pipe(rename({basename: "elevator",suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('src'));
});
