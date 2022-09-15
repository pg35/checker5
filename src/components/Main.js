import { useState, useEffect } from "react";
import { Container, Button, Label, Table } from "./styled";
import TextInput from "./inputs/TextInput";
import FileInput from "./inputs/FileInput";
import URLInput from "./inputs/URLInput";

export default function Main(props) {
  const { state, setState } = props;
  const { type, text, sandbox } = state;

  const handleTypeChange = (e) =>
    setState({
      ...state,
      type: e.target.value
    });

  const allTypes = {
    text: "Enter text",
    file: "Upload file",
    url: "Enter URL"
  };
  const typeElems = Object.keys(allTypes).map((k) => (
    <Label key={k}>
      <input
        type="radio"
        name="type"
        value={k}
        checked={k === type}
        onChange={handleTypeChange}
      />{" "}
      {allTypes[k]}
    </Label>
  ));

  let Comp = TextInput;
  if ("file" === type) Comp = FileInput;
  else if ("url" === type) Comp = URLInput;

  return (
    <div>
      <div style={{ textAlign: "left" }}>{typeElems}</div>
      <Container>
        <Comp state={state} setState={setState} />
        <p style={{ textAlign: "left" }}>
          <label>
            <input
              type="checkbox"
              checked={sandbox}
              onChange={(e) =>
                setState({
                  ...state,
                  sandbox: !sandbox
                })
              }
            />{" "}
            Enable sandbox mode
          </label>
        </p>
      </Container>
      <Button
        onClick={() =>
          props.setState({
            ...state,
            step: 2,
            status: 1,
            scan_id: 0,
            credits: 0
          })
        }
        disabled={!text}
      >
        Next
      </Button>
    </div>
  );
}
