const virtualAlexa = require("virtual-alexa");
let alexa = null;

beforeAll(() => {
  alexa = virtualAlexa.VirtualAlexa.Builder()
    .handler("./index.handler")
    .interactionModelFile("../../models/en-GB.json")
    .create();
  alexa.dynamoDB().mock();
});

it('should ask "What would you like to add to your shopping list" when the skill is opened', done => {
  alexa.launch().then(payload => {
    console.log("Output speech: " + payload.response.outputSpeech.ssml);
    expect(payload.response.outputSpeech.ssml).toContain(
      "What would you like to add to your shopping list?"
    );
    done();
  });
});

it("should confirm what items have been added to the database", done => {
  alexa.utter("add two of lemons").then(payload => {
    console.log("Output speech: " + payload.response.outputSpeech.ssml);
    expect(payload.response.outputSpeech.ssml).toContain(
      "I've added two lemons to the list"
    );
    done();
  });
});

//for the test below - assert that the save call to persistent storage has been called

it("should add items to dynamoDB upon exiting the skill", done => {
  alexa.utter("add two of lemons").then(payload => {
    console.log("Output speech: " + payload.response.outputSpeech.ssml);
    expect(payload.response.outputSpeech.ssml).toContain(
      "I've added two lemons to the list"
    );
    done();
  });
});
