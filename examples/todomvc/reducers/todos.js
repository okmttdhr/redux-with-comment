import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes';

const initialState = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}];

export default function todos(state = initialState, action) {
  switch (action.type) {
  case ADD_TODO:
    return [{
      // idに関しては、これ以外にも精製方法は理想なので、詳細はパス
      id: state.reduce(
        // Math.max([value1[,value2[, ...]]]) 引数として与えた複数の数の中で最大の数を返します
        (maxId, todo) => Math.max(todo.id, maxId), -1
      ) + 1,
      completed: false,
      text: action.text
    }, ...state];

  case DELETE_TODO:
    // 与えられた callback 関数を配列の各要素に対して一度ずつ呼び出し、callback が真の値を返したすべての値からなる新しい配列を生成します。
    return state.filter(todo =>
      todo.id !== action.id
    );

  case EDIT_TODO:
    return state.map(todo =>
      todo.id === action.id ?
        Object.assign({}, todo, { text: action.text }) :
        todo
    );

  case COMPLETE_TODO:
    return state.map(todo =>
      todo.id === action.id ?
        Object.assign({}, todo, { completed: !todo.completed }) :
        todo
    );

  case COMPLETE_ALL:

    // すべてが完了しているかをチェックしている。
    const areAllMarked = state.every(todo => todo.completed);

    return state.map(todo => Object.assign({}, todo, {
      // ひとつでも未完了のタスクがあれば、areAllMarkedはfalseになるはずなので、completedはtrueになる
      // すべてのタスクが完了していれば、areAllMarkedはtrueになるはずなので、completedはfalseになる
      completed: !areAllMarked
    }));

  case CLEAR_COMPLETED:
    // 与えられた callback 関数を配列の各要素に対して一度ずつ呼び出し、callback が真の値を返したすべての値からなる新しい配列を生成します。
    return state.filter(todo => todo.completed === false);

  default:
    return state;
  }
}
