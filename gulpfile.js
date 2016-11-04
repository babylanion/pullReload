/**
 * Created by mayi on 2016/10/28.
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    validator = require('gulp-html'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    cleanCss = require('gulp-clean-css'),
    watchPath = require('gulp-watch-path'),
    connect = require('gulp-connect');

//js处理
gulp.task('uglifyjs', function () {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        //.pipe(concat('all.js'))
        //.pipe(gulp.dest('dist/js/tmp'))
        //.pipe(rename('all.min.js'))
        .pipe(uglify({mangle: {except: ['require' ,'exports' ,'module' ,'$']}}))/*排除混淆关键字*/
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

//检测到某个 js 文件被修改时，只编写当前修改的 js 文件
gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        /*
         paths
         { srcPath: 'src/js/log.js',
         srcDir: 'src/js/',
         distPath: 'dist/js/log.js',
         distDir: 'dist/js/',
         srcFilename: 'log.js',
         distFilename: 'log.js' }
         */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
});

gulp.task('mincss', function () {
    return gulp.src('src/css/**/*.css')
        //.pipe(plumber())//默认的 Gulp 任务在执行过程中如果出错会报错并立即停止当前工作流（如在 watch Sass编译时候恰巧 Sass代码写错了）。使用plumber 模块可以在纠正错误后继续执行任务。
        //.pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

//html
gulp.task('changehtml', function() {
    return gulp.src('src/index.html')
        //.pipe(validator())
        .pipe(gulp.dest('dist/'));
});
//gulp.task('default', ['html']);

gulp.task('html', function () {
    gulp.src('./dist/**/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.html'],['src/js/*.js'], ['changehtml'],['watchjs']).on('change',browserSync.reload);
});

gulp.task('default', ['uglifyjs','watchjs','mincss','changehtml','html','watch']);
