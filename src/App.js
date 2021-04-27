import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  // get value from local storage
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return [];
  }
}

const App = () => {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter a name')
    } else if (name && isEditing) {
      {
        setList(list.map((item) => {
          if (item.id === editId) {
            //change the title without changing id
            return { ...item, title: name };
          }
          //return the old item if the id is not matched
          return item;
        }))
        setName('');
        setEditId(null);
        setIsEditing(false);
        showAlert(true, 'success', 'item edited');
      }
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList(
        [...list, newItem]
      );
      setName('');
      showAlert(true, 'success', 'items added to the list');
    }
  }

  const deleteItem = (id) => {
    showAlert(true, 'danger', 'item is removed')
    setList(list.filter((item, index) => {
      return (item.id !== id);
    }))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    console.log(specificItem);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  }

  const clearList = () => {
    setList([]);
    showAlert(true, 'danger', 'empty list')
  }

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  useEffect(() => {
    // use json.stringify to send data to the server
    // store in local storage
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className='grocery' placeholder='eg. apples' value={name} onChange={(e) => setName(e.target.value)} />
          <button type='submit' className='submit-btn'>{isEditing ? 'Edit items' : 'Submit'}</button>
        </div>
      </form>
      {list.length > 0 &&
        <div className="grocery-container">
          <List deleteItem={deleteItem} editItem={editItem} list={list} />
          <button onClick={clearList} className='clear-btn'>
            clear items
        </button>
        </div>
      }

    </section>
  )
}

export default App;
