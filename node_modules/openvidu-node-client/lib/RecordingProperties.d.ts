import { RecordingLayout } from './RecordingLayout';
/**
 * See [[OpenVidu.startRecording]]
 */
export interface RecordingProperties {
    /**
     * The name you want to give to the video file. You can access this same value in your clients on recording events (`recordingStarted`, `recordingStopped`).
     * **WARNING: this parameter follows an overwriting policy.** If you name two recordings the same, the newest MP4 file will overwrite the oldest one
     */
    name?: string;
    /**
     * The layout to be used in the recording
     */
    recordingLayout?: RecordingLayout;
    /**
     * If [[recordingLayout]] is `CUSTOM`, the relative path to the specific custom layout you want to use.
     * See [Custom recording layouts](https://openvidu.io/docs/advanced-features/recording#custom-recording-layouts) to learn more
     */
    customLayout?: string;
}
