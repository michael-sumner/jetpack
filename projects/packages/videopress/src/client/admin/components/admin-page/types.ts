import {
	productOriginalProps,
	productPriceOriginalProps,
	siteProductOriginalProps,
} from '../../hooks/use-plan/types';
import { LocalVideo, MetadataVideo, VideoPressVideo } from '../../types';

export type JetpackVideoPressInitialState = {
	allowedVideoExtensions?: Record< string, string >;
	apiNonce?: string;
	apiRoot?: string;
	registrationNonce?: string;
	paidFeatures?: {
		isVideoPressSupported: boolean;
		isVideoPress1TBSupported: boolean;
		isVideoPressUnlimitedSupported: boolean;
	};
	siteProductData?: siteProductOriginalProps;
	productData?: productOriginalProps;
	productPrice?: productPriceOriginalProps;
	adminUrl?: string;
	adminUri?: string;
	siteSuffix?: string;
	contentNonce?: string;
	initialState?: {
		videos?: {
			isFetching?: boolean;
		};
	};
};
declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
		jetpackVideoPressInitialState?: JetpackVideoPressInitialState;
	}
}

export type VideoLibraryProps = {
	videos: Array< VideoPressVideo & MetadataVideo >;
	totalVideos?: number;
	loading?: boolean;
};

export type LocalLibraryProps = {
	videos: Array< LocalVideo >;
	totalVideos?: number;
	loading?: boolean;
	uploading?: boolean;
	onUploadClick?: ( video: LocalVideo ) => void;
};

export interface ConnectionStore {
	getConnectionStatus: () => {
		isUserConnected: boolean;
		isRegistered: boolean;
	};
}
