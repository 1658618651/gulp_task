var gulp=require('gulp');
var $=require('gulp-load-plugins')();//$对象可以帮你打包下面基于glup的所有插件
// var concat=require('gulp-concat');
// var uglify=require('gulp-uglify');
// var rename=require('gulp-rename');
// var less =require('gulp-less');
// var cleanCss =require('gulp-clean-css');
// var htmlmin=require('gulp-htmlmin');
// var livereload=require('gulp-livereload');
// var connect =require('gulp-connect');
var open =require('open');
//注册合并压缩js的任务
gulp.task('js',function(){//当没有return，任务是同步的，有了return 任务是异步的
    return gulp.src('src/js/*.js')//找到目标源文件，将数据读取到gulp的内存中
    .pipe($.concat('build.js'))//临时合并文件
    .pipe(gulp.dest('dist/js/'))//输出文件到本地
    .pipe($.uglify())             //压缩文件
    // .pipe(rename('build.min.js'))//第一种方式
    .pipe($.rename({suffix:'.min'}))//重命名
    .pipe(gulp.dest('dist/js/'))
    .pipe($.livereload())//实时刷新，可加可不加，最好加
    .pipe($.connect.reload())//全自动实时刷新，
})
//注册less转换的任务
gulp.task('less',function () {
    return gulp.src('src/less/*.less')
    .pipe($.less())//编译less文件为css文件
    .pipe(gulp.dest('src/css/'))
    .pipe($.livereload())//实时刷新，可加可不加，最好加
    .pipe($.connect.reload())//全自动实时刷新，
  })

  //注册合并压缩css文件
gulp.task('css',['less'],function () {  //['less']作用是css只能在less执行完之后才能执行
    return gulp.src('src/css/*.css')
    .pipe($.concat('build.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe($.rename({suffix:'.min'}))
    .pipe($.cleanCss({compatibility:'ie8'}))//压缩自动找刚刚合并的文件,兼容到ie8
    .pipe(gulp.dest('dist/css/'))
    .pipe($.livereload())//实时刷新，可加可不加，最好加
    .pipe($.connect.reload())//全自动实时刷新，
  })
//注册压缩html的任务
  gulp.task('html',function(){
    return gulp.src('index.html')
    .pipe($.htmlmin({collapseWhitespace:true}))//压缩空格
    .pipe(gulp.dest('dist/'))
    .pipe($.livereload())//实时刷新，可加可不加，最好加
    .pipe($.connect.reload())//全自动实时刷新，
  })

//注册监视任务(半自动)
gulp.task('watch',['default'],function(){
  //开启监听
  $.livereload.listen();
//确定监听的目标以及绑定相应的任务
gulp.watch('src/js/*.js',['js']);
gulp.watch(['src/css/*.css','src/less/*.less'],['css'])
})


//注册监视任务(全自动)
gulp.task('server',['default'],function () {
  $.connect.server({
  root:'dist/',
  livereload:true,
  port:5000
})
//open可以直接打开指定的链接
open('http://localhost:5000/');
//确定监听的目标以及绑定相应的任务
gulp.watch('src/js/*.js',['js']);
gulp.watch(['src/css/*.css','src/less/*.less'],['css'])
  })

//注册默认任务
gulp.task('default',['js','less','css','html']);