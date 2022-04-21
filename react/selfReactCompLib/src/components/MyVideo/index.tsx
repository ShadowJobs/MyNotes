import React from 'react';
import {Player,ControlBar,PlayToggle,CurrentTimeDisplay,TimeDivider,
  PlaybackRateMenuButton,VolumeMenuButton} from 'video-react';
import "video-react/dist/video-react.css"
export const MyVideo: React.FC<{url:string}> = ({url}) => {
  return (
    <Player poster="/aa.svg" src={url}>
      <ControlBar autoHide={false} disableDefaultControls={false}>
        <PlayToggle />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
        <VolumeMenuButton />
      </ControlBar>
    </Player>)
};
