interface AppendTask {
  data: BufferSource;
  timestamp: number;
}

interface RemoveTask {
  start: number;
  end: number;
}

export interface Sink {
  appendBuffer(data: BufferSource, timestamp: number): void;
  remove(start: number, end: number): void;
}

export default class SourceBufferSink implements Sink {
  private buffer: SourceBuffer;
  private appendQueue: AppendTask[];
  private removeQueue: RemoveTask[];

  constructor(buffer: SourceBuffer) {
    this.buffer = buffer;
    this.buffer.addEventListener('updateend', this.handleUpdateEnd.bind(this));
    this.appendQueue = [];
    this.removeQueue = [];
  }

  public appendBuffer(data: BufferSource, timestamp: number) {
    const task: AppendTask = {data, timestamp};

    if(!this.buffer.updating) {
      this.doAppend(task);
    } else {
      this.appendQueue.push(task);
    }
  }

  public remove(start: number, end: number) {
    const task: RemoveTask = {start, end};

    if(!this.buffer.updating) {
      this.doRemove(task);
    } else {
      this.removeQueue.push(task);
    }
  }

  private doAppend(task: AppendTask) {
    this.buffer.timestampOffset = task.timestamp;
    this.buffer.appendBuffer(task.data);
  }

  private doRemove(task: RemoveTask) {
    this.buffer.remove(task.start, task.end);
  }

  private handleUpdateEnd() {
    if(this.removeQueue.length > 0) {
      this.removeQueue.forEach((task) => {
        this.doRemove(task);
      });
      this.removeQueue = [];
    }

    if(this.appendQueue.length > 0) {
      this.doAppend(this.appendQueue.shift());
    }
  }
}
