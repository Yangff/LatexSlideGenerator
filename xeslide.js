var fs = require('fs');
var args = process.argv;
var file = args[2];
// section = 0
// subsection = 1

function doMakeList(){
	var j = fs.readFileSync(file);
	j = JSON.parse(j);
	var theme = (j.information.theme) || 'Warsaw';
	var title = (j.information.title) || 'Title';
	var author = (j.information.author) || 'Author';
	var filename = (j.information.entry) || 'sample';
	var usepackage = (j.information.usepackage) || [];
	var outline = j.information.outline || '目录';

	filehead = '\\documentclass{beamer}\n';
	filehead += '\\usepackage{ctex}\n';
	for (var i = 0; i < usepackage.length; i++)
		filehead += '\\usepackage{' + usepackage[i] + '}\n';
	filehead += '\\usetheme{' + theme + '}\n\n';

	filehead += '\\title{' + title + '}\n';
	filehead += '\\author{' + author + '}\n';
	filehead += '\\date{\\today}\n\n';
	filehead += '\\begin{document}\n';

	filehead += '	\\AtBeginSubsection[]\n';
	filehead += '	{\n';
	filehead += '		\\begin{frame}[shrink]\n';
	filehead += '			\\tableofcontents[sectionstyle=show/shaded,subsectionstyle=show/shaded/hide]\n';
	filehead += '		\\end{frame}\n';
	filehead += '	}\n';

	filehead += '	\\AtBeginSection[]\n';
	filehead += '	{\n';
	filehead += '		\\begin{frame}\n';
	filehead += '			\\tableofcontents[currentsection,hideallsubsections]\n';
	filehead += '		\\end{frame}\n';
	filehead += '	}\n';

	filehead += '	\\begin{frame}\n';
	filehead += '		\\titlepage\n';
	filehead += '	\\end{frame}\n';
	filehead += '	\\begin{frame}\n';
	filehead += '		\\frametitle{' + outline + '}\n';
	filehead += '		\\tableofcontents[hideallsubsections]\n';
	filehead += '	\\end{frame}\n';
	var content = '';
	var basepath = './' + j.document.entry;
	if (!fs.existsSync(basepath) || !fs.statSync(basepath).isDirectory()){
		console.log('+' + basepath);
		fs.mkdirSync(basepath);
	} else {
		console.log('-' + basepath);
	}
	for (var i = 0; i < j.document.content.length; i++) {
		var j1 = j.document.content[i];
		var title1 = j1.title || "Title";
		content += '	\\section{' + title1 + '}\n';
		var basepath_1 = basepath + '/' + j1.entry;
		if (!fs.existsSync(basepath_1) || !fs.statSync(basepath_1).isDirectory()){
			console.log('+-' + basepath_1);
			fs.mkdirSync(basepath_1);
		} else {
			console.log('--' + basepath_1);
		}
		for (var k = 0; k < j1.content.length; k++) {
			var j2 = j1.content[k];
			var title2 = j2.title || "Title";
			var basepath_2 = basepath_1 + '/' + j2.entry;
			if (!fs.existsSync(basepath_2) || !fs.statSync(basepath_2).isDirectory()){
				console.log('+--' + basepath_2);
				fs.mkdirSync(basepath_2);
			} else {
				console.log('---' + basepath_2);
			}
			content += '	\\subsection{' + title2 + '}\n';
			for (var q = 0; q < j2.content.length; q++) {
				var j3 = j2.content[q];
				var basepath_3 = basepath_2 + '/' + j3.entry;
				var title3 = j3.title || title2;
				content += '	\\begin{frame}{' + title3 + '}\n';
				content += '		\\include{' + basepath_3 + '}\n';
				content += '	\\end{frame}\n'
				if (!fs.existsSync(basepath_3 + '.tex') || !fs.statSync(basepath_3 + '.tex').isFile()){
					console.log('+---' + basepath_3 + '.tex');
					fs.writeFileSync(basepath_3 + '.tex','% content for ' + basepath_3 + ' as a part of ' + title1 + '>' + title2 + '>' + title3);
				} else {
					console.log('----' + basepath_3 + '.tex');
				}
			}
		}
	}
	var filetail = '\\end{document}\n';
	fs.writeFileSync(filename + '.tex',filehead + content + filetail);
}
if (file != null){
	doMakeList();
}
