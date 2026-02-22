import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { XblockContent, XblockProps } from '@src/xblocks/Html-Xblock';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useXblockCompletion, CompletionConfigs } from './useXblockCompletion';
import { xblockRegistry } from './xblockRegistry';

// Register this component as handling Video xblocks
xblockRegistry.registerType('video');

interface XblockVideoContent {
  video_urls: string[],
  youtube_urls: XblockVideoYoutubeURls,
  transcripts: XblockVideoTranscripts,
  start_time: number,
  end_time: number,
  download_allowed: boolean,
  track_url: string,
  handout_url?: string,
}

export interface XblockVideoTranscripts {
  en: string,
}

export interface XblockVideoYoutubeURls {
  '1.0': string,
}

export interface XblockVideoMetadata {
  download_allowed: boolean,
  has_captions: boolean,
  video_duration: number,
}

const VideoXblock = ({ xblockType, blockId, courseId, unitId, debugMode }: XblockProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [content, setContent] = useState<XblockContent<XblockVideoContent, XblockVideoMetadata> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Initialize completion tracking for video blocks (conditionally enabled based on content) 
  const completionConfig = useMemo(() => ({
    ...CompletionConfigs.video,
    enabled: content?.can_complete_on_view || false
  }), [content?.can_complete_on_view]);
  const completion = useXblockCompletion(blockId, courseId, unitId, completionConfig);
  
  // Track video progress for completion
  const [watchTime, setWatchTime] = useState(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getAuthenticatedHttpClient().get<XblockContent<XblockVideoContent, XblockVideoMetadata>>(`${getSiteConfig().lmsBaseUrl}/courses/${courseId}/xblock/${blockId}/handler/get_content`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching video xblock content:', error);
      }
    };

    if (shouldRender) {
      fetchContent();
    }
  }, [blockId, courseId, shouldRender]);

  useEffect(() => {
    if (xblockType === 'video') {
      setShouldRender(true);
    }
  }, [xblockType]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setCurrentTime(video.currentTime);
      
      // Track completion progress
      if (!completion.isComplete && duration > 0) {
        const progressPercent = video.currentTime / duration;
        
        // Mark as complete when 80% watched or video ends
        if (progressPercent >= 0.8) {
          completion.markComplete(1.0);
        }
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStartedPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Always mark complete when video finishes
    if (!completion.isComplete) {
      completion.markComplete(1.0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Calculate completion percentage for display
  const getCompletionPercentage = (): number => {
    if (completion.isComplete) return 100;
    if (duration === 0) return 0;
    return Math.min(Math.round((currentTime / duration) * 100), 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const transformAssetUrl = (assetPath: string) => {
    if (!assetPath) return '';

    // Check if URL already includes the full path (absolute URL)
    if (assetPath.startsWith('http') || assetPath.startsWith('https')) {
      return assetPath;
    }

    const baseUrl = getSiteConfig().lmsBaseUrl;

    // Check if URL already includes the assets path
    if (assetPath.startsWith('/assets/courseware')) {
      return `${baseUrl}${assetPath}`;
    }

    // Transform asset-v1: URLs to proper asset paths
    if (assetPath.startsWith('asset-v1:')) {
      // Replace the last @ with / for the filename
      const transformedPath = assetPath.replace(/@([^@]+)$/, '/$1');
      // For now, we'll use a generic path structure. In a real implementation,
      // you'd need to get the proper hash from the backend or course context
      return `${baseUrl}/assets/courseware/v1/generic/${transformedPath}`;
    }

    // Handle relative URLs by prepending base URL
    if (assetPath.startsWith('/')) {
      return `${baseUrl}${assetPath}`;
    }

    return `${baseUrl}/${assetPath}`;
  };

  const getVideoSource = () => {
    if (!content) return '';

    // Prefer YouTube URLs if available
    if (content.content.youtube_urls && content.content.youtube_urls['1.0']) {
      const youtubeUrl = content.content.youtube_urls['1.0'];
      // Extract video ID from YouTube URL
      const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : youtubeUrl; // Fallback to direct ID if already just an ID
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return '';
  };

  if (!shouldRender) {
    return null;
  }

  const videoSource = getVideoSource();

  // render the video content here using the content state which contains the video urls and metadata
  return (
    <div className="video-xblock">
      {content?.display_name && (
        <h3 className="hd hd-2">{content.display_name}</h3>
      )}

      <div
        id={`video_${blockId}`}
        className="video closed"
        data-metadata={JSON.stringify(content?.metadata)}
        data-block-id={blockId}
        data-course-id={courseId}
        data-completion-enabled={completionConfig.enabled ? "true" : "false"}
        data-completion-mode={completionConfig.enabled ? "manual" : "disabled"}
        data-completion-percentage={completionConfig.enabled ? getCompletionPercentage() : 0}
        data-can-complete-on-view={content?.can_complete_on_view ? "true" : "false"}
        tabIndex={-1}
        style={{ position: 'relative' }}
      >
        {/* Completion status indicators */}
        {debugMode && completionConfig.enabled && completion.isComplete && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              background: '#28a745',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 1000
            }}
          >
            ✓ Video Complete
          </div>
        )}
        
        {/* Progress indicator */}
        {debugMode && completionConfig.enabled && hasStartedPlaying && !completion.isComplete && duration > 0 && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              background: '#007bff',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              zIndex: 1000
            }}
          >
            {getCompletionPercentage()}% watched
          </div>
        )}
        
        {/* Completion error indicator */}
        {debugMode && completionConfig.enabled && completion.error && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              background: '#dc3545',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              zIndex: 1000
            }}
          >
            ⚠ Completion Error
          </div>
        )}

        {/* Completion disabled indicator (for debugging) */}
        {debugMode && !completionConfig.enabled && content && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              background: '#6c757d',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              opacity: 0.7,
              zIndex: 1000
            }}
          >
            Completion disabled
          </div>
        )}

        <div className="focus_grabber first"></div>

        <div className="tc-wrapper">
          <div className="video-wrapper">
            {!videoSource ? (
              <span
                className="spinner"
                aria-hidden="false"
                aria-label="Loading video player"
              >
              </span>
            ) : (
              <>

                <div className="video-player-pre"></div>

                <div className="video-player">
                  {content?.content.youtube_urls?.['1.0'] ? (
                    (() => {
                      const youtubeUrl = content.content.youtube_urls['1.0'];
                      const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
                      const videoId = videoIdMatch ? videoIdMatch[1] : youtubeUrl;

                      return (
                        <iframe
                          id={blockId}
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&start=${content.content.start_time || 0}${content.content.end_time ? `&end=${content.content.end_time}` : ''}`}
                          width="100%"
                          height="400"
                          frameBorder="0"
                          allowFullScreen
                          title={content.display_name}
                        />
                      );
                    })()
                  ) : (
                    <video
                      ref={videoRef}
                      id={blockId}
                      width="100%"
                      height="400"
                      controls={showControls}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onEnded={handleEnded}
                    >
                      {content?.content.video_urls?.map((url, index) => (
                        <source key={index} src={url} type="video/mp4" />
                      ))}
                      <track
                        kind="captions"
                        src={content?.content.track_url}
                        srcLang="en"
                        label="English"
                        default={content?.metadata.has_captions}
                      />
                    </video>
                  )}

                  {!videoSource && (
                    <h4 className="hd hd-4 video-error">
                      No playable video sources found.
                    </h4>
                  )}
                </div>

                <div className="video-player-post"></div>

                {content?.metadata.has_captions && (
                  <div className="closed-captions"></div>
                )}

                {showControls && !content?.content.youtube_urls?.['1.0'] && (
                  <div className="video-controls">
                    <div>
                      <div className="vcr">
                        <div className="vidtime">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                      <div className="secondary-controls"></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="focus_grabber last"></div>

        {/* Downloads and transcripts section */}
        {(content?.metadata.download_allowed || content?.content.track_url || content?.content.handout_url) && (
          <div className="wrapper-video-bottom-section">
            <h3 className="hd hd-4 downloads-heading sr" id={`video-download-transcripts_${blockId}`}>
              Downloads and transcripts
            </h3>

            <div className="wrapper-downloads" role="region" aria-labelledby={`video-download-transcripts_${blockId}`}>
              {content?.metadata.download_allowed && content?.content.video_urls?.[0] && (
                <div className="wrapper-download-video">
                  <h4 className="hd hd-5">Video</h4>
                  <span className="icon fa fa-download" aria-hidden="true"></span>
                  <a
                    className="btn-link video-sources video-download-button"
                    href={content.content.video_urls[0]}
                    target="_self"
                  >
                    Download video file
                  </a>
                </div>
              )}

              {content?.content.track_url && (
                <div className="wrapper-download-transcripts">
                  <h4 className="hd hd-5">Transcripts</h4>
                  <a className="btn-link external-track" href={transformAssetUrl(content.content.track_url)}>
                    Download transcript
                  </a>
                </div>
              )}

              {content?.content.handout_url && (
                <div className="wrapper-handouts">
                  <h4 className="hd hd-5">Handouts</h4>
                  <span className="icon fa fa-download" aria-hidden="true"></span>
                  <a
                    className="btn-link"
                    href={transformAssetUrl(content.content.handout_url)}
                    download
                  >
                    Download Handout
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoXblock;
