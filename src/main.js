import Highway from "@dogstudio/highway";
import { Fade } from "./transition";

import "./css/main.css";
import "./scss/style.scss";

// eslint-disable-next-line no-unused-vars
const H = new Highway.Core({
	transitions: {
		default: Fade,
	},
});
