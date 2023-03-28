import React from "react";
import GeeTest from "react-geetest-v4";

export default function GeeTestPage() {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("handleSubmit", event);
  };

  const onSuccess = async (result: any) => {
    console.log("onSuccess: result: ", result);
    const res = await fetch("/api/geetest/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pass_token: result.pass_token,
        captcha_output: result.captcha_output,
        gen_time: result.gen_time,
        lot_number: result.lot_number,
      }),
    });
    console.log("onSuccess: validate: ", await res.json());
  };

  return (
    <form id={"form"} onSubmit={handleSubmit}>
      <div>
        <label htmlFor={"username"}>username:</label>
        <input className={"inp"} id={"username"} defaultValue={"用户名"} />
      </div>
      <br />
      <div>
        <label htmlFor={"password"}>password:</label>
        <input
          className={"inp"}
          id={"password"}
          type={"password"}
          defaultValue={"123456"}
        />
      </div>
      <br />
      <GeeTest
        captchaId={"5decacd0f70bf10222f6bb144f1278b9"}
        product={"popup"}
        protocol={"https://"}
        onSuccess={onSuccess}
      />
      <br />
      <div>
        <label htmlFor={"btn"}>Plugins:</label>
        <div id={"captcha"}>
          <div id={"btn"} className={"btn"}>
            Submit
          </div>
        </div>
        <br />
      </div>
      <br />
    </form>
  );
}
