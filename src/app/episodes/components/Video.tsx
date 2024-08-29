import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import { Source } from "@/types/episodes.type";

type Props = {
  url: string;
  episodes: any;
};

type PlayerOptions = {
  displayCurrentQuality: boolean;
};

interface ExtraPlayer extends Player {
  hlsQualitySelector: (playerOptions: PlayerOptions) => void;
}

function Video({ url, episodes }: Props) {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState<ExtraPlayer | null>(null);

  useEffect(() => {
    if (url && videoNode.current && !player) {
      const _player = videojs(
        videoNode.current,
        {
          fill: true,
          fluid: true,
          autoplay: false,
          controls: true,
          preload: "metadata",
        },
        function () {
          (_player as ExtraPlayer).hlsQualitySelector({
            displayCurrentQuality: true,
          });
        },
      );
      setPlayer(_player as ExtraPlayer);
    }

    if (player) {
      player.ready(() => {
        const source = episodes?.data.sources.find(
          (source: Source) => source.quality === "default",
        );

        player.src([
          {
            src: source?.url,
            type: "application/x-mpegURL",
          },
        ]);
      });
    }
  }, [url, videoNode.current, player, setPlayer, videojs]);

  return <video ref={videoNode} className="video-js"></video>;
}

export default Video;
