import { isVideoMedia } from '@/utils/assets';

/* eslint-disable @next/next/no-img-element */
// NOTE: DESATIVANDO ESLINT PARA A TAG IMG, POIS O ESLINT NÃO RECONHECE A TAG IMG COMO UMA TAG VALIDA NO NEXT.JS

interface AssetPreviewProps {
    media?: string;
}

const fallback = 'https://placehold.co/250';

const VideoAsset = ({ media }: Required<AssetPreviewProps>) => (
    <video
        src={media ?? fallback}
        controls={false}
        style={{ width: '100%', objectFit: 'cover', height: 250 }}
        autoPlay
        loop
        muted
    />
);

const ImageAsset = ({ media }: Required<AssetPreviewProps>) => {
    const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
    };

    return (
        <img
            src={media ?? fallback}
            alt="asset"
            onError={onError}
            style={{ width: '100%', objectFit: 'cover', height: 250 }}
        />
    );
};

export const AssetPreview = ({ media }: AssetPreviewProps) => {
    if (!media) return <ImageAsset media={fallback} />;

    if (isVideoMedia(media)) {
        return <VideoAsset media={media} />;
    }

    return <ImageAsset media={media} />;
};
