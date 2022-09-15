import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
import { Table } from "../styled";
import { doAjax } from "../../util";

export default function FileInput(props) {
  const { state, setState } = props;
  const { rawFile, text } = state;
  const [localStatus, setLocalStatus] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const ref = React.createRef();
  console.log(rawFile, text);
  useEffect(() => {
    setState({ ...state, text: rawFile });
  }, []);

  const handleChange = (e) => {
    var formData = new FormData();
    formData.append("action", "pxq_pgck_upload_file");
    formData.append("pxq_pgck", ref.current.files[0]);
    doAjax({
      data: formData,
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false,
      beforeSend: function () {
        setLocalStatus(1);
      }
    })
      .done((data, textStatus, jqXHR) => {
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            rawFile: data.data,
            text: data.data
          });
          setLocalStatus(2);
        } else {
          setState({
            ...state,
            rawFile: null,
            text: null
          });
          setErrorMsg(data.data.message);
          setLocalStatus(3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("fail", textStatus);
        setLocalStatus(3);
        setErrorMsg("Ajax error: " + textStatus);
      });
  };
  let progress = "";
  if (1 === localStatus) {
    progress = (
      <span>
        Uploading file... <Spinner />
      </span>
    );
  } else if (2 === localStatus) {
    progress = (
      <span style={{ color: "green" }}>
        {" "}
        <strong>{`${rawFile.org_name}`}</strong> successfully uploaded
      </span>
    );
  } else if (3 === localStatus) {
    progress = (
      <span
        style={{ color: "red" }}
      >{`Failed to upload file. ${errorMsg}.`}</span>
    );
  }
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>
        <label
          htmlFor="pxq_pgck_file_input"
          style={{
            cursor: "pointer"
          }}
        >
          Please upload a file to check plagiarism
        </label>{" "}
      </p>
      {0 === localStatus && rawFile ? (
        <p>
          {" "}
          Previously uploaded file is <strong>{`${rawFile.org_name}`} </strong>
        </p>
      ) : null}
      <p>
        <input
          id="pxq_pgck_file_input"
          type="file"
          ref={ref}
          onChange={handleChange}
        />
      </p>
      <p>{progress}</p>
    </div>
  );
}
