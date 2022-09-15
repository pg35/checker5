import React, { useState, useEffect } from "react";
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
export default function URLInput(props) {
  const { state, setState } = props;
  const { rawUrl } = state;
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setState({ ...state, text: isValidUrl(rawUrl) ? rawUrl : "" });
  }, []);
  const handleChange = (e) => {
    var url = window.jQuery.trim(e.target.value).toLowerCase();
    const isValid = isValidUrl(url);
    setState({
      ...state,
      rawUrl: url,
      text: isValid ? url : ""
    });
    setErrorMsg(isValid ? "" : "Please enter a valid URL");
  };
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>
        <label
          htmlFor="pxq_pgck_url_input"
          style={{
            cursor: "pointer"
          }}
        >
          Please enter URL to check plagiarism
        </label>{" "}
      </p>
      <input
        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        id="pxq_pgck_url_input"
        type="url"
        value={rawUrl}
        onChange={handleChange}
        placeholder="https://somehost.com/page.html"
      />
      <div style={{ color: "red", marginTop: "5px" }}>{errorMsg}</div>
    </div>
  );
}
