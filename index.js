'use strict';

module.exports = function (ret, settings, conf, opt) { //打包后处理
    var requireConfig = fis.config.get('requirejs', {});
    requireConfig.paths = requireConfig.paths || {};
    fis.util.map(ret.map.res, function (id, res) {
        requireConfig.paths[id] = res.uri;
    });
    var content = 'requirejs.config(' + JSON.stringify(requireConfig, null, opt.optimize ? null : 4) + ');';
    var requireConfigFile = fis.file(fis.project.getProjectPath(), 'require-config.js');
    requireConfigFile.setContent(content);
    ret.pkg[requireConfigFile.subpath] = requireConfigFile;

    var script = '<script src="' + requireConfigFile.getUrl(opt.hash, opt.domain) + '"></script>';
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isHtmlLike) { //类html文件
            var content = file.getContent();
            if (/\brequire\(\[\s*/.test(content)) {
                content = content.replace(/<\/head>/, script + '\n$&');
                file.setContent(content);
            }
        }
    });
};