import * as React from "react";
import * as ReactDOM from "react-dom";

import { HeaderComponent } from "./header";
import { BodyComponent } from "./body";

export class HomeComponent extends React.Component<any, any> {
	render() {
		return (
			<div className="home">
				<HeaderComponent />
				<BodyComponent />
			</div>
		);
	}
}