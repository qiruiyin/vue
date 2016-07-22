(function(gulp, gulpLoadPlugins){
	var $ = gulpLoadPlugins({
			    pattern: '*',
			    lazy: true
			}),
		webpack = require("webpack"),
		webpackConfig = require("./webpack.config.js"),
		_ = {
			app:  'app', 
	        dist: 'dist', 
	        sass: 'app/sass',
	        tmpl: 'app/src',        
	        js:   'app/js',
	        css:  'app/css',
	        img:  'app/img'
		},
		files = [
		    'app/*.html',
		    'app/css/**/*.css',
		    'app/img/**/*',
		    'app/js/**/*.js'
		];

	// 处理错误
	function handleError(error){
	    console.log(error.message);
	    this.emit('end');
	}

	// gulp-jshint
	// js代码校验
	gulp.task('jshint', function() {
	return gulp.src([ 'gulpfile.js' , _.js + '/**/*.js'])
	  	.pipe($.jshint())
	  	.pipe($.jshint().reporter('jshint-stylish'));
	});

	// gulp-scss-lint
	// scss校验
	gulp.task('scss-lint', function() {
	return gulp.src([_.sass + '/**/*.{scss, sass}'])
		.pipe($.scssLint({
			'config': '.scsslintrc',
			'customReport': $.scssLintStylish
		}));
	});

  	// gulp-css-spriter
	// 制作雪碧图
	// 单独制作雪碧图
	gulp.task('sprite', function(){
		// console.log(gulp.src(_.css + '/*.css'));
		return gulp.src(_.css + '/*.css')
	      	.pipe($.cssSpriter({
				// 生成的spriter的位置
	        	'spriteSheet': _.img + '/spriter.png',
	        	// 生成样式文件图片引用地址的路径
	        	'pathToSpriteSheetFromCSS': '../img/spriter.png'
			}))
	});

	// gulp-sass, gulp-autoprefixer, gulp-sourcemaps
	// 将sass预处理为css，
	// 使用autoprefixer来补全浏览器兼容的css
	// 使用sourcemaps 检查错误
	gulp.task('sass', function(){
		return gulp.src(_.sass + '/*.scss')
			.pipe($.plumber({ errorHandler: handleError}))
			.pipe($.sourcemaps.init())
			.pipe($.sass({
		        outputStyle: 'expanded',
		        includePaths: [ './bower_components/' ]
		    }))
	      	.pipe($.cssSpriter())
			.pipe($.autoprefixer({
				browers: ['last 2 versions','safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
			}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(_.css))
			.pipe($.size({
	       		title: 'CSS files:'
			})
		);
	});

	// 渲染html文件模板
	// 使用gulp-file-include合并模板文件
	gulp.task('html', function() {
		return gulp.src([_.tmpl + '/*.html'])
			.pipe($.plumber())
			.pipe($.fileInclude({
				prefix: '@@',
				basepath: '@file'
			}))
			.pipe(gulp.dest(_.app + '/'))
			.pipe($.size({
				title: 'HTML files:'
			})
		);
	});

	// browser-sync
	// 实时将修改信息渲染到浏览器
	gulp.task('browser-sync', function(){
		$.browserSync.init(files,{
			server: {
				baseDir: './app'
			},
			port: 9000
		});
	});

    // 监听修改信息
	gulp.task('watch', function(){
		// 监听css修改
		$.watch([_.sass + '/*.scss'], function(){
			gulp.start('sass');
		});
		// 监听html修改
		$.watch([_.tmpl + '/**/*.html'], function(){
			gulp.start('html');
		});
		gulp.start('browser-sync');
	});

	// 上面是开发环境，下面是打包上线

	// 图片压缩
	gulp.task('image', function(){
		return gulp.src(_.img + '/**/*')
			.pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
			.pipe($.imagemin({
				pregressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [$.imageminPngquant()]
			}))
			.pipe(gulp.dest(_.dist + '/img'))
			.pipe($.size({
				title: 'IMAGE files:'
			}));
	});

	// 替换文件名
	gulp.task('revcss', function(){
		return gulp.src(_.css + '/*.css')
			.pipe($.if('*.css', $.cssnano()))
			.pipe($.if('*.css', $.rev()))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(_.dist + '/css'));
	});
	// 替换文件名
	gulp.task('revjs', function(){
		return gulp.src(_.js + '/*.js')
			.pipe($.if('*.js', $.uglify()))
			.pipe($.if('*.js', $.rev()))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(_.dist + '/js'));
	});
	// 替换文件名
	gulp.task('rename', ['revcss', 'revjs'],function() {
    	gulp.src(['dist/*/*.json', 'app/*.html'])
    		.pipe($.revCollector({
	            replaceReved: true,
	            dirReplacements: {
	                'css': '/dist/css',
                	'/js/': '/dist/js/',
	                'cdn/': function(manifest_value) {
	                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
	                }
	            }
        	}))
	        .pipe(gulp.dest(_.dist));
	});

	// js、css、html压缩处理（可选）
	// 打包到dist文件夹下
	gulp.task('dist', ['image', 'rename'], function(){
		return gulp.src('app/*.html')
			.pipe($.plumber())
			.pipe($.useref())
			.pipe($.if('*.js', $.uglify()))
			.pipe($.if('*.js', $.rev()))
			.pipe($.if('*.css', $.cssnano()))
			.pipe($.if('*.css', $.rev()))
			.pipe(gulp.dest(_.dist));
	});

	// 删除dist文件夹
	gulp.task('rimraf', function(){
		return gulp.src(_.dist + '*', {read: false})
			.pipe($.rimraf({force: true}));
	});

	// 删除所有重命名辅助文件
	gulp.task('rimraf-rev', ['dist'], function(){
		return gulp.src(_.dist + '/*/*.json', {read: false})
			.pipe($.rimraf({force: true}));
	});

	gulp.task('webpack', function(callback){
		var myConfig = Object.create(webpackConfig);
		// run webpack
		webpack(
			myConfig,
			function(err, stats) {
				// gutil.log("[webpack]", stats.toString({
				//	 // output options
				// }));
			}
		);
	});

	// gulp-start
	// 启动项目
	gulp.task('start', ['watch', 'html', 'sass', 'webpack']);
	// 检查css和js
  	gulp.task('test',  ['jshint', 'scss-lint']);
	// 默认
	gulp.task('default', ['html', 'sass', 'rimraf', 'webpack'], function(){
		gulp.start('rimraf-rev');
		
	});
})(require('gulp'), require('gulp-load-plugins'));
