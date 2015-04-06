var gulp       = require('gulp');
var ngBuild    = require('ng-build');
var wiredep    = require('wiredep');
var bower      = require('bower');
var queue      = require('streamqueue');
var del        = require('del');
var rename     = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var cache      = require('gulp-cached');
var plumber    = require('gulp-plumber');
var remember   = require('gulp-remember');
var jscs       = require('gulp-jscs');
var path       = require('path');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var ngBlock    = ngBuild.ngBlock;
var ngIndex    = ngBuild.ngIndex;
var ngLint     = ngBuild.ngLint;
var ngModule   = ngBuild.ngModule;
var ngProvider = ngBuild.ngProvider;
var ngStore    = ngBuild.ngStore;
var ngStyle    = ngBuild.ngStyle;
var ngTemplate = ngBuild.ngTemplate;
var ngWire     = ngBuild.ngWire;
var ngWrap     = ngBuild.ngWrap;

process.env.ENV = process.env.ENV || 'dev';

gulp.task('default', ['build']);

var clean = function clean(what) {
    var taskName = 'clean:' + what;

    gulp.task(taskName, function(done) {
        del('www/' + what, done);
    });

    return taskName;
};

gulp.task('bower', function(done) {
    bower.commands.install().on('end', function() { done(); });
});

gulp.task('ng-modules', function() {
    return gulp
        .src('src/**/module.json')
        .pipe(plumber())
        .pipe(cache('modules'))
        .pipe(ngModule({ prefix: 'dc' }))
        .pipe(ngStore.register('modules'))
        .pipe(remember('modules'));
});

gulp.task('ng-templates', function() {
    return gulp
        .src('src/**/*.template.html')
        .pipe(plumber())
        .pipe(cache('templates'))
        .pipe(ngTemplate())
        .pipe(ngStore.register('templates'))
        .pipe(remember('templates'));
});

gulp.task('ng-blocks', function() {
    return gulp
        .src([
            'src/**/*.config.js',
            'src/**/*.run.js'
        ])
        .pipe(plumber())
        .pipe(cache('blocks'))
        .pipe(ngBlock())
        .pipe(ngStore.register('blocks'))
        .pipe(remember('blocks'));
});

gulp.task('ng-providers', function() {
    return gulp
        .src([
            'src/**/*.provider.js',
            'src/**/*.constant.json',
            'src/**/*.factory.js',
            'src/**/*.directive.js',
            'src/**/*.filter.js',
            'src/**/*.controller.js'
        ])
        .pipe(plumber())
        .pipe(cache('providers'))
        .pipe(ngProvider())
        .pipe(ngStore.register('providers'))
        .pipe(remember('providers'));
});

gulp.task('ng-scripts', [clean('js'), 'ng-modules', 'ng-templates', 'ng-blocks', 'ng-providers'], function() {
    return ngStore.stream()
        .pipe(plumber())
        .pipe(cache('scripts'))
        .pipe(ngWire())
        .pipe(ngWrap())
        .pipe(ngAnnotate())
        .pipe(jscs())
        .pipe(remember('scripts'))
        .pipe(gulp.dest('www/js/'));
});


gulp.task('ng-lint', ['ng-modules', 'ng-blocks', 'ng-providers'], function() {
    return ngStore.stream()
        .pipe(plumber())
        .pipe(ngLint())
        .pipe(ngLint.reporter());
});

gulp.task('ng-styles', [clean('css')], function() {
    return gulp
        .src('src/bootstrap/module.scss')
        .pipe(plumber())
        .pipe(ngStyle())
        .pipe(rename({ basename: 'ionic.app', extname: '.css' }))
        .pipe(gulp.dest('www/css/'))
        .pipe(reload({ stream: true }));
});

gulp.task('ng-index', [clean('*'), 'bower', 'ng-styles', 'ng-scripts'], function() {
    var files = wiredep();
    var deps  = Array.prototype.concat(files.js, files.css).filter(Boolean);

    return queue({ objectMode: true },
            gulp
                .src(deps, { base: 'bower_components' })

                .pipe(rename(function (fpath) {
                    fpath.basename = fpath.dirname.split(path.sep)[0] + '.' + fpath.basename;
                    fpath.dirname = '/lib';
                }))

                .pipe(gulp.dest('www/')),
            gulp.src([
                'www/css/**/*.css',
                'www/js/**/*.js'
            ], { read: false, base: 'www' })
        )
        .pipe(plumber())
        .pipe(ngIndex({
            main: 'dc.bootstrap',
            baseTemplate: __dirname + '/bower_components/donkeycode-ionic-tools/structure/layout.template.html'
        }))
        .pipe(gulp.dest('www/'));
});

gulp.task('images', [clean('img')], function() {
    gulp.src('src/**/*.{png,jpg,jpeg,gif}')
        .pipe(plumber())
        .pipe(rename(function(img) {
            img.dirname = img.dirname.replace(/img|images/, '');
        }))
        .pipe(gulp.dest('www/img'))
        .pipe(reload({ stream: true }));
});

gulp.task('mocks', [clean('mocks')], function() {
    gulp.src('mocks/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('www/mocks'));
});

gulp.task('fonts', ['bower'], function() {
    gulp.src('bower_components/**/fonts/**/*')
        .pipe(plumber())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('www/fonts/'));
});

gulp.task('build', ['bower', 'ng-index', 'fonts', 'images', 'mocks']);

gulp.task('serve', ['build'], function() {
    browserSync({
        server: { baseDir: 'www' },
        online: false,
        scriptPath: function (path, port, options) {
            return options.get('absolute');
        },
        snippetOptions: {
            rule: { match: /<\/head>/i }
        }
    });
});

gulp.task('dev', ['build', 'serve'], function() {
    gulp.watch('mocks/**/*', ['mocks']);
    gulp.watch('src/**/*.scss', ['ng-styles']);
    gulp.watch('src/**/*.{html,js,json}', ['ng-scripts', reload]);
    gulp.watch('src/**/*.{png,jpg,jpeg,gif}', ['images']);
});

