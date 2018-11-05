let path = require('path');
let fs = require('fs');

function getUploadDir(){
    let absolutePath = path.resolve(__dirname,'../..');
    return absolutePath;
}

module.exports = {
    getImage(req,res,next){
        let dir = getUploadDir();
        let absolutePath = path.join(dir, req.originalUrl);
        var content =  fs.readFileSync(absolutePath,"binary");
        res.write(content,"binary"); 
        return;
    },

	//图片上传
	uploadFile(req, res) {
		res.send({
			code: 200,
			data: req.file.path
		});
	},
    removeFile(req, res){
        let fileName = req.body.fileName;
        let dir = getUploadDir();
        if(fileName){
            fileName = fileName.replace('../','');
            let absolutePath = path.resolve(dir, fileName);
            console.log('remove file:',absolutePath);
            try{
                fs.unlinkSync(absolutePath);
            }catch(e){
                res.send({
                    code: 200,
                    msg:'文件不存在'
                });
            }
            res.send({
                code: 200,
                msg:'删除成功'
            });
        }
    }
};