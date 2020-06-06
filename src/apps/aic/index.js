import React from 'react'
import { snackbar } from 'mdui'
import axios from 'axios'
import FileRead from '../../components/FileReader'
import NewPage from '../../components/BottomAlert'
import Cropper from '../../utils/Cropper'
import ListControlMenu from '../../components/ListControlMenu'

const Result = ({ result }) => {
    if (!result) return null
    return (
        <>
            {result.map(({ keyword, baike_info, score }, i) => (
                <>
                    <div key={i} className="mdui-col mdui-card">
                        <div className="mdui-card-media">
                            {/*baike_info?<img src={baike_info.image_url}/>:""*/}
                            <div className="mdui-card-primary">
                                <div className="mdui-card-primary-title">{keyword}</div>
                                <div className="mdui-card-primary-subtitle">相似度:{score}</div>
                            </div>
                            <div className="mdui-card-content">
                                {baike_info.description ? baike_info.description : '暂无介绍'}
                            </div>
                        </div>
                    </div>
                    <br></br>
                </>
            ))}
        </>
    )
}

const aic_types = [{
    name: '通用物体和场景',
    value: 'normal'
}, {
    name: '动物',
    value: 'animal'
}, {
    name: '植物',
    value: 'plant'
}, {
    name: '车型',
    value: 'car'
}, {
    name: '菜品',
    value: 'dish'
}]

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aic_type: 0,
            image: null,
            defaultImage: null,
            data: null,
            ifShow: false,
            ifShowCropper: false
        }
    }
    loadDataFromServer() {
        const { image } = this.state
        window.loadShow()
        axios.post('/api/aic', {
            image: image.split('base64,')[1]
        }).then(response => {
            var json = JSON.parse(response.request.response);
            this.setState({
                data: json.result,
                ifShow: true
            })
        }).catch(error => {
            snackbar({ message: error })
        }).then(() => {
            window.loadHide()
        })
    }
    render() {
        const { image, defaultImage, ifShow, data, aic_type, ifShowCropper } = this.state
        return (
            <>
                <div style={{ display: ifShowCropper ? 'none' : 'block' }}>
                    <div className="mdui-card">
                        <div className="mdui-card-content">
                            {image && <img
                                style={{
                                    display: 'block',
                                    margin: '0 auto',
                                    maxHeight: '200px'
                                }}
                                src={image} />}
                            <ListControlMenu
                                icon="language"
                                title="识别类型"
                                checked={aic_type}
                                onCheckedChange={checked => {
                                    this.setState({ aic_type: checked })
                                }}
                                items={aic_types}
                            />
                        </div>
                        <div className="mdui-card-actions">
                            <button
                                onClick={() => {
                                    this.setState({
                                        ifShowCropper: true,
                                        image: defaultImage
                                    })
                                }}
                                style={{
                                    display: image ? 'inline-block' : 'none'
                                }}
                                className="mdui-ripple mdui-btn">
                                重新裁剪
                            </button>
                            <FileRead
                                fileType="image/*"
                                onFileChange={file => {
                                    this.setState({
                                        ifShowCropper: true,
                                        image: file,
                                        defaultImage: file
                                    })
                                }}
                            />
                            <button
                                onClick={() => {
                                    image && this.loadDataFromServer()
                                }}
                                className="loadBtn mdui-btn-raised mdui-ripple mdui-color-theme mdui-btn">
                                <i className="mdui-icon mdui-icon-left material-icons">&#xe5ca;</i>识别
                            </button>
                        </div>
                    </div>
                </div>
                <NewPage
                    onClose={() => {
                        this.setState({ ifShow: false })
                    }}
                    title="识别结果"
                    ifShow={ifShow}
                >
                    <Result result={data} />
                </NewPage>
                <Cropper
                    ifShow={ifShowCropper}
                    img={image}
                    onClose={() => {
                        this.setState({ ifShowCropper: false })
                    }}
                    onConfirm={img => {
                        this.setState({ ifShowCropper: false, image: img })
                    }}
                    title=""
                />
            </>
        )
    }
}
