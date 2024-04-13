const mailTemplate = text => {
	return `<html dir="rtl" lang="fa">
  <head>
    <meta charset="utf-8" />
    <title>بازیابی رمز عبور</title>
    <style>
      body {
        font-family: sans-serif;
        overflow: hidden;
        background-color: #f4f4f4;
      }
      .container {
        width: 100%;
        height: 100%;
        padding: 20px;
        background-color: #f4f4f4;
        text-align: center;
      }
      .email {
        width: 80%;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
      }
      .email-header {
        text-align: center;
      }
      .email-body {
        padding: 5px;
      }
      .email-body p {
        font-size: 1.25rem;
      }
      .email-body div a {
        background-color: royalblue;
        display: inline-block;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        margin-top: 20px;
      }
      .email-footer{
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="email">
        <div class="email-header">
          <h1>فروشگاه عطن 🏪</h1>
        </div>
        <div class="email-body">
          <h2>سلام کاربر گرامی 👋🏻</h2>
          <p>از طریق لینک زیر میتونی رمز عبور خودت رو عوض کنی</p>
          <div>
            ${text}
          </div>
        </div>
        <div class="email-footer"><p><img width="170px" src="cid:logo" alt="Ali nazari"></p></div>
      </div>
    </div>
  </body>
</html>`;
};
module.exports = mailTemplate;
