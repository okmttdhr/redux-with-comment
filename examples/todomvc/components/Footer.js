import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

// renderFilterLinkに使われている。単なるテキスト用オブジェクト
const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
};

class Footer extends Component {
  renderTodoCount() {
    const { activeCount } = this.props;
    // activeCount === 1 の式によって、単数か複数かを判別しているだけ
    const itemWord = activeCount === 1 ? 'item' : 'items';

    return (
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
    );
  }

  // 引数filterには、
  // SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED
  // の3つのどれかがmapされはいってくる。
  renderFilterLink(filter) {
    // テキストを、FILTER_TITLESオブジェクトから取得している
    const title = FILTER_TITLES[filter];

    // ↓は
    // var selectedFilter = this.props.filter;
    // var onShow = this.props.onShow;
    // と同じ
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <a className={classnames({ selected: filter === selectedFilter })}
         style={{ cursor: 'hand' }}
         // propsの onShow(= this.handleShow.bind(this)) が実行される
         onClick={() => onShow(filter)}>
        {title}
      </a>
    );
  }

  renderClearButton() {
    const { completedCount, onClearCompleted } = this.props;
    if (completedCount > 0) {
      return (
        <button className="clear-completed"
                onClick={onClearCompleted} >
          Clear completed
        </button>
      );
    }
  }

  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          // SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETEDの3つをmapして、フィルターを表示
          {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter =>
            <li key={filter}>
              {this.renderFilterLink(filter)}
            </li>
          )}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }
}

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired
};

export default Footer;
