import * as React from "react";
import * as ReactDOM from "react-dom";

export class HeaderComponent extends React.Component<any, any> {
	render(){
		return (
			<header>
				<h1>WeUI demo</h1>
				<p>一个简单的demo</p>
		    </header>
		);
	}
}