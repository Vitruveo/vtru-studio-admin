export interface AssetType {
    _id: string;
    formats: Formats;
    framework: Framework;
    mediaAuxiliary: MediaAuxiliary;
    contract: boolean;
    generatedArtworkAI: boolean;
    isOriginal: boolean;
    notMintedOtherBlockchain: boolean;
    licenses: Licenses;
    status: string;
}

export interface Formats {
    original: OriginalFormat;
    display: DefaultFormat;
    preview: DefaultFormat;
    exhibition: DefaultFormat;
    print: DefaultFormat;
}

export interface OriginalFormat {
    name: string;
    path: string;
    size: string | number;
    width: string | number;
    height: string | number;
    definition: any;
}

export interface DefaultFormat {
    name?: string;
    path?: string;
}

export interface Framework {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export interface MediaAuxiliary {
    formats: Formats2;
}

export interface Formats2 {
    arImage: any;
    arVideo: any;
    btsImage: any;
    btsVideo: any;
    codeZip: any;
}

export interface Licenses {
    nft: Nft;
    stream: Stream;
    print: Print;
    remix: Remix;
}

export interface Nft {
    version: string;
    added: boolean;
    license: string;
    elastic: Elastic;
    single: Single;
    unlimited: Unlimited;
    editionOption: string;
}

export interface Elastic {
    editionPrice: number;
    numberOfEditions: number;
    totalPrice: number;
    editionDiscount: boolean;
}

export interface Single {
    editionPrice: number;
}

export interface Unlimited {
    editionPrice: number;
}

export interface Stream {
    version: string;
    added: boolean;
}

export interface Print {
    version: string;
    added: boolean;
    unitPrice: number;
}

export interface Remix {
    version: string;
    added: boolean;
    unitPrice: number;
}
