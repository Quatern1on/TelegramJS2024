import ButtonIcon from '../buttonIcon';
import {AppManagers} from '../../lib/appManagers/managers';
import rootScope from '../../lib/rootScope';
import {AvatarNew} from '../avatarNew';
import {I18n} from '../../lib/langPack';
import wrapPeerTitle from '../wrappers/peerTitle';
import LiveStreamSource from './liveStreamSource';
import {InputGroupCall} from '../../layer';
import {doubleRaf} from '../../helpers/schedulers';
import {replaceButtonIcon} from '../button';
import PopupElement from '../popups';
import PopupForward from '../popups/forward';
import PopupPickUser from '../popups/pickUser';
import PopupPeer from '../popups/peer';
import PeerTitle from '../peerTitle';
import appImManager from '../../lib/appManagers/appImManager';
import getPeerActiveUsernames from '../../lib/appManagers/utils/peers/getPeerActiveUsernames';

export default class StreamViewer {
  protected managers: AppManagers;

  protected root: HTMLDivElement;
  protected backdrop: HTMLDivElement;
  protected topbar: { [K in 'main' | 'buttons' | 'author' | 'infoWrapper' | 'title' | 'subtitle']: HTMLElement } = {} as any;
  protected content: { [K in 'wrapper' | 'loadingOverlay' | 'backdrop']: HTMLElement } = {} as any;
  protected bottombar: { [K in 'main' | 'left' | 'right' | 'liveBadge']: HTMLElement } = {} as any;

  protected closeBtn: HTMLButtonElement;
  protected shareBtn: HTMLButtonElement;
  protected muteBtn: HTMLButtonElement;
  protected pipBtn: HTMLButtonElement;
  protected fullscreenBtn: HTMLButtonElement;

  protected video: HTMLVideoElement;
  protected inviteLink: string | null;

  protected call: InputGroupCall;

  constructor() {
    this.managers = rootScope.managers;

    this.root = document.createElement('div');
    this.root.classList.add('stream-viewer-root');

    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('stream-viewer-backdrop');
    this.root.append(this.backdrop);

    this.topbar.main = document.createElement('div');
    this.topbar.main.classList.add('stream-viewer-topbar');
    this.root.append(this.topbar.main);

    this.topbar.author = document.createElement('div');
    this.topbar.author.classList.add('stream-viewer-author');
    this.topbar.main.append(this.topbar.author);

    this.topbar.infoWrapper = document.createElement('div');
    this.topbar.author.append(this.topbar.infoWrapper);

    this.topbar.title = document.createElement('div');
    this.topbar.title.classList.add('stream-viewer-title');
    this.topbar.infoWrapper.append(this.topbar.title);

    this.topbar.subtitle = document.createElement('div');
    this.topbar.subtitle.classList.add('stream-viewer-subtitle');
    this.topbar.infoWrapper.append(this.topbar.subtitle);

    new I18n.IntlElement({
      key: 'Peer.Activity.Chat.Streaming',
      element: this.topbar.subtitle
    });

    this.topbar.buttons = document.createElement('div');
    this.topbar.buttons.classList.add('stream-viewer-buttons');
    this.topbar.main.append(this.topbar.buttons);

    this.closeBtn = ButtonIcon('close', {noRipple: true});
    this.shareBtn = ButtonIcon('forward', {noRipple: true});
    this.topbar.buttons.append(this.shareBtn, this.closeBtn);

    this.content.wrapper = document.createElement('div');
    this.content.wrapper.classList.add('stream-viewer-content');
    const resizeContent = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if(w / h > 16 / 9) {
        this.content.wrapper.style.width = `${h * 0.85 * 16 / 9}px`;
        this.content.wrapper.style.height = `${h * 0.85}px`;
      } else {
        this.content.wrapper.style.width = `${w * 0.85}px`;
        this.content.wrapper.style.height = `${w * 0.85 * 9 / 16}px`;
      }
    }
    window.addEventListener('resize', resizeContent.bind(this));
    resizeContent();
    this.root.append(this.content.wrapper);

    this.content.backdrop = document.createElement('div');
    this.content.backdrop.classList.add('stream-viewer-content-backdrop');
    this.content.wrapper.append(this.content.backdrop);

    this.content.loadingOverlay = document.createElement('div');
    this.content.loadingOverlay.classList.add('stream-viewer-content-loading');
    this.content.wrapper.append(this.content.loadingOverlay);

    this.bottombar.main = document.createElement('div');
    this.bottombar.main.classList.add('stream-viewer-content-bottombar');
    this.content.wrapper.append(this.bottombar.main);

    this.bottombar.left = document.createElement('div');
    this.bottombar.left.classList.add('stream-viewer-content-bottom-group');
    this.bottombar.main.append(this.bottombar.left);

    this.bottombar.liveBadge = document.createElement('div');
    this.bottombar.liveBadge.classList.add('stream-viewer-live-badge');
    this.bottombar.liveBadge.innerText = 'LIVE';
    this.bottombar.left.append(this.bottombar.liveBadge);

    this.bottombar.right = document.createElement('div');
    this.bottombar.right.classList.add('stream-viewer-content-bottom-group');
    this.bottombar.main.append(this.bottombar.right);

    this.video = document.createElement('video');
    this.video.addEventListener('leavepictureinpicture', () => {
      requestAnimationFrame(() => this.video.play());
      this.root.classList.remove('hide');
    });
    this.content.wrapper.append(this.video);

    this.muteBtn = ButtonIcon('speaker', {noRipple: true});
    this.pipBtn = ButtonIcon('pip', {noRipple: true});
    this.fullscreenBtn = ButtonIcon('fullscreen', {noRipple: true});

    this.muteBtn.addEventListener('click', () => {
      if(this.video.muted) {
        this.video.muted = false;
        replaceButtonIcon(this.muteBtn, 'speaker');
      } else {
        this.video.muted = true;
        replaceButtonIcon(this.muteBtn, 'speakeroff');
      }
    });

    this.pipBtn.addEventListener('click', (e) => {
      this.video.requestPictureInPicture();
      this.root.classList.add('hide');
    });

    this.fullscreenBtn.addEventListener('click', (e) => {
      if(document.fullscreenElement) {
        document.exitFullscreen();
        replaceButtonIcon(this.fullscreenBtn, 'fullscreen');
      } else {
        this.content.wrapper.requestFullscreen();
        replaceButtonIcon(this.fullscreenBtn, 'smallscreen');
      }
    });

    this.bottombar.left.append(this.muteBtn);
    this.bottombar.right.append(this.pipBtn);
    this.bottombar.right.append(this.fullscreenBtn);

    this.shareBtn.addEventListener('click', () => {
      PopupPickUser.createSharingPicker({
        onSelect: async(peerId) => {
          await this.managers.appMessagesManager.sendText({
            peerId: peerId,
            text: this.inviteLink
          });
          await appImManager.setInnerPeer({peerId});
          this.close();
        }
      });
    })

    this.backdrop.addEventListener('click', (e) => {
      this.close();
    });

    this.closeBtn.addEventListener('click', (e) => {
      this.close();
    });
  }

  public async openStream(chatId: ChatId) {
    const chat = await this.managers.appChatsManager.getChat(chatId);
    const chatFull = await this.managers.appProfileManager.getChatFull(chatId);

    const usernames = getPeerActiveUsernames(chat);
    this.inviteLink = null;
    if(chatFull.exported_invite && chatFull.exported_invite._ == 'chatInviteExported') {
      this.inviteLink = chatFull.exported_invite.link;
    }
    if(usernames.length > 0) {
      this.inviteLink = 'https://t.me/' + usernames[0];
    }
    if(this.inviteLink) {
      this.shareBtn.classList.remove('hide');
    } else {
      this.shareBtn.classList.add('hide');
    }

    this.call = {
      '_': 'inputGroupCall',
      'id': chatFull.call.id,
      'access_hash': chatFull.call.access_hash
    };

    const groupCallId = this.call.id;
    const ssrc = crypto.getRandomValues(new Uint32Array(1))[0];
    const params = JSON.stringify({
      'fingerprints': [],
      'pwd': '',
      'ssrc': ssrc,
      'ssrc-groups': [],
      'ufrag': ''
    });

    const groupCallFull =
      await this.managers.appGroupCallsManager.getGroupCallFull(groupCallId);

    if(groupCallFull._ === 'groupCallDiscarded') {
      throw new Error('Could not join discarded group call');
    }

    const joinedCall = await this.managers.appGroupCallsManager.joinGroupCall(groupCallId, {
      _: 'dataJSON',
      data: params
    }, {
      type: 'main'
    });

    const avatar = AvatarNew({
      peerId: chatId.toPeerId(true),
      size: 44
    });
    this.topbar.author.prepend(avatar.node);

    avatar.readyPromise.then(() => {
      const img = avatar.node.firstChild as HTMLImageElement;
      this.content.backdrop.style.backgroundImage = `url("${img.src}")`;
    });

    const title = await wrapPeerTitle({
      peerId: chatId.toPeerId(true),
      dialog: false,
      onlyFirstName: false,
      plainText: false
    });

    this.topbar.title.append(title);

    (document.getElementById('page-chats') as HTMLDivElement).prepend(this.root);
    requestAnimationFrame(() => {
      this.root.classList.add('active');
    });

    const streamChannels =
      await rootScope.managers.apiManager.invokeApi('phone.getGroupCallStreamChannels', {
        call: this.call
      });

    const channel = streamChannels.channels[0];
    const source = new LiveStreamSource(this.call, channel, groupCallFull.stream_dc_id, this.video);

    source.onStartCallback = () => {
      this.content.wrapper.classList.add('live');
    }

    // video.muted = true;
    this.video.src = source.url;
    this.video.play();
  }

  protected close() {
    this.root.classList.remove('active');
    setTimeout(() => {
      this.root.remove();
      this.video.src = '';

      if(this.call) {
        this.managers.apiManager.invokeApi('phone.leaveGroupCall', {
          call: this.call,
          source: 0
        });
      }
    }, 200);
  }
}
