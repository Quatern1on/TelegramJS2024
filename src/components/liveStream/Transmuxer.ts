import SourceBufferSink, {Sink} from './SourceBufferSink';

export default class Transmuxer {
  private readonly videoSink: Sink;
  private readonly audioSink: Sink;
  private initSegmentIncluded: boolean;
  private MP4Box: any;

  public constructor(videoSink: Sink, audioSink: Sink) {
    this.videoSink = videoSink;
    this.audioSink = audioSink;
  }

  public async init() {
    // @ts-ignore
    this.MP4Box = await import('mp4box');
  }

  public push(data: ArrayBuffer, timestamp: number) {
    const file = this.MP4Box.createFile();

    file.onReady = (info: any) => {
      file.moov.traks[1].mdia.minf.stbl.stsd.entries[0].channel_count = 2;

      file.onSegment = (id: number, sink: SourceBufferSink, buffer: ArrayBuffer,
        sampleNumber: number, last: boolean) => {
        sink.appendBuffer(buffer, timestamp);
      }

      file.setSegmentOptions(info.videoTracks[0].id, this.videoSink, {nbSamples: 1000});
      file.setSegmentOptions(info.audioTracks[0].id, this.audioSink, {nbSamples: 1000});
      const initSegments = file.initializeSegmentation();

      if(!this.initSegmentIncluded) {
        this.videoSink.appendBuffer(initSegments[0].buffer, 0);
        this.audioSink.appendBuffer(initSegments[1].buffer, 0);
        this.initSegmentIncluded = true;
      }
      file.start();
    };

    file.onError = (err: any) => {
      throw err;
    }

    // @ts-ignore
    data.fileStart = 0;
    file.appendBuffer(data);
    file.flush();
  }
}
