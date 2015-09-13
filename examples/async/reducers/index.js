import { combineReducers } from 'redux';
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions';

// reactjs か frontend かを選択。
// ここが state.selectedReddit になる。
function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_REDDIT:
    return action.reddit;
  default:
    return state;
  }
}

// 表示するポストのデータをいい感じに Object.assign して返す。
  // なぜ postsByReddit と切り分けたのかなぞ。別に特別なことやってないし。同じでよかったのでは。
  // itemsに実際のポストの情報が入る
function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {

  // 無効時、リクエスト時、受信時
  // をわけていて、
  // isFetchingやdidInvalidateを更新している。
  switch (action.type) {

  case INVALIDATE_REDDIT:
    return Object.assign({}, state, {
      didInvalidate: true
    });

  // リクエストを投げている状態
  case REQUEST_POSTS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });

  // データをjsonに変換し、受け取った後の状態。
  case RECEIVE_POSTS:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.posts,
      lastUpdated: action.receivedAt
    });
  default:
    return state;
  }
}

// 取得したポストをstateにいれる
function postsByReddit(state = { }, action) {
  switch (action.type) {
  case INVALIDATE_REDDIT:
  case RECEIVE_POSTS:
  case REQUEST_POSTS:
    return Object.assign(
      {},
      state,
      // state.reactjs と state.frontend がある。
      {[action.reddit]: posts(state[action.reddit], action)}
    );
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
