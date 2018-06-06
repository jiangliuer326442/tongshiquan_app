'use strict'

define([], function(){
	const rootRoute = [{
		path: '/',
		getComponent(nextState, cb) {
			requirejs(['containers/entry'], function(Entry){
				cb(null, Entry);
			});
		}
	},{
		path: '/guide',
		getComponent(nextState, cb) {
			requirejs(['containers/guide'], function(Guide){
				cb(null, Guide);
			});
		}
	},{
		path: '/reg/login',
		getComponent(nextState, cb) {
			requirejs(['containers/register/login'], function(Login){
				cb(null, Login);
			});
		}
	},{
		path: '/reg/putcompany',
		getComponent(nextState, cb) {
			requirejs(['containers/register/putcompany'], function(PutCompany){
				cb(null, PutCompany);
			});
		}
	},{
		path: '/reg/putphone',
		getComponent(nextState, cb) {
			requirejs(['containers/register/putphone'], function(PutPhone){
				cb(null, PutPhone);
			});
		}
	},{
		path: '/reg/putcode',
		getComponent(nextState, cb) {
			requirejs(['containers/register/putcode'], function(PutCode){
				cb(null, PutCode);
			});
		}
	},{
		path: '/post',
		getComponent(nextState, cb) {
			requirejs(['containers/article/post'], function(Post){
				cb(null, Post);
			});
		}
	},{
		path: '/article',
		getComponent(nextState, cb) {
			requirejs(['containers/article/article'], function(Article){
				cb(null, Article);
			});
		}
	},{
		path: '/discuz/createbar',
		getComponent(nextState, cb) {
			requirejs(['containers/discuz/createbar'], function(DiscuzCreateBar){
				cb(null, DiscuzCreateBar);
			});
		}
	},{
		path: '/discuz/addpost',
		getComponent(nextState, cb) {
			requirejs(['containers/discuz/addpost'], function(DiscuzAddPost){
				cb(null, DiscuzAddPost);
			});
		}
	},{
		path: '/discuz/:companyid',
		getComponent(nextState, cb) {
			requirejs(['containers/discuz/index'], function(Discuz){
				cb(null, Discuz);
			});
		}
	},{
		path: '/company/:companyid',
		getComponent(nextState, cb) {
			requirejs(['containers/company/index'], function(Company){
				cb(null, Company);
			});
		}
	},{
		path: '/structor/userinfo',
		getComponent(nextState, cb) {
			requirejs(['containers/employee/user'], function(UserInfo){
				cb(null, UserInfo);
			});
		}
	},{
		path: '/structor/edituser',
		getComponent(nextState, cb) {
			requirejs(['containers/employee/edituser'], function(EditUser){
				cb(null, EditUser);
			});
		}
	},{
		path: '/chat',
		getComponent(nextState, cb) {
			requirejs(['containers/chat/recent'], function(ChatRecent){
				cb(null, ChatRecent);
			});
		}
	},{
		path: '/chat/detail',
		getComponent(nextState, cb) {
			requirejs(['containers/chat/detail'], function(ChatContent){
				cb(null, ChatContent);
			});
		}
	},{
		path: '/chat/box',
		getComponent(nextState, cb) {
			requirejs(['components/chat/chatbox'], function(ChatBox){
				cb(null, ChatBox);
			});
		}
	},{
		path: '/club',
		getComponent(nextState, cb) {
			requirejs(['containers/club/index'], function(Club){
				cb(null, Club);
			});
		}
	},{
		path: '/club/create',
		getComponent(nextState, cb) {
			requirejs(['containers/club/create'], function(CreateSay){
				cb(null, CreateSay);
			});
		}
	},{
		path: '/club/article',
		getComponent(nextState, cb) {
			requirejs(['containers/club/article'], function(TwitterArticle){
				cb(null, TwitterArticle);
			});
		}
	},{
		path: '/ucenter',
		getComponent(nextState, cb) {
			requirejs(['containers/ucenter/index'], function(Ucenter){
				cb(null, Ucenter);
			});
		}
	}]
	
	return rootRoute;
})	