const { CloudEvent, HTTP } = require('cloudevents');
const translate = require('google-translate-api-x');

// CloudEvent response defaults
const defaults = {
  source: "ksvc:translate",
  type: "knative.function.translation",
}

// Our handler function, invoked with a CloudEvent
const handle = async (_, event) => {
  if (!event || !event.data) return
  const data = event.data;

  if (data.lang === "en") {
    return HTTP.binary(new CloudEvent({
      ...defaults,
      data: data.text
    }));
  } else {
    const res = await translate(data.text, {to: 'en'});
    return HTTP.binary(new CloudEvent({
        ...defaults,
        data: {
          from: data.text,
          text: res.text,
        }
      }));   
  }

  
};

module.exports = { handle };
