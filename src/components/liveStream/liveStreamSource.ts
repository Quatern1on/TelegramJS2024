import rootScope from '../../lib/rootScope';
import {GroupCallStreamChannel, InputGroupCall} from '../../layer';
import SourceBufferSink, {Sink} from './SourceBufferSink';
import Transmuxer from './Transmuxer';

const MIN_DELAY = 6000;
const MAX_DELAY = 20000;

export default class LiveStreamSource {
  protected readonly mediaSource: MediaSource;
  protected readonly video: HTMLVideoElement;
  protected readonly _url: string;
  protected readonly chatId: ChatId;
  protected readonly call: InputGroupCall.inputGroupCall;
  protected readonly dc: number;
  protected readonly channel: number;
  protected readonly channelScale: number;
  protected readonly segmentDuration: number;
  protected readonly chanelInitTime: number;
  protected streamInitTime: number;
  protected videoBuffer: SourceBuffer;
  protected audioBuffer: SourceBuffer;
  protected videoSink: Sink;
  protected audioSink: Sink;
  protected transmuxer: Transmuxer;
  protected currentBufferOffset: number;
  protected lastSegmentChannelTime: number;
  protected _onStartCallback: () => void;

  public constructor(call: InputGroupCall.inputGroupCall, channel: GroupCallStreamChannel.groupCallStreamChannel,
    dc: number, video: HTMLVideoElement) {
    this.call = call;
    this.video = video;
    this.dc = dc;
    this.channel = channel.channel;
    this.channelScale = channel.scale;
    this.segmentDuration = 1000 >> channel.scale;
    this.chanelInitTime = +channel.last_timestamp_ms;
    this.streamInitTime = Date.now();

    this.mediaSource = new MediaSource();
    this._url = URL.createObjectURL(this.mediaSource);

    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this));

    this.processSegment = this.processSegment.bind(this);
  }

  public set onStartCallback(callback: () => void) {
    this._onStartCallback = callback;
    if(this.currentBufferOffset > 0) {
      callback();
    }
  }

  public get url() {
    return this._url;
  }

  protected get currentChannelTime(): number {
    return Date.now() - this.streamInitTime + this.chanelInitTime;
  }

  protected get nextSegmentChannelTime(): number {
    return this.lastSegmentChannelTime + this.segmentDuration;
  }

  protected get timeUntilNextSegmentAvailable(): number {
    return this.nextSegmentChannelTime - this.currentChannelTime;
  }

  protected async downloadSegment(time: number, quality: number) {
    // console.log(`Downloading ${quality === 2 ? 'high' : 'medium'} quality segment at offset ${time} ms`);
    const segment = await rootScope.managers.apiManager.invokeApi('upload.getFile', {
      offset: 0,
      limit: 1048576,
      location: {
        _: 'inputGroupCallStream',
        time_ms: time,
        scale: this.channelScale,
        video_channel: this.channel,
        video_quality: quality,
        call: this.call
      }
    }, {
      dcId: this.dc
    });

    if(segment._ === 'upload.fileCdnRedirect') {
      throw new Error('Received CDN redirect');
    }

    return segment.bytes.slice(32);
  }

  protected async processSegment() {
    if(this.mediaSource.readyState !== 'open') {
      return;
    }

    if(this.currentChannelTime - this.nextSegmentChannelTime > MAX_DELAY) {
      console.error('Delay is to high, catching up');
      this.lastSegmentChannelTime = Math.floor(this.currentChannelTime / this.segmentDuration) *
        this.segmentDuration - this.segmentDuration - MIN_DELAY;
    }

    const currentTime = this.video.currentTime;

    const buffered = this.videoBuffer.buffered;
    if(buffered.length > 0) {
      const removeEnd = currentTime - 1;
      if(removeEnd > 0) {
        this.videoSink.remove(0, removeEnd);
        this.audioSink.remove(0, removeEnd);
      }
    }

    const futureRange = this.currentBufferOffset - currentTime;

    const quality = (futureRange > MIN_DELAY / 2000 || this.currentBufferOffset < MIN_DELAY) ? 2 : 1;

    // console.log(`Current channel time: ${this.currentChannelTime}, next segment channel time: ${this.nextSegmentChannelTime}`);

    let segment: Uint8Array;
    try {
      segment = await this.downloadSegment(this.nextSegmentChannelTime, quality);
    } catch(e: any) {
      if(e.type && e.type === 'TIME_TOO_BIG') {
        console.error(e);
        setTimeout(this.processSegment, 250);
        // Dirty hack to nudge stream a little bit into the past, so that error is not spammed
        this.streamInitTime += 100;
        return;
      }
      throw e;
    }

    if(this.mediaSource.readyState !== 'open') {
      return;
    }

    this.transmuxer.push(segment.buffer, this.currentBufferOffset);
    if(this.currentBufferOffset === 0) {
      this._onStartCallback();
    }

    this.lastSegmentChannelTime += this.segmentDuration;
    this.currentBufferOffset += this.segmentDuration / 1000;

    setTimeout(this.processSegment, this.timeUntilNextSegmentAvailable);
  }

  protected async handleSourceOpen() {
    this.videoBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42001E"');
    this.videoBuffer.mode = 'segments';
    this.videoSink = new SourceBufferSink(this.videoBuffer);

    this.audioBuffer = this.mediaSource.addSourceBuffer('audio/mp4; codecs="opus"');
    this.audioBuffer.mode = 'segments';
    this.audioSink = new SourceBufferSink(this.audioBuffer);

    this.transmuxer = new Transmuxer(this.videoSink, this.audioSink);
    await this.transmuxer.init();

    this.currentBufferOffset = 0;

    this.lastSegmentChannelTime = this.chanelInitTime - MIN_DELAY - this.segmentDuration;
    if(this.lastSegmentChannelTime < -this.segmentDuration) {
      setTimeout(this.processSegment, -this.lastSegmentChannelTime - this.segmentDuration);
      this.lastSegmentChannelTime = -this.segmentDuration;
    } else {
      this.processSegment();
    }
  }
}
