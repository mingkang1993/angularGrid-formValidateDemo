var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsPath = './dist/js/**/**.js';
var jsMinPath = './src/js';
// // 检查脚本
// gulp.task('lint', function() {
//     gulp.src(jsPath)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src(jsPath)
        .pipe(concat('czMobile.all.js'))
        .pipe(gulp.dest(jsMinPath))
        .pipe(rename('czMobile.all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsMinPath));
});


// 默认任务
gulp.task('default', function(){
    gulp.run('scripts');
    // // 监听文件变化
    // gulp.watch('./js/*.js', function(){
    //     gulp.run('lint', 'sass', 'scripts');
    // });
});

