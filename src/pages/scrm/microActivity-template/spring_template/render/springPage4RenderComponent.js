import React from 'react';

let NewYearPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design spring-page4-render-design">
				<div className="spring-page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "spring-page4-content-item1">
					<img className="spring-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = "spring-page4-content-item2">
					<img className="spring-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[1].imgurl : ""} />
				</div>

				<div className="spring-page4-content-value">
					{ detailData ? detailData.intro : "" }
				</div>
			</div>
		)
	}
});

export default NewYearPage5RenderComponent;
