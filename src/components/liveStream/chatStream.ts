import PinnedContainer from '../chat/pinnedContainer';
import type ChatTopbar from '../chat/topbar';
import Chat from '../chat/chat';
import {AppManagers} from '../../lib/appManagers/managers';
import DivAndCaption from '../divAndCaption';
import apiManagerProxy from '../../lib/mtproto/mtprotoworker';
import Button from '../button';
import ripple from '../ripple';
import {I18n} from '../../lib/langPack';
import callbackify from '../../helpers/callbackify';
import {ChatFull, GroupCall} from '../../layer';
import group = chrome.tabs.group;

export default class ChatStream extends PinnedContainer {
  public onClickListener: () => void;
  protected contentElement: HTMLDivElement;
  protected textWrapperElement: HTMLDivElement;
  protected titleElement: I18n.IntlElement;
  protected subtitleElement: I18n.IntlElement;
  protected buttonElement: HTMLButtonElement;

  public groupCall: GroupCall | null;

  constructor(protected topbar: ChatTopbar, protected chat: Chat, protected managers: AppManagers) {
    super({
      topbar,
      chat,
      listenerSetter: topbar.listenerSetter,
      className: 'stream',
      divAndCaption: new DivAndCaption('pinned-stream'),
      floating: true
    });

    this.divAndCaption.border.remove();
    this.divAndCaption.content.remove();
    this.wrapperUtils.remove();

    this.contentElement = document.createElement('div');
    this.contentElement.classList.add('pinned-stream-content');
    ripple(this.contentElement);
    this.wrapper.append(this.contentElement);

    this.textWrapperElement = document.createElement('div');
    this.textWrapperElement.classList.add('pinned-stream-text-wrapper');
    this.contentElement.append(this.textWrapperElement);

    const titleHtmlElement = document.createElement('div');
    titleHtmlElement.classList.add('pinned-stream-title');
    this.titleElement = new I18n.IntlElement({
      key: 'PeerInfo.Action.LiveStream',
      element: titleHtmlElement
    });
    this.textWrapperElement.append(titleHtmlElement);

    const subtitleHtmlElement = document.createElement('div');
    subtitleHtmlElement.classList.add('pinned-stream-subtitle');
    this.subtitleElement = new I18n.IntlElement({
      key: 'Peer.LiveStream.Watching',
      args: [0],
      element: subtitleHtmlElement
    });
    this.textWrapperElement.append(subtitleHtmlElement);

    this.buttonElement = Button('btn btn-pinned-stream', {
      text: 'ChannelJoin'
    });
    this.contentElement.append(this.buttonElement);
    this.wrapper.addEventListener('click', () => {
      if(this.onClickListener) {
        this.onClickListener();
      }
    });
  }

  public async setPeerId(peerId: PeerId) {
    const peerFullAcked =
      await this.chat.managers.acknowledged.appProfileManager.getProfileByPeerId(peerId);

    const peerFull = await peerFullAcked.result;

    if(peerFull._ !== 'userFull' && peerFull.call) {
      const groupCallFull =
        await this.chat.managers.appGroupCallsManager.getGroupCallFull(peerFull.call.id);

      if(groupCallFull._ === 'groupCall' && groupCallFull.pFlags.rtmp_stream) {
        return () => {
          this.set(groupCallFull, groupCallFull.participants_count);
        }
      }
    }

    return () => {
    };
  }

  public update(participantCount: number) {
    this.subtitleElement.compareAndUpdate({args: [participantCount]});
  }

  public set(groupCall: GroupCall, participantCount: number) {
    this.groupCall = groupCall;
    this.subtitleElement.compareAndUpdate({args: [participantCount]});
    this.toggle(false);
  }

  public unset() {
    this.groupCall = null;
    this.toggle(true);
  }
}
