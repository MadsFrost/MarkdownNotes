import React from "react";
import { Note, getNotes, updateNotes, getColor, setColor as setStorageColor, initStorage } from "./utils/Storage";
import { HashRouter, Routes, Route } from "react-router-dom";
import ExtendedEditor from "./views/ExtendedEditor/ExtendedEditor";
import Overview from "./views/Overview";
import useGlobalDOMEvents from "./hooks/useGlobalDOMEvents";
import CommandInput from "./components/CommandInput";
export default function App() {
  initStorage();
  fetch('http://localhost/api/v1/login/access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "username": "user@example.com",
      "password": "string"
    })
  }).then(response => console.log(response.json()));
  const initialNotes = getNotes();
  const defaultColor = getColor();
 
  if (!defaultColor) {
    setStorageColor('light')
  }
  const [notes, setNotes] = React.useState<Note[]>(initialNotes ? initialNotes : []);
  const [color, setColor] = React.useState<'dark'|'light'>(defaultColor);
  const [command, setCommand] = React.useState(false);
  React.useEffect(() => {
    color === 'dark' ? document.getElementById("root").classList.add('dark')
        :
        document.getElementById("root").classList.remove("dark");
  }, [color])
  const [currentNote, setCurrentNote] = React.useState<Note>(notes && notes[0]);

  React.useEffect(() => {
    if (currentNote) {
      updateInternalNotes(notes ? [...notes.filter(note => note?.filename !== currentNote?.filename), currentNote] : []);
    }
  },[currentNote]);

  const updateInternalNotes = (notes: Note[]) => {
    updateNotes(notes);
    setNotes(notes);
  }

  const updateColor = (color: 'dark'|'light') => {
    setColor(color);
    setStorageColor(color);
  }

  const openNote = (note: Note) => {
    setCurrentNote(note);
  }

  const closeCommand = () => {
    setCommand(false);
    document.getElementById('editor-text');
  }

  useGlobalDOMEvents({ keydown(e: KeyboardEvent) {
    if ((e.key === 'p') && (e.ctrlKey || e.metaKey)) {
      setCommand(true);
    }
  }})

  useGlobalDOMEvents({ keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setCommand(false);
    }
  }})

  return (
        <div className={color === 'dark' ? 'app dark:bg-test' : 'app'} data-color-mode={color}>
          <span className={'fixed z-10 bottom-0 right-0 p-2 text-black dark:text-white'} onClick={() => updateColor(color === 'dark' ? 'light' : 'dark')}>{color}</span>
          <HashRouter>
            {command && <div className='overlay flex flex-col items-center justify-center'>
              <CommandInput
                currentNote={currentNote}
                openNote={openNote} 
                updateNotes={updateInternalNotes}
                notes={notes}
                close={closeCommand}
              />
            </div>}
            <Routes>
              <Route path={"/"} element={<Overview notes={notes} updateNotes={updateInternalNotes} openNote={openNote} />} />
              <Route path={"/edit"} element={<ExtendedEditor currentNote={currentNote} updateNote={openNote} />} />
            </Routes>
          </HashRouter>
        </div>
    )
}