import { useState, useEffect } from "react";
import { Container, Button, Table, Heading } from "./styled";
import { doAjax } from "../util";
import Spinner from "./Spinner";

export default function CreditCheck(props) {
  const { state, setState } = props;
  const { status, credits, type, text, sandbox } = state;
  console.log("sandbox", sandbox);
  const [poll, setPoll] = useState(0);
  const scan_id = state.scan_id;

  useEffect(() => {
    let pollXHR;
    if (poll) {
      pollXHR = doAjax({
        data: {
          action: "pxq_pgck_get_check_credits_result",
          scan_id: scan_id
        },
        method: "GET",
        dataType: "json"
      })
        .done((data, textStatus, jqXHR) => {
          console.log("getcred", data);
          if (data.success && data.data && data.data.credits) {
            setState({ ...state, credits: data.data.credits, status: 2 });
          } else {
            setTimeout(() => setPoll(poll + 1), 1000);
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.log("getcred failed", poll, scan_id, textStatus);
          if ("abort" === textStatus) return;
          setState({ ...state, status: 3, error: "Ajax Error " + textStatus });
        })
        .always(() => {
          pollXHR = null;
        });
    }
    return () => {
      console.log("unmount in poll", !!pollXHR, poll, scan_id);
      if (pollXHR) pollXHR.abort();
    };
  }, [poll, scan_id]);

  useEffect(() => {
    console.log("cc use effect", type, text, scan_id);
    let xhr = doAjax({
      data: {
        action: "pxq_pgck_check_credits",
        text: "file" === type ? text.upload_name : text,
        type,
        sandbox: sandbox
      },
      method: "POST",
      dataType: "json"
    })
      .done((data, textStatus, jqXHR) => {
        console.log("credit checker success", data);
        if (data.success) {
          setState({ ...state, scan_id: data.data.scan_id });
          setPoll(1);
        } else {
          setState({ ...state, status: 3, error: data.data.message });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(
          "credcheck failed",
          scan_id,
          textStatus,
          errorThrown,
          jqXHR
        );
        if ("abort" === textStatus) return;
        setState({ ...state, status: 3, error: "Ajax Error " + textStatus });
      })
      .always(() => {
        xhr = null;
      });
    return () => {
      console.log("unmounting credit checker", !!xhr);
      if (xhr) xhr.abort();
    };
  }, []);

  let heading = null;
  if (1 === status) heading = <h3>Checking credits</h3>;
  else if (2 === status)
    heading = <Heading success>Credit check completed</Heading>;
  else heading = <Heading>Credit check failed</Heading>;
  console.log("credit check render");
  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }
  let input = "";
  if ("text" === type)
    input = text.slice(0, 6) + "..." + text.slice(text.length - 6);
  else if ("file" === type) input = text.org_name;
  else input = text;
  return (
    <div>
      <Container>
        {heading}
        {1 === status ? (
          <p>
            <Spinner />
          </p>
        ) : null}
        {3 === status ? (
          <p>
            <strong>Reason:</strong> {state.error}
          </p>
        ) : null}
        <Table>
          <tbody>
            <tr>
              <th>Type</th>
              <td>{"url" === type ? "URL" : capitalize(type)}</td>
            </tr>
            <tr>
              <th>Input</th>
              <td>{input}</td>
            </tr>
            <tr>
              <th>Sandbox mode</th>
              <td>
                {true === sandbox ? (
                  "On"
                ) : (
                  <span style={{ color: "red" }}>Off</span>
                )}
              </td>
            </tr>
            {2 === status ? (
              <tr>
                <th>Plagiarism check {sandbox ? "expected" : ""} cost</th>
                <td>{credits} credits</td>
              </tr>
            ) : null}
          </tbody>
        </Table>
        {sandbox ? (
          <div>
            <small>
              Sandbox mode shows expected cost.
              <br />
              No credit is charged in sandbox mode.
            </small>
          </div>
        ) : null}
      </Container>
      <Button
        onClick={() => {
          if (1 === status) {
            if (
              window.confirm(
                "Currently, credit check is in progress.\nAre you sure you want to cancel it and restart?"
              )
            ) {
              setPoll(0);
              setState({ ...state, step: 1, status: 1 });
            }
          } else setState({ ...state, step: 1, status: 1 });
        }}
      >
        Restart
      </Button>

      <Button
        onClick={() => {
          if (
            window.confirm(
              `Plagiarism check will cost you ${
                sandbox ? "0 credits b/c sandbox is on" : credits + " credit(s)"
              }.\nAre you sure you want to continue?`
            )
          )
            setState({ ...state, step: 3, status: 1, export: false, pdf: "" });
        }}
        disabled={2 === status ? false : true}
      >
        Check plagiarism
      </Button>
    </div>
  );
}
