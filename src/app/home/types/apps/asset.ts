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
    assetMetadata: AssetMetadata;
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
    formats: MediaAuxiliaryFormats;
}

export interface MediaAuxiliaryFormats {
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

export interface AssetMetadata {
    isCompleted: boolean;
    context?: Context;
    taxonomy: Taxonomy;
    creators: Creators;
    provenance: Provenance;
}

export interface Context {
    formData: ContextFormData;
}

export interface ContextFormData {
    title: string;
    description: string;
    culture: string;
    mood: string[];
    colors: string[];
    orientation: string;
}

export interface Taxonomy {
    formData: TaxonomyFormData;
}

export interface TaxonomyFormData {
    objectType: string;
    category: string;
    tags: string[];
    collections: string[];
    medium: string[];
    style: string[];
    subject: string[];
    aiGeneration: string;
    arenabled: string;
    nudity: string;
}

export interface Creators {
    formData: CreatorsFormData[];
}

export interface CreatorsFormData {
    name: string;
    roles: string[];
    bio: string;
    nationality: string;
    residence: string;
    profileUrl: string;
}

export interface Provenance {
    formData: ProvenanceFormData;
}

export interface ProvenanceFormData {
    blockchain: string;
    exhibitions: any[];
    awards: any[];
}
