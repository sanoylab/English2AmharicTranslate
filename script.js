class Messenger {
  constructor() {
    this.messageList = [];
    this.me = 1;
    this.onSend = (message) => console.log("Sent: " + message.text);
  }

  send(text = "") {
    if (this.validate(text)) {
      let message = {
        user: this.me,
        text: text,
        time: new Date().getTime(),
      };

      this.messageList.push(message);

      this.onSend(message);
    }
  }

  validate(input) {
    return !!input.length;
  }
}

class BuildHTML {
  constructor() {
    this.messageWrapper = "message-wrapper";
    this.circleWrapper = "circle-wrapper";
    this.textWrapper = "text-wrapper";

    this.meClass = "me";
    this.themClass = "them";
  }

  _build(text, who) {
    return `<div class="${this.messageWrapper} ${this[who + "Class"]}">
              <div class="${this.circleWrapper} animated bounceIn"></div>
              <div class="${this.textWrapper}">${text}</div>
            </div>`;
  }

  me(text) {
    return this._build(text, "me");
  }
}

$(document).ready(function () {
  let messenger = new Messenger();
  let buildHTML = new BuildHTML();
  var cors_api_url = "https://cors-anywhere.herokuapp.com/";

  let $input = $("#input");
  let $send = $("#send");
  let $content = $("#content");
  let $inner = $("#inner");



  const animateText = () => {
    setTimeout(() => {
      $content
        .find(".message-wrapper")
        .last()
        .find(".text-wrapper")
        .addClass("animated fadeIn");
    }, 350);
  }

  const scrollBottom = () => {
    $($inner).animate(
      {
        scrollTop: $($content).offset().top + $($content).outerHeight(true),
      },
      {
        queue: false,
        duration: "ease",
      }
    );
  }

  const buildSent = (message) => {
    console.log("sending: ", message.text);

    //$content.append(buildHTML.me(message.text));

    translate(message.text);
   
    animateText();

    scrollBottom();
  }

  const translate = (message) => {
    
    doCORSRequest(
      {
        method: "GET",
        url:
          "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=am&dt=t&q=" +
          message,
      },
      function printResult(result) {
       
       
        $content.append(buildHTML.me(result.match(/\"(.*?)\"/)[1]));



     

        // outputField.innerHTML = s;
      }
    );
  }
  const doCORSRequest = (options, printResult) => {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
      printResult(x.response || "");
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    x.send(options.data);
  }

  const sendMessage = () => {
    let text = $input.val();
    messenger.send(text);

    $input.val("");
    $input.focus();
  }

  messenger.onSend = buildSent;
  $input.focus();

  $send.on("click", function (e) {
    sendMessage();
  });

  $input.on("keydown", function (e) {
    let key = e.which || e.keyCode;

    if (key === 13) {
      // enter key
      e.preventDefault();

      sendMessage();
    }
  });
});
