import * as React from "react";
import * as ReactDOM from "react-dom";

var data = [
	{name: "button"},
	{name: "cell"},
	{name: "toast"},
	{name: "dialog"},
	{name: "progress"},
	{name: "msg"},
	{name: "article"},
	{name: "actionsheet"},
	{name: "icons"},
	{name: "panel"},
	{name: "tab"},
	{name: "searchbar"}
];

export class ListComponent extends React.Component<any, any> {
	render(){
		var commentNodes = this.props.data.map(function(comment){
			return (
				<a key={comment.name} href={'#' + comment.name} className="weui_grid">
					<div className="weui_grid_icon">
						<i className={'icon icon_' + comment.name}></i>
					</div>
					<p className='weui_grid_label'>
						{comment.name}
					</p>
				</a>
			);
		});
		return (
			<div className="weui_grids">
				{commentNodes}
			</div>
		);
	}
}
export class BodyComponent extends React.Component<any, any> {
	render(){
		return (
			<main>
				<ListComponent data={data} />
			</main>
		);
	}
}