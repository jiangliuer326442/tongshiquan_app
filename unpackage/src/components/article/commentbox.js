'use strict'

define(['react','jquery','jquery-browser','jquery-qqface','css!./css/commentbox'], function(React, jQuery){
	class CommentBox extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				comment_focus: false,
				comment_content: "",
			};
		}
		
		componentDidMount(){
			jQuery(".mui-bar-tab").addClass("discuss_footer");
		    jQuery("#emotion").qqFace({
		        assign:'saytext',
		        path:'./js/lib/jquery-qqFace/arclist/',
		        id:"facebox",
		        total:72,
		        row:8,
		        cb: function(){
					jQuery(".mui-bar-tab").addClass("emotion");
		        }
		    });
		    jQuery("#comment_content").css({width: jQuery(this.refs.comment_content).width()+"px"});
		}
		
		handleBlur(){
			this.setState({comment_focus: false});
			if(typeof(this.props.on_blur) == "function"){
				this.props.on_blur(this.state.comment_content);
			}
		}
		
		handleFocus(){
			this.setState({comment_focus: true});
			if(typeof(this.props.on_focus) == "function"){
				this.props.on_focus();
			}
		}
		
		setTextArea(event){
			this.setState({comment_content: event.target.value});
			jQuery("#comment_content").html(event.target.value);
			if(jQuery("#comment_content").height()){
				jQuery(".comment_area").css({height: (50+jQuery("#comment_content").height())+"px"});
			}
		}
		
		setKey(event){
			if(event.keyCode == 8){
				var text_string = jQuery(this.refs.comment_content).val();
				var a = text_string.lastIndexOf("[");
				var b = text_string.lastIndexOf("]");
				if((b+1) == text_string.length){
					text_string = text_string.substr(0, a);
					jQuery(this.refs.comment_content).val(text_string+"]");
					this.setState({comment_content: text_string});
				}
			}
		}
		
		render(){
			return (
				<nav className="mui-bar mui-bar-tab discuss_footer" style={this.state.comment_focus?{paddingRight:"0px"}:null}>
					<pre id="comment_content"></pre>
					<div className="comment_area">
						<div className="content_box">
							<textarea
								onFocus={this.handleFocus.bind(this)}
								onBlur={this.handleBlur.bind(this)}
								onChange={this.setTextArea.bind(this)}
								onKeyDown={this.setKey.bind(this)}
								id="saytext"
								ref="comment_content"
								placeholder={this.props.placeholder}></textarea>
						{this.state.comment_focus || this.state.comment_content!=""?
							<span id="emotion" style={{marginLeft:"0px"}} className="icon clubfriends icon--biaoqing"></span>
						:null}
						</div>
					{this.state.comment_focus || this.state.comment_content!=""?
						<button type="button" onClick={function(){
							mui("#saytext")[0].value ="";
							jQuery(".comment_area").css({height: "50px"});
							this.props.handleSubmit(this.state.comment_content);
						}.bind(this)} className={"mui-btn mui-btn-primary mui-btn-outlined "+(this.state.comment_content.length>0?"":"gray")}>发送</button>
					:
						<a id="emotion" role="button" className="btn btn-default" href="javascript:;">
							<span className="icon clubfriends icon--face"></span>
						</a>
					}
					</div>
				</nav>
			)
		}
	}
	
	return CommentBox;
})
