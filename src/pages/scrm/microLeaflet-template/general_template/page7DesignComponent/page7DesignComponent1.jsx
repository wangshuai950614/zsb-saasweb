/**
 * 音乐模板第六页 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, Popconfirm } from 'antd';
let PageChange = require('../pageChange');

let FormItem = Form.Item;

let Page7DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData  			: this.props.detailData,
			hasPrev      			: this.props.hasPrev,
			hasNext      			: this.props.hasNext,
			pageTotal    			: this.props.pageTotal,
			hasDelete   			: this.props.hasDelete,
			initFlg      			: false,
			imagePriview        	: '',                                        //预览上传图片url
			imagePriviewVisible 	: false,                                     //是否预览图片
			fileList                : null,

		}
	},

	componentWillReceiveProps(nextProps) {
		let detailData = this.state.detailData;
		this.setState({
			detailData : nextProps.detailData,
			hasPrev    : nextProps.hasPrev,
			hasNext    : nextProps.hasNext,
			pageTotal  : nextProps.pageTotal,
			hasDelete  : nextProps.hasDelete
		})
		if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) || !this.state.initFlg ){

			this.initFormData( detailData );
			this.setState({
				initFlg : true
			});
		}
	},
	//初始化表单值
	initFormData( detailData ){
		let form = this.props.form;
		let me = this;
		form.setFieldsValue({"page7Title" : detailData.title});
		form.setFieldsValue({"page7SubTitle" : detailData.subTitle});
		form.setFieldsValue({"page7Content" : detailData.content});
		form.setFieldsValue({"page7QrImage" : detailData.qrImgUrl });
		form.setFieldsValue({"page7Remark" : detailData.remark });
		window.timer = setInterval(function(){
			me.onChildPreview();
		}, window.refreshTimes || 200);
	},

	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;
		let detailData = {
			type : 'Page7Component',
			seqNo : seqNo,
			title : formData.page7Title,
			subTitle : formData.page7SubTitle,
			content : formData.page7Content,
			qrImgUrl : formData.page7QrImage,
			remark : formData.page7Remark,

		};
		this.props.onChildPreview( detailData, seqNo );
	},

	//上一页
	onPrev(seqNo){
		let form = this.props.form;
		form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				this.props.onPrev(seqNo);
			}
		})
		this.onChildPreview()
	},

	//下一页
	onNext(seqNo){
		let form = this.props.form;
		form.validateFieldsAndScroll((error,value)=>{
			if( !!error ){
				return;
			}else{
				this.props.onNext( seqNo );
			}
		})
		this.onChildPreview();
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
	},

	//保存实例
	saveInstance(){
		this.props.form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				clearInterval(window.timer);
				this.onChildPreview();
				this.props.saveInstance();
			}
		})
	},

	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({ 'page7QrImage' : fileUrl })
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({ 'page7QrImage' : '' });
		}
		this.setState({fileList});
	},

	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('page7QrImage');
		if(imgUrlList && imgUrlList.length > 0){
			message.error('只能上传一张图片');
			return false;
		}
		if(file.size > 1048576){
			message.error('图片不能大于1M');
			return false;
		};
		if (!(file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif')){
	        message.error('只能上传 .JPG .PNG .gif文件哦!');
	        return false;
	    }
		return true;
	},

	imgHandleOnPreview(file){
		this.setState({
			imagePriview: file.url||file.thumbUrl,
	       	imagePriviewVisible: true,
		})
	},

	cancelImagePreview(){
		this.setState({
			imagePriviewVisible : false
		})
	},

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1, 8 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},
	checkTitle1( rule, value, callback ){
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},
	//校验副标题字数限制
	checkSubTitle( rule, value, callback ){
		if((/^[\s]{ 1, 50 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},

	render () {
		let { designData, recordData } = this.props;
		let { detailData } = this.state;

		let self = this;
		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

		//表单元素布局属性
		let formItemLayout = {
			labelCol : { span : 4 },
			wrapperCol : { span : 18 }
		};
		let formItemLayoutWithOutLabel = {
			wrapperCol : { span : 18 , offset : 4 }
		}

		//机构名称属性
		let titleProps = getFieldProps('page7Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入机构名称', min : 1, max : 8 },
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let title1Props = getFieldProps('page7SubTitle',{
			validate : [{
				rules : [
					{ required : true , message : '请输入副标题', min : 1, max : 20 },
					{ validator : this.checkTitle1 }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//副标题属性
		let subTitleProps = getFieldProps('page7Content', {
			validate : [{
				rules : [
					{ required : true , message : '请输入内容', min : 1, max : 50 },
					{ validator : this.checkSubTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//图片属性
		let shareImgProps = getFieldProps('page7QrImage',{
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.detailData && this.state.detailData.qrImgUrl){
			defaultFileList.push({
				  uid : -1,
				  name : 'xxx.png',
				  status : 'done',
				  url : this.state.detailData.qrImgUrl
	    	});
		}
		let uploadImgProps = {
			name : 'file',
			action: BASE_UPLOAD_IMAGE,
			listType : 'picture-card',
			fileList : this.state.fileList ? this.state.fileList : defaultFileList,
			onChange : this.imgHandleChange,
			beforeUpload : this.imgBeforeUpload,
	    	onPreview : this.imgHandleOnPreview,
		};

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem { ...formItemLayout }
							  label = "二维码"
							  help = "请上传地址图片">
						<Upload {...shareImgProps} {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible={ this.state.imagePriviewVisible } footer = { null } onCancel = { this.cancelImagePreview }>
								<img alt = "example" src = { this.state.imagePriview } style={{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "标题"
						help = '标题, 不超过8字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...titleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "副标题"
						help = '标题, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入副标题" { ...title1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "内容"
						help = '内容, 不超过50字, 回车可换行'
					>
						<Input size = 'default' placeholder = "请输入内容" type = 'textarea'  { ...subTitleProps }/>
					</FormItem>
					<FormItem wrapperCol={{ offset : 19 }}>
						<Button style = {{ marginLeft : '4px' }} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
					<PageChange detailData = {detailData}
								hasPrev = { this.state.hasPrev }
								hasNext = { this.state.hasNext }
								onPrev = { this.onPrev }
								onNext = { this.onNext }
								pageTotal = {this.state.pageTotal} />
				</Form>
			</div>
		);
	},

}));

export default Page7DesignComponent;
