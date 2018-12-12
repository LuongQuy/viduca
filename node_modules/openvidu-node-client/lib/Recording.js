"use strict";
/*
 * (C) Copyright 2017-2018 OpenVidu (https://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * See [[OpenVidu.startRecording]]
 */
var Recording = /** @class */ (function () {
    /* tslint:disable:no-string-literal */
    /**
     * @hidden
     */
    function Recording(json) {
        /**
         * Size of the recording in bytes (0 until the recording is stopped)
         */
        this.size = 0;
        /**
         * Duration of the recording in seconds (0 until the recording is stopped)
         */
        this.duration = 0;
        /**
         * `true` if the recording has an audio track, `false` otherwise (currently fixed to true)
         */
        this.hasAudio = true;
        /**
         * `true` if the recording has a video track, `false` otherwise (currently fixed to true)
         */
        this.hasVideo = true;
        this.id = json['id'];
        this.sessionId = json['sessionId'];
        this.createdAt = json['createdAt'];
        this.size = json['size'];
        this.duration = json['duration'];
        this.url = json['url'];
        this.hasAudio = json['hasAudio'];
        this.hasVideo = json['hasVideo'];
        this.status = json['status'];
        this.name = json['name'];
        this.recordingLayout = json['recordingLayout'];
    }
    return Recording;
}());
exports.Recording = Recording;
(function (Recording) {
    /**
     * See [[Recording.status]]
     */
    var Status;
    (function (Status) {
        /**
         * The recording is starting (cannot be stopped)
         */
        Status[Status["starting"] = 0] = "starting";
        /**
         * The recording has started and is going on
         */
        Status[Status["started"] = 1] = "started";
        /**
         * The recording has finished OK
         */
        Status[Status["stopped"] = 2] = "stopped";
        /**
         * The recording is available for downloading. This status is reached for all
         * stopped recordings if [OpenVidu Server configuration](https://openvidu.io/docs/reference-docs/openvidu-server-params/)
         * property `openvidu.recording.public-access` is true
         */
        Status[Status["available"] = 3] = "available";
        /**
         * The recording has failed
         */
        Status[Status["failed"] = 4] = "failed";
    })(Status = Recording.Status || (Recording.Status = {}));
})(Recording = exports.Recording || (exports.Recording = {}));
exports.Recording = Recording;
//# sourceMappingURL=Recording.js.map