import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_REDDIT = 'SELECT_REDDIT';
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';

// reddit: reactjs か frontend が渡ってくる
export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  };
}

// postsを一度無効にして、更新できる状態にする
export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  };
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

function fetchPosts(reddit) {
  return dispatch => {

    // stateを、リクエストを投げている状態に更新
    dispatch(requestPosts(reddit));

    // すぐさまfetch開始
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      // responseをjson化
      .then(response => response.json())
      // データを取得できたら、stateを、レスポンスを受け取った状態に更新
      .then(json => dispatch(receivePosts(reddit, json)));
  };
}

function shouldFetchPosts(state, reddit) {

  // postsByRedditは、
  // postsByReddit: { reactjs: {ポスト}, frontend: {ポスト}}
  // な構成。
  const posts = state.postsByReddit[reddit];

  // ポストが現状なければ更新する必要がある
  if (!posts) {
    return true;
  }

  // `更新中`は更新しない
  if (posts.isFetching) {
    return false;
  }

  // postsが無効になっているときは更新できる
  return posts.didInvalidate;
}

export function fetchPostsIfNeeded(reddit) {

  // Motivation:
    // The inner function receives the store methods dispatch and getState() as parameters.
  return (dispatch, getState) => {

    console.log('shouldFetchPosts:'+shouldFetchPosts(getState(), reddit));

    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit));
    }
  };
}
