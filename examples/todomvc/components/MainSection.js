import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
};

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    // フィルターをstateに定義している
    this.state = { filter: SHOW_ALL };
  }

  // 完了したタスクを全クリア(削除)する関数
  handleClearCompleted() {
    // array.some(callback[, thisObject]);
      // 引数
      // callback
      // 各要素に対してテストを実行する関数。
      // thisObject
      // callback を実行するときに this として使用するオブジェクト。
        // some は、与えられた callback 関数を、配列に含まれる各要素に対して一度ずつ、
        // callback が真の値を返す要素が見つかるまで呼び出します。
        // 真の値を返す要素が見つかると、some メソッドはただちに true を返します。
        // 見つからなかった場合、some は false を返します。
    const atLeastOneCompleted = this.props.todos.some(todo => todo.completed);
    if (atLeastOneCompleted) {
      this.props.actions.clearCompleted();
    }
  }

  // <Footer>から、現在のフィルターが渡ってくるので、
  // それをstateにせっとしてやる。
  handleShow(filter) {
    this.setState({ filter });
  }

  renderToggleAll(completedCount) {
    const { todos, actions } = this.props;
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               onChange={actions.completeAll} />
      );
    }
  }

  renderFooter(completedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    // 完了していないtodo数を計算している
    const activeCount = todos.length - completedCount;

    if (todos.length) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted.bind(this)}
                onShow={this.handleShow.bind(this)} />
      );
    }
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    // todos を、TODO_FILTERS.SOME_FUNCTION の条件に合うものにフィルタリングする
    const filteredTodos = todos.filter(TODO_FILTERS[filter]);

    // todosをまわして、
    // todo.completedがtrueならば、previousValueに1ずつ+してゆく。
    // 0は初期値。
      // なんでこんなめんどくさいことしてるんだろ。
        // 参考↓
        // array.reduce(callback(previousValue, currentValue, index, array)[, initialValue]);
    const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    );

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            // propsで渡された、todosとactionsを伝播する。
            <TodoItem key={todo.id} todo={todo} {...actions} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    );
  }
}

MainSection.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
