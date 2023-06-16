import Highway from "@dogstudio/highway";
import { gsap } from "gsap";

export class Fade extends Highway.Transition {
	out({ from, done }) {
		gsap.fromTo(
			from,
			{ opacity: 1 },
			{
				opacity: 0,
				duration: 0.5,
				onComplete: () => {
					done();
				},
			},
		);
	}
	in({ from, to, done }) {
		// Then Reset Scroll
		window.scrollTo(0, 0);

		// Remove Old View
		from.remove();

		// And finally shows up new content
		gsap.fromTo(
			to,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 0.5,
				onComplete: () => {
					done();
				},
			},
		);
	}
}
