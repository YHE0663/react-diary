import React, { useCallback, useReducer, useEffect, useMemo, useRef } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
// import Lifecycle from './Lifecycle';
// import OptimizeTest from './OptimizeText';

// https://jsonplaceholder.typicode.com/comments

const reducer = (state, action) => {
  switch(action.type) {
    case 'INIT': {
      return action.data // 새로운 state가 된다.
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state]
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) => it.id === action.targetId ? {...it, content: action.newContent} : it)
    }
    default :
    return state;
  }
}

export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

const App = () => {
  // useReducer 사용으로 주석 처리(복잡한 상태 관리 로직 분리하기)
  // const [data, setData] = useState([]);
  const [data, dispatch] = useReducer(reducer, []);

  const dateId = useRef(0);

  const getData = async() => {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments").then((res) => res.json());
    
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dateId.current++
      }
    });

    dispatch({type: "INIT", data: initData})
    // setData(initData);
  };

  useEffect(() => {
    getData();
  },[]);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: { author, content, emotion, id: dateId.current}
    })
    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dateId.current
    // };
    // useRef(0)의 값을 1씩 증가를 해줘야 하기 때문
    dateId.current += 1;
    // 원래 data에 새로운 newItem을 이어 붙힌다.   
    // setData((data) => [newItem, ...data])
  }, []);

  const onRemove = useCallback((targetId) => {
    // 한 개의 일기장을 삭제해도 전체 렌더 -> 해결: useCalback
    // const newDiaryList = data.filter((it) => it.id !== targetId);
    // setData(newDiaryList)
    // setData((data) => data.filter((it) => it.id !== targetId));

    dispatch({type: "REMOVE", targetId})
  }, [])

  const onEdit = useCallback((targetId, newContent) => {
    // setData(
    //   data.map((it) => it.id === targetId ? {...it, content: newContent} : it)
    // )
    // setData((data) => data.map((it) => it.id === targetId ? {...it, content: newContent} : it))

    dispatch({type: "EDIT", targetId, newContent})
  }, [])

  // useMemo를 사용하는 이유는 App컴포넌트가 재생성이 될 때 다시 재생성이 되는걸 막기 위해
  const memoizedDispatches = useMemo(() => {
    return {onCreate, onRemove, onEdit}
  }, []);

  // useMemo는 콜백 하는 값을 리턴 하여 getDiaryAnalysis 값을 리턴 받는거라 함수로 사용 안하고 값으로 사용한다.
  const getDiaryAnalysis = useMemo(
    () => {
      const goodCount = data.filter((it) => it.emotion >= 3).length;
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return {
        goodCount,
        badCount,
        goodRatio
      }
    }, [data.length] // data.length가 변환 하지 않고서는 계산하지 않고 반환 한다.
  )

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기: {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수: {badCount}</div>
          <div>기분 좋은 일기 비율: {goodRatio}</div>
          <DiaryList onRemove={onRemove} onEdit={onEdit}/>
        </div>
        </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};
export default App;


/**
 * Memoization
 * 이미 계산 해 본 연산 결과를 기억 해 두었다가
 * 동일한 계산을 시키면, 다시 연산하지 않고 기억 해 두었던 데이터를 반환 시키게 하는 방법(이미 푼 문제는 바로 답이 보이는 것과 유사)
 * -> Memoization을 이용한 연산 과정 최적화
 */


/**
 * Context 생성
 * const MyContext = React.createContext(defaultValue);
 * 
 * Context Provider를 통한 데이터 공급
 * <MyContext.Provider value={전역으로 전달하고자 하는 값}>
 *  {이 Context안에 위치할 자식 컴포넌트들}
 * </MyContext.Provider>
 */