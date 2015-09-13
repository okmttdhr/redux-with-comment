import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  // Invoked once, only on the client (not on the server),
  // immediately after the initial rendering occurs.
  componentDidMount() {
    const { dispatch, selectedReddit } = this.props;

    // 1回めだからポストはない。
    // そのため shouldFetchPosts はtrueを返す。
    dispatch(fetchPostsIfNeeded(selectedReddit));
  }

  // Propが更新される時に呼ばれる
  componentWillReceiveProps(nextProps) {

    // props.selectedReddit が更新されている場合、
    // action (ここではfetchPostsIfNeeded) を実行。
      // actionといいつつ、actionのように振る舞うredux-thunkなメソッド
    if (nextProps.selectedReddit !== this.props.selectedReddit) {

      const { dispatch, selectedReddit } = nextProps;

      // shouldFetchPosts
        // 初期状態のみ、postがないのでtrueを返す。
        // 切り替えだけの時ははfalseを返す。
      dispatch(fetchPostsIfNeeded(selectedReddit));

    }
  }

  // reactjs, frontend をきりかえるだけで、ポストの更新はしない
    // nextReddit: selectのvalueが渡ってくる
  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit));
  }

  // 更新処理
  handleRefreshClick(e) {
    e.preventDefault();

    const { dispatch, selectedReddit } = this.props;

    // postsを一度無効にして、更新できる状態にする
    dispatch(invalidateReddit(selectedReddit));

    // 更新処理。
    // invalidateRedditをしているため shouldFetchPosts はtrueを返す。
    dispatch(fetchPostsIfNeeded(selectedReddit));
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props;
    return (
      <div>
        <Picker
          // rootReducerから作成されるstate
          value={selectedReddit}

          // actionを発火
          onChange={this.handleChange}

          // selectのoptionsになる
          options={['reactjs', 'frontend']} />

        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>

        // 取得中
        {isFetching && posts.length === 0 &&
          <h2>Loading...</h2>
        }

        // (取得終了にもかかわらず)データがない時。
        {!isFetching && posts.length === 0 &&
          <h2>Empty.</h2>
        }

        // ポスト。
        // 取得中はスタイルを変更
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

// connectでpropsを設置。
function mapStateToProps(state) {
  const { selectedReddit, postsByReddit } = state;

  // 以下と同じ。
    // var _ref = postsByReddit[selectedReddit] || {
    //   isFetching: true,
    //   items: []
    // };
    // var isFetching = _ref.isFetching;
    // var lastUpdated = _ref.lastUpdated;
    // var posts = _ref.items;
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  };

  return {
    selectedReddit,

    // reducerにpostsがあるから混乱するが、実際には、
    // postsByReddit[selectedReddit]
    // がはいっている・・・。
    posts,

    isFetching,
    lastUpdated
  };
}

export default connect(mapStateToProps)(App);
