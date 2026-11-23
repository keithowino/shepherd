import { Helmet } from "react-helmet-async";
import { platform } from "@/platform/config/index.js";

const MetaDataInsert = ({ title = platform.name }) => {
	let pageTitle =
		title === platform.name
			? `${title} - ${platform.excerpt}`
			: `${title} - ${platform.name}`;

	return (
		<Helmet>
			<title>{pageTitle}</title>
			<meta
				name="description"
				content={`${platform.name} - ${platform.description}`}
			/>
			<meta
				name="keywords"
				content="coding, website design, freelancing, software development, ai, llm, anime, aura"
			/>
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content="Self made template." />
		</Helmet>
	);
};

export default MetaDataInsert;
