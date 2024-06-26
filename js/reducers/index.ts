import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { PreviewFile, Config } from '../types/global';
import { Statuses, Game, Media } from '../types/api';
import customTheme from '../theme';
import { Theme } from '@mui/material';
type Action = ActionType<typeof actions>;

export type DialogState = {
  /** ダイアログ表示 */
  show: boolean;
  /** 確認ダイアログか否か */
  confirm: boolean;
  /** ダイアログ種別 */
  type: 'info' | 'warning' | 'error';
  /** 簡潔に表すメッセージ */
  message: string;
  /** テキストボックスとかで表示したい詳細 */
  detail: string;
};

export type GlobalState = {
  status: 'initialzing' | 'uploading' | 'posting' | 'ok' | 'error';
  /** 通知欄 */
  notify: {
    /** 表示可否 */
    show: boolean;
    /** 色 */
    type: 'info' | 'warning' | 'error';
    /** メッセージ */
    message: string;
    /** 手動で閉じられるか */
    closable: boolean;
  };
  /** Discord */
  discord: {
    username: string | null;
    token: string | null;
  };
  /** ダイアログ */
  dialog: DialogState;
  /** ツイート一覧 */
  twitterTimeline: {
    /** 自分の結果 */
    user: Statuses[];
    /** メンションの結果 */
    mention: Statuses[];
    /** ハッシュタグで検索した結果 */
    hash: Statuses[];
  };
  /** プレビュー */
  mediaPreview: {
    isShow: boolean;
    media: Media[];
    showIndex: number;
  };
  /** Twitterに投稿する内容 */
  post: {
    text: string;
    media: {
      media_id_string: string;
      file: PreviewFile;
    }[];
    /** 返信先のツイートID */
    in_reply_to_status_id: Statuses | null;
    /** 引用RTで引用するツイート */
    attachment_tweet: Statuses | null;
  };
  /** ゲーム情報 */
  game: Game[];
  /** 設定ファイルの内容 */
  config: Config;
  /** テーマ設定 */
  theme: {
    mode: 'light' | 'dark';
    theme: Theme;
  };
};

export type RootState = {
  reducer: GlobalState;
};

const initial: GlobalState = {
  status: 'ok',
  // 通知欄
  notify: {
    show: false,
    type: 'info',
    message: '',
    closable: true,
  },
  dialog: {
    show: false,
    confirm: false,
    type: 'info',
    message: '',
    detail: '',
  },
  discord: {
    username: null,
    token: null,
  },
  twitterTimeline: {
    user: [],
    mention: [],
    hash: [],
  },
  mediaPreview: {
    isShow: false,
    media: [],
    showIndex: 0,
  },
  post: {
    text: '',
    media: [],
    in_reply_to_status_id: null,
    attachment_tweet: null,
  },
  game: [],
  config: {
    api: {
      twitterBase: '',
      runner: '',
      webhook: '',
    },
    twitter: {
      isAllowDeleteTweet: false,
    },
    discord: {
      enable: true,
      config: {
        baseUrl: '',
        clientId: '',
        clientSecret: '',
        redirectUrl: '',
        scope: '',
      },
      guild: '',
      roles: [],
      users: [],
    },
    tweetTemplate: [],
    tweetFooter: '',
    link: [],
    headerLink: [],
  },
  theme: {
    mode: 'light',
    theme: customTheme('light'),
  },
};

const reducer = (state: GlobalState = initial, action: Action): GlobalState => {
  switch (action.type) {
    case getType(actions.updateStatus): {
      return { ...state, status: action.payload };
    }
    case getType(actions.storeConfig): {
      return { ...state, config: action.payload };
    }
    case getType(actions.changeNotify): {
      return { ...state, notify: { ...action.payload } };
    }
    case getType(actions.closeNotify): {
      return { ...state, notify: { ...state.notify, show: false } };
    }
    case getType(actions.changeDialog): {
      if (action.payload.show === false) {
        return { ...state, dialog: initial.dialog };
      } else {
        return { ...state, dialog: { ...state.dialog, ...action.payload } };
      }
    }
    case getType(actions.closeDialog): {
      return { ...state, dialog: { ...initial.dialog } };
    }
    // ツイートを取得
    case getType(actions.updateTweetList): {
      return {
        ...state,
        twitterTimeline: {
          ...state.twitterTimeline,
          [action.payload.type]: action.payload.list,
        },
      };
    }
    case getType(actions.updateTweetText): {
      return {
        ...state,
        post: {
          ...state.post,
          text: action.payload,
        },
      };
    }
    case getType(actions.addReplyTweet): {
      return {
        ...state,
        post: {
          ...state.post,
          in_reply_to_status_id: action.payload,
        },
      };
    }
    case getType(actions.deleteReplyTweet): {
      return {
        ...state,
        post: {
          ...state.post,
          in_reply_to_status_id: null,
        },
      };
    }
    case getType(actions.addAttachUrl): {
      return {
        ...state,
        post: {
          ...state.post,
          attachment_tweet: action.payload,
        },
      };
    }
    case getType(actions.deleteAttachUrl): {
      return {
        ...state,
        post: {
          ...state.post,
          attachment_tweet: null,
        },
      };
    }
    case getType(actions.storeMedia): {
      return {
        ...state,
        post: {
          ...state.post,
          media: action.payload,
        },
      };
    }
    case getType(actions.storeDiscordUserName): {
      return {
        ...state,
        discord: {
          ...state.discord,
          username: action.payload,
        },
      };
    }
    case getType(actions.updateGameList): {
      return {
        ...state,
        game: action.payload,
      };
    }
    case getType(actions.updateTheme): {
      localStorage.setItem('theme', action.payload);
      return {
        ...state,
        theme: {
          mode: action.payload,
          theme: customTheme(action.payload),
        },
      };
    }
    case getType(actions.showMedia): {
      return {
        ...state,
        mediaPreview: {
          isShow: true,
          showIndex: action.payload.index,
          media: action.payload.media,
        },
      };
    }
    case getType(actions.closeMedia): {
      return {
        ...state,
        mediaPreview: {
          isShow: false,
          showIndex: 0,
          media: [],
        },
      };
    }
    case getType(actions.changeMediaIndex): {
      return {
        ...state,
        mediaPreview: {
          ...state.mediaPreview,
          showIndex: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ reducer });
