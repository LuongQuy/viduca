import { RecordingLayout } from './RecordingLayout';
/**
 * See [[OpenVidu.startRecording]]
 */
export declare class Recording {
    /**
     * Recording unique identifier
     */
    id: string;
    /**
     * Session associated to the recording
     */
    sessionId: string;
    /**
     * Time when the recording started in UTC milliseconds
     */
    createdAt: number;
    /**
     * Size of the recording in bytes (0 until the recording is stopped)
     */
    size: number;
    /**
     * Duration of the recording in seconds (0 until the recording is stopped)
     */
    duration: number;
    /**
     * URL of the recording. You can access the file from there. It is `null` until recording is stopped or if OpenVidu Server configuration property `openvidu.recording.public-access` is false
     */
    url: string;
    /**
     * `true` if the recording has an audio track, `false` otherwise (currently fixed to true)
     */
    hasAudio: boolean;
    /**
     * `true` if the recording has a video track, `false` otherwise (currently fixed to true)
     */
    hasVideo: boolean;
    /**
     * Status of the recording
     */
    status: Recording.Status;
    /**
     * Name of the Recording. The video file will be named after this property.
     * You can access this same value in your clients on recording events
     * (`recordingStarted`, `recordingStopped`)
     */
    name: string;
    /**
     * The layout used in this Recording
     */
    recordingLayout: RecordingLayout;
    /**
     * @hidden
     */
    constructor(json: JSON);
}
export declare namespace Recording {
    /**
     * See [[Recording.status]]
     */
    enum Status {
        /**
         * The recording is starting (cannot be stopped)
         */
        starting = 0,
        /**
         * The recording has started and is going on
         */
        started = 1,
        /**
         * The recording has finished OK
         */
        stopped = 2,
        /**
         * The recording is available for downloading. This status is reached for all
         * stopped recordings if [OpenVidu Server configuration](https://openvidu.io/docs/reference-docs/openvidu-server-params/)
         * property `openvidu.recording.public-access` is true
         */
        available = 3,
        /**
         * The recording has failed
         */
        failed = 4
    }
}
