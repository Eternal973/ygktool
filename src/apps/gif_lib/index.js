import React from 'react'
import SuperGif from 'libgif'
import JSZip from 'jszip'
import saveFile from '../../utils/fileSaver'
import './style.css'
import FileRead from '../../components/FileReader'

function dataURLtoFile(dataurl, filename) {
	//将base64转换为文件
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {
		type: mime
	});
}

const Gallery = props => {
	var gallery = props.res.map((img,i)=>{
		return(
			<div className="mdui-col">
			    <div className="mdui-grid-tile">
			       <img src={img}/>
			    </div>
			</div>
		)
	})
	return(
		<div 
			className="mdui-row-xs-3 mdui-row-sm-4 mdui-row-md-5 mdui-row-lg-6 mdui-row-xl-7 mdui-grid-list">
		{gallery}
		</div>
	)
}

class Ui extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			file:null,
			rub:null,
			res:[]
		}
	}
	render(){
		const { file, res } = this.state;
		return(
			<> 
				<center>
					<img className="mdui-img-fluid" ref={r => this.img = r}src={file} />
					<FileRead 
						fileType="image/gif"
						multiple={false}
						onFileChange = {
							file => {
								this.setState({
									rub: null
								}, () => {
									this.setState({file:file},()=>{
										var rub = new SuperGif({
											gif: this.img
										})
										this.setState({rub:rub})
										rub.load(() => {
											console.log('oh hey, now the gif is loaded');
										})
									})									
								})
							}
						}
					/>
				</center>
				<button 
					onClick={()=>{
						var zip = new JSZip();
						res.map((img, i) => {
							zip.file(i + ".png", dataURLtoFile(img, i + '.png'))
						})
						zip.generateAsync({
							type: "blob"
						}).then(content => {
							saveFile({
		                        file: content,
		                        type: "zip",
		                        filename: "ygktool.gif_lib"
		                    })
						})
					}}
					style={{display:(res.length)?'block':'none'}}
					className="mdui-btn mdui-color-theme">打包下载</button>
				<button
				    disabled={(file === null)}
				    onClick={()=>{
				    	var res = [];				    	
				    	const { rub } = this.state;
				    	for (var i = 0; i <= rub.get_length(); i++) {
				    		rub.move_to(i);
				    		res.push(rub.get_canvas().toDataURL('image/jpeg', 0.8));
				    	}
				    	this.setState({res:res})				    	
				    }}
				    className="mdui-color-theme mdui-fab mdui-fab-fixed">
				    <i className="mdui-icon material-icons">check</i>					
				</button>
				<br></br>
				<Gallery res={res} />
			</>
		)  	
	}
}

export default Ui